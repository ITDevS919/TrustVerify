import { z } from "zod";

/**
 * Comprehensive environment variable validation schema
 * Validates all required and optional configuration with proper types and constraints
 */
const configSchema = z.object({
  // Core Application
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("5000"),
  
  // Database
  DATABASE_URL: z.string().url("Invalid database URL"),
  
  // Security
  SESSION_SECRET: z.string().min(32, "Session secret must be at least 32 characters"),
  JWT_SECRET: z.string().min(32).optional(),
  ENCRYPTION_KEY: z.string().min(32).optional(),
  
  // OAuth Providers
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  
  // Email Service
  SENDGRID_API_KEY: z.string().optional(),
  AWS_SES_REGION: z.string().optional(),
  AWS_SES_ACCESS_KEY_ID: z.string().optional(),
  AWS_SES_SECRET_ACCESS_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // Payment Processing
  STRIPE_SECRET_KEY: z.string().optional(),
  VITE_STRIPE_PUBLIC_KEY: z.string().optional(),
  
  // Cloud Storage (AWS S3)
  AWS_S3_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  AWS_S3_ACCESS_KEY_ID: z.string().optional(),
  AWS_S3_SECRET_ACCESS_KEY: z.string().optional(),
  
  // Cloud Storage (Cloudflare R2)
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().optional(),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().optional(),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().optional(),
  CLOUDFLARE_R2_BUCKET: z.string().optional(),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),
  
  // Virus Scanning
  VIRUS_SCAN_API_KEY: z.string().optional(),
  VIRUS_SCAN_PROVIDER: z.enum(["clamav", "cloudflare", "aws-guardduty"]).optional(),
  
  // Secret Management
  AWS_SECRETS_MANAGER_REGION: z.string().optional(),
  AWS_SECRETS_MANAGER_SECRET_NAME: z.string().optional(),
  HASHICORP_VAULT_ADDR: z.string().url().optional(),
  HASHICORP_VAULT_TOKEN: z.string().optional(),
  
  // SIEM Integration
  SIEM_ENDPOINT: z.string().url().optional(),
  SIEM_API_KEY: z.string().optional(),
  SIEM_PROVIDER: z.enum(["splunk", "datadog", "sentry", "custom"]).optional(),
  
  // WAF Configuration
  WAF_ENABLED: z.string().transform((val) => val === "true").default("false"),
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  
  // SSO Configuration
  SSO_PROVIDER: z.enum(["okta", "auth0", "azure-ad", "google-workspace"]).optional(),
  SSO_CLIENT_ID: z.string().optional(),
  SSO_CLIENT_SECRET: z.string().optional(),
  SSO_DOMAIN: z.string().optional(),
  
  // GDPR Compliance
  DATA_RETENTION_DAYS: z.string().transform(Number).default("2555"), // 7 years default
  GDPR_ENABLED: z.string().transform((val) => val === "true").default("true"),
  
  // API Configuration
  API_VERSION: z.string().default("v1"),
  API_RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default("900000"), // 15 minutes
  API_RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default("100"),
  API_MAX_PAYLOAD_SIZE_MB: z.string().transform(Number).default("10"),
  
  // Session Configuration
  SESSION_TIMEOUT_MINUTES: z.string().transform(Number).default("30"),
  SESSION_EXTEND_ON_ACTIVITY: z.string().transform((val) => val === "true").default("true"),
  
  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  LOG_FORMAT: z.enum(["json", "pretty"]).default("json"),
  
  // Caching
  REDIS_URL: z.string().url().optional(),
  CACHE_TTL_DEFAULT: z.string().transform(Number).default("3600"),
  
  // Monitoring
  METRICS_ENABLED: z.string().transform((val) => val === "true").default("true"),
  METRICS_PORT: z.string().transform(Number).default("9090"),
  PROMETHEUS_ENABLED: z.string().transform((val) => val === "true").default("false"),
  
  // Health Checks
  HEALTH_CHECK_INTERVAL: z.string().transform(Number).default("30000"), // 30 seconds
  HEALTH_CHECK_TIMEOUT: z.string().transform(Number).default("5000"), // 5 seconds
  
  // Multi-Region
  REGION: z.string().default("us-east-1"),
  PRIMARY_REGION: z.string().optional(),
  FAILOVER_ENABLED: z.string().transform((val) => val === "true").default("false"),
  
  // Deployment
  DEPLOYMENT_VERSION: z.string().optional(),
  DEPLOYMENT_ENVIRONMENT: z.string().default("development"),
  ROLLBACK_ENABLED: z.string().transform((val) => val === "true").default("true"),
}).refine(
  (data) => {
    // Validate that at least one cloud storage provider is configured if in production
    if (data.NODE_ENV === "production") {
      const hasS3 = !!(data.AWS_S3_BUCKET && data.AWS_S3_ACCESS_KEY_ID);
      const hasR2 = !!(data.CLOUDFLARE_R2_BUCKET && data.CLOUDFLARE_R2_ACCESS_KEY_ID);
      return hasS3 || hasR2;
    }
    return true;
  },
  {
    message: "At least one cloud storage provider (AWS S3 or Cloudflare R2) must be configured in production",
    path: ["AWS_S3_BUCKET"],
  }
).refine(
  (data) => {
    // Validate that at least one email provider is configured if in production
    if (data.NODE_ENV === "production") {
      const hasSendGrid = !!data.SENDGRID_API_KEY;
      const hasSES = !!(data.AWS_SES_REGION && data.AWS_SES_ACCESS_KEY_ID);
      const hasSMTP = !!(data.SMTP_HOST && data.SMTP_USER);
      return hasSendGrid || hasSES || hasSMTP;
    }
    return true;
  },
  {
    message: "At least one email service provider must be configured in production",
    path: ["SENDGRID_API_KEY"],
  }
);

export type Config = z.infer<typeof configSchema>;

function validateConfig(): Config {
  try {
    const validated = configSchema.parse(process.env);
    
    // Log validation success in development
    if (validated.NODE_ENV === "development") {
      console.log("✅ Configuration validated successfully");
      console.log(`   Environment: ${validated.NODE_ENV}`);
      console.log(`   API Version: ${validated.API_VERSION}`);
      console.log(`   GDPR Enabled: ${validated.GDPR_ENABLED}`);
      console.log(`   WAF Enabled: ${validated.WAF_ENABLED}`);
    }
    
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Configuration validation failed:");
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        console.error(`  ${path}: ${err.message}`);
        if (err.code === "invalid_type") {
          console.error(`    Expected: ${err.expected}, Received: ${err.received}`);
        }
      });
      console.error("\n💡 Please check your .env file and ensure all required variables are set correctly.");
      process.exit(1);
    }
    throw error;
  }
}

export const config = validateConfig();