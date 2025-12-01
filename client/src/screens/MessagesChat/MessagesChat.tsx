import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { SearchIcon } from "lucide-react";
import { ShieldIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../components/ui/navigation-menu";
import { HeaderDemo } from "../../components/HeaderDemo";

interface MessagesChatProps {
    onBack?: () => void;
}

const chatListData = [
    {
        id: 1,
        name: "Jane Developer",
        message: "I'll have the website mockups ready by tomorrow",
        date: "15/01/25",
        avatar:
            "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg",
        unreadCount: 2,
        isActive: true,
        backgroundImage: "/group-1597880969.png",
    },
    {
        id: 2,
        name: "Mike Startup",
        message: "Perfect!! The logo Looks great..",
        date: "15/01/25",
        avatar:
            "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg",
        unreadCount: 1,
        isActive: false,
        backgroundImage: "/group-1597880969-1.png",
    },
    {
        id: 3,
        name: "Alex Business",
        message: "When can we start the content creation?",
        date: "15/01/25",
        avatar:
            "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-1.svg",
        unreadCount: 0,
        isActive: false,
        backgroundImage: "/group-1597880969-2.png",
    },
];

const messagesData = [
    {
        id: 1,
        text: "Hi, I'm excited to work on your website project.",
        time: "Sat 5:10 AM",
        isOwn: false,
    },
    {
        id: 2,
        text: "Great when can we start discussing the requirements?",
        time: "Sun 10:00 AM",
        isOwn: true,
    },
    {
        id: 3,
        text: "I can start right away. Let me prepare some initial mockups first.",
        time: "06 Sep, 2:00 PM",
        isOwn: false,
    },
];

const navigationItems = [
    { label: "Demo", isActive: true },
    { label: "Business", isActive: false },
    { label: "Developers", isActive: false },
    { label: "Pricing", isActive: false },
    { label: "Support", isActive: false },
  ];

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

export const MessagesChat = ({ onBack }: MessagesChatProps = {}): JSX.Element => {
    const navigate = useNavigate();
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate("/messages");
        }
    };

    const handleChatClick = (chatId: number) => {
        setSelectedChatId(chatId);
    };

    const handleBackToChatList = () => {
        setSelectedChatId(null);
    };

    // Get selected chat data
    const selectedChat = selectedChatId ? chatListData.find(chat => chat.id === selectedChatId) : null;

    return (
        <div className="bg-[#f6f6f6] w-full flex flex-col">
            <HeaderDemo />
            
            {/* Mobile: Show chat list view when no chat is selected */}
            <section className={`flex flex-col items-start gap-4 md:gap-6 md:gap-[30px] w-full px-4 md:px-8 md:px-[110px] py-4 md:py-6 ${selectedChatId !== null ? 'hidden lg:flex' : ''}`}>
                <header className="flex flex-col items-start gap-4 sm:gap-6 w-full">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="inline-flex items-center gap-2.5 p-0 h-auto hover:bg-transparent"
                    >
                        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg md:text-[22px] tracking-[0] leading-[normal]">
                            Back
                        </span>
                    </Button>

                    <div className="flex flex-col items-start gap-2 sm:gap-2.5 w-full">
                        <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl md:text-5xl tracking-[0] leading-[normal]">
                            Messages
                        </h1>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg md:text-xl tracking-[0] leading-6 sm:leading-7 md:leading-8">
                            Communicate securely with transaction participants
                        </p>
                    </div>
                </header>

                <div className="flex flex-col items-start gap-4 md:gap-6 md:gap-[30px] w-full">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 md:gap-[37px] w-full">
                        {statsData.map((stat, index) => (
                            <Card
                                key={index}
                                className="w-full md:w-[calc(50%-12px)] md:w-[397px] h-auto md:h-[132px] bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]"
                            >
                                <CardContent className="flex items-center gap-4 md:gap-5 h-full p-4 md:p-0 justify-center">
                                    <img
                                        className="w-12 h-12 md:w-16 md:h-16 lg:w-[77.14px] lg:h-[77.14px] flex-shrink-0"
                                        alt={stat.label}
                                        src={stat.icon}
                                    />
                                    <div className="flex flex-col items-start gap-[5px] flex-1 md:flex-none">
                                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-[normal]">
                                            {stat.label}
                                        </div>
                                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-4xl tracking-[0] leading-tight md:leading-[38.6px]">
                                            {stat.value}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex flex-col lg:flex-row items-stretch lg:items-start gap-4 sm:gap-6 w-full">
                        {/* Chat List - Always visible in this view */}
                        <Card className="w-full lg:w-[538px] bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a]">
                            <CardContent className="flex flex-col items-center gap-4 sm:gap-6 p-4 sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:gap-5 w-full">
                                    <div className="flex items-center justify-between w-full">
                                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-4">
                                            Chats
                                        </h2>
                                        <Badge className="bg-[#436cc833] text-[#436cc8] hover:bg-[#436cc833] h-auto px-2.5 py-[7px] rounded-[50px]">
                                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
                                                3
                                            </span>
                                        </Badge>
                                    </div>

                                    <div className="relative w-full">
                                        <SearchIcon className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808080]" />
                                        <Input
                                            placeholder="SearchIcon Chat..."
                                            className="h-[44px] sm:h-[50px] pl-12 sm:pl-12 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col items-start w-full">
                                    {chatListData.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => handleChatClick(chat.id)}
                                            className={`flex flex-col items-start gap-2.5 p-4 sm:p-6 w-full relative ${chat.id === selectedChatId
                                                ? "bg-[#f8f8f8] border-l-[3px] [border-left-style:solid] [border-image:linear-gradient(118deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)_1]"
                                                : ""
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full relative z-10">
                                                <img
                                                    className="w-12 h-12 sm:w-[62px] sm:h-[62px] flex-shrink-0"
                                                    alt={chat.name}
                                                    src={chat.avatar}
                                                />
                                                <div className="flex flex-col items-end flex-1 ml-3 min-w-0">
                                                    <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs text-right tracking-[0] leading-[normal] w-full truncate">
                                                        {chat.date}
                                                    </div>
                                                    <div className="flex flex-col items-start gap-1.5 w-full -mt-2.5 min-w-0">
                                                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-[normal] w-full truncate text-left">
                                                            {chat.name}
                                                        </div>
                                                        <div className="flex items-center justify-between w-full gap-2 min-w-0">
                                                            <div className="flex-1 min-w-0 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-4 sm:leading-5 text-left truncate overflow-hidden">
                                                                {chat.message}
                                                            </div>
                                                            {chat.unreadCount > 0 && (
                                                                <Badge className="bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033] h-auto px-2.5 py-[7px] rounded-[50px] ml-2 flex-shrink-0">
                                                                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px]">
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

                        {/* Chat Conversation - Always visible on desktop, hidden on mobile in list view */}
                        <Card className="hidden lg:flex w-full lg:flex-1 bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a]">
                            <CardContent className="flex flex-col h-[500px] sm:h-[600px] lg:h-[807px] p-0">
                                <div className="flex flex-col items-center gap-3 sm:gap-3.5 p-3 sm:p-4 md:p-[15px_22px]">
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <div className="inline-flex items-center gap-2.5 sm:gap-3.5">
                                            <img
                                                className="w-10 h-10 sm:w-[45px] sm:h-[45px] md:w-[53px] md:h-[53px] flex-shrink-0"
                                                alt="Jane Developer"
                                                src="/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar.svg"
                                            />
                                            <div className="flex flex-col items-start gap-[3px] sm:gap-[5px] min-w-0">
                                                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-[15px] tracking-[0] leading-[normal] truncate w-full">
                                                    Jane Developer
                                                </div>
                                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs tracking-[0] leading-4 sm:leading-5 truncate w-full">
                                                    Website Development
                                                </div>
                                            </div>
                                        </div>
                                        <Badge className="bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033] h-auto px-2 sm:px-2.5 py-[5px] sm:py-[7px] rounded-[50px] inline-flex items-center gap-[3px] sm:gap-[5px] flex-shrink-0">
                                            <div className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] bg-[#27ae60] rounded-[3px] sm:rounded-[3.5px]" />
                                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[10px] sm:text-xs tracking-[0] leading-[9.2px]">
                                                Active
                                            </span>
                                        </Badge>
                                    </div>
                                    <img
                                        className="w-full h-px object-cover"
                                        alt="Separator"
                                        src="/separator.svg"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col gap-4 sm:gap-6 md:gap-[30px] p-3 sm:p-4 md:p-5 overflow-y-auto">
                                    {messagesData.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex flex-col gap-2 sm:gap-[11px] ${message.isOwn ? "items-end" : "items-start"
                                                }`}
                                        >
                                            <div
                                                className={`flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-[19px] max-w-[85%] sm:max-w-[400px] md:max-w-[524px] ${message.isOwn
                                                    ? "bg-app-primary text-white rounded-[10px_10px_0px_10px]"
                                                    : "bg-neutral-100 text-[#003d2b] rounded-[10px_10px_10px_0px]"
                                                    }`}
                                            >
                                                <div
                                                    className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm sm:text-base tracking-[0] leading-[normal] ${message.isOwn ? "text-white" : "text-[#003d2b]"
                                                        } break-words`}
                                                >
                                                    {message.text}
                                                </div>
                                            </div>
                                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-glare-gray text-[10px] sm:text-[11px] tracking-[0] leading-[normal]">
                                                {message.time}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col items-start gap-2 sm:gap-2.5 p-3 sm:p-4 md:p-5">
                                    <div className="flex items-center justify-between w-full gap-2 sm:gap-2.5">
                                        <Input
                                            placeholder="Type your secure message...."
                                            className="flex-1 h-[44px] sm:h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                                        />
                                        <Button className="w-[44px] h-[44px] sm:w-[51px] sm:h-[50px] p-0 bg-transparent hover:bg-transparent flex-shrink-0">
                                            <img
                                                className="w-full h-full"
                                                alt="Send"
                                                src="/frame-1000008618.svg"
                                            />
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
                        </Card>
                    </div>
                </div>
            </section>

            {/* Mobile: Show conversation view when chat is selected */}
            <section className={`flex flex-col items-start w-full px-4 py-4 ${selectedChatId === null ? 'hidden lg:hidden' : 'lg:hidden'}`}>
                <div className="w-full mb-4">
                    <Button
                        variant="ghost"
                        onClick={handleBackToChatList}
                        className="inline-flex items-center gap-2 p-0 h-auto hover:bg-transparent"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
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
                                        alt={selectedChat?.name || "Chat"}
                                        src={selectedChat?.avatar || "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar.svg"}
                                    />
                                    <div className="flex flex-col items-start gap-[3px] min-w-0">
                                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm tracking-[0] leading-[normal] truncate w-full">
                                            {selectedChat?.name || "Jane Developer"}
                                        </div>
                                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs tracking-[0] leading-4 truncate w-full">
                                            Website Development
                                        </div>
                                    </div>
                                </div>
                                <Badge className="bg-[#27ae6033] text-[#27ae60] hover:bg-[#27ae6033] h-auto px-2 py-[5px] rounded-[50px] inline-flex items-center gap-[3px] flex-shrink-0">
                                    <div className="w-[6px] h-[6px] bg-[#27ae60] rounded-[3px]" />
                                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[10px] tracking-[0] leading-[9.2px]">
                                        Active
                                    </span>
                                </Badge>
                            </div>
                            <img
                                className="w-full h-px object-cover"
                                alt="Separator"
                                src="/separator.svg"
                            />
                        </div>

                        <div className="flex-1 flex flex-col gap-4 p-3 overflow-y-auto">
                            {messagesData.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex flex-col gap-2 ${message.isOwn ? "items-end" : "items-start"
                                        }`}
                                >
                                    <div
                                        className={`flex items-center gap-2 px-3 py-3 max-w-[85%] ${message.isOwn
                                            ? "bg-app-primary text-white rounded-[10px_10px_0px_10px]"
                                            : "bg-neutral-100 text-[#003d2b] rounded-[10px_10px_10px_0px]"
                                            }`}
                                    >
                                        <div
                                            className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-[normal] ${message.isOwn ? "text-white" : "text-[#003d2b]"
                                                } break-words`}
                                        >
                                            {message.text}
                                        </div>
                                    </div>
                                    <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-glare-gray text-[10px] tracking-[0] leading-[normal]">
                                        {message.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-start gap-2 p-3">
                            <div className="flex items-center justify-between w-full gap-2">
                                <Input
                                    placeholder="Type your secure message...."
                                    className="flex-1 h-[44px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm"
                                />
                                <Button className="w-[44px] h-[44px] p-0 bg-transparent hover:bg-transparent flex-shrink-0">
                                    <img
                                        className="w-full h-full"
                                        alt="Send"
                                        src="/frame-1000008618.svg"
                                    />
                                </Button>
                            </div>
                            <div className="inline-flex items-center gap-[3px]">
                                <ShieldIcon className="w-4 h-4 text-[#808080] flex-shrink-0" />
                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[10px] tracking-[0] leading-4">
                                    Messages are encrypted and monitored for fraud protection
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};
