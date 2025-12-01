/**
 * Multi-Factor Authentication Service (Rule 1.1)
 * Implements TOTP-based MFA for enhanced security
 */

import crypto from 'crypto';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import pino from 'pino';

const logger = pino({
  name: 'mfa-service',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

export interface MFAToken {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export class MFAService {
  
  /**
   * Generate TOTP secret and backup codes for user (Rule 1.1)
   */
  static async generateMFASecret(userId: number): Promise<MFAToken> {
    // Generate base32 secret for TOTP
    const secret = this.generateBase32Secret();
    
    // Generate 10 backup codes
    const backupCodes = this.generateBackupCodes();
    
    // Create QR code data URL
    const qrCode = await this.generateQRCode(secret, userId);
    
    logger.info({ userId }, 'MFA secret generated for user');
    
    return {
      secret,
      qrCode,
      backupCodes
    };
  }

  /**
   * Enable MFA for user (Rule 1.1)
   */
  static async enableMFA(userId: number, secret: string, backupCodes: string[], totpCode: string): Promise<boolean> {
    try {
      // Verify the TOTP code before enabling
      const isValid = this.verifyTOTP(secret, totpCode);
      
      if (!isValid) {
        logger.warn({ userId }, 'Invalid TOTP code during MFA setup');
        return false;
      }

      // Hash backup codes for storage
      const hashedBackupCodes = backupCodes.map(code => this.hashBackupCode(code));

      // Update user with MFA settings
      await db.update(users)
        .set({
          mfaEnabled: true,
          mfaSecret: secret,
          mfaBackupCodes: hashedBackupCodes,
          lastMfaUsed: new Date()
        })
        .where(eq(users.id, userId));

      logger.info({ userId }, 'MFA enabled successfully for user');
      return true;
      
    } catch (error) {
      logger.error({ error, userId }, 'Failed to enable MFA');
      return false;
    }
  }

  /**
   * Verify MFA token (TOTP or backup code) (Rule 1.1)
   */
  static async verifyMFA(userId: number, token: string): Promise<boolean> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, userId));

      if (!user || !user.mfaEnabled || !user.mfaSecret) {
        logger.warn({ userId }, 'MFA verification attempted for user without MFA enabled');
        return false;
      }

      // Try TOTP verification first
      if (this.verifyTOTP(user.mfaSecret, token)) {
        await this.updateLastMfaUsed(userId);
        logger.info({ userId }, 'Successful MFA verification via TOTP');
        return true;
      }

      // Try backup code verification
      if (await this.verifyBackupCode(userId, token, user.mfaBackupCodes as string[])) {
        await this.updateLastMfaUsed(userId);
        logger.info({ userId }, 'Successful MFA verification via backup code');
        return true;
      }

      logger.warn({ userId }, 'Failed MFA verification attempt');
      return false;
      
    } catch (error) {
      logger.error({ error, userId }, 'Error during MFA verification');
      return false;
    }
  }

  /**
   * Disable MFA for user (Rule 1.1)
   */
  static async disableMFA(userId: number): Promise<boolean> {
    try {
      await db.update(users)
        .set({
          mfaEnabled: false,
          mfaSecret: null,
          mfaBackupCodes: null,
          lastMfaUsed: null
        })
        .where(eq(users.id, userId));

      logger.info({ userId }, 'MFA disabled for user');
      return true;
      
    } catch (error) {
      logger.error({ error, userId }, 'Failed to disable MFA');
      return false;
    }
  }

  /**
   * Generate new backup codes (Rule 1.1)
   */
  static async regenerateBackupCodes(userId: number): Promise<string[]> {
    try {
      const backupCodes = this.generateBackupCodes();
      const hashedBackupCodes = backupCodes.map(code => this.hashBackupCode(code));

      await db.update(users)
        .set({
          mfaBackupCodes: hashedBackupCodes
        })
        .where(eq(users.id, userId));

      logger.info({ userId }, 'Backup codes regenerated for user');
      return backupCodes;
      
    } catch (error) {
      logger.error({ error, userId }, 'Failed to regenerate backup codes');
      throw error;
    }
  }

  /**
   * Check if user has MFA enabled (Rule 1.1)
   */
  static async isMFAEnabled(userId: number): Promise<boolean> {
    try {
      const [user] = await db.select({ mfaEnabled: users.mfaEnabled })
        .from(users)
        .where(eq(users.id, userId));

      return user?.mfaEnabled ?? false;
    } catch (error) {
      logger.error({ error, userId }, 'Failed to check MFA status');
      return false;
    }
  }

  // Private helper methods

  private static generateBase32Secret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  }

  private static generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4, 8)}`);
    }
    return codes;
  }

  private static async generateQRCode(secret: string, userId: number): Promise<string> {
    // In production, use a proper QR code library like 'qrcode'
    // For now, return the manual entry secret
    const issuer = 'TrustVerify';
    const accountName = `user-${userId}`;
    const otpauth = `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`;
    
    // Return base64 encoded data URL for QR code
    // In production: return actual QR code image
    return `data:text/plain;base64,${Buffer.from(otpauth).toString('base64')}`;
  }

  private static verifyTOTP(secret: string, token: string, window: number = 1): boolean {
    const timeStep = 30; // 30-second time step
    const currentTime = Math.floor(Date.now() / 1000 / timeStep);
    
    // Check current time window and adjacent windows for clock skew
    for (let i = -window; i <= window; i++) {
      const testTime = currentTime + i;
      const expectedToken = this.generateTOTP(secret, testTime);
      
      if (expectedToken === token) {
        return true;
      }
    }
    
    return false;
  }

  private static generateTOTP(secret: string, timeStep: number): string {
    // Convert base32 secret to bytes
    const secretBytes = this.base32ToBytes(secret);
    
    // Create time-based counter
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeUInt32BE(0, 0);
    timeBuffer.writeUInt32BE(timeStep, 4);
    
    // Generate HMAC-SHA1
    const hmac = crypto.createHmac('sha1', secretBytes);
    hmac.update(timeBuffer);
    const hash = hmac.digest();
    
    // Dynamic truncation
    const offset = hash[hash.length - 1] & 0x0f;
    const code = ((hash[offset] & 0x7f) << 24) |
                ((hash[offset + 1] & 0xff) << 16) |
                ((hash[offset + 2] & 0xff) << 8) |
                (hash[offset + 3] & 0xff);
    
    // Return 6-digit code
    return (code % 1000000).toString().padStart(6, '0');
  }

  private static base32ToBytes(base32: string): Buffer {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    
    for (const char of base32.toUpperCase()) {
      const index = chars.indexOf(char);
      if (index === -1) continue;
      bits += index.toString(2).padStart(5, '0');
    }
    
    const bytes: number[] = [];
    for (let i = 0; i < bits.length; i += 8) {
      const byte = bits.slice(i, i + 8);
      if (byte.length === 8) {
        bytes.push(parseInt(byte, 2));
      }
    }
    
    return Buffer.from(bytes);
  }

  private static hashBackupCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  private static async verifyBackupCode(userId: number, code: string, hashedCodes: string[]): Promise<boolean> {
    const hashedInput = this.hashBackupCode(code);
    const isValid = hashedCodes.includes(hashedInput);
    
    if (isValid) {
      // Remove used backup code
      const updatedCodes = hashedCodes.filter(c => c !== hashedInput);
      await db.update(users)
        .set({ mfaBackupCodes: updatedCodes })
        .where(eq(users.id, userId));
    }
    
    return isValid;
  }

  private static async updateLastMfaUsed(userId: number): Promise<void> {
    await db.update(users)
      .set({ lastMfaUsed: new Date() })
      .where(eq(users.id, userId));
  }
}