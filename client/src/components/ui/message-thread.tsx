import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AlertTriangle, Flag, MoreHorizontal, Shield } from "lucide-react";

interface Message {
  id: number;
  transactionId: number;
  senderId: number;
  content: string;
  isSystemMessage: boolean;
  flaggedAsScam: boolean;
  createdAt: string;
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId: number;
  onFlagMessage: (messageId: number) => void;
}

export function MessageThread({ messages, currentUserId, onFlagMessage }: MessageThreadProps) {
  const [flaggedMessages, setFlaggedMessages] = useState<Set<number>>(new Set());

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString();
    if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleFlagMessage = (messageId: number) => {
    onFlagMessage(messageId);
    setFlaggedMessages(prev => new Set(prev).add(messageId));
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Secure Messaging</h3>
          <p className="text-gray-600 text-sm">
            Start a conversation with your transaction partner. All messages are monitored for security.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-[30px]">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === currentUserId;
        const isScamFlagged = message.flaggedAsScam || flaggedMessages.has(message.id);
        
        return (
          <div
            key={message.id}
            className={`flex flex-col gap-2 sm:gap-[11px] ${isOwnMessage ? "items-end" : "items-start"}`}
          >
            {message.isSystemMessage ? (
              <div className="w-full flex justify-center">
                <Badge className="bg-[#436cc833] text-[#436cc8] border-[#436cc8] border">
                  <Shield className="h-3 w-3 mr-1" />
                  {message.content}
                </Badge>
              </div>
            ) : (
              <>
                <div
                  className={`relative group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-[19px] max-w-[85%] sm:max-w-[400px] md:max-w-[524px] ${
                    isOwnMessage
                      ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white rounded-[10px_10px_0px_10px]"
                      : "bg-neutral-100 text-[#003d2b] rounded-[10px_10px_10px_0px]"
                  } ${isScamFlagged ? "border-2 border-red-500" : ""}`}
                >
                  {/* Scam Warning */}
                  {isScamFlagged && (
                    <div className="absolute -top-6 left-0 right-0 flex justify-center">
                      <Badge className="bg-red-500 text-white text-xs border-0">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Flagged as suspicious
                      </Badge>
                    </div>
                  )}
                  
                  <div
                    className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm sm:text-base tracking-[0] leading-[normal] ${
                      isOwnMessage ? "text-white" : "text-[#003d2b]"
                    } break-words flex-1`}
                  >
                    {message.content}
                  </div>
                  
                  {!isOwnMessage && !message.isSystemMessage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-6 w-6 p-0 ${
                            isOwnMessage ? "hover:bg-white/20" : "hover:bg-neutral-200"
                          }`}
                        >
                          <MoreHorizontal className={`h-3 w-3 ${isOwnMessage ? "text-white" : "text-[#003d2b]"}`} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleFlagMessage(message.id)}
                          className="text-red-600"
                          disabled={isScamFlagged}
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          {isScamFlagged ? "Already Flagged" : "Flag as Scam"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[10px] sm:text-[11px] tracking-[0] leading-[normal]">
                  {formatTime(message.createdAt)}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
