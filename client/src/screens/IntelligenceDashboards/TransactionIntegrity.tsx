import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle, TrendingUp, FileText, Activity, Search, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TransactionIntegrityDashboard() {
  const [transactionId, setTransactionId] = useState("");
  const { toast } = useToast();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/v1/transaction-integrity/dashboard/stats"],
  });

  // Fetch fraud signals
  const { data: fraudSignals, isLoading: signalsLoading } = useQuery({
    queryKey: ["/api/v1/transaction-integrity/fraud-signals"],
  });

  // Fetch arbitrations
  const { data: arbitrations, isLoading: arbitrationsLoading } = useQuery({
    queryKey: ["/api/v1/transaction-integrity/arbitrations"],
  });

  // Fetch disputes
  const { data: disputes, isLoading: disputesLoading } = useQuery({
    queryKey: ["/api/v1/transaction-integrity/disputes"],
  });

  // Fetch anomalies
  const { data: anomalies, isLoading: anomaliesLoading } = useQuery({
    queryKey: ["/api/v1/transaction-integrity/anomalies"],
  });

  // Analyze transaction mutation
  const analyzeTransaction = useMutation({
    mutationFn: async (txnId: string) => {
      const response = await fetch(`/api/v1/transaction-integrity/analyze/${txnId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to analyze transaction");
      return response.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Transaction Analyzed",
        description: `Risk Score: ${data.riskScore} (${data.riskLevel}) - ${data.recommendation}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/transaction-integrity/fraud-signals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/transaction-integrity/anomalies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/transaction-integrity/dashboard/stats"] });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!transactionId) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter a transaction ID to analyze.",
        variant: "destructive",
      });
      return;
    }
    analyzeTransaction.mutate(transactionId);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400"><CheckCircle2 className="w-3 h-3 mr-1" /> Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case 'pending':
        return <Badge variant="outline"><AlertCircle className="w-3 h-3 mr-1" /> Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl" data-testid="page-title">
              Transaction Integrity & Arbitration Intelligence
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2" data-testid="page-description">
              Real-time fraud detection, payment verification, and dispute resolution intelligence
            </p>
          </div>
          <Shield className="w-12 h-12 text-[#27ae60]" />
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border-l-4 border-l-red-500 border border-[#e4e4e4]" data-testid="card-fraud-signals">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Total Fraud Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-fraud-signals-count">
                  {statsLoading ? "..." : (stats as any)?.totalFraudSignals || 0}
                </p>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2" data-testid="text-critical-signals">
                {(stats as any)?.criticalSignals || 0} critical signals
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border-l-4 border-l-amber-500 border border-[#e4e4e4]" data-testid="card-under-review">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Under Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-under-review-count">
                  {statsLoading ? "..." : (stats as any)?.transactionsUnderReview || 0}
                </p>
                <FileText className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Transactions in dispute</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border-l-4 border-l-blue-500 border border-[#e4e4e4]" data-testid="card-arbitrations">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Active Arbitrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-arbitrations-count">
                  {statsLoading ? "..." : (stats as any)?.activeArbitrations || 0}
                </p>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Pending resolution</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border-l-4 border-l-[#27ae60] border border-[#e4e4e4]" data-testid="card-success-rate">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-success-rate">
                  {statsLoading ? "..." : `${(stats as any)?.integrityCheckSuccessRate || 0}%`}
                </p>
                <TrendingUp className="w-8 h-8 text-[#27ae60]" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Payment integrity checks</p>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Analysis Tool */}
        <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] w-full" data-testid="card-analysis-tool">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
              <Search className="w-5 h-5 text-[#27ae60]" />
              Transaction Risk Analysis
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              Analyze any transaction for fraud signals, payment integrity issues, and behavioral anomalies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="transaction-id" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Transaction ID</Label>
                <Input
                  id="transaction-id"
                  data-testid="input-transaction-id"
                  type="number"
                  placeholder="Enter transaction ID (e.g., 1, 2, 3)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="border-[#e4e4e4]"
                />
              </div>
              <div className="flex items-end">
                <Button
                  data-testid="button-analyze"
                  onClick={handleAnalyze}
                  disabled={analyzeTransaction.isPending}
                  className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                >
                  {analyzeTransaction.isPending ? (
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Analyzing...</span>
                  ) : (
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Analyze Transaction</span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Tables */}
        <Tabs defaultValue="signals" className="space-y-6 w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 bg-gray-200 rounded-lg p-1" data-testid="tabs-list">
            <TabsTrigger value="signals" data-testid="tab-signals" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Fraud Signals</TabsTrigger>
            <TabsTrigger value="anomalies" data-testid="tab-anomalies" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Anomalies</TabsTrigger>
            <TabsTrigger value="disputes" data-testid="tab-disputes" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Disputes</TabsTrigger>
            <TabsTrigger value="arbitrations" data-testid="tab-arbitrations" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Arbitrations</TabsTrigger>
          </TabsList>

          <TabsContent value="signals" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-fraud-signals-table">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Recent Fraud Signals</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time fraud detection alerts and risk indicators</CardDescription>
              </CardHeader>
              <CardContent>
                {signalsLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading fraud signals...</p>
                ) : !fraudSignals || (fraudSignals as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-signals" className="bg-[#fcfcfc] border border-[#e4e4e4]">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No fraud signals detected. Analyze a transaction to see results here.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Transaction ID</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Signal Type</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Severity</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Fraud Score</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Category</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Detection Source</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Detected At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(fraudSignals as any[]).slice(0, 10).map((signal: any) => (
                          <TableRow key={signal.id} data-testid={`row-signal-${signal.id}`} className="hover:bg-[#f6f6f6]">
                            <TableCell className="font-medium whitespace-nowrap [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{signal.transactionId}</TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{signal.signalType}</TableCell>
                            <TableCell>
                              <Badge variant={getSeverityColor(signal.severity)} className="whitespace-nowrap text-xs rounded-full">
                                {signal.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{parseFloat(signal.fraudScore).toFixed(2)}</TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{signal.riskCategory?.replace(/_/g, ' ')}</TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{signal.detectionSource?.replace(/_/g, ' ')}</TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(signal.detectedAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anomalies" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-anomalies-table">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Transaction Anomalies</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Behavioral and pattern-based anomaly detection</CardDescription>
              </CardHeader>
              <CardContent>
                {anomaliesLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading anomalies...</p>
                ) : !anomalies || (anomalies as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-anomalies" className="bg-[#fcfcfc] border border-[#e4e4e4]">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No anomalies detected. High-value transactions (&gt;£1000) trigger anomaly analysis.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Transaction ID</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Anomaly Type</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Severity</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Anomaly Score</TableHead>
                          <TableHead className="min-w-[200px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Description</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Detected At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(anomalies as any[]).slice(0, 10).map((anomaly: any) => (
                          <TableRow key={anomaly.id} data-testid={`row-anomaly-${anomaly.id}`} className="hover:bg-[#f6f6f6]">
                            <TableCell className="font-medium whitespace-nowrap [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{anomaly.transactionId}</TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{anomaly.anomalyType}</TableCell>
                            <TableCell>
                              <Badge variant={getSeverityColor(anomaly.severity)} className="whitespace-nowrap text-xs rounded-full">
                                {anomaly.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{parseFloat(anomaly.anomalyScore).toFixed(2)}</TableCell>
                            <TableCell className="max-w-[250px] truncate [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]" title={anomaly.description}>{anomaly.description}</TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(anomaly.detectedAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-disputes-table">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Transaction Disputes</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Customer-initiated dispute cases requiring investigation</CardDescription>
              </CardHeader>
              <CardContent>
                {disputesLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading disputes...</p>
                ) : !disputes || (disputes as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-disputes" className="bg-[#fcfcfc] border border-[#e4e4e4]">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No active disputes. Disputed transactions appear here for investigation.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">ID</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Transaction ID</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Raised By</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Reason</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(disputes as any[]).slice(0, 10).map((dispute: any) => (
                          <TableRow key={dispute.id} data-testid={`row-dispute-${dispute.id}`} className="hover:bg-[#f6f6f6]">
                            <TableCell className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{dispute.id}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{dispute.transactionId}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{dispute.raisedBy}</TableCell>
                            <TableCell className="max-w-md truncate [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{dispute.reason}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{dispute.status}</Badge>
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(dispute.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="arbitrations" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-arbitrations-table">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Arbitration Cases</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Formal arbitration processes for complex disputes</CardDescription>
              </CardHeader>
              <CardContent>
                {arbitrationsLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading arbitration cases...</p>
                ) : !arbitrations || (arbitrations as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-arbitrations" className="bg-[#fcfcfc] border border-[#e4e4e4]">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No active arbitration cases. Escalated disputes appear here for formal resolution.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Case ID</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Dispute ID</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Assigned To</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Created At</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Resolution Due</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(arbitrations as any[]).slice(0, 10).map((arb: any) => (
                          <TableRow key={arb.id} data-testid={`row-arbitration-${arb.id}`} className="hover:bg-[#f6f6f6]">
                            <TableCell className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{arb.id}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{arb.disputeId}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{arb.status}</Badge>
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{arb.assignedArbitratorId || "Unassigned"}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(arb.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{arb.resolutionDeadline ? new Date(arb.resolutionDeadline).toLocaleDateString() : "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </main>
  );
}
