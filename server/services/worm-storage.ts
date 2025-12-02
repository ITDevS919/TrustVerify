/**
 * WORM (Write Once Read Many) Storage Service
 * Provides immutable audit trail storage
 */

import { config } from '../config';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { AuditEvent } from '../security/audit-logger';

const logger = pino({
  name: 'worm-storage',
  level: config.LOG_LEVEL || 'info'
});

export interface WORMRecord {
  id: string;
  timestamp: string;
  eventType: string;
  data: any;
  hash: string;
  previousHash?: string;
  chainIndex: number;
}

export interface WORMConfig {
  storagePath: string;
  enableEncryption: boolean;
  encryptionKey?: string;
  enableCompression: boolean;
  retentionDays: number;
}

export class WORMStorageService {
  private config: WORMConfig;
  private storagePath: string;
  private currentChainIndex: number = 0;
  private lastHash: string | null = null;

  constructor() {
    this.config = {
      storagePath: process.env.WORM_STORAGE_PATH || path.join(process.cwd(), 'audit-trails'),
      enableEncryption: process.env.WORM_ENABLE_ENCRYPTION === 'true',
      encryptionKey: process.env.WORM_ENCRYPTION_KEY,
      enableCompression: process.env.WORM_ENABLE_COMPRESSION === 'true',
      retentionDays: parseInt(process.env.WORM_RETENTION_DAYS || '2555', 10), // 7 years default
    };

    this.storagePath = this.config.storagePath;
    this.initializeStorage();
  }

  /**
   * Initialize storage directory
   */
  private initializeStorage(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
      logger.info({ path: this.storagePath }, 'WORM storage initialized');
    }

    // Load last hash and chain index
    this.loadChainState();
  }

  /**
   * Load chain state from storage
   */
  private loadChainState(): void {
    const stateFile = path.join(this.storagePath, '.chain-state.json');
    if (fs.existsSync(stateFile)) {
      try {
        const state = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
        this.currentChainIndex = state.chainIndex || 0;
        this.lastHash = state.lastHash || null;
      } catch (error) {
        logger.warn({ error }, 'Failed to load chain state');
      }
    }
  }

  /**
   * Save chain state
   */
  private saveChainState(): void {
    const stateFile = path.join(this.storagePath, '.chain-state.json');
    const state = {
      chainIndex: this.currentChainIndex,
      lastHash: this.lastHash,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
  }

  /**
   * Calculate hash for record
   */
  private calculateHash(data: string, previousHash?: string): string {
    const hashInput = previousHash ? `${previousHash}${data}` : data;
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  /**
   * Encrypt data if encryption is enabled
   */
  private encrypt(data: string): string {
    if (!this.config.enableEncryption || !this.config.encryptionKey) {
      return data;
    }

    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.config.encryptionKey, 'salt', 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return JSON.stringify({
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    });
  }

  /**
   * Write immutable record to WORM storage
   */
  async writeRecord(event: AuditEvent, metadata?: Record<string, any>): Promise<WORMRecord> {
    const recordId = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
    const timestamp = new Date().toISOString();
    
    const recordData = {
      id: recordId,
      timestamp,
      eventType: event.eventType,
      data: {
        ...event,
        ...metadata,
      },
    };

    const dataString = JSON.stringify(recordData);
    const hash = this.calculateHash(dataString, this.lastHash || undefined);

    const record: WORMRecord = {
      id: recordId,
      timestamp,
      eventType: event.eventType,
      data: recordData.data,
      hash,
      previousHash: this.lastHash || undefined,
      chainIndex: this.currentChainIndex,
    };

    // Encrypt if enabled
    let storageData = dataString;
    if (this.config.enableEncryption) {
      storageData = this.encrypt(dataString);
    }

    // Write to file (immutable - append only)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const dailyDir = path.join(this.storagePath, String(year), month, day);
    if (!fs.existsSync(dailyDir)) {
      fs.mkdirSync(dailyDir, { recursive: true });
    }

    const filename = `${timestamp.replace(/:/g, '-')}_${recordId}.json`;
    const filePath = path.join(dailyDir, filename);

    // Write with append-only flag (O_APPEND)
    fs.appendFileSync(filePath, storageData + '\n', { flag: 'a' });

    // Update chain state
    this.currentChainIndex++;
    this.lastHash = hash;
    this.saveChainState();

    logger.info({
      recordId,
      eventType: event.eventType,
      chainIndex: record.chainIndex,
    }, 'WORM record written');

    return record;
  }

  /**
   * Verify record integrity
   */
  async verifyRecord(record: WORMRecord): Promise<boolean> {
    const dataString = JSON.stringify({
      id: record.id,
      timestamp: record.timestamp,
      eventType: record.eventType,
      data: record.data,
    });

    const calculatedHash = this.calculateHash(dataString, record.previousHash);
    return calculatedHash === record.hash;
  }

  /**
   * Read records for date range
   */
  async readRecords(
    startDate: Date,
    endDate: Date,
    eventType?: string
  ): Promise<WORMRecord[]> {
    const records: WORMRecord[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      
      const dailyDir = path.join(this.storagePath, String(year), month, day);
      
      if (fs.existsSync(dailyDir)) {
        const files = fs.readdirSync(dailyDir)
          .filter(f => f.endsWith('.json'))
          .sort();

        for (const file of files) {
          const filePath = path.join(dailyDir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf-8').trim();
            const lines = content.split('\n').filter(l => l.trim());
            
            for (const line of lines) {
              let recordData: any;
              
              // Decrypt if needed
              if (this.config.enableEncryption) {
                recordData = this.decrypt(line);
              } else {
                recordData = JSON.parse(line);
              }

              const record: WORMRecord = {
                id: recordData.id,
                timestamp: recordData.timestamp,
                eventType: recordData.eventType,
                data: recordData.data,
                hash: this.calculateHash(line, recordData.previousHash),
                previousHash: recordData.previousHash,
                chainIndex: recordData.chainIndex || 0,
              };

              if (!eventType || record.eventType === eventType) {
                records.push(record);
              }
            }
          } catch (error) {
            logger.warn({ file, error }, 'Failed to read WORM record');
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return records.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  /**
   * Decrypt data
   */
  private decrypt(encryptedData: string): any {
    if (!this.config.enableEncryption || !this.config.encryptionKey) {
      return JSON.parse(encryptedData);
    }

    const { encrypted, iv, authTag } = JSON.parse(encryptedData);
    const algorithm = 'aes-256-gcm';
    const key = crypto.scryptSync(this.config.encryptionKey, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  /**
   * Cleanup old records (respects retention policy)
   */
  async cleanupOldRecords(): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    let deletedCount = 0;
    const storagePath = this.storagePath;

    if (!fs.existsSync(storagePath)) {
      return 0;
    }

    const years = fs.readdirSync(storagePath)
      .filter(f => fs.statSync(path.join(storagePath, f)).isDirectory() && /^\d{4}$/.test(f));

    for (const year of years) {
      const yearPath = path.join(storagePath, year);
      const yearNum = parseInt(year, 10);
      
      if (yearNum < cutoffDate.getFullYear()) {
        // Delete entire year
        fs.rmSync(yearPath, { recursive: true, force: true });
        deletedCount++;
        continue;
      }

      const months = fs.readdirSync(yearPath)
        .filter(f => fs.statSync(path.join(yearPath, f)).isDirectory());

      for (const month of months) {
        const monthPath = path.join(yearPath, month);
        const days = fs.readdirSync(monthPath)
          .filter(f => fs.statSync(path.join(monthPath, f)).isDirectory());

        for (const day of days) {
          const dayPath = path.join(monthPath, day);
          const dayDate = new Date(yearNum, parseInt(month, 10) - 1, parseInt(day, 10));

          if (dayDate < cutoffDate) {
            fs.rmSync(dayPath, { recursive: true, force: true });
            deletedCount++;
          }
        }
      }
    }

    logger.info({ deletedCount, cutoffDate }, 'WORM records cleaned up');
    return deletedCount;
  }
}

export const wormStorage = new WORMStorageService();

