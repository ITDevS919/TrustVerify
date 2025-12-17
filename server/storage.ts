import { 
    users, 
    kycVerifications, 
    transactions, 
    messages, 
    scamReports, 
    disputes,
    developerAccounts,
    apiKeys,
    apiUsageLogs,
    passwordResets,
    workflowConfigurations,
    industryTemplates,
    webhookConfigurations,
    webhookDeliveries,
    subscriptionPlans,
    userSubscriptions,
    subscriptionInvoices,
    subscriptionUsage,
    crmContacts,
    crmLeads,
    crmOpportunities,
    crmInteractions,
    hrEmployees,
    hrAttendance,
    hrLeaveRequests,
    hrPerformanceReviews,
    hrRecruitment,
    hrJobApplications,
    type User, 
    type InsertUser,
    type KycVerification,
    type InsertKyc,
    type Transaction,
    type InsertTransaction,
    type Message,
    type InsertMessage,
    type ScamReport,
    type InsertScamReport,
    type Dispute,
    type InsertDispute,
    type DeveloperAccount,
    type InsertDeveloperAccount,
    type ApiKey,
    type ApiUsageLog,
    type InsertApiUsageLog,
    type PasswordReset,
    type SubscriptionPlan,
    type UserSubscription,
    type SubscriptionInvoice,
    type SubscriptionUsage,
    type InsertSubscriptionPlan,
    type CrmContact,
    type InsertCrmContact,
    type CrmLead,
    type InsertCrmLead,
    type CrmOpportunity,
    type InsertCrmOpportunity,
    type CrmInteraction,
    type InsertCrmInteraction,
    type HrEmployee,
    type InsertHrEmployee,
    type HrAttendance,
    type InsertHrAttendance,
    type HrLeaveRequest,
    type InsertHrLeaveRequest,
    type HrPerformanceReview,
    type InsertHrPerformanceReview,
    type HrRecruitment,
    type InsertHrRecruitment,
    type HrJobApplication,
    type InsertHrJobApplication
  } from "./shared/schema";
  import { db } from "./db.ts";
  import { eq, and, or, ilike, gte, lte, desc, count, avg, sql } from "drizzle-orm";
  import session from "express-session";
  import createMemoryStore from "memorystore";
  
  const MemoryStore = createMemoryStore(session);
  
  export interface IStorage {
    // User methods
    getUser(id: number): Promise<User | undefined>;
    getUserByUsername(username: string): Promise<User | undefined>;
    getUserByEmail(email: string): Promise<User | undefined>;
    createUser(user: InsertUser): Promise<User>;
    updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
    updateUserTrustScore(id: number, score: string): Promise<User | undefined>;
    updateUserVerificationLevel(id: number, level: string): Promise<User | undefined>;
    updateUserPassword(id: number, hashedPassword: string): Promise<User | undefined>;
  
    // Password reset methods
    createPasswordReset(userId: number, token: string, expiresAt: Date): Promise<PasswordReset>;
    getPasswordReset(token: string): Promise<PasswordReset | undefined>;
    deletePasswordReset(token: string): Promise<void>;
  
    // KYC methods
    createKycVerification(kyc: InsertKyc & { userId: number }): Promise<KycVerification>;
    getKycByUserId(userId: number): Promise<KycVerification | undefined>;
    getPendingKycVerifications(): Promise<KycVerification[]>;
    updateKycStatus(id: number, status: string, reviewedBy: number, notes?: string): Promise<KycVerification | undefined>;
  
    // Transaction methods
    createTransaction(transaction: InsertTransaction & { buyerId: number }): Promise<Transaction>;
    getTransaction(id: number): Promise<Transaction | undefined>;
    getTransactionsByUser(userId: number, limit?: number, offset?: number): Promise<Transaction[]>;
    getTransactionCountByUser(userId: number): Promise<number>;
    updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
    updateTransactionStripeId(id: number, stripePaymentIntentId: string): Promise<Transaction | undefined>;
  
    // Message methods
    createMessage(message: InsertMessage & { senderId: number }): Promise<Message>;
    getMessagesByTransaction(transactionId: number): Promise<Message[]>;
    flagMessageAsScam(id: number): Promise<Message | undefined>;
  
    // Scam report methods
    createScamReport(report: InsertScamReport & { reporterId: number }): Promise<ScamReport>;
    getScamReports(): Promise<ScamReport[]>;
    getFraudReports(limit?: number): Promise<ScamReport[]>; // Alias for getScamReports
    searchScamReports(query: string): Promise<ScamReport[]>;
    updateScamReportStatus(id: number, status: string, reviewedBy: number): Promise<ScamReport | undefined>;
  
    // Dispute methods
    createDispute(dispute: InsertDispute & { raisedBy: number }): Promise<Dispute>;
    getDisputesByTransaction(transactionId: number): Promise<Dispute[]>;
    getPendingDisputes(): Promise<Dispute[]>;
    updateDisputeStatus(id: number, status: string, resolution?: string, resolvedBy?: number): Promise<Dispute | undefined>;
  
    // Developer Account methods
    createDeveloperAccount(account: InsertDeveloperAccount & { userId: number; status?: string; approvedAt?: Date }): Promise<DeveloperAccount>;
    getDeveloperAccountByUserId(userId: number): Promise<DeveloperAccount | undefined>;
    getDeveloperAccount(id: number): Promise<DeveloperAccount | undefined>;
    updateDeveloperAccountStatus(id: number, status: string, approvedBy?: number): Promise<DeveloperAccount | undefined>;
    updateDeveloperUsage(id: number, usage: number): Promise<DeveloperAccount | undefined>;
  
    // API Key methods
    createApiKey(apiKey: { developerId: number; name: string; keyHash: string; keyPrefix: string; permissions?: string[]; expiresAt?: Date }): Promise<ApiKey>;
    getApiKeysByDeveloperId(developerId: number): Promise<ApiKey[]>;
    getApiKeyByHash(keyHash: string): Promise<ApiKey | undefined>;
    revokeApiKey(id: number): Promise<ApiKey | undefined>;
    updateApiKeyLastUsed(id: number): Promise<ApiKey | undefined>;
  
    // API Usage Log methods
    createApiUsageLog(log: InsertApiUsageLog & { apiKeyId: number; developerId: number }): Promise<ApiUsageLog>;
    getApiUsageByDeveloper(developerId: number, startDate?: Date, endDate?: Date): Promise<ApiUsageLog[]>;
    getApiUsageStats(developerId: number, period: 'day' | 'week' | 'month'): Promise<any>;
  
    // Workflow Configuration methods
    createWorkflowConfiguration(config: { developerId: number; name: string; description?: string; industry: string; useCase: string; workflowSteps: any; rules?: any; triggers?: any; isActive?: boolean; isTemplate?: boolean; version?: number }): Promise<any>;
    getWorkflowConfiguration(id: number): Promise<any | undefined>;
    listWorkflowConfigurations(developerId: number, filters?: { industry?: string; useCase?: string; isActive?: boolean }): Promise<any[]>;
    updateWorkflowConfiguration(id: number, updates: Partial<any>): Promise<any | undefined>;
    deleteWorkflowConfiguration(id: number): Promise<void>;
  
    // Industry Template methods
    createIndustryTemplate(template: { name: string; industry: string; useCase: string; description?: string; workflowSteps: any; defaultRules?: any; recommendedSettings?: any; documentation?: string; codeExamples?: any; isPublic?: boolean }): Promise<any>;
    getIndustryTemplate(id: number): Promise<any | undefined>;
    listIndustryTemplates(filters?: { industry?: string; useCase?: string }): Promise<any[]>;
    updateIndustryTemplate(id: number, updates: Partial<any>): Promise<any | undefined>;
  
    // Webhook Configuration methods
    createWebhookConfiguration(config: { developerId: number; name: string; url: string; secret: string; events: any; isActive?: boolean; retryPolicy?: any }): Promise<any>;
    getWebhookConfiguration(id: number): Promise<any | undefined>;
    listWebhookConfigurations(developerId: number): Promise<any[]>;
    updateWebhookConfiguration(id: number, updates: Partial<any>): Promise<any | undefined>;
    deleteWebhookConfiguration(id: number): Promise<void>;
  
    // Webhook Delivery methods
    createWebhookDelivery(delivery: { webhookId: number; eventType: string; payload: any; status?: string; statusCode?: number; responseBody?: string; attemptNumber?: number }): Promise<any>;
    listWebhookDeliveries(webhookId: number, limit?: number): Promise<any[]>;

    // Subscription Plan methods
    createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
    getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
    getSubscriptionPlanByStripePriceId(stripePriceId: string): Promise<SubscriptionPlan | undefined>;
    listSubscriptionPlans(filters?: { isActive?: boolean; isPublic?: boolean }): Promise<SubscriptionPlan[]>;

    // User Subscription methods
    createUserSubscription(subscription: { userId: number; planId: number; status: string; stripeSubscriptionId?: string; stripeCustomerId?: string; currentPeriodStart: Date; currentPeriodEnd: Date; trialStart?: Date; trialEnd?: Date; quantity?: number; metadata?: any }): Promise<UserSubscription>;
    getUserSubscription(id: number): Promise<UserSubscription | undefined>;
    getUserSubscriptionByUserId(userId: number): Promise<UserSubscription | undefined>;
    getUserSubscriptionByStripeId(stripeSubscriptionId: string): Promise<UserSubscription | undefined>;
    updateUserSubscription(id: number, updates: Partial<UserSubscription>): Promise<UserSubscription | undefined>;
    cancelUserSubscription(id: number, canceledAt: Date): Promise<UserSubscription | undefined>;

    // Subscription Invoice methods
    createSubscriptionInvoice(invoice: { subscriptionId: number; userId: number; stripeInvoiceId?: string; amount: string; currency?: string; status?: string; hostedInvoiceUrl?: string; invoicePdf?: string; periodStart?: Date; periodEnd?: Date; paidAt?: Date }): Promise<SubscriptionInvoice>;
    getSubscriptionInvoice(id: number): Promise<SubscriptionInvoice | undefined>;
    getSubscriptionInvoiceByStripeId(stripeInvoiceId: string): Promise<SubscriptionInvoice | undefined>;
    listSubscriptionInvoices(userId: number, limit?: number): Promise<SubscriptionInvoice[]>;
    updateSubscriptionInvoice(id: number, updates: Partial<SubscriptionInvoice>): Promise<SubscriptionInvoice | undefined>;

    // Subscription Usage methods
    createSubscriptionUsage(usage: { subscriptionId: number; userId: number; metric: string; quantity: number; periodStart: Date; periodEnd: Date }): Promise<SubscriptionUsage>;
    getSubscriptionUsage(subscriptionId: number, metric: string, periodStart: Date, periodEnd: Date): Promise<SubscriptionUsage | undefined>;
    incrementSubscriptionUsage(subscriptionId: number, metric: string, quantity: number, periodStart: Date, periodEnd: Date): Promise<SubscriptionUsage>;
    listSubscriptionUsage(subscriptionId: number, periodStart?: Date, periodEnd?: Date): Promise<SubscriptionUsage[]>;

    // Admin stats methods
    getUserCount(): Promise<number>;
    getActiveTransactionCount(): Promise<number>;
    getPendingKycCount(): Promise<number>;

    // CRM methods
    getCrmContacts(userId: number, page: number, limit: number): Promise<{ contacts: CrmContact[]; total: number; page: number; limit: number }>;
    createCrmContact(contact: InsertCrmContact & { userId: number }): Promise<CrmContact>;
    getCrmContact(id: number, userId: number): Promise<CrmContact | undefined>;
    updateCrmContact(id: number, userId: number, updates: Partial<CrmContact>): Promise<CrmContact | undefined>;
    deleteCrmContact(id: number, userId: number): Promise<void>;
    getCrmLeads(userId: number, page: number, limit: number): Promise<{ leads: CrmLead[]; total: number; page: number; limit: number }>;
    createCrmLead(lead: InsertCrmLead & { userId: number }): Promise<CrmLead>;
    updateCrmLead(id: number, userId: number, updates: Partial<CrmLead>): Promise<CrmLead | undefined>;
    getCrmOpportunities(userId: number, page: number, limit: number): Promise<{ opportunities: CrmOpportunity[]; total: number; page: number; limit: number }>;
    createCrmOpportunity(opportunity: InsertCrmOpportunity & { userId: number }): Promise<CrmOpportunity>;
    updateCrmOpportunity(id: number, userId: number, updates: Partial<CrmOpportunity>): Promise<CrmOpportunity | undefined>;
    getCrmInteractions(userId: number, filters: { contactId?: number; leadId?: number; opportunityId?: number }, page: number, limit: number): Promise<{ interactions: CrmInteraction[]; total: number; page: number; limit: number }>;
    createCrmInteraction(interaction: InsertCrmInteraction & { userId: number }): Promise<CrmInteraction>;
    getCrmAnalytics(userId: number): Promise<any>;

    // HR methods
    getHrEmployees(page: number, limit: number): Promise<{ employees: HrEmployee[]; total: number; page: number; limit: number }>;
    createHrEmployee(employee: InsertHrEmployee): Promise<HrEmployee>;
    getHrEmployee(id: number): Promise<HrEmployee | undefined>;
    updateHrEmployee(id: number, updates: Partial<HrEmployee>): Promise<HrEmployee | undefined>;
    getHrAttendance(employeeId?: number, startDate?: string, endDate?: string): Promise<HrAttendance[]>;
    createHrAttendance(attendance: InsertHrAttendance): Promise<HrAttendance>;
    updateHrAttendance(id: number, updates: Partial<HrAttendance>): Promise<HrAttendance | undefined>;
    getHrLeaveRequests(employeeId?: number, status?: string): Promise<HrLeaveRequest[]>;
    createHrLeaveRequest(leaveRequest: InsertHrLeaveRequest): Promise<HrLeaveRequest>;
    updateHrLeaveRequest(id: number, updates: Partial<HrLeaveRequest>): Promise<HrLeaveRequest | undefined>;
    getHrPerformanceReviews(employeeId?: number): Promise<HrPerformanceReview[]>;
    createHrPerformanceReview(review: InsertHrPerformanceReview): Promise<HrPerformanceReview>;
    getHrRecruitment(status?: string, page?: number, limit?: number): Promise<{ recruitment: HrRecruitment[]; total: number; page: number; limit: number }>;
    createHrRecruitment(recruitment: InsertHrRecruitment): Promise<HrRecruitment>;
    updateHrRecruitment(id: number, updates: Partial<HrRecruitment>): Promise<HrRecruitment | undefined>;
    getHrJobApplications(recruitmentId?: number, status?: string): Promise<HrJobApplication[]>;
    createHrJobApplication(application: InsertHrJobApplication): Promise<HrJobApplication>;
    updateHrJobApplication(id: number, updates: Partial<HrJobApplication>): Promise<HrJobApplication | undefined>;
    getHrAnalytics(): Promise<any>;

    // Session store
    sessionStore: session.Store;
  }
  
  export class MemStorage implements IStorage {
    private users: Map<number, User>;
    private kycVerifications: Map<number, KycVerification>;
    private transactions: Map<number, Transaction>;
    private messages: Map<number, Message>;
    private scamReports: Map<number, ScamReport>;
    private disputes: Map<number, Dispute>;
    private currentId: number;
    public sessionStore: session.Store;
  
    constructor() {
      this.users = new Map();
      this.kycVerifications = new Map();
      this.transactions = new Map();
      this.messages = new Map();
      this.scamReports = new Map();
      this.disputes = new Map();
      this.currentId = 1;
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000,
      });
      
      // Create demo user for UI/UX designer access
      this.createDemoUser();
    }
  
    private async createDemoUser() {
      try {
        // Hash the demo password
        const argon2 = await import('argon2');
        const hashedPassword = await argon2.hash('UIDesigner2025!', {
          type: argon2.argon2id,
          memoryCost: 2 ** 16, // 64 MB
          timeCost: 3,
          parallelism: 1,
        });
  
        // Create demo user account
        const demoUser: User = {
          id: 1,
          username: "ui_designer",
          email: "designer@trustverify.demo",
          password: hashedPassword,
          firstName: "UI/UX",
          lastName: "Designer",
          profileImage: null,
          authProvider: "local",
          googleId: null,
          facebookId: null,
          githubId: null,
          appleId: null,
          isVerified: true,
          trustScore: "95.5",
          verificationLevel: "full",
          isAdmin: false,
          sellerTier: "gold",
          completedTransactions: 10,
          successfulTransactions: 10,
          disputesAgainst: 0,
          validDisputes: 0,
          sanctionLevel: 0,
          sanctionReason: null,
          sanctionedUntil: null,
          fastReleaseEligible: true,
          requiresExtendedBuffer: false,
          mfaEnabled: false,
          mfaSecret: null,
          mfaBackupCodes: null,
          lastMfaUsed: null,
          createdAt: new Date(),
        };
  
        this.users.set(1, demoUser);
        this.currentId = 2; // Start next IDs from 2
  
        // Create sample transactions for demo
        this.createSampleData();
  
        console.log("Demo user created successfully:");
        console.log("Username: ui_designer");
        console.log("Password: UIDesigner2025!");
        console.log("Email: designer@trustverify.demo");
      } catch (error) {
        console.error("Failed to create demo user:", error);
      }
    }
  
    private createSampleData() {
      // Create sample transactions
      const sampleTransactions: Transaction[] = [
        {
          id: 1,
          title: "Website Design Project",
          description: "Custom e-commerce website design with modern UI/UX",
          amount: "2500.00",
          currency: "USD",
          buyerId: 1,
          sellerId: 2,
          status: "completed",
          stripePaymentIntentId: null,
          milestones: null,
          bufferPeriodHours: 72,
          bufferStartTime: null,
          bufferEndTime: null,
          disputeWindowHours: 72,
          disputeDeadline: null,
          riskScore: "10.00",
          fraudFlags: null,
          autoSanctioned: false,
          escalationLevel: 0,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          id: 2,
          title: "Mobile App UI Design",
          description: "iOS and Android app interface design with prototyping",
          amount: "1800.00",
          currency: "USD",
          buyerId: 1,
          sellerId: 3,
          status: "active",
          stripePaymentIntentId: null,
          milestones: null,
          bufferPeriodHours: 72,
          bufferStartTime: null,
          bufferEndTime: null,
          disputeWindowHours: 72,
          disputeDeadline: null,
          riskScore: "15.00",
          fraudFlags: null,
          autoSanctioned: false,
          escalationLevel: 0,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          updatedAt: new Date(),
          completedAt: null,
        },
        {
          id: 3,
          title: "Logo Design Package",
          description: "Complete brand identity including logo variations",
          amount: "750.00",
          currency: "USD",
          buyerId: 1,
          sellerId: 4,
          status: "pending",
          stripePaymentIntentId: null,
          milestones: null,
          bufferPeriodHours: 72,
          bufferStartTime: null,
          bufferEndTime: null,
          disputeWindowHours: 72,
          disputeDeadline: null,
          riskScore: "5.00",
          fraudFlags: null,
          autoSanctioned: false,
          escalationLevel: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
        }
      ];
  
      sampleTransactions.forEach(transaction => {
        this.transactions.set(transaction.id, transaction);
      });
  
      // Update current ID
      this.currentId = Math.max(this.currentId, 5);
    }
  
    // User methods
    async getUser(id: number): Promise<User | undefined> {
      return this.users.get(id);
    }
  
    async getUserByUsername(username: string): Promise<User | undefined> {
      return Array.from(this.users.values()).find(user => user.username === username);
    }
  
    async getUserByEmail(email: string): Promise<User | undefined> {
      return Array.from(this.users.values()).find(user => user.email === email);
    }
  
    async createUser(insertUser: InsertUser): Promise<User> {
      const id = this.currentId++;
      const user: User = {
        ...insertUser,
        id,
        username: insertUser.username || null,
        password: insertUser.password || null,
        firstName: insertUser.firstName || null,
        lastName: insertUser.lastName || null,
        profileImage: insertUser.profileImage || null,
        authProvider: insertUser.authProvider || "local",
        googleId: insertUser.googleId || null,
        facebookId: insertUser.facebookId || null,
        githubId: insertUser.githubId || null,
        appleId: insertUser.appleId || null,
        isVerified: insertUser.isVerified || false,
        trustScore: "0.00",
        verificationLevel: "none",
        isAdmin: false,
        sellerTier: "new",
        completedTransactions: 0,
        successfulTransactions: 0,
        disputesAgainst: 0,
        validDisputes: 0,
        sanctionLevel: 0,
        sanctionReason: null,
        sanctionedUntil: null,
        fastReleaseEligible: false,
        requiresExtendedBuffer: false,
        mfaEnabled: false,
        mfaSecret: null,
        mfaBackupCodes: null,
        lastMfaUsed: null,
        createdAt: new Date(),
      };
      this.users.set(id, user);
      return user;
    }
  
    async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
      const user = this.users.get(id);
      if (user) {
        const updatedUser = { ...user, ...updates };
        this.users.set(id, updatedUser);
        return updatedUser;
      }
      return undefined;
    }
  
    async updateUserPassword(id: number, hashedPassword: string): Promise<User | undefined> {
      const user = this.users.get(id);
      if (user) {
        const updatedUser = { ...user, password: hashedPassword };
        this.users.set(id, updatedUser);
        return updatedUser;
      }
      return undefined;
    }
  
    async createPasswordReset(_userId: number, _token: string, _expiresAt: Date): Promise<PasswordReset> {
      // MemStorage doesn't implement password resets - this is a no-op for in-memory storage
      throw new Error("Password reset not supported in MemStorage");
    }
  
    async getPasswordReset(_token: string): Promise<PasswordReset | undefined> {
      // MemStorage doesn't implement password resets
      return undefined;
    }
  
    async deletePasswordReset(_token: string): Promise<void> {
      // MemStorage doesn't implement password resets
    }
  
    // Developer Account methods
    async createDeveloperAccount(_account: InsertDeveloperAccount & { userId: number; status?: string; approvedAt?: Date }): Promise<DeveloperAccount> {
      throw new Error("Developer accounts not supported in MemStorage");
    }
  
    async getDeveloperAccountByUserId(_userId: number): Promise<DeveloperAccount | undefined> {
      return undefined;
    }
  
    async getDeveloperAccount(_id: number): Promise<DeveloperAccount | undefined> {
      return undefined;
    }
  
    async updateDeveloperAccountStatus(_id: number, _status: string, _approvedBy?: number): Promise<DeveloperAccount | undefined> {
      return undefined;
    }
  
    async updateDeveloperUsage(_id: number, _usage: number): Promise<DeveloperAccount | undefined> {
      return undefined;
    }
  
    // API Key methods
    async createApiKey(_apiKey: { developerId: number; name: string; keyHash: string; keyPrefix: string; permissions?: string[]; expiresAt?: Date }): Promise<ApiKey> {
      throw new Error("API keys not supported in MemStorage");
    }
  
    async getApiKeysByDeveloperId(_developerId: number): Promise<ApiKey[]> {
      return [];
    }
  
    async getApiKeyByHash(_keyHash: string): Promise<ApiKey | undefined> {
      return undefined;
    }
  
    async revokeApiKey(_id: number): Promise<ApiKey | undefined> {
      return undefined;
    }
  
    async updateApiKeyLastUsed(_id: number): Promise<ApiKey | undefined> {
      return undefined;
    }
  
    // API Usage Log methods
    async createApiUsageLog(_log: InsertApiUsageLog & { apiKeyId: number; developerId: number }): Promise<ApiUsageLog> {
      throw new Error("API usage logs not supported in MemStorage");
    }
  
    async getApiUsageByDeveloper(_developerId: number, _startDate?: Date, _endDate?: Date): Promise<ApiUsageLog[]> {
      return [];
    }
  
    async getApiUsageStats(_developerId: number, _period: 'day' | 'week' | 'month'): Promise<any> {
      return {
        totalRequests: 0,
        successfulRequests: 0,
        errorRequests: 0,
        avgResponseTime: 0
      };
    }
  
    async updateUserTrustScore(id: number, score: string): Promise<User | undefined> {
      const user = this.users.get(id);
      if (user) {
        const updatedUser = { ...user, trustScore: score };
        this.users.set(id, updatedUser);
        return updatedUser;
      }
      return undefined;
    }
  
    async updateUserVerificationLevel(id: number, level: string): Promise<User | undefined> {
      const user = this.users.get(id);
      if (user) {
        const updatedUser = { ...user, verificationLevel: level, isVerified: level !== "none" };
        this.users.set(id, updatedUser);
        return updatedUser;
      }
      return undefined;
    }
  
    // KYC methods
    async createKycVerification(kyc: InsertKyc & { userId: number }): Promise<KycVerification> {
      const id = this.currentId++;
      const kycVerification: KycVerification = {
        ...kyc,
        id,
        documentNumber: kyc.documentNumber || null,
        status: "pending",
        notes: null,
        submittedAt: new Date(),
        reviewedAt: null,
        reviewedBy: null,
      };
      this.kycVerifications.set(id, kycVerification);
      return kycVerification;
    }
  
    async getKycByUserId(userId: number): Promise<KycVerification | undefined> {
      return Array.from(this.kycVerifications.values()).find(kyc => kyc.userId === userId);
    }
  
    async getPendingKycVerifications(): Promise<KycVerification[]> {
      return Array.from(this.kycVerifications.values()).filter(kyc => kyc.status === "pending");
    }
  
    async updateKycStatus(id: number, status: string, reviewedBy: number, notes?: string): Promise<KycVerification | undefined> {
      const kyc = this.kycVerifications.get(id);
      if (kyc) {
        const updatedKyc = { 
          ...kyc, 
          status, 
          reviewedBy, 
          notes: notes || null, 
          reviewedAt: new Date() 
        };
        this.kycVerifications.set(id, updatedKyc);
  
        // Update user verification level
        if (status === "approved") {
          await this.updateUserVerificationLevel(kyc.userId, "full");
        }
  
        return updatedKyc;
      }
      return undefined;
    }
  
    // Transaction methods
    async createTransaction(transaction: InsertTransaction & { buyerId: number }): Promise<Transaction> {
      const id = this.currentId++;
      const newTransaction: Transaction = {
        ...transaction,
        id,
        description: transaction.description || null,
        currency: "USD",
        status: "pending",
        stripePaymentIntentId: null,
        milestones: transaction.milestones || null,
        bufferPeriodHours: 72,
        bufferStartTime: null,
        bufferEndTime: null,
        disputeWindowHours: 72,
        disputeDeadline: null,
        riskScore: "0.00",
        fraudFlags: null,
        autoSanctioned: false,
        escalationLevel: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: null,
      };
      this.transactions.set(id, newTransaction);
      return newTransaction;
    }
  
    async getTransaction(id: number): Promise<Transaction | undefined> {
      return this.transactions.get(id);
    }
  
    async getTransactionsByUser(userId: number, limit?: number, offset?: number): Promise<Transaction[]> {
      const userTransactions = Array.from(this.transactions.values()).filter(
        transaction => transaction.buyerId === userId || transaction.sellerId === userId
      );
  
      if (limit && offset !== undefined) {
        return userTransactions.slice(offset, offset + limit);
      }
  
      return userTransactions;
    }
  
    async getTransactionCountByUser(userId: number): Promise<number> {
      return Array.from(this.transactions.values()).filter(
        transaction => transaction.buyerId === userId || transaction.sellerId === userId
      ).length;
    }
  
    async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
      const transaction = this.transactions.get(id);
      if (transaction) {
        const updatedTransaction = { 
          ...transaction, 
          status, 
          updatedAt: new Date(),
          completedAt: status === "completed" ? new Date() : transaction.completedAt
        };
        this.transactions.set(id, updatedTransaction);
  
        // Update trust scores when transaction completes
        if (status === "completed") {
          const buyer = await this.getUser(transaction.buyerId);
          const seller = await this.getUser(transaction.sellerId);
  
          if (buyer && buyer.trustScore) {
            const newScore = (parseFloat(buyer.trustScore) + 1.0).toFixed(2);
            await this.updateUserTrustScore(buyer.id, newScore);
          }
  
          if (seller && seller.trustScore) {
            const newScore = (parseFloat(seller.trustScore) + 1.0).toFixed(2);
            await this.updateUserTrustScore(seller.id, newScore);
          }
        }
  
        return updatedTransaction;
      }
      return undefined;
    }
  
    async updateTransactionStripeId(id: number, stripePaymentIntentId: string): Promise<Transaction | undefined> {
      const transaction = this.transactions.get(id);
      if (transaction) {
        const updatedTransaction = { ...transaction, stripePaymentIntentId, updatedAt: new Date() };
        this.transactions.set(id, updatedTransaction);
        return updatedTransaction;
      }
      return undefined;
    }
  
    // Message methods
    async createMessage(message: InsertMessage & { senderId: number }): Promise<Message> {
      const id = this.currentId++;
      const newMessage: Message = {
        ...message,
        id,
        isSystemMessage: false,
        flaggedAsScam: this.detectScamPatterns(message.content),
        createdAt: new Date(),
      };
      this.messages.set(id, newMessage);
      return newMessage;
    }
  
    async getMessagesByTransaction(transactionId: number): Promise<Message[]> {
      return Array.from(this.messages.values())
        .filter(message => message.transactionId === transactionId)
        .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime());
    }
  
    async flagMessageAsScam(id: number): Promise<Message | undefined> {
      const message = this.messages.get(id);
      if (message) {
        const updatedMessage = { ...message, flaggedAsScam: true };
        this.messages.set(id, updatedMessage);
        return updatedMessage;
      }
      return undefined;
    }
  
    // Scam report methods
    async createScamReport(report: InsertScamReport & { reporterId: number }): Promise<ScamReport> {
      const id = this.currentId++;
      const scamReport: ScamReport = {
        ...report,
        id,
        status: "pending",
        isPublic: true,
        evidence: report.evidence || null,
        createdAt: new Date(),
        reviewedAt: null,
        reviewedBy: null,
      };
      this.scamReports.set(id, scamReport);
      return scamReport;
    }
  
    async getScamReports(): Promise<ScamReport[]> {
      return Array.from(this.scamReports.values())
        .filter(report => report.isPublic)
        .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    }

    async getFraudReports(limit?: number): Promise<ScamReport[]> {
      const reports = Array.from(this.scamReports.values())
        .filter(report => report.isPublic)
        .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
      return limit ? reports.slice(0, limit) : reports;
    }
  
    async searchScamReports(query: string): Promise<ScamReport[]> {
      const lowercaseQuery = query.toLowerCase();
      return Array.from(this.scamReports.values())
        .filter(report => 
          report.isPublic && (
            report.scammerInfo.toLowerCase().includes(lowercaseQuery) ||
            report.description.toLowerCase().includes(lowercaseQuery) ||
            report.scamType.toLowerCase().includes(lowercaseQuery)
          )
        )
        .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    }
  
    async updateScamReportStatus(id: number, status: string, reviewedBy: number): Promise<ScamReport | undefined> {
      const report = this.scamReports.get(id);
      if (report) {
        const updatedReport = { 
          ...report, 
          status, 
          reviewedBy, 
          reviewedAt: new Date() 
        };
        this.scamReports.set(id, updatedReport);
        return updatedReport;
      }
      return undefined;
    }
  
    // Dispute methods
    async createDispute(dispute: InsertDispute & { raisedBy: number }): Promise<Dispute> {
      const id = this.currentId++;
      const disputeData: any = dispute;
      const newDispute: Dispute = {
        ...dispute,
        id,
        status: "open",
        disputeType: disputeData.disputeType || "other",
        resolution: null,
        resolvedBy: null,
        aiConfidenceScore: disputeData.aiConfidenceScore || null,
        fraudIndicators: disputeData.fraudIndicators || null,
        priorityLevel: disputeData.priorityLevel || "medium",
        autoFlagged: false,
        escalatedToHuman: false,
        queuePosition: null,
        assignedAgent: disputeData.assignedAgent || null,
        slaDeadline: disputeData.slaDeadline || null,
        evidenceSubmitted: disputeData.evidenceSubmitted || null,
        workflowStage: "created",
        workflowStartedAt: null,
        workflowDeadline: null,
        evidenceCollectionDeadline: null,
        aiAnalysisDeadline: null,
        escrowFrozen: false,
        escrowFrozenAt: null,
        createdAt: new Date(),
        resolvedAt: null,
      };
      this.disputes.set(id, newDispute);
      return newDispute;
    }
  
    async getDisputesByTransaction(transactionId: number): Promise<Dispute[]> {
      return Array.from(this.disputes.values()).filter(
        dispute => dispute.transactionId === transactionId
      );
    }
  
    async getPendingDisputes(): Promise<Dispute[]> {
      return Array.from(this.disputes.values()).filter(
        dispute => dispute.status === "open" || dispute.status === "investigating"
      );
    }
  
    async updateDisputeStatus(id: number, status: string, resolution?: string, resolvedBy?: number): Promise<Dispute | undefined> {
      const dispute = this.disputes.get(id);
      if (dispute) {
        const updatedDispute = { 
          ...dispute, 
          status, 
          resolution: resolution || null,
          resolvedBy: resolvedBy || null,
          resolvedAt: (status === "resolved" || status === "closed") ? new Date() : null
        };
        this.disputes.set(id, updatedDispute);
        return updatedDispute;
      }
      return undefined;
    }
  
    // Simple fraud detection helper
    private detectScamPatterns(content: string): boolean {
      const scamKeywords = [
        'send money first', 'wire transfer', 'western union', 'moneygram',
        'bitcoin payment', 'gift card', 'urgent payment', 'need money now',
        'inheritance', 'lottery winner', 'security code', 'verify account'
      ];

      const lowerContent = content.toLowerCase();
      return scamKeywords.some(keyword => lowerContent.includes(keyword));
    }

    // Admin stats methods
    async getUserCount(): Promise<number> {
      return this.users.size;
    }

    async getActiveTransactionCount(): Promise<number> {
      return Array.from(this.transactions.values()).filter(
        t => t.status === 'pending' || t.status === 'in_progress' || t.status === 'escrow_held'
      ).length;
    }

    async getPendingKycCount(): Promise<number> {
      return Array.from(this.kycVerifications.values()).filter(
        kyc => kyc.status === 'pending'
      ).length;
    }

    // Workflow Configuration methods
    async createWorkflowConfiguration(_config: { developerId: number; name: string; description?: string; industry: string; useCase: string; workflowSteps: any; rules?: any; triggers?: any; isActive?: boolean; isTemplate?: boolean; version?: number }): Promise<any> {
      throw new Error("Workflow configurations not supported in MemStorage");
    }

    async getWorkflowConfiguration(_id: number): Promise<any | undefined> {
      return undefined;
    }

    async listWorkflowConfigurations(_developerId: number, _filters?: { industry?: string; useCase?: string; isActive?: boolean }): Promise<any[]> {
      return [];
    }

    async updateWorkflowConfiguration(_id: number, _updates: Partial<any>): Promise<any | undefined> {
      return undefined;
    }

    async deleteWorkflowConfiguration(_id: number): Promise<void> {
      // No-op
    }

    // Industry Template methods
    async createIndustryTemplate(_template: { name: string; industry: string; useCase: string; description?: string; workflowSteps: any; defaultRules?: any; recommendedSettings?: any; documentation?: string; codeExamples?: any; isPublic?: boolean }): Promise<any> {
      throw new Error("Industry templates not supported in MemStorage");
    }

    async getIndustryTemplate(_id: number): Promise<any | undefined> {
      return undefined;
    }

    async listIndustryTemplates(_filters?: { industry?: string; useCase?: string }): Promise<any[]> {
      return [];
    }

    async updateIndustryTemplate(_id: number, _updates: Partial<any>): Promise<any | undefined> {
      return undefined;
    }

    // Webhook Configuration methods
    async createWebhookConfiguration(_config: { developerId: number; name: string; url: string; secret: string; events: any; isActive?: boolean; retryPolicy?: any }): Promise<any> {
      throw new Error("Webhook configurations not supported in MemStorage");
    }

    async getWebhookConfiguration(_id: number): Promise<any | undefined> {
      return undefined;
    }

    async listWebhookConfigurations(_developerId: number): Promise<any[]> {
      return [];
    }

    async updateWebhookConfiguration(_id: number, _updates: Partial<any>): Promise<any | undefined> {
      return undefined;
    }

    async deleteWebhookConfiguration(_id: number): Promise<void> {
      // No-op
    }

    // Webhook Delivery methods
    async createWebhookDelivery(_delivery: { webhookId: number; eventType: string; payload: any; status?: string; statusCode?: number; responseBody?: string; attemptNumber?: number }): Promise<any> {
      throw new Error("Webhook deliveries not supported in MemStorage");
    }

    async listWebhookDeliveries(_webhookId: number, _limit?: number): Promise<any[]> {
      return [];
    }

    async getWebhookDelivery(_id: number): Promise<any | undefined> {
      return undefined;
    }

    async updateWebhookDelivery(_id: number, _updates: Partial<any>): Promise<any | undefined> {
      return undefined;
    }

    async getWebhookDeliveries(_webhookId: number, _limit?: number): Promise<any[]> {
      return [];
    }

    // Subscription Plan methods (MemStorage - not supported)
    async createSubscriptionPlan(_plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
      throw new Error("Subscription plans not supported in MemStorage");
    }

    async getSubscriptionPlan(_id: number): Promise<SubscriptionPlan | undefined> {
      return undefined;
    }

    async getSubscriptionPlanByStripePriceId(_stripePriceId: string): Promise<SubscriptionPlan | undefined> {
      return undefined;
    }

    async listSubscriptionPlans(_filters?: { isActive?: boolean; isPublic?: boolean }): Promise<SubscriptionPlan[]> {
      return [];
    }

    // User Subscription methods (MemStorage - not supported)
    async createUserSubscription(_subscription: { userId: number; planId: number; status: string; stripeSubscriptionId?: string; stripeCustomerId?: string; currentPeriodStart: Date; currentPeriodEnd: Date; trialStart?: Date; trialEnd?: Date; quantity?: number; metadata?: any }): Promise<UserSubscription> {
      throw new Error("User subscriptions not supported in MemStorage");
    }

    async getUserSubscription(_id: number): Promise<UserSubscription | undefined> {
      return undefined;
    }

    async getUserSubscriptionByUserId(_userId: number): Promise<UserSubscription | undefined> {
      return undefined;
    }

    async getUserSubscriptionByStripeId(_stripeSubscriptionId: string): Promise<UserSubscription | undefined> {
      return undefined;
    }

    async updateUserSubscription(_id: number, _updates: Partial<UserSubscription>): Promise<UserSubscription | undefined> {
      return undefined;
    }

    async cancelUserSubscription(_id: number, _canceledAt: Date): Promise<UserSubscription | undefined> {
      return undefined;
    }

    // Subscription Invoice methods (MemStorage - not supported)
    async createSubscriptionInvoice(_invoice: { subscriptionId: number; userId: number; stripeInvoiceId?: string; amount: string; currency?: string; status?: string; hostedInvoiceUrl?: string; invoicePdf?: string; periodStart?: Date; periodEnd?: Date; paidAt?: Date }): Promise<SubscriptionInvoice> {
      throw new Error("Subscription invoices not supported in MemStorage");
    }

    async getSubscriptionInvoice(_id: number): Promise<SubscriptionInvoice | undefined> {
      return undefined;
    }

    async getSubscriptionInvoiceByStripeId(_stripeInvoiceId: string): Promise<SubscriptionInvoice | undefined> {
      return undefined;
    }

    async listSubscriptionInvoices(_userId: number, _limit?: number): Promise<SubscriptionInvoice[]> {
      return [];
    }

    async updateSubscriptionInvoice(_id: number, _updates: Partial<SubscriptionInvoice>): Promise<SubscriptionInvoice | undefined> {
      return undefined;
    }

    // Subscription Usage methods (MemStorage - not supported)
    async createSubscriptionUsage(_usage: { subscriptionId: number; userId: number; metric: string; quantity: number; periodStart: Date; periodEnd: Date }): Promise<SubscriptionUsage> {
      throw new Error("Subscription usage not supported in MemStorage");
    }

    async getSubscriptionUsage(_subscriptionId: number, _metric: string, _periodStart: Date, _periodEnd: Date): Promise<SubscriptionUsage | undefined> {
      return undefined;
    }

    async incrementSubscriptionUsage(_subscriptionId: number, _metric: string, _quantity: number, _periodStart: Date, _periodEnd: Date): Promise<SubscriptionUsage> {
      throw new Error("Subscription usage not supported in MemStorage");
    }

    async listSubscriptionUsage(_subscriptionId: number, _periodStart?: Date, _periodEnd?: Date): Promise<SubscriptionUsage[]> {
      return [];
    }

    // ==================== CRM Methods (MemStorage - not supported) ====================
    async getCrmContacts(_userId: number, page: number, limit: number): Promise<{ contacts: CrmContact[]; total: number; page: number; limit: number }> {
      return { contacts: [], total: 0, page, limit };
    }

    async createCrmContact(_contact: InsertCrmContact & { userId: number }): Promise<CrmContact> {
      throw new Error("CRM contacts not supported in MemStorage");
    }

    async getCrmContact(_id: number, _userId: number): Promise<CrmContact | undefined> {
      return undefined;
    }

    async updateCrmContact(_id: number, _userId: number, _updates: Partial<CrmContact>): Promise<CrmContact | undefined> {
      throw new Error("CRM contacts not supported in MemStorage");
    }

    async deleteCrmContact(_id: number, _userId: number): Promise<void> {
      throw new Error("CRM contacts not supported in MemStorage");
    }

    async getCrmLeads(_userId: number, page: number, limit: number): Promise<{ leads: CrmLead[]; total: number; page: number; limit: number }> {
      return { leads: [], total: 0, page, limit };
    }

    async createCrmLead(_lead: InsertCrmLead & { userId: number }): Promise<CrmLead> {
      throw new Error("CRM leads not supported in MemStorage");
    }

    async updateCrmLead(_id: number, _userId: number, _updates: Partial<CrmLead>): Promise<CrmLead | undefined> {
      throw new Error("CRM leads not supported in MemStorage");
    }

    async getCrmOpportunities(_userId: number, page: number, limit: number): Promise<{ opportunities: CrmOpportunity[]; total: number; page: number; limit: number }> {
      return { opportunities: [], total: 0, page, limit };
    }

    async createCrmOpportunity(_opportunity: InsertCrmOpportunity & { userId: number }): Promise<CrmOpportunity> {
      throw new Error("CRM opportunities not supported in MemStorage");
    }

    async updateCrmOpportunity(_id: number, _userId: number, _updates: Partial<CrmOpportunity>): Promise<CrmOpportunity | undefined> {
      throw new Error("CRM opportunities not supported in MemStorage");
    }

    async getCrmInteractions(_userId: number, _filters: { contactId?: number; leadId?: number; opportunityId?: number }, page: number, limit: number): Promise<{ interactions: CrmInteraction[]; total: number; page: number; limit: number }> {
      return { interactions: [], total: 0, page, limit };
    }

    async createCrmInteraction(_interaction: InsertCrmInteraction & { userId: number }): Promise<CrmInteraction> {
      throw new Error("CRM interactions not supported in MemStorage");
    }

    async getCrmAnalytics(_userId: number): Promise<any> {
      return {
        totalContacts: 0,
        totalLeads: 0,
        totalOpportunities: 0,
        totalRevenue: 0,
      };
    }

    // ==================== HR Methods (MemStorage - not supported) ====================
    async getHrEmployees(page: number, limit: number): Promise<{ employees: HrEmployee[]; total: number; page: number; limit: number }> {
      return { employees: [], total: 0, page, limit };
    }

    async createHrEmployee(_employee: InsertHrEmployee): Promise<HrEmployee> {
      throw new Error("HR employees not supported in MemStorage");
    }

    async getHrEmployee(_id: number): Promise<HrEmployee | undefined> {
      return undefined;
    }

    async updateHrEmployee(_id: number, _updates: Partial<HrEmployee>): Promise<HrEmployee | undefined> {
      throw new Error("HR employees not supported in MemStorage");
    }

    async getHrAttendance(_employeeId?: number, _startDate?: string, _endDate?: string): Promise<HrAttendance[]> {
      return [];
    }

    async createHrAttendance(_attendance: InsertHrAttendance): Promise<HrAttendance> {
      throw new Error("HR attendance not supported in MemStorage");
    }

    async updateHrAttendance(_id: number, _updates: Partial<HrAttendance>): Promise<HrAttendance | undefined> {
      throw new Error("HR attendance not supported in MemStorage");
    }

    async getHrLeaveRequests(_employeeId?: number, _status?: string): Promise<HrLeaveRequest[]> {
      return [];
    }

    async createHrLeaveRequest(_leaveRequest: InsertHrLeaveRequest): Promise<HrLeaveRequest> {
      throw new Error("HR leave requests not supported in MemStorage");
    }

    async updateHrLeaveRequest(_id: number, _updates: Partial<HrLeaveRequest>): Promise<HrLeaveRequest | undefined> {
      throw new Error("HR leave requests not supported in MemStorage");
    }

    async getHrPerformanceReviews(_employeeId?: number): Promise<HrPerformanceReview[]> {
      return [];
    }

    async createHrPerformanceReview(_review: InsertHrPerformanceReview): Promise<HrPerformanceReview> {
      throw new Error("HR performance reviews not supported in MemStorage");
    }

    async getHrRecruitment(_status?: string, page: number = 1, limit: number = 20): Promise<{ recruitment: HrRecruitment[]; total: number; page: number; limit: number }> {
      return { recruitment: [], total: 0, page, limit };
    }

    async createHrRecruitment(_recruitment: InsertHrRecruitment): Promise<HrRecruitment> {
      throw new Error("HR recruitment not supported in MemStorage");
    }

    async updateHrRecruitment(_id: number, _updates: Partial<HrRecruitment>): Promise<HrRecruitment | undefined> {
      throw new Error("HR recruitment not supported in MemStorage");
    }

    async getHrJobApplications(_recruitmentId?: number, _status?: string): Promise<HrJobApplication[]> {
      return [];
    }

    async createHrJobApplication(_application: InsertHrJobApplication): Promise<HrJobApplication> {
      throw new Error("HR job applications not supported in MemStorage");
    }

    async updateHrJobApplication(_id: number, _updates: Partial<HrJobApplication>): Promise<HrJobApplication | undefined> {
      throw new Error("HR job applications not supported in MemStorage");
    }

    async getHrAnalytics(): Promise<any> {
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        onLeaveEmployees: 0,
        totalLeaveRequests: 0,
        pendingLeaveRequests: 0,
      };
    }
  }
  
  export class DatabaseStorage implements IStorage {
    public sessionStore: session.Store;
  
    constructor() {
      // Use memory store temporarily until we can fix PostgreSQL session store with HTTP connection
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
  
    async getUser(id: number): Promise<User | undefined> {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    }
  
    async getUserByUsername(username: string): Promise<User | undefined> {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    }
  
    async getUserByEmail(email: string): Promise<User | undefined> {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    }
  
    async createUser(insertUser: InsertUser): Promise<User> {
      // For OAuth users (google, facebook, github, apple), password should be null
      // For local users, password should be provided (hashed)
      const userData = {
        ...insertUser,
        password: insertUser.password || null, // Explicitly set to null if not provided
      };
      
      const [user] = await db
        .insert(users)
        .values(userData)
        .returning();
      return user;
    }
  
    async updateUserTrustScore(id: number, score: string): Promise<User | undefined> {
      const [user] = await db
        .update(users)
        .set({ trustScore: score })
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    }
  
    async updateUserVerificationLevel(id: number, level: string): Promise<User | undefined> {
      const [user] = await db
        .update(users)
        .set({ verificationLevel: level })
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    }
  
    async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
      const [user] = await db
        .update(users)
        .set(updates)
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    }
  
    async updateUserPassword(id: number, hashedPassword: string): Promise<User | undefined> {
      const [user] = await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, id))
        .returning();
      return user || undefined;
    }
  
    async createPasswordReset(userId: number, token: string, expiresAt: Date): Promise<PasswordReset> {
      const [reset] = await db
        .insert(passwordResets)
        .values({ userId, token, expiresAt })
        .returning();
      return reset;
    }
  
    async getPasswordReset(token: string): Promise<PasswordReset | undefined> {
      const [reset] = await db.select().from(passwordResets).where(eq(passwordResets.token, token));
      return reset || undefined;
    }
  
    async deletePasswordReset(token: string): Promise<void> {
      await db.delete(passwordResets).where(eq(passwordResets.token, token));
    }
  
    async createKycVerification(kyc: InsertKyc & { userId: number }): Promise<KycVerification> {
      const [kycVerification] = await db
        .insert(kycVerifications)
        .values(kyc)
        .returning();
      return kycVerification;
    }
  
    async getKycByUserId(userId: number): Promise<KycVerification | undefined> {
      const [kyc] = await db.select().from(kycVerifications).where(eq(kycVerifications.userId, userId));
      return kyc || undefined;
    }
  
    async getPendingKycVerifications(): Promise<KycVerification[]> {
      return await db.select().from(kycVerifications).where(eq(kycVerifications.status, "pending"));
    }
  
    async updateKycStatus(id: number, status: string, reviewedBy: number, notes?: string): Promise<KycVerification | undefined> {
      const [kyc] = await db
        .update(kycVerifications)
        .set({ 
          status, 
          reviewedBy, 
          notes, 
          reviewedAt: new Date()
        })
        .where(eq(kycVerifications.id, id))
        .returning();
      
      // Trigger webhook event if KYC is approved
      if (kyc && status === 'approved') {
        try {
          const { webhookService } = await import('./services/webhook-service');
          const account = await this.getDeveloperAccountByUserId(kyc.userId);
          if (account) {
            await webhookService.triggerWebhookEvent('verification.completed', {
              verificationId: id,
              userId: kyc.userId,
              status: 'approved',
              type: 'kyc',
              timestamp: new Date().toISOString(),
            }, account.id);
          }
        } catch (error) {
          // Don't fail the update if webhook fails
          console.error('Failed to trigger verification.completed webhook:', error);
        }
      }
      
      return kyc || undefined;
    }
  
    async createTransaction(transaction: InsertTransaction & { buyerId: number }): Promise<Transaction> {
      const [newTransaction] = await db
        .insert(transactions)
        .values(transaction)
        .returning();
      return newTransaction;
    }
  
    async getTransaction(id: number): Promise<Transaction | undefined> {
      const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
      return transaction || undefined;
    }
  
    async getTransactionsByUser(userId: number, limit?: number, offset?: number): Promise<Transaction[]> {
      let query = db.select().from(transactions).where(
        or(eq(transactions.buyerId, userId), eq(transactions.sellerId, userId))
      );
  
      if (limit !== undefined && limit > 0) {
        query = query.limit(limit) as any;
      }
      if (offset !== undefined && offset >= 0) {
        query = query.offset(offset) as any;
      }
  
      return await query;
    }
  
    async getTransactionCountByUser(userId: number): Promise<number> {
      const [result] = await db.select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(or(eq(transactions.buyerId, userId), eq(transactions.sellerId, userId)));
      return result.count;
    }
  
    async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
      const [transaction] = await db
        .update(transactions)
        .set({ status, updatedAt: new Date() })
        .where(eq(transactions.id, id))
        .returning();
      return transaction || undefined;
    }
  
    async updateTransactionStripeId(id: number, stripePaymentIntentId: string): Promise<Transaction | undefined> {
      const [transaction] = await db
        .update(transactions)
        .set({ stripePaymentIntentId })
        .where(eq(transactions.id, id))
        .returning();
      return transaction || undefined;
    }
  
    async createMessage(message: InsertMessage & { senderId: number }): Promise<Message> {
      const [newMessage] = await db
        .insert(messages)
        .values(message)
        .returning();
      return newMessage;
    }
  
    async getMessagesByTransaction(transactionId: number): Promise<Message[]> {
      return await db.select().from(messages).where(eq(messages.transactionId, transactionId));
    }
  
    async flagMessageAsScam(id: number): Promise<Message | undefined> {
      const [message] = await db
        .update(messages)
        .set({ flaggedAsScam: true })
        .where(eq(messages.id, id))
        .returning();
      return message || undefined;
    }
  
    async createScamReport(report: InsertScamReport & { reporterId: number }): Promise<ScamReport> {
      const [scamReport] = await db
        .insert(scamReports)
        .values(report)
        .returning();
      return scamReport;
    }
  
    async getScamReports(): Promise<ScamReport[]> {
      return await db.select().from(scamReports).where(eq(scamReports.isPublic, true));
    }

    async getFraudReports(limit?: number): Promise<ScamReport[]> {
      let query = db.select().from(scamReports).where(eq(scamReports.isPublic, true)).orderBy(desc(scamReports.createdAt));
      if (limit) {
        query = query.limit(limit) as any;
      }
      return await query;
    }
  
    async searchScamReports(query: string): Promise<ScamReport[]> {
      return await db.select().from(scamReports).where(
        and(
          eq(scamReports.isPublic, true),
          or(
            ilike(scamReports.scammerInfo, `%${query}%`),
            ilike(scamReports.description, `%${query}%`)
          )
        )
      );
    }
  
    async updateScamReportStatus(id: number, status: string, reviewedBy: number): Promise<ScamReport | undefined> {
      const [report] = await db
        .update(scamReports)
        .set({ 
          status, 
          reviewedBy, 
          reviewedAt: new Date()
        })
        .where(eq(scamReports.id, id))
        .returning();
      return report || undefined;
    }
  
    async createDispute(dispute: InsertDispute & { raisedBy: number }): Promise<Dispute> {
      const disputeData: any = dispute;
      const insertData = {
        ...dispute,
        disputeType: disputeData.disputeType || "other",
        aiConfidenceScore: disputeData.aiConfidenceScore || null,
        fraudIndicators: disputeData.fraudIndicators || null,
        priorityLevel: disputeData.priorityLevel || "medium",
        autoFlagged: false,
        escalatedToHuman: false,
        queuePosition: null,
        assignedAgent: disputeData.assignedAgent || null,
        slaDeadline: disputeData.slaDeadline || null,
        evidenceSubmitted: disputeData.evidenceSubmitted || null,
      };
      const [newDispute] = await db
        .insert(disputes)
        .values(insertData)
        .returning();
      return newDispute;
    }
  
    async getDisputesByTransaction(transactionId: number): Promise<Dispute[]> {
      return await db.select().from(disputes).where(eq(disputes.transactionId, transactionId));
    }
  
    async getPendingDisputes(): Promise<Dispute[]> {
      return await db.select().from(disputes).where(eq(disputes.status, "open"));
    }
  
    async updateDisputeStatus(id: number, status: string, resolution?: string, resolvedBy?: number): Promise<Dispute | undefined> {
      const [dispute] = await db
        .update(disputes)
        .set({ 
          status, 
          resolution, 
          resolvedBy, 
          resolvedAt: status === "resolved" ? new Date() : undefined
        })
        .where(eq(disputes.id, id))
        .returning();
      return dispute || undefined;
    }
  
    // Developer Account methods
    async createDeveloperAccount(account: InsertDeveloperAccount & { userId: number; status?: string; approvedAt?: Date }): Promise<DeveloperAccount> {
      const [developerAccount] = await db
        .insert(developerAccounts)
        .values(account)
        .returning();
      return developerAccount;
    }
  
    async getDeveloperAccountByUserId(userId: number): Promise<DeveloperAccount | undefined> {
      const [account] = await db.select().from(developerAccounts).where(eq(developerAccounts.userId, userId));
      return account || undefined;
    }
  
    async getDeveloperAccount(id: number): Promise<DeveloperAccount | undefined> {
      const [account] = await db.select().from(developerAccounts).where(eq(developerAccounts.id, id));
      return account || undefined;
    }
  
    async updateDeveloperAccountStatus(id: number, status: string, approvedBy?: number): Promise<DeveloperAccount | undefined> {
      const [account] = await db
        .update(developerAccounts)
        .set({ 
          status, 
          approvedBy,
          approvedAt: status === "approved" ? new Date() : undefined
        })
        .where(eq(developerAccounts.id, id))
        .returning();
      return account || undefined;
    }
  
    async updateDeveloperUsage(id: number, usage: number): Promise<DeveloperAccount | undefined> {
      const [account] = await db
        .update(developerAccounts)
        .set({ currentUsage: usage })
        .where(eq(developerAccounts.id, id))
        .returning();
      return account || undefined;
    }
  
    // API Key methods
    async createApiKey(apiKey: { developerId: number; name: string; keyHash: string; keyPrefix: string; permissions?: string[]; expiresAt?: Date }): Promise<ApiKey> {
      const [key] = await db
        .insert(apiKeys)
        .values({
          ...apiKey,
          permissions: apiKey.permissions || []
        })
        .returning();
      return key;
    }
  
    async getApiKeysByDeveloperId(developerId: number): Promise<ApiKey[]> {
      return await db.select().from(apiKeys).where(eq(apiKeys.developerId, developerId));
    }
  
    async getApiKeyByHash(keyHash: string): Promise<ApiKey | undefined> {
      const [key] = await db.select().from(apiKeys).where(eq(apiKeys.keyHash, keyHash));
      return key || undefined;
    }
  
    async revokeApiKey(id: number): Promise<ApiKey | undefined> {
      const [key] = await db
        .update(apiKeys)
        .set({ 
          isActive: false,
          revokedAt: new Date()
        })
        .where(eq(apiKeys.id, id))
        .returning();
      return key || undefined;
    }
  
    async updateApiKeyLastUsed(id: number): Promise<ApiKey | undefined> {
      const [key] = await db
        .update(apiKeys)
        .set({ lastUsed: new Date() })
        .where(eq(apiKeys.id, id))
        .returning();
      return key || undefined;
    }
  
    // API Usage Log methods
    async createApiUsageLog(log: InsertApiUsageLog & { apiKeyId: number; developerId: number }): Promise<ApiUsageLog> {
      const [usageLog] = await db
        .insert(apiUsageLogs)
        .values(log)
        .returning();
      return usageLog;
    }
  
    async getApiUsageByDeveloper(developerId: number, startDate?: Date, endDate?: Date): Promise<ApiUsageLog[]> {
      let conditions = [eq(apiUsageLogs.developerId, developerId)];
  
      if (startDate && endDate) {
        conditions.push(
          gte(apiUsageLogs.createdAt, startDate),
          lte(apiUsageLogs.createdAt, endDate)
        );
      }
  
      return await db.select()
        .from(apiUsageLogs)
        .where(and(...conditions))
        .orderBy(desc(apiUsageLogs.createdAt));
    }
  
    async getApiUsageStats(developerId: number, period: 'day' | 'week' | 'month'): Promise<any> {
      const now = new Date();
      let startDate: Date;
  
      switch (period) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }
  
      const stats = await db
        .select({
          totalRequests: count(),
          successfulRequests: sql<number>`SUM(CASE WHEN ${apiUsageLogs.statusCode} < 400 THEN 1 ELSE 0 END)`,
          errorRequests: sql<number>`SUM(CASE WHEN ${apiUsageLogs.statusCode} >= 400 THEN 1 ELSE 0 END)`,
          avgResponseTime: avg(apiUsageLogs.responseTime)
        })
        .from(apiUsageLogs)
        .where(
          and(
            eq(apiUsageLogs.developerId, developerId),
            gte(apiUsageLogs.createdAt, startDate)
          )
        );
  
      return stats[0] || {
        totalRequests: 0,
        successfulRequests: 0,
        errorRequests: 0,
        avgResponseTime: 0
      };
    }

    // Admin stats methods
    async getUserCount(): Promise<number> {
      const result = await db.select({ count: count() }).from(users);
      return result[0]?.count || 0;
    }

    async getActiveTransactionCount(): Promise<number> {
      const result = await db
        .select({ count: count() })
        .from(transactions)
        .where(
          or(
            eq(transactions.status, 'pending'),
            eq(transactions.status, 'in_progress'),
            eq(transactions.status, 'escrow_held')
          )
        );
      return result[0]?.count || 0;
    }

    async getPendingKycCount(): Promise<number> {
      const result = await db
        .select({ count: count() })
        .from(kycVerifications)
        .where(eq(kycVerifications.status, 'pending'));
      return result[0]?.count || 0;
    }

    // Workflow Configuration methods
    async createWorkflowConfiguration(config: { developerId: number; name: string; description?: string; industry: string; useCase: string; workflowSteps: any; rules?: any; triggers?: any; isActive?: boolean; isTemplate?: boolean; version?: number }): Promise<any> {
      const [workflow] = await db
        .insert(workflowConfigurations)
        .values({
          developerId: config.developerId,
          name: config.name,
          description: config.description || null,
          industry: config.industry,
          useCase: config.useCase,
          workflowSteps: config.workflowSteps,
          rules: config.rules || {},
          triggers: config.triggers || [],
          isActive: config.isActive !== undefined ? config.isActive : true,
          isTemplate: config.isTemplate || false,
          version: config.version || 1,
          updatedAt: new Date(),
        })
        .returning();
      return workflow;
    }

    async getWorkflowConfiguration(id: number): Promise<any | undefined> {
      const [workflow] = await db.select().from(workflowConfigurations).where(eq(workflowConfigurations.id, id));
      return workflow || undefined;
    }

    async listWorkflowConfigurations(developerId: number, filters?: { industry?: string; useCase?: string; isActive?: boolean }): Promise<any[]> {
      const conditions = [eq(workflowConfigurations.developerId, developerId)];
      
      if (filters?.industry) {
        conditions.push(eq(workflowConfigurations.industry, filters.industry));
      }
      if (filters?.useCase) {
        conditions.push(eq(workflowConfigurations.useCase, filters.useCase));
      }
      if (filters?.isActive !== undefined) {
        conditions.push(eq(workflowConfigurations.isActive, filters.isActive));
      }
      
      return await db.select()
        .from(workflowConfigurations)
        .where(and(...conditions));
    }

    async updateWorkflowConfiguration(id: number, updates: Partial<any>): Promise<any | undefined> {
      const [workflow] = await db
        .update(workflowConfigurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(workflowConfigurations.id, id))
        .returning();
      return workflow || undefined;
    }

    async deleteWorkflowConfiguration(id: number): Promise<void> {
      await db.delete(workflowConfigurations).where(eq(workflowConfigurations.id, id));
    }

    // Industry Template methods
    async createIndustryTemplate(template: { name: string; industry: string; useCase: string; description?: string; workflowSteps: any; defaultRules?: any; recommendedSettings?: any; documentation?: string; codeExamples?: any; isPublic?: boolean }): Promise<any> {
      const [industryTemplate] = await db
        .insert(industryTemplates)
        .values({
          name: template.name,
          industry: template.industry,
          useCase: template.useCase,
          description: template.description || null,
          workflowSteps: template.workflowSteps,
          defaultRules: template.defaultRules || {},
          recommendedSettings: template.recommendedSettings || {},
          documentation: template.documentation || null,
          codeExamples: template.codeExamples || [],
          isPublic: template.isPublic !== undefined ? template.isPublic : true,
          updatedAt: new Date(),
        })
        .returning();
      return industryTemplate;
    }

    async getIndustryTemplate(id: number): Promise<any | undefined> {
      const [template] = await db.select().from(industryTemplates).where(eq(industryTemplates.id, id));
      return template || undefined;
    }

    async listIndustryTemplates(filters?: { industry?: string; useCase?: string }): Promise<any[]> {
      const conditions = [eq(industryTemplates.isPublic, true)];
      
      if (filters?.industry) {
        conditions.push(eq(industryTemplates.industry, filters.industry));
      }
      if (filters?.useCase) {
        conditions.push(eq(industryTemplates.useCase, filters.useCase));
      }
      
      return await db.select()
        .from(industryTemplates)
        .where(and(...conditions));
    }

    async updateIndustryTemplate(id: number, updates: Partial<any>): Promise<any | undefined> {
      const [template] = await db
        .update(industryTemplates)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(industryTemplates.id, id))
        .returning();
      return template || undefined;
    }

    // Webhook Configuration methods
    async createWebhookConfiguration(config: { developerId: number; name: string; url: string; secret: string; events: any; isActive?: boolean; retryPolicy?: any }): Promise<any> {
      const [webhook] = await db
        .insert(webhookConfigurations)
        .values({
          developerId: config.developerId,
          name: config.name,
          url: config.url,
          secret: config.secret,
          events: config.events,
          isActive: config.isActive !== undefined ? config.isActive : true,
          retryPolicy: config.retryPolicy || { maxRetries: 3, backoff: 'exponential' },
          updatedAt: new Date(),
        })
        .returning();
      return webhook;
    }

    async getWebhookConfiguration(id: number): Promise<any | undefined> {
      const [webhook] = await db.select().from(webhookConfigurations).where(eq(webhookConfigurations.id, id));
      return webhook || undefined;
    }

    async listWebhookConfigurations(developerId: number): Promise<any[]> {
      return await db.select().from(webhookConfigurations).where(eq(webhookConfigurations.developerId, developerId));
    }

    async listAllWebhookConfigurations(): Promise<any[]> {
      return await db.select().from(webhookConfigurations);
    }

    async updateWebhookConfiguration(id: number, updates: Partial<any>): Promise<any | undefined> {
      const [webhook] = await db
        .update(webhookConfigurations)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(webhookConfigurations.id, id))
        .returning();
      return webhook || undefined;
    }

    async deleteWebhookConfiguration(id: number): Promise<void> {
      await db.delete(webhookConfigurations).where(eq(webhookConfigurations.id, id));
    }

    // Webhook Delivery methods
    async createWebhookDelivery(delivery: { webhookId: number; eventType: string; payload: any; status?: string; statusCode?: number; responseBody?: string; attemptNumber?: number }): Promise<any> {
      const [webhookDelivery] = await db
        .insert(webhookDeliveries)
        .values({
          webhookId: delivery.webhookId,
          eventType: delivery.eventType,
          payload: delivery.payload,
          status: delivery.status || 'pending',
          statusCode: delivery.statusCode || null,
          responseBody: delivery.responseBody || null,
          attemptNumber: delivery.attemptNumber || 1,
        })
        .returning();
      return webhookDelivery;
    }

    async getWebhookDelivery(id: number): Promise<any | undefined> {
      const [delivery] = await db.select().from(webhookDeliveries).where(eq(webhookDeliveries.id, id));
      return delivery || undefined;
    }

    async listWebhookDeliveries(webhookId: number, limit: number = 50): Promise<any[]> {
      return await db
        .select()
        .from(webhookDeliveries)
        .where(eq(webhookDeliveries.webhookId, webhookId))
        .orderBy(desc(webhookDeliveries.createdAt))
        .limit(limit);
    }

    async updateWebhookDelivery(id: number, updates: Partial<any>): Promise<any | undefined> {
      const [delivery] = await db
        .update(webhookDeliveries)
        .set(updates)
        .where(eq(webhookDeliveries.id, id))
        .returning();
      return delivery || undefined;
    }

    async getWebhookDeliveries(webhookId: number, limit: number = 50): Promise<any[]> {
      return this.listWebhookDeliveries(webhookId, limit);
    }

    // Subscription Plan methods
    async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
      const [subscriptionPlan] = await db
        .insert(subscriptionPlans)
        .values({
          ...plan,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return subscriptionPlan;
    }

    async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
      const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
      return plan || undefined;
    }

    async getSubscriptionPlanByStripePriceId(stripePriceId: string): Promise<SubscriptionPlan | undefined> {
      const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.stripePriceId, stripePriceId));
      return plan || undefined;
    }

    async listSubscriptionPlans(filters?: { isActive?: boolean; isPublic?: boolean }): Promise<SubscriptionPlan[]> {
      const conditions = [];
      if (filters?.isActive !== undefined) {
        conditions.push(eq(subscriptionPlans.isActive, filters.isActive));
      }
      if (filters?.isPublic !== undefined) {
        conditions.push(eq(subscriptionPlans.isPublic, filters.isPublic));
      }
      
      if (conditions.length > 0) {
        return await db.select()
          .from(subscriptionPlans)
          .where(and(...conditions))
          .orderBy(subscriptionPlans.sortOrder);
      }
      
      return await db.select()
        .from(subscriptionPlans)
        .orderBy(subscriptionPlans.sortOrder);
    }

    // User Subscription methods
    async createUserSubscription(subscription: { userId: number; planId: number; status: string; stripeSubscriptionId?: string; stripeCustomerId?: string; currentPeriodStart: Date; currentPeriodEnd: Date; trialStart?: Date; trialEnd?: Date; quantity?: number; metadata?: any }): Promise<UserSubscription> {
      const [userSubscription] = await db
        .insert(userSubscriptions)
        .values({
          ...subscription,
          quantity: subscription.quantity || 1,
          metadata: subscription.metadata || {},
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return userSubscription;
    }

    async getUserSubscription(id: number): Promise<UserSubscription | undefined> {
      const [subscription] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.id, id));
      return subscription || undefined;
    }

    async getUserSubscriptionByUserId(userId: number): Promise<UserSubscription | undefined> {
      const [subscription] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
      return subscription || undefined;
    }

    async getUserSubscriptionByStripeId(stripeSubscriptionId: string): Promise<UserSubscription | undefined> {
      const [subscription] = await db.select().from(userSubscriptions).where(eq(userSubscriptions.stripeSubscriptionId, stripeSubscriptionId));
      return subscription || undefined;
    }

    async updateUserSubscription(id: number, updates: Partial<UserSubscription>): Promise<UserSubscription | undefined> {
      const [subscription] = await db
        .update(userSubscriptions)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userSubscriptions.id, id))
        .returning();
      return subscription || undefined;
    }

    async cancelUserSubscription(id: number, canceledAt: Date): Promise<UserSubscription | undefined> {
      const [subscription] = await db
        .update(userSubscriptions)
        .set({ 
          status: 'canceled',
          cancelAtPeriodEnd: true,
          canceledAt,
          updatedAt: new Date()
        })
        .where(eq(userSubscriptions.id, id))
        .returning();
      return subscription || undefined;
    }

    // Subscription Invoice methods
    async createSubscriptionInvoice(invoice: { subscriptionId: number; userId: number; stripeInvoiceId?: string; amount: string; currency?: string; status?: string; hostedInvoiceUrl?: string; invoicePdf?: string; periodStart?: Date; periodEnd?: Date; paidAt?: Date }): Promise<SubscriptionInvoice> {
      const [subscriptionInvoice] = await db
        .insert(subscriptionInvoices)
        .values({
          ...invoice,
          currency: invoice.currency || 'USD',
          status: invoice.status || 'draft',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return subscriptionInvoice;
    }

    async getSubscriptionInvoice(id: number): Promise<SubscriptionInvoice | undefined> {
      const [invoice] = await db.select().from(subscriptionInvoices).where(eq(subscriptionInvoices.id, id));
      return invoice || undefined;
    }

    async getSubscriptionInvoiceByStripeId(stripeInvoiceId: string): Promise<SubscriptionInvoice | undefined> {
      const [invoice] = await db.select().from(subscriptionInvoices).where(eq(subscriptionInvoices.stripeInvoiceId, stripeInvoiceId));
      return invoice || undefined;
    }

    async listSubscriptionInvoices(userId: number, limit: number = 50): Promise<SubscriptionInvoice[]> {
      return await db
        .select()
        .from(subscriptionInvoices)
        .where(eq(subscriptionInvoices.userId, userId))
        .orderBy(desc(subscriptionInvoices.createdAt))
        .limit(limit);
    }

    async updateSubscriptionInvoice(id: number, updates: Partial<SubscriptionInvoice>): Promise<SubscriptionInvoice | undefined> {
      const [invoice] = await db
        .update(subscriptionInvoices)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(subscriptionInvoices.id, id))
        .returning();
      return invoice || undefined;
    }

    // Subscription Usage methods
    async createSubscriptionUsage(usage: { subscriptionId: number; userId: number; metric: string; quantity: number; periodStart: Date; periodEnd: Date }): Promise<SubscriptionUsage> {
      const [usageRecord] = await db
        .insert(subscriptionUsage)
        .values({
          ...usage,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      return usageRecord;
    }

    async getSubscriptionUsage(subscriptionId: number, metric: string, periodStart: Date, periodEnd: Date): Promise<SubscriptionUsage | undefined> {
      const [usage] = await db.select()
        .from(subscriptionUsage)
        .where(
          and(
            eq(subscriptionUsage.subscriptionId, subscriptionId),
            eq(subscriptionUsage.metric, metric),
            gte(subscriptionUsage.periodStart, periodStart),
            lte(subscriptionUsage.periodEnd, periodEnd)
          )
        );
      return usage || undefined;
    }

    async incrementSubscriptionUsage(subscriptionId: number, metric: string, quantity: number, periodStart: Date, periodEnd: Date): Promise<SubscriptionUsage> {
      // Try to get existing usage record
      const existing = await this.getSubscriptionUsage(subscriptionId, metric, periodStart, periodEnd);
      
      if (existing) {
        // Update existing record
        const [updated] = await db
          .update(subscriptionUsage)
          .set({ 
            quantity: sql`${subscriptionUsage.quantity} + ${quantity}`,
            updatedAt: new Date()
          })
          .where(eq(subscriptionUsage.id, existing.id))
          .returning();
        return updated;
      } else {
        // Create new record
        const subscription = await this.getUserSubscription(subscriptionId);
        if (!subscription) {
          throw new Error('Subscription not found');
        }
        return await this.createSubscriptionUsage({
          subscriptionId,
          userId: subscription.userId,
          metric,
          quantity,
          periodStart,
          periodEnd,
        });
      }
    }

    async listSubscriptionUsage(subscriptionId: number, periodStart?: Date, periodEnd?: Date): Promise<SubscriptionUsage[]> {
      const conditions = [eq(subscriptionUsage.subscriptionId, subscriptionId)];
      
      if (periodStart) {
        conditions.push(gte(subscriptionUsage.periodStart, periodStart));
      }
      if (periodEnd) {
        conditions.push(lte(subscriptionUsage.periodEnd, periodEnd));
      }
      
      return await db.select()
        .from(subscriptionUsage)
        .where(and(...conditions))
        .orderBy(desc(subscriptionUsage.createdAt));
    }

    // ==================== CRM Methods ====================
    async getCrmContacts(userId: number, page: number, limit: number): Promise<{ contacts: CrmContact[]; total: number; page: number; limit: number }> {
      const offset = (page - 1) * limit;
      const contacts = await db.select()
        .from(crmContacts)
        .where(eq(crmContacts.userId, userId))
        .orderBy(desc(crmContacts.createdAt))
        .limit(limit)
        .offset(offset);
      
      const [totalResult] = await db.select({ count: count() })
        .from(crmContacts)
        .where(eq(crmContacts.userId, userId));
      
      return { contacts, total: totalResult?.count || 0, page, limit };
    }

    async createCrmContact(contact: InsertCrmContact & { userId: number }): Promise<CrmContact> {
      const [newContact] = await db.insert(crmContacts)
        .values({ ...contact, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newContact;
    }

    async getCrmContact(id: number, userId: number): Promise<CrmContact | undefined> {
      const [contact] = await db.select()
        .from(crmContacts)
        .where(and(eq(crmContacts.id, id), eq(crmContacts.userId, userId)));
      return contact || undefined;
    }

    async updateCrmContact(id: number, userId: number, updates: Partial<CrmContact>): Promise<CrmContact | undefined> {
      const [updated] = await db.update(crmContacts)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(crmContacts.id, id), eq(crmContacts.userId, userId)))
        .returning();
      return updated || undefined;
    }

    async deleteCrmContact(id: number, userId: number): Promise<void> {
      await db.delete(crmContacts)
        .where(and(eq(crmContacts.id, id), eq(crmContacts.userId, userId)));
    }

    async getCrmLeads(userId: number, page: number, limit: number): Promise<{ leads: CrmLead[]; total: number; page: number; limit: number }> {
      const offset = (page - 1) * limit;
      const leads = await db.select()
        .from(crmLeads)
        .where(eq(crmLeads.userId, userId))
        .orderBy(desc(crmLeads.createdAt))
        .limit(limit)
        .offset(offset);
      
      const [totalResult] = await db.select({ count: count() })
        .from(crmLeads)
        .where(eq(crmLeads.userId, userId));
      
      return { leads, total: totalResult?.count || 0, page, limit };
    }

    async createCrmLead(lead: InsertCrmLead & { userId: number }): Promise<CrmLead> {
      const [newLead] = await db.insert(crmLeads)
        .values({ ...lead, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newLead;
    }

    async updateCrmLead(id: number, userId: number, updates: Partial<CrmLead>): Promise<CrmLead | undefined> {
      const [updated] = await db.update(crmLeads)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(crmLeads.id, id), eq(crmLeads.userId, userId)))
        .returning();
      return updated || undefined;
    }

    async getCrmOpportunities(userId: number, page: number, limit: number): Promise<{ opportunities: CrmOpportunity[]; total: number; page: number; limit: number }> {
      const offset = (page - 1) * limit;
      const opportunities = await db.select()
        .from(crmOpportunities)
        .where(eq(crmOpportunities.userId, userId))
        .orderBy(desc(crmOpportunities.createdAt))
        .limit(limit)
        .offset(offset);
      
      const [totalResult] = await db.select({ count: count() })
        .from(crmOpportunities)
        .where(eq(crmOpportunities.userId, userId));
      
      return { opportunities, total: totalResult?.count || 0, page, limit };
    }

    async createCrmOpportunity(opportunity: InsertCrmOpportunity & { userId: number }): Promise<CrmOpportunity> {
      const [newOpportunity] = await db.insert(crmOpportunities)
        .values({ ...opportunity, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newOpportunity;
    }

    async updateCrmOpportunity(id: number, userId: number, updates: Partial<CrmOpportunity>): Promise<CrmOpportunity | undefined> {
      const [updated] = await db.update(crmOpportunities)
        .set({ ...updates, updatedAt: new Date() })
        .where(and(eq(crmOpportunities.id, id), eq(crmOpportunities.userId, userId)))
        .returning();
      return updated || undefined;
    }

    async getCrmInteractions(userId: number, filters: { contactId?: number; leadId?: number; opportunityId?: number }, page: number, limit: number): Promise<{ interactions: CrmInteraction[]; total: number; page: number; limit: number }> {
      const offset = (page - 1) * limit;
      const conditions = [eq(crmInteractions.userId, userId)];
      
      if (filters.contactId) conditions.push(eq(crmInteractions.contactId, filters.contactId));
      if (filters.leadId) conditions.push(eq(crmInteractions.leadId, filters.leadId));
      if (filters.opportunityId) conditions.push(eq(crmInteractions.opportunityId, filters.opportunityId));
      
      const interactions = await db.select()
        .from(crmInteractions)
        .where(and(...conditions))
        .orderBy(desc(crmInteractions.createdAt))
        .limit(limit)
        .offset(offset);
      
      const [totalResult] = await db.select({ count: count() })
        .from(crmInteractions)
        .where(and(...conditions));
      
      return { interactions, total: totalResult?.count || 0, page, limit };
    }

    async createCrmInteraction(interaction: InsertCrmInteraction & { userId: number }): Promise<CrmInteraction> {
      const [newInteraction] = await db.insert(crmInteractions)
        .values({ ...interaction, createdAt: new Date() })
        .returning();
      return newInteraction;
    }

    async getCrmAnalytics(userId: number): Promise<any> {
      const [contactsCount] = await db.select({ count: count() })
        .from(crmContacts)
        .where(eq(crmContacts.userId, userId));
      
      const [leadsCount] = await db.select({ count: count() })
        .from(crmLeads)
        .where(eq(crmLeads.userId, userId));
      
      const [opportunitiesCount] = await db.select({ count: count() })
        .from(crmOpportunities)
        .where(eq(crmOpportunities.userId, userId));
      
      const [totalValue] = await db.select({ total: sql<number>`COALESCE(SUM(${crmOpportunities.value}), 0)` })
        .from(crmOpportunities)
        .where(and(eq(crmOpportunities.userId, userId), eq(crmOpportunities.stage, 'closed_won')));
      
      return {
        totalContacts: contactsCount?.count || 0,
        totalLeads: leadsCount?.count || 0,
        totalOpportunities: opportunitiesCount?.count || 0,
        totalRevenue: totalValue?.total || 0,
      };
    }

    // ==================== HR Methods ====================
    async getHrEmployees(page: number, limit: number): Promise<{ employees: HrEmployee[]; total: number; page: number; limit: number }> {
      const offset = (page - 1) * limit;
      const employees = await db.select()
        .from(hrEmployees)
        .orderBy(desc(hrEmployees.createdAt))
        .limit(limit)
        .offset(offset);
      
      const [totalResult] = await db.select({ count: count() })
        .from(hrEmployees);
      
      return { employees, total: totalResult?.count || 0, page, limit };
    }

    async createHrEmployee(employee: InsertHrEmployee): Promise<HrEmployee> {
      const [newEmployee] = await db.insert(hrEmployees)
        .values({ ...employee, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newEmployee;
    }

    async getHrEmployee(id: number): Promise<HrEmployee | undefined> {
      const [employee] = await db.select()
        .from(hrEmployees)
        .where(eq(hrEmployees.id, id));
      return employee || undefined;
    }

    async updateHrEmployee(id: number, updates: Partial<HrEmployee>): Promise<HrEmployee | undefined> {
      const [updated] = await db.update(hrEmployees)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(hrEmployees.id, id))
        .returning();
      return updated || undefined;
    }

    async getHrAttendance(employeeId?: number, startDate?: string, endDate?: string): Promise<HrAttendance[]> {
      const conditions = [];
      if (employeeId) conditions.push(eq(hrAttendance.employeeId, employeeId));
      if (startDate) conditions.push(gte(hrAttendance.date, new Date(startDate)));
      if (endDate) conditions.push(lte(hrAttendance.date, new Date(endDate)));
      
      return await db.select()
        .from(hrAttendance)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(hrAttendance.date));
    }

    async createHrAttendance(attendance: InsertHrAttendance): Promise<HrAttendance> {
      const [newAttendance] = await db.insert(hrAttendance)
        .values({ ...attendance, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newAttendance;
    }

    async updateHrAttendance(id: number, updates: Partial<HrAttendance>): Promise<HrAttendance | undefined> {
      const [updated] = await db.update(hrAttendance)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(hrAttendance.id, id))
        .returning();
      return updated || undefined;
    }

    async getHrLeaveRequests(employeeId?: number, status?: string): Promise<HrLeaveRequest[]> {
      const conditions = [];
      if (employeeId) conditions.push(eq(hrLeaveRequests.employeeId, employeeId));
      if (status) conditions.push(eq(hrLeaveRequests.status, status));
      
      return await db.select()
        .from(hrLeaveRequests)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(hrLeaveRequests.createdAt));
    }

    async createHrLeaveRequest(leaveRequest: InsertHrLeaveRequest): Promise<HrLeaveRequest> {
      const startDate = new Date(leaveRequest.startDate);
      const endDate = new Date(leaveRequest.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const [newLeaveRequest] = await db.insert(hrLeaveRequests)
        .values({ ...leaveRequest, days, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newLeaveRequest;
    }

    async updateHrLeaveRequest(id: number, updates: Partial<HrLeaveRequest>): Promise<HrLeaveRequest | undefined> {
      const [updated] = await db.update(hrLeaveRequests)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(hrLeaveRequests.id, id))
        .returning();
      return updated || undefined;
    }

    async getHrPerformanceReviews(employeeId?: number): Promise<HrPerformanceReview[]> {
      const conditions = employeeId ? [eq(hrPerformanceReviews.employeeId, employeeId)] : [];
      
      return await db.select()
        .from(hrPerformanceReviews)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(hrPerformanceReviews.reviewDate));
    }

    async createHrPerformanceReview(review: InsertHrPerformanceReview): Promise<HrPerformanceReview> {
      const [newReview] = await db.insert(hrPerformanceReviews)
        .values({ ...review, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newReview;
    }

    async getHrRecruitment(status?: string, page: number = 1, limit: number = 20): Promise<{ recruitment: HrRecruitment[]; total: number; page: number; limit: number }> {
      const offset = (page - 1) * limit;
      const conditions = status ? [eq(hrRecruitment.status, status)] : [];
      
      const recruitment = await db.select()
        .from(hrRecruitment)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(hrRecruitment.postedDate))
        .limit(limit)
        .offset(offset);
      
      const [totalResult] = await db.select({ count: count() })
        .from(hrRecruitment)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      
      return { recruitment, total: totalResult?.count || 0, page, limit };
    }

    async createHrRecruitment(recruitment: InsertHrRecruitment): Promise<HrRecruitment> {
      const [newRecruitment] = await db.insert(hrRecruitment)
        .values({ ...recruitment, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newRecruitment;
    }

    async updateHrRecruitment(id: number, updates: Partial<HrRecruitment>): Promise<HrRecruitment | undefined> {
      const [updated] = await db.update(hrRecruitment)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(hrRecruitment.id, id))
        .returning();
      return updated || undefined;
    }

    async getHrJobApplications(recruitmentId?: number, status?: string): Promise<HrJobApplication[]> {
      const conditions = [];
      if (recruitmentId) conditions.push(eq(hrJobApplications.recruitmentId, recruitmentId));
      if (status) conditions.push(eq(hrJobApplications.status, status));
      
      return await db.select()
        .from(hrJobApplications)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(hrJobApplications.createdAt));
    }

    async createHrJobApplication(application: InsertHrJobApplication): Promise<HrJobApplication> {
      const [newApplication] = await db.insert(hrJobApplications)
        .values({ ...application, createdAt: new Date(), updatedAt: new Date() })
        .returning();
      return newApplication;
    }

    async updateHrJobApplication(id: number, updates: Partial<HrJobApplication>): Promise<HrJobApplication | undefined> {
      const [updated] = await db.update(hrJobApplications)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(hrJobApplications.id, id))
        .returning();
      return updated || undefined;
    }

    async getHrAnalytics(): Promise<any> {
      const [employeesCount] = await db.select({ count: count() })
        .from(hrEmployees)
        .where(eq(hrEmployees.status, 'active'));
      
      const [onLeaveCount] = await db.select({ count: count() })
        .from(hrLeaveRequests)
        .where(eq(hrLeaveRequests.status, 'approved'));
      
      const [openPositions] = await db.select({ count: count() })
        .from(hrRecruitment)
        .where(eq(hrRecruitment.status, 'open'));
      
      const [applicationsCount] = await db.select({ count: count() })
        .from(hrJobApplications)
        .where(eq(hrJobApplications.status, 'applied'));
      
      return {
        totalEmployees: employeesCount?.count || 0,
        employeesOnLeave: onLeaveCount?.count || 0,
        openPositions: openPositions?.count || 0,
        pendingApplications: applicationsCount?.count || 0,
      };
    }

  }
  
  export const storage = new DatabaseStorage();