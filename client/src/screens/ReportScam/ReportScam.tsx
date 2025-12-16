import {
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    EyeIcon,
    SearchIcon,
} from "lucide-react";
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
import { Header } from "../../components/Header";
import { useNavigate } from "react-router-dom";
const navigationItems = [
    { label: "Demo", isActive: true },
    { label: "Business", isActive: false },
    { label: "Developers", isActive: false },
    { label: "Pricing", isActive: false },
    { label: "Support", isActive: false },
];

const communityReports = [
    {
        type: "Payment Fraud",
        status: "Verified",
        statusColor: "bg-[#27ae6033] text-[#27ae60]",
        date: "15/01/25",
        description:
            "Received payment but never delivered the promised digital goods. Communication with him but norespond.....",
        contact: "fake.seller@gmail.com",
        amount: "$250.00",
        icon: CheckCircleIcon,
    },
    {
        type: "Identity Theft",
        status: "Investigating",
        statusColor: "bg-[#0b3a7833] text-[#0b3a78]",
        date: "15/01/25",
        description:
            "Attempted to steal personal information by impersonating TrustVerify support staff....",
        contact: "Phone: +1-223-3241",
        amount: null,
        icon: ClockIcon,
    },
];

const safetyTips = [
    {
        title: "Verify Identities",
        description: "Always check verification status before transaction",
    },
    {
        title: "Use Escrow Protection",
        description: "Never send payments outside secure system",
    },
    {
        title: "Use Escrow Protection",
        description: "Never send payments outside secure system",
    },
];

export const ReportScam = (): JSX.Element => {
    const navigate = useNavigate();
    return (
        <div className="bg-[#f6f6f6] w-full flex flex-col">
            <Header />
            <section className="flex flex-col w-full gap-4 sm:gap-6 md:gap-[30px] px-4 sm:px-8 lg:px-[107px] py-4 sm:py-6 md:py-[72px]">
                <div className="flex flex-col gap-4 sm:gap-6 w-full">
                    <button 
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2.5 p-0 h-auto hover:bg-transparent" 
                        aria-label="Return"
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

                    <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
                        <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl tracking-[0] leading-[normal]">
                            Report Scam
                        </h1>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl tracking-[0] leading-6 sm:leading-7 lg:leading-8">
                            Help protect the community by reporting fraudulent activities.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
                    <Card className="flex-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4] w-full">
                        <CardContent className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 lg:gap-[30px]">
                            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-[30px]">
                                <div className="flex items-center gap-2.5">
                                    <img
                                        className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] flex-shrink-0"
                                        alt="Report Icon"
                                        src="/p-2-rounded-lg-bg-accent-17-1.svg"
                                    />
                                    <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                                            Report Fraudulent Acitivity
                                        </h2>
                                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base tracking-[0] leading-6">
                                            Provide detailed information about the scam or fraudulent
                                            behaviour
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 sm:gap-5">
                                    <div className="flex flex-col gap-2.5">
                                        <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                            Select Scam Type
                                        </label>
                                        <Select>
                                            <SelectTrigger className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base">
                                                <SelectValue
                                                    placeholder="Select type"
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="payment-fraud">
                                                    Payment Fraud
                                                </SelectItem>
                                                <SelectItem value="identity-theft">
                                                    Identity Theft
                                                </SelectItem>
                                                <SelectItem value="phishing">Phishing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                            Scammer Information
                                        </label>
                                        <Input
                                            placeholder="Email, phone, username etc"
                                            className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                                        />
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <div className="flex flex-col gap-2.5 flex-1">
                                            <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                    Amount Lost
                                                </span>
                                                <span className="text-xs sm:text-[13px]"> (Optional)</span>
                                            </label>
                                            <Input
                                                placeholder="$0.00"
                                                className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2.5 flex-1">
                                            <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                Date Occurred
                                            </label>
                                            <div className="relative">
                                                <Input
                                                    type="date"
                                                    placeholder="Select Date"
                                                    className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                                                />
                                                {/* <CalendarIcon className="absolute right-5 top-1/2 -translate-y-1/2 w-[19px] h-[19px] text-[#808080]" /> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                            Description
                                        </label>
                                        <Textarea
                                            placeholder="Provide detailed description of your issue....."
                                            className="min-h-[120px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button className="h-[50px] w-full rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm sm:text-base tracking-[-0.20px] leading-[18px]">
                                Continue To Evidence
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-[542px] flex-shrink-0">
                        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
                            <CardContent className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 lg:gap-[30px]">
                                <div className="flex flex-col gap-4 sm:gap-6">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] flex-shrink-0"
                                            alt="Community Reports Icon"
                                            src="/p-2-rounded-lg-bg-accent-16.svg"
                                        />
                                        <div className="flex flex-col gap-[5px] flex-1 min-w-0">
                                            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                                                Community Reports
                                            </h2>
                                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base tracking-[0] leading-6">
                                                Report scam reports from the community
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <SearchIcon className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#808080]" />
                                        <Input
                                            placeholder="Search reports..."
                                            aria-label="Search reports"
                                            className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] pl-10 sm:pl-12 pr-5 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {communityReports.map((report, index) => (
                                        <Card
                                            key={index}
                                            className="rounded-xl border border-[#ececec]"
                                        >
                                            <CardContent className="p-4 flex flex-col gap-4 sm:gap-5">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-3 sm:gap-4">
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                                            <div className="inline-flex items-center gap-2 sm:gap-2.5 flex-wrap">
                                                                <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                                    {report.type}
                                                                </span>
                                                                <Badge
                                                                    className={`inline-flex items-center justify-center gap-[5px] px-2.5 py-[7px] ${report.statusColor} rounded-[50px] h-auto flex-shrink-0`}
                                                                >
                                                                    <report.icon className="w-2.5 h-2.5" />
                                                                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs text-center tracking-[0] leading-[9.2px]">
                                                                        {report.status}
                                                                    </span>
                                                                </Badge>
                                                            </div>
                                                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs sm:text-sm tracking-[0] leading-6">
                                                                {report.date}
                                                            </span>
                                                        </div>

                                                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                                                            {report.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#e24843] text-sm tracking-[0] leading-6 break-words">
                                                            {report.contact}
                                                        </span>
                                                        {report.amount && (
                                                            <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#808080] text-base sm:text-lg tracking-[0] leading-6">
                                                                {report.amount}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <Button className="h-10 w-full bg-app-primary hover:bg-app-primary/90 rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-xs tracking-[-0.20px] leading-[18px]">
                                                    <EyeIcon className="w-4 h-4 mr-[5px]" />
                                                    View Details
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4]">
                            <CardContent className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 lg:gap-[30px]">
                                <div className="inline-flex items-center gap-2.5">
                                    <img
                                        className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] flex-shrink-0"
                                        alt="Safety Tips Icon"
                                        src="/p-2-rounded-lg-bg-accent-16-2.svg"
                                    />
                                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg sm:text-xl tracking-[0] leading-6">
                                        Safety Tips
                                    </h2>
                                </div>

                                <div className="flex flex-col gap-4 sm:gap-5">
                                    {safetyTips.map((tip, index) => (
                                        <div key={index} className="flex flex-col gap-[5px]">
                                            <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-sm sm:text-base tracking-[0] leading-6">
                                                {tip.title}
                                            </h3>
                                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                                                {tip.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};
