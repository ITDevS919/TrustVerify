import { Header } from "../../components/Header";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { useNavigate } from "react-router-dom";
const contactSupportOptions = [
    {
        icon: "/div--flex--2.svg",
        title: "Live Chat Support",
        description: "Chat with our support team in real-time.",
        badge: "24/7",
    },
    {
        icon: "/div--flex-.svg",
        title: "Phone Support",
        description: "Speak directly with our UK support team",
        badge: "Mon-Fri, 9AM-6PM GMT",
    },
    {
        icon: "/div--flex--1.svg",
        title: "Email Support",
        description: "Send us a detailed message via email.",
        badge: "24-48 Hours response",
    },
];

const quickActions = [
    {
        icon: "/fi-8424527.svg",
        title: "User Guide",
    },
    {
        icon: "/fi-11921787.svg",
        title: "API Documentation",
    },
    {
        icon: "/fi-12592994.svg",
        title: "Security Center",
    },
    {
        icon: "/fi-8917343.svg",
        title: "Status Page",
    },
];

const supportHours = [
    {
        label: "Live Chat",
        hours: "24/7",
    },
    {
        label: "Phone Support",
        hours: "Mon-Fri 9AM-6PM",
    },
    {
        label: "Email Support",
        hours: "24-48h response",
    },
];


export const SupportCenter = (): JSX.Element => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#f6f6f6] overflow-hidden w-full flex flex-col">
            <Header />
            <section className="flex flex-col items-start gap-4 sm:gap-6 md:gap-[30px] w-full mt-8 sm:mt-10 md:mt-[72px] px-4 sm:px-8 lg:px-[110px] py-4 sm:py-6">
                <header className="flex flex-col items-start gap-4 sm:gap-6 w-full">
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2.5" 
                        aria-label="Return to Homepage"
                    >
                        <img
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            alt="Return to Homepage"
                            src="/flat-color-icons-next.svg"
                        />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-[22px] tracking-[0] leading-[normal]">
                            Return
                        </span>
                    </button>

                    <div className="flex flex-col items-start gap-2 sm:gap-2.5 w-full">
                        <h1 className="w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl tracking-[0] leading-[normal]">
                            Support Center
                        </h1>
                        <p className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl tracking-[0] leading-6 sm:leading-7 lg:leading-8">
                            Get the help you need to secure your transactions and protect your
                            business.
                        </p>
                    </div>
                </header>

                <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6 w-full">
                    <div className="flex flex-col flex-1 items-start gap-4 sm:gap-6 w-full">
                        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                            <CardContent className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-[30px] p-4 sm:p-6">
                                <div className="inline-flex items-center gap-2.5">
                                    <img
                                        className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                                        alt="Contact Support"
                                        src="/p-2-rounded-lg-bg-accent-13-3.svg"
                                    />
                                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                                        Contact Support
                                    </h2>
                                </div>

                                <div className="flex flex-col items-start gap-4 w-full">
                                    {contactSupportOptions.map((option, index) => (
                                        <div
                                            key={index}
                                            className="w-full bg-[#f6f6f6] rounded-[20px] p-4"
                                        >
                                            <div className="flex items-center gap-3 sm:gap-[13px]">
                                                <img
                                                    className="w-12 h-12 sm:w-[54px] sm:h-[54px] flex-shrink-0"
                                                    alt={option.title}
                                                    src={option.icon}
                                                />
                                                <div className="flex flex-col flex-1 items-start gap-1 min-w-0">
                                                    <div className="flex items-end justify-between w-full gap-2">
                                                        <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                            {option.title}
                                                        </h3>
                                                        <Badge className="bg-[#0b3a7833] text-[#0b3a78] text-[10px] leading-[9.2px] rounded-[528.3px] px-[9.25px] py-[5.28px] h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium hover:bg-[#0b3a7833] flex-shrink-0">
                                                            {option.badge}
                                                        </Badge>
                                                    </div>
                                                    <p className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-[normal]">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                            <CardContent className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-[30px] p-4 sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-[30px] w-full">
                                    <div className="inline-flex items-center gap-2.5">
                                        <img
                                            className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                                            alt="Create Support Ticket"
                                            src="/p-2-rounded-lg-bg-accent-13-2.svg"
                                        />
                                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                                            Create Support Ticket
                                        </h2>
                                    </div>

                                    <div className="flex flex-col items-start gap-4 sm:gap-5 w-full">
                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
                                            <div className="flex flex-col flex-1 items-start gap-2.5 w-full">
                                                <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                    Email Address
                                                </label>
                                                <Input
                                                    placeholder="Enter email"
                                                    className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base w-full"
                                                />
                                            </div>

                                            <div className="flex flex-col flex-1 items-start gap-2.5 w-full">
                                                <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                    Category
                                                </label>
                                                <Select>
                                                    <SelectTrigger className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base w-full">
                                                        <SelectValue placeholder="General Inquiry" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="general">
                                                            General Inquiry
                                                        </SelectItem>
                                                        <SelectItem value="technical">
                                                            Technical Support
                                                        </SelectItem>
                                                        <SelectItem value="billing">Billing</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
                                            <div className="flex flex-col flex-1 items-start gap-2.5 w-full">
                                                <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                    Subject
                                                </label>
                                                <Input
                                                    placeholder="Brief description of your issue"
                                                    className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base w-full"
                                                />
                                            </div>

                                            <div className="flex flex-col flex-1 items-start gap-2.5 w-full">
                                                <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                    Priority
                                                </label>
                                                <Select>
                                                    <SelectTrigger className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base w-full">
                                                        <SelectValue placeholder="Select Priority" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-start gap-2.5 w-full">
                                            <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                Description
                                            </label>
                                            <Textarea
                                                placeholder="Provide detailed description of your issue....."
                                                className="h-[120px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base resize-none w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button className="w-full h-[50px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm sm:text-base text-center tracking-[-0.20px] leading-[18px] hover:opacity-90">
                                    Create Support Ticket
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <aside className="flex flex-col w-full lg:w-[542px] items-start gap-4 sm:gap-6 lg:gap-[26px] flex-shrink-0">
                        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                            <CardContent className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-[30px] p-4 sm:p-6">
                                <div className="inline-flex items-center gap-2.5">
                                    <img
                                        className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                                        alt="Quick Actions"
                                        src="/p-2-rounded-lg-bg-accent-13-1.svg"
                                    />
                                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                                        Quick Actions
                                    </h2>
                                </div>

                                <nav className="flex flex-col items-start gap-3.5 w-full">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            className="w-full h-14 sm:h-16 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] hover:bg-[#f6f6f6] transition-colors"
                                            aria-label={action.title}
                                        >
                                            <div className="inline-flex items-center gap-3 pl-4">
                                                <img
                                                    className="w-6 h-6"
                                                    alt={action.title}
                                                    src={action.icon}
                                                />
                                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-5">
                                                    {action.title}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>

                        <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                            <CardContent className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-[30px] p-4 sm:p-6">
                                <div className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-[30px] w-full">
                                    <div className="inline-flex items-center gap-2.5">
                                        <img
                                            className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px]"
                                            alt="Support Hours"
                                            src="/p-2-rounded-lg-bg-accent-14.svg"
                                        />
                                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                                            Support Hours
                                        </h2>
                                    </div>

                                    <div className="flex flex-col items-start gap-3 sm:gap-[11px] w-full">
                                        {supportHours.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between w-full min-h-[28px]"
                                            >
                                                <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base tracking-[0] leading-5">
                                                    {item.label}
                                                </span>
                                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base text-right tracking-[0] leading-7">
                                                    {item.hours}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col items-start gap-2.5 p-4 sm:p-6 bg-[#1f4dd824] rounded-xl w-full">
                                    <div className="inline-flex flex-col items-start gap-[5px]">
                                        <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#1f4dd8] text-sm tracking-[0] leading-[normal]">
                                            All times in GMT
                                        </p>
                                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#1f4dd8] text-xs sm:text-[13px] tracking-[0] leading-[normal]">
                                            UK-based support team
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full px-6 sm:px-[31px] py-6 sm:py-[27px] bg-[#d3203024] rounded-2xl border-0">
                            <CardContent className="flex flex-col items-start gap-2.5 p-0">
                                <div className="inline-flex items-start gap-2.5">
                                    <img
                                        className="w-[20px] h-[22px] sm:w-[23px] sm:h-[25px]"
                                        alt="Emergency"
                                        src="/fi-272340.svg"
                                    />
                                    <h2 className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#d32030] text-lg sm:text-[22px] tracking-[-0.20px] leading-7">
                                        Emergency Contact
                                    </h2>
                                </div>
                                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#d32030] text-sm sm:text-lg tracking-[-0.20px] leading-6 sm:leading-7">
                                    For critical security incidents or urgent fraud reports:
                                    <br />
                                    <br />
                                    emergency@trustverify.co.uk
                                    <br />
                                    0204542733 (24/7)
                                </p>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </section>
        </div>
    );
};
