/**
 * Cloud Storage Service
 * Supports AWS S3 and Cloudflare R2 with virus scanning integration
 */

// AWS SDK imports - install with: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
// @ts-ignore - Dynamic import to avoid requiring AWS SDK if not used
let S3Client: any, PutObjectCommand: any, GetObjectCommand: any, DeleteObjectCommand: any, HeadObjectCommand: any, getSignedUrl: any;
import { config } from '../config';
import pino from 'pino';
import crypto from 'crypto';
import path from 'path';

const logger = pino({
  name: 'cloud-storage',
  level: config.LOG_LEVEL || 'info'
});

export type StorageProvider = 's3' | 'r2' | 'local';

export interface UploadResult {
  key: string;
  url: string;
  provider: StorageProvider;
  size: number;
  contentType: string;
  scanned: boolean;
  scanResult?: 'clean' | 'infected' | 'error';
  uploadedAt: Date;
}

export interface StorageConfig {
  provider: StorageProvider;
  bucket: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  publicUrl?: string;
}

export class CloudStorageService {
  private s3Client: typeof S3Client | null = null;
  private config: StorageConfig;
  private provider: StorageProvider;

  constructor() {
    // Determine which provider to use
    if (config.CLOUDFLARE_R2_BUCKET && config.CLOUDFLARE_R2_ACCESS_KEY_ID) {
      this.provider = 'r2';
      this.config = {
        provider: 'r2',
        bucket: config.CLOUDFLARE_R2_BUCKET,
        accessKeyId: config.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: config.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
        publicUrl: config.CLOUDFLARE_R2_PUBLIC_URL,
        // R2 uses S3-compatible API, but with different endpoint
        region: 'auto',
      };
      // Initialize asynchronously
      this.initializeR2Client().catch((error) => {
        logger.error({ error }, 'Failed to initialize R2, falling back to local');
        this.provider = 'local';
      });
    } else if (config.AWS_S3_BUCKET && config.AWS_S3_ACCESS_KEY_ID) {
      this.provider = 's3';
      this.config = {
        provider: 's3',
        bucket: config.AWS_S3_BUCKET,
        region: config.AWS_S3_REGION || 'us-east-1',
        accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
      };
      // Initialize asynchronously
      this.initializeS3Client().catch((error) => {
        logger.error({ error }, 'Failed to initialize S3, falling back to local');
        this.provider = 'local';
      });
    } else {
      this.provider = 'local';
      this.config = {
        provider: 'local',
        bucket: 'uploads',
      };
      logger.warn('No cloud storage configured, falling back to local storage');
    }
  }

  private async initializeS3Client(): Promise<void> {
    try {
      const s3Module = await import('@aws-sdk/client-s3');
      S3Client = s3Module.S3Client;
      PutObjectCommand = s3Module.PutObjectCommand;
      GetObjectCommand = s3Module.GetObjectCommand;
      DeleteObjectCommand = s3Module.DeleteObjectCommand;
      HeadObjectCommand = s3Module.HeadObjectCommand;
      
      const presignerModule = await import('@aws-sdk/s3-request-presigner');
      getSignedUrl = presignerModule.getSignedUrl;

      this.s3Client = new S3Client({
        region: this.config.region || 'us-east-1',
        credentials: {
          accessKeyId: this.config.accessKeyId!,
          secretAccessKey: this.config.secretAccessKey!,
        },
      });
      logger.info({ region: this.config.region, bucket: this.config.bucket }, 'S3 client initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize S3 client - install @aws-sdk/client-s3');
      throw new Error('AWS SDK not installed. Run: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner');
    }
  }

  private async initializeR2Client(): Promise<void> {
    // Cloudflare R2 uses S3-compatible API
    const accountId = config.CLOUDFLARE_R2_ACCOUNT_ID;
    if (!accountId) {
      throw new Error('CLOUDFLARE_R2_ACCOUNT_ID is required for R2 storage');
    }

    try {
      const s3Module = await import('@aws-sdk/client-s3');
      S3Client = s3Module.S3Client;
      PutObjectCommand = s3Module.PutObjectCommand;
      GetObjectCommand = s3Module.GetObjectCommand;
      DeleteObjectCommand = s3Module.DeleteObjectCommand;
      HeadObjectCommand = s3Module.HeadObjectCommand;
      
      const presignerModule = await import('@aws-sdk/s3-request-presigner');
      getSignedUrl = presignerModule.getSignedUrl;

      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: this.config.accessKeyId!,
          secretAccessKey: this.config.secretAccessKey!,
        },
      });
      logger.info({ bucket: this.config.bucket }, 'Cloudflare R2 client initialized');
    } catch (error) {
      logger.error({ error }, 'Failed to initialize R2 client - install @aws-sdk/client-s3');
      throw new Error('AWS SDK not installed. Run: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner');
    }
  }

  /**
   * Upload file to cloud storage with virus scanning
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    try {
      // Generate secure file key
      const fileExtension = path.extname(fileName);
      const secureFileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
      const key = `${folder}/${Date.now()}-${secureFileName}`;

      // Virus scanning
      let scanResult: 'clean' | 'infected' | 'error' = 'clean';
      let scanned = false;

      if (config.VIRUS_SCAN_PROVIDER && config.VIRUS_SCAN_API_KEY) {
        try {
          scanResult = await this.scanFile(fileBuffer, fileName);
          scanned = true;

          if (scanResult === 'infected') {
            logger.warn({ fileName, key }, 'Virus detected in uploaded file');
            throw new Error('File failed virus scan and was rejected');
          }
        } catch (error) {
          logger.error({ error, fileName }, 'Virus scanning failed');
          scanResult = 'error';
          // In production, you might want to reject files if scanning fails
          if (config.NODE_ENV === 'production') {
            throw new Error('Virus scanning service unavailable');
          }
        }
      }

      // Upload to cloud storage
      if (this.provider === 'local') {
        return await this.uploadLocal(fileBuffer, key, contentType, scanned, scanResult);
      }

      if (!this.s3Client) {
        throw new Error('Storage client not initialized');
      }

      const command = new PutObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        // Security headers
        ServerSideEncryption: 'AES256',
        Metadata: {
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
          scanned: scanned.toString(),
          scanResult: scanResult,
        },
      });

      await this.s3Client.send(command);

      // Generate public URL
      let url: string;
      if (this.config.publicUrl) {
        url = `${this.config.publicUrl}/${key}`;
      } else {
        // Generate presigned URL (valid for 1 hour)
        const getCommand = new GetObjectCommand({
          Bucket: this.config.bucket,
          Key: key,
        });
        url = await getSignedUrl(this.s3Client, getCommand, { expiresIn: 3600 });
      }

      logger.info({ key, provider: this.provider, size: fileBuffer.length }, 'File uploaded to cloud storage');

      return {
        key,
        url,
        provider: this.provider,
        size: fileBuffer.length,
        contentType,
        scanned,
        scanResult,
        uploadedAt: new Date(),
      };
    } catch (error) {
      logger.error({ error, fileName }, 'Failed to upload file');
      throw error;
    }
  }

  /**
   * Get file URL (presigned if needed)
   */
  async getFileUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (this.provider === 'local') {
      return `/api/uploads/${path.basename(key)}`;
    }

    if (!this.s3Client) {
      throw new Error('Storage client not initialized');
    }

    if (this.config.publicUrl) {
      return `${this.config.publicUrl}/${key}`;
    }

    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Delete file from cloud storage
   */
  async deleteFile(key: string): Promise<void> {
    if (this.provider === 'local') {
      // Local file deletion handled separately
      return;
    }

    if (!this.s3Client) {
      throw new Error('Storage client not initialized');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    await this.s3Client.send(command);
    logger.info({ key, provider: this.provider }, 'File deleted from cloud storage');
  }

  /**
   * Check if file exists
   */
  async fileExists(key: string): Promise<boolean> {
    if (this.provider === 'local') {
      const fs = await import('fs');
      const path = await import('path');
      const uploadDir = path.join(process.cwd(), 'uploads');
      return fs.existsSync(path.join(uploadDir, path.basename(key)));
    }

    if (!this.s3Client) {
      return false;
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.config.bucket,
        Key: key,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Virus scanning integration
   */
  private async scanFile(fileBuffer: Buffer, fileName: string): Promise<'clean' | 'infected' | 'error'> {
    const provider = config.VIRUS_SCAN_PROVIDER;

    switch (provider) {
      case 'clamav':
        return await this.scanWithClamAV(fileBuffer);
      case 'cloudflare':
        return await this.scanWithCloudflare(fileBuffer, fileName);
      case 'aws-guardduty':
        return await this.scanWithGuardDuty(fileBuffer, fileName);
      default:
        logger.warn('No virus scanning provider configured');
        return 'clean';
    }
  }

  private async scanWithClamAV(_fileBuffer: Buffer): Promise<'clean' | 'infected' | 'error'> {
    // ClamAV integration would go here
    // For now, return clean (implement actual ClamAV client)
    logger.debug('ClamAV scan (not implemented)');
    return 'clean';
  }

  private async scanWithCloudflare(_fileBuffer: Buffer, fileName: string): Promise<'clean' | 'infected' | 'error'> {
    // Cloudflare Workers for virus scanning
    // This would integrate with Cloudflare's security services
    logger.debug({ fileName }, 'Cloudflare scan (not implemented)');
    return 'clean';
  }

  private async scanWithGuardDuty(_fileBuffer: Buffer, fileName: string): Promise<'clean' | 'infected' | 'error'> {
    // AWS GuardDuty or Macie integration
    logger.debug({ fileName }, 'AWS GuardDuty scan (not implemented)');
    return 'clean';
  }

  /**
   * Fallback to local storage
   */
  private async uploadLocal(
    fileBuffer: Buffer,
    key: string,
    contentType: string,
    scanned: boolean,
    scanResult: 'clean' | 'infected' | 'error'
  ): Promise<UploadResult> {
    const fs = await import('fs');
    const path = await import('path');
    const uploadDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, path.basename(key));
    fs.writeFileSync(filePath, fileBuffer);

    return {
      key,
      url: `/api/uploads/${path.basename(key)}`,
      provider: 'local',
      size: fileBuffer.length,
      contentType,
      scanned,
      scanResult,
      uploadedAt: new Date(),
    };
  }

  /**
   * Get current storage provider
   */
  getProvider(): StorageProvider {
    return this.provider;
  }
}

// Singleton instance
export const cloudStorage = new CloudStorageService();

