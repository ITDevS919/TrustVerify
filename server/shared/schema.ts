import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with enhanced reputation system
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImage: text("profile_image"),
  authProvider: text("auth_provider").default("local"), // local, google, facebook, github, apple
  googleId: text("google_id").unique(),
  facebookId: text("facebook_id").unique(),
  githubId: text("github_id").unique(),
  appleId: text("apple_id").unique(),
  isVerified: boolean("is_verified").default(false),
  trustScore: decimal("trust_score", { precision: 5, scale: 2 }).default("0.00"),
  verificationLevel: text("verification_level").default("none"), // none, basic, full
  isAdmin: boolean("is_admin").default(false),
  // Tiered Seller Reputation System
  sellerTier: text("seller_tier").default("new"), // new, bronze, silver, gold, platinum
  completedTransactions: integer("completed_transactions").default(0),
  successfulTransactions: integer("successful_transactions").default(0),
  disputesAgainst: integer("disputes_against").default(0),
  validDisputes: integer("valid_disputes").default(0), // Disputes where seller was at fault
  // Auto-Sanctions System
  sanctionLevel: integer("sanction_level").default(0), // 0=none, 1=flagged, 2=restricted, 3=suspended
  sanctionReason: text("sanction_reason"),
  sanctionedUntil: timestamp("sanctioned_until"),
  // Reputation Modifiers
  fastReleaseEligible: boolean("fast_release_eligible").default(false), // Trusted sellers
  requiresExtendedBuffer: boolean("requires_extended_buffer").default(false), // High-risk sellers
  // MFA fields
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: text("mfa_secret"),
  mfaBackupCodes: jsonb("mfa_backup_codes"), // Array of backup codes
  lastMfaUsed: timestamp("last_mfa_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Password Reset table
export const passwordResets = pgTable("password_resets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// KYC Verification table
export const kycVerifications = pgTable("kyc_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  documentType: text("document_type").notNull(), // passport, license, id_card
  documentNumber: text("document_number"),
  status: text("status").default("pending"), // pending, approved, rejected
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

// Transactions table with advanced dispute resolution
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").default("pending"), // pending, active, escrow, buffer_period, completed, disputed, cancelled
  buyerId: integer("buyer_id").references(() => users.id).notNull(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  milestones: jsonb("milestones"),
  // Buffer Period System
  bufferPeriodHours: integer("buffer_period_hours").default(72), // 24-72 hours based on seller reputation
  bufferStartTime: timestamp("buffer_start_time"), // When buffer period began
  bufferEndTime: timestamp("buffer_end_time"), // When funds will be released
  disputeWindowHours: integer("dispute_window_hours").default(72), // 3 days for dispute filing
  disputeDeadline: timestamp("dispute_deadline"), // Deadline for filing disputes
  // Smart Flagging System
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }).default("0.00"), // AI-calculated risk
  fraudFlags: jsonb("fraud_flags"), // Array of detected fraud indicators
  autoSanctioned: boolean("auto_sanctioned").default(false), // Auto-sanctions applied
  escalationLevel: integer("escalation_level").default(0), // 0=normal, 1=flagged, 2=high-risk, 3=critical
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id).notNull(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isSystemMessage: boolean("is_system_message").default(false),
  flaggedAsScam: boolean("flagged_as_scam").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scam Reports table
export const scamReports = pgTable("scam_reports", {
  id: serial("id").primaryKey(),
  reporterId: integer("reporter_id").references(() => users.id).notNull(),
  scammerInfo: text("scammer_info").notNull(), // username, email, phone
  scamType: text("scam_type").notNull(),
  description: text("description").notNull(),
  evidence: jsonb("evidence"), // file paths, screenshots
  status: text("status").default("pending"), // pending, verified, dismissed
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
});

// Enhanced Disputes table with smart flagging
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id).notNull(),
  raisedBy: integer("raised_by").references(() => users.id).notNull(),
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"), // open, investigating, resolved, closed
  resolution: text("resolution"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  // Smart Dispute Flagging
  disputeType: text("dispute_type").notNull(), // item_not_received, scam, quality_issue, unauthorized_charge
  aiConfidenceScore: decimal("ai_confidence_score", { precision: 5, scale: 2 }).default("0.00"),
  fraudIndicators: jsonb("fraud_indicators"), // Array of detected patterns
  priorityLevel: text("priority_level").default("normal"), // low, normal, high, critical
  autoFlagged: boolean("auto_flagged").default(false),
  escalatedToHuman: boolean("escalated_to_human").default(false),
  // Escalation Queue Management
  queuePosition: integer("queue_position"),
  assignedAgent: integer("assigned_agent").references(() => users.id),
  slaDeadline: timestamp("sla_deadline"), // Service level agreement deadline
  evidenceSubmitted: jsonb("evidence_submitted"), // Files, screenshots, etc.
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Auto-Sanctions Tracking table
export const sanctions = pgTable("sanctions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  sanctionType: text("sanction_type").notNull(), // warning, restriction, suspension, ban
  reason: text("reason").notNull(),
  description: text("description"),
  severity: integer("severity").default(1), // 1-5 scale
  automaticSanction: boolean("automatic_sanction").default(false),
  triggeredBy: text("triggered_by"), // dispute_count, fraud_score, manual_review
  disputeId: integer("dispute_id").references(() => disputes.id), // Related dispute if applicable
  durationHours: integer("duration_hours"), // NULL for permanent
  isActive: boolean("is_active").default(true),
  appliedBy: integer("applied_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  revokedAt: timestamp("revoked_at"),
});

// Escalation Queue table for dispute management
export const escalationQueue = pgTable("escalation_queue", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").references(() => disputes.id).notNull(),
  queueType: text("queue_type").default("standard"), // standard, priority, critical
  assignedTeam: text("assigned_team"), // fraud_team, dispute_resolution, legal
  position: integer("position").notNull(),
  slaHours: integer("sla_hours").default(24), // Service level agreement
  escalatedAt: timestamp("escalated_at").defaultNow(),
  assignedAt: timestamp("assigned_at"),
  completedAt: timestamp("completed_at"),
});

// Third-party arbitration tracking
export const arbitrationCases = pgTable("arbitration_cases", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").references(() => disputes.id).notNull(),
  provider: text("provider").notNull(), // external arbitration service
  caseNumber: text("case_number"),
  status: text("status").default("initiated"), // initiated, pending, resolved, failed
  cost: decimal("cost", { precision: 10, scale: 2 }),
  outcome: text("outcome"), // buyer_favor, seller_favor, split_decision
  arbitratorNotes: text("arbitrator_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Developer Accounts table
export const developerAccounts = pgTable("developer_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: text("company_name"),
  website: text("website"),
  description: text("description"),
  status: text("status").default("pending"), // pending, approved, suspended
  monthlyQuota: integer("monthly_quota").default(1000),
  currentUsage: integer("current_usage").default(0),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by").references(() => users.id),
});

// API Keys table
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").references(() => developerAccounts.id).notNull(),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  keyPrefix: text("key_prefix").notNull(), // First 8 chars for display
  permissions: jsonb("permissions").default('[]'), // Array of endpoint permissions
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  revokedAt: timestamp("revoked_at"),
  // API Key Rotation and Quota Management
  environment: text("environment").default("sandbox"), // sandbox, production
  rotationDue: timestamp("rotation_due"), // When key should be rotated
  lastRotated: timestamp("last_rotated"), // Last rotation timestamp
  rateLimit: integer("rate_limit").default(100), // Requests per minute
  monthlyQuota: integer("monthly_quota"), // Monthly request quota
  currentMonthUsage: integer("current_month_usage").default(0), // Current month's usage
  quotaResetDate: timestamp("quota_reset_date"), // When quota resets
  ipWhitelist: jsonb("ip_whitelist").default('[]'), // Allowed IP addresses
  userAgent: text("user_agent"), // Expected user agent
});

// API Usage Logs table
export const apiUsageLogs = pgTable("api_usage_logs", {
  id: serial("id").primaryKey(),
  apiKeyId: integer("api_key_id").references(() => apiKeys.id).notNull(),
  developerId: integer("developer_id").references(() => developerAccounts.id).notNull(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time"), // in milliseconds
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  requestSize: integer("request_size"), // in bytes
  responseSize: integer("response_size"), // in bytes
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  messages: many(messages),
  scamReports: many(scamReports),
  disputes: many(disputes),
  kycVerifications: many(kycVerifications),
  developerAccount: many(developerAccounts),
  passwordResets: many(passwordResets),
}));

export const passwordResetsRelations = relations(passwordResets, ({ one }) => ({
  user: one(users, {
    fields: [passwordResets.userId],
    references: [users.id],
  }),
}));

export const developerAccountsRelations = relations(developerAccounts, ({ one, many }) => ({
  user: one(users, {
    fields: [developerAccounts.userId],
    references: [users.id],
  }),
  apiKeys: many(apiKeys),
  usageLogs: many(apiUsageLogs),
}));

export const apiKeysRelations = relations(apiKeys, ({ one, many }) => ({
  developer: one(developerAccounts, {
    fields: [apiKeys.developerId],
    references: [developerAccounts.id],
  }),
  usageLogs: many(apiUsageLogs),
}));

export const apiUsageLogsRelations = relations(apiUsageLogs, ({ one }) => ({
  apiKey: one(apiKeys, {
    fields: [apiUsageLogs.apiKeyId],
    references: [apiKeys.id],
  }),
  developer: one(developerAccounts, {
    fields: [apiUsageLogs.developerId],
    references: [developerAccounts.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one, many }) => ({
  buyer: one(users, {
    fields: [transactions.buyerId],
    references: [users.id],
  }),
  seller: one(users, {
    fields: [transactions.sellerId],
    references: [users.id],
  }),
  messages: many(messages),
  disputes: many(disputes),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  transaction: one(transactions, {
    fields: [messages.transactionId],
    references: [transactions.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const scamReportsRelations = relations(scamReports, ({ one }) => ({
  reporter: one(users, {
    fields: [scamReports.reporterId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [scamReports.reviewedBy],
    references: [users.id],
  }),
}));

export const disputesRelations = relations(disputes, ({ one }) => ({
  transaction: one(transactions, {
    fields: [disputes.transactionId],
    references: [transactions.id],
  }),
  raiser: one(users, {
    fields: [disputes.raisedBy],
    references: [users.id],
  }),
  resolver: one(users, {
    fields: [disputes.resolvedBy],
    references: [users.id],
  }),
}));

export const kycVerificationsRelations = relations(kycVerifications, ({ one }) => ({
  user: one(users, {
    fields: [kycVerifications.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [kycVerifications.reviewedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  profileImage: true,
  authProvider: true,
  googleId: true,
  facebookId: true,
  githubId: true,
  appleId: true,
  isVerified: true,
}).extend({
  password: z.string()
    .min(12, "Password must be at least 12 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      "Password must contain uppercase, lowercase, number, and special character")
    .optional(),
}).partial({ username: true }).refine((data) => {
  // Either password auth (local) or OAuth
  if (data.authProvider === 'local') {
    return data.password && data.username;
  }
  return true;
}, {
  message: "Username and password required for local authentication",
});

export const insertKycSchema = createInsertSchema(kycVerifications).pick({
  documentType: true,
  documentNumber: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  title: true,
  description: true,
  amount: true,
  sellerId: true,
  milestones: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  transactionId: true,
  content: true,
});

export const insertScamReportSchema = createInsertSchema(scamReports).pick({
  scammerInfo: true,
  scamType: true,
  description: true,
  evidence: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).pick({
  transactionId: true,
  reason: true,
  description: true,
});

// Developer Portal schemas
export const insertDeveloperAccountSchema = createInsertSchema(developerAccounts).pick({
  companyName: true,
  website: true,
  description: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).pick({
  name: true,
  permissions: true,
  expiresAt: true,
});

export const insertApiUsageLogSchema = createInsertSchema(apiUsageLogs).pick({
  endpoint: true,
  method: true,
  statusCode: true,
  responseTime: true,
  userAgent: true,
  ipAddress: true,
  requestSize: true,
  responseSize: true,
  errorMessage: true,
});

export const insertPasswordResetSchema = createInsertSchema(passwordResets).pick({
  userId: true,
  token: true,
  expiresAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertKyc = z.infer<typeof insertKycSchema>;
export type KycVerification = typeof kycVerifications.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertScamReport = z.infer<typeof insertScamReportSchema>;
export type ScamReport = typeof scamReports.$inferSelect;
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputes.$inferSelect;

// Developer Portal types
export type InsertDeveloperAccount = z.infer<typeof insertDeveloperAccountSchema>;
export type DeveloperAccount = typeof developerAccounts.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiUsageLog = z.infer<typeof insertApiUsageLogSchema>;
export type ApiUsageLog = typeof apiUsageLogs.$inferSelect;
export type InsertPasswordReset = z.infer<typeof insertPasswordResetSchema>;
export type PasswordReset = typeof passwordResets.$inferSelect;

// Security Incidents table
export const securityIncidents = pgTable("security_incidents", {
  id: serial("id").primaryKey(),
  incidentType: text("incident_type").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  status: text("status").default("detected"), // detected, investigating, mitigated, resolved
  description: text("description").notNull(),
  affectedSystems: jsonb("affected_systems").default('[]'), // Array of strings
  sourceIp: text("source_ip"),
  userAgent: text("user_agent"),
  attackVector: text("attack_vector"),
  autoMitigated: boolean("auto_mitigated").default(false),
  ipBlacklisted: boolean("ip_blacklisted").default(false),
  socNotified: boolean("soc_notified").default(false),
  responseTime: integer("response_time"), // in seconds
  mitigationTime: integer("mitigation_time"), // in seconds
  assignedTo: integer("assigned_to").references(() => users.id),
  escalationLevel: integer("escalation_level").default(1),
  playbookExecuted: text("playbook_executed"),
  evidence: jsonb("evidence"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// IP Blacklist table
export const ipBlacklist = pgTable("ip_blacklist", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  reason: text("reason").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  sourceType: text("source_type").default("automatic"), // automatic, manual
  incidentId: integer("incident_id").references(() => securityIncidents.id),
  isActive: boolean("is_active").default(true),
  automaticExpiry: boolean("automatic_expiry").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  revokedAt: timestamp("revoked_at"),
});

// Insurance Coverage table
export const insuranceCoverage = pgTable("insurance_coverage", {
  id: serial("id").primaryKey(),
  clientOrgId: integer("client_org_id").references(() => developerAccounts.id).notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  policyNumber: text("policy_number").notNull(),
  coverageType: text("coverage_type").notNull(), // fraud_protection, chargeback_protection
  coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  fraudCheckRequired: boolean("fraud_check_required").default(true),
  apiComplianceRequired: boolean("api_compliance_required").default(true),
  fraudCheckCompleted: boolean("fraud_check_completed").default(false),
  apiComplianceVerified: boolean("api_compliance_verified").default(false),
  liabilityCap: decimal("liability_cap", { precision: 12, scale: 2 }),
  deductible: decimal("deductible", { precision: 12, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Insurance Claims table
export const insuranceClaims = pgTable("insurance_claims", {
  id: serial("id").primaryKey(),
  coverageId: integer("coverage_id").references(() => insuranceCoverage.id).notNull(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  claimAmount: text("claim_amount").notNull(), // Stored as text to preserve precision
  claimType: text("claim_type").notNull(), // fraud_loss, chargeback_loss
  status: text("status").default("submitted"), // submitted, investigating, approved, denied, paid
  fraudScoreReports: jsonb("fraud_score_reports").default('[]'),
  auditLogs: jsonb("audit_logs").default('[]'), // Array of log IDs
  complianceReport: text("compliance_report"),
  claimNotes: text("claim_notes"),
  investigationNotes: text("investigation_notes"),
  approvedAmount: text("approved_amount"), // Stored as text to preserve precision
  denialReason: text("denial_reason"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  paidAt: timestamp("paid_at"),
});

// Types
export type SecurityIncident = typeof securityIncidents.$inferSelect;
export type IPBlacklist = typeof ipBlacklist.$inferSelect;
export type InsuranceCoverage = typeof insuranceCoverage.$inferSelect;
export type InsuranceClaim = typeof insuranceClaims.$inferSelect;

