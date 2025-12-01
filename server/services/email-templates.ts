// Email templates for KYC verification results
// For MVP testing, these templates are ready but email sending is not implemented yet

export interface EmailTemplate {
  subject: string;
  body: string;
  html?: string;
}

export class EmailTemplateService {
  static getVerificationPassedTemplate(
    userName: string,
    submissionId: string
  ): EmailTemplate {
    return {
      subject: "Identity Verification Approved - TrustVerify",
      body: `Dear ${userName},

Your identity verification has been approved!

Submission ID: ${submissionId}

Your account has been verified and you can now enjoy full access to TrustVerify's secure transaction features.

Thank you for completing the verification process.

Best regards,
TrustVerify Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(128deg, #27ae60 0%, #0052cc 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success-badge { background: #27ae60; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Approved</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <div class="success-badge">✓ Verification Approved</div>
              <p>Your identity verification has been approved!</p>
              <p><strong>Submission ID:</strong> ${submissionId}</p>
              <p>Your account has been verified and you can now enjoy full access to TrustVerify's secure transaction features.</p>
              <p>Thank you for completing the verification process.</p>
              <p>Best regards,<br>TrustVerify Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  static getVerificationFailedTemplate(
    userName: string,
    submissionId: string,
    reason?: string
  ): EmailTemplate {
    return {
      subject: "Identity Verification Review Required - TrustVerify",
      body: `Dear ${userName},

Your identity verification requires additional review.

Submission ID: ${submissionId}
${reason ? `Reason: ${reason}` : ''}

We were unable to verify your identity based on the documents provided. This could be due to:
- Unclear or blurry document images
- Mismatch between selfie and ID photo
- Invalid or expired documents
- Other verification issues

Please review your submission and try again, or contact our support team for assistance.

Best regards,
TrustVerify Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(128deg, #d32030 0%, #ff6b6b 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .warning-badge { background: #d32030; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Review Required</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <div class="warning-badge">⚠ Review Required</div>
              <p>Your identity verification requires additional review.</p>
              <p><strong>Submission ID:</strong> ${submissionId}</p>
              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
              <p>We were unable to verify your identity based on the documents provided. This could be due to:</p>
              <ul>
                <li>Unclear or blurry document images</li>
                <li>Mismatch between selfie and ID photo</li>
                <li>Invalid or expired documents</li>
                <li>Other verification issues</li>
              </ul>
              <p>Please review your submission and try again, or contact our support team for assistance.</p>
              <p>Best regards,<br>TrustVerify Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  static getVerificationPendingTemplate(
    userName: string,
    submissionId: string
  ): EmailTemplate {
    return {
      subject: "Identity Verification Submitted - TrustVerify",
      body: `Dear ${userName},

Your identity verification has been submitted successfully!

Submission ID: ${submissionId}

Your submission is now under review. We will notify you once the review is complete, typically within 24-48 hours.

Thank you for your patience.

Best regards,
TrustVerify Team`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(128deg, #436cc8 0%, #0052cc 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-badge { background: #436cc8; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verification Submitted</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <div class="info-badge">⏳ Under Review</div>
              <p>Your identity verification has been submitted successfully!</p>
              <p><strong>Submission ID:</strong> ${submissionId}</p>
              <p>Your submission is now under review. We will notify you once the review is complete, typically within 24-48 hours.</p>
              <p>Thank you for your patience.</p>
              <p>Best regards,<br>TrustVerify Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  // Send email using the configured email service
  static async sendEmail(
    to: string,
    template: EmailTemplate
  ): Promise<boolean> {
    const { emailService } = await import('./email-service');
    return emailService.sendEmail(to, template);
  }
}

