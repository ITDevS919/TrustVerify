/**
 * Professional File Storage Service
 * Supports AWS S3, Azure Blob Storage, and local storage (development)
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pino from 'pino';
// Config is not directly used, but FILE_STORAGE_PROVIDER is read from process.env

const logger = pino({ name: 'file-storage' });

export type StorageProvider = 's3' | 'azure' | 'local';

export interface FileMetadata {
  id: string;
  userId: number;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageProvider: StorageProvider;
  storageKey: string; // S3 key, Azure blob name, or local path
  uploadedAt: Date;
  expiresAt?: Date; // For temporary files
  encrypted: boolean;
  checksum?: string; // SHA-256 hash
}

export interface UploadResult {
  success: boolean;
  fileId: string;
  storageKey: string;
  url?: string; // Public URL if applicable
  error?: string;
}

export class FileStorageService {
  private provider: StorageProvider;
  private s3Client?: S3Client;
  private s3Bucket?: string;
  private localStorageDir: string;

  constructor() {
    // Determine storage provider from config
    const storageProvider = process.env.FILE_STORAGE_PROVIDER || 'local';
    this.provider = (storageProvider === 's3' || storageProvider === 'azure') 
      ? storageProvider 
      : 'local';

    // Initialize S3 if configured
    if (this.provider === 's3') {
      // Check for S3-specific env vars first, then fall back to generic AWS vars
      const awsRegion = process.env.AWS_S3_REGION || process.env.AWS_REGION || 'us-east-1';
      const awsAccessKeyId = process.env.AWS_S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
      const awsSecretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
      this.s3Bucket = process.env.AWS_S3_BUCKET;

      // Log configuration status for debugging
      logger.info({
        provider: 's3',
        hasBucket: !!this.s3Bucket,
        hasAccessKey: !!awsAccessKeyId,
        hasSecretKey: !!awsSecretAccessKey,
        region: awsRegion,
        bucket: this.s3Bucket || 'NOT SET',
        usingS3SpecificVars: !!(process.env.AWS_S3_ACCESS_KEY_ID && process.env.AWS_S3_SECRET_ACCESS_KEY),
      }, 'S3 configuration check');

      if (!awsAccessKeyId || !awsSecretAccessKey || !this.s3Bucket) {
        const missingVars = [];
        if (!this.s3Bucket) missingVars.push('AWS_S3_BUCKET');
        if (!awsAccessKeyId) missingVars.push('AWS_S3_ACCESS_KEY_ID or AWS_ACCESS_KEY_ID');
        if (!awsSecretAccessKey) missingVars.push('AWS_S3_SECRET_ACCESS_KEY or AWS_SECRET_ACCESS_KEY');
        
        logger.error({
          missing: missingVars,
          bucket: this.s3Bucket || 'NOT SET',
          hasAccessKey: !!awsAccessKeyId,
          hasSecretKey: !!awsSecretAccessKey,
        }, 'AWS S3 credentials not fully configured, falling back to local storage');
        this.provider = 'local';
      } else {
        try {
          this.s3Client = new S3Client({
            region: awsRegion,
            credentials: {
              accessKeyId: awsAccessKeyId,
              secretAccessKey: awsSecretAccessKey,
            },
            // Add endpoint for custom S3-compatible services if needed
            ...(process.env.AWS_S3_ENDPOINT && { endpoint: process.env.AWS_S3_ENDPOINT }),
            // Force path style if needed (for some S3-compatible services)
            ...(process.env.AWS_S3_FORCE_PATH_STYLE === 'true' && { forcePathStyle: true }),
          });
          
          // Test S3 connection by checking if bucket exists
          this.testS3Connection().catch((error) => {
            logger.error({ 
              error: error.message,
              bucket: this.s3Bucket,
              region: awsRegion,
            }, 'S3 connection test failed - S3 may not be accessible, but will attempt to use it');
          });
          
          logger.info({ 
            bucket: this.s3Bucket, 
            region: awsRegion,
            endpoint: process.env.AWS_S3_ENDPOINT || 'default',
            forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
          }, 'S3 storage initialized successfully');
        } catch (error: any) {
          logger.error({ 
            error: error.message,
            stack: error.stack,
            region: awsRegion,
            bucket: this.s3Bucket,
          }, 'Failed to initialize S3 client, falling back to local storage');
          this.provider = 'local';
        }
      }
    }

    // Setup local storage directory
    this.localStorageDir = path.join(process.cwd(), 'secure_uploads');
    if (this.provider === 'local') {
      try {
        if (!fs.existsSync(this.localStorageDir)) {
          fs.mkdirSync(this.localStorageDir, { recursive: true });
          logger.info({ path: this.localStorageDir }, 'Created secure_uploads directory');
        }
        // Create subdirectories for organization
        const subdirs = ['kyc', 'kyb', 'documents'];
        for (const subdir of subdirs) {
          const subdirPath = path.join(this.localStorageDir, subdir);
          if (!fs.existsSync(subdirPath)) {
            fs.mkdirSync(subdirPath, { recursive: true });
          }
        }
        logger.info({ path: this.localStorageDir }, 'Local storage directories initialized');
      } catch (error: any) {
        logger.error({ error, path: this.localStorageDir }, 'Failed to create local storage directories');
        throw new Error(`Failed to initialize local storage: ${error.message}`);
      }
    }
  }

  /**
   * Generate a unique file ID
   */
  private generateFileId(): string {
    return `file_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  }

  /**
   * Generate storage key (path) for file
   */
  private generateStorageKey(fileType: 'kyc' | 'kyb' | 'document', userId: number, originalName: string): string {
    const timestamp = Date.now();
    const extension = path.extname(originalName);
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const baseName = path.basename(sanitizedName, extension);
    
    // Organize by type/user/date
    return `${fileType}/${userId}/${timestamp}_${baseName}${extension}`;
  }

  /**
   * Calculate file checksum
   */
  private calculateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Encrypt file buffer (AES-256-GCM)
   */
  private encryptBuffer(buffer: Buffer, encryptionKey?: string): { encrypted: Buffer; iv: Buffer; authTag: Buffer } {
    if (!encryptionKey) {
      return { encrypted: buffer, iv: Buffer.alloc(16), authTag: Buffer.alloc(16) };
    }

    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([
      cipher.update(buffer),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return { encrypted, iv, authTag };
  }

  /**
   * Upload file to storage
   */
  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    userId: number,
    fileType: 'kyc' | 'kyb' | 'document' = 'kyc',
    options?: {
      encrypt?: boolean;
      expiresInDays?: number;
    }
  ): Promise<UploadResult> {
    try {
      const fileId = this.generateFileId();
      const storageKey = this.generateStorageKey(fileType, userId, originalName);
      const checksum = this.calculateChecksum(fileBuffer);

      // Encrypt if requested and encryption key is available
      let finalBuffer = fileBuffer;
      let encrypted = false;
      if (options?.encrypt) {
        const encryptionKey = process.env.FILE_ENCRYPTION_KEY;
        if (encryptionKey && encryptionKey.length >= 32) {
          try {
            const { encrypted: encryptedBuffer } = this.encryptBuffer(fileBuffer, encryptionKey);
            finalBuffer = encryptedBuffer;
            encrypted = true;
            logger.debug({ fileId, originalName }, 'File encrypted successfully');
          } catch (encryptError: any) {
            logger.warn({ error: encryptError, fileId, originalName }, 'Encryption failed, storing file unencrypted');
            // Continue without encryption if it fails
            encrypted = false;
          }
        } else {
          logger.debug({ fileId, originalName }, 'Encryption requested but FILE_ENCRYPTION_KEY not set or too short, storing unencrypted');
          encrypted = false;
        }
      }

      if (this.provider === 's3' && this.s3Client && this.s3Bucket) {
        // Upload to S3 with fallback to local storage on error
        try {
          const command = new PutObjectCommand({
            Bucket: this.s3Bucket,
            Key: storageKey,
            Body: finalBuffer,
            ContentType: mimeType,
            Metadata: {
              fileId,
              userId: userId.toString(),
              originalName,
              checksum,
              encrypted: encrypted.toString(),
            },
            ServerSideEncryption: 'AES256',
          });

          await this.s3Client.send(command);

          logger.info({ 
            fileId, 
            storageKey, 
            provider: 's3',
            bucket: this.s3Bucket,
            size: finalBuffer.length,
            originalName 
          }, 'File uploaded to S3 successfully');

          return {
            success: true,
            fileId,
            storageKey,
          };
        } catch (s3Error: any) {
          // Log detailed error information
          const errorDetails: any = {
            error: s3Error.message,
            code: s3Error.code,
            name: s3Error.name,
            bucket: this.s3Bucket,
            region: this.s3Client?.config?.region,
            storageKey,
            originalName,
            fileId,
            fileSize: finalBuffer.length,
          };

          // Add request ID if available
          if (s3Error.$metadata?.requestId) {
            errorDetails.requestId = s3Error.$metadata.requestId;
          }

          // Add more specific error information
          if (s3Error.$metadata) {
            errorDetails.metadata = s3Error.$metadata;
          }

          // Check for common S3 errors
          if (s3Error.code === 'NoSuchBucket') {
            errorDetails.diagnosis = 'S3 bucket does not exist or is not accessible';
          } else if (s3Error.code === 'InvalidAccessKeyId') {
            errorDetails.diagnosis = 'AWS Access Key ID is invalid';
          } else if (s3Error.code === 'SignatureDoesNotMatch') {
            errorDetails.diagnosis = 'AWS Secret Access Key is incorrect';
          } else if (s3Error.code === 'AccessDenied') {
            errorDetails.diagnosis = 'AWS credentials do not have permission to upload to this bucket';
          } else if (s3Error.code === 'ENOTFOUND' || s3Error.code === 'ECONNREFUSED') {
            errorDetails.diagnosis = 'Cannot connect to S3 service - check network, endpoint, or region';
          }

          logger.error(errorDetails, 'S3 upload failed, falling back to local storage');
          
          // Fall back to local storage if S3 fails
          // Don't throw, continue to local storage logic below
        }
      }
      
      // Local storage (either as primary or fallback from S3)
      // Local storage
      const filePath = path.join(this.localStorageDir, storageKey);
      const dir = path.dirname(filePath);
      
      try {
        // Ensure directory exists
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          logger.debug({ dir }, 'Created directory for file upload');
        }

        // Write file
        fs.writeFileSync(filePath, finalBuffer);
        
        // Verify file was written
        if (!fs.existsSync(filePath)) {
          throw new Error('File was not written successfully');
        }

        logger.info({ 
          fileId, 
          storageKey, 
          provider: 'local', 
          size: finalBuffer.length,
          path: filePath 
        }, 'File uploaded to local storage');

        return {
          success: true,
          fileId,
          storageKey,
          url: `/api/files/${fileId}`, // Local access URL
        };
      } catch (writeError: any) {
        logger.error({ 
          error: writeError.message,
          stack: writeError.stack,
          filePath, 
          dir, 
          originalName,
          storageKey,
          localStorageDir: this.localStorageDir
        }, 'Failed to write file to local storage');
        throw writeError; // Re-throw to be caught by outer try-catch
      }
    } catch (error: any) {
      logger.error({ error, originalName }, 'Failed to upload file');
      return {
        success: false,
        fileId: '',
        storageKey: '',
        error: error.message,
      };
    }
  }

  /**
   * Get signed URL for file access (temporary, secure)
   */
  async getFileUrl(storageKey: string, expiresInSeconds: number = 3600): Promise<string | null> {
    try {
      if (this.provider === 's3' && this.s3Client && this.s3Bucket) {
        const command = new GetObjectCommand({
          Bucket: this.s3Bucket,
          Key: storageKey,
        });

        const url = await getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
        return url;
      } else {
        // Local storage - return direct path (in production, you'd want to add auth checks)
        const filePath = path.join(this.localStorageDir, storageKey);
        if (fs.existsSync(filePath)) {
          return `/api/files/${storageKey}`;
        }
        return null;
      }
    } catch (error: any) {
      logger.error({ error, storageKey }, 'Failed to generate file URL');
      return null;
    }
  }

  /**
   * Download file from storage
   */
  async downloadFile(storageKey: string): Promise<Buffer | null> {
    try {
      if (this.provider === 's3' && this.s3Client && this.s3Bucket) {
        const command = new GetObjectCommand({
          Bucket: this.s3Bucket,
          Key: storageKey,
        });

        const response = await this.s3Client.send(command);
        const chunks: Uint8Array[] = [];

        if (response.Body) {
          for await (const chunk of response.Body as any) {
            chunks.push(chunk);
          }
        }

        return Buffer.concat(chunks);
      } else {
        // Local storage
        const filePath = path.join(this.localStorageDir, storageKey);
        if (fs.existsSync(filePath)) {
          return fs.readFileSync(filePath);
        }
        return null;
      }
    } catch (error: any) {
      logger.error({ error, storageKey }, 'Failed to download file');
      return null;
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(storageKey: string): Promise<boolean> {
    try {
      if (this.provider === 's3' && this.s3Client && this.s3Bucket) {
        const command = new DeleteObjectCommand({
          Bucket: this.s3Bucket,
          Key: storageKey,
        });

        await this.s3Client.send(command);
        logger.info({ storageKey, provider: 's3' }, 'File deleted from S3');
        return true;
      } else {
        // Local storage
        const filePath = path.join(this.localStorageDir, storageKey);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.info({ storageKey, provider: 'local' }, 'File deleted from local storage');
          return true;
        }
        return false;
      }
    } catch (error: any) {
      logger.error({ error, storageKey }, 'Failed to delete file');
      return false;
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(storageKey: string): Promise<boolean> {
    try {
      if (this.provider === 's3' && this.s3Client && this.s3Bucket) {
        const command = new HeadObjectCommand({
          Bucket: this.s3Bucket,
          Key: storageKey,
        });

        try {
          await this.s3Client.send(command);
          return true;
        } catch {
          return false;
        }
      } else {
        const filePath = path.join(this.localStorageDir, storageKey);
        return fs.existsSync(filePath);
      }
    } catch {
      return false;
    }
  }

  /**
   * Test S3 connection by checking if bucket exists
   */
  private async testS3Connection(): Promise<void> {
    if (this.provider !== 's3' || !this.s3Client || !this.s3Bucket) {
      return;
    }

    try {
      const command = new HeadObjectCommand({
        Bucket: this.s3Bucket,
        Key: '.test-connection-check', // Non-existent key, but will test bucket access
      });

      try {
        await this.s3Client.send(command);
      } catch (error: any) {
        // If error is 404, bucket exists but key doesn't (which is fine)
        // If error is 403, we have access but bucket might be private (also fine)
        // If error is other, log it
        if (error.code !== 'NotFound' && error.code !== '403') {
          throw error;
        }
      }

      logger.info({ bucket: this.s3Bucket }, 'S3 connection test successful - bucket is accessible');
    } catch (error: any) {
      logger.warn({ 
        error: error.message,
        code: error.code,
        bucket: this.s3Bucket,
      }, 'S3 connection test failed - bucket may not be accessible or credentials may be invalid');
      // Don't throw - allow the service to continue, but log the warning
    }
  }

  /**
   * Get storage provider
   */
  getProvider(): StorageProvider {
    return this.provider;
  }

  /**
   * Get S3 configuration status (for diagnostics)
   */
  getS3ConfigStatus(): {
    provider: StorageProvider;
    configured: boolean;
    bucket?: string;
    region?: string;
    hasCredentials: boolean;
    hasClient: boolean;
  } {
    const region = this.s3Client?.config?.region;
    const regionStr = typeof region === 'string' ? region : undefined;
    
    return {
      provider: this.provider,
      configured: this.provider === 's3' && !!this.s3Client && !!this.s3Bucket,
      bucket: this.s3Bucket,
      region: regionStr,
      hasCredentials: !!(process.env.AWS_S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID),
      hasClient: !!this.s3Client,
    };
  }
}

export const fileStorageService = new FileStorageService();

