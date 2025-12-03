import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertTransactionSchema, 
  insertMessageSchema, 
  insertScamReportSchema, 
  insertDisputeSchema,
  insertDeveloperAccountSchema
} from "./shared/schema.ts";
import crypto from 'crypto';
import { validateQuery, paginationSchema } from "./middleware/validation";
import developerRoutes from "./routes/developer";
import { validateApiKey, logApiUsage } from "./middleware/apiAuth";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { GDPRService } from "./security/compliance.js";

// Set up multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Serve uploaded files
  app.use('/api/uploads', (req, res, _next) => {
    const filename = req.path.split('/').pop();
    if (!filename) {
      return res.status(404).json({ message: 'File not found' });
    }
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });
  
  // Security functionality - implemented with try-catch for graceful degradation
  let securityModules;
  try {
    const rbacModule = await import("./security/rbac.js");
    const middlewareModule = await import("./security/security-middleware.js");
    const auditModule = await import("./security/audit-logger.js");
    const pentestModule = await import("./security/penetration-testing.js");
    const configModule = await import("./security/security-config.js");
    
    securityModules = {
      requirePermission: rbacModule.requirePermission,
      requireRole: rbacModule.requireRole,
      Role: rbacModule.Role,
      Permission: rbacModule.Permission,
      strictRateLimit: middlewareModule.strictRateLimit,
      AuditService: auditModule.default,
      AuditEventType: auditModule.AuditEventType,
      PenetrationTestSuite: pentestModule.default,
      calculateSecurityScore: configModule.calculateSecurityScore
    };
  } catch (error) {
    console.warn('Security modules not available, running with basic functionality');
    securityModules = null;
  }
  
  // Security monitoring routes - with graceful fallback
  app.get("/api/security/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Basic admin check
    if (!req.user?.email?.includes('@trustverify.com')) {
      return res.sendStatus(403);
    }
    
    if (securityModules) {
      try {
        const securityMetrics = securityModules.calculateSecurityScore();
        
        securityModules.AuditService.logAdminAction('security_status_check', req.user, req, {
          metadata: { securityScore: securityMetrics.configurationScore }
        });
        
        res.json({
          ...securityMetrics,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        });
      } catch (error) {
        res.status(500).json({ error: 'Security status unavailable' });
      }
    } else {
      res.json({
        configurationScore: 85,
        criticalIssues: [],
        warnings: ['Security modules not fully loaded'],
        recommendations: ['Complete security module configuration'],
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    }
  });
  
  app.post("/api/security/pentest", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Super admin check
    if (req.user?.email !== 'admin@trustverify.com') {
      return res.sendStatus(403);
    }
    
    if (securityModules) {
      try {
        const testSuite = new securityModules.PenetrationTestSuite();
        const results = await testSuite.runAllTests(req);
        
        securityModules.AuditService.logAdminAction('penetration_test_executed', req.user, req, {
          metadata: { 
            totalTests: results.length,
            criticalIssues: testSuite.getCriticalIssues().length
          },
          riskLevel: 'high'
        });
        
        res.json({
          results,
          summary: {
            totalTests: results.length,
            criticalIssues: testSuite.getCriticalIssues(),
            highPriorityIssues: testSuite.getHighPriorityIssues()
          },
          timestamp: new Date().toISOString()
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(503).json({ error: 'Penetration testing modules not available' });
    }
  });

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  // Middleware to check admin access
  const requireAdmin = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // KYC Verification Routes - MVP Testing Version
  app.post("/api/kyc/submit", requireAuth, upload.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 },
    { name: 'selfieImage', maxCount: 1 }
  ]), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { 
        firstName, 
        lastName, 
        email, 
        phone, 
        documentType, 
        documentNumber,
        userType
      } = req.body;

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.frontImage || !files.selfieImage) {
        return res.status(400).json({ message: "Front ID image and selfie are required" });
      }

      if (!documentType) {
        return res.status(400).json({ message: "Document type is required" });
      }

      // Get user info
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Import KYC storage service
      const { kycStorage } = await import("./services/kyc-storage");

      // Save files and create submission
      const frontImagePath = files.frontImage[0].path;
      const backImagePath = files.backImage?.[0]?.path;
      const selfieImagePath = files.selfieImage[0].path;

      const submission = await kycStorage.createSubmission({
        userId: req.user.id,
        userEmail: email || user.email,
        userName: `${firstName || user.firstName || ''} ${lastName || user.lastName || ''}`.trim() || user.username || 'Unknown',
        userPhone: phone,
        documentType,
        documentNumber,
        frontImagePath,
        backImagePath,
        selfieImagePath,
        userType,
      });

      // Also create in main KYC table for compatibility
      const existingKyc = await storage.getKycByUserId(req.user.id);
      if (!existingKyc || existingKyc.status !== "approved") {
        await storage.createKycVerification({
          userId: req.user.id,
          documentType,
          documentNumber: documentNumber || undefined,
        });
      }

      res.status(201).json({
        submissionId: submission.submissionId,
        status: 'pending',
        message: 'Verification submitted successfully. Your submission is under review.'
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/kyc/status", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user; // Type narrowing
      const kyc = await storage.getKycByUserId(user.id);
      const { kycStorage } = await import("./services/kyc-storage");
      const submission = (await kycStorage.getAllSubmissions())
        .find(s => s.userId === user.id);
      
      res.json({
        ...kyc,
        submissionId: submission?.submissionId,
        status: submission?.status || kyc?.status || "not_submitted"
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Helper function for admin check (flexible for MVP testing)
  const requireAdminAccess = (req: any, res: any, next: any) => {
    // In development/MVP, allow all authenticated users for testing
    // In production, require proper admin status
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         process.env.ALLOW_ALL_ADMIN === 'true' ||
                         process.env.ALLOW_ALL_ADMIN === '1';
    
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }

    if (isDevelopment) {
      // Allow all authenticated users in development/MVP
      console.log(`[Admin Access] Allowing access for user ${req.user.id} (MVP/Development mode)`);
      return next();
    }

    // Production: strict admin check
    if (!req.user.email?.includes('@trustverify.com') && !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    next();
  };

  // Helper endpoint to set admin status (for testing only)
  app.patch("/api/admin/set-admin/:userId", requireAuth, async (req, res) => {
    try {
      // Only allow in development or if current user is already admin
      const isDevelopment = process.env.NODE_ENV === 'development' || 
                           process.env.ALLOW_ALL_ADMIN === 'true';
      
      if (!isDevelopment && (!req.user?.isAdmin && !req.user?.email?.includes('@trustverify.com'))) {
        return res.sendStatus(403);
      }

      const userId = parseInt(req.params.userId);
      const { isAdmin } = req.body;

      const updatedUser = await storage.updateUser(userId, { isAdmin: isAdmin === true });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Admin status updated", user: updatedUser });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Review Routes
  app.get("/api/admin/kyc/submissions", requireAuth, requireAdminAccess, async (req, res) => {
    try {

      const { kycStorage } = await import("./services/kyc-storage");
      const { status, userType } = req.query;
      
      let submissions = await kycStorage.getAllSubmissions();
      
      if (status) {
        submissions = submissions.filter(s => s.status === status);
      }
      
      if (userType) {
        submissions = submissions.filter(s => s.userType === userType);
      }

      // Sort by submitted date (newest first)
      submissions.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/kyc/submissions/:submissionId", requireAuth, requireAdminAccess, async (req, res) => {
    try {

      const { kycStorage } = await import("./services/kyc-storage");
      const submission = await kycStorage.getSubmission(req.params.submissionId);
      
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      res.json(submission);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/kyc/submissions/:submissionId/review", requireAuth, requireAdminAccess, async (req, res) => {
    try {

      const schema = z.object({
        manualMatchScore: z.number().min(0).max(100).optional(),
        riskLevel: z.enum(['low', 'medium', 'high']).optional(),
        finalResult: z.enum(['pass', 'fail', 'review']).optional(),
        reviewNotes: z.string().optional(),
      });

      const validatedData = schema.parse(req.body);
      const { kycStorage } = await import("./services/kyc-storage");
      
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const submission = await kycStorage.updateSubmissionReview(
        req.params.submissionId,
        {
          ...validatedData,
          reviewedBy: req.user.id,
        }
      );

      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }

      // Update main KYC table if result is pass/fail
      if (submission.finalResult === 'pass' || submission.finalResult === 'fail') {
        const kyc = await storage.getKycByUserId(submission.userId);
        if (kyc) {
          await storage.updateKycStatus(
            kyc.id,
            submission.finalResult === 'pass' ? 'approved' : 'rejected',
            req.user.id,
            submission.reviewNotes
          );
        }

        // Send email notification (for MVP, just logs)
        const { EmailTemplateService } = await import("./services/email-templates");
        const user = await storage.getUser(submission.userId);
        if (user) {
          if (submission.finalResult === 'pass') {
            const template = EmailTemplateService.getVerificationPassedTemplate(
              submission.userName,
              submission.submissionId
            );
            await EmailTemplateService.sendEmail(user.email, template);
          } else {
            const template = EmailTemplateService.getVerificationFailedTemplate(
              submission.userName,
              submission.submissionId,
              submission.reviewNotes
            );
            await EmailTemplateService.sendEmail(user.email, template);
          }
        }
      }

      res.json(submission);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/admin/kyc/export", requireAuth, requireAdminAccess, async (_req, res) => {
    try {
      const { kycStorage } = await import("./services/kyc-storage");
      const csv = await kycStorage.exportToCSV();
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=kyc_submissions.csv');
      res.send(csv);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GDPR Data Subject Request (DSAR) endpoint
  app.post("/api/gdpr/requests", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const schema = z.object({
        type: z.enum(["access", "rectification", "erasure", "portability", "restriction"]),
        targetUserId: z.number().optional()
      });

      const { type, targetUserId } = schema.parse(req.body);

      const result = await GDPRService.handleDataSubjectRequest(
        type,
        targetUserId ?? req.user.id,
        req.user,
        req
      );

      res.status(202).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Transaction Routes
  app.post("/api/transactions", requireAuth, async (req, res) => {
    // Invalidate transaction cache on create
    const { readCache } = await import('./services/read-cache');
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Security enhancement: log transaction creation
      if (securityModules?.AuditService) {
        securityModules.AuditService.logUserAction('TRANSACTION_CREATE' as any, req.user, req, {
          resourceType: 'transaction',
          metadata: { amount: req.body.amount, title: req.body.title }
        });
      }
      
      const validatedData = insertTransactionSchema.parse(req.body);
      
      // Check if seller exists
      const seller = await storage.getUser(validatedData.sellerId);
      if (!seller) {
        return res.status(400).json({ message: "Seller not found" });
      }

      const transaction = await storage.createTransaction({
        ...validatedData,
        buyerId: req.user.id,
      });

      // Run fraud detection v2 analysis
      const { fraudDetectionEngineV2 } = await import('./services/fraud-detection-v2');
      const fraudResult = await fraudDetectionEngineV2.analyzeTransaction(
        transaction.id,
        req.user.id,
        req.ip || 'unknown',
        req.get('User-Agent'),
        req.body.deviceFingerprint
      );

      // Update transaction with fraud risk score if high risk
      if (fraudResult.riskLevel === 'high' || fraudResult.riskLevel === 'critical') {
        // Note: updateTransaction may need to be implemented in storage
        // For now, we'll log the fraud result
        console.warn('High-risk transaction detected', {
          transactionId: transaction.id,
          fraudScore: fraudResult.overallScore,
          riskLevel: fraudResult.riskLevel,
        });
      }

      // Invalidate transaction cache on create
      await readCache.invalidateTransaction(transaction.id);
      await readCache.invalidate(`transactions:user:${req.user.id}:*`);

      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/transactions", requireAuth, validateQuery(paginationSchema), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Security enhancement: log data access
      if (securityModules?.AuditService) {
        securityModules.AuditService.logUserAction('DATA_ACCESS' as any, req.user, req, {
          resourceType: 'transactions',
          metadata: { page: req.query.page, limit: req.query.limit }
        });
      }
      
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      const transactions = await storage.getTransactionsByUser(req.user.id, limit, offset);
      const total = await storage.getTransactionCountByUser(req.user.id);
      
      // Record data access for exfiltration monitoring
      const { securityAlerts } = await import('./services/security-alerts');
      securityAlerts.recordExfiltrationSignal(
        req.user.id,
        '/api/transactions',
        transactions.length,
        req.ip
      );
      
      res.json({
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/transactions/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user; // Type narrowing
      const transaction = await storage.getTransaction(parseInt(req.params.id));
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Check if user is involved in the transaction
      if (transaction.buyerId !== user.id && transaction.sellerId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Invalidate cache
      const { readCache } = await import('./services/read-cache');
      await readCache.invalidateTransaction(transaction.id);

      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/transactions/:id/status", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { status } = req.body;
      const transaction = await storage.getTransaction(parseInt(req.params.id));
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Check if user is involved in the transaction
      if (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updatedTransaction = await storage.updateTransactionStatus(transaction.id, status);
      
      // Invalidate cache
      const { readCache } = await import('./services/read-cache');
      await readCache.invalidateTransaction(transaction.id);
      await readCache.invalidate(`transactions:user:${req.user.id}:*`);
      
      res.json(updatedTransaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Message Routes
  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertMessageSchema.parse(req.body);
      
      // Check if user is involved in the transaction
      const transaction = await storage.getTransaction(validatedData.transactionId);
      if (!transaction || 
          (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const message = await storage.createMessage({
        ...validatedData,
        senderId: req.user.id,
      });

      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/messages/:transactionId", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const transactionId = parseInt(req.params.transactionId);
      const transaction = await storage.getTransaction(transactionId);
      
      if (!transaction || 
          (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const messages = await storage.getMessagesByTransaction(transactionId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/messages/:id/flag", requireAuth, async (req, res) => {
    try {
      const message = await storage.flagMessageAsScam(parseInt(req.params.id));
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Scam Report Routes
  app.post("/api/scam-reports", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertScamReportSchema.parse(req.body);

      const report = await storage.createScamReport({
        ...validatedData,
        reporterId: req.user.id,
      });

      res.status(201).json(report);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/scam-reports", async (req, res) => {
    try {
      const { search } = req.query;
      let reports;
      
      if (search && typeof search === 'string') {
        reports = await storage.searchScamReports(search);
      } else {
        reports = await storage.getScamReports();
      }
      
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dispute Routes
  app.post("/api/disputes", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertDisputeSchema.parse(req.body);
      
      // Check if user is involved in the transaction
      const transaction = await storage.getTransaction(validatedData.transactionId);
      if (!transaction || 
          (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const dispute = await storage.createDispute({
        ...validatedData,
        raisedBy: req.user.id,
      });

      // Update transaction status to disputed
      await storage.updateTransactionStatus(validatedData.transactionId, "disputed");

      res.status(201).json(dispute);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/disputes/:transactionId", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const transactionId = parseInt(req.params.transactionId);
      const transaction = await storage.getTransaction(transactionId);
      
      if (!transaction || 
          (transaction.buyerId !== req.user.id && transaction.sellerId !== req.user.id)) {
        return res.status(403).json({ message: "Access denied" });
      }

      const disputes = await storage.getDisputesByTransaction(transactionId);
      res.json(disputes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin Routes
  app.get("/api/admin/kyc-pending", requireAdmin, async (_req, res) => {
    try {
      const pendingKyc = await storage.getPendingKycVerifications();
      res.json(pendingKyc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/kyc/:id", requireAdmin, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { status, notes } = req.body;
      const kyc = await storage.updateKycStatus(
        parseInt(req.params.id), 
        status, 
        req.user.id, 
        notes
      );
      
      if (!kyc) {
        return res.status(404).json({ message: "KYC verification not found" });
      }
      
      res.json(kyc);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/disputes-pending", requireAdmin, async (_req, res) => {
    try {
      const pendingDisputes = await storage.getPendingDisputes();
      res.json(pendingDisputes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/disputes/:id", requireAdmin, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { status, resolution } = req.body;
      const dispute = await storage.updateDisputeStatus(
        parseInt(req.params.id), 
        status, 
        resolution, 
        req.user.id
      );
      
      if (!dispute) {
        return res.status(404).json({ message: "Dispute not found" });
      }
      
      res.json(dispute);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/scam-reports/:id", requireAdmin, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { status } = req.body;
      const report = await storage.updateScamReportStatus(
        parseInt(req.params.id), 
        status, 
        req.user.id
      );
      
      if (!report) {
        return res.status(404).json({ message: "Scam report not found" });
      }
      
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User search for transaction creation
  app.get("/api/users/search", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query required" });
      }

      // Simple search by username or email
      const users = Array.from((storage as any).users.values())
        .filter((user: any) => 
          user.username.toLowerCase().includes(q.toLowerCase()) ||
          user.email.toLowerCase().includes(q.toLowerCase())
        )
        .map((user: any) => ({
          id: user.id,
          username: user.username,
          trustScore: user.trustScore,
          verificationLevel: user.verificationLevel
        }))
        .slice(0, 10); // Limit results

      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Developer Portal routes
  app.use("/api/developer", developerRoutes);

  // API routes with authentication and logging middleware
  app.use("/api/v1", validateApiKey, logApiUsage);

  // Public API endpoints
  app.get("/api/v1/transactions", async (req, res) => {
    try {
      const authReq = req as any;
      if (!authReq.developer) {
        return res.status(401).json({ error: 'Authentication required' });
      }
      const transactions = await storage.getTransactionsByUser(authReq.developer.userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/v1/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Return safe user data
      res.json({
        id: user.id,
        username: user.username,
        trustScore: user.trustScore,
        verificationLevel: user.verificationLevel,
        isVerified: user.isVerified
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Developer Account Management
  app.post("/api/developer/account", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const validatedData = insertDeveloperAccountSchema.parse(req.body);
      const account = await storage.createDeveloperAccount({
        ...validatedData,
        userId: req.user.id,
      });
      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/developer/account", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const account = await storage.getDeveloperAccountByUserId(userId);
      if (!account) {
        return res.status(404).json({ error: "Developer account not found" });
      }
      res.json(account);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch developer account" });
    }
  });

  // API Key management routes
  app.get("/api/developer/api-keys", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const account = await storage.getDeveloperAccountByUserId(userId);
      if (!account) {
        return res.status(404).json({ error: "Developer account not found" });
      }
      const keys = await storage.getApiKeysByDeveloperId(account.id);
      res.json(keys);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch API keys" });
    }
  });

  app.post("/api/developer/api-keys", requireAuth, async (req, res) => {
    try {
      const userId = req.user!.id;
      const { name, permissions = [] } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "API key name is required" });
      }

      const account = await storage.getDeveloperAccountByUserId(userId);
      if (!account) {
        return res.status(404).json({ error: "Developer account not found" });
      }

      if (account.status !== 'approved') {
        return res.status(403).json({ error: "Developer account must be approved to create API keys" });
      }

      // Generate API key
      const keyPrefix = "tv_";
      const randomBytes = new Uint8Array(32);
      crypto.getRandomValues(randomBytes);
      const keyBody = Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
      const fullKey = keyPrefix + keyBody;
      
      // Hash the key for storage
      const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');

      const apiKey = await storage.createApiKey({
        developerId: account.id,
        name: name.trim(),
        keyHash,
        keyPrefix,
        permissions: Array.isArray(permissions) ? permissions : [],
        expiresAt: undefined
      });

      res.status(201).json({
        ...apiKey,
        key: fullKey
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create API key" });
    }
  });

  app.delete("/api/developer/api-keys/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = req.user.id;
      const keyId = parseInt(req.params.id);

      if (isNaN(keyId)) {
        return res.status(400).json({ error: "Invalid key ID" });
      }

      const account = await storage.getDeveloperAccountByUserId(userId);
      if (!account) {
        return res.status(404).json({ error: "Developer account not found" });
      }

      const key = await storage.revokeApiKey(keyId);
      if (!key || key.developerId !== account.id) {
        return res.status(404).json({ error: "API key not found" });
      }

      res.json({ message: "API key revoked successfully" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to revoke API key" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
