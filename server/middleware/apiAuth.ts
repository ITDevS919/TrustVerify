import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import { storage } from '../storage';

export interface AuthenticatedRequest extends Request {
  apiKey?: {
    id: number;
    developerId: number;
    name: string;
    permissions: string[];
  };
  developer?: {
    id: number;
    userId: number;
    status: string;
    monthlyQuota: number;
    currentUsage: number;
  };
}

export async function validateApiKey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid API key' });
  }

  const apiKey = authHeader.substring(7);
  
  if (!apiKey || apiKey.length < 32) {
    return res.status(401).json({ error: 'Invalid API key format' });
  }

  try {
    // Hash the provided key to compare with stored hash
    const keyHash = createHash('sha256').update(apiKey).digest('hex');
    
    const storedKey = await storage.getApiKeyByHash(keyHash);
    
    if (!storedKey || !storedKey.isActive) {
      return res.status(401).json({ error: 'Invalid or revoked API key' });
    }

    // Check if key has expired
    if (storedKey.expiresAt && new Date() > storedKey.expiresAt) {
      return res.status(401).json({ error: 'API key has expired' });
    }

    // Get developer account
    const developer = await storage.getDeveloperAccount(storedKey.developerId);
    
    if (!developer || developer.status !== 'approved') {
      return res.status(403).json({ error: 'Developer account not approved' });
    }

    // Check quota
    if (developer.currentUsage >= developer.monthlyQuota) {
      return res.status(429).json({ 
        error: 'Monthly quota exceeded',
        quota: developer.monthlyQuota,
        usage: developer.currentUsage
      });
    }

    // Attach key and developer info to request
    req.apiKey = {
      id: storedKey.id,
      developerId: storedKey.developerId,
      name: storedKey.name,
      permissions: Array.isArray(storedKey.permissions) ? storedKey.permissions : []
    };
    
    req.developer = {
      id: developer.id,
      userId: developer.userId,
      status: developer.status,
      monthlyQuota: developer.monthlyQuota,
      currentUsage: developer.currentUsage
    };

    // Update last used timestamp
    await storage.updateApiKeyLastUsed(storedKey.id);

    next();
  } catch (error) {
    console.error('API key validation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.apiKey) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!req.apiKey.permissions.includes(permission) && !req.apiKey.permissions.includes('*')) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission,
        granted: req.apiKey.permissions
      });
    }

    next();
  };
}

export async function logApiUsage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  // Capture original res.json to log response
  const originalJson = res.json;
  let responseSize = 0;
  
  res.json = function(body) {
    responseSize = JSON.stringify(body).length;
    return originalJson.call(this, body);
  };

  // Log after response is sent
  res.on('finish', async () => {
    if (req.apiKey && req.developer) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      try {
        await storage.createApiUsageLog({
          apiKeyId: req.apiKey.id,
          developerId: req.developer.id,
          endpoint: req.path,
          method: req.method,
          statusCode: res.statusCode,
          responseTime,
          userAgent: req.get('User-Agent') || null,
          ipAddress: req.ip || req.connection.remoteAddress || null,
          requestSize: req.get('Content-Length') ? parseInt(req.get('Content-Length')!) : 0,
          responseSize,
          errorMessage: res.statusCode >= 400 ? res.statusMessage : null
        });

        // Update usage count
        await storage.updateDeveloperUsage(req.developer.id, req.developer.currentUsage + 1);
      } catch (error) {
        console.error('Failed to log API usage:', error);
      }
    }
  });

  next();
}

export function requireDeveloperAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}