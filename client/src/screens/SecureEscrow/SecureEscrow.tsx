import { useState, useMemo } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Header } from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/use-auth";
import { useToast } from "../../hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

  
  const escrowStepsData = [
    {
      icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-41.svg",
      title: "Create Transaction",
      description:
        "Buyer creates escrow account and securely deposits funds with enterprise-grade protection",
    },
    {
      icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-51.svg",
      title: "Seller Delivers",
      description:
        "Seller completes the agreed work or service with real-time progress tracking and communication",
    },
    {
      icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-31.svg",
      title: "Release Funds",
      description:
        "Buyer approves delivery and funds are instantly released to seller with transaction completion",
    },
  ];

  // Transaction form schema
  const transactionSchema = z.object({
    title: z.string().min(1, "Transaction title is required"),
    description: z.string().min(1, "Description is required"),
    amount: z.string().min(1, "Amount is required"),
    recipientEmail: z.string().email("Valid email is required"),
  });

  type TransactionForm = z.infer<typeof transactionSchema>;

  // Transaction interface
  interface Transaction {
    id: number;
    title: string;
    description: string;
    amount: string | number;
    currency?: string;
    status: string;
    buyerId?: number;
    sellerId?: number;
    buyer?: string;
    seller?: string;
    createdAt: string;
    escrowId?: string;
  }

export const SecureEscrow = (): JSX.Element => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [paymentType, setPaymentType] = useState<"send" | "request">("send");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch user's transactions
    const { data: transactionsData, isLoading: loadingTransactions } = useQuery<{ transactions: Transaction[] }>({
        queryKey: ["transactions", user?.id],
        queryFn: async () => {
            const response = await fetch("/api/transactions?page=1&limit=20", {
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch transactions");
            return response.json();
        },
        enabled: !!user,
        refetchOnWindowFocus: true,
    });

    const transactions = transactionsData?.transactions ?? [];

    // Calculate stats from real transactions
    const statsData = useMemo(() => {
        const totalInEscrow = transactions.filter(t => 
            ["escrow", "active"].includes(t.status?.toLowerCase() || "")
        ).length;
        
        const completed = transactions.filter(t => 
            t.status?.toLowerCase() === "completed"
        ).length;
        
        const pending = transactions.filter(t => 
            ["pending", "processing"].includes(t.status?.toLowerCase() || "")
        ).length;
        
        const disputes = transactions.filter(t => 
            t.status?.toLowerCase() === "disputed"
        ).length;

        return [
            {
                icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-11.svg",
                label: "Total in Escrow",
                value: totalInEscrow.toString().padStart(2, "0"),
                badge: {
                    icon: "/fi-55925181.svg",
                    text: "+12%",
                    subtext: " this month",
                    textColor: "text-[#436cc8]",
                },
            },
            {
                icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-61.svg",
                label: "Completed",
                value: completed.toString().padStart(2, "0"),
                badge: {
                    dot: true,
                    dotColor: "bg-app-secondary",
                    text: completed > 0 ? "100% Success Rate" : "No completions yet",
                    textColor: "text-app-secondary",
                },
            },
            {
                icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar1.svg",
                label: "Pending",
                value: pending.toString().padStart(2, "0"),
                badge: {
                    dot: true,
                    dotColor: "bg-yellow-500",
                    text: "Avg 2.3 Days",
                    textColor: "text-yellow-500",
                },
            },
            {
                icon: "/mb-6-inline-flex-items-center-justify-center-w-16-h-16-bg-primar-21.svg",
                label: "Disputes",
                value: disputes.toString().padStart(2, "0"),
                badge: {
                    dot: true,
                    dotColor: "bg-[#e7000b]",
                    text: "Protected By AI",
                    textColor: "text-[#e7000b]",
                },
            },
        ];
    }, [transactions]);

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset
    } = useForm<TransactionForm>({
      resolver: zodResolver(transactionSchema),
    });

    const onSubmit = async (data: TransactionForm) => {
      setIsSubmitting(true);
      
      try {
        // API call to create transaction
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            amount: parseFloat(data.amount.replace(/[^0-9.]/g, "")),
            currency: "USD",
            sellerEmail: data.recipientEmail,
            category: "other",
            deliveryTimeframe: "14_days"
          }),
        });

        if (response.ok) {
          await response.json();
          
          // Invalidate and refetch transactions
          queryClient.invalidateQueries({ queryKey: ["transactions", user?.id] });
          reset();
          
          toast({
            title: "Transaction Created!",
            description: "Your escrow transaction has been created successfully.",
          });
        } else {
          const error = await response.json();
          throw new Error(error.message || "Failed to create transaction");
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to create transaction. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case "completed":
          return {
            statusColor: "bg-[#27ae6033]",
            statusDotColor: "bg-[#27ae60]",
            statusTextColor: "text-[#27ae60]",
          };
        case "active":
          return {
            statusColor: "bg-[#436cc833]",
            statusDotColor: "bg-[#436cc8]",
            statusTextColor: "text-[#436cc8]",
          };
        case "pending":
          return {
            statusColor: "bg-[#eab30833]",
            statusDotColor: "bg-yellow-500",
            statusTextColor: "text-yellow-500",
          };
        case "disputed":
          return {
            statusColor: "bg-[#e7000b33]",
            statusDotColor: "bg-[#e7000b]",
            statusTextColor: "text-[#e7000b]",
          };
        default:
          return {
            statusColor: "bg-[#80808033]",
            statusDotColor: "bg-[#808080]",
            statusTextColor: "text-[#808080]",
          };
      }
    };


  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full flex flex-col relative">
    <Header />
    <section className="flex flex-col items-start gap-[30px] w-full px-4 sm:px-6 md:px-[50px] py-10 md:py-[70px]">
      <div className="flex flex-col items-start gap-6 w-full">
        <button 
          onClick={() => navigate("/")}
          aria-label="Return to Homepage"
          className="inline-flex items-center gap-2.5 cursor-pointer"
        >
          <img
            className="w-6 h-6"
            alt="Return to Homepage"
            src="/flat-color-icons-next1.svg"
          />
          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[22px] tracking-[0] leading-[normal]">
            Return to Homepage
          </span>
        </button>

        <div className="flex flex-col items-start gap-2.5 w-full">
          <h1 className="flex items-center justify-center w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-5xl tracking-[0] leading-[normal]">
            Secure Escrow
          </h1>
          <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl tracking-[0] leading-8">
            Send and receive payments securely with our escrow protection
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]"
            >
              <CardContent className="p-6 lg:p-[31px]">
                <div className="flex items-start gap-4 lg:gap-5">
                  <img
                    className="w-[64px] h-[64px] lg:w-[77.14px] lg:h-[77.14px]"
                    alt={stat.label}
                    src={stat.icon}
                  />
                  <div className="flex flex-col items-start gap-5 flex-1">
                    <div className="flex flex-col items-start gap-[5px] w-full">
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg tracking-[0] leading-[normal]">
                        {stat.label}
                      </div>
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl tracking-[0] leading-[38.6px]">
                        {stat.value}
                      </div>
                    </div>
                    <div className="inline-flex items-center flex-wrap gap-2">
                      {stat.badge.icon && (
                        <img
                          className="w-[22px] h-[21px]"
                          alt="Badge icon"
                          src={stat.badge.icon}
                        />
                      )}
                      {stat.badge.dot && (
                        <div
                          className={`w-[7px] h-[7px] rounded-[3.5px] ${stat.badge.dotColor}`}
                        />
                      )}
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-base tracking-[0] leading-[normal]">
                        <span className={stat.badge.textColor}>
                          {stat.badge.text}
                        </span>
                        {stat.badge.subtext && (
                          <span className="text-[#808080]">
                            {stat.badge.subtext}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-start gap-6 w-full">
          <div className="flex flex-col xl:flex-row items-start gap-6 xl:gap-[23px] w-full">
            <Card className="flex-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col items-start gap-[30px]">
                  <div className="flex flex-col items-start gap-6 w-full">
                    <div className="flex flex-col items-start gap-6 w-full">
                      <div className="flex flex-col items-start gap-5 w-full">
                        <div className="flex flex-col items-start gap-4 w-full">
                          <div className="inline-flex items-center gap-2.5">
                            <img
                              className="w-[46px] h-[46px]"
                              alt="Create Secure Transactions"
                              src="/p-2-rounded-lg-bg-accent-10-11.svg"
                            />
                            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                              Create Secure Transactions
                            </h2>
                          </div>
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                            Set up a new escrow transaction with built-in
                            protection
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 w-full">
                          <Button
                            onClick={() => setPaymentType("send")}
                            className={`flex-1 h-[45px] rounded-lg ${
                              paymentType === "send"
                                ? "bg-app-secondary hover:bg-app-secondary/90"
                                : "bg-transparent border border-app-secondary text-app-secondary hover:bg-app-secondary/10"
                            }`}
                          >
                            <img
                              className="w-4 h-4 mr-2.5"
                              alt="Send"
                              src={
                                paymentType === "send"
                                  ? "/frame-11.svg"
                                  : "/frame1.svg"
                              }
                            />
                            <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-sm tracking-[-0.20px] leading-[18px]">
                              Send Payment
                            </span>
                          </Button>
                          <Button
                            onClick={() => setPaymentType("request")}
                            className={`flex-1 h-[45px] rounded-lg ${
                              paymentType === "request"
                                ? "bg-app-secondary hover:bg-app-secondary/90"
                                : "bg-transparent border border-app-secondary text-app-secondary hover:bg-app-secondary/10"
                            }`}
                          >
                            <img
                              className="w-4 h-4 mr-2.5"
                              alt="Request"
                              src={
                                paymentType === "request"
                                  ? "/frame-11.svg"
                                  : "/frame1.svg"
                              }
                            />
                            <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-sm tracking-[-0.20px] leading-[18px]">
                              Request Payment
                            </span>
                          </Button>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-5 w-full">
                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 w-full">
                          <div className="flex flex-col flex-1 items-start gap-2.5">
                            <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                              Transaction Title
                            </Label>
                            <Input
                              {...register("title")}
                              placeholder="e.g Web development, Mobile app etc."
                              className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                            />
                            {errors.title && (
                              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#e7000b] text-sm">
                                {errors.title.message}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col flex-1 items-start gap-2.5">
                            <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                              Recipient Email
                            </Label>
                            <Input
                              {...register("recipientEmail")}
                              type="email"
                              placeholder="recipient@example.com"
                              className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                            />
                            {errors.recipientEmail && (
                              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#e7000b] text-sm">
                                {errors.recipientEmail.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-2.5 w-full">
                          <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                            Description
                          </Label>
                          <Textarea
                            {...register("description")}
                            placeholder="Enter description...."
                            className="h-[120px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base resize-none"
                          />
                          {errors.description && (
                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#e7000b] text-sm">
                              {errors.description.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start gap-2.5 w-full">
                          <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                            Amount USD
                          </Label>
                          <Input
                            {...register("amount")}
                            placeholder="$0.00"
                            className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                          />
                          {errors.amount && (
                            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#e7000b] text-sm">
                              {errors.amount.message}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-start justify-center gap-2.5 p-5 sm:p-6 w-full bg-[#1f4dd824] rounded-xl">
                          <div className="flex flex-col items-start justify-center gap-[5px] w-full">
                            <div className="flex items-start gap-[5px] w-full">
                              <img
                                className="w-[19px] h-[23px]"
                                alt="Shield"
                                src="/fi-1026491.svg"
                              />
                              <div className="flex flex-col items-start gap-[5px] flex-1">
                                <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#1f4dd8] text-sm tracking-[-0.20px] leading-7 whitespace-nowrap">
                                  Enterprise Escrow Protection
                                </div>
                                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#1f4dd8] text-xs tracking-[0] leading-[22px]">
                                  Funds are secured with bank-level encryption and
                                  held in FDIC-insured accounts until both parties
                                  confirm transaction completion. Our AI-powered
                                  dispute resolution ensures fair outcomes
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-[50px] bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[-0.20px] leading-[18px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? "Creating..." : "Create Secure Transactions"}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full xl:w-[542px] bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="inline-flex items-center gap-2.5">
                      <img
                        className="w-[46px] h-[46px]"
                        alt="Recent Transactions"
                        src="/p-2-rounded-lg-bg-accent-10-11.svg"
                      />
                      <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                        Recent Transactions
                      </h2>
                    </div>
                    <button
                     onClick={() =>navigate("/secure-transaction")}
                     className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-app-primary text-base tracking-[0] leading-6 whitespace-nowrap cursor-pointer"
                    >
                     
                      View all
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {loadingTransactions ? (
                      <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3778]" />
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                          Loading transactions...
                        </p>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-xl">
                          No transactions yet. Create a new transaction to get started.
                        </p>
                      </div>
                    ) : (
                      transactions.slice(0, 3).map((transaction) => {
                        const statusStyles = getStatusColor(transaction.status);
                        const currency = transaction.currency || 'USD';
                        const formattedAmount = typeof transaction.amount === 'number'
                          ? new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(transaction.amount)
                          : transaction.amount;
                        
                        return (
                          <Card
                            key={transaction.id}
                            className="border border-solid border-[#ececec] rounded-xl"
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col items-start gap-5">
                                <div className="flex flex-col items-start gap-4 w-full">
                                  <div className="flex flex-col items-start gap-4 w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base tracking-[0] leading-6 whitespace-nowrap">
                                        {transaction.title}
                                      </h3>
                                      <Badge
                                        className={`${statusStyles.statusColor} inline-flex items-center justify-center gap-[5px] px-2.5 py-[7px] rounded-[50px]`}
                                      >
                                        <div
                                          className={`w-[7px] h-[7px] rounded-[3.5px] ${statusStyles.statusDotColor}`}
                                        />
                                        <span
                                          className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-xs tracking-[0] leading-[9.2px] ${statusStyles.statusTextColor}`}
                                        >
                                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                        </span>
                                      </Badge>
                                    </div>
                                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm tracking-[0] leading-6">
                                      {transaction.description}
                                    </p>
                                  </div>
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 w-full">
                                    <div className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold text-[#003d2b] text-lg tracking-[0] leading-6 whitespace-nowrap">
                                      {formattedAmount}
                                    </div>
                                    <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-sm text-right tracking-[0] leading-6 whitespace-nowrap">
                                      {transaction.escrowId || `#${transaction.id}`}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-2">
                                  <Button 
                                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                                    className="flex-1 h-10 bg-app-primary hover:bg-app-primary/90 rounded-lg"
                                  >
                                    <img
                                      className="w-4 h-4 mr-[5px]"
                                      alt="View"
                                      src="/fi-7096121.svg"
                                    />
                                    <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-xs tracking-[-0.20px] leading-[18px]">
                                      View
                                    </span>
                                  </Button>
                                  <Button
                                    onClick={() => navigate(`/messages/${transaction.id}`)}
                                    variant="outline"
                                    className="flex-1 h-10 border border-solid border-[#0b3a78] rounded-lg hover:bg-[#0b3a78]/10"
                                  >
                                    <img
                                      className="w-[15px] h-[15px] mr-[5px]"
                                      alt="Chat"
                                      src="/fi-5897081.svg"
                                    />
                                    <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-app-primary text-xs tracking-[-0.20px] leading-[18px]">
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
          </div>

          <Card className="w-full bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-col items-start gap-[30px]">
                <div className="flex flex-col items-start gap-4">
                  <div className="inline-flex items-center gap-2.5">
                    <img
                      className="w-[46px] h-[46px]"
                      alt="How Escrow Works"
                      src="/p-2-rounded-lg-bg-accent-101.svg"
                    />
                    <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6 whitespace-nowrap">
                      How Escrow Works
                    </h2>
                  </div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                    Our three-step process ensures secure transactions for all
                    parties involved
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-[80px] lg:gap-[131px] w-full">
                  {escrowStepsData.map((step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-3.5"
                    >
                      <img
                        className="w-[70px] h-[70px]"
                        alt={step.title}
                        src={step.icon}
                      />
                      <div className="flex flex-col items-center gap-4 w-full">
                        <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg text-center tracking-[0] leading-7">
                          {step.title}
                        </h3>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm text-center tracking-[0] leading-[22.8px]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </main>
  );
};
