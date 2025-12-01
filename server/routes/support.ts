import express from 'express';
import { z } from 'zod';

const router = express.Router();

// Validation schema for support tickets
const createTicketSchema = z.object({
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  category: z.enum(['technical', 'billing', 'fraud-report', 'integration', 'general'])
});

// Create support ticket
router.post('/tickets', async (req, res) => {
  try {
    const validatedData = createTicketSchema.parse(req.body);
    
    // Generate a ticket ID
    const ticketId = `TRV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    // In a real implementation, this would save to database and integrate with support system
    const ticket = {
      id: ticketId,
      ...validatedData,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Log the ticket creation for debugging
    console.log('Support ticket created:', {
      ticketId,
      email: validatedData.email,
      category: validatedData.category,
      priority: validatedData.priority,
      subject: validatedData.subject
    });

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket: {
        id: ticket.id,
        status: ticket.status,
        createdAt: ticket.createdAt
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get ticket status (for future use)
router.get('/tickets/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    
    // In a real implementation, this would query the database
    // For now, return a mock response
    res.json({
      success: true,
      ticket: {
        id: ticketId,
        status: 'in-progress',
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        assignee: 'TrustVerify Support Team'
      }
    });

  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// List user tickets (for future use)
router.get('/tickets', async (req, res) => {
  try {
    // In a real implementation, this would query user's tickets from database
    res.json({
      success: true,
      tickets: [],
      totalCount: 0
    });

  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Live chat endpoint - send message
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, timestamp } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Store chat message (in a real implementation, you'd save to database)
    const chatMessage = {
      id: Date.now().toString(),
      message,
      userId: userId || 'anonymous',
      timestamp: timestamp || new Date(),
      status: 'received'
    };

    console.log('Live chat message received:', {
      messageId: chatMessage.id,
      userId: chatMessage.userId,
      messageLength: message.length,
      timestamp: chatMessage.timestamp
    });

    // In a real implementation, you would:
    // 1. Save the message to a chat_messages table
    // 2. Notify support agents via WebSocket/webhook
    // 3. Create a support ticket if needed
    // 4. Return appropriate response based on message content

    res.json({ 
      success: true, 
      messageId: chatMessage.id,
      timestamp: chatMessage.timestamp 
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get chat history (for when user reopens chat)
router.get('/chat/history', async (req, res) => {
  try {
    const { userId } = req.query;
    
    console.log('Chat history requested for user:', userId);
    
    // In a real implementation, fetch chat history from database
    // For now, return empty array since this is the first session
    res.json({
      success: true,
      messages: [],
      sessionId: `chat-${Date.now()}`
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;