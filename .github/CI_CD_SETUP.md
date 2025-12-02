# CI/CD Setup Guide

This guide explains how to configure GitHub Secrets for the CI/CD pipeline.

## Overview

The CI/CD pipeline requires environment variables to run tests and deploy. Since `.env` files are not committed to the repository (for security reasons), we use GitHub Secrets for sensitive values and create minimal `.env` files in CI for testing.

## Required GitHub Secrets

For the **production deployment** job, you need to set up the following secrets in your GitHub repository:

### Required Secrets (Production)

1. **DATABASE_URL** - PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database`
   - Example: `postgresql://user:pass@db.example.com:5432/trustverify`

2. **SESSION_SECRET** - Session encryption secret (minimum 32 characters)
   - Generate with: `openssl rand -base64 32`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

3. **JWT_SECRET** - JWT token secret (minimum 32 characters)
   - Generate with: `openssl rand -base64 32`

4. **ENCRYPTION_KEY** - Data encryption key (minimum 32 characters)
   - Generate with: `openssl rand -base64 32`

### Email Service (At least one required)

5. **SENDGRID_API_KEY** - SendGrid API key for email service
   - OR use AWS SES or SMTP (configure in secrets)

### Cloud Storage (At least one required)

6. **AWS_S3_BUCKET** - AWS S3 bucket name
7. **AWS_S3_ACCESS_KEY_ID** - AWS access key ID
8. **AWS_S3_SECRET_ACCESS_KEY** - AWS secret access key
9. **AWS_S3_REGION** - AWS region (default: `us-east-1`)

### Optional Secrets

- **PORT** - Server port (default: `5000`)
- **API_VERSION** - API version (default: `v1`)
- **GDPR_ENABLED** - GDPR compliance (default: `true`)
- **WAF_ENABLED** - WAF enabled (default: `false`)
- **LOG_LEVEL** - Logging level (default: `info`)

## How to Set GitHub Secrets

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## CI/CD Jobs Configuration

### Test Jobs (No Secrets Required)

The following jobs automatically create a minimal `.env` file with test values:
- `lint-and-type-check`
- `unit-tests`
- `integration-tests`
- `e2e-tests`
- `load-tests`
- `security-tests`
- `build`

These jobs use dummy/test values and don't require real secrets.

### Production Deployment (Secrets Required)

The `deploy` job requires the secrets listed above. If secrets are not set, the deployment will fail.

## Testing the Setup

1. Push a commit to the `main` branch
2. Check the Actions tab in GitHub
3. Verify that all jobs pass
4. If deployment fails, check that all required secrets are set

## Security Best Practices

1. **Never commit `.env` files** - They are in `.gitignore` for a reason
2. **Rotate secrets regularly** - Update secrets every 90 days
3. **Use different secrets for different environments** - Development, staging, and production should have separate secrets
4. **Limit secret access** - Only grant access to necessary team members
5. **Use environment-specific secrets** - Use GitHub Environments to scope secrets to specific environments

## Troubleshooting

### Job Fails with "Configuration validation failed"

- Check that all required secrets are set
- Verify that secrets meet minimum requirements (e.g., SESSION_SECRET must be at least 32 characters)
- Check the Actions logs for specific validation errors

### Database Connection Errors

- Verify DATABASE_URL is correct
- Check that the database is accessible from GitHub Actions
- Ensure database credentials are correct

### Email/Storage Service Errors

- Verify that at least one email service secret is set (SENDGRID_API_KEY, AWS_SES_*, or SMTP_*)
- Verify that at least one cloud storage secret is set (AWS_S3_* or CLOUDFLARE_R2_*)
- Check that API keys are valid and not expired

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)

