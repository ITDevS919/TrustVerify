import "express-async-errors";
import express from "express";
import { registerRoutes } from "./routes";
import { log, serveStatic } from "./utils";
import { config } from "./config";
import pino from "pino";
import pinoHttp from "pino-http";
import { 
  securityHeaders, 
  apiRateLimit, 
  preventSqlInjection, 
  preventXSS, 
  securityLogger,
  enhanceSessionSecurity
} from "./security/security-middleware";
import { auditMiddleware } from "./security/audit-logger";
import { complianceMiddleware } from "./security/compliance";
// import { calculateSecurityScore } from "./security/security-config"; // Unused
import { extractApiVersion } from "./middleware/api-versioning";
import { configureBodyParser, validatePayloadSize } from "./middleware/payload-validation";
// import { siemService } from "./services/siem-integration"; // Unused
import { gdprDataManagement } from "./services/gdpr-data-management";
import { requestIdMiddleware, errorHandler, notFoundHandler } from "./middleware/error-handler";
import { telemetryMiddleware } from "./middleware/telemetry";
import { metricsMiddleware, monitoringService } from "./services/monitoring-service";
import { healthCheckService } from "./services/health-check-service";
import { deploymentGovernance } from "./services/deployment-governance";
import { queryOptimizer } from "./services/query-optimizer";
import { telemetryService } from "./services/telemetry";
import { wormStorage } from "./services/worm-storage";
import { securityAlerts } from "./services/security-alerts";
import { incidentResponse } from "./services/incident-response";

// Initialize structured logging
const logger = pino({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  transport: config.NODE_ENV === "development" ? {
    target: "pino-pretty",
    options: { colorize: true }
  } : undefined,
});

const app = express();

// Security middleware - must be first
app.use(securityHeaders);
app.use(securityLogger);
app.use(auditMiddleware);
app.use(complianceMiddleware);

// Request ID middleware (must be early)
app.use(requestIdMiddleware);

// Telemetry middleware (adds correlation IDs and traces)
app.use(telemetryMiddleware);

// Request logging middleware
app.use(pinoHttp({ logger }));

// Metrics middleware (for RED metrics)
app.use(metricsMiddleware);

// Rate limiting for API routes
app.use('/api', apiRateLimit);

// Input sanitization and validation
app.use(preventSqlInjection);
app.use(preventXSS);

// API versioning - must be before routes
app.use('/api', extractApiVersion);

// Body parsing with size limits (using new middleware)
configureBodyParser(app);
app.use('/api', validatePayloadSize(config.API_MAX_PAYLOAD_SIZE_MB));

// Session security enhancement
app.use(enhanceSessionSecurity);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Log security configuration on startup
  try {
    const securityModule = await import("./security/security-config.js");
    const securityMetrics = securityModule.calculateSecurityScore();
    logger.info({
      securityScore: securityMetrics.configurationScore,
      criticalIssues: securityMetrics.criticalIssues,
      warnings: securityMetrics.warnings,
      environment: config.NODE_ENV
    }, 'Security configuration loaded');

    if (securityMetrics.criticalIssues.length > 0) {
      logger.error({ issues: securityMetrics.criticalIssues }, 'Critical security issues detected');
    }
  } catch (error) {
    logger.warn('Security configuration check failed during startup');
  }

  const server = await registerRoutes(app);

  // Health check endpoints
  app.get('/health', async (_req, res) => {
    const health = await healthCheckService.performHealthCheck();
    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(health);
  });

  app.get('/health/live', (_req, res) => {
    const isAlive = healthCheckService.isAlive();
    res.status(isAlive ? 200 : 503).json({ alive: isAlive });
  });

  app.get('/health/ready', async (_req, res) => {
    const isReady = await healthCheckService.isReady();
    res.status(isReady ? 200 : 503).json({ ready: isReady });
  });

  // Metrics endpoint
  app.get('/metrics', (_req, res) => {
    const metrics = monitoringService.getDashboardMetrics();
    res.json(metrics);
  });

  // Query optimization endpoints
  app.get('/api/admin/query-stats', async (_req, res) => {
    try {
      const slowQueries = await queryOptimizer.getSlowQueries(10);
      const indexUsage = await queryOptimizer.checkIndexUsage();
      const tableStats = await queryOptimizer.getTableStats();
      
      res.json({
        slowQueries,
        unusedIndexes: indexUsage,
        tableStats,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/vacuum', async (req, res) => {
    try {
      const { tables } = req.body;
      await queryOptimizer.vacuumTables(tables);
      res.json({ message: 'Vacuum completed' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Observability endpoints
  app.get('/api/admin/telemetry/context/:correlationId', async (req, res) => {
    try {
      const context = telemetryService.getContext(req.params.correlationId);
      if (!context) {
        return res.status(404).json({ error: 'Context not found' });
      }
      res.json(context);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/security/dashboard', async (_req, res) => {
    try {
      const metrics = securityAlerts.getDashboardMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/security/alerts', async (req, res) => {
    try {
      const { severity, resolved } = req.query;
      let alerts = securityAlerts.getActiveAlerts(severity as any);
      
      if (resolved === 'true') {
        // Include resolved alerts if requested
        alerts = [...alerts, ...securityAlerts.getActiveAlerts()];
      }
      
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/security/alerts/:id/resolve', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const resolved = securityAlerts.resolveAlert(req.params.id, req.user.id);
      if (!resolved) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      res.json({ message: 'Alert resolved' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/incidents', async (req, res) => {
    try {
      const { status } = req.query;
      const incidents = incidentResponse.getIncidents(status as any);
      res.json(incidents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/incidents/:id', async (req, res) => {
    try {
      const incident = incidentResponse.getIncident(req.params.id);
      if (!incident) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      res.json(incident);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/incidents/:id/status', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { status } = req.body;
      const updated = incidentResponse.updateIncidentStatus(
        req.params.id,
        status,
        req.user.id
      );
      if (!updated) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      res.json({ message: 'Incident status updated' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/incidents/:id/steps/:stepId/complete', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { notes } = req.body;
      const completed = incidentResponse.completeStep(
        req.params.id,
        req.params.stepId,
        req.user.id,
        notes
      );
      if (!completed) {
        return res.status(404).json({ error: 'Incident or step not found' });
      }
      res.json({ message: 'Step completed' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/admin/incidents/:id/notes', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { content } = req.body;
      const added = incidentResponse.addNote(req.params.id, req.user.id, content);
      if (!added) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      res.json({ message: 'Note added' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/admin/runbooks', async (req, res) => {
    try {
      const { category } = req.query;
      const runbooks = incidentResponse.getRunbooks(category as any);
      res.json(runbooks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Feature Expansion endpoints
  const { fraudDetectionEngineV2 } = await import('./services/fraud-detection-v2');
  const { vendorIntegrations } = await import('./services/vendor-integrations');
  const { trustBadgeService } = await import('./services/trust-badge');
  const { sandboxService } = await import('./services/sandbox');

  // Simple requireAuth middleware for index.ts routes
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Fraud Detection v2 endpoints
  app.post('/api/fraud/analyze', requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { transactionId, ipAddress, userAgent, deviceFingerprint } = req.body;
      
      if (!transactionId) {
        return res.status(400).json({ error: 'transactionId is required' });
      }

      const result = await fraudDetectionEngineV2.analyzeTransaction(
        transactionId,
        req.user.id,
        ipAddress || req.ip || 'unknown',
        userAgent || req.get('User-Agent'),
        deviceFingerprint
      );

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/fraud/result/:transactionId', requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await fraudDetectionEngineV2.getCachedResult(parseInt(req.params.transactionId));
      if (!result) {
        return res.status(404).json({ error: 'Fraud detection result not found' });
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vendor Integration endpoints
  app.post('/api/vendor/identity/verify', requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { email, phone, documentData } = req.body;
      const result = await vendorIntegrations.verifyIdentity(
        req.user.id,
        email || req.user.email || '',
        phone,
        documentData
      );

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/vendor/ip/:ipAddress', requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await vendorIntegrations.checkIPReputation(req.params.ipAddress);
      if (!result) {
        return res.status(404).json({ error: 'IP reputation data not available' });
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/vendor/threat/check', requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { ipAddress, email } = req.body;
      const result = await vendorIntegrations.checkThreatIntelligence(
        req.user.id,
        ipAddress || req.ip || 'unknown',
        email || req.user.email
      );

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Trust Badge endpoints
  app.get('/api/trust-badge/:userId', async (req, res) => {
    try {
      const badge = await trustBadgeService.getTrustBadge(parseInt(req.params.userId));
      res.json(badge);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/trust-badge/:userId/report', requireAuth, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userId = parseInt(req.params.userId);
      
      // Users can only view their own report unless admin
      if (req.user.id !== userId && !req.user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const report = await trustBadgeService.generateReport(userId);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/trust-badge/:userId/image', async (req, res) => {
    try {
      const badge = await trustBadgeService.getTrustBadge(parseInt(req.params.userId));
      const imageUrl = trustBadgeService.getBadgeImageUrl(parseInt(req.params.userId), badge.badgeLevel);
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/trust-badge/:userId/embed', async (req, res) => {
    try {
      const badge = await trustBadgeService.getTrustBadge(parseInt(req.params.userId));
      const embedCode = trustBadgeService.getBadgeEmbedCode(parseInt(req.params.userId), badge.badgeLevel);
      res.json({ embedCode, badgeLevel: badge.badgeLevel });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Sandbox endpoints
  app.get('/api/sandbox/personas', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      const personas = sandboxService.getPersonas();
      res.json(personas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/sandbox/personas/:id', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      const persona = sandboxService.getPersona(req.params.id);
      if (!persona) {
        return res.status(404).json({ error: 'Persona not found' });
      }

      res.json(persona);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/sandbox/personas', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      const persona = sandboxService.createPersona(req.body);
      res.json(persona);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/sandbox/scenarios', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      const scenarios = sandboxService.getScenarios();
      res.json(scenarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/sandbox/scenarios/:id', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      const scenario = sandboxService.getScenario(req.params.id);
      if (!scenario) {
        return res.status(404).json({ error: 'Scenario not found' });
      }

      res.json(scenario);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/sandbox/scenarios', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      const scenario = sandboxService.createScenario(req.body);
      res.json(scenario);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/sandbox/scenarios/:id/execute', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      const result = await sandboxService.executeScenario(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/sandbox/reset', requireAuth, async (req, res) => {
    try {
      if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      if (!sandboxService.isEnabled()) {
        return res.status(403).json({ error: 'Sandbox mode is not enabled' });
      }

      await sandboxService.resetSandbox();
      res.json({ message: 'Sandbox environment reset successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Deployment info endpoint
  app.get('/deployment/info', (_req, res) => {
    const deployment = deploymentGovernance.getCurrentDeployment();
    res.json({
      current: deployment,
      version: config.DEPLOYMENT_VERSION || 'unknown',
      environment: config.DEPLOYMENT_ENVIRONMENT || 'development',
      region: config.REGION || 'us-east-1',
    });
  });

  // Record deployment on startup
  if (config.DEPLOYMENT_VERSION) {
    deploymentGovernance.recordDeployment(
      config.DEPLOYMENT_VERSION,
      config.DEPLOYMENT_ENVIRONMENT || 'development',
      'system'
    ).then((deployment) => {
      logger.info({ deploymentId: deployment.id }, 'Deployment recorded on startup');
      // Mark as active after health check
      setTimeout(async () => {
        const health = await healthCheckService.performHealthCheck();
        if (health.status === 'healthy' || health.status === 'degraded') {
          await deploymentGovernance.markDeploymentActive(deployment.id);
        }
      }, 5000);
    });
  }

  // Schedule GDPR data retention processing (daily)
  if (config.GDPR_ENABLED) {
    // Run data retention check daily at 2 AM
    const scheduleDataRetention = () => {
      const now = new Date();
      const nextRun = new Date(now);
      nextRun.setHours(2, 0, 0, 0);
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1);
      }
      
      const msUntilNext = nextRun.getTime() - now.getTime();
      setTimeout(async () => {
        try {
          logger.info('Running scheduled data retention processing');
          await gdprDataManagement.processDataRetention();
        } catch (error) {
          logger.error({ error }, 'Data retention processing failed');
        }
        scheduleDataRetention(); // Schedule next run
      }, msUntilNext);
    };
    
    scheduleDataRetention();
    logger.info('GDPR data retention scheduler initialized');
  }

  // Schedule WORM storage cleanup (daily)
  setInterval(() => {
    wormStorage.cleanupOldRecords().catch((err) => {
      logger.error({ err }, 'WORM storage cleanup failed');
    });
  }, 24 * 60 * 60 * 1000); // Daily

  // Auto-create incidents from critical alerts (every 5 minutes)
  setInterval(() => {
    const criticalAlerts = securityAlerts.getActiveAlerts('critical');
    criticalAlerts.forEach(alert => {
      // Check if incident already exists for this alert
      const incidents = incidentResponse.getIncidents();
      const existingIncident = incidents.find(i => i.alertIds.includes(alert.id));
      
      if (!existingIncident) {
        incidentResponse.createIncidentFromAlert(alert);
      }
    });
  }, 5 * 60 * 1000);

  // Schedule dispute workflow processing (every 5 minutes)
  setInterval(async () => {
    try {
      const { DisputeWorkflowEngine } = await import('./services/dispute-workflow-engine');
      await DisputeWorkflowEngine.processPendingWorkflows();
    } catch (error) {
      logger.error({ error }, 'Dispute workflow processing failed');
    }
  }, 5 * 60 * 1000); // Every 5 minutes
  logger.info('Dispute workflow scheduler initialized'); // Every 5 minutes

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  // Serve static files in production
  if (config.NODE_ENV === "production") {
    serveStatic(app);
  }

  // Serve the app on configured port
  const port = config.PORT;
  server.listen({
    port,
    host: "0.0.0.0",
    // reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    if (config.NODE_ENV === 'production') {
      logger.info('Production server started with enhanced security');
    }
  });
})();
