// Email service for sending KYC verification results
// Supports multiple providers: SendGrid, AWS SES, SMTP, or console logging (for MVP)

import { EmailTemplate } from './email-templates';

export interface EmailConfig {
  provider: 'sendgrid' | 'ses' | 'smtp' | 'console';
  apiKey?: string;
  fromEmail?: string;
  fromName?: string;
  // SMTP config
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  // AWS SES config
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
}

class EmailService {
  private config: EmailConfig;

  constructor() {
    // Load config from environment variables
    this.config = {
      provider: (process.env.EMAIL_PROVIDER as any) || 'console',
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.EMAIL_FROM || 'noreply@trustverify.com',
      fromName: process.env.EMAIL_FROM_NAME || 'TrustVerify',
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      smtpUser: process.env.SMTP_USER,
      smtpPassword: process.env.SMTP_PASSWORD,
      awsRegion: process.env.AWS_REGION,
      awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
      awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    };
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'sendgrid':
          return await this.sendViaSendGrid(to, template);
        case 'ses':
          return await this.sendViaSES(to, template);
        case 'smtp':
          return await this.sendViaSMTP(to, template);
        case 'console':
        default:
          return await this.sendViaConsole(to, template);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  private async sendViaSendGrid(to: string, template: EmailTemplate): Promise<boolean> {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key not configured');
    }

    try {
      const sgMail = await import('@sendgrid/mail');
      sgMail.setApiKey(this.config.apiKey);

      await sgMail.send({
        to,
        from: {
          email: this.config.fromEmail!,
          name: this.config.fromName,
        },
        subject: template.subject,
        text: template.body,
        html: template.html,
      });

      return true;
    } catch (error) {
      console.error('SendGrid error:', error);
      throw error;
    }
  }

  private async sendViaSES(to: string, template: EmailTemplate): Promise<boolean> {
    if (!this.config.awsAccessKeyId || !this.config.awsSecretAccessKey) {
      throw new Error('AWS SES credentials not configured');
    }

    try {
      const AWS = await import('aws-sdk');
      const ses = new AWS.SES({
        region: this.config.awsRegion || 'us-east-1',
        accessKeyId: this.config.awsAccessKeyId,
        secretAccessKey: this.config.awsSecretAccessKey,
      });

      await ses.sendEmail({
        Source: `${this.config.fromName} <${this.config.fromEmail}>`,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: template.subject },
          Body: {
            Text: { Data: template.body },
            Html: { Data: template.html || template.body },
          },
        },
      }).promise();

      return true;
    } catch (error) {
      console.error('AWS SES error:', error);
      throw error;
    }
  }

  private async sendViaSMTP(to: string, template: EmailTemplate): Promise<boolean> {
    if (!this.config.smtpHost || !this.config.smtpUser || !this.config.smtpPassword) {
      throw new Error('SMTP configuration incomplete');
    }

    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: this.config.smtpHost,
        port: this.config.smtpPort,
        secure: this.config.smtpPort === 465,
        auth: {
          user: this.config.smtpUser,
          pass: this.config.smtpPassword,
        },
      });

      await transporter.sendMail({
        from: `${this.config.fromName} <${this.config.fromEmail}>`,
        to,
        subject: template.subject,
        text: template.body,
        html: template.html || template.body,
      });

      return true;
    } catch (error) {
      console.error('SMTP error:', error);
      throw error;
    }
  }

  private async sendViaConsole(to: string, template: EmailTemplate): Promise<boolean> {
    // For MVP testing - just log the email
    console.log('='.repeat(60));
    console.log('EMAIL (MVP Testing Mode)');
    console.log('='.repeat(60));
    console.log('To:', to);
    console.log('Subject:', template.subject);
    console.log('Body:', template.body);
    if (template.html) {
      console.log('HTML:', template.html.substring(0, 200) + '...');
    }
    console.log('='.repeat(60));
    
    // In a real scenario, you might want to save these to a file or database
    // for testing purposes
    return true;
  }
}

export const emailService = new EmailService();

