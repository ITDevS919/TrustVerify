import "express-async-errors";
import express, { type Request, Response, NextFunction } from "express";
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
import { securityConfig, calculateSecurityScore } from "./security/security-config";

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

// Request logging middleware
app.use(pinoHttp({ logger }));

// Rate limiting for API routes
app.use('/api', apiRateLimit);

// Input sanitization and validation
app.use(preventSqlInjection);
app.use(preventXSS);

// Body parsing with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

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

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

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
