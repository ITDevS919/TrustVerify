import {
    CalendarIcon,
    CheckCircleIcon,
    ChevronUpIcon,
    ClockIcon,
    DollarSignIcon,
    EyeIcon,
    MailIcon,
    MessageCircleIcon,
    PlusIcon,
    SearchIcon,
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";
import { useState, useMemo } from "react";

interface Transaction {
    id: number;
    title: string;
    description: string;
    amount: string | number;
    currency?: string;
    status: string;
    buyerId?: number;
    sellerId?: number;
    sellerEmail?: string;
    buyerEmail?: string;
    createdAt: string;
}

const getStatusMeta = (status: string) => {
    const normalized = status?.toLowerCase();
    if (["processing", "kyc_required", "kyb_required"].includes(normalized)) {
        return { 
            text: "Processing", 
            statusColor: "bg-[#eab30833] text-yellow-500",
            statusDotColor: "bg-yellow-500",
            statusIcon: ClockIcon
        };
    }
    if (["active", "verification_approved", "escrow"].includes(normalized)) {
        return { 
            text: "Active", 
            statusColor: "bg-[#436cc833] text-[#436cc8]",
            statusDotColor: "bg-[#436cc8]",
            statusIcon: null
        };
    }
    if (normalized === "completed") {
        return { 
            text: "Completed", 
            statusColor: "bg-[#27ae6033] text-[#27ae60]",
            statusDotColor: null,
            statusIcon: CheckCircleIcon
        };
    }
    if (normalized === "disputed") {
        return { 
            text: "Disputed", 
            statusColor: "bg-red-100 text-red-500",
            statusDotColor: "bg-red-500",
            statusIcon: null
        };
    }
    return { 
        text: "Pending", 
        statusColor: "bg-[#eab30833] text-yellow-500",
        statusDotColor: null,
        statusIcon: ClockIcon
    };
};


export const SecureTransactions = (): JSX.Element => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch user's transactions
    const { data: transactionsData, isLoading: loadingTransactions } = useQuery<{ transactions: Transaction[] }>({
        queryKey: ["transactions", user?.id],
        queryFn: async () => {
            const response = await fetch("/api/transactions?page=1&limit=50", {
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch transactions");
            return response.json();
        },
        enabled: !!user,
        refetchOnWindowFocus: true,
    });

    const transactions = transactionsData?.transactions ?? [];

    // Filter transactions by search query
    const filteredTransactions = useMemo(() => {
        if (!searchQuery.trim()) return transactions;
        const query = searchQuery.toLowerCase();
        return transactions.filter(t => 
            t.title?.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query) ||
            t.sellerEmail?.toLowerCase().includes(query) ||
            t.buyerEmail?.toLowerCase().includes(query)
        );
    }, [transactions, searchQuery]);

    const formatCurrency = (amount: string | number, currency: string = "USD") => {
        if (typeof amount === 'number') {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency 
            }).format(amount);
        }
        return amount;
    };

    return (
        <main className="bg-[#f6f6f6] w-full flex flex-col">
           <Header />
            <section className="flex flex-col items-start gap-4 md:gap-[30px] w-full max-w-[1783px] mx-auto px-6 py-[72px] md:px-10">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-0">
                    <div className="flex flex-col items-start gap-2.5 w-full md:max-w-[601px]">
                        <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl md:text-5xl tracking-[0] leading-normal">
                            Secure Transactions
                        </h1>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base md:text-xl tracking-[0] leading-6 md:leading-8">
                            Monitor and manage your protected transactions
                        </p>
                    </div>

                    <Button 
                        onClick={() => navigate("/transactions/new")}
                        aria-label="Create new transaction"
                        className="w-full md:w-auto h-12 md:h-14 px-6 rounded-[10px] bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-white text-base md:text-lg tracking-[-0.20px] leading-[18px]">
                            New Transaction
                        </span>
                    </Button>
                </header>

                <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col items-start gap-4 md:gap-6 w-full">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-4 md:gap-0">
                                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl md:text-2xl tracking-[0] leading-6">
                                    My Transactions
                                </h2>

                                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 w-full md:w-auto">
                                    <div className="relative w-full md:w-[497px]">
                                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
                                        <Input
                                            placeholder="Search transactions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-[50px] pl-[52px] pr-5 bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                                        />
                                    </div>

                                    <Button
                                        variant="ghost"
                                        className="h-[50px] w-full md:w-[132px] bg-[#f2f2f2] rounded-[10px] hover:bg-[#e8e8e8]"
                                    >
                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-sm tracking-[0] leading-5">
                                            All Status
                                        </span>
                                        <ChevronUpIcon className="w-[18px] h-[18px] text-[#808080]" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-4 w-full">
                                {loadingTransactions ? (
                                    <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3778]" />
                                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                                            Loading transactions...
                                        </p>
                                    </div>
                                ) : filteredTransactions.length === 0 ? (
                                    <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
                                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl">
                                            {searchQuery ? "No transactions found matching your search." : "No transactions yet. Create a new transaction to get started."}
                                        </p>
                                    </div>
                                ) : (
                                    filteredTransactions.map((transaction) => {
                                        const statusMeta = getStatusMeta(transaction.status);
                                        const StatusIcon = statusMeta.statusIcon;
                                        const isBuyer = transaction.buyerId === user?.id;
                                        const recipientEmail = isBuyer ? transaction.sellerEmail : transaction.buyerEmail;
                                        
                                        return (
                                            <Card
                                                key={transaction.id}
                                                className="w-full rounded-[20px] border border-solid border-[#e4e4e4]"
                                            >
                                                <CardContent className="p-4 md:p-6">
                                                    <div className="flex flex-col items-end gap-2.5 w-full">
                                                        <div className="flex flex-col items-start gap-4 md:gap-6 w-full">
                                                            <div className="flex flex-col items-start gap-3 w-full">
                                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2 sm:gap-0">
                                                                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl md:text-2xl tracking-[0] leading-6">
                                                                        {transaction.title}
                                                                    </h3>

                                                                    <Badge
                                                                        className={`inline-flex items-center justify-center gap-[5px] px-2.5 py-1.5 rounded-[50px] ${statusMeta.statusColor}`}
                                                                    >
                                                                        {statusMeta.statusDotColor && (
                                                                            <div
                                                                                className={`w-[9px] h-[9px] rounded-[4.5px] ${statusMeta.statusDotColor}`}
                                                                            />
                                                                        )}
                                                                        {StatusIcon && (
                                                                            <StatusIcon className="w-3 h-3" />
                                                                        )}
                                                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm tracking-[0] leading-normal">
                                                                            {statusMeta.text}
                                                                        </span>
                                                                    </Badge>
                                                                </div>

                                                                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base md:text-lg tracking-[0] leading-6">
                                                                    {transaction.description}
                                                                </p>
                                                            </div>

                                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[50px] w-full">
                                                                <div className="inline-flex items-center gap-2.5">
                                                                    <DollarSignIcon className="w-6 h-6 md:w-7 md:h-7 text-[#808080]" />
                                                                    <div className="inline-flex items-center gap-2.5">
                                                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base md:text-lg tracking-[0] leading-6">
                                                                            Amount:
                                                                        </span>
                                                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base md:text-lg tracking-[0] leading-6">
                                                                            {formatCurrency(transaction.amount, transaction.currency)}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {recipientEmail && (
                                                                    <div className="inline-flex items-center gap-2.5">
                                                                        <MailIcon className="w-6 h-6 md:w-7 md:h-7 text-[#808080]" />
                                                                        <div className="inline-flex items-center gap-2.5 flex-wrap">
                                                                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base md:text-lg tracking-[0] leading-6">
                                                                                Recipient:
                                                                            </span>
                                                                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base md:text-lg tracking-[0] leading-6 break-all">
                                                                                {recipientEmail}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div className="inline-flex items-center gap-2.5">
                                                                    <CalendarIcon className="w-6 h-6 md:w-7 md:h-7 text-[#808080]" />
                                                                    <div className="inline-flex items-center gap-2.5">
                                                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-base md:text-lg tracking-[0] leading-6">
                                                                            Created:
                                                                        </span>
                                                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base md:text-lg tracking-[0] leading-6">
                                                                            {new Date(transaction.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                                            <Button 
                                                                onClick={() => navigate(`/transactions/${transaction.id}`)}
                                                                className="w-full sm:w-[184px] h-[46px] bg-app-primary rounded-lg hover:opacity-90"
                                                            >
                                                                <EyeIcon className="w-[18px] h-[18px]" />
                                                                <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-base tracking-[-0.20px] leading-[18px]">
                                                                    View Details
                                                                </span>
                                                            </Button>

                                                            <Button
                                                                onClick={() => navigate(`/messages/${transaction.id}`)}
                                                                variant="outline"
                                                                className="w-full sm:w-[174px] h-[46px] rounded-lg border border-solid border-[#0b3a78] hover:bg-[#0b3a78]/5"
                                                            >
                                                                <MessageCircleIcon className="w-[15px] h-[15px] text-app-primary" />
                                                                <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-app-primary text-base tracking-[-0.20px] leading-[18px]">
                                                                    Chat
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
};