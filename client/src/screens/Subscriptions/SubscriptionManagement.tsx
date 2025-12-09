import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { 
  CreditCard, 
  FileText, 
  TrendingUp, 
  Calendar,
  Loader2,
  ExternalLink,
  X,
  CheckCircle2
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";
import { useAuth } from "../../hooks/use-auth";
import { useToast } from "../../hooks/use-toast";
import { HeaderDemo } from "../../components/HeaderDemo";

interface Subscription {
  id: number;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan: {
    id: number;
    displayName: string;
    price: string;
    interval: string;
  };
}

interface Invoice {
  id: number;
  amount: string;
  currency: string;
  status: string;
  hostedInvoiceUrl: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  createdAt: string;
}

interface Usage {
  id: number;
  metric: string;
  quantity: number;
  periodStart: string;
  periodEnd: string;
}

export const SubscriptionManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<Usage[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [resuming, setResuming] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchSubscription(),
        fetchInvoices(),
        fetchUsage(),
      ]);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await apiRequest("GET", "/api/subscriptions/current");
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      // No subscription found
      setSubscription(null);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await apiRequest("GET", "/api/subscriptions/invoices");
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await apiRequest("GET", "/api/subscriptions/usage");
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error("Error fetching usage:", error);
    }
  };

  const handleCancel = async (immediately: boolean = false) => {
    if (!subscription) return;

    const confirmMessage = immediately
      ? "Are you sure you want to cancel your subscription immediately? This action cannot be undone."
      : "Are you sure you want to cancel your subscription? It will remain active until the end of the current billing period.";

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setCanceling(true);
    try {
      const response = await apiRequest("POST", `/api/subscriptions/${subscription.id}/cancel`, {
        immediately,
      });
      const data = await response.json();
      setSubscription(data);
      toast({
        title: "Subscription Canceled",
        description: immediately
          ? "Your subscription has been canceled immediately."
          : "Your subscription will be canceled at the end of the current period.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setCanceling(false);
    }
  };

  const handleResume = async () => {
    if (!subscription) return;

    setResuming(true);
    try {
      const response = await apiRequest("POST", `/api/subscriptions/${subscription.id}/resume`);
      const data = await response.json();
      setSubscription(data);
      toast({
        title: "Subscription Resumed",
        description: "Your subscription has been resumed successfully.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error resuming subscription:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to resume subscription",
        variant: "destructive",
      });
    } finally {
      setResuming(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "destructive" | "secondary" }> = {
      active: { label: "Active", variant: "default" },
      trialing: { label: "Trial", variant: "secondary" },
      past_due: { label: "Past Due", variant: "destructive" },
      canceled: { label: "Canceled", variant: "destructive" },
      unpaid: { label: "Unpaid", variant: "destructive" },
    };

    const config = statusConfig[status] || { label: status, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
        <HeaderDemo />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 animate-spin text-[#808080]" />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
        <HeaderDemo />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle>No Active Subscription</CardTitle>
                <CardDescription>
                  You don't have an active subscription. Choose a plan to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => (window.location.href = "/pricing")}
                  className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                >
                  View Plans
                </Button>
              </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
      <HeaderDemo />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 bg-[linear-gradient(90deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent]">
          Subscription Management
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Subscription */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Current Subscription
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {subscription.plan.displayName} Plan
                    </CardDescription>
                  </div>
                  {getStatusBadge(subscription.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-[#808080] mb-1">Billing Period</p>
                  <p className="font-medium">
                    {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#808080] mb-1">Price</p>
                  <p className="font-medium">
                    ${parseFloat(subscription.plan.price).toFixed(2)}/{subscription.plan.interval}
                  </p>
                </div>

                {subscription.cancelAtPeriodEnd && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      Your subscription will be canceled on {formatDate(subscription.currentPeriodEnd)}.
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex gap-2">
                  {subscription.cancelAtPeriodEnd ? (
                    <Button
                      onClick={handleResume}
                      disabled={resuming}
                      className="flex-1"
                    >
                      {resuming ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Resuming...
                        </>
                      ) : (
                        "Resume Subscription"
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleCancel(false)}
                        disabled={canceling}
                        variant="outline"
                        className="flex-1"
                      >
                        {canceling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Canceling...
                          </>
                        ) : (
                          "Cancel Subscription"
                        )}
                      </Button>
                      <Button
                        onClick={() => (window.location.href = "/pricing")}
                        className="flex-1 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                      >
                        Change Plan
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usage.length > 0 ? (
                  <div className="space-y-4">
                    {usage.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium capitalize">{item.metric.replace(/_/g, " ")}</p>
                          <p className="text-sm text-[#808080]">
                            {formatDate(item.periodStart)} - {formatDate(item.periodEnd)}
                          </p>
                        </div>
                        <p className="text-lg font-bold">{item.quantity.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#808080]">No usage data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Invoices */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Invoices
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length > 0 ? (
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">
                              ${parseFloat(invoice.amount).toFixed(2)} {invoice.currency.toUpperCase()}
                            </p>
                            {invoice.status === "paid" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <X className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                          <p className="text-xs text-[#808080]">
                            {invoice.paidAt ? formatDate(invoice.paidAt) : formatDate(invoice.createdAt)}
                          </p>
                        </div>
                        {invoice.hostedInvoiceUrl && (
                          <a
                            href={invoice.hostedInvoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#808080]">No invoices found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

