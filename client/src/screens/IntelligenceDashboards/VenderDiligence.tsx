import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Activity,
  FileCheck,
  BarChart3,
} from "lucide-react";

export default function VendorDiligenceDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/v1/vendor-diligence/dashboard/stats"],
  });

  // Fetch vendor profiles
  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ["/api/v1/vendor-diligence/vendors"],
  });

  // Fetch risk assessments
  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ["/api/v1/vendor-diligence/assessments"],
  });

  // Fetch compliance checks
  const { data: complianceChecks, isLoading: complianceLoading } = useQuery({
    queryKey: ["/api/v1/vendor-diligence/compliance-checks"],
  });

  // Fetch performance metrics
  const { data: performanceMetrics, isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/v1/vendor-diligence/performance-metrics"],
  });

  // Fetch financial metrics
  const { data: financialMetrics, isLoading: financialLoading } = useQuery({
    queryKey: ["/api/v1/vendor-diligence/financial-metrics"],
  });


  const getRiskLevelBadge = (riskLevel: string | null) => {
    if (!riskLevel) return "outline";
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      low: "outline",
      medium: "secondary",
      high: "default",
      critical: "destructive",
    };
    return variants[riskLevel] || "outline";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "outline",
      approved: "outline",
      pending: "secondary",
      rejected: "destructive",
      paused: "default",
      terminated: "destructive",
    };
    return variants[status] || "default";
  };

  const getComplianceStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      compliant: "outline",
      non_compliant: "destructive",
      partial: "secondary",
      not_applicable: "default",
      pending: "default",
    };
    return variants[status] || "default";
  };

  const getPerformanceTierBadge = (tier: string | null) => {
    if (!tier) return "outline";
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      excellent: "outline",
      good: "secondary",
      acceptable: "default",
      poor: "destructive",
      critical: "destructive",
    };
    return variants[tier] || "outline";
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div>
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#27ae60]" />
              Dynamic Vendor Diligence
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
              Vendor risk assessment, financial health monitoring, and compliance tracking
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-total-vendors">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Total Vendors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-total-vendors">
                  {statsLoading ? "..." : (stats as any)?.total_vendors || 0}
                </p>
                <Building2 className="w-8 h-8 text-[#27ae60]/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">
                {statsLoading ? "..." : (stats as any)?.active_vendors || 0} active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-average-risk">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Average Risk Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-average-risk">
                  {statsLoading ? "..." : parseFloat((stats as any)?.average_risk_score || 0).toFixed(1)}
                </p>
                <ShieldAlert className="w-8 h-8 text-amber-500/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Out of 100</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200" data-testid="card-due-refresh">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Due for Refresh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-700" data-testid="text-due-refresh">
                  {statsLoading ? "..." : (stats as any)?.vendors_due_refresh || 0}
                </p>
                <Activity className="w-8 h-8 text-red-500/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-red-600 mt-2">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200" data-testid="card-critical-events">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Critical Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-700" data-testid="text-critical-events">
                  {statsLoading ? "..." : (stats as any)?.pending_critical_events || 0}
                </p>
                <AlertTriangle className="w-8 h-8 text-red-500/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-red-600 mt-2">Pending review</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="vendors" className="space-y-6 w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 bg-gray-200 rounded-lg p-1">
            <TabsTrigger value="vendors" data-testid="tab-vendors" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Vendors</TabsTrigger>
            <TabsTrigger value="assessments" data-testid="tab-assessments" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Risk Assessments</TabsTrigger>
            <TabsTrigger value="compliance" data-testid="tab-compliance" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Compliance</TabsTrigger>
            <TabsTrigger value="performance" data-testid="tab-performance" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Performance</TabsTrigger>
            <TabsTrigger value="financial" data-testid="tab-financial" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Financial</TabsTrigger>
          </TabsList>

          {/* Vendors Tab */}
          <TabsContent value="vendors" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-vendors">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Vendor Portfolio</CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Active and monitored vendor relationships</CardDescription>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]" data-testid="select-category">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="select-option-all">All Categories</SelectItem>
                      <SelectItem value="financial" data-testid="select-option-financial">Financial</SelectItem>
                      <SelectItem value="technology" data-testid="select-option-technology">Technology</SelectItem>
                      <SelectItem value="legal" data-testid="select-option-legal">Legal</SelectItem>
                      <SelectItem value="cyber" data-testid="select-option-cyber">Cyber Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {vendorsLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading vendors...</p>
                ) : !vendors || (vendors as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-vendors">
                    <Building2 className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No vendors found. Start by adding vendor profiles to your portfolio.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Vendor Name</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Category</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Score</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Diligence Status</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Next Refresh</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(vendors as any[]).slice(0, 20).map((vendor: any) => (
                          <TableRow key={vendor.id} data-testid={`row-vendor-${vendor.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium max-w-[200px] truncate text-[#003d2b]" title={vendor.vendorName}>{vendor.vendorName}</TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{vendor.vendorCategory || "N/A"}</TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadge(vendor.relationshipStatus)} className="whitespace-nowrap text-xs bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
                                {vendor.relationshipStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {vendor.overallRiskScore ? parseFloat(vendor.overallRiskScore).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {vendor.diligenceStatus?.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {vendor.nextRefreshDue ? new Date(vendor.nextRefreshDue).toLocaleDateString() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Assessments Tab */}
          <TabsContent value="assessments" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-assessments">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Risk Assessments</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Comprehensive vendor risk evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                {assessmentsLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading risk assessments...</p>
                ) : !assessments || (assessments as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-assessments">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No risk assessments found. Create vendor risk assessments to track vendor health.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Assessment Date</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Type</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Overall Risk</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Level</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Next Assessment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(assessments as any[]).slice(0, 20).map((assessment: any) => (
                          <TableRow key={assessment.id} data-testid={`row-assessment-${assessment.id}`}>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(assessment.assessmentDate).toLocaleDateString()}</TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{assessment.assessmentType.replace(/_/g, " ")}</TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {assessment.overallRiskScore ? parseFloat(assessment.overallRiskScore).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRiskLevelBadge(assessment.riskLevel)} className="whitespace-nowrap text-xs bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
                                {assessment.riskLevel || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{assessment.status.replace(/_/g, " ")}</TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {assessment.nextAssessmentDue ? new Date(assessment.nextAssessmentDue).toLocaleDateString() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-compliance">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Compliance Checks</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Regulatory and policy compliance tracking</CardDescription>
              </CardHeader>
              <CardContent>
                {complianceLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading compliance checks...</p>
                ) : !complianceChecks || (complianceChecks as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-compliance">
                    <FileCheck className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No compliance checks recorded. Add compliance checks to track vendor regulatory adherence.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Check Type</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Compliance Area</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Score</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Check Date</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Next Review</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(complianceChecks as any[]).slice(0, 20).map((check: any) => (
                          <TableRow key={check.id} data-testid={`row-compliance-${check.id}`}>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{check.checkType.replace(/_/g, " ")}</TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{check.complianceArea.replace(/_/g, " ")}</TableCell>
                            <TableCell>
                              <Badge variant={getComplianceStatusBadge(check.status)} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
                                {check.status.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {check.complianceScore ? `${parseFloat(check.complianceScore).toFixed(1)}%` : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(check.checkDate).toLocaleDateString()}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {check.nextReviewDue ? new Date(check.nextReviewDue).toLocaleDateString() : "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-performance">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Performance Metrics</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Vendor SLA compliance and KPI tracking</CardDescription>
              </CardHeader>
              <CardContent>
                {performanceLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading performance metrics...</p>
                ) : !performanceMetrics || (performanceMetrics as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-performance">
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No performance metrics available. Track vendor performance to measure SLA compliance.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Period</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">SLA Compliance</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">On-Time Delivery</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Satisfaction</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Overall Score</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Performance Tier</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(performanceMetrics as any[]).slice(0, 20).map((metric: any) => (
                          <TableRow key={metric.id} data-testid={`row-performance-${metric.id}`}>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{metric.measurementPeriod}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {metric.slaCompliance ? `${parseFloat(metric.slaCompliance).toFixed(1)}%` : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {metric.onTimeDelivery ? `${parseFloat(metric.onTimeDelivery).toFixed(1)}%` : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {metric.customerSatisfactionScore ? parseFloat(metric.customerSatisfactionScore).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {metric.overallPerformanceScore ? parseFloat(metric.overallPerformanceScore).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getPerformanceTierBadge(metric.performanceTier)} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
                                {metric.performanceTier || "N/A"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-financial">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Financial Health Metrics</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Vendor financial performance and creditworthiness</CardDescription>
              </CardHeader>
              <CardContent>
                {financialLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading financial metrics...</p>
                ) : !financialMetrics || (financialMetrics as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-financial">
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No financial metrics available. Add financial data to monitor vendor financial health.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Reporting Period</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Revenue</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Profit Margin</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Credit Rating</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Health Score</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Report Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(financialMetrics as any[]).slice(0, 20).map((metric: any) => (
                          <TableRow key={metric.id} data-testid={`row-financial-${metric.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{metric.reportingPeriod}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {metric.revenue ? `$${parseFloat(metric.revenue).toLocaleString()}` : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {metric.profitMargin ? `${parseFloat(metric.profitMargin).toFixed(2)}%` : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{metric.creditRating || "N/A"}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {metric.financialHealthScore ? parseFloat(metric.financialHealthScore).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(metric.reportDate).toLocaleDateString()}</TableCell>
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
