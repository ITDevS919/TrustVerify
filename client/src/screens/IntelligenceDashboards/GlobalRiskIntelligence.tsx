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
  Globe2,
  TrendingUp,
  AlertTriangle,
  MapPin,
  BarChart3,
  Bell,
  ShieldCheck,
} from "lucide-react";

export default function GlobalRiskIntelligenceDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/v1/global-risk/dashboard/stats"],
  });

  // Fetch composite entity scores
  const { data: entityScores, isLoading: entitiesLoading } = useQuery({
    queryKey: ["/api/v1/global-risk/entity-scores"],
  });

  // Fetch country risk profiles
  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ["/api/v1/global-risk/countries"],
  });

  // Fetch industry risk benchmarks
  const { data: industries, isLoading: industriesLoading } = useQuery({
    queryKey: ["/api/v1/global-risk/industries"],
  });

  // Fetch global risk alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/v1/global-risk/alerts"],
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

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      info: "outline",
      low: "outline",
      medium: "secondary",
      high: "default",
      critical: "destructive",
    };
    return variants[severity] || "default";
  };

  const getRiskTierBadge = (tier: string | null) => {
    if (!tier) return "outline";
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      tier_1: "outline",
      tier_2: "secondary",
      tier_3: "default",
      high_risk: "destructive",
    };
    return variants[tier] || "outline";
  };

  const getRiskCategoryBadge = (category: string | null) => {
    if (!category) return "outline";
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      low_risk: "outline",
      moderate_risk: "secondary",
      high_risk: "default",
      critical_risk: "destructive",
    };
    return variants[category] || "outline";
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div>
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-3">
              <Globe2 className="w-8 h-8 text-[#27ae60]" />
              Global Risk Intelligence
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
              Unified cross-module risk assessment and composite scoring
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-total-assessments">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Total Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-total-assessments">
                  {statsLoading ? "..." : (stats as any)?.total_assessments || 0}
                </p>
                <ShieldCheck className="w-8 h-8 text-[#27ae60]/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">
                {statsLoading ? "..." : (stats as any)?.critical_entities || 0} critical entities
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-average-risk">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Average Entity Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-average-risk">
                  {statsLoading ? "..." : parseFloat((stats as any)?.average_entity_risk || 0).toFixed(1)}
                </p>
                <TrendingUp className="w-8 h-8 text-amber-500/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Out of 100</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-countries">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Countries Analyzed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-countries">
                  {statsLoading ? "..." : (stats as any)?.total_countries || 0}
                </p>
                <MapPin className="w-8 h-8 text-[#27ae60]/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">
                {statsLoading ? "..." : (stats as any)?.sanctioned_countries || 0} sanctioned
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200" data-testid="card-critical-alerts">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Critical Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-700" data-testid="text-critical-alerts">
                  {statsLoading ? "..." : (stats as any)?.critical_alerts || 0}
                </p>
                <AlertTriangle className="w-8 h-8 text-red-500/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-red-600 mt-2">
                {statsLoading ? "..." : (stats as any)?.total_active_alerts || 0} total active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different risk views */}
        <Tabs defaultValue="entities" className="space-y-6 w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 bg-gray-200 rounded-lg p-1">
            <TabsTrigger value="entities" data-testid="tab-entities" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Entity Scores</TabsTrigger>
            <TabsTrigger value="countries" data-testid="tab-countries" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Countries</TabsTrigger>
            <TabsTrigger value="industries" data-testid="tab-industries" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Industries</TabsTrigger>
            <TabsTrigger value="alerts" data-testid="tab-alerts" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Alerts</TabsTrigger>
          </TabsList>

          {/* Entity Scores Tab */}
          <TabsContent value="entities" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-entity-scores">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Composite Entity Risk Scores</CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Multi-module aggregated risk intelligence</CardDescription>
                  </div>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-[180px]" data-testid="select-filter">
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="select-option-all">All Levels</SelectItem>
                      <SelectItem value="critical" data-testid="select-option-critical">Critical</SelectItem>
                      <SelectItem value="high" data-testid="select-option-high">High</SelectItem>
                      <SelectItem value="medium" data-testid="select-option-medium">Medium</SelectItem>
                      <SelectItem value="low" data-testid="select-option-low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {entitiesLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading entity scores...</p>
                ) : !entityScores || (entityScores as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-entities">
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No entity risk assessments found. Create composite scores from module data.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Entity</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Overall Risk</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Level</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Confidence</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Module Coverage</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Trend</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Assessment Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(entityScores as any[]).slice(0, 20).map((item: any) => (
                          <TableRow key={item.score.id} data-testid={`row-entity-${item.score.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium max-w-[200px] truncate text-[#003d2b]" title={item.entity?.entityName || `Entity #${item.score.entityId}`}>
                              {item.entity?.entityName || `Entity #${item.score.entityId}`}
                            </TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {item.score.overallRiskScore ? parseFloat(item.score.overallRiskScore).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRiskLevelBadge(item.score.riskLevel)} className="whitespace-nowrap text-xs bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {item.score.riskLevel}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {item.score.confidenceScore ? `${parseFloat(item.score.confidenceScore).toFixed(0)}%` : "N/A"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.score.dataSourcesCount || 0} / 5</TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{item.score.trendDirection || "—"}</TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {item.score.assessmentDate ? new Date(item.score.assessmentDate).toLocaleDateString() : "N/A"}
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

          {/* Countries Tab */}
          <TabsContent value="countries" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-countries">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Country Risk Profiles</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sovereign risk intelligence and geopolitical analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {countriesLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading country profiles...</p>
                ) : !countries || (countries as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-countries">
                    <MapPin className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No country risk profiles available. Add country assessments to track sovereign risk.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Country</TableHead>
                          <TableHead className="min-w-[80px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Code</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Overall Risk</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Tier</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Region</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Sanctioned</TableHead>
                          <TableHead className="min-w-[140px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Assessment Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(countries as any[]).slice(0, 20).map((country: any) => (
                          <TableRow key={country.id} data-testid={`row-country-${country.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium whitespace-nowrap text-[#003d2b]">{country.countryName}</TableCell>
                            <TableCell className="uppercase whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{country.countryCode}</TableCell>
                            <TableCell className="whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {country.overallCountryRisk ? parseFloat(country.overallCountryRisk).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRiskTierBadge(country.riskTier)} className="whitespace-nowrap text-xs bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {country.riskTier?.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{country.region || "—"}</TableCell>
                            <TableCell>
                              {country.isSanctioned ? (
                                <Badge variant="destructive" className="whitespace-nowrap text-xs bg-red-100 text-red-700 hover:bg-red-100 rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Yes</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">No</Badge>
                              )}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {country.assessmentDate ? new Date(country.assessmentDate).toLocaleDateString() : "N/A"}
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

          {/* Industries Tab */}
          <TabsContent value="industries" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-industries">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Industry Risk Benchmarks</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sector-level risk baselines and threat intelligence</CardDescription>
              </CardHeader>
              <CardContent>
                {industriesLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading industry benchmarks...</p>
                ) : !industries || (industries as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-industries">
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No industry benchmarks found. Add sector risk data to track industry trends.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Industry</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Sector</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Overall Risk</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Category</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Cybercrime Threat</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Fraud Rate</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Benchmark Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(industries as any[]).slice(0, 20).map((industry: any) => (
                          <TableRow key={industry.id} data-testid={`row-industry-${industry.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{industry.industryName}</TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{industry.industrySector}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {industry.overallIndustryRisk ? parseFloat(industry.overallIndustryRisk).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getRiskCategoryBadge(industry.riskCategory)} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {industry.riskCategory?.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {industry.cybercrimeThreatLevel ? parseFloat(industry.cybercrimeThreatLevel).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {industry.fraudIncidenceRate ? parseFloat(industry.fraudIncidenceRate).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {industry.benchmarkDate ? new Date(industry.benchmarkDate).toLocaleDateString() : "N/A"}
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

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-alerts">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Global Risk Alerts</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cross-module critical risk events and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                {alertsLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading risk alerts...</p>
                ) : !alerts || (alerts as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-alerts">
                    <Bell className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No active risk alerts. Critical events from all modules will appear here.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Alert Title</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Type</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Severity</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Source Module</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Score</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Created</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(alerts as any[]).slice(0, 20).map((alert: any) => (
                          <TableRow key={alert.id} data-testid={`row-alert-${alert.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{alert.title}</TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{alert.alertType.replace(/_/g, " ")}</TableCell>
                            <TableCell>
                              <Badge variant={getSeverityBadge(alert.severity)} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {alert.severity}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{alert.sourceModule}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {alert.riskScore ? parseFloat(alert.riskScore).toFixed(1) : "N/A"}
                            </TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{alert.status.replace(/_/g, " ")}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {alert.createdAt ? new Date(alert.createdAt).toLocaleDateString() : "N/A"}
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
        </Tabs>
      </div>
      
      <Footer />
    </main>
  );
}
