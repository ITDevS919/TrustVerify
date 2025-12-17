import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import { User as SelectUser } from "./shared/schema.ts";
import sgMail from "@sendgrid/mail";
import { config } from "./config";
import { authRateLimit } from "./security/security-middleware";
import AuditService, { AuditEventType, type AuditEvent } from "./security/audit-logger";
import { securityAlerts } from "./services/security-alerts";
import { wormStorage } from "./services/worm-storage";
import { setupGoogleAuth } from "./google-auth";
import { setupFacebookAuth } from "./facebook-auth";
import { setupGitHubAuth } from "./github-auth";
import { setupAppleAuth } from "./apple-auth";
import pino from "pino";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

import argon2 from "argon2";

const logger = pino({
  name: 'auth',
  level: config.LOG_LEVEL || 'info'
});

async function hashPassword(password: string) {
  // Validate password strength
  if (password.length < 12) {
    throw new Error("Password must be at least 12 characters long");
  }
  
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    return await argon2.verify(stored, supplied);
  } catch (error) {
    return false;
  }
}

function generateResetToken() {
  return randomBytes(32).toString("hex");
}

export function setupAuth(app: Express) {
  // Initialize SendGrid
  if (config.SENDGRID_API_KEY) {
    sgMail.setApiKey(config.SENDGRID_API_KEY);
  }

  // Session hardening: short timeouts, SameSite=Strict, secure cookies
  const sessionTimeoutMs = (config.SESSION_TIMEOUT_MINUTES || 30) * 60 * 1000;
  const isTest = config.NODE_ENV === 'test';
  const isDevelopment = config.NODE_ENV === 'development';
  
  const sessionSettings: session.SessionOptions = {
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    name: 'trustverify.sid', // Don't use default 'connect.sid'
    rolling: config.SESSION_EXTEND_ON_ACTIVITY, // Extend session on activity
    cookie: {
      secure: config.NODE_ENV === 'production', // HTTPS only in production
      sameSite: (isTest || isDevelopment) ? 'lax' : 'strict', // Use 'lax' in test/dev mode for better cookie handling with different ports
      httpOnly: true, // Prevent XSS attacks
      maxAge: sessionTimeoutMs, // Short timeout (default 30 minutes)
      domain: config.NODE_ENV === 'production' ? undefined : undefined, // Set domain in production if needed
      path: '/',
    },
    // Additional security settings
    genid: () => {
      // Use cryptographically secure random ID
      return randomBytes(32).toString('hex');
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup Google OAuth
  setupGoogleAuth(app);
  setupFacebookAuth(app);
  setupGitHubAuth(app);
  setupAppleAuth(app);
  
  passport.use(
    new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !user.password || !(await comparePasswords(password, user.password))) {
          // Record auth failure
          securityAlerts.recordAuthFailure(
            user?.id,
            req.ip || 'unknown',
            req.get('User-Agent'),
            req.path
          );
          
          // Log to audit
          AuditService.logFailedAttempt(
            AuditEventType.LOGIN_FAILURE,
            req,
            user ? 'Invalid password' : 'User not found'
          );
          
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user: any, done: (err: any, id?: number) => void) => done(null, user.id));
  passport.deserializeUser(async (id: number, done: (err: any, user?: any) => void) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", authRateLimit, async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      
      // Validate required fields
      if (!username || !email || !password) {
        return res.status(400).json({ error: "Username, email, and password are required" });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      
      // Validate password strength
      if (!password || password.length < 12) {
        return res.status(400).json({ error: "Password must be at least 12 characters long" });
      }

      // Validate username format (alphanumeric, underscore, hyphen, 3-30 chars)
      const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: "Username must be 3-30 characters and contain only letters, numbers, underscores, or hyphens" });
      }

      try {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ error: "Username already exists" });
        }
      } catch (error: any) {
        // If database error occurs, treat as validation error for security
        logger.warn({ error, username }, 'Error checking username - treating as invalid');
        return res.status(400).json({ error: "Invalid username format" });
      }

      try {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail) {
          return res.status(400).json({ error: "Email already registered" });
        }
      } catch (error: any) {
        // If database error occurs, treat as validation error for security
        logger.warn({ error, email }, 'Error checking email - treating as invalid');
        return res.status(400).json({ error: "Invalid email format" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error: any) {
      logger.error({ error, body: req.body }, 'Registration error');
      // Don't expose internal errors
      const message = process.env.NODE_ENV === 'production' 
        ? 'Registration failed. Please try again.'
        : error.message;
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/login", authRateLimit, (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || 'Invalid credentials' });
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        AuditService.logUserAction(AuditEventType.LOGIN_SUCCESS, user, req);
        
        // Write to WORM storage
        const auditEvent: AuditEvent = {
          eventType: AuditEventType.LOGIN_SUCCESS,
          userId: user.id,
          userEmail: user.email,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          success: true,
        };
        wormStorage.writeRecord(auditEvent).catch((err) => {
          logger.error({ err }, 'Failed to write to WORM storage');
        });
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    if (req.user) {
      AuditService.logUserAction(AuditEventType.LOGOUT, req.user, req);
    }
    req.logout((err) => {
      if (err) return next(err);
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    res.json(req.user);
  });

  // Password reset request
  app.post("/api/reset-password", authRateLimit, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Return success even if user doesn't exist for security
        return res.json({ message: "If an account with that email exists, a reset link has been sent" });
      }

      const resetToken = generateResetToken();
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      await storage.createPasswordReset(user.id, resetToken, expiresAt);

      // Send password reset email using SendGrid
      if (process.env.SENDGRID_API_KEY) {
        try {
          const resetUrl = `${req.protocol}://${req.get('host')}/password-reset?token=${resetToken}`;
          
          const msg = {
            to: email,
            from: 'noreply@trustverify.com', // Use your verified sender
            subject: 'Reset Your TrustVerify Password',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background-color: #1e60f3; padding: 20px; text-align: center;">
                  <h1 style="color: white; margin: 0;">TrustVerify</h1>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                  <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
                  <p style="color: #666; line-height: 1.6;">
                    You requested to reset your password for your TrustVerify account. 
                    Click the button below to create a new password:
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #1e60f3; color: white; padding: 12px 30px; 
                              text-decoration: none; border-radius: 5px; display: inline-block;
                              font-weight: bold;">
                      Reset Password
                    </a>
                  </div>
                  <p style="color: #666; font-size: 14px;">
                    If you didn't request this password reset, you can safely ignore this email.
                    This link will expire in 1 hour.
                  </p>
                  <p style="color: #666; font-size: 14px;">
                    For security, this link can only be used once.
                  </p>
                </div>
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; 
                           color: #666; font-size: 12px;">
                  © 2024 TrustVerify. All rights reserved.
                </div>
              </div>
            `,
          };

          await sgMail.send(msg);
          console.log(`Password reset email sent to: ${email}`);
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
          // Continue anyway - don't fail the request if email fails
        }
      }
      
      res.json({ 
        message: "If an account with that email exists, a reset link has been sent"
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Password reset confirmation
  app.post("/api/reset-password/confirm", authRateLimit, async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      // Validate new password strength
      if (newPassword.length < 12) {
        return res.status(400).json({ message: "Password must be at least 12 characters long" });
      }

      const reset = await storage.getPasswordReset(token);
      if (!reset || reset.expiresAt < new Date()) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUserPassword(reset.userId, hashedPassword);
      await storage.deletePasswordReset(token);

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset confirmation error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}
