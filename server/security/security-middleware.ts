import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import pino from 'pino';

const logger = pino({
  name: 'security',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

// Basic PII / secret redaction for logs (BR-OBS-02, GDPR, PCI-DSS)
const SENSITIVE_KEYS = [
  'password',
  'pass',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'authorization',
  'auth',
  'card',
  'pan',
  'cvv',
  'cvc',
  'ssn',
  'socialSecurityNumber',
  'email',
  'phone',
  'address',
  'name'
] as const;

type AnyObject = Record<string, any>;

const isSensitiveKey = (key: string) =>
  SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()));

export function redactForLog(input: any): any {
  if (input == null) return input;

  if (Array.isArray(input)) {
    return input.map(redactForLog);
  }

  if (typeof input === 'object') {
    const result: AnyObject = {};
    for (const [key, value] of Object.entries(input)) {
      if (isSensitiveKey(key)) {
        result[key] = '[REDACTED]';
      } else {
        result[key] = redactForLog(value);
      }
    }
    return result;
  }

  // For primitives we don't know are PII, keep as-is – keys control redaction
  return input;
}

// Enhanced Rate Limiting Configuration
export const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      error: options.message || 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    handler: (req, res) => {
      logger.warn({
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        method: req.method
      }, 'Rate limit exceeded');
      
      res.status(429).json({
        error: options.message || 'Too many requests from this IP, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.round(options.windowMs / 1000)
      });
    }
  });
};

// Rate Limiting Configurations
export const authRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again in 15 minutes',
  skipSuccessfulRequests: true
});

export const apiRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
});

export const strictRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10 // Limit each IP to 10 requests per minute
});

// Enhanced Helmet Configuration
// In development, use more permissive CSP to allow DevTools and hot reload
const isDevelopment = process.env.NODE_ENV === 'development';

export const securityHeaders = helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "wss:", "ws:", "http://localhost:*", "https://localhost:*"],
      baseSrc: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      objectSrc: ["'none'"],
      scriptSrcAttr: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  originAgentCluster: true,
  referrerPolicy: { policy: "no-referrer" },
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  xContentTypeOptions: false,
  xDnsPrefetchControl: { allow: false },
  xDownloadOptions: false,
  xFrameOptions: { action: "sameorigin" },
  xPermittedCrossDomainPolicies: false,
  xXssProtection: false
});

// Input Sanitization and Validation
export const sanitizeInput = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize and validate request body
      if (req.body) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
          const validationError = fromZodError(result.error);
          logger.warn({
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            method: req.method,
            errors: result.error.errors
          }, 'Input validation failed');
          
          return res.status(400).json({
            error: 'Invalid input data',
            details: validationError.message,
            code: 'VALIDATION_ERROR'
          });
        }
        req.body = result.data;
      }
      
      next();
    } catch (error) {
      logger.error({ error, ip: req.ip }, 'Input sanitization error');
      res.status(500).json({
        error: 'Internal server error',
        code: 'SANITIZATION_ERROR'
      });
    }
  };
};

// SQL Injection Prevention
export const preventSqlInjection = (req: Request, res: Response, next: NextFunction) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(;|\-\-|\/\*|\*\/|\bOR\b|\bAND\b).*(\b(SELECT|INSERT|UPDATE|DELETE)\b)/gi,
    /'[^']*'(\s*(;|--|\/\*|\*\/|\bOR\b|\bAND\b))/gi
  ];
  
  const checkForSqlInjection = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkForSqlInjection);
    }
    return false;
  };
  
  if (checkForSqlInjection(req.body) || checkForSqlInjection(req.query) || checkForSqlInjection(req.params)) {
    logger.warn({
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path,
      method: req.method,
      body: redactForLog(req.body),
      query: redactForLog(req.query),
      params: redactForLog(req.params)
    }, 'Potential SQL injection attempt detected');
    
    return res.status(400).json({
      error: 'Invalid characters detected in request',
      code: 'SECURITY_VIOLATION'
    });
  }
  
  next();
};

// XSS Prevention
export const preventXSS = (req: Request, res: Response, next: NextFunction) => {
  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]*\son\w+\s*=[^>]*>/gi
  ];
  
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      let sanitized = value;
      xssPatterns.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
      });
      return sanitized;
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = sanitizeValue(val);
      }
      return sanitized;
    }
    return value;
  };
  
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  
  next();
};

// Security Logging Middleware
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log security-relevant requests
  if (req.path.includes('/auth') || req.path.includes('/api/user') || req.path.includes('/admin')) {
    logger.info({
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }, 'Security-relevant request');
  }
  
  // Override res.json to log sensitive operations
  const originalJson = res.json;
  res.json = function(body: any) {
    const responseTime = Date.now() - startTime;
    
    if (res.statusCode >= 400) {
      logger.warn({
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode,
        responseTime,
        // Only log high-level error info, not full bodies
        errorCode: typeof body === 'object' ? (body.code || body.error || undefined) : undefined,
        errorMessage: typeof body === 'string' ? body.slice(0, 200) : body?.message
      }, 'Security alert: Error response');
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// API Key Validation
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    logger.warn({
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path
    }, 'Missing API key');
    
    return res.status(401).json({
      error: 'API key required',
      code: 'MISSING_API_KEY'
    });
  }
  
  // API key format validation
  if (!/^tv_[a-zA-Z0-9]{32}$/.test(apiKey)) {
    logger.warn({
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path,
      apiKey: apiKey.substring(0, 8) + '...'
    }, 'Invalid API key format');
    
    return res.status(401).json({
      error: 'Invalid API key format',
      code: 'INVALID_API_KEY'
    });
  }
  
  next();
};

// Session Security Enhancement
export const enhanceSessionSecurity = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    // Track session activity
    const sessionData = {
      userId: req.user.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      lastActivity: new Date().toISOString(),
      endpoint: req.path
    };
    
    // Store in session for anomaly detection
    if (!req.session.securityData) {
      req.session.securityData = {
        createdAt: new Date().toISOString(),
        ipHistory: [req.ip],
        userAgentHistory: [req.get('User-Agent') || ''],
        loginAttempts: 0
      };
    }
    
    // Detect IP changes (potential session hijacking)
    const currentIp = req.ip;
    const lastKnownIp = req.session.securityData.ipHistory[req.session.securityData.ipHistory.length - 1];
    
    if (currentIp !== lastKnownIp) {
      logger.warn({
        userId: req.user.id,
        oldIp: lastKnownIp,
        newIp: currentIp,
        userAgent: req.get('User-Agent')
      }, 'IP address change detected');
      
      req.session.securityData.ipHistory.push(currentIp);
      
      // Limit IP history to last 5 IPs
      if (req.session.securityData.ipHistory.length > 5) {
        req.session.securityData.ipHistory = req.session.securityData.ipHistory.slice(-5);
      }
    }
  }
  
  next();
};

export default {
  createRateLimiter,
  authRateLimit,
  apiRateLimit,
  strictRateLimit,
  securityHeaders,
  sanitizeInput,
  preventSqlInjection,
  preventXSS,
  securityLogger,
  validateApiKey,
  enhanceSessionSecurity
};