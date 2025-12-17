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

// Enhanced Disputes table with smart flagging and AI arbitration
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id).notNull(),
  raisedBy: integer("raised_by").references(() => users.id).notNull(),
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"), // open, investigating, evidence_collection, ai_analysis, pending_ruling, resolved, closed, human_review
  resolution: text("resolution"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  // Smart Dispute Flagging
  disputeType: text("dispute_type").notNull(), // item_not_received, scam, quality_issue, unauthorized_charge, sla_breach
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
  // 72-Hour Workflow Tracking
  workflowStage: text("workflow_stage").default("created"), // created, evidence_collection, ai_analysis, final_ruling, completed
  workflowStartedAt: timestamp("workflow_started_at"),
  workflowDeadline: timestamp("workflow_deadline"), // 72 hours from start
  evidenceCollectionDeadline: timestamp("evidence_collection_deadline"), // 24 hours from start
  aiAnalysisDeadline: timestamp("ai_analysis_deadline"), // 48 hours from start
  // Escrow Status
  escrowFrozen: boolean("escrow_frozen").default(false),
  escrowFrozenAt: timestamp("escrow_frozen_at"),
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

// AI Arbitration Cases tracking
export const arbitrationCases = pgTable("arbitration_cases", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").references(() => disputes.id).notNull(),
  provider: text("provider").default("ai_arbitrator"), // ai_arbitrator, external_arbitration_service
  caseNumber: text("case_number"),
  status: text("status").default("initiated"), // initiated, evidence_collected, analyzing, ruling_generated, resolved, failed, human_review
  cost: decimal("cost", { precision: 10, scale: 2 }),
  outcome: text("outcome"), // buyer_favor, seller_favor, split_decision
  arbitratorNotes: text("arbitrator_notes"),
  // AI Decision Output
  buyerFault: decimal("buyer_fault", { precision: 5, scale: 2 }), // 0.00 to 1.00
  vendorFault: decimal("vendor_fault", { precision: 5, scale: 2 }), // 0.00 to 1.00
  recommendedPayoutToBuyer: decimal("recommended_payout_to_buyer", { precision: 12, scale: 2 }),
  recommendedPayoutToVendor: decimal("recommended_payout_to_vendor", { precision: 12, scale: 2 }),
  summary: text("summary"), // AI-generated summary
  confidenceScore: decimal("confidence_score", { precision: 5, scale: 2 }), // 0.00 to 1.00
  aiAnalysisResult: jsonb("ai_analysis_result"), // Full AI analysis JSON
  // Human Override
  humanReviewed: boolean("human_reviewed").default(false),
  humanReviewerId: integer("human_reviewer_id").references(() => users.id),
  humanOverrideReason: text("human_override_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Evidence Collection tracking
export const disputeEvidence = pgTable("dispute_evidence", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").references(() => disputes.id).notNull(),
  submittedBy: integer("submitted_by").references(() => users.id).notNull(),
  evidenceType: text("evidence_type").notNull(), // trustverify_logs, vendor_logs, buyer_evidence, unified_packet
  evidenceData: jsonb("evidence_data").notNull(), // The actual evidence content
  source: text("source"), // trustverify, vendor, buyer, ai_generated
  validated: boolean("validated").default(false),
  validatedAt: timestamp("validated_at"),
  validatedBy: integer("validated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
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

// Workflow Configurations table - for industry-specific customizations
export const workflowConfigurations = pgTable("workflow_configurations", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").references(() => developerAccounts.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  industry: text("industry").notNull(), // ecommerce, fintech, marketplace, crypto, healthcare, real_estate, gaming
  useCase: text("use_case").notNull(), // checkout, kyc, escrow, dispute_resolution, etc.
  workflowSteps: jsonb("workflow_steps").notNull(), // Array of workflow step configurations
  rules: jsonb("rules").default('{}'), // Custom business rules and thresholds
  triggers: jsonb("triggers").default('[]'), // Webhook triggers and events
  isActive: boolean("is_active").default(true),
  isTemplate: boolean("is_template").default(false), // System templates vs custom workflows
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Industry Templates table - pre-built workflow templates
export const industryTemplates = pgTable("industry_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  useCase: text("use_case").notNull(),
  description: text("description"),
  workflowSteps: jsonb("workflow_steps").notNull(),
  defaultRules: jsonb("default_rules").default('{}'),
  recommendedSettings: jsonb("recommended_settings").default('{}'),
  documentation: text("documentation"), // Markdown documentation
  codeExamples: jsonb("code_examples").default('[]'), // Array of code examples
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Webhook Configurations table
export const webhookConfigurations = pgTable("webhook_configurations", {
  id: serial("id").primaryKey(),
  developerId: integer("developer_id").references(() => developerAccounts.id).notNull(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  secret: text("secret").notNull(), // Webhook signing secret
  events: jsonb("events").default('[]'), // Array of event types to subscribe to
  isActive: boolean("is_active").default(true),
  retryPolicy: jsonb("retry_policy").default('{"maxRetries": 3, "backoff": "exponential"}'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Webhook Delivery Logs table
export const webhookDeliveries = pgTable("webhook_deliveries", {
  id: serial("id").primaryKey(),
  webhookId: integer("webhook_id").references(() => webhookConfigurations.id).notNull(),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").default("pending"), // pending, delivered, failed, retrying
  statusCode: integer("status_code"),
  responseBody: text("response_body"),
  attemptNumber: integer("attempt_number").default(1),
  deliveredAt: timestamp("delivered_at"),
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
  workflowConfigurations: many(workflowConfigurations),
  webhookConfigurations: many(webhookConfigurations),
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

export const workflowConfigurationsRelations = relations(workflowConfigurations, ({ one }) => ({
  developer: one(developerAccounts, {
    fields: [workflowConfigurations.developerId],
    references: [developerAccounts.id],
  }),
}));

export const webhookConfigurationsRelations = relations(webhookConfigurations, ({ one, many }) => ({
  developer: one(developerAccounts, {
    fields: [webhookConfigurations.developerId],
    references: [developerAccounts.id],
  }),
  deliveries: many(webhookDeliveries),
}));

export const webhookDeliveriesRelations = relations(webhookDeliveries, ({ one }) => ({
  webhook: one(webhookConfigurations, {
    fields: [webhookDeliveries.webhookId],
    references: [webhookConfigurations.id],
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
    .nullable()
    .optional(),
}).partial({ username: true }).refine((data) => {
  // Either password auth (local) or OAuth
  if (data.authProvider === 'local') {
    return data.password && data.username;
  }
  // For OAuth, password should be null or undefined
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

// Workflow Configuration types
export type WorkflowConfiguration = typeof workflowConfigurations.$inferSelect;
export type InsertWorkflowConfiguration = typeof workflowConfigurations.$inferInsert;
export type IndustryTemplate = typeof industryTemplates.$inferSelect;
export type InsertIndustryTemplate = typeof industryTemplates.$inferInsert;
export type WebhookConfiguration = typeof webhookConfigurations.$inferSelect;
export type InsertWebhookConfiguration = typeof webhookConfigurations.$inferInsert;
export type WebhookDelivery = typeof webhookDeliveries.$inferSelect;
export type InsertWebhookDelivery = typeof webhookDeliveries.$inferInsert;

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

// Subscription Plans table
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Free, Basic, Pro, Enterprise
  displayName: text("display_name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Monthly price
  currency: text("currency").default("USD"),
  interval: text("interval").notNull(), // month, year
  stripePriceId: text("stripe_price_id").unique(), // Stripe Price ID
  stripeProductId: text("stripe_product_id"), // Stripe Product ID
  features: jsonb("features").default("[]"), // Array of feature strings
  limits: jsonb("limits").default("{}"), // Usage limits (e.g., { apiCalls: 10000, workflows: 5 })
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Subscriptions table
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: text("status").notNull().default("active"), // active, canceled, past_due, unpaid, trialing
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeCustomerId: text("stripe_customer_id"), // Stripe Customer ID
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  quantity: integer("quantity").default(1), // For multi-seat subscriptions
  metadata: jsonb("metadata").default("{}"), // Additional metadata
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription Invoices table
export const subscriptionInvoices = pgTable("subscription_invoices", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => userSubscriptions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  stripeInvoiceId: text("stripe_invoice_id").unique(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("USD"),
  status: text("status").notNull().default("draft"), // draft, open, paid, void, uncollectible
  hostedInvoiceUrl: text("hosted_invoice_url"),
  invoicePdf: text("invoice_pdf"),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription Usage Tracking table
// File Storage table for KYC/KYB documents
export const fileStorage = pgTable("file_storage", {
  id: serial("id").primaryKey(),
  fileId: text("file_id").notNull().unique(), // Unique file identifier
  userId: integer("user_id").references(() => users.id).notNull(),
  fileName: text("file_name").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(), // Size in bytes
  storageProvider: text("storage_provider").notNull(), // 's3', 'azure', 'local'
  storageKey: text("storage_key").notNull(), // S3 key, Azure blob name, or local path
  fileType: text("file_type").notNull(), // 'kyc', 'kyb', 'document'
  checksum: text("checksum"), // SHA-256 hash for integrity verification
  encrypted: boolean("encrypted").default(false),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // For temporary files
  deletedAt: timestamp("deleted_at"), // Soft delete
});

export const subscriptionUsage = pgTable("subscription_usage", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").references(() => userSubscriptions.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  metric: text("metric").notNull(), // api_calls, workflows, webhooks, etc.
  quantity: integer("quantity").default(0),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscription schemas
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).pick({
  name: true,
  displayName: true,
  description: true,
  price: true,
  currency: true,
  interval: true,
  stripePriceId: true,
  stripeProductId: true,
  features: true,
  limits: true,
  isActive: true,
  isPublic: true,
  sortOrder: true,
});

// Types
export type SecurityIncident = typeof securityIncidents.$inferSelect;
export type IPBlacklist = typeof ipBlacklist.$inferSelect;
export type InsuranceCoverage = typeof insuranceCoverage.$inferSelect;
export type InsuranceClaim = typeof insuranceClaims.$inferSelect;
export type DisputeEvidence = typeof disputeEvidence.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type SubscriptionInvoice = typeof subscriptionInvoices.$inferSelect;
export type SubscriptionUsage = typeof subscriptionUsage.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

// CRM Tables
export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(), // Owner/creator
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  postalCode: text("postal_code"),
  website: text("website"),
  status: text("status").default("active"), // active, inactive, archived
  source: text("source"), // website, referral, social_media, etc.
  tags: jsonb("tags").default("[]"), // Array of tag strings
  notes: text("notes"),
  customFields: jsonb("custom_fields").default("{}"), // Flexible custom data
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmLeads = pgTable("crm_leads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contactId: integer("contact_id").references(() => crmContacts.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  source: text("source").notNull(), // website, referral, social_media, etc.
  status: text("status").default("new"), // new, contacted, qualified, converted, lost
  score: integer("score").default(0), // Lead score 0-100
  estimatedValue: decimal("estimated_value", { precision: 12, scale: 2 }),
  currency: text("currency").default("GBP"),
  notes: text("notes"),
  assignedTo: integer("assigned_to").references(() => users.id),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmOpportunities = pgTable("crm_opportunities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contactId: integer("contact_id").references(() => crmContacts.id),
  leadId: integer("lead_id").references(() => crmLeads.id),
  name: text("name").notNull(),
  description: text("description"),
  stage: text("stage").default("prospecting"), // prospecting, qualification, proposal, negotiation, closed_won, closed_lost
  probability: integer("probability").default(0), // 0-100 percentage
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").default("GBP"),
  expectedCloseDate: timestamp("expected_close_date"),
  actualCloseDate: timestamp("actual_close_date"),
  assignedTo: integer("assigned_to").references(() => users.id),
  notes: text("notes"),
  tags: jsonb("tags").default("[]"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const crmInteractions = pgTable("crm_interactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contactId: integer("contact_id").references(() => crmContacts.id),
  leadId: integer("lead_id").references(() => crmLeads.id),
  opportunityId: integer("opportunity_id").references(() => crmOpportunities.id),
  type: text("type").notNull(), // call, email, meeting, note, task, event
  subject: text("subject"),
  description: text("description").notNull(),
  direction: text("direction").default("outbound"), // inbound, outbound
  duration: integer("duration"), // in minutes for calls/meetings
  outcome: text("outcome"), // success, no_answer, voicemail, follow_up_needed, etc.
  nextAction: text("next_action"),
  nextActionDate: timestamp("next_action_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// HR Tables
export const hrEmployees = pgTable("hr_employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique(), // Link to user account if exists
  employeeId: text("employee_id").notNull().unique(), // Company employee ID
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  postalCode: text("postal_code"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),
  department: text("department"),
  position: text("position").notNull(),
  jobTitle: text("job_title").notNull(),
  employmentType: text("employment_type").default("full_time"), // full_time, part_time, contract, intern
  status: text("status").default("active"), // active, on_leave, terminated, suspended
  hireDate: timestamp("hire_date").notNull(),
  terminationDate: timestamp("termination_date"),
  salary: decimal("salary", { precision: 12, scale: 2 }),
  currency: text("currency").default("GBP"),
  managerId: integer("manager_id").references((): any => hrEmployees.id), // Self-referencing for manager
  workLocation: text("work_location"), // office, remote, hybrid
  notes: text("notes"),
  customFields: jsonb("custom_fields").default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hrAttendance = pgTable("hr_attendance", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => hrEmployees.id).notNull(),
  date: timestamp("date").notNull(),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  breakDuration: integer("break_duration").default(0), // in minutes
  totalHours: decimal("total_hours", { precision: 5, scale: 2 }),
  status: text("status").default("present"), // present, absent, late, half_day, leave
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hrLeaveRequests = pgTable("hr_leave_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => hrEmployees.id).notNull(),
  leaveType: text("leave_type").notNull(), // annual, sick, personal, maternity, paternity, unpaid
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason"),
  status: text("status").default("pending"), // pending, approved, rejected, cancelled
  approvedBy: integer("approved_by").references(() => hrEmployees.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hrPerformanceReviews = pgTable("hr_performance_reviews", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => hrEmployees.id).notNull(),
  reviewPeriod: text("review_period").notNull(), // Q1_2024, H1_2024, Annual_2024
  reviewDate: timestamp("review_date").notNull(),
  reviewedBy: integer("reviewed_by").references(() => hrEmployees.id).notNull(),
  overallRating: integer("overall_rating"), // 1-5 scale
  goals: jsonb("goals").default("[]"), // Array of goal objects
  achievements: text("achievements"),
  areasForImprovement: text("areas_for_improvement"),
  feedback: text("feedback"),
  nextReviewDate: timestamp("next_review_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hrRecruitment = pgTable("hr_recruitment", {
  id: serial("id").primaryKey(),
  position: text("position").notNull(),
  department: text("department"),
  jobDescription: text("job_description"),
  requirements: jsonb("requirements").default("[]"),
  status: text("status").default("open"), // open, interviewing, offer_pending, filled, cancelled
  postedDate: timestamp("posted_date").defaultNow(),
  closingDate: timestamp("closing_date"),
  salaryRange: text("salary_range"),
  employmentType: text("employment_type").default("full_time"),
  location: text("location"),
  recruiterId: integer("recruiter_id").references(() => hrEmployees.id),
  numberOfPositions: integer("number_of_positions").default(1),
  filledPositions: integer("filled_positions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const hrJobApplications = pgTable("hr_job_applications", {
  id: serial("id").primaryKey(),
  recruitmentId: integer("recruitment_id").references(() => hrRecruitment.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  resumeUrl: text("resume_url"),
  coverLetter: text("cover_letter"),
  status: text("status").default("applied"), // applied, screening, interview, offer, rejected, withdrawn
  stage: text("stage"), // phone_screen, technical_interview, final_interview, etc.
  interviewDate: timestamp("interview_date"),
  interviewNotes: text("interview_notes"),
  rating: integer("rating"), // 1-5 scale
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// CRM Relations
export const crmContactsRelations = relations(crmContacts, ({ one, many }) => ({
  owner: one(users, {
    fields: [crmContacts.userId],
    references: [users.id],
  }),
  leads: many(crmLeads),
  opportunities: many(crmOpportunities),
  interactions: many(crmInteractions),
}));

export const crmLeadsRelations = relations(crmLeads, ({ one, many }) => ({
  owner: one(users, {
    fields: [crmLeads.userId],
    references: [users.id],
  }),
  contact: one(crmContacts, {
    fields: [crmLeads.contactId],
    references: [crmContacts.id],
  }),
  assignedUser: one(users, {
    fields: [crmLeads.assignedTo],
    references: [users.id],
  }),
  opportunities: many(crmOpportunities),
  interactions: many(crmInteractions),
}));

export const crmOpportunitiesRelations = relations(crmOpportunities, ({ one, many }) => ({
  owner: one(users, {
    fields: [crmOpportunities.userId],
    references: [users.id],
  }),
  contact: one(crmContacts, {
    fields: [crmOpportunities.contactId],
    references: [crmContacts.id],
  }),
  lead: one(crmLeads, {
    fields: [crmOpportunities.leadId],
    references: [crmLeads.id],
  }),
  assignedUser: one(users, {
    fields: [crmOpportunities.assignedTo],
    references: [users.id],
  }),
  interactions: many(crmInteractions),
}));

export const crmInteractionsRelations = relations(crmInteractions, ({ one }) => ({
  owner: one(users, {
    fields: [crmInteractions.userId],
    references: [users.id],
  }),
  contact: one(crmContacts, {
    fields: [crmInteractions.contactId],
    references: [crmContacts.id],
  }),
  lead: one(crmLeads, {
    fields: [crmInteractions.leadId],
    references: [crmLeads.id],
  }),
  opportunity: one(crmOpportunities, {
    fields: [crmInteractions.opportunityId],
    references: [crmOpportunities.id],
  }),
}));

// HR Relations
export const hrEmployeesRelations = relations(hrEmployees, ({ one, many }) => ({
  user: one(users, {
    fields: [hrEmployees.userId],
    references: [users.id],
  }),
  manager: one(hrEmployees, {
    fields: [hrEmployees.managerId],
    references: [hrEmployees.id],
  }),
  directReports: many(hrEmployees),
  attendance: many(hrAttendance),
  leaveRequests: many(hrLeaveRequests),
  performanceReviews: many(hrPerformanceReviews),
}));

export const hrAttendanceRelations = relations(hrAttendance, ({ one }) => ({
  employee: one(hrEmployees, {
    fields: [hrAttendance.employeeId],
    references: [hrEmployees.id],
  }),
}));

export const hrLeaveRequestsRelations = relations(hrLeaveRequests, ({ one }) => ({
  employee: one(hrEmployees, {
    fields: [hrLeaveRequests.employeeId],
    references: [hrEmployees.id],
  }),
  approver: one(hrEmployees, {
    fields: [hrLeaveRequests.approvedBy],
    references: [hrEmployees.id],
  }),
}));

export const hrPerformanceReviewsRelations = relations(hrPerformanceReviews, ({ one }) => ({
  employee: one(hrEmployees, {
    fields: [hrPerformanceReviews.employeeId],
    references: [hrEmployees.id],
  }),
  reviewer: one(hrEmployees, {
    fields: [hrPerformanceReviews.reviewedBy],
    references: [hrEmployees.id],
  }),
}));

export const hrRecruitmentRelations = relations(hrRecruitment, ({ one, many }) => ({
  recruiter: one(hrEmployees, {
    fields: [hrRecruitment.recruiterId],
    references: [hrEmployees.id],
  }),
  applications: many(hrJobApplications),
}));

export const hrJobApplicationsRelations = relations(hrJobApplications, ({ one }) => ({
  recruitment: one(hrRecruitment, {
    fields: [hrJobApplications.recruitmentId],
    references: [hrRecruitment.id],
  }),
}));

// CRM Insert Schemas
export const insertCrmContactSchema = createInsertSchema(crmContacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  jobTitle: true,
  address: true,
  city: true,
  country: true,
  postalCode: true,
  website: true,
  status: true,
  source: true,
  tags: true,
  notes: true,
  customFields: true,
});

export const insertCrmLeadSchema = createInsertSchema(crmLeads).pick({
  contactId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  jobTitle: true,
  source: true,
  status: true,
  score: true,
  estimatedValue: true,
  currency: true,
  notes: true,
  assignedTo: true,
});

export const insertCrmOpportunitySchema = createInsertSchema(crmOpportunities).pick({
  contactId: true,
  leadId: true,
  name: true,
  description: true,
  stage: true,
  probability: true,
  value: true,
  currency: true,
  expectedCloseDate: true,
  assignedTo: true,
  notes: true,
  tags: true,
});

export const insertCrmInteractionSchema = createInsertSchema(crmInteractions).pick({
  contactId: true,
  leadId: true,
  opportunityId: true,
  type: true,
  subject: true,
  description: true,
  direction: true,
  duration: true,
  outcome: true,
  nextAction: true,
  nextActionDate: true,
});

// HR Insert Schemas
export const insertHrEmployeeSchema = createInsertSchema(hrEmployees).pick({
  userId: true,
  employeeId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  dateOfBirth: true,
  address: true,
  city: true,
  country: true,
  postalCode: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  emergencyContactRelation: true,
  department: true,
  position: true,
  jobTitle: true,
  employmentType: true,
  status: true,
  hireDate: true,
  salary: true,
  currency: true,
  managerId: true,
  workLocation: true,
  notes: true,
  customFields: true,
});

export const insertHrAttendanceSchema = createInsertSchema(hrAttendance).pick({
  employeeId: true,
  date: true,
  checkIn: true,
  checkOut: true,
  breakDuration: true,
  status: true,
  notes: true,
});

export const insertHrLeaveRequestSchema = createInsertSchema(hrLeaveRequests).pick({
  employeeId: true,
  leaveType: true,
  startDate: true,
  endDate: true,
  reason: true,
});

export const insertHrPerformanceReviewSchema = createInsertSchema(hrPerformanceReviews).pick({
  employeeId: true,
  reviewPeriod: true,
  reviewDate: true,
  reviewedBy: true,
  overallRating: true,
  goals: true,
  achievements: true,
  areasForImprovement: true,
  feedback: true,
  nextReviewDate: true,
});

export const insertHrRecruitmentSchema = createInsertSchema(hrRecruitment).pick({
  position: true,
  department: true,
  jobDescription: true,
  requirements: true,
  status: true,
  closingDate: true,
  salaryRange: true,
  employmentType: true,
  location: true,
  recruiterId: true,
  numberOfPositions: true,
});

export const insertHrJobApplicationSchema = createInsertSchema(hrJobApplications).pick({
  recruitmentId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  resumeUrl: true,
  coverLetter: true,
  status: true,
  stage: true,
  interviewDate: true,
  interviewNotes: true,
  rating: true,
  notes: true,
});

// CRM Types
export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type CrmLead = typeof crmLeads.$inferSelect;
export type InsertCrmLead = z.infer<typeof insertCrmLeadSchema>;
export type CrmOpportunity = typeof crmOpportunities.$inferSelect;
export type InsertCrmOpportunity = z.infer<typeof insertCrmOpportunitySchema>;
export type CrmInteraction = typeof crmInteractions.$inferSelect;
export type InsertCrmInteraction = z.infer<typeof insertCrmInteractionSchema>;

// HR Types
export type HrEmployee = typeof hrEmployees.$inferSelect;
export type InsertHrEmployee = z.infer<typeof insertHrEmployeeSchema>;
export type HrAttendance = typeof hrAttendance.$inferSelect;
export type InsertHrAttendance = z.infer<typeof insertHrAttendanceSchema>;
export type HrLeaveRequest = typeof hrLeaveRequests.$inferSelect;
export type InsertHrLeaveRequest = z.infer<typeof insertHrLeaveRequestSchema>;
export type HrPerformanceReview = typeof hrPerformanceReviews.$inferSelect;
export type InsertHrPerformanceReview = z.infer<typeof insertHrPerformanceReviewSchema>;
export type HrRecruitment = typeof hrRecruitment.$inferSelect;
export type InsertHrRecruitment = z.infer<typeof insertHrRecruitmentSchema>;
export type HrJobApplication = typeof hrJobApplications.$inferSelect;
export type InsertHrJobApplication = z.infer<typeof insertHrJobApplicationSchema>;

