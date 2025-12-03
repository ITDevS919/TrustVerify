// Storage migration service for moving KYC submissions to external storage
// Supports: Google Drive, Airtable, Firebase, or local file system

import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { KycSubmission } from './kyc-storage';
import pino from 'pino';

// Safe logger initialization - don't fail if config is not available
let logger: pino.Logger;
try {
  logger = pino({
    name: 'storage-migration',
    level: config?.LOG_LEVEL || 'info'
  });
} catch (error) {
  // Fallback logger if config fails
  logger = pino({
    name: 'storage-migration',
    level: 'info'
  });
}

export interface StorageConfig {
  provider: 'local' | 'googledrive' | 'airtable' | 'firebase';
  // Google Drive config
  googleDriveFolderId?: string;
  googleDriveSharedDriveId?: string; // For Shared Drives (Team Drives)
  googleServiceAccountKey?: string;
  // Airtable config
  airtableApiKey?: string;
  airtableBaseId?: string;
  airtableTableName?: string;
  // Firebase config
  firebaseProjectId?: string;
  firebaseServiceAccountKey?: string;
  firebaseCollectionName?: string;
  // Secure folder config
  secureFolderPath?: string;
  encryptFiles?: boolean;
}

export interface StorageResult {
  success: boolean;
  fileUrls?: string[];
  recordId?: string;
  error?: string;
}

export class StorageMigrationService {
  private config: StorageConfig;
  private googleDriveClient: any = null;
  private firebaseAdmin: any = null;
  private airtableBase: any = null;

  constructor() {
    this.config = {
      provider: (config.KYC_STORAGE_PROVIDER as any) || 'local',
      googleDriveFolderId: config.GOOGLE_DRIVE_FOLDER_ID,
      googleDriveSharedDriveId: config.GOOGLE_DRIVE_SHARED_DRIVE_ID,
      googleServiceAccountKey: config.GOOGLE_SERVICE_ACCOUNT_KEY,
      airtableApiKey: config.AIRTABLE_API_KEY,
      airtableBaseId: config.AIRTABLE_BASE_ID,
      airtableTableName: config.AIRTABLE_TABLE_NAME || 'KYC Submissions',
      firebaseProjectId: config.FIREBASE_PROJECT_ID,
      firebaseServiceAccountKey: config.FIREBASE_SERVICE_ACCOUNT_KEY,
      firebaseCollectionName: config.FIREBASE_COLLECTION_NAME || 'kyc_submissions',
      secureFolderPath: config.KYC_SECURE_FOLDER_PATH,
      encryptFiles: config.KYC_ENCRYPT_FILES,
    };

    // Initialize clients lazily when needed - don't block module loading
    // Use setImmediate to defer initialization to next event loop tick
    setImmediate(() => {
      this.initializeClients().catch(err => {
        logger.warn({ error: err }, 'Failed to initialize storage clients');
      });
    });
  }

  private async initializeClients(): Promise<void> {
    if (this.config.provider === 'googledrive' && this.config.googleServiceAccountKey) {
      try {
        // Resolve path relative to server directory or use as absolute path
        const keyPath = path.isAbsolute(this.config.googleServiceAccountKey)
          ? this.config.googleServiceAccountKey
          : path.resolve(process.cwd(), this.config.googleServiceAccountKey);
        
        // Check if file exists before reading
        if (!fs.existsSync(keyPath)) {
          logger.warn(`Google service account key file not found: ${keyPath} (resolved from: ${this.config.googleServiceAccountKey})`);
          return;
        }

        // @ts-ignore - Optional dependency, may not be installed
        const { google } = await import('googleapis');
        const serviceAccountKey = JSON.parse(
          fs.readFileSync(keyPath, 'utf-8')
        );
        
        const auth = new google.auth.GoogleAuth({
          credentials: serviceAccountKey,
          scopes: ['https://www.googleapis.com/auth/drive.file'],
        });
        
        this.googleDriveClient = google.drive({ version: 'v3', auth });
        logger.info('Google Drive client initialized');
      } catch (error: any) {
        if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
          logger.error('googleapis package not found. Install it with: npm install googleapis');
        } else if (error.code === 'ENOENT') {
          logger.error(`Google service account key file not found: ${this.config.googleServiceAccountKey}`);
        } else {
          logger.error({ error }, 'Failed to initialize Google Drive client');
        }
      }
    }

    if (this.config.provider === 'firebase' && this.config.firebaseServiceAccountKey) {
      try {
        // Resolve path relative to server directory or use as absolute path
        const keyPath = path.isAbsolute(this.config.firebaseServiceAccountKey)
          ? this.config.firebaseServiceAccountKey
          : path.resolve(process.cwd(), this.config.firebaseServiceAccountKey);
        
        // Check if file exists before reading
        if (!fs.existsSync(keyPath)) {
          logger.warn(`Firebase service account key file not found: ${keyPath} (resolved from: ${this.config.firebaseServiceAccountKey})`);
          return;
        }

        // @ts-ignore - Optional dependency, may not be installed
        const admin = await import('firebase-admin');
        
        if (!admin.apps.length) {
          const serviceAccount = JSON.parse(
            fs.readFileSync(keyPath, 'utf-8')
          );
          
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: `${this.config.firebaseProjectId}.appspot.com`,
          });
        }
        
        this.firebaseAdmin = admin;
        logger.info('Firebase Admin initialized');
      } catch (error: any) {
        if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
          logger.error('firebase-admin package not found. Install it with: npm install firebase-admin');
        } else if (error.code === 'ENOENT') {
          logger.error(`Firebase service account key file not found: ${this.config.firebaseServiceAccountKey}`);
        } else {
          logger.error({ error }, 'Failed to initialize Firebase Admin');
        }
      }
    }

    if (this.config.provider === 'airtable' && this.config.airtableApiKey && this.config.airtableBaseId) {
      try {
        // @ts-ignore - Optional dependency, may not be installed
        const Airtable = (await import('airtable')).default;
        this.airtableBase = new Airtable({ apiKey: this.config.airtableApiKey })
          .base(this.config.airtableBaseId);
        logger.info('Airtable client initialized');
      } catch (error: any) {
        if (error.code === 'MODULE_NOT_FOUND' || error.message?.includes('Cannot find module')) {
          logger.error('airtable package not found. Install it with: npm install airtable');
        } else {
          logger.error({ error }, 'Failed to initialize Airtable client');
        }
      }
    }
  }

  async migrateSubmission(submission: KycSubmission): Promise<StorageResult> {
    try {
      // Ensure clients are initialized before migration
      await this.initializeClients();

      switch (this.config.provider) {
        case 'googledrive':
          return await this.migrateToGoogleDrive(submission);
        case 'airtable':
          return await this.migrateToAirtable(submission);
        case 'firebase':
          return await this.migrateToFirebase(submission);
        case 'local':
        default:
          return await this.migrateToLocal(submission);
      }
    } catch (error: any) {
      logger.error({ error, submissionId: submission.submissionId }, 'Storage migration failed');
      return {
        success: false,
        error: error.message || 'Unknown error during migration',
      };
    }
  }

  private async migrateToLocal(submission: KycSubmission): Promise<StorageResult> {
    // If secure folder is configured, move files there
    if (this.config.secureFolderPath) {
      try {
        const secureDir = path.resolve(this.config.secureFolderPath);
        if (!fs.existsSync(secureDir)) {
          fs.mkdirSync(secureDir, { recursive: true });
        }

        const submissionDir = path.join(secureDir, submission.submissionId);
        if (!fs.existsSync(submissionDir)) {
          fs.mkdirSync(submissionDir, { recursive: true });
        }

        const files: string[] = [];
        
        // Move front image
        if (fs.existsSync(submission.frontImagePath)) {
          const destPath = path.join(submissionDir, 'front.jpg');
          fs.copyFileSync(submission.frontImagePath, destPath);
          files.push(destPath);
        }

        // Move back image if exists
        if (submission.backImagePath && fs.existsSync(submission.backImagePath)) {
          const destPath = path.join(submissionDir, 'back.jpg');
          fs.copyFileSync(submission.backImagePath, destPath);
          files.push(destPath);
        }

        // Move selfie
        if (fs.existsSync(submission.selfieImagePath)) {
          const destPath = path.join(submissionDir, 'selfie.jpg');
          fs.copyFileSync(submission.selfieImagePath, destPath);
          files.push(destPath);
        }

        // Save metadata
        const metadataPath = path.join(submissionDir, 'metadata.json');
        fs.writeFileSync(metadataPath, JSON.stringify(submission, null, 2));

        logger.info({ submissionId: submission.submissionId }, 'Files moved to secure folder');
        return { success: true, fileUrls: files };
      } catch (error: any) {
        logger.error({ error }, 'Failed to move files to secure folder');
        return { success: false, error: error.message };
      }
    }

    // Already stored locally, just return success
    return { success: true };
  }

  private async migrateToGoogleDrive(submission: KycSubmission): Promise<StorageResult> {
    if (!this.config.googleDriveFolderId || !this.config.googleServiceAccountKey) {
      logger.warn('Google Drive configuration incomplete, falling back to local storage');
      return { success: false, error: 'Google Drive configuration incomplete' };
    }

    if (!this.googleDriveClient) {
      logger.warn('Google Drive client not initialized, falling back to local storage');
      return { success: false, error: 'Google Drive client not initialized. Check logs for details.' };
    }

    try {
      const fileUrls: string[] = [];
      const folderId = this.config.googleDriveFolderId!;

      // Create a folder for this submission
      // Use supportsAllDrives for Shared Drives support (required for service accounts)
      const submissionFolder = await this.googleDriveClient.files.create({
        requestBody: {
          name: submission.submissionId,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [folderId],
        },
        fields: 'id',
        supportsAllDrives: true,
        supportsTeamDrives: true,
      });

      const submissionFolderId = submissionFolder.data.id;
      logger.info({ submissionId: submission.submissionId, folderId: submissionFolderId }, 'Created submission folder in Google Drive');

      // Helper function to upload a file
      const uploadFile = async (filePath: string, fileName: string, fileType: string): Promise<string | null> => {
        try {
          if (!fs.existsSync(filePath)) {
            logger.warn({ filePath, fileName }, `File not found for upload: ${fileName}`);
            return null;
          }

          const fileMetadata = {
            name: fileName,
            parents: [submissionFolderId],
          };
          const media = {
            mimeType: fileType,
            body: fs.createReadStream(filePath),
          };
          
          logger.debug({ fileName, filePath }, `Uploading ${fileName} to Google Drive...`);
          const file = await this.googleDriveClient.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, name, webViewLink, size',
            supportsAllDrives: true,
            supportsTeamDrives: true,
          });
          
          logger.info({ 
            fileName, 
            fileId: file.data.id, 
            fileSize: file.data.size,
            webViewLink: file.data.webViewLink 
          }, `Successfully uploaded ${fileName} to Google Drive`);
          
          return file.data.webViewLink || null;
        } catch (error: any) {
          // Extract detailed error information
          const errorDetails: any = {
            message: error?.message || 'Unknown error',
            code: error?.code,
          };
          
          // Google API errors have response data
          if (error?.response) {
            errorDetails.status = error.response.status;
            errorDetails.statusText = error.response.statusText;
            errorDetails.data = error.response.data;
            
            // Extract specific error message from Google API response
            if (error.response.data?.error) {
              errorDetails.googleError = error.response.data.error;
              if (error.response.data.error.message) {
                errorDetails.message = error.response.data.error.message;
              }
              if (error.response.data.error.errors) {
                errorDetails.errors = error.response.data.error.errors;
              }
            }
          }
          
          // Include stack trace in debug mode
          if (config.LOG_LEVEL === 'debug') {
            errorDetails.stack = error?.stack;
          }
          
          logger.error({ 
            error: errorDetails,
            fileName, 
            filePath,
            submissionId: submission.submissionId,
            folderId: submissionFolderId
          }, `Failed to upload ${fileName} to Google Drive`);
          return null;
        }
      };

      // Upload front image
      const frontUrl = await uploadFile(submission.frontImagePath, 'front.jpg', 'image/jpeg');
      if (frontUrl) fileUrls.push(frontUrl);

      // Upload back image if exists
      if (submission.backImagePath) {
        const backUrl = await uploadFile(submission.backImagePath, 'back.jpg', 'image/jpeg');
        if (backUrl) fileUrls.push(backUrl);
      }

      // Upload selfie
      const selfieUrl = await uploadFile(submission.selfieImagePath, 'selfie.jpg', 'image/jpeg');
      if (selfieUrl) fileUrls.push(selfieUrl);

      // Create metadata file
      try {
        const metadataContent = JSON.stringify(submission, null, 2);
        logger.debug({ 
          submissionId: submission.submissionId,
          contentLength: metadataContent.length 
        }, 'Uploading metadata.json to Google Drive...');
        
        const metadataFile = await this.googleDriveClient.files.create({
          requestBody: {
            name: 'metadata.json',
            parents: [submissionFolderId],
          },
          media: {
            mimeType: 'application/json',
            body: Buffer.from(metadataContent, 'utf-8'),
          },
          fields: 'id, name, size',
          supportsAllDrives: true,
          supportsTeamDrives: true,
        });
        
        logger.info({ 
          submissionId: submission.submissionId,
          fileId: metadataFile.data.id,
          fileSize: metadataFile.data.size
        }, 'Uploaded metadata.json to Google Drive');
      } catch (error: any) {
        // Extract detailed error information
        const errorDetails: any = {
          message: error?.message || 'Unknown error',
          code: error?.code,
        };
        
        // Google API errors have response data
        if (error?.response) {
          errorDetails.status = error.response.status;
          errorDetails.statusText = error.response.statusText;
          errorDetails.data = error.response.data;
          
          // Extract specific error message from Google API response
          if (error.response.data?.error) {
            errorDetails.googleError = error.response.data.error;
            if (error.response.data.error.message) {
              errorDetails.message = error.response.data.error.message;
            }
            if (error.response.data.error.errors) {
              errorDetails.errors = error.response.data.error.errors;
            }
          }
        }
        
        // Include stack trace in debug mode
        if (config.LOG_LEVEL === 'debug') {
          errorDetails.stack = error?.stack;
        }
        
        logger.error({ 
          error: errorDetails,
          submissionId: submission.submissionId,
          folderId: submissionFolderId,
          metadataSize: JSON.stringify(submission).length
        }, 'Failed to upload metadata.json to Google Drive');
      }

      logger.info({ 
        submissionId: submission.submissionId, 
        folderId: submissionFolderId,
        filesUploaded: fileUrls.length,
        fileUrls 
      }, 'Completed Google Drive upload');
      
      return { success: true, fileUrls, recordId: submissionFolderId };
    } catch (error: any) {
      logger.error({ error, submissionId: submission.submissionId }, 'Google Drive migration error');
      throw error;
    }
  }

  private async migrateToAirtable(submission: KycSubmission): Promise<StorageResult> {
    if (!this.config.airtableApiKey || !this.config.airtableBaseId) {
      logger.warn('Airtable configuration incomplete, falling back to local storage');
      return { success: false, error: 'Airtable configuration incomplete' };
    }

    if (!this.airtableBase) {
      logger.warn('Airtable client not initialized, falling back to local storage');
      return { success: false, error: 'Airtable client not initialized. Check logs for details.' };
    }

    try {
      const table = this.airtableBase(this.config.airtableTableName!);

      // Upload files to a temporary location or use base64 (Airtable supports attachments)
      // For simplicity, we'll store file paths and let Airtable handle the upload
      // In production, you might want to upload to a public URL first

      const recordData: any = {
        'Submission ID': submission.submissionId,
        'User Name': submission.userName,
        'User Email': submission.userEmail,
        'User Phone': submission.userPhone || '',
        'Document Type': submission.documentType,
        'Document Number': submission.documentNumber || '',
        'Status': submission.status,
        'Submitted At': submission.submittedAt,
        'User Type': submission.userType || '',
      };

      // Add review fields if they exist
      if (submission.manualMatchScore !== undefined) {
        recordData['Manual Match Score'] = submission.manualMatchScore;
      }
      if (submission.riskLevel) {
        recordData['Risk Level'] = submission.riskLevel;
      }
      if (submission.finalResult) {
        recordData['Final Result'] = submission.finalResult;
      }
      if (submission.reviewNotes) {
        recordData['Review Notes'] = submission.reviewNotes;
      }
      if (submission.reviewedAt) {
        recordData['Reviewed At'] = submission.reviewedAt;
      }

      // For file attachments, Airtable expects URLs or file paths
      // In a real implementation, you'd upload files to a public storage first
      // For now, we'll store the local paths (this won't work in production)
      const fileAttachments: Array<{ url: string; filename: string }> = [];
      
      if (fs.existsSync(submission.frontImagePath)) {
        // In production, upload to a public URL first
        fileAttachments.push({
          url: submission.frontImagePath, // This should be a public URL
          filename: 'front.jpg',
        });
      }

      if (submission.backImagePath && fs.existsSync(submission.backImagePath)) {
        fileAttachments.push({
          url: submission.backImagePath,
          filename: 'back.jpg',
        });
      }

      if (fs.existsSync(submission.selfieImagePath)) {
        fileAttachments.push({
          url: submission.selfieImagePath,
          filename: 'selfie.jpg',
        });
      }

      if (fileAttachments.length > 0) {
        recordData['Attachments'] = fileAttachments;
      }

      const record = await table.create(recordData);

      logger.info({ submissionId: submission.submissionId, recordId: record.id }, 'Created Airtable record');
      return { success: true, recordId: record.id };
    } catch (error: any) {
      logger.error({ error, submissionId: submission.submissionId }, 'Airtable migration error');
      throw error;
    }
  }

  private async migrateToFirebase(submission: KycSubmission): Promise<StorageResult> {
    if (!this.config.firebaseProjectId || !this.config.firebaseServiceAccountKey) {
      logger.warn('Firebase configuration incomplete, falling back to local storage');
      return { success: false, error: 'Firebase configuration incomplete' };
    }

    if (!this.firebaseAdmin) {
      logger.warn('Firebase Admin not initialized, falling back to local storage');
      return { success: false, error: 'Firebase Admin not initialized. Check logs for details.' };
    }

    try {
      const bucket = this.firebaseAdmin.storage().bucket();
      const fileUrls: string[] = [];
      const collection = this.firebaseAdmin.firestore().collection(this.config.firebaseCollectionName!);

      // Upload front image
      let frontImageUrl = '';
      if (fs.existsSync(submission.frontImagePath)) {
        const fileName = `kyc/${submission.submissionId}/front.jpg`;
        await bucket.upload(submission.frontImagePath, {
          destination: fileName,
          metadata: {
            contentType: 'image/jpeg',
            metadata: {
              submissionId: submission.submissionId,
              type: 'front',
            },
          },
        });
        const file = bucket.file(fileName);
        await file.makePublic();
        frontImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        fileUrls.push(frontImageUrl);
      }

      // Upload back image if exists
      let backImageUrl = '';
      if (submission.backImagePath && fs.existsSync(submission.backImagePath)) {
        const fileName = `kyc/${submission.submissionId}/back.jpg`;
        await bucket.upload(submission.backImagePath, {
          destination: fileName,
          metadata: {
            contentType: 'image/jpeg',
            metadata: {
              submissionId: submission.submissionId,
              type: 'back',
            },
          },
        });
        const file = bucket.file(fileName);
        await file.makePublic();
        backImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        fileUrls.push(backImageUrl);
      }

      // Upload selfie
      let selfieImageUrl = '';
      if (fs.existsSync(submission.selfieImagePath)) {
        const fileName = `kyc/${submission.submissionId}/selfie.jpg`;
        await bucket.upload(submission.selfieImagePath, {
          destination: fileName,
          metadata: {
            contentType: 'image/jpeg',
            metadata: {
              submissionId: submission.submissionId,
              type: 'selfie',
            },
          },
        });
        const file = bucket.file(fileName);
        await file.makePublic();
        selfieImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        fileUrls.push(selfieImageUrl);
      }

      // Create Firestore document
      const docData = {
        submissionId: submission.submissionId,
        userId: submission.userId,
        userEmail: submission.userEmail,
        userName: submission.userName,
        userPhone: submission.userPhone || null,
        documentType: submission.documentType,
        documentNumber: submission.documentNumber || null,
        frontImageUrl,
        backImageUrl: backImageUrl || null,
        selfieImageUrl,
        submittedAt: this.firebaseAdmin.firestore.Timestamp.fromDate(new Date(submission.submittedAt)),
        status: submission.status,
        userType: submission.userType || null,
        manualMatchScore: submission.manualMatchScore || null,
        riskLevel: submission.riskLevel || null,
        finalResult: submission.finalResult || null,
        reviewNotes: submission.reviewNotes || null,
        reviewedBy: submission.reviewedBy || null,
        reviewedAt: submission.reviewedAt 
          ? this.firebaseAdmin.firestore.Timestamp.fromDate(new Date(submission.reviewedAt))
          : null,
      };

      const docRef = await collection.add(docData);

      logger.info({ submissionId: submission.submissionId, docId: docRef.id }, 'Uploaded to Firebase');
      return { success: true, fileUrls, recordId: docRef.id };
    } catch (error: any) {
      logger.error({ error, submissionId: submission.submissionId }, 'Firebase migration error');
      throw error;
    }
  }

  // Export helper to get migration instructions
  static getMigrationInstructions(provider: string): string {
    const instructions: Record<string, string> = {
      googledrive: `
To enable Google Drive storage:
1. Install: npm install googleapis (or it's already in optionalDependencies)
2. Set environment variables:
   - KYC_STORAGE_PROVIDER=googledrive
   - GOOGLE_DRIVE_FOLDER_ID=your_folder_id
   - GOOGLE_SERVICE_ACCOUNT_KEY=path_to_service_account.json
3. Create a service account in Google Cloud Console
4. Enable Google Drive API for your project
5. Share the target folder with the service account email
6. Download the service account JSON key and set GOOGLE_SERVICE_ACCOUNT_KEY to its path
      `,
      airtable: `
To enable Airtable storage:
1. Install: npm install airtable (or it's already in optionalDependencies)
2. Set environment variables:
   - KYC_STORAGE_PROVIDER=airtable
   - AIRTABLE_API_KEY=your_api_key
   - AIRTABLE_BASE_ID=your_base_id
   - AIRTABLE_TABLE_NAME=KYC Submissions (optional, default: "KYC Submissions")
3. Create a table in Airtable with the following fields:
   - Submission ID (Single line text)
   - User Name (Single line text)
   - User Email (Email)
   - User Phone (Phone number)
   - Document Type (Single select)
   - Document Number (Single line text)
   - Status (Single select: pending, reviewing, approved, rejected)
   - Submitted At (Date)
   - User Type (Single line text)
   - Attachments (Multiple attachments) - for ID images
   - Manual Match Score (Number)
   - Risk Level (Single select: low, medium, high)
   - Final Result (Single select: pass, fail, review)
   - Review Notes (Long text)
   - Reviewed At (Date)
      `,
      firebase: `
To enable Firebase storage:
1. Install: npm install firebase-admin (or it's already in optionalDependencies)
2. Set environment variables:
   - KYC_STORAGE_PROVIDER=firebase
   - FIREBASE_PROJECT_ID=your_project_id
   - FIREBASE_SERVICE_ACCOUNT_KEY=path_to_service_account.json
   - FIREBASE_COLLECTION_NAME=kyc_submissions (optional, default: "kyc_submissions")
3. Create a Firebase project in Firebase Console
4. Enable Firestore Database and Cloud Storage
5. Generate a service account key in Project Settings > Service Accounts
6. Download the JSON key and set FIREBASE_SERVICE_ACCOUNT_KEY to its path
7. Set up Firestore security rules and Storage rules as needed
      `,
      local: `
Using local storage (default):
- Files are stored in kyc_submissions/ directory
- Metadata is stored in kyc_submissions/submissions.json
- To use a secure folder, set:
   - KYC_SECURE_FOLDER_PATH=/path/to/secure/folder
   - KYC_ENCRYPT_FILES=true (optional, for future encryption support)
      `,
    };

    return instructions[provider] || 'Provider not supported';
  }
}

export const storageMigrationService = new StorageMigrationService();

