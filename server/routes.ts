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
  const requireAuth = async (req: any, res: any, next: any) => {
    // Check both isAuthenticated() and req.user for robustness
    if (!req.isAuthenticated() && !req.user) {
      console.log('[Auth] Unauthenticated request:', {
        isAuthenticated: req.isAuthenticated(),
        hasUser: !!req.user,
        sessionId: req.sessionID,
        path: req.path
      });
      return res.status(401).json({ error: "Authentication required" });
    }
    // Ensure req.user is set if isAuthenticated is true but user is missing
    if (req.isAuthenticated() && !req.user && req.session?.passport?.user) {
      // Try to get user from session
      try {
        const user = await storage.getUser(req.session.passport.user);
        if (user) {
          req.user = user;
          return next();
        } else {
          return res.status(401).json({ error: "User not found" });
        }
      } catch (error) {
        console.error('[Auth] Error loading user from session:', error);
        return res.status(401).json({ error: "Authentication required" });
      }
    }
    next();
  };

  // Flexible middleware: accepts either API key OR session auth OR public access
  // For browser-based requests from the frontend, allows public access
  // For API calls, supports API key authentication
  const validateApiKeyOrAuth = async (req: any, res: any, next: any) => {
    // Check if API key is provided in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // If API key is provided, validate it
      // validateApiKey will handle the response (success or error)
      return validateApiKey(req, res, next);
    }
    
    // If no API key, allow access (public endpoint for browser use)
    // Session auth is optional - if user is logged in, we can track usage
    return next();
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
      // Note: encrypted flag should match actual encryption status
      const isEncrypted = !!process.env.FILE_ENCRYPTION_KEY && process.env.FILE_ENCRYPTION_KEY.length >= 32;
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
        encrypted: isEncrypted,
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
            encrypted: !!process.env.FILE_ENCRYPTION_KEY && process.env.FILE_ENCRYPTION_KEY.length >= 32,
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
        encrypted: !!process.env.FILE_ENCRYPTION_KEY && process.env.FILE_ENCRYPTION_KEY.length >= 32,
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
  const requireAdminAccess = async (req: any, res: any, next: any) => {
    // This middleware should be used AFTER requireAuth, so req.user should already be set
    // Double-check authentication as a safety measure
    if (!req.user) {
      // If req.user is not set, try to get it from session
      if (req.session?.passport?.user) {
        try {
          const user = await storage.getUser(req.session.passport.user);
          if (user) {
            req.user = user;
          } else {
            return res.status(401).json({ error: "User not found" });
          }
        } catch (error) {
          console.error('[Admin Access] Error loading user:', error);
          return res.status(401).json({ error: "Authentication failed" });
        }
      } else {
        return res.status(401).json({ error: "Authentication required" });
      }
    }

    // In development/MVP, allow all authenticated users for testing
    // In production, require proper admin status
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         process.env.ALLOW_ALL_ADMIN === 'true' ||
                         process.env.ALLOW_ALL_ADMIN === '1' ||
                         process.env.VITE_ALLOW_ALL_ADMIN === 'true';
    
    if (isDevelopment) {
      // Allow all authenticated users in development/MVP
      console.log(`[Admin Access] Allowing access for user ${req.user.id} (${req.user.email}) (MVP/Development mode)`);
      return next();
    }

    // Production: strict admin check
    const isAdmin = req.user.isAdmin || req.user.email?.includes('@trustverify.com');
    if (!isAdmin) {
      console.log(`[Admin Access] Denied for user ${req.user.id} (${req.user.email}) - not admin`);
      return res.status(403).json({ error: "Admin access required" });
    }

    console.log(`[Admin Access] Granted for user ${req.user.id} (${req.user.email})`);
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
      console.log('[API Key Creation] Request received:', { userId, name, permissions });

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: "API key name is required" });
      }
  
      const account = await storage.getDeveloperAccountByUserId(userId);
      if (!account) {
        console.error('[API Key Creation] Developer account not found for user:', userId);
        return res.status(404).json({ error: "Developer account not found" });
      }
      console.log('[API Key Creation] Developer account found:', { id: account.id, status: account.status });
      if (account.status !== 'approved') {
        return res.status(403).json({ error: "Developer account must be approved to create API keys" });
      }
  
      // Generate API key
      const keyPrefix = "tv_";
      // Use Node.js crypto.randomBytes instead of browser crypto.getRandomValues
      const randomBytes = crypto.randomBytes(32);
      const keyBody = randomBytes.toString('hex');
      const fullKey = keyPrefix + keyBody;
      
      // Hash the key for storage
      const keyHash = crypto.createHash('sha256').update(fullKey).digest('hex');
      // Ensure permissions is an array
      const permissionsArray = Array.isArray(permissions) ? permissions : [];

      console.log('[API Key Creation] Creating API key with data:', {
        developerId: account.id,
        name: name.trim(),
        keyHash: keyHash.substring(0, 20) + '...',
        keyPrefix,
        permissionsCount: permissionsArray.length
      });

      const apiKey = await storage.createApiKey({
        developerId: account.id,
        name: name.trim(),
        keyHash,
        keyPrefix,
        permissions: permissionsArray,
        expiresAt: undefined
      });
      console.log('[API Key Creation] API key created successfully:', { id: apiKey.id, name: apiKey.name });

      res.status(201).json({
        ...apiKey,
        key: fullKey
      });
    } catch (error: any) {
      console.error('[API Key Creation] Error:', error);
      console.error('[API Key Creation] Error message:', error.message);
      console.error('[API Key Creation] Error stack:', error.stack);
      console.error('[API Key Creation] Request body:', req.body);
      res.status(500).json({ 
        error: "Failed to create API key",
        message: error.message || "Unknown error",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
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
  app.get("/api/admin/activities", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      // Disable caching for real-time activities
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      const limit = parseInt(req.query.limit as string) || 50;
      const activities = await storage.getAdminActivities(limit);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  // Admin User Management
  app.get("/api/admin/users", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const status = req.query.status as string;

      const result = await storage.getUsers(page, limit, { search, status });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;

      console.log(`[Admin] Updating user ${userId} with:`, updates);

      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updates.password;
      delete updates.id;
      delete updates.createdAt;

      // Ensure isAdmin is a boolean if provided
      if (updates.isAdmin !== undefined) {
        updates.isAdmin = Boolean(updates.isAdmin);
      }

      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        console.error(`[Admin] User ${userId} not found`);
        return res.status(404).json({ error: "User not found" });
      }

      console.log(`[Admin] Successfully updated user ${userId}. isAdmin: ${updatedUser.isAdmin}`);

      // Return safe user data (exclude password)
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error: any) {
      console.error('[Admin] Error updating user:', error);
      console.error('[Admin] Error stack:', error.stack);
      res.status(500).json({ 
        error: "Failed to update user",
        message: error.message || "Unknown error",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  app.get("/api/admin/users/export", requireAuth, requireAdminAccess, async (_req, res) => {
    try {
      const users = await storage.getAllUsersForExport();
      
      // Convert to CSV
      const headers = ['ID', 'Username', 'Email', 'First Name', 'Last Name', 'Status', 'Admin', 'Trust Score', 'Verification Level', 'Created At'];
      const rows = users.map((user: any) => [
        user.id,
        user.username || '',
        user.email || '',
        user.firstName || '',
        user.lastName || '',
        user.sanctionedUntil ? 'Suspended' : 'Active',
        user.isAdmin ? 'Yes' : 'No',
        user.trustScore || '0.00',
        user.verificationLevel || 'none',
        user.createdAt ? new Date(user.createdAt).toISOString() : '',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=users-export-${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csv);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to export users" });
    }
  });

  // Admin Settings
  app.get("/api/admin/settings", requireAuth, requireAdminAccess, async (req, res) => {
    void req; // Reserved for future use
    try {
      const settings = await storage.getSystemSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const settings = await storage.updateSystemSettings(req.body);
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // Public endpoint to get homepage content (for frontend display)
  app.get("/api/homepage-content", async (req, res) => {
    try {
      const { section } = req.query;
      const content = await storage.getHomepageContent(section as string | undefined);
      // Only return active content
      const activeContent = content.filter((c: any) => c.isActive);
      res.json(activeContent);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch homepage content" });
    }
  });

  // Homepage Content Management Routes (Admin only)
  app.get("/api/admin/homepage-content", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const { section } = req.query;
      const content = await storage.getHomepageContent(section as string | undefined);
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch homepage content" });
    }
  });

  app.get("/api/admin/homepage-content/:section/:key", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const { section, key } = req.params;
      const content = await storage.getHomepageContentByKey(section, key);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch homepage content" });
    }
  });

  app.post("/api/admin/homepage-content", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const content = await storage.createHomepageContent(req.body);
      res.status(201).json(content);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create homepage content" });
    }
  });

  app.put("/api/admin/homepage-content/:id", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const content = await storage.updateHomepageContent(id, req.body);
      console.log("content :",  content);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update homepage content" });
    }
  });

  app.delete("/api/admin/homepage-content/:id", requireAuth, requireAdminAccess, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteHomepageContent(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete homepage content" });
    }
  });

  app.post("/api/admin/homepage-content/upload-image", requireAuth, requireAdminAccess, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }
      const imageUrl = await storage.uploadHomepageImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
      res.json({ url: imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to upload image" });
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

  // ============================================
  // FRAUD PREVENTION API ENDPOINTS
  // ============================================

  // 1. DOMAIN TRUST SCORE API
  // Get domain trust score
  app.get("/api/fraud/domain/:domain", validateApiKeyOrAuth, async (req, res) => {
    try {
      const { domain } = req.params;
      
      if (!domain || domain.length < 3) {
        return res.status(400).json({ error: "Valid domain required" });
      }

      // Try to get from storage if method exists
      let trustScore = null;
      try {
        if (typeof (storage as any).getDomainTrustScore === 'function') {
          trustScore = await (storage as any).getDomainTrustScore(domain.toLowerCase());
        }
      } catch (storageError) {
        console.warn("Storage method not available, using fallback");
      }
      
      if (!trustScore) {
        // Return default domain analysis
        const defaultScore = {
          domain: domain.toLowerCase(),
          trustScore: 50,
          riskLevel: "medium",
          category: "unknown",
          isPhishing: false,
          isMalware: false,
          isScam: false,
          isSuspicious: false,
          createdAt: new Date().toISOString()
        };
        return res.json(defaultScore);
      }

      res.json(trustScore);
    } catch (error: any) {
      console.error("Domain trust score error:", error);
      res.status(500).json({ error: "Failed to get domain trust score" });
    }
  });

  // 2. PHONE NUMBER VERIFICATION API
  // Check phone number flags
  app.get("/api/fraud/phone/:phoneNumber", validateApiKeyOrAuth, async (req, res) => {
    try {
      const { phoneNumber } = req.params;
      
      if (!phoneNumber || phoneNumber.length < 8) {
        return res.status(400).json({ error: "Valid phone number required" });
      }

      // Try to get from storage if method exists
      let phoneFlag = null;
      try {
        if (typeof (storage as any).getPhoneNumberFlag === 'function') {
          phoneFlag = await (storage as any).getPhoneNumberFlag(phoneNumber);
        }
      } catch (storageError) {
        console.warn("Storage method not available, using fallback");
      }
      
      if (!phoneFlag) {
        // Return default phone analysis
        const defaultFlag = {
          phoneNumber,
          countryCode: "unknown",
          region: "unknown",
          carrier: "unknown",
          isScam: false,
          isSpam: false,
          isRobo: false,
          isSpoofed: false,
          riskLevel: "low",
          fraudScore: 10,
          scamTypes: [],
          reportedActivities: [],
          createdAt: new Date().toISOString()
        };
        return res.json(defaultFlag);
      }

      res.json(phoneFlag);
    } catch (error: any) {
      console.error("Phone number flag error:", error);
      res.status(500).json({ error: "Failed to get phone number flag" });
    }
  });

  // 3. FRAUD REPORTS API
  // Submit fraud report
  app.post("/api/fraud/reports", async (req, res) => {
    try {
      const reportData = req.body;
      const reporterId = req.isAuthenticated() && req.user ? req.user.id : undefined;
      
      // Try to create report in storage if method exists
      let report = null;
      try {
        if (typeof (storage as any).createFraudReport === 'function') {
          report = await (storage as any).createFraudReport({
            ...reportData,
            reporterId
          });
        }
      } catch (storageError) {
        console.warn("Storage method not available, using fallback");
      }
      
      if (!report) {
        // Return success response with report data
        report = {
          id: Date.now(),
          ...reportData,
          reporterId,
          status: "pending",
          createdAt: new Date().toISOString()
        };
      }
      
      res.status(201).json(report);
    } catch (error: any) {
      console.error("Fraud report creation error:", error);
      res.status(500).json({ error: "Failed to create fraud report" });
    }
  });

  // 4. WEBSITE ANALYSIS API
  // Get website analysis by encoded URL
  app.get("/api/fraud/analyze/:encodedUrl", validateApiKeyOrAuth, async (req, res) => {
    try {
      const url = decodeURIComponent(req.params.encodedUrl);
      
      if (!url || !url.includes('.')) {
        return res.status(400).json({ error: "Valid URL required" });
      }

      // Try to get from storage if method exists
      let analysis = null;
      try {
        if (typeof (storage as any).getWebsiteAnalysis === 'function') {
          analysis = await (storage as any).getWebsiteAnalysis(url);
        }
      } catch (storageError) {
        console.warn("Storage method not available, trying real-time analysis");
      }
      
      if (!analysis) {
        // Try to perform real-time analysis if not found
        try {
          const { WebsiteSecurityAnalyzer } = await import('./services/websiteAnalyzer');
          const analyzer = new WebsiteSecurityAnalyzer();
          const analysisResult = await analyzer.analyzeWebsite(url);
          
          // Try to store the analysis if method exists
          try {
            if (typeof (storage as any).createWebsiteAnalysis === 'function') {
              await (storage as any).createWebsiteAnalysis({
                url: analysisResult.url,
                domain: analysisResult.domain,
                riskScore: (100 - analysisResult.trustScore).toString(),
                riskFactors: (analysisResult as any).fraudFlags || [],
                hasValidSSL: analysisResult.sslCertificate?.valid || false,
                certificateIssuer: analysisResult.sslCertificate?.issuer || null,
                domainAge: (analysisResult.domainInfo as any)?.age || null,
                pageLoadTime: analysisResult.performanceMetrics?.loadTime || null,
                suspiciousKeywords: (analysisResult as any).suspiciousElements || [],
                hasPasswordFields: false,
                hasPaymentForms: false,
                category: "security_analysis",
                confidence: Math.round(analysisResult.trustScore).toString(),
                isLegitimate: analysisResult.trustScore > 70
              });
            }
          } catch (storeError) {
            console.warn("Failed to store analysis:", storeError);
          }
          
          return res.json({
            url: analysisResult.url,
            domain: analysisResult.domain,
            riskScore: 100 - analysisResult.trustScore,
            riskLevel: analysisResult.riskLevel || "medium",
            category: (analysisResult as any).category || (analysisResult as any).summary?.category || "security_analysis",
            hasValidSSL: analysisResult.sslCertificate?.valid || false,
            confidence: Math.round(analysisResult.trustScore),
            timestamp: new Date().toISOString()
          });
        } catch (analysisError) {
          console.warn("Real-time analysis failed, returning default:", analysisError);
          return res.json({
            url,
            domain: new URL(url).hostname,
            riskScore: 50,
            riskLevel: "medium",
            category: "unknown",
            hasValidSSL: false,
            confidence: 50,
            timestamp: new Date().toISOString()
          });
        }
      }

      res.json(analysis);
    } catch (error: any) {
      console.error("Website analysis error:", error);
      res.status(500).json({ error: "Failed to get website analysis" });
    }
  });

  // 5. COMPREHENSIVE FRAUD CHECK API
  // Multi-factor fraud check with real-time analysis
  app.post("/api/fraud/check", async (req, res) => {
    try {
      const { domain, phoneNumber, email, url } = req.body;
      const results: any = {};

      console.log(`Comprehensive fraud check requested for:`, { domain, phoneNumber, email, url });

      // Real-time website analysis if URL provided
      if (url) {
        try {
          const { WebsiteSecurityAnalyzer } = await import('./services/websiteAnalyzer');
          const analyzer = new WebsiteSecurityAnalyzer();
          const analysisResult = await analyzer.analyzeWebsite(url);
          
          results.website = {
            url: analysisResult.url,
            domain: analysisResult.domain,
            trustScore: analysisResult.trustScore,
            riskScore: 100 - analysisResult.trustScore,
            riskLevel: analysisResult.riskLevel || "medium",
            category: (analysisResult as any).category || (analysisResult as any).summary?.category || "unknown",
            securityAnalysis: {
              hasHTTPS: analysisResult.securityHeaders?.hasHTTPS || false,
              hasValidSSL: analysisResult.sslCertificate?.valid || false,
              securityHeaders: {
                hsts: analysisResult.securityHeaders?.hasHSTS || false,
                csp: analysisResult.securityHeaders?.hasCSP || false,
                xframe: analysisResult.securityHeaders?.hasXFrameOptions || false
              }
            },
            threatIntelligence: {
              isBlacklisted: analysisResult.threatIntelligence?.isBlacklisted || false,
              threatCategories: analysisResult.threatIntelligence?.threatCategories || [],
              reputationScore: analysisResult.threatIntelligence?.reputationScore || 50
            },
            vulnerabilities: analysisResult.vulnerabilities || [],
            summary: analysisResult.summary || "Analysis completed",
            timestamp: analysisResult.timestamp || new Date().toISOString()
          };
          
          console.log(`Real-time website analysis completed for: ${url}`);
        } catch (analysisError) {
          console.warn(`Website analysis failed for ${url}:`, analysisError);
          results.website = {
            url,
            error: "Real-time analysis failed",
            fallback: true
          };
        }
      }

      // Check domain trust score if domain provided separately
      if (domain && !url) {
        try {
          let domainScore = null;
          if (typeof (storage as any).getDomainTrustScore === 'function') {
            domainScore = await (storage as any).getDomainTrustScore(domain.toLowerCase());
          }
          results.domain = domainScore || {
            domain: domain.toLowerCase(),
            trustScore: 50,
            riskLevel: "medium",
            category: "unknown"
          };
        } catch (error) {
          console.warn(`Domain check failed for ${domain}:`, error);
          results.domain = { 
            domain: domain.toLowerCase(),
            trustScore: 50,
            riskLevel: "medium",
            category: "unknown"
          };
        }
      }

      // Check phone if provided
      if (phoneNumber) {
        try {
          let phoneFlag = null;
          if (typeof (storage as any).getPhoneNumberFlag === 'function') {
            phoneFlag = await (storage as any).getPhoneNumberFlag(phoneNumber);
          }
          results.phone = phoneFlag || {
            phoneNumber,
            riskLevel: "low",
            fraudScore: 10,
            carrier: "unknown"
          };
        } catch (error) {
          console.warn(`Phone check failed for ${phoneNumber}:`, error);
          results.phone = { 
            phoneNumber,
            riskLevel: "low",
            fraudScore: 10,
            carrier: "unknown"
          };
        }
      }

      // Get related fraud reports
      const reports: any[] = [];
      if (domain) {
        try {
          if (typeof (storage as any).getFraudReportsByTarget === 'function') {
            const domainReports = await (storage as any).getFraudReportsByTarget('domain', domain);
            if (domainReports) reports.push(...domainReports);
          }
        } catch (error) {
          console.warn(`Failed to get domain reports:`, error);
        }
      }
      if (phoneNumber) {
        try {
          if (typeof (storage as any).getFraudReportsByTarget === 'function') {
            const phoneReports = await (storage as any).getFraudReportsByTarget('phone', phoneNumber);
            if (phoneReports) reports.push(...phoneReports);
          }
        } catch (error) {
          console.warn(`Failed to get phone reports:`, error);
        }
      }

      results.reports = reports;
      results.checkDate = new Date().toISOString();
      results.realTimeAnalysis = true;

      console.log(`Comprehensive fraud check completed for:`, Object.keys(results));
      res.json(results);
    } catch (error: any) {
      console.error("Comprehensive fraud check failed:", error);
      res.status(500).json({ error: "Failed to perform fraud check", details: error.message });
    }
  });

  // ==================== CRM Routes ====================
  
  // CRM Contacts
  app.get("/api/crm/contacts", requireAuth, validateQuery(paginationSchema), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const contacts = await storage.getCrmContacts(req.user.id, page, limit);
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/crm/contacts", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const contact = await storage.createCrmContact({ ...req.body, userId: req.user.id });
      res.status(201).json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/crm/contacts/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const contact = await storage.getCrmContact(parseInt(req.params.id), req.user.id);
      if (!contact) return res.status(404).json({ error: "Contact not found" });
      res.json(contact);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/crm/contacts/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const contact = await storage.updateCrmContact(parseInt(req.params.id), req.user.id, req.body);
      if (!contact) return res.status(404).json({ error: "Contact not found" });
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/crm/contacts/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      await storage.deleteCrmContact(parseInt(req.params.id), req.user.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // CRM Leads
  app.get("/api/crm/leads", requireAuth, validateQuery(paginationSchema), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const leads = await storage.getCrmLeads(req.user.id, page, limit);
      res.json(leads);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/crm/leads", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const lead = await storage.createCrmLead({ ...req.body, userId: req.user.id });
      res.status(201).json(lead);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/crm/leads/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const lead = await storage.updateCrmLead(parseInt(req.params.id), req.user.id, req.body);
      if (!lead) return res.status(404).json({ error: "Lead not found" });
      res.json(lead);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // CRM Opportunities
  app.get("/api/crm/opportunities", requireAuth, validateQuery(paginationSchema), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const opportunities = await storage.getCrmOpportunities(req.user.id, page, limit);
      res.json(opportunities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/crm/opportunities", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const opportunity = await storage.createCrmOpportunity({ ...req.body, userId: req.user.id });
      res.status(201).json(opportunity);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/crm/opportunities/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const opportunity = await storage.updateCrmOpportunity(parseInt(req.params.id), req.user.id, req.body);
      if (!opportunity) return res.status(404).json({ error: "Opportunity not found" });
      res.json(opportunity);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // CRM Interactions
  app.get("/api/crm/interactions", requireAuth, validateQuery(paginationSchema), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const contactId = req.query.contactId ? parseInt(req.query.contactId as string) : undefined;
      const leadId = req.query.leadId ? parseInt(req.query.leadId as string) : undefined;
      const opportunityId = req.query.opportunityId ? parseInt(req.query.opportunityId as string) : undefined;
      const interactions = await storage.getCrmInteractions(req.user.id, { contactId, leadId, opportunityId }, page, limit);
      res.json(interactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/crm/interactions", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const interaction = await storage.createCrmInteraction({ ...req.body, userId: req.user.id });
      res.status(201).json(interaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // CRM Analytics
  app.get("/api/crm/analytics", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const analytics = await storage.getCrmAnalytics(req.user.id);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ==================== HR Routes ====================
  
  // HR Employees
  app.get("/api/hr/employees", requireAuth, validateQuery(paginationSchema), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const employees = await storage.getHrEmployees(page, limit);
      res.json(employees);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hr/employees", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const employee = await storage.createHrEmployee(req.body);
      res.status(201).json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/hr/employees/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const employee = await storage.getHrEmployee(parseInt(req.params.id));
      if (!employee) return res.status(404).json({ error: "Employee not found" });
      res.json(employee);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/hr/employees/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const employee = await storage.updateHrEmployee(parseInt(req.params.id), req.body);
      if (!employee) return res.status(404).json({ error: "Employee not found" });
      res.json(employee);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // HR Attendance
  app.get("/api/hr/attendance", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const attendance = await storage.getHrAttendance(employeeId, startDate, endDate);
      res.json(attendance);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hr/attendance", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const attendance = await storage.createHrAttendance(req.body);
      res.status(201).json(attendance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/hr/attendance/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const attendance = await storage.updateHrAttendance(parseInt(req.params.id), req.body);
      if (!attendance) return res.status(404).json({ error: "Attendance record not found" });
      res.json(attendance);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // HR Leave Requests
  app.get("/api/hr/leave-requests", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
      const status = req.query.status as string;
      const leaveRequests = await storage.getHrLeaveRequests(employeeId, status);
      res.json(leaveRequests);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hr/leave-requests", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const leaveRequest = await storage.createHrLeaveRequest(req.body);
      res.status(201).json(leaveRequest);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/hr/leave-requests/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const leaveRequest = await storage.updateHrLeaveRequest(parseInt(req.params.id), req.body);
      if (!leaveRequest) return res.status(404).json({ error: "Leave request not found" });
      res.json(leaveRequest);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // HR Performance Reviews
  app.get("/api/hr/performance-reviews", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const employeeId = req.query.employeeId ? parseInt(req.query.employeeId as string) : undefined;
      const reviews = await storage.getHrPerformanceReviews(employeeId);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hr/performance-reviews", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const review = await storage.createHrPerformanceReview(req.body);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // HR Recruitment
  app.get("/api/hr/recruitment", requireAuth, validateQuery(paginationSchema), async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const recruitment = await storage.getHrRecruitment(status, page, limit);
      res.json(recruitment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hr/recruitment", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const recruitment = await storage.createHrRecruitment(req.body);
      res.status(201).json(recruitment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/hr/recruitment/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const recruitment = await storage.updateHrRecruitment(parseInt(req.params.id), req.body);
      if (!recruitment) return res.status(404).json({ error: "Recruitment not found" });
      res.json(recruitment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // HR Job Applications
  app.get("/api/hr/job-applications", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const recruitmentId = req.query.recruitmentId ? parseInt(req.query.recruitmentId as string) : undefined;
      const status = req.query.status as string;
      const applications = await storage.getHrJobApplications(recruitmentId, status);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/hr/job-applications", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const application = await storage.createHrJobApplication(req.body);
      res.status(201).json(application);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/hr/job-applications/:id", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const application = await storage.updateHrJobApplication(parseInt(req.params.id), req.body);
      if (!application) return res.status(404).json({ error: "Application not found" });
      res.json(application);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // HR Analytics
  app.get("/api/hr/analytics", requireAuth, async (req, res) => {
    try {
      if (!req.user) return res.sendStatus(401);
      const analytics = await storage.getHrAnalytics();
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contact Form Submission Endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, company, subject, message } = req.body;
      
      // Validation
      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: "First name, last name, email, and message are required" });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Log contact form submission
      console.log("Contact form submission received:", {
        firstName,
        lastName,
        email,
        phone: phone || "not provided",
        company: company || "not provided",
        subject: subject || "not specified",
        messageLength: message.length,
        messagePreview: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
        timestamp: new Date().toISOString(),
        ipAddress: req.ip || "unknown",
      });

      // In a production environment, you would:
      // 1. Store the contact in a database table
      // 2. Send an email notification to the support team
      // 3. Send an auto-reply to the user
      // 4. Create a ticket in your support system
      
      // For now, return success response
      res.status(201).json({ 
        success: true, 
        message: "Your message has been received. We'll get back to you within 24 hours."
      });
    } catch (error: any) {
      console.error("Failed to process contact form:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
