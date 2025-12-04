import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest } from '@/lib/queryClient';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export function LiveChat({ isOpen, onClose, onMinimize }: LiveChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize chat session
  useEffect(() => {
    if (isOpen && !isConnected) {
      initializeChat();
    }
  }, [isOpen, isConnected]);

  const initializeChat = async () => {
    try {
      setIsConnected(true);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Hello${user?.username ? ` ${user.username}` : ''}! I'm here to help with any TrustVerify platform questions or issues. How can I assist you today?`,
        sender: 'support',
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
      
      // Simulate quick follow-up with common options
      setTimeout(() => {
        const optionsMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: "I can help you with:\n• Account setup and verification\n• Transaction questions\n• Platform features\n• Technical issues\n• Billing inquiries\n\nWhat would you like assistance with?",
          sender: 'support',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, optionsMessage]);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      setIsConnected(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !isConnected) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Send message to support system
      await apiRequest('POST', '/api/support/chat', {
        message: userMessage.text,
        userId: user?.id,
        timestamp: userMessage.timestamp.toISOString()
      });

      // Update message status
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );

      // Simulate support response (replace with real integration)
      setTimeout(() => {
        const supportResponse = generateSupportResponse(userMessage.text);
        const responseMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          text: supportResponse,
          sender: 'support',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, responseMessage]);
        setIsTyping(false);
      }, 2000);

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Update message status to error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error' }
            : msg
        )
      );
      setIsTyping(false);
    }
  };

  const generateSupportResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('transaction') || message.includes('payment')) {
      return "I can help you with transaction-related questions. For specific transaction details, please provide your transaction ID or I can guide you to your transaction history in your dashboard. Would you like me to help you locate a specific transaction?";
    }
    
    if (message.includes('account') || message.includes('verify') || message.includes('kyc')) {
      return "For account verification, you can upload your documents in the Identity Verification section of your dashboard. The verification process typically takes 24-48 hours. Would you like me to guide you through the verification steps?";
    }
    
    if (message.includes('api') || message.includes('developer') || message.includes('integration')) {
      return "For developer support, please visit our Developer Portal where you'll find API documentation, integration guides, and can generate your API keys. Would you like me to direct you to specific API documentation?";
    }
    
    if (message.includes('billing') || message.includes('price') || message.includes('cost')) {
      return "For billing questions, you can view your current plan and usage in the Billing section of your dashboard. If you need to upgrade or have billing disputes, I can connect you with our billing team. What specific billing question do you have?";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "I'm here to help! You can ask me about account issues, transactions, platform features, or any technical problems you're experiencing. What specific area would you like assistance with?";
    }
    
    return "I understand you need assistance with that. Let me connect you with a specialist who can provide detailed help with your specific question. In the meantime, you might find helpful information in our User Guide or by creating a support ticket for detailed assistance.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-4 w-96 h-[500px] shadow-2xl z-[10000] flex flex-col border border-solid border-[#e4e4e4] rounded-[20px] overflow-hidden bg-white">
      {/* Fixed Header - No Scroll */}
      <CardHeader className="bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-t-[20px] px-[20px] py-[20px] flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <MessageCircle className="h-6 w-6 flex-shrink-0" />
            <CardTitle className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-lg tracking-[-0.20px] leading-7">
              TrustVerify Support
            </CardTitle>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="text-white hover:bg-white/20 p-1.5 rounded-[10px] transition-all"
              aria-label="Minimize chat"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1.5 rounded-[10px] transition-all"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2.5 mt-3">
          <div className={cn(
            "w-2 h-2 rounded-full flex-shrink-0",
            isConnected ? 'bg-[#27AE60]' : 'bg-[#d32030]'
          )} />
          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm tracking-[0] leading-5">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </CardHeader>

      {/* Scrollable Messages Area */}
      <CardContent className="flex-1 flex flex-col p-0 bg-white overflow-hidden">
        <div className="flex-1 overflow-y-auto px-[31px] py-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-3 rounded-[10px]",
                  message.sender === 'user'
                    ? 'bg-[#003366] text-white'
                    : 'bg-white border border-solid border-[#e4e4e4] shadow-sm'
                )}
              >
                <div className={cn(
                  "whitespace-pre-wrap",
                  "[font-family:'DM_Sans_18pt-Regular',Helvetica]",
                  "font-normal text-sm tracking-[0] leading-6"
                )}>
                  {message.text}
                </div>
                <div className={cn(
                  "[font-family:'DM_Sans_18pt-Regular',Helvetica]",
                  "font-normal text-xs mt-2 tracking-[0]",
                  message.sender === 'user' ? 'text-white/80' : 'text-[#808080]'
                )}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.sender === 'user' && message.status && (
                    <span className="ml-2">
                      {message.status === 'sending' && '⏳'}
                      {message.status === 'sent' && '✓'}
                      {message.status === 'error' && '❌'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-solid border-[#e4e4e4] shadow-sm px-4 py-3 rounded-[10px]">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-[#808080] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#808080] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-[#808080] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Area - No Scroll */}
        <div className="border-t border-solid border-[#e4e4e4] px-[31px] py-4 bg-white flex-shrink-0">
          <div className="flex gap-2.5">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={!isConnected}
              className={cn(
                "flex-1 rounded-[10px] border border-solid border-[#e4e4e4]",
                "[font-family:'DM_Sans_18pt-Regular',Helvetica]",
                "font-normal text-sm tracking-[0]",
                "focus:ring-2 focus:ring-[#003366] focus:border-[#003366]",
                "disabled:bg-gray-50 disabled:text-[#808080]"
              )}
            />
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || !isConnected}
              size="sm"
              className={cn(
                "bg-[#003366] hover:bg-[#004080] text-white rounded-[10px]",
                "[font-family:'DM_Sans_18pt-Bold',Helvetica]",
                "font-bold text-sm tracking-[-0.20px] leading-5",
                "px-4 py-2 h-auto",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all"
              )}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
