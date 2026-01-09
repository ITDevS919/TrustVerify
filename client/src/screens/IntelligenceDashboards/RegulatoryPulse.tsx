import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Shield,
  AlertTriangle,
  Globe,
  Search,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function RegulatoryPulseDashboard() {
  const [entityId, setEntityId] = useState("");
  const [entityName, setEntityName] = useState("");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>("all");
  const [selectedImpactLevel, setSelectedImpactLevel] = useState<string>("all");
  const { toast } = useToast();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/v1/regulatory-pulse/dashboard/stats"],
  });

  // Fetch screening results
  const { data: screeningResults, isLoading: screeningLoading } = useQuery({
    queryKey: ["/api/v1/regulatory-pulse/screening-results"],
  });

  // Fetch regulatory changes
  const { data: regulatoryChanges, isLoading: changesLoading } = useQuery({
    queryKey: [
      "/api/v1/regulatory-pulse/regulatory-changes",
      { impactLevel: selectedImpactLevel !== "all" ? selectedImpactLevel : undefined },
    ],
  });

  // Fetch compliance rules
  const { data: complianceRules, isLoading: rulesLoading } = useQuery({
    queryKey: [
      "/api/v1/regulatory-pulse/compliance-rules",
      { jurisdiction: selectedJurisdiction !== "all" ? selectedJurisdiction : undefined },
    ],
  });

  // Fetch jurisdiction compliance
  const { data: jurisdictionCompliance, isLoading: complianceLoading } = useQuery({
    queryKey: ["/api/v1/regulatory-pulse/jurisdiction-compliance"],
  });

  // Screen entity mutation
  const screenEntity = useMutation({
    mutationFn: async (data: { entityId: string; entityName: string }) => {
      const response = await fetch(`/api/v1/regulatory-pulse/screen/${data.entityId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ entityName: data.entityName }),
      });
      if (!response.ok) throw new Error("Failed to screen entity");
      return response.json();
    },
    onSuccess: (data: any) => {
      const screening = data.screening;
      toast({
        title: screening.matchFound ? "⚠️ Match Found" : "✅ Clear",
        description: data.recommendation,
        variant: screening.matchFound ? "destructive" : "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/regulatory-pulse/screening-results"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/regulatory-pulse/dashboard/stats"] });
      setEntityId("");
      setEntityName("");
    },
    onError: () => {
      toast({
        title: "Screening Failed",
        description: "Failed to screen entity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleScreenEntity = () => {
    if (!entityId || !entityName) {
      toast({
        title: "Missing Information",
        description: "Please enter both entity ID and name.",
        variant: "destructive",
      });
      return;
    }
    screenEntity.mutate({ entityId, entityName });
  };

  const getRiskLevelBadge = (riskLevel: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      clear: "outline",
      low: "secondary",
      medium: "default",
      high: "destructive",
      blocked: "destructive",
    };
    return variants[riskLevel] || "default";
  };

  const getImpactLevelBadge = (impactLevel: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      low: "outline",
      medium: "secondary",
      high: "default",
      critical: "destructive",
    };
    return variants[impactLevel] || "default";
  };

  const getComplianceStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      compliant: "outline",
      partial: "secondary",
      in_progress: "default",
      non_compliant: "destructive",
    };
    return variants[status] || "default";
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div>
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#27ae60]" />
              Global Regulatory Pulse
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
              Sanctions screening, compliance monitoring, and regulatory intelligence
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-sanctions-lists">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Sanctions Lists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-sanctions-lists">
                  {statsLoading ? "..." : (stats as any)?.totalSanctionsLists || 0}
                </p>
                <Globe className="w-8 h-8 text-[#27ae60]/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Active global lists</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200" data-testid="card-sanctioned-entities">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Sanctioned Entities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-700" data-testid="text-sanctioned-entities">
                  {statsLoading ? "..." : (stats as any)?.totalSanctionedEntities || 0}
                </p>
                <AlertTriangle className="w-8 h-8 text-red-500/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-red-600 mt-2">Tracked entities</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-pending-reviews">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Pending Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-pending-reviews">
                  {statsLoading ? "..." : (stats as any)?.pendingScreeningReviews || 0}
                </p>
                <Search className="w-8 h-8 text-amber-500/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Screening matches</p>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-compliance-score">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">
                Avg Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]" data-testid="text-compliance-score">
                  {statsLoading ? "..." : (stats as any)?.averageComplianceScore || "0"}
                </p>
                <TrendingUp className="w-8 h-8 text-[#27ae60]/30" />
              </div>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Out of 100</p>
            </CardContent>
          </Card>
        </div>

        {/* Sanctions Screening Tool */}
        <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-screening-tool">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Sanctions Screening</CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              Screen entities against global sanctions lists (OFAC, EU, UN, UK)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">
                  Entity ID
                </label>
                <Input
                  data-testid="input-entity-id"
                  placeholder="e.g., USER-12345 or COMPANY-67890"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica]"
                />
              </div>
              <div>
                <label className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">
                  Entity Name
                </label>
                <Input
                  data-testid="input-entity-name"
                  placeholder="e.g., John Doe or Acme Corp"
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  className="mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica]"
                />
              </div>
            </div>
            <Button
              data-testid="button-screen-entity"
              onClick={handleScreenEntity}
              disabled={screenEntity.isPending}
              className="w-full md:w-auto bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 text-white h-[48px] rounded-[10px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium"
            >
              <Search className="w-4 h-4 mr-2" />
              {screenEntity.isPending ? "Screening..." : "Screen Entity"}
            </Button>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="screening" className="space-y-6 w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 bg-gray-200 rounded-lg p-1">
            <TabsTrigger value="screening" data-testid="tab-screening" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Screening Results</TabsTrigger>
            <TabsTrigger value="changes" data-testid="tab-changes" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Regulatory Changes</TabsTrigger>
            <TabsTrigger value="compliance" data-testid="tab-compliance" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Compliance Rules</TabsTrigger>
            <TabsTrigger value="jurisdiction" data-testid="tab-jurisdiction" className="text-xs sm:text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Jurisdictions</TabsTrigger>
          </TabsList>

          {/* Screening Results Tab */}
          <TabsContent value="screening" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-screening-results">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Recent Screening Results</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sanctions screening checks and matches</CardDescription>
              </CardHeader>
              <CardContent>
                {screeningLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading screening results...</p>
                ) : !screeningResults || (screeningResults as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-screening">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No screening results yet. Use the screening tool above to check entities.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Entity Name</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Type</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Level</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Match Score</TableHead>
                          <TableHead className="min-w-[100px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="min-w-[120px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Screened</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(screeningResults as any[]).slice(0, 20).map((result: any) => (
                          <TableRow key={result.id} data-testid={`row-screening-${result.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium max-w-[200px] truncate text-[#003d2b]" title={result.entityName}>{result.entityName}</TableCell>
                            <TableCell className="capitalize whitespace-nowrap [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{result.entityType}</TableCell>
                            <TableCell>
                              <Badge variant={getRiskLevelBadge(result.riskLevel)} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {result.riskLevel || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {result.matchScore ? `${parseFloat(result.matchScore).toFixed(1)}%` : "N/A"}
                            </TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {result.reviewStatus.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(result.screeningDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regulatory Changes Tab */}
          <TabsContent value="changes" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-regulatory-changes">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Regulatory Changes & Alerts</CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Recent regulatory updates and compliance requirements</CardDescription>
                  </div>
                  <Select value={selectedImpactLevel} onValueChange={setSelectedImpactLevel}>
                    <SelectTrigger className="w-[180px]" data-testid="select-impact-level">
                      <SelectValue placeholder="Filter by impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {changesLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading regulatory changes...</p>
                ) : !regulatoryChanges || (regulatoryChanges as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-changes">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No regulatory changes found for the selected filters.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Title</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Jurisdiction</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Impact Level</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Change Type</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Effective Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(regulatoryChanges as any[]).slice(0, 20).map((change: any) => (
                          <TableRow key={change.id} data-testid={`row-change-${change.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium max-w-md text-[#003d2b]">{change.title}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{change.jurisdiction}</TableCell>
                            <TableCell>
                              <Badge variant={getImpactLevelBadge(change.impactLevel)} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {change.impactLevel}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{change.changeType.replace(/_/g, " ")}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(change.effectiveDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Rules Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-compliance-rules">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Compliance Rules</CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Active regulatory requirements by jurisdiction</CardDescription>
                  </div>
                  <Select value={selectedJurisdiction} onValueChange={setSelectedJurisdiction}>
                    <SelectTrigger className="w-[180px]" data-testid="select-jurisdiction">
                      <SelectValue placeholder="Filter by jurisdiction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Jurisdictions</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="Global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {rulesLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading compliance rules...</p>
                ) : !complianceRules || (complianceRules as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-rules">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No compliance rules found for the selected jurisdiction.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Rule Name</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Code</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Category</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Jurisdiction</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Effective Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(complianceRules as any[]).slice(0, 20).map((rule: any) => (
                          <TableRow key={rule.id} data-testid={`row-rule-${rule.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium max-w-md text-[#003d2b]">{rule.ruleName}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{rule.ruleCode}</TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{rule.category.replace(/_/g, " ")}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{rule.jurisdiction}</TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(rule.effectiveDate).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jurisdiction Compliance Tab */}
          <TabsContent value="jurisdiction" className="space-y-4">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-jurisdiction-compliance">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Jurisdiction Compliance Status</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Compliance tracking by region and area</CardDescription>
              </CardHeader>
              <CardContent>
                {complianceLoading ? (
                  <p className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">Loading jurisdiction compliance...</p>
                ) : !jurisdictionCompliance || (jurisdictionCompliance as any[]).length === 0 ? (
                  <Alert data-testid="alert-no-jurisdiction">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      No jurisdiction compliance data available.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Jurisdiction</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Compliance Area</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Score</TableHead>
                          <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Last Assessment</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(jurisdictionCompliance as any[]).map((compliance: any) => (
                          <TableRow key={compliance.id} data-testid={`row-jurisdiction-${compliance.id}`}>
                            <TableCell className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{compliance.jurisdiction}</TableCell>
                            <TableCell className="capitalize [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {compliance.complianceArea.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getComplianceStatusBadge(compliance.status)} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                                {compliance.status.replace(/_/g, " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              {compliance.complianceScore ? `${parseFloat(compliance.complianceScore).toFixed(1)}%` : "N/A"}
                            </TableCell>
                            <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{new Date(compliance.lastAssessment).toLocaleDateString()}</TableCell>
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
