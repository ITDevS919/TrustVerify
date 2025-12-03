import fs from 'fs';
import path from 'path';
import { storageMigrationService, StorageResult } from './storage-migration';
import pino from 'pino';
import { config } from '../config';

const logger = pino({
  name: 'kyc-storage',
  level: config.LOG_LEVEL || 'info'
});

// Simple file-based storage for MVP testing
const KYC_STORAGE_DIR = path.join(process.cwd(), 'kyc_submissions');
const KYC_METADATA_FILE = path.join(KYC_STORAGE_DIR, 'submissions.json');

// Ensure storage directory exists
if (!fs.existsSync(KYC_STORAGE_DIR)) {
  fs.mkdirSync(KYC_STORAGE_DIR, { recursive: true });
}

// Initialize metadata file if it doesn't exist
if (!fs.existsSync(KYC_METADATA_FILE)) {
  fs.writeFileSync(KYC_METADATA_FILE, JSON.stringify([], null, 2));
}

export interface KycSubmission {
  submissionId: string;
  userId: number;
  userEmail: string;
  userName: string;
  userPhone?: string;
  documentType: string;
  documentNumber?: string;
  frontImagePath: string;
  backImagePath?: string;
  selfieImagePath: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  // Admin review fields
  manualMatchScore?: number; // 0-100
  riskLevel?: 'low' | 'medium' | 'high';
  finalResult?: 'pass' | 'fail' | 'review';
  reviewNotes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  // User type for testing groups
  userType?: 'hr_candidate' | 'marketplace_seller' | 'ecommerce_customer' | 'beta_user';
}

export class KycStorageService {
  private getSubmissions(): KycSubmission[] {
    try {
      const data = fs.readFileSync(KYC_METADATA_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading KYC submissions:', error);
      return [];
    }
  }

  private saveSubmissions(submissions: KycSubmission[]): void {
    try {
      fs.writeFileSync(KYC_METADATA_FILE, JSON.stringify(submissions, null, 2));
    } catch (error) {
      console.error('Error saving KYC submissions:', error);
      throw error;
    }
  }

  async createSubmission(data: {
    userId: number;
    userEmail: string;
    userName: string;
    userPhone?: string;
    documentType: string;
    documentNumber?: string;
    frontImagePath: string;
    backImagePath?: string;
    selfieImagePath: string;
    userType?: string;
  }): Promise<KycSubmission> {
    const submissions = this.getSubmissions();
    
    const submission: KycSubmission = {
      submissionId: `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId,
      userEmail: data.userEmail,
      userName: data.userName,
      userPhone: data.userPhone,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      frontImagePath: data.frontImagePath,
      backImagePath: data.backImagePath,
      selfieImagePath: data.selfieImagePath,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      userType: data.userType as any,
    };

    submissions.push(submission);
    this.saveSubmissions(submissions);

    // Migrate to external storage if configured
    try {
      const storageResult: StorageResult = await storageMigrationService.migrateSubmission(submission);
      if (storageResult.success) {
        logger.info({ 
          submissionId: submission.submissionId, 
          provider: config.KYC_STORAGE_PROVIDER,
          recordId: storageResult.recordId 
        }, 'Submission stored to external storage');
      } else {
        logger.warn({ 
          submissionId: submission.submissionId,
          error: storageResult.error 
        }, 'Failed to store submission to external storage, kept in local storage');
      }
    } catch (error: any) {
      // Don't fail the submission if external storage fails
      logger.error({ 
        error, 
        submissionId: submission.submissionId 
      }, 'Error storing submission to external storage');
    }

    return submission;
  }

  async getSubmission(submissionId: string): Promise<KycSubmission | undefined> {
    const submissions = this.getSubmissions();
    return submissions.find(s => s.submissionId === submissionId);
  }

  async getAllSubmissions(): Promise<KycSubmission[]> {
    return this.getSubmissions();
  }

  async getPendingSubmissions(): Promise<KycSubmission[]> {
    const submissions = this.getSubmissions();
    return submissions.filter(s => s.status === 'pending' || s.status === 'reviewing');
  }

  async updateSubmissionReview(
    submissionId: string,
    data: {
      manualMatchScore?: number;
      riskLevel?: 'low' | 'medium' | 'high';
      finalResult?: 'pass' | 'fail' | 'review';
      reviewNotes?: string;
      reviewedBy: number;
    }
  ): Promise<KycSubmission | undefined> {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex(s => s.submissionId === submissionId);
    
    if (index === -1) {
      return undefined;
    }

    const submission = submissions[index];
    submission.manualMatchScore = data.manualMatchScore;
    submission.riskLevel = data.riskLevel;
    submission.finalResult = data.finalResult;
    submission.reviewNotes = data.reviewNotes;
    submission.reviewedBy = data.reviewedBy;
    submission.reviewedAt = new Date().toISOString();
    submission.status = data.finalResult === 'pass' ? 'approved' : 
                       data.finalResult === 'fail' ? 'rejected' : 
                       'reviewing';

    this.saveSubmissions(submissions);
    return submission;
  }

  async deleteSubmission(submissionId: string): Promise<boolean> {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex(s => s.submissionId === submissionId);
    
    if (index === -1) {
      return false;
    }

    const submission = submissions[index];
    
    // Delete associated image files
    try {
      if (fs.existsSync(submission.frontImagePath)) {
        fs.unlinkSync(submission.frontImagePath);
      }
      if (submission.backImagePath && fs.existsSync(submission.backImagePath)) {
        fs.unlinkSync(submission.backImagePath);
      }
      if (fs.existsSync(submission.selfieImagePath)) {
        fs.unlinkSync(submission.selfieImagePath);
      }
    } catch (error) {
      console.error('Error deleting submission files:', error);
    }

    submissions.splice(index, 1);
    this.saveSubmissions(submissions);
    return true;
  }

  // Export to CSV for admin review
  async exportToCSV(): Promise<string> {
    const submissions = this.getSubmissions();
    const headers = [
      'Submission ID',
      'User Name',
      'User Email',
      'User Phone',
      'User Type',
      'Document Type',
      'Document Number',
      'Submitted At',
      'Status',
      'Manual Match Score',
      'Risk Level',
      'Final Result',
      'Review Notes',
      'Reviewed At'
    ];

    const rows = submissions.map(s => [
      s.submissionId,
      s.userName,
      s.userEmail,
      s.userPhone || '',
      s.userType || '',
      s.documentType,
      s.documentNumber || '',
      s.submittedAt,
      s.status,
      s.manualMatchScore?.toString() || '',
      s.riskLevel || '',
      s.finalResult || '',
      s.reviewNotes || '',
      s.reviewedAt || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csv;
  }
}

export const kycStorage = new KycStorageService();

