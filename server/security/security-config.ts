import { z } from 'zod';

// Enhanced security configuration schema
// Note: SESSION_SECRET validation is conditional - 64 chars for production, 32 for test/dev
const securityConfigSchema = z.object({
  // Core Security
  HTTPS_ONLY: z.string().transform(val => val === 'true').default('true'),
  FORCE_SSL: z.string().transform(val => val === 'true').default('true'),
  
  // Session Security
  // In test/development: minimum 32 characters, in production: minimum 64 characters
  SESSION_SECRET: z.string().refine(
    (val) => {
      const isProduction = process.env.NODE_ENV === 'production' || process.env.SECURITY_LEVEL === 'production';
      const minLength = isProduction ? 64 : 32;
      return val.length >= minLength;
    },
    (_val) => {
      const isProduction = process.env.NODE_ENV === 'production' || process.env.SECURITY_LEVEL === 'production';
      const minLength = isProduction ? 64 : 32;
      return {
        message: `Session secret must be at least ${minLength} characters${isProduction ? ' for production' : ''}`
      };
    }
  ),
  SESSION_LIFETIME: z.string().transform(Number).default('3600000'), // 1 hour
  SESSION_SECURE: z.string().transform(val => val === 'true').default('true'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().transform(Number).default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  AUTH_RATE_LIMIT: z.string().transform(Number).default('5'),
  
  // Password Policy
  MIN_PASSWORD_LENGTH: z.string().transform(Number).default('12'),
  REQUIRE_SPECIAL_CHARS: z.string().transform(val => val === 'true').default('true'),
  REQUIRE_NUMBERS: z.string().transform(val => val === 'true').default('true'),
  REQUIRE_UPPERCASE: z.string().transform(val => val === 'true').default('true'),
  
  // Two-Factor Authentication
  ENABLE_2FA: z.string().transform(val => val === 'true').default('false'),
  TOTP_ISSUER: z.string().default('TrustVerify'),
  
  // API Security
  API_KEY_LENGTH: z.string().transform(Number).default('32'),
  API_KEY_PREFIX: z.string().default('tv_'),
  JWT_SECRET: z.string().min(32).optional(),
  JWT_EXPIRY: z.string().default('24h'),
  
  // Encryption
  ENCRYPTION_ALGORITHM: z.string().default('aes-256-gcm'),
  ENCRYPTION_KEY: z.string().min(32).optional(),
  
  // Audit & Logging
  AUDIT_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  AUDIT_RETENTION_DAYS: z.string().transform(Number).default('2555'), // 7 years
  SECURITY_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('warn'),
  
  // Compliance
  GDPR_ENABLED: z.string().transform(val => val === 'true').default('true'),
  SOC2_COMPLIANCE: z.string().transform(val => val === 'true').default('true'),
  PCI_COMPLIANCE: z.string().transform(val => val === 'true').default('false'),
  
  // Infrastructure Security
  WAF_ENABLED: z.string().transform(val => val === 'true').default('false'),
  DDOS_PROTECTION: z.string().transform(val => val === 'true').default('false'),
  
  // Development vs Production
  SECURITY_LEVEL: z.enum(['development', 'staging', 'production']).default('development'),
  
  // External Security Services
  CLOUDFLARE_API_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  
  // Database Security
  DB_SSL_MODE: z.enum(['disable', 'require', 'verify-ca', 'verify-full']).default('require'),
  DB_ENCRYPTION: z.string().transform(val => val === 'true').default('true'),
  
  // File Upload Security
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,application/pdf'),
  VIRUS_SCANNING: z.string().transform(val => val === 'true').default('false'),
  
  // Network Security
  CORS_ORIGINS: z.string().default(''),
  TRUSTED_PROXIES: z.string().default(''),
  
  // Monitoring & Alerting
  SECURITY_MONITORING: z.string().transform(val => val === 'true').default('true'),
  ALERT_WEBHOOK: z.string().url().optional(),
  SECURITY_EMAIL: z.string().email().optional(),
});

export type SecurityConfig = z.infer<typeof securityConfigSchema>;

// Validate and export security configuration
function validateSecurityConfig(): SecurityConfig {
  try {
    const config = securityConfigSchema.parse(process.env);
    
    // Additional production validations
    if (config.SECURITY_LEVEL === 'production') {
      if (!config.HTTPS_ONLY) {
        throw new Error('HTTPS is required in production');
      }
      if (!config.SESSION_SECURE) {
        throw new Error('Secure sessions are required in production');
      }
      if (config.MIN_PASSWORD_LENGTH < 12) {
        throw new Error('Minimum password length must be 12+ characters in production');
      }
    }
    
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Don't exit in test environment - allow tests to continue with validation errors
      // Tests should set up their own environment variables
      if (process.env.NODE_ENV === 'test') {
        console.warn('⚠️  Security configuration validation failed in test mode - using test defaults');
        // Return a minimal valid config for tests using safeParse with defaults
        const testDefaults = {
          HTTPS_ONLY: 'false',
          FORCE_SSL: 'false',
          SESSION_SECRET: process.env.SESSION_SECRET || 'test-session-secret-minimum-32-characters-long-for-testing',
          SESSION_LIFETIME: '3600000',
          SESSION_SECURE: 'false',
          RATE_LIMIT_WINDOW: '900000',
          RATE_LIMIT_MAX: '100',
          AUTH_RATE_LIMIT: '5',
          MIN_PASSWORD_LENGTH: '12',
          REQUIRE_SPECIAL_CHARS: 'true',
          REQUIRE_NUMBERS: 'true',
          REQUIRE_UPPERCASE: 'true',
          ENABLE_2FA: 'false',
          TOTP_ISSUER: 'TrustVerify',
          API_KEY_LENGTH: '32',
          API_KEY_PREFIX: 'tv_',
          JWT_EXPIRY: '24h',
          ENCRYPTION_ALGORITHM: 'aes-256-gcm',
          AUDIT_LOG_LEVEL: 'error' as const,
          AUDIT_RETENTION_DAYS: '2555',
          SECURITY_LOG_LEVEL: 'error' as const,
          GDPR_ENABLED: 'false',
          SOC2_COMPLIANCE: 'false',
          PCI_COMPLIANCE: 'false',
          WAF_ENABLED: 'false',
          DDOS_PROTECTION: 'false',
          SECURITY_LEVEL: 'development' as const,
          DB_SSL_MODE: 'disable' as const,
          DB_ENCRYPTION: 'false',
          MAX_FILE_SIZE: '10485760',
          ALLOWED_FILE_TYPES: 'image/jpeg,image/png,application/pdf',
          VIRUS_SCANNING: 'false',
          CORS_ORIGINS: '',
          TRUSTED_PROXIES: '',
          SECURITY_MONITORING: 'false',
        };
        // Use safeParse to get a valid config object
        const testConfig = securityConfigSchema.safeParse(testDefaults);
        if (testConfig.success) {
          return testConfig.data;
        }
        // Fallback: return defaults even if validation fails in test mode
        return securityConfigSchema.parse(testDefaults);
      }
      
      console.error('❌ Security configuration validation failed:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1); // Only exit in non-test environments
    }
    throw error;
  }
}

export const securityConfig = validateSecurityConfig();

// Security recommendations based on environment
export function getSecurityRecommendations(): string[] {
  const recommendations: string[] = [];
  
  if (!securityConfig.ENABLE_2FA) {
    recommendations.push('Enable Two-Factor Authentication for enhanced security');
  }
  
  if (!securityConfig.WAF_ENABLED && securityConfig.SECURITY_LEVEL === 'production') {
    recommendations.push('Enable Web Application Firewall (WAF) for production');
  }
  
  if (!securityConfig.DDOS_PROTECTION && securityConfig.SECURITY_LEVEL === 'production') {
    recommendations.push('Enable DDoS protection for production environments');
  }
  
  if (!securityConfig.VIRUS_SCANNING && securityConfig.SECURITY_LEVEL === 'production') {
    recommendations.push('Enable virus scanning for file uploads');
  }
  
  if (securityConfig.SESSION_LIFETIME > 7200000) { // 2 hours
    recommendations.push('Consider reducing session lifetime for better security');
  }
  
  if (!securityConfig.SECURITY_EMAIL) {
    recommendations.push('Configure security alert email for incident notifications');
  }
  
  return recommendations;
}

// Security metrics for monitoring
export interface SecurityMetrics {
  configurationScore: number;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
}

export function calculateSecurityScore(): SecurityMetrics {
  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  let score = 100;
  
  // Critical security checks
  if (!securityConfig.HTTPS_ONLY) {
    criticalIssues.push('HTTPS not enforced');
    score -= 20;
  }
  
  if (!securityConfig.SESSION_SECURE && securityConfig.SECURITY_LEVEL === 'production') {
    criticalIssues.push('Insecure session configuration');
    score -= 15;
  }
  
  if (securityConfig.MIN_PASSWORD_LENGTH < 12) {
    criticalIssues.push('Weak password policy');
    score -= 10;
  }
  
  // Warning level checks
  if (!securityConfig.ENABLE_2FA) {
    warnings.push('Two-Factor Authentication disabled');
    score -= 5;
  }
  
  if (securityConfig.AUTH_RATE_LIMIT > 10) {
    warnings.push('Authentication rate limit too permissive');
    score -= 5;
  }
  
  if (!securityConfig.WAF_ENABLED && securityConfig.SECURITY_LEVEL === 'production') {
    warnings.push('Web Application Firewall not enabled');
    score -= 10;
  }
  
  return {
    configurationScore: Math.max(score, 0),
    criticalIssues,
    warnings,
    recommendations: getSecurityRecommendations()
  };
}

export default {
  securityConfig,
  getSecurityRecommendations,
  calculateSecurityScore
};