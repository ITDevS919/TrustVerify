/**
 * Admin MFA and SSO Middleware
 * Requires MFA for admin users and supports SSO integration
 */

import { Request, Response, NextFunction } from 'express';
import { MFAService } from '../security/mfa';
import { config } from '../config';
import { siemService } from '../services/siem-integration';
import pino from 'pino';

const logger = pino({
  name: 'admin-mfa',
  level: config.LOG_LEVEL || 'info'
});

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email?: string;
    isAdmin?: boolean;
    mfaEnabled?: boolean;
    ssoProvider?: string;
  };
  mfaVerified?: boolean;
  ssoVerified?: boolean;
}

/**
 * Check if user is admin
 */
function isAdmin(user: any): boolean {
  return user?.isAdmin === true || user?.email?.includes('@trustverify.com') || false;
}

/**
 * Require MFA for admin users
 */
export async function requireAdminMFA(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = req.user as any;

  // Only enforce MFA for admin users
  if (!isAdmin(user)) {
    return next();
  }

  // Check if MFA is enabled for this user
  const mfaEnabled = await MFAService.isMFAEnabled(user.id);
  
  if (!mfaEnabled) {
    logger.warn({ userId: user.id, email: user.email }, 'Admin user attempted access without MFA enabled');
    
    await siemService.logSecurityEvent(
      'admin_access_denied_no_mfa',
      'high',
      user.id,
      req.ip,
      { reason: 'MFA not enabled' }
    );

    return res.status(403).json({
      error: 'MFA required',
      message: 'Multi-factor authentication is required for admin access. Please enable MFA in your account settings.',
      requiresMFA: true,
    });
  }

  // Check if MFA was verified in this session
  // In a real implementation, you would store this in the session
  const sessionMfaVerified = (req.session as any)?.mfaVerified === true;
  
  if (!sessionMfaVerified) {
    // Check for MFA token in header or body
    const mfaToken = req.headers['x-mfa-token'] as string || req.body?.mfaToken;
    
    if (!mfaToken) {
      return res.status(403).json({
        error: 'MFA verification required',
        message: 'Please provide MFA token',
        requiresMFA: true,
      });
    }

    // Verify MFA token
    const isValid = await MFAService.verifyMFA(user.id, mfaToken);
    
    if (!isValid) {
      logger.warn({ userId: user.id }, 'Invalid MFA token for admin access');
      
      await siemService.logSecurityEvent(
        'admin_mfa_verification_failed',
        'high',
        user.id,
        req.ip,
        {}
      );

      return res.status(403).json({
        error: 'Invalid MFA token',
        message: 'The provided MFA token is invalid or expired',
      });
    }

    // Mark MFA as verified in session
    (req.session as any).mfaVerified = true;
    (req.session as any).mfaVerifiedAt = new Date();
    
    await siemService.logAuthEvent(
      'mfa_verified',
      user.id,
      user.email,
      req.ip,
      true,
      { adminAccess: true }
    );
  }

  req.mfaVerified = true;
  next();
}

/**
 * SSO verification middleware (for supported providers)
 */
export async function requireSSO(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = req.user as any;

  // Only enforce SSO for admin users if configured
  if (!isAdmin(user) || !config.SSO_PROVIDER) {
    return next();
  }

  // Check if user authenticated via SSO
  const authProvider = user.authProvider || 'local';
  const ssoProviders = ['okta', 'auth0', 'azure-ad', 'google-workspace'];
  
  if (ssoProviders.includes(authProvider)) {
    req.ssoVerified = true;
    return next();
  }

  // If SSO is required but user didn't use SSO
  logger.warn({ userId: user.id, authProvider }, 'Admin user attempted access without SSO');
  
  await siemService.logSecurityEvent(
    'admin_access_denied_no_sso',
    'high',
    user.id,
    req.ip,
    { requiredProvider: config.SSO_PROVIDER, actualProvider: authProvider }
  );

  return res.status(403).json({
    error: 'SSO required',
    message: `Single Sign-On (${config.SSO_PROVIDER}) is required for admin access`,
    requiresSSO: true,
    ssoProvider: config.SSO_PROVIDER,
  });
}

/**
 * Combined admin security middleware (MFA + SSO)
 */
export const requireAdminSecurity = [
  requireAdminMFA,
  requireSSO,
];

/**
 * Setup MFA for admin user
 */
export async function setupAdminMFA(userId: number): Promise<{
  secret: string;
  qrCode: string;
  backupCodes: string[];
}> {
  const mfaToken = await MFAService.generateMFASecret(userId);
  
  logger.info({ userId }, 'MFA setup initiated for admin user');
  
  await siemService.logSecurityEvent(
    'admin_mfa_setup',
    'medium',
    userId,
    undefined,
    {}
  );

  return mfaToken;
}

/**
 * Enable MFA for admin user
 */
export async function enableAdminMFA(
  userId: number,
  secret: string,
  backupCodes: string[],
  totpCode: string
): Promise<boolean> {
  const enabled = await MFAService.enableMFA(userId, secret, backupCodes, totpCode);
  
  if (enabled) {
    logger.info({ userId }, 'MFA enabled for admin user');
    
    await siemService.logSecurityEvent(
      'admin_mfa_enabled',
      'medium',
      userId,
      undefined,
      {}
    );
  }
  
  return enabled;
}

