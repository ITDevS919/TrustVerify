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
    type InsertSubscriptionPlan
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
      const [user] = await db
        .insert(users)
        .values(insertUser)
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

  }
  
  export const storage = new DatabaseStorage();