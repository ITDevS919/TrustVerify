import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { HeaderDemo } from "../../components/HeaderDemo";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  ChevronLeft,
  Plus,
  ArrowRightLeft,
  Zap,
  Upload,
  MessageSquare,
  OctagonAlert,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Transaction = {
  id: number;
  title: string;
  amount: string;
  status: string;
  buyerId: number;
  sellerId: number;
  createdAt: string;
  updatedAt: string;
};

type TransactionsResponse = {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total?: number;
  };
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  }).format(value);

const getStatusMeta = (status: string) => {
  const normalized = status?.toLowerCase();
  if (["processing", "kyc_required", "kyb_required"].includes(normalized)) {
    return { text: "Processing", bgColor: "bg-[#eab30833]", textColor: "text-yellow-500" };
  }
  if (["active", "verification_approved", "escrow"].includes(normalized)) {
    return { text: "Active", bgColor: "bg-[#0b3a7833]", textColor: "text-[#0b3a78]" };
  }
  if (normalized === "completed") {
    return { text: "Completed", bgColor: "bg-[#27ae6033]", textColor: "text-[#27ae60]" };
  }
  if (normalized === "disputed") {
    return { text: "Disputed", bgColor: "bg-red-100", textColor: "text-red-500" };
  }
  return { text: "Pending", bgColor: "bg-[#eab30833]", textColor: "text-yellow-500" };
};

const securityFeatures = [
  {
    icon: "/2fa.png",
    title: "Two Factor Authentication",
    description: "Enhanced Account Security",
  },
  {
    icon: "/global_fraud.png",
    title: "Global Fraud Detection",
    description: "Real-time Protection",
  },
  {
    icon: "/encrypt.png",
    title: "Encrypted Communications",
    description: "End-to-end Security",
  },
];

type RecentTransactionUI = {
  icon: string;
  title: string;
  date: string;
  amount: string;
  status: {
    text: string;
    bgColor: string;
    textColor: string;
  };
  id?: number;
};


export const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: transactionsData,
    isLoading: loadingTransactions,
  } = useQuery<TransactionsResponse>({
    queryKey: ["/api/transactions", { page: 1, limit: 20 }],
    queryFn: async () => {
      const response = await fetch("/api/transactions?page=1&limit=20", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      return response.json();
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const transactions = transactionsData?.transactions ?? [];

  const stats = useMemo(() => {
    if (!transactions.length) {
      return {
        activeTransactions: 0,
        completedTransactions: 0,
        totalEscrow: "£0.00",
        trustScore: Number(user?.trustScore ?? 0),
      };
    }

    const active = transactions.filter((t) =>
      ["pending", "active", "processing", "kyc_required", "kyb_required", "aml_check", "verification_approved", "escrow"].includes(
        t.status?.toLowerCase() || ""
      )
    ).length;

    const completed = transactions.filter((t) => t.status?.toLowerCase() === "completed").length;

    const totalEscrowValue = transactions
      .filter((t) => ["escrow", "active"].includes(t.status?.toLowerCase() || ""))
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      activeTransactions: active,
      completedTransactions: completed,
      totalEscrow: formatCurrency(totalEscrowValue),
      trustScore: Number(user?.trustScore ?? 0),
    };
  }, [transactions, user?.trustScore]);

  const recentTransactions: RecentTransactionUI[] = useMemo(() => {
    if (!transactions.length) {
      return [
        {
          icon: "/ecommerce.png",
          title: "E-commerce Purchase",
          date: "18/04/2025",
          amount: "£2,500.00",
          status: {
            text: "Processing",
            bgColor: "bg-[#eab30833]",
            textColor: "text-yellow-500",
          },
        },
        {
          icon: "/digital.png",
          title: "Digital Marketing Services - UK",
          date: "15/01/2025",
          amount: "£1,125.00",
          status: {
            text: "Active",
            bgColor: "bg-[#0b3a7833]",
            textColor: "text-[#0b3a78]",
          },
        },
        {
          icon: "/website.png",
          title: "Website Development - London",
          date: "10/01/2025",
          amount: "£2,062.00",
          status: {
            text: "Completed",
            bgColor: "bg-[#27ae6033]",
            textColor: "text-[#27ae60]",
          },
        },
      ];
    }

    return transactions.slice(0, 3).map((transaction) => {
      const statusMeta = getStatusMeta(transaction.status);
      return {
        icon: "/ecommerce.png",
        title: transaction.title || `Transaction #${transaction.id}`,
        date: new Date(transaction.createdAt).toLocaleDateString("en-GB"),
        amount: formatCurrency(Number(transaction.amount || 0)),
        status: statusMeta,
        id: transaction.id,
      };
      
    });
  }, [transactions]);


  return (
    <main className="bg-white overflow-hidden w-full relative">
      <HeaderDemo />
      <section className="w-full flex items-center justify-center px-6 sm:px-10 xl:px-20 2xl:px-28 py-[72px]">
        <div className="flex flex-col items-end gap-[30px] w-full">
          <div className="flex flex-col items-start gap-6 w-full">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="flex items-center justify-center gap-2.5 p-0 hover:bg-transparent"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[22px] tracking-[0] leading-[normal]">
                Return to Homepage
              </span>
            </Button>

            <div className="flex flex-col items-start gap-2.5 w-full">
              <h1 className="flex items-center w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-5xl tracking-[0] leading-[normal]">
                Security Dashboard
              </h1>
              <p className="flex items-center w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
                Real-time fraud protection with AI-powered transaction monitoring
                and advanced threat detection
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-[37px] w-full">
                <Card
                  className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] flex items-center justify-center border-solid border-[#e4e4e4]"
                >
                  <CardContent className="p-[31px] w-full h-full flex items-start justify-center gap-5">
                    <img
                      className="w-[74px] h-[74px] flex-shrink-0"
                    alt="Active Transactions"
                    src="/active_transaction.png"
                    />
                    <div className="flex flex-col items-start gap-5 flex-1">
                      <div className="flex flex-col items-start gap-[5px] w-full">
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[normal] tracking-[0]">
                        Active Transactions
                        </div>
                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl tracking-[0] leading-[38.6px]">
                          {stats.activeTransactions.toString().padStart(2, "0")}
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-[5px]">
                      <div className="w-[7px] h-[7px] rounded-[3.5px] bg-[#436cc8]" />
                      <div className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-center tracking-[0] leading-[14px] whitespace-nowrap text-[#436cc8]">
                        Live Processing
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] flex items-center justify-center border-solid border-[#e4e4e4]"
              >
                <CardContent className="p-[31px] w-full h-full flex items-start justify-center gap-5">
                  <img
                    className="w-[74px] h-[74px] flex-shrink-0"
                    alt="Completed Transactions"
                    src="/completed_transaction.png"
                          />
                  <div className="flex flex-col items-start gap-5 flex-1">
                    <div className="flex flex-col items-start gap-[5px] w-full">
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[normal] tracking-[0]">
                        Completed Transactions
                        </div>
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl tracking-[0] leading-[38.6px]">
                        {stats.completedTransactions.toString().padStart(2, "0")}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        className="w-[22px] h-[21px]"
                        alt="Trend"
                        src="/fi-5592518.svg"
                      />
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[normal]">
                        <span className={stats.completedTransactions ? "text-[#27ae60]" : "text-[#808080]"}>
                          {stats.completedTransactions ? "Completed" : "Pending"}
                        </span>
                        <span className="text-[#808080]">
                          {stats.completedTransactions ? " Total completions" : " awaiting activity"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] flex items-center justify-center border-solid border-[#e4e4e4]"
              >
                <CardContent className="p-[31px] w-full h-full flex items-start justify-center gap-5">
                  <img
                    className="w-[74px] h-[74px] flex-shrink-0"
                    alt="Total In Escrow"
                    src="/total_escrow.png"
                  />
                  <div className="flex flex-col items-start gap-5 flex-1">
                    <div className="flex flex-col items-start gap-[5px] w-full">
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[normal] tracking-[0]">
                        Total In Escrow
                      </div>
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl tracking-[0] leading-[38.6px]">
                        {stats.totalEscrow}
                      </div>
                    </div>
                        <div className="flex items-center gap-2">
                          <img
                            className="w-[22px] h-[21px]"
                            alt="Trend"
                        src="/fi-5592519.svg"
                          />
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm tracking-[0] leading-[normal]">
                        <span className={transactions.length ? "text-[#d094dd]" : "text-[#808080]"}>
                          {transactions.length ? "Realtime" : "Sample"}
                            </span>
                            <span className="text-[#808080]">
                          {" "}data
                            </span>
                          </div>
                        </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] flex items-center justify-center border-solid border-[#e4e4e4]"
              >
                <CardContent className="p-[31px] w-full h-full flex items-start justify-center gap-5">
                  <img
                    className="w-[74px] h-[74px] flex-shrink-0"
                    alt="Trust Score"
                    src="/trust_score.png"
                  />
                  <div className="flex flex-col items-start gap-5 flex-1">
                    <div className="flex flex-col items-start gap-[5px] w-full">
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg leading-[normal] tracking-[0]">
                        Trust Score
                      </div>
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl tracking-[0] leading-[38.6px]">
                        {(stats.trustScore ?? 0).toFixed(2)}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-[5px]">
                      <div className="w-[7px] h-[7px] rounded-[3.5px] bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]" />
                      <div className={`flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-center tracking-[0] leading-[14px] whitespace-nowrap ${
                        stats.trustScore >= 8
                          ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]"
                          : "text-[#808080]"
                      }`}>
                        {stats.trustScore >= 8 ? "Excellent Score" : "Building Trust"}
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
            </div>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[23px] w-full">
              <div className="w-full flex flex-col flex-1 items-start gap-6">
                <Card className="bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4] w-full">
                  <CardContent className="p-6 flex flex-col items-start gap-[30px]">
                    <div className="inline-flex items-center gap-2.5">
                      <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#0052CC24]">
                        <Zap className="w-5 h-5" />
                      </div>
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                        Quick Actions
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-[19px] w-full">
                        <Button
                          onClick={() => navigate("/transactions/new")}
                          variant="outline"
                          className="h-[98px] rounded-[10px] border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-4 hover:bg-accent/50"
                        >
                          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#436CC824]">
                            <Plus className="w-4 h-4 text-[#436CC8]" />
                          </div>                          
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                            New Transaction
                          </span>
                        </Button>
                        <Button
                          onClick={() => navigate("/id-verification")}
                          variant="outline"
                          className="h-[98px] rounded-[10px] border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-4 hover:bg-accent/50"
                        >
                          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#00AD6924]">
                            <Upload className="w-4 h-4 text-[#00AD69]" />
                          </div>                          
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                            Upload KYC
                          </span>
                        </Button>
                        <Button
                          onClick={() => navigate("/messages")}
                          variant="outline"
                          className="h-[98px] rounded-[10px] border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-4 hover:bg-accent/50"
                        >
                          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#D094DD24]">
                            <MessageSquare className="w-4 h-4 text-[#D094DD]" />
                          </div>                          
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                            Messages
                          </span>
                        </Button>
                        <Button
                          onClick={() => navigate("/report-scam")}
                          variant="outline"
                          className="h-[98px] rounded-[10px] border border-dashed border-neutral-300 flex flex-col items-center justify-center gap-4 hover:bg-accent/50"
                        >
                          <div className="w-9 h-9 flex items-center justify-center rounded-md bg-[#E7000B24]">
                            <OctagonAlert className="w-4 h-4 text-[#E7000B]" />
                          </div>                          
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm tracking-[0] leading-5 whitespace-nowrap">
                            Report Issue
                          </span>
                        </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4] w-full">
                  <CardContent className="p-6 flex flex-col items-start gap-[30px]">
                    <div className="flex items-center justify-between w-full">
                      <div className="inline-flex items-center gap-2.5">
                        <div className="w-11 h-11 flex justify-center items-center rounded-xl bg-[#0052CC24]">
                          <ArrowRightLeft className="w-5 h-5"/>
                        </div>
                        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                          Recent Transactions
                        </h2>
                      </div>
                      <Button
                        variant="link"
                        className="h-auto p-0 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-primary text-base tracking-[0] leading-6 whitespace-nowrap"
                        onClick={() => navigate("/secure-transaction")}
                      >
                        View all
                      </Button>
                    </div>

                    <div className="flex flex-col items-start gap-4 w-full">
                      {loadingTransactions ? (
                        <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3778]" />
                          <p className="text-[#808080]">Loading transactions...</p>
                        </div>
                      ) : (
                        recentTransactions.map((transaction, index) => {
                          const key = transaction.id ?? index;
                          const canViewDetails = Boolean(transaction.id);
                          return (
                            <div
                              key={key}
                              className="w-full bg-[#f6f6f6] rounded-[20px] p-4"
                            >
                              <div className="flex items-center justify-between w-full">
                                <div className="inline-flex items-start gap-[13px]">
                                  <img
                                    className="w-[54px] h-[54px]"
                                    alt={transaction.title}
                                    src={transaction.icon}
                                  />
                                  <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2.5">
                                      <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base leading-6 flex items-center justify-center tracking-[0]">
                                        {transaction.title}
                                      </div>
                                      <Badge
                                        className={`${transaction.status.bgColor} ${transaction.status.textColor} hidden xl:flex items-center justify-center gap-[6.6px] px-[9.25px] py-[5.28px] rounded-[528.3px] border-0`}
                                      >
                                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[10px] text-center tracking-[0] leading-[9.2px] whitespace-nowrap">
                                          {transaction.status.text}
                                        </span>
                                      </Badge>
                                    </div>
                                    <div className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                                      {transaction.date}
                                    </div>
                                  </div>
                                </div>
                                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg leading-7 whitespace-nowrap flex flex-col items-end justify-between gap-1 tracking-[0]">
                                  <Badge
                                    className={`${transaction.status.bgColor} ${transaction.status.textColor} flex xl:hidden items-center justify-center gap-[6.6px] px-[9.25px] py-[5.28px] rounded-[528.3px] border-0`}
                                  >
                                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[10px] text-center tracking-[0] leading-[9.2px] whitespace-nowrap">
                                      {transaction.status.text}
                                    </span>
                                  </Badge>
                                  {transaction.amount}
                                  {canViewDetails && (
                                    <Link
                                      to={`/transactions/${transaction.id}`}
                                      className="flex items-center gap-1 text-sm text-[#0A3778] underline"
                                    >
                                      <Eye className="w-3 h-3" />
                                      View
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full flex flex-col lg:w-[542px] items-start gap-6">
                <Card className="bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4] w-full">
                  <CardContent className="p-6 flex flex-col items-start gap-[30px]">
                    <div className="inline-flex items-center gap-2.5">
                      <div className="w-11 h-11 flex justify-center items-center rounded-xl bg-[#0052CC24]">
                        <ShieldCheck className="w-5 h-5 text-[#27AE60]"/>
                      </div>
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                        Security Features
                      </h2>
                    </div>

                    <div className="flex flex-col items-start gap-[13px] w-full">
                      {securityFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="w-full rounded-xl border border-solid border-[#ececec] p-3"
                        >
                          <div className="flex items-center gap-[15px]">
                            <img
                              className="w-[46px] h-[46px]"
                              alt={feature.title}
                              src={feature.icon}
                            />
                            <div className="flex flex-col items-start flex-1">
                              <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#040303] text-base leading-6 flex items-center justify-center tracking-[0]">
                                {feature.title}
                              </div>
                              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm leading-6 flex items-center justify-center tracking-[0]">
                                {feature.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
};
