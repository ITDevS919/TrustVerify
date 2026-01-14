import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import {
  ChevronLeft,
  Eye,
  Calendar,
  DollarSign,
  User,
  Building2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  MessageSquare,
  FileText,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type Transaction = {
  id: number;
  title: string;
  description?: string;
  amount: string;
  currency?: string;
  status: string;
  buyerId: number;
  sellerId: number;
  buyer?: {
    id: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  seller?: {
    id: number;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  milestones?: any;
  riskScore?: string;
  fraudFlags?: any;
  escalationLevel?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  bufferPeriodHours?: number;
  bufferStartTime?: string;
  bufferEndTime?: string;
  disputeWindowHours?: number;
  disputeDeadline?: string;
};

const formatCurrency = (value: number | string, currency: string = "GBP") => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency || "GBP",
    minimumFractionDigits: 2,
  }).format(numValue);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusMeta = (status: string) => {
  const normalized = status?.toLowerCase();
  if (["processing", "kyc_required", "kyb_required", "aml_check"].includes(normalized)) {
    return { 
      text: "Processing", 
      bgColor: "bg-[#eab30833]", 
      textColor: "text-yellow-500",
      icon: Clock,
      description: "Transaction is being processed"
    };
  }
  if (["active", "verification_approved", "escrow"].includes(normalized)) {
    return { 
      text: "Active", 
      bgColor: "bg-[#0b3a7833]", 
      textColor: "text-[#0b3a78]",
      icon: CheckCircle,
      description: "Transaction is active and funds are in escrow"
    };
  }
  if (normalized === "completed") {
    return { 
      text: "Completed", 
      bgColor: "bg-[#27ae6033]", 
      textColor: "text-[#27ae60]",
      icon: CheckCircle,
      description: "Transaction has been completed successfully"
    };
  }
  if (normalized === "disputed") {
    return { 
      text: "Disputed", 
      bgColor: "bg-red-100", 
      textColor: "text-red-500",
      icon: AlertTriangle,
      description: "Transaction is under dispute"
    };
  }
  if (normalized === "cancelled") {
    return { 
      text: "Cancelled", 
      bgColor: "bg-gray-100", 
      textColor: "text-gray-500",
      icon: XCircle,
      description: "Transaction has been cancelled"
    };
  }
  return { 
    text: "Pending", 
    bgColor: "bg-[#eab30833]", 
    textColor: "text-yellow-500",
    icon: Clock,
    description: "Transaction is pending"
  };
};

const getRiskLevel = (riskScore?: string | number) => {
  const score = typeof riskScore === "string" ? parseFloat(riskScore) : (riskScore || 0);
  if (score >= 70) {
    return { level: "High", color: "text-red-500", bgColor: "bg-red-100" };
  }
  if (score >= 40) {
    return { level: "Medium", color: "text-yellow-500", bgColor: "bg-yellow-100" };
  }
  return { level: "Low", color: "text-green-500", bgColor: "bg-green-100" };
};

export const TransactionDetail = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery<Transaction>({
    queryKey: ["/api/transactions", id],
    queryFn: async () => {
      const response = await fetch(`/api/transactions/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Transaction not found");
        }
        if (response.status === 403) {
          throw new Error("You don't have permission to view this transaction");
        }
        throw new Error("Failed to fetch transaction");
      }
      return response.json();
    },
    enabled: !!id && !!user,
  });

  if (isLoading) {
    return (
      <main className="bg-[#f6f6f6] overflow-hidden w-full flex flex-col min-h-screen">
        <Header />
        <section className="w-full flex items-center justify-center px-6 sm:px-10 xl:px-20 2xl:px-28 py-[72px]">
          <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3778]" />
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl">
              Loading transaction details...
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (error || !transaction) {
    return (
      <main className="bg-[#f6f6f6] overflow-hidden w-full flex flex-col min-h-screen">
        <Header />
        <section className="w-full flex items-center justify-center px-6 sm:px-10 xl:px-20 2xl:px-28 py-[72px]">
          <div className="w-full max-w-6xl flex flex-col items-center justify-center gap-6">
            <AlertTriangle className="w-16 h-16 text-red-500" />
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">
              Transaction Not Found
            </h2>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg text-center max-w-md">
              {error instanceof Error ? error.message : "The transaction you're looking for doesn't exist or you don't have permission to view it."}
            </p>
            <Button onClick={() => navigate("/dashboard")} variant="default">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const statusMeta = getStatusMeta(transaction.status);
  const StatusIcon = statusMeta.icon;
  const riskMeta = getRiskLevel(transaction.riskScore);
  const isBuyer = user?.id === transaction.buyerId;
  const isSeller = user?.id === transaction.sellerId;
  const otherParty = isBuyer 
    ? (transaction.seller || { email: "Unknown", username: "Unknown" })
    : (transaction.buyer || { email: "Unknown", username: "Unknown" });

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full flex flex-col min-h-screen">
      <Header />
      <section className="w-full flex items-center justify-center px-6 sm:px-10 xl:px-20 2xl:px-28 py-[72px]">
        <div className="w-full max-w-6xl flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-start gap-6 w-full">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="ghost"
              className="flex items-center justify-center gap-2.5 p-0 hover:bg-transparent"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[22px] tracking-[0] leading-[normal]">
                Back to Dashboard
              </span>
            </Button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
              <div className="flex flex-col items-start gap-2.5">
                <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[0] leading-[normal]">
                  {transaction.title || `Transaction #${transaction.id}`}
                </h1>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-lg">
                  Transaction ID: {transaction.id}
                </p>
              </div>
              <Badge
                className={`${statusMeta.bgColor} ${statusMeta.textColor} flex items-center justify-center gap-2 px-4 py-2 rounded-full border-0`}
              >
                <StatusIcon className="w-4 h-4" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                  {statusMeta.text}
                </span>
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Transaction Overview */}
              <Card className="bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                    Transaction Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0052CC24]">
                      <DollarSign className="w-6 h-6 text-[#0052CC]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                        Amount
                      </span>
                      <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </span>
                    </div>
                  </div>

                  {transaction.description && (
                    <>
                      <Separator />
                      <div className="flex flex-col gap-2">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                          Description
                        </span>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                          {transaction.description}
                        </p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                        Created
                      </span>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#808080]" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                          {formatDate(transaction.createdAt)}
                        </span>
                      </div>
                    </div>
                    {transaction.completedAt && (
                      <div className="flex flex-col gap-2">
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                          Completed
                        </span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#27ae60]" />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                            {formatDate(transaction.completedAt)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Parties Information */}
              <Card className="bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                    Parties
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#436CC824]">
                      {isBuyer ? <User className="w-6 h-6 text-[#436CC8]" /> : <Building2 className="w-6 h-6 text-[#436CC8]" />}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base">
                        {isBuyer ? "You (Buyer)" : "You (Seller)"}
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                        {user?.email || user?.username || "Your account"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#00AD6924]">
                      {isBuyer ? <Building2 className="w-6 h-6 text-[#00AD69]" /> : <User className="w-6 h-6 text-[#00AD69]" />}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base">
                        {isBuyer ? "Seller" : "Buyer"}
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                        {otherParty.email || otherParty.username || "Unknown"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Risk */}
              {(transaction.riskScore || transaction.fraudFlags || transaction.escalationLevel) && (
                <Card className="bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security & Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    {transaction.riskScore && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                            Risk Score
                          </span>
                          <Badge className={`${riskMeta.bgColor} ${riskMeta.color} border-0`}>
                            {riskMeta.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-[#808080]" />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base">
                            {typeof transaction.riskScore === "string" ? parseFloat(transaction.riskScore).toFixed(2) : transaction.riskScore.toFixed(2)} / 100
                          </span>
                        </div>
                      </div>
                    )}

                    {transaction.escalationLevel !== undefined && transaction.escalationLevel > 0 && (
                      <>
                        <Separator />
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                            Escalation Level: {transaction.escalationLevel} 
                            {transaction.escalationLevel === 1 && " (Flagged)"}
                            {transaction.escalationLevel === 2 && " (High Risk)"}
                            {transaction.escalationLevel === 3 && " (Critical)"}
                          </span>
                        </div>
                      </>
                    )}

                    {transaction.fraudFlags && Array.isArray(transaction.fraudFlags) && transaction.fraudFlags.length > 0 && (
                      <>
                        <Separator />
                        <div className="flex flex-col gap-2">
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                            Fraud Flags Detected
                          </span>
                          <ul className="list-disc list-inside space-y-1">
                            {transaction.fraudFlags.map((flag: string, index: number) => (
                              <li key={index} className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm">
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Actions & Timeline */}
            <div className="flex flex-col gap-6">
              {/* Quick Actions */}
              <Card className="bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button
                    onClick={() => navigate(`/messages?transactionId=${transaction.id}`)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    onClick={() => navigate(`/transactions/${transaction.id}/dispute`)}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.print()}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Print Details
                  </Button>
                </CardContent>
              </Card>

              {/* Transaction Timeline */}
              <Card className="bg-white rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#0052CC] mt-2" />
                    <div className="flex flex-col flex-1">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                        Transaction Created
                      </span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">
                        {formatDate(transaction.createdAt)}
                      </span>
                    </div>
                  </div>

                  {transaction.bufferStartTime && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                      <div className="flex flex-col flex-1">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                          Buffer Period Started
                        </span>
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">
                          {formatDate(transaction.bufferStartTime)}
                        </span>
                      </div>
                    </div>
                  )}

                  {transaction.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#27ae60] mt-2" />
                      <div className="flex flex-col flex-1">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                          Transaction Completed
                        </span>
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">
                          {formatDate(transaction.completedAt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {transaction.updatedAt && transaction.updatedAt !== transaction.createdAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#808080] mt-2" />
                      <div className="flex flex-col flex-1">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">
                          Last Updated
                        </span>
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xs">
                          {formatDate(transaction.updatedAt)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

