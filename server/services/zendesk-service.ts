import { Request, Response } from 'express';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  message: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  userId?: string;
  sessionId: string;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  email: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'pending' | 'in-progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'fraud-report' | 'integration' | 'general';
  createdAt: Date;
  updatedAt: Date;
  assignedAgent?: string;
  chatSessionId?: string;
}

export class ZendeskService {
  private chatSessions: Map<string, ChatMessage[]> = new Map();
  private supportTickets: Map<string, SupportTicket> = new Map();

  constructor() {
    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample support responses for common queries
    const sampleResponses = [
      {
        keywords: ['pricing', 'cost', 'price', 'plan'],
        response: 'Our pricing starts at £99/month for the Starter plan, which includes fraud detection for up to 1,000 transactions. The Professional plan at £399/month covers up to 10,000 transactions with advanced features. Would you like me to schedule a demo to show you which plan fits your business needs?'
      },
      {
        keywords: ['security', 'fraud', 'protection', 'safe'],
        response: 'TrustVerify provides enterprise-grade security with AI-powered fraud detection covering global transaction patterns. We offer 72-hour dispute resolution and real-time protection. Our system monitors over 200 fraud indicators. What specific security concerns can I help address for your business?'
      },
      {
        keywords: ['integration', 'api', 'setup', 'install'],
        response: 'Our 2-click integration supports WordPress, Shopify, and custom APIs. We provide comprehensive documentation and technical support. I can connect you with our integration team or provide step-by-step guides. Which platform are you looking to integrate with?'
      },
      {
        keywords: ['demo', 'trial', 'test'],
        response: 'I can arrange a personalized demo of our fraud prevention system showing real-time detection, dispute resolution, and reporting features. Our demos typically take 15-20 minutes. Would you prefer a technical demonstration or business overview?'
      },
      {
        keywords: ['support', 'help', 'issue', 'problem'],
        response: 'I\'m here to help! Our technical support team is available 24/7. For urgent issues, I can escalate immediately to our engineering team. What specific challenge are you facing with TrustVerify?'
      },
      {
        keywords: ['kyc', 'verification', 'identity', 'document'],
        response: 'Our KYC verification system supports global identity documents and provides multi-level verification (basic, enhanced, premium). We comply with international AML/KYC requirements. What verification level do you need for your business?'
      },
      {
        keywords: ['escrow', 'payment', 'transaction', 'funds'],
        response: 'Our escrow service holds funds securely until transaction verification is complete. We support all major payment methods and provide 72-hour resolution for disputes. Transaction fees start at 2.5%. Would you like details about our payment protection features?'
      }
    ];

    // Store sample responses for auto-responses
    (this as any).sampleResponses = sampleResponses;
  }

  // Chat functionality
  async sendMessage(sessionId: string, message: string, sender: 'user' | 'agent', userId?: string): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender,
      message,
      timestamp: new Date(),
      status: 'sent',
      userId,
      sessionId
    };

    if (!this.chatSessions.has(sessionId)) {
      this.chatSessions.set(sessionId, []);
    }

    this.chatSessions.get(sessionId)!.push(chatMessage);

    // If user message, generate automatic response
    if (sender === 'user') {
      setTimeout(() => {
        this.generateAgentResponse(sessionId, message, userId);
      }, 1000 + Math.random() * 2000);
    }

    return chatMessage;
  }

  private async generateAgentResponse(sessionId: string, userMessage: string, userId?: string) {
    const lowerMessage = userMessage.toLowerCase();
    const responses = (this as any).sampleResponses;
    
    let bestResponse = 'Thank you for your message. I\'ll connect you with a specialist who can provide detailed assistance with your inquiry. Is there anything specific about TrustVerify I can help clarify right now?';
    
    // Find the best matching response
    for (const responseData of responses) {
      if (responseData.keywords.some((keyword: string) => lowerMessage.includes(keyword))) {
        bestResponse = responseData.response;
        break;
      }
    }

    const agentMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'agent',
      message: bestResponse,
      timestamp: new Date(),
      status: 'delivered',
      userId,
      sessionId
    };

    if (!this.chatSessions.has(sessionId)) {
      this.chatSessions.set(sessionId, []);
    }

    this.chatSessions.get(sessionId)!.push(agentMessage);
  }

  async getChatHistory(sessionId: string): Promise<ChatMessage[]> {
    return this.chatSessions.get(sessionId) || [];
  }

  async markMessagesAsRead(sessionId: string, messageIds: string[]): Promise<void> {
    const messages = this.chatSessions.get(sessionId);
    if (messages) {
      messages.forEach(msg => {
        if (messageIds.includes(msg.id)) {
          msg.status = 'read';
        }
      });
    }
  }

  // Support ticket functionality
  async createSupportTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<SupportTicket> {
    const ticket: SupportTicket = {
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...ticketData,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.supportTickets.set(ticket.id, ticket);
    return ticket;
  }

  async getSupportTicket(ticketId: string): Promise<SupportTicket | null> {
    return this.supportTickets.get(ticketId) || null;
  }

  async updateSupportTicket(ticketId: string, updates: Partial<SupportTicket>): Promise<SupportTicket | null> {
    const ticket = this.supportTickets.get(ticketId);
    if (!ticket) return null;

    const updatedTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date()
    };

    this.supportTickets.set(ticketId, updatedTicket);
    return updatedTicket;
  }

  async getUserSupportTickets(userId: string): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values()).filter(ticket => ticket.userId === userId);
  }

  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Analytics and reporting
  async getChatAnalytics(startDate?: Date, endDate?: Date): Promise<{
    totalSessions: number;
    totalMessages: number;
    averageResponseTime: number;
    commonQueries: { query: string; count: number }[];
  }> {
    const allMessages = Array.from(this.chatSessions.values()).flat();
    
    const filtered = allMessages.filter(msg => {
      if (!startDate || !endDate) return true;
      return msg.timestamp >= startDate && msg.timestamp <= endDate;
    });

    // Analyze common queries
    const userMessages = filtered.filter(msg => msg.sender === 'user');
    const queryKeywords = userMessages.map(msg => 
      msg.message.toLowerCase().split(' ').filter(word => word.length > 3)
    ).flat();

    const keywordCounts = queryKeywords.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const commonQueries = Object.entries(keywordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    return {
      totalSessions: this.chatSessions.size,
      totalMessages: filtered.length,
      averageResponseTime: 95, // Mock response time in seconds
      commonQueries
    };
  }

  async getTicketAnalytics(): Promise<{
    totalTickets: number;
    openTickets: number;
    avgResolutionTime: number;
    ticketsByCategory: Record<string, number>;
    ticketsByPriority: Record<string, number>;
  }> {
    const tickets = Array.from(this.supportTickets.values());
    
    const ticketsByCategory = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ticketsByPriority = tickets.reduce((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => ['open', 'in-progress'].includes(t.status)).length,
      avgResolutionTime: 4.5, // hours
      ticketsByCategory,
      ticketsByPriority
    };
  }

  // Integration with external Zendesk (placeholder for real implementation)
  async syncWithZendesk(): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would sync with Zendesk API
    console.log('Syncing with Zendesk API...');
    
    return {
      success: true,
      message: 'Successfully synced with Zendesk. All tickets and chat sessions are up to date.'
    };
  }

  async escalateToZendesk(sessionId: string, reason: string): Promise<{ ticketId: string; zendeskUrl: string }> {
    // Create support ticket from chat session
    const chatHistory = await this.getChatHistory(sessionId);
    const lastUserMessage = chatHistory.filter(msg => msg.sender === 'user').pop();
    
    if (lastUserMessage) {
      const ticket = await this.createSupportTicket({
        userId: lastUserMessage.userId,
        email: 'support@trustverify.io', // Would get from user session
        subject: `Chat escalation: ${reason}`,
        description: `Escalated from chat session ${sessionId}.\n\nChat History:\n${chatHistory.map(msg => `${msg.sender}: ${msg.message}`).join('\n')}`,
        priority: 'high',
        category: 'general',
        chatSessionId: sessionId
      });

      return {
        ticketId: ticket.id,
        zendeskUrl: `https://trustverify.zendesk.com/tickets/${ticket.id}`
      };
    }

    throw new Error('No chat history found for escalation');
  }
}

export const zendeskService = new ZendeskService();