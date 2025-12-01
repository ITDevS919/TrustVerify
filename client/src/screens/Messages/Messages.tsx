import { ArrowLeftIcon, ShieldIcon, Send, PoundSterling } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { HeaderDemo } from "../../components/HeaderDemo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { MessageThread } from "@/components/ui/message-thread";
import { useToast } from "@/hooks/use-toast";

const statsData = [
    {
        icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-3.svg",
        label: "Total Conversations",
        value: "03",
    },
    {
        icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-4.svg",
        label: "Secure Messages",
        value: "15",
    },
    {
        icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-2.svg",
        label: "Unread Messages",
        value: "04",
    },
];

const chatData = [
    {
        id: 1,
        transactionId: 1,
        avatar:
            "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg",
        name: "Jane Developer",
        participantEmail: "jane@developer.com",
        message: "I'll have the website mockups ready by tomorrow",
        date: "15/01/25",
        lastMessageTime: "2025-01-15T14:30:00Z",
        unreadCount: 2,
        transactionTitle: "Website Development",
        transactionAmount: "£2,500.00",
        transactionStatus: "active",
        backgroundImage: "/group-1597880969.png",
    },
    {
        id: 2,
        transactionId: 2,
        avatar:
            "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg",
        name: "Mike Startup",
        participantEmail: "mike@startup.com",
        message: "Perfect!! The logo Looks great..",
        date: "15/01/25",
        lastMessageTime: "2025-01-14T16:45:00Z",
        unreadCount: 1,
        transactionTitle: "Logo Design Package",
        transactionAmount: "£750.00",
        transactionStatus: "completed",
        backgroundImage: "/group-1597880969-1.png",
    },
    {
        id: 3,
        transactionId: 3,
        avatar:
            "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg",
        name: "Alex Business",
        participantEmail: "alex@business.com",
        message: "When can we start the content creation?",
        date: "15/01/25",
        lastMessageTime: "2025-01-12T09:15:00Z",
        unreadCount: 0,
        transactionTitle: "Content Writing Services",
        transactionAmount: "£1,200.00",
        transactionStatus: "pending",
        backgroundImage: "/group-1597880969-2.png",
    },
];

export const Messages = (): JSX.Element => {
    const { user } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const handleChatClick = (chatId: number) => {
        setSelectedChat(chatId);
    };

    const handleBackToChatList = () => {
        setSelectedChat(null);
    };

    // Get selected chat data
    const selectedChatData = selectedChat ? chatData.find(chat => chat.id === selectedChat) : null;

    // Mock messages for selected conversation
    const messagesData = selectedChat ? [
        {
            id: 1,
            transactionId: selectedChat,
            senderId: selectedChatData?.id === 1 ? 2 : 1,
            content: "Hi! I'm excited to work on your website project.",
            isSystemMessage: false,
            flaggedAsScam: false,
            createdAt: "2025-01-15T10:00:00Z"
        },
        {
            id: 2,
            transactionId: selectedChat,
            senderId: user?.id || 1,
            content: "Great! When can we start discussing the requirements?",
            isSystemMessage: false,
            flaggedAsScam: false,
            createdAt: "2025-01-15T10:15:00Z"
        },
        {
            id: 3,
            transactionId: selectedChat,
            senderId: selectedChatData?.id === 1 ? 2 : 1,
            content: "I can start right away. Let me prepare some initial mockups first.",
            isSystemMessage: false,
            flaggedAsScam: false,
            createdAt: "2025-01-15T10:30:00Z"
        },
        {
            id: 4,
            transactionId: selectedChat,
            senderId: 0,
            content: "Escrow payment has been secured for this transaction.",
            isSystemMessage: true,
            flaggedAsScam: false,
            createdAt: "2025-01-15T11:00:00Z"
        },
        {
            id: 5,
            transactionId: selectedChat,
            senderId: selectedChatData?.id === 1 ? 2 : 1,
            content: selectedChatData?.message || "I'll have the website mockups ready by tomorrow",
            isSystemMessage: false,
            flaggedAsScam: false,
            createdAt: selectedChatData?.lastMessageTime || "2025-01-15T14:30:00Z"
        }
    ] : [];

    const filteredConversations = chatData.filter(conversation =>
        conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.transactionTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedChat) {
            try {
                // Here you would typically send the message to your API
                // await apiRequest("POST", `/api/messages`, {
                //     transactionId: selectedChat,
                //     content: newMessage.trim()
                // });
                
                toast({
                    title: "Message sent",
                    description: "Your message has been sent securely.",
                });
                setNewMessage("");
            } catch (error) {
                toast({
                    title: "Failed to send message",
                    description: error instanceof Error ? error.message : "Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleFlagMessage = async (messageId: number) => {
        try {
            // Here you would typically flag the message via API
            // await apiRequest("POST", `/api/messages/${messageId}/flag`);
            console.log("Flagging message:", messageId);
            
            toast({
                title: "Message flagged",
                description: "This message has been flagged for review.",
            });
        } catch (error) {
            toast({
                title: "Failed to flag message",
                description: error instanceof Error ? error.message : "Please try again.",
                variant: "destructive",
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-[#27ae6033] text-[#27ae60]";
            case "active":
                return "bg-[#436cc833] text-[#436cc8]";
            case "pending":
                return "bg-amber-100 text-amber-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    if (!user) {
        return <></>;
    }

    return (
        <main className="bg-[#f6f6f6] w-full flex flex-col">
            <HeaderDemo />

            {/* Mobile: Show conversation view when chat is selected */}
            {selectedChat !== null && (
                <section className="flex flex-col items-start w-full px-6 py-[72px] md:px-10 lg:hidden">
                    <div className="w-full mb-4">
                        <Button
                            variant="ghost"
                            onClick={handleBackToChatList}
                            className="inline-flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-[normal]">
                                Back to Chats
                            </span>
                        </Button>
                    </div>

                    <Card className="w-full bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a]">
                        <CardContent className="flex flex-col h-[calc(100vh-200px)] p-0">
                            <div className="flex flex-col items-center gap-3 p-3">
                                <div className="flex items-center justify-between w-full gap-2">
                                    <div className="inline-flex items-center gap-2.5">
                                        <img
                                            className="w-10 h-10 flex-shrink-0"
                                            alt={selectedChatData?.name || "Chat"}
                                            src={selectedChatData?.avatar || "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg"}
                                        />
                                        <div className="flex flex-col items-start gap-[3px] min-w-0">
                                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm tracking-[0] leading-[normal] truncate w-full">
                                                {selectedChatData?.name || "Jane Developer"}
                                            </div>
                                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs tracking-[0] leading-4 truncate w-full">
                                                {selectedChatData?.transactionTitle || "Website Development"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`${getStatusColor(selectedChatData?.transactionStatus || "active")} hover:opacity-90 h-auto px-2 py-[5px] rounded-[50px] inline-flex items-center gap-[3px] flex-shrink-0`}>
                                            {selectedChatData?.transactionStatus === "active" && (
                                                <div className="w-[6px] h-[6px] bg-current rounded-[3px]" />
                                            )}
                                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[10px] tracking-[0] leading-[9.2px] capitalize">
                                                {selectedChatData?.transactionStatus || "Active"}
                                            </span>
                                        </Badge>
                                    </div>
                                </div>
                                <img
                                    className="w-full h-px object-cover"
                                    alt="Separator"
                                    src="/separator.svg"
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-4 p-3 overflow-y-auto">
                                {selectedChat ? (
                                    <MessageThread 
                                        messages={messagesData}
                                        currentUserId={user.id}
                                        onFlagMessage={handleFlagMessage}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                                                Select a conversation to view messages
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedChat && (
                                <div className="flex flex-col items-start gap-2 p-3">
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <Textarea
                                            placeholder="Type your secure message...."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            className="flex-1 min-h-[44px] max-h-[120px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm resize-none"
                                        />
                                        <Button 
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim()}
                                            className="w-[44px] h-[44px] p-0 bg-transparent hover:bg-transparent flex-shrink-0 disabled:opacity-50"
                                        >
                                            <Send className="w-5 h-5 text-[#27ae60]" />
                                        </Button>
                                    </div>
                                    <div className="inline-flex items-center gap-[3px]">
                                        <ShieldIcon className="w-4 h-4 text-[#808080] flex-shrink-0" />
                                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[10px] tracking-[0] leading-4">
                                            Messages are encrypted and monitored for fraud protection
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}

            {/* Main Messages List View - Hidden on mobile when chat is selected */}
            <section className={`flex flex-col items-start gap-4 sm:gap-6 md:gap-[30px] w-full px-6 sm:px-8 xl:px-[107px] py-[72px] ${selectedChat !== null ? 'hidden lg:flex' : 'flex'}`}>
                <header className="flex flex-col items-start gap-4 sm:gap-6 w-full">
                    <button               
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center gap-2.5 p-0 h-auto hover:bg-transparent" 
                    aria-label="Go back"
                    >
                        <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg md:text-[22px] tracking-[0] leading-[normal]">
                            Back
                        </span>
                    </button>

                    <div className="flex flex-col items-start gap-2 sm:gap-2.5 w-full">
                        <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl md:text-5xl tracking-[0] leading-[normal]">
                            Messages
                        </h1>

                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg md:text-xl tracking-[0] leading-6 sm:leading-7 md:leading-8">
                            Communicate securely with transaction participants
                        </p>
                    </div>
                </header>

                <div className="flex flex-col items-start gap-4 sm:gap-6 md:gap-[30px] w-full">
                    <div className="flex flex-wrap lg:flex-row lg:items-center gap-4 sm:gap-6 lg:gap-[37px] w-full">
                        {statsData.map((stat, index) => {
                            // Calculate dynamic values
                            let value = stat.value;
                            if (index === 0) {
                                value = filteredConversations.length.toString().padStart(2, '0');
                            } else if (index === 2) {
                                value = filteredConversations.reduce((sum, conv) => sum + conv.unreadCount, 0).toString().padStart(2, '0');
                            }
                            
                            return (
                                <Card
                                    key={index}
                                    className="w-full lg:w-[397px] h-auto lg:h-[132px] bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]"
                                >
                                    <CardContent className="p-4 lg:p-0 h-full flex items-center">
                                        <div className="inline-flex items-center gap-4 sm:gap-5 px-4 lg:px-[31px] w-full lg:w-auto">
                                            <img
                                                className="w-12 h-12 sm:w-16 sm:h-16 lg:w-[77.14px] lg:h-[77.14px] flex-shrink-0"
                                                alt={stat.label}
                                                src={stat.icon}
                                            />

                                            <div className="flex flex-col items-start gap-[5px] flex-1 lg:flex-none">
                                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base lg:text-lg tracking-[0] leading-[normal]">
                                                    {stat.label}
                                                </div>

                                                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl lg:text-4xl leading-tight lg:leading-[38.6px] tracking-[0]">
                                                    {value}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-4 sm:gap-6 lg:gap-6 w-full">
                        <Card className="w-full lg:w-[538px] h-auto lg:h-[635px] bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a] flex-shrink-0 flex flex-col">
                            <CardContent className="p-4 lg:p-6 flex flex-col gap-4 lg:gap-6 flex-1 min-h-0 lg:overflow-hidden">
                                <div className="flex flex-col items-start gap-4 lg:gap-5 flex-shrink-0">
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg lg:text-xl tracking-[0] leading-4">
                                            Chats
                                        </h2>

                                        <Badge className="bg-[#436cc833] text-[#436cc8] hover:bg-[#436cc833] h-6 px-2.5 py-[7px] rounded-[50px]">
                                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs text-center leading-[9.2px]">
                                                {filteredConversations.length}
                                            </span>
                                        </Badge>
                                    </div>

                                    <div className="relative w-full">
                                        <SearchIcon className="absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-[#808080]" />
                                        <Input
                                            placeholder="Search chat..."
                                            aria-label="Search chats"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-[44px] lg:h-[50px] pl-12 lg:pl-[52px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm lg:text-base"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 lg:overflow-y-auto lg:min-h-0">
                                    {filteredConversations.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => handleChatClick(chat.id)}
                                            className={`relative flex flex-col h-auto lg:h-[111px] min-h-[100px] lg:min-h-[111px] items-start gap-2.5 p-4 lg:p-6 w-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#27ae60]/30 rounded-md ${chat.id === selectedChat ? "bg-[#f8f8f8]" : ""}`}
                                            aria-label={`Open chat with ${chat.name}`}
                                        >
                                            <div className="flex w-full items-center justify-between relative z-10">
                                                <img
                                                    className="w-12 h-12 lg:w-[62px] lg:h-[62px] flex-shrink-0"
                                                    alt={chat.name}
                                                    src={chat.avatar}
                                                />

                                                <div className="flex flex-col flex-1 items-end ml-3 lg:ml-5 min-w-0">
                                                    <div className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs text-right tracking-[0] leading-[normal] truncate">
                                                        {chat.date}
                                                    </div>

                                                    <div className="flex flex-col items-start gap-1.5 w-full -mt-2.5 min-w-0">
                                                        <div className="w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm lg:text-base tracking-[0] leading-[normal] truncate text-left">
                                                            {chat.name}
                                                        </div>

                                                        <div className="flex items-center justify-between w-full gap-2 min-w-0">
                                                            <div className="flex-1 min-w-0 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs lg:text-sm tracking-[0] leading-4 lg:leading-5 text-left truncate overflow-hidden">
                                                                {chat.message}
                                                            </div>

                                                            {chat.unreadCount > 0 && (
                                                                <Badge className="bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033] h-6 min-w-6 px-2.5 py-[7px] rounded-[50px] ml-2 flex-shrink-0">
                                                                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs text-center leading-[9.2px]">
                                                                        {chat.unreadCount}
                                                                    </span>
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Desktop: Show conversation view or placeholder */}
                        <Card className="hidden lg:flex flex-1 h-[635px] bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a] relative">
                            {selectedChat === null ? (
                                <>
                                    <img
                                        className="absolute top-[77px] left-0 w-full h-px object-cover"
                                        alt=""
                                        aria-hidden="true"
                                        src="/separator.svg"
                                    />
                                    <CardContent className="flex items-center justify-center h-full p-0 w-full">
                                        <div className="flex flex-col items-center gap-3.5 w-full max-w-[463px] px-4">
                                            <img
                                                className="w-[70px] h-[70px]"
                                                alt="Select conversation"
                                                src="/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-4.svg"
                                            />
                                            <div className="flex flex-col items-center gap-2.5 w-full">
                                                <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg text-center tracking-[0] leading-7">
                                                    Select a Conversation
                                                </h3>
                                                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm text-center tracking-[0] leading-[22.8px]">
                                                    Choose a conversation from the list to secure messaging
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </>
                            ) : (
                                <CardContent className="flex flex-col h-full p-0">
                                    <div className="flex flex-col items-center gap-3 sm:gap-3.5 p-3 sm:p-4 md:p-[15px_22px]">
                                        <div className="flex items-center justify-between w-full gap-2">
                                            <div className="inline-flex items-center gap-2.5 sm:gap-3.5">
                                                <img
                                                    className="w-10 h-10 sm:w-[45px] sm:h-[45px] md:w-[53px] md:h-[53px] flex-shrink-0"
                                                    alt={selectedChatData?.name || "Chat"}
                                                    src={selectedChatData?.avatar || "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg"}
                                                />
                                                <div className="flex flex-col items-start gap-[3px] sm:gap-[5px] min-w-0">
                                                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-[15px] tracking-[0] leading-[normal] truncate w-full">
                                                        {selectedChatData?.name || "Jane Developer"}
                                                    </div>
                                                    <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs tracking-[0] leading-4 sm:leading-5 truncate w-full">
                                                        {selectedChatData?.transactionTitle || "Website Development"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${getStatusColor(selectedChatData?.transactionStatus || "active")} hover:opacity-90 h-auto px-2 sm:px-2.5 py-[5px] sm:py-[7px] rounded-[50px] inline-flex items-center gap-[3px] sm:gap-[5px] flex-shrink-0`}>
                                                    {selectedChatData?.transactionStatus === "active" && (
                                                        <div className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] bg-current rounded-[3px] sm:rounded-[3.5px]" />
                                                    )}
                                                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[10px] sm:text-xs tracking-[0] leading-[9.2px] capitalize">
                                                        {selectedChatData?.transactionStatus || "Active"}
                                                    </span>
                                                </Badge>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="border-[#27ae60] text-[#27ae60] hover:bg-[#27ae60] hover:text-white h-auto px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs"
                                                    onClick={() => navigate(`/transactions/${selectedChatData?.transactionId}`)}
                                                >
                                                    <PoundSterling className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                                    View Transaction
                                                </Button>
                                            </div>
                                        </div>
                                        <img
                                            className="w-full h-px object-cover"
                                            alt="Separator"
                                            src="/separator.svg"
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col gap-4 sm:gap-6 md:gap-[30px] p-3 sm:p-4 md:p-5 overflow-y-auto">
                                        <MessageThread 
                                            messages={messagesData}
                                            currentUserId={user.id}
                                            onFlagMessage={handleFlagMessage}
                                        />
                                    </div>

                                    <div className="flex flex-col items-start gap-2 sm:gap-2.5 p-3 sm:p-4 md:p-5">
                                        <div className="flex items-center justify-between w-full gap-2 sm:gap-2.5">
                                            <Textarea
                                                placeholder="Type your secure message...."
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendMessage();
                                                    }
                                                }}
                                                className="flex-1 min-h-[44px] sm:min-h-[50px] max-h-[120px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base resize-none"
                                            />
                                            <Button 
                                                onClick={handleSendMessage}
                                                disabled={!newMessage.trim()}
                                                className="w-[44px] h-[44px] sm:w-[51px] sm:h-[50px] p-0 bg-transparent hover:bg-transparent flex-shrink-0 disabled:opacity-50"
                                            >
                                                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-[#27ae60]" />
                                            </Button>
                                        </div>
                                        <div className="inline-flex items-center gap-[3px] sm:gap-[5px]">
                                            <ShieldIcon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#808080] flex-shrink-0" />
                                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[10px] sm:text-xs tracking-[0] leading-4 sm:leading-5">
                                                Messages are encrypted and monitored for fraud protection
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
};
