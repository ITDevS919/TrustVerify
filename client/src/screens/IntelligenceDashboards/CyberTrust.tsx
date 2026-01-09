import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Globe,
  Activity,
  Lock,
  Unlock,
  Database,
  Bug,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalAssets: number;
  totalSignals: number;
  criticalSignals: number;
  averageScore: number;
  riskDistribution: Array<{
    riskLevel: string;
    count: number;
  }>;
}

interface CyberAsset {
  id: number;
  assetValue: string;
  assetType: string;
  cyberTrustIndex: string;
  riskLevel: string;
  lastAnalyzed: string;
  vulnerabilityCount: number;
  isBlacklisted: boolean;
  isMalwareHost: boolean;
}

interface CyberTrustAssessment {
  id: number;
  cyberTrustIndex: string;
  riskLevel: string;
  assessmentDate: string;
  criticalFindings: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  assetsScanned: number;
}

function getRiskLevelColor(riskLevel: string): string {
  switch (riskLevel) {
    case "secure":
      return "bg-[#27ae60]/10 text-[#27ae60] border-[#27ae60]/20";
    case "low":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-600 border-orange-500/20";
    case "critical":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-[#27ae60]";
  if (score >= 70) return "text-blue-600";
  if (score >= 55) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export default function CyberTrustDashboard() {
  const [domainToAssess, setDomainToAssess] = useState("");
  const { toast } = useToast();

  // Fetch dashboard stats
  const { data: statsData } = useQuery<{
    stats: DashboardStats;
    recentAssessments: CyberTrustAssessment[];
  }>({
    queryKey: ["/api/v1/cybertrust/dashboard/stats"],
  });

  // Fetch all assets
  const { data: assetsData, isLoading: assetsLoading } = useQuery<{
    assets: CyberAsset[];
  }>({
    queryKey: ["/api/v1/cybertrust/assets"],
  });

  // Fetch all assessments
  const { data: assessmentsData } = useQuery<{
    assessments: CyberTrustAssessment[];
  }>({
    queryKey: ["/api/v1/cybertrust/assessments"],
  });

  // Assess domain mutation
  const assessMutation = useMutation({
    mutationFn: async (domain: string) => {
      return await apiRequest("POST", "/api/v1/cybertrust/assess", { domain });
    },
    onSuccess: () => {
      toast({
        title: "Assessment Complete",
        description: "CyberTrust Index has been calculated successfully.",
      });
      // Invalidate all related queries to refresh dashboard data
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cybertrust/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cybertrust/assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/cybertrust/assessments"] });
      setDomainToAssess("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Assessment Failed",
        description: error.message || "Failed to assess domain",
      });
    },
  });

  const handleAssess = () => {
    if (!domainToAssess) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a domain to assess",
      });
      return;
    }
    assessMutation.mutate(domainToAssess);
  };

  const stats = statsData?.stats;
  const recentAssessments = statsData?.recentAssessments || [];
  const assets = assetsData?.assets || [];
  const assessments = assessmentsData?.assessments || [];

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="w-full mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-[#27ae60]" />
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl">
              CyberTrust Index
            </h1>
          </div>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
            Comprehensive cyber risk intelligence and threat monitoring
          </p>
        </div>

        {/* Domain Assessment Card */}
        <Card className="mb-8 bg-[#fcfcfc] rounded-[20px] border-2 border-[#e4e4e4] w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
              <Search className="w-5 h-5 text-[#27ae60]" />
              Assess New Domain
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              Run a comprehensive cybersecurity assessment on any domain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                data-testid="input-assess-domain"
                placeholder="example.com"
                value={domainToAssess}
                onChange={(e) => setDomainToAssess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAssess()}
                className="flex-1 border-[#e4e4e4]"
              />
              <Button
                data-testid="button-assess"
                onClick={handleAssess}
                disabled={assessMutation.isPending}
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                {assessMutation.isPending ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Assessing...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Assess Domain</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Total Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">
                  {stats?.totalAssets || 0}
                </div>
                <Globe className="w-8 h-8 text-[#27ae60]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Average CTI Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] ${getScoreColor(stats?.averageScore || 0)}`}>
                  {stats?.averageScore?.toFixed(1) || "0.0"}
                </div>
                <TrendingUp className="w-8 h-8 text-[#27ae60]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-600">
                  {stats?.criticalSignals || 0}
                </div>
                <ShieldAlert className="w-8 h-8 text-red-600/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Threat Signals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">
                  {stats?.totalSignals || 0}
                </div>
                <Activity className="w-8 h-8 text-[#27ae60]/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Distribution */}
        {stats && stats.riskDistribution.length > 0 && (
          <Card className="mb-8 bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] w-full">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Risk Level Distribution</CardTitle>
              <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Breakdown of assets by risk classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.riskDistribution.map((item) => {
                  const percentage =
                    stats.totalAssets > 0 ? (item.count / stats.totalAssets) * 100 : 0;
                  return (
                    <div key={item.riskLevel} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{item.riskLevel}</span>
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                          {item.count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for detailed views */}
        <Tabs defaultValue="assets" className="space-y-6 w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1 bg-gray-200 rounded-lg p-1">
            <TabsTrigger value="assets" data-testid="tab-assets" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Database className="w-4 h-4 mr-2" />
              Assets ({assets.length})
            </TabsTrigger>
            <TabsTrigger value="assessments" data-testid="tab-assessments" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Shield className="w-4 h-4 mr-2" />
              Assessments ({assessments.length})
            </TabsTrigger>
            <TabsTrigger value="recent" data-testid="tab-recent" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Clock className="w-4 h-4 mr-2" />
              Recent Activity
            </TabsTrigger>
          </TabsList>

          {/* Assets Tab */}
          <TabsContent value="assets">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Monitored Assets</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  All domains and cyber assets under continuous monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assetsLoading ? (
                  <div className="text-center py-8 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Loading assets...</div>
                ) : assets.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-[#808080]/30" />
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                      No assets assessed yet
                    </p>
                    <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      Use the assessment tool above to analyze your first domain
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {assets.map((asset) => {
                        const score = parseFloat(asset.cyberTrustIndex);
                        return (
                          <Card
                            key={asset.id}
                            className="bg-[#fcfcfc] rounded-[20px] border-2 border-[#e4e4e4] hover:shadow-md transition-shadow"
                            data-testid={`card-asset-${asset.id}`}
                          >
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{asset.assetValue}</h3>
                                    <Badge
                                      variant="outline"
                                      className={`rounded-full ${getRiskLevelColor(asset.riskLevel)}`}
                                    >
                                      {asset.riskLevel}
                                    </Badge>
                                  </div>
                                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    Last analyzed:{" "}
                                    {asset.lastAnalyzed
                                      ? new Date(asset.lastAnalyzed).toLocaleDateString()
                                      : "Never"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-4xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] ${getScoreColor(score)}`}>
                                    {score.toFixed(0)}
                                  </div>
                                  <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    CTI Score
                                  </div>
                                </div>
                              </div>

                              <Separator className="my-4" />

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                  {asset.isBlacklisted ? (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4 text-[#27ae60]" />
                                  )}
                                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                                    {asset.isBlacklisted ? "Blacklisted" : "Clean"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {asset.isMalwareHost ? (
                                    <Bug className="w-4 h-4 text-red-500" />
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4 text-[#27ae60]" />
                                  )}
                                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                                    {asset.isMalwareHost ? "Malware" : "Safe"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                                    {asset.vulnerabilityCount || 0} Vulns
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {asset.assetType === "domain" ? (
                                    <Globe className="w-4 h-4 text-[#27ae60]" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-[#27ae60]" />
                                  )}
                                  <span className="text-sm capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{asset.assetType}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Assessment History</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Complete assessment reports and findings</CardDescription>
              </CardHeader>
              <CardContent>
                {assessments.length === 0 ? (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-[#808080]/30" />
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">No assessments yet</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {assessments.map((assessment) => {
                        const score = parseFloat(assessment.cyberTrustIndex);
                        const totalFindings =
                          assessment.criticalFindings +
                          assessment.highFindings +
                          assessment.mediumFindings +
                          assessment.lowFindings;

                        return (
                          <Card
                            key={assessment.id}
                            className="bg-[#fcfcfc] rounded-[20px] border-2 border-[#e4e4e4]"
                            data-testid={`card-assessment-${assessment.id}`}
                          >
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">
                                      Assessment #{assessment.id}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className={`rounded-full ${getRiskLevelColor(assessment.riskLevel)}`}
                                    >
                                      {assessment.riskLevel}
                                    </Badge>
                                  </div>
                                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    {new Date(assessment.assessmentDate).toLocaleDateString()} •{" "}
                                    {assessment.assetsScanned} assets scanned
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className={`text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] ${getScoreColor(score)}`}>
                                    {score.toFixed(1)}
                                  </div>
                                </div>
                              </div>

                              <Separator className="my-4" />

                              <div className="grid grid-cols-4 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-600">
                                    {assessment.criticalFindings}
                                  </div>
                                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    Critical
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-orange-600">
                                    {assessment.highFindings}
                                  </div>
                                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    High
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-yellow-600">
                                    {assessment.mediumFindings}
                                  </div>
                                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    Medium
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-blue-600">
                                    {assessment.lowFindings}
                                  </div>
                                  <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    Low
                                  </div>
                                </div>
                              </div>

                              {totalFindings > 0 && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium mb-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Finding Distribution</p>
                                  <Progress
                                    value={(totalFindings / (totalFindings + 10)) * 100}
                                    className="h-2"
                                  />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Activity Tab */}
          <TabsContent value="recent">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Recent Activity</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Latest assessments and threat detections</CardDescription>
              </CardHeader>
              <CardContent>
                {recentAssessments.length === 0 ? (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 mx-auto mb-4 text-[#808080]/30" />
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-[#fcfcfc] border-2 border-[#e4e4e4] hover:shadow-md transition-shadow"
                        data-testid={`recent-assessment-${assessment.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <Shield className="w-8 h-8 text-[#27ae60]" />
                          <div>
                            <p className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Assessment Completed</p>
                            <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {new Date(assessment.assessmentDate).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`rounded-full ${getRiskLevelColor(assessment.riskLevel)}`}>
                          {parseFloat(assessment.cyberTrustIndex).toFixed(1)} - {assessment.riskLevel}
                        </Badge>
                      </div>
                    ))}
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
