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
    type PasswordReset
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
    searchScamReports(query: string): Promise<ScamReport[]>;
    updateScamReportStatus(id: number, status: string, reviewedBy: number): Promise<ScamReport | undefined>;
  
    // Dispute methods
    createDispute(dispute: InsertDispute & { raisedBy: number }): Promise<Dispute>;
    getDisputesByTransaction(transactionId: number): Promise<Dispute[]>;
    getPendingDisputes(): Promise<Dispute[]>;
    updateDisputeStatus(id: number, status: string, resolution?: string, resolvedBy?: number): Promise<Dispute | undefined>;
  
    // Developer Account methods
    createDeveloperAccount(account: InsertDeveloperAccount & { userId: number }): Promise<DeveloperAccount>;
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
        isVerified: false,
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
    async createDeveloperAccount(_account: InsertDeveloperAccount & { userId: number }): Promise<DeveloperAccount> {
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
    async createDeveloperAccount(account: InsertDeveloperAccount & { userId: number }): Promise<DeveloperAccount> {
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
  
  }
  
  export const storage = new DatabaseStorage();