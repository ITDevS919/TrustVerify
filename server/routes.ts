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
import supportRoutes from "./routes/support";
import subscriptionRoutes from "./routes/subscriptions";
import { validateApiKey, logApiUsage } from "./middleware/apiAuth";
import multer from "multer";
import { z } from "zod";
import { GDPRService } from "./security/compliance.js";

// Set up multer for file uploads (in-memory for cloud storage)
const upload = multer({
  storage: multer.memoryStorage(), // Store in memory, then upload to cloud
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
  
  // Register arbitration routes
  const { registerArbitrationRoutes } = await import('./routes/arbitration');
  registerArbitrationRoutes(app);
  
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

      // Import services
      const { kycStorage } = await import("./services/kyc-storage");
      const { fileStorageService } = await import("./services/file-storage");
      const { db } = await import("./db");
      const { fileStorage: fileStorageTable } = await import("./shared/schema");

      // Upload files to cloud storage
      const frontImageFile = files.frontImage[0];
      const backImageFile = files.backImage?.[0];
      const selfieImageFile = files.selfieImage[0];

      // Upload front image
      const frontUpload = await fileStorageService.uploadFile(
        frontImageFile.buffer,
        frontImageFile.originalname,
        frontImageFile.mimetype,
        req.user.id,
        'kyc',
        { encrypt: true } // Encrypt sensitive KYC documents
      );

      if (!frontUpload.success) {
        return res.status(500).json({ message: 'Failed to upload front image' });
      }

      // Store file metadata in database
      await db.insert(fileStorageTable).values({
        fileId: frontUpload.fileId,
        userId: req.user.id,
        fileName: frontImageFile.originalname,
        originalName: frontImageFile.originalname,
        mimeType: frontImageFile.mimetype,
        size: frontImageFile.size,
        storageProvider: fileStorageService.getProvider(),
        storageKey: frontUpload.storageKey,
        fileType: 'kyc',
        encrypted: true,
      });

      // Upload back image if provided
      let backImageStorageKey: string | undefined;
      if (backImageFile) {
        const backUpload = await fileStorageService.uploadFile(
          backImageFile.buffer,
          backImageFile.originalname,
          backImageFile.mimetype,
          req.user.id,
          'kyc',
          { encrypt: true }
        );

        if (backUpload.success) {
          backImageStorageKey = backUpload.storageKey;
          await db.insert(fileStorageTable).values({
            fileId: backUpload.fileId,
            userId: req.user.id,
            fileName: backImageFile.originalname,
            originalName: backImageFile.originalname,
            mimeType: backImageFile.mimetype,
            size: backImageFile.size,
            storageProvider: fileStorageService.getProvider(),
            storageKey: backUpload.storageKey,
            fileType: 'kyc',
            encrypted: true,
          });
        }
      }

      // Upload selfie
      const selfieUpload = await fileStorageService.uploadFile(
        selfieImageFile.buffer,
        selfieImageFile.originalname,
        selfieImageFile.mimetype,
        req.user.id,
        'kyc',
        { encrypt: true }
      );

      if (!selfieUpload.success) {
        return res.status(500).json({ message: 'Failed to upload selfie image' });
      }

      await db.insert(fileStorageTable).values({
        fileId: selfieUpload.fileId,
        userId: req.user.id,
        fileName: selfieImageFile.originalname,
        originalName: selfieImageFile.originalname,
        mimeType: selfieImageFile.mimetype,
        size: selfieImageFile.size,
        storageProvider: fileStorageService.getProvider(),
        storageKey: selfieUpload.storageKey,
        fileType: 'kyc',
        encrypted: true,
      });

      // Create submission with storage keys instead of file paths
      const submission = await kycStorage.createSubmission({
        userId: req.user.id,
        userEmail: email || user.email,
        userName: `${firstName || user.firstName || ''} ${lastName || user.lastName || ''}`.trim() || user.username || 'Unknown',
        userPhone: phone,
        documentType,
        documentNumber,
        frontImagePath: frontUpload.storageKey, // Store storage key
        backImagePath: backImageStorageKey,
        selfieImagePath: selfieUpload.storageKey,
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

  // KYC status by ID (for API spec compliance)
  app.get("/api/kyc/status/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const verificationId = req.params.id;
      const { kycStorage } = await import("./services/kyc-storage");
      const submission = (await kycStorage.getAllSubmissions())
        .find(s => s.submissionId === verificationId);
      
      if (!submission) {
        return res.status(404).json({ message: "KYC verification not found" });
      }

      const kyc = await storage.getKycByUserId(submission.userId);
      
      res.json({
        id: verificationId,
        ...kyc,
        submissionId: submission.submissionId,
        status: submission.status || kyc?.status || "not_submitted",
        submittedAt: submission.submittedAt,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // KYC start endpoint (alias for API spec compliance - same as /api/kyc/submit)
  app.post("/api/kyc/start", requireAuth, upload.fields([
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

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { kycStorage } = await import("./services/kyc-storage");

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

      const existingKyc = await storage.getKycByUserId(req.user.id);
      if (!existingKyc || existingKyc.status !== "approved") {
        await storage.createKycVerification({
          userId: req.user.id,
          documentType,
          documentNumber: documentNumber || undefined,
        });
      }

      res.status(201).json({
        id: submission.submissionId,
        submissionId: submission.submissionId,
        status: 'pending',
        message: 'KYC workflow initiated successfully'
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // KYB Routes
  app.post("/api/kyb/start", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { KYBVerificationService } = await import("./security/kyb-verification");
      const account = await storage.getDeveloperAccountByUserId(req.user.id);
      
      if (!account) {
        return res.status(404).json({ message: "Developer account not found. Please create a developer account first." });
      }

      const kybData = {
        orgId: account.id,
        companyName: req.body.companyName || account.companyName || '',
        registrationNumber: req.body.registrationNumber || '',
        registrationCountry: req.body.registrationCountry || '',
        businessAddress: req.body.businessAddress || '',
        industry: req.body.industry || '',
        website: req.body.website || account.website || undefined,
        primaryContactName: req.body.primaryContactName || `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.username || '',
        primaryContactEmail: req.body.primaryContactEmail || req.user.email || '',
        primaryContactPhone: req.body.primaryContactPhone || '',
        businessDescription: req.body.businessDescription || account.description || '',
        expectedTransactionVolume: req.body.expectedTransactionVolume || 0,
        sourceOfFunds: req.body.sourceOfFunds || '',
        beneficialOwners: req.body.beneficialOwners || [],
        complianceDocuments: req.body.complianceDocuments || [],
      };

      const result = await KYBVerificationService.initiateKYBVerification(kybData);

      if (!result.success) {
        return res.status(400).json({
          error: 'KYB verification initiation failed',
          errors: result.errors,
        });
      }

      res.status(201).json({
        verificationId: result.verificationId,
        status: 'pending',
        riskLevel: result.riskLevel,
        requiresManualReview: result.requiresManualReview,
        message: 'KYB verification initiated successfully',
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/kyb/status/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const verificationId = req.params.id;
      const account = await storage.getDeveloperAccountByUserId(req.user.id);
      
      if (!account) {
        return res.status(404).json({ message: "Developer account not found" });
      }

      // Extract org ID from verification ID if format is KYB-{orgId}-{timestamp}
      const kybMatch = verificationId.match(/^KYB-(\d+)-/);
      const orgId = kybMatch ? parseInt(kybMatch[1]) : account.id;

      // Verify the KYB belongs to the user's organization
      if (orgId !== account.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Get KYB status from developer account
      // Note: KYB status fields may be stored in a separate table or as metadata
      // For now, return basic account status
      res.json({
        id: verificationId,
        orgId: account.id,
        status: account.status || 'pending',
        companyName: account.companyName,
        website: account.website,
        description: account.description,
        approvedAt: account.approvedAt,
        createdAt: account.createdAt,
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
      
      // Get submissions from file-based storage
      let fileSubmissions = await kycStorage.getAllSubmissions();
      
      // Also get KYC verifications from database
      const dbKycVerifications = await storage.getPendingKycVerifications();
      
      // Merge data: prioritize file-based submissions, but include DB records that don't have file submissions
      const fileSubmissionUserIds = new Set(fileSubmissions.map(s => s.userId));
      
      // Convert DB KYC records to submission format for records not in file storage
      const dbSubmissionsPromises = dbKycVerifications
        .filter(kyc => !fileSubmissionUserIds.has(kyc.userId))
        .map(async (kyc) => {
          // Get user info for the KYC record
          let user;
          try {
            user = await storage.getUser(kyc.userId);
          } catch {
            user = null;
          }
          
          return {
            submissionId: `KYC-DB-${kyc.id}`,
            userId: kyc.userId,
            userEmail: user?.email || 'unknown@example.com',
            userName: user?.username || user?.firstName || `User ${kyc.userId}`,
            userPhone: undefined, // Phone not available in user schema
            documentType: kyc.documentType || 'unknown',
            documentNumber: kyc.documentNumber || undefined,
            frontImagePath: '', // No image path for DB-only records
            backImagePath: undefined,
            selfieImagePath: '',
            submittedAt: kyc.submittedAt?.toISOString() || new Date().toISOString(),
            status: kyc.status === 'approved' ? 'approved' : 
                   kyc.status === 'rejected' ? 'rejected' : 
                   kyc.status === 'pending' ? 'pending' : 'pending',
            userType: undefined,
          };
        });
      
      const dbSubmissions = await Promise.all(dbSubmissionsPromises);
      
      // Combine both sources
      let allSubmissions = [...fileSubmissions, ...dbSubmissions];
      
      // Apply filters
      if (status && status !== 'all') {
        allSubmissions = allSubmissions.filter(s => s.status === status);
      }
      
      if (userType && userType !== 'all') {
        allSubmissions = allSubmissions.filter(s => s.userType === userType);
      }

      // Sort by submitted date (newest first)
      allSubmissions.sort((a, b) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

      res.json(allSubmissions);
    } catch (error: any) {
      console.error('Error fetching KYC submissions:', error);
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

  // API Spec aliases for Workflow Builder API
  const { requireDeveloperAuth } = await import('./middleware/apiAuth');
  const { workflowService } = await import('./services/workflow-service');

  // POST /api/workflow/create -> POST /api/developer/workflows
  app.post("/api/workflow/create", requireDeveloperAuth, async (req, res) => {
    try {
      const account = await storage.getDeveloperAccountByUserId(req.user!.id);
      if (!account) {
        return res.status(404).json({ error: 'Developer account not found' });
      }
      const workflow = await workflowService.createWorkflow(account.id, req.body);
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      console.error('Error creating workflow:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/workflow/:id -> GET /api/developer/workflows/:id
  app.get("/api/workflow/:id", requireDeveloperAuth, async (req, res) => {
    try {
      const account = await storage.getDeveloperAccountByUserId(req.user!.id);
      if (!account) {
        return res.status(404).json({ error: 'Developer account not found' });
      }
      const workflowId = parseInt(req.params.id);
      if (isNaN(workflowId)) {
        return res.status(400).json({ error: 'Invalid workflow ID' });
      }
      const workflow = await workflowService.getWorkflow(workflowId, account.id);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }
      res.json(workflow);
    } catch (error) {
      console.error('Error fetching workflow:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/workflow/execute -> Execute workflow with workflowId in body
  app.post("/api/workflow/execute", requireDeveloperAuth, async (req, res) => {
    try {
      const account = await storage.getDeveloperAccountByUserId(req.user!.id);
      if (!account) {
        return res.status(404).json({ error: 'Developer account not found' });
      }
      const { workflowId } = req.body;
      if (!workflowId) {
        return res.status(400).json({ error: 'workflowId is required in request body' });
      }
      const workflow = await workflowService.getWorkflow(parseInt(workflowId), account.id);
      if (!workflow) {
        return res.status(404).json({ error: 'Workflow not found' });
      }
      if (!workflow.isActive) {
        return res.status(400).json({ error: 'Workflow is not active' });
      }
      const { context } = req.body;
      // Execute workflow steps in order (same logic as in developer routes)
      const executionResults: any[] = [];
      let currentContext = context || {};

      for (const step of workflow.workflowSteps.sort((a, b) => a.order - b.order)) {
        try {
          let stepResult: any = { stepId: step.id, stepName: step.name, status: 'pending' };

          switch (step.type) {
            case 'kyc':
              if (currentContext.userId) {
                const kyc = await storage.getKycByUserId(currentContext.userId);
                stepResult = {
                  ...stepResult,
                  status: kyc?.status === 'approved' ? 'passed' : 'pending',
                  result: { kycStatus: kyc?.status || 'not_submitted' }
                };
              }
              break;
            case 'fraud_check':
              if (currentContext.transactionId) {
                const { fraudDetectionEngineV2 } = await import('./services/fraud-detection-v2');
                const fraudResult = await fraudDetectionEngineV2.analyzeTransaction(
                  currentContext.transactionId,
                  currentContext.userId || 0,
                  currentContext.ipAddress || 'unknown',
                  currentContext.userAgent,
                  currentContext.deviceFingerprint
                );
                stepResult = {
                  ...stepResult,
                  status: fraudResult.riskLevel === 'low' || fraudResult.riskLevel === 'medium' ? 'passed' : 'failed',
                  result: fraudResult
                };
              }
              break;
            case 'device_ip_check':
              if (currentContext.userId && currentContext.ipAddress) {
                const { deviceIPIntelligence } = await import('./services/device-ip-intelligence');
                const assessment = await deviceIPIntelligence.assessDeviceIPRisk(
                  currentContext.userId,
                  currentContext.ipAddress,
                  currentContext.deviceFingerprint,
                  currentContext.email
                );
                stepResult = {
                  ...stepResult,
                  status: assessment.riskLevel === 'low' ? 'passed' : assessment.riskLevel === 'medium' ? 'warning' : 'failed',
                  result: assessment
                };
              }
              break;
            case 'escrow':
              if (currentContext.transactionId) {
                const { escrowService } = await import('./services/escrowService');
                const escrowAccount = await escrowService.createEscrowTransaction(currentContext.transactionId);
                stepResult = {
                  ...stepResult,
                  status: 'passed',
                  result: { escrowId: escrowAccount.id, status: escrowAccount.status }
                };
                currentContext.escrowId = escrowAccount.id;
              }
              break;
            case 'payment':
              stepResult = { ...stepResult, status: 'passed', result: { message: 'Payment step executed' } };
              break;
            case 'custom':
              stepResult = { ...stepResult, status: 'passed', result: { message: 'Custom step executed', config: step.config } };
              break;
            default:
              stepResult = { ...stepResult, status: 'skipped', result: { message: `Unknown step type: ${step.type}` } };
          }

          executionResults.push(stepResult);
          if (step.conditions && step.conditions.if && stepResult.status !== 'passed') {
            if (step.conditions.else) break;
          }
        } catch (error: any) {
          executionResults.push({ stepId: step.id, stepName: step.name, status: 'error', error: error.message });
        }
      }

      res.json({
        workflowId: workflow.id,
        workflowName: workflow.name,
        executionId: `exec-${workflow.id}-${Date.now()}`,
        status: executionResults.every(r => r.status === 'passed' || r.status === 'warning') ? 'completed' : 'failed',
        results: executionResults,
        executedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error executing workflow:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.use("/api/subscriptions", subscriptionRoutes);

  // Analytics & Reporting routes
  const analyticsRoutes = await import('./routes/analytics');
  app.use("/api/analytics", analyticsRoutes.default);

  // Support routes (chat, tickets)
  app.use("/api/support", supportRoutes);

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
        status: 'approved', // Auto-approve developer accounts
        approvedAt: new Date(), // Set approval timestamp
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

  // Admin endpoint to update developer account status
  app.patch("/api/admin/developer-accounts/:id/status", requireAuth, requireAdmin, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const accountId = parseInt(req.params.id);
      const { status } = req.body;

      if (!status || !['pending', 'approved', 'suspended'].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'pending', 'approved', or 'suspended'" });
      }

      const account = await storage.updateDeveloperAccountStatus(
        accountId,
        status,
        req.user.id // approvedBy
      );

      if (!account) {
        return res.status(404).json({ error: "Developer account not found" });
      }

      res.json(account);
    } catch (error: any) {
      console.error('Error updating developer account status:', error);
      res.status(500).json({ error: "Failed to update developer account status" });
    }
  });

  // Admin endpoint to list all developer accounts
  app.get("/api/admin/developer-accounts", requireAuth, requireAdmin, async (_req, res) => {
    try {
      // Get all developer accounts (you may need to add a method to storage for this)
      // For now, this is a placeholder - you might need to query the database directly
      res.json({ message: "List all developer accounts endpoint - implementation needed" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch developer accounts" });
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

  // Admin Dashboard Stats
  app.get("/api/admin/stats", requireAuth, requireAdminAccess, async (_req, res) => {
    try {
      // Disable caching for real-time stats
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const totalUsers = await storage.getUserCount();
      const activeTransactions = await storage.getActiveTransactionCount();
      const pendingKyc = await storage.getPendingKycCount();
      const securityAlerts = 0; // TODO: Get from monitoring service

      res.json({
        totalUsers,
        activeTransactions,
        pendingKyc,
        securityAlerts,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Admin Activities
  app.get("/api/admin/activities", requireAuth, requireAdminAccess, async (_req, res) => {
    try {
      // Disable caching for real-time activities
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      // TODO: Fetch from audit logs
      res.json([]);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Newsletter subscription endpoint (public)
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Check if email already exists in newsletter subscriptions
      // For now, we'll just log it. In production, you'd store this in a database
      console.log(`Newsletter subscription: ${email}`);

      // TODO: Store newsletter subscription in database
      // You can create a newsletter_subscriptions table with fields:
      // - id, email, subscribedAt, status, unsubscribedAt

      res.json({ 
        message: "Successfully subscribed to newsletter",
        email    
      });
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
