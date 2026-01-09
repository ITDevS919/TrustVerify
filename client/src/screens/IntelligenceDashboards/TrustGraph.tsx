import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  GitBranch, 
  AlertTriangle, 
  Building2, 
  Link, 
  Loader2,
  Search,
  Shield,
  Users,
  Activity
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function TrustGraphDashboard() {
  const [discoverInput, setDiscoverInput] = useState("");
  const [selectedEntityId, setSelectedEntityId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/v1/trustgraph/dashboard/stats"],
  });

  // Fetch all entities
  const { data: entities, isLoading: entitiesLoading } = useQuery({
    queryKey: ["/api/v1/trustgraph/entities"],
  });

  // Fetch network for selected entity
  const { data: networkData } = useQuery({
    queryKey: ["/api/v1/trustgraph/entities", selectedEntityId, "network"],
    enabled: !!selectedEntityId,
  });

  // Discover relationships mutation
  const discoverMutation = useMutation({
    mutationFn: async (data: { entityName: string; entityType?: string; jurisdiction?: string; industry?: string }) => {
      return apiRequest("/api/v1/trustgraph/discover", "POST", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Discovery Complete",
        description: `Found ${data.relationshipsDiscovered} relationships for ${data.entity.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/trustgraph/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/v1/trustgraph/entities"] });
      setDiscoverInput("");
      setSelectedEntityId(data.entity.id);
    },
    onError: (error: any) => {
      toast({
        title: "Discovery Failed",
        description: error.message || "Failed to discover relationships",
        variant: "destructive",
      });
    },
  });

  const handleDiscover = () => {
    if (!discoverInput.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a company or entity name",
        variant: "destructive",
      });
      return;
    }
    discoverMutation.mutate({
      entityName: discoverInput,
      entityType: "company",
    });
  };

  const getRiskLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-blue-500 text-white";
      case "safe":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div>
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-2">
              <Network className="h-8 w-8 text-[#27ae60]" />
              TrustGraph Intelligence
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
              Relationship Intelligence & Network Analysis
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        {statsLoading ? (
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#27ae60]" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] border-l-4 border-l-[#003d2b]" data-testid="card-stat-entities">
              <CardHeader className="pb-2">
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Total Entities</CardDescription>
                <CardTitle className="text-3xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]" data-testid="text-total-entities">
                  {stats?.totalEntities || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  <Building2 className="h-4 w-4 mr-1" />
                  Tracked entities
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] border-l-4 border-l-[#27ae60]" data-testid="card-stat-relationships">
              <CardHeader className="pb-2">
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Total Relationships</CardDescription>
                <CardTitle className="text-3xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]" data-testid="text-total-relationships">
                  {stats?.totalRelationships || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  <Link className="h-4 w-4 mr-1" />
                  {stats?.verifiedRelationships || 0} verified
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] border-l-4 border-l-[#f59e0b]" data-testid="card-stat-network-size">
              <CardHeader className="pb-2">
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Avg Network Size</CardDescription>
                <CardTitle className="text-3xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]" data-testid="text-avg-network-size">
                  {stats?.averageNetworkSize?.toFixed(1) || "0.0"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  <GitBranch className="h-4 w-4 mr-1" />
                  Connections per entity
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200 border-l-4 border-l-red-500" data-testid="card-stat-high-risk">
              <CardHeader className="pb-2">
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">High-Risk Connections</CardDescription>
                <CardTitle className="text-3xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-red-700" data-testid="text-high-risk-connections">
                  {stats?.highRiskConnections || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                  Conflicts detected
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Discover Relationships */}
        <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]" data-testid="card-discover-relationships">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
              <Search className="h-5 w-5 text-[#27ae60]" />
              Discover Entity Relationships
            </CardTitle>
            <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              Enter a company name to discover and map its relationships across the network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="entity-name" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Entity Name</Label>
                <Input
                  id="entity-name"
                  data-testid="input-entity-name"
                  placeholder="e.g., Acme Corporation, Apple Inc., Tesla Inc."
                  value={discoverInput}
                  onChange={(e) => setDiscoverInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
                  disabled={discoverMutation.isPending}
                  className="[font-family:'DM_Sans_18pt-Regular',Helvetica]"
                />
              </div>
              <div className="flex items-end">
                <Button
                  data-testid="button-discover"
                  onClick={handleDiscover}
                  disabled={discoverMutation.isPending}
                  className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 text-white h-[48px] rounded-[10px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium"
                >
                  {discoverMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Discovering...
                    </>
                  ) : (
                    <>
                      <Network className="h-4 w-4 mr-2" />
                      Discover
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Entities and Network */}
        <Tabs defaultValue="entities" className="space-y-4 w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-gray-200 rounded-lg p-1" data-testid="tabs-list">
            <TabsTrigger value="entities" data-testid="tab-entities" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Users className="h-4 w-4 mr-2" />
              Entities
            </TabsTrigger>
            <TabsTrigger value="network" data-testid="tab-network" disabled={!selectedEntityId} className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
              <Activity className="h-4 w-4 mr-2" />
              Network View
            </TabsTrigger>
          </TabsList>

          {/* Entities List */}
          <TabsContent value="entities" className="space-y-4">
            {entitiesLoading ? (
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardContent className="py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#27ae60]" />
                  </div>
                </CardContent>
              </Card>
            ) : entities && entities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entities.map((entity: any) => (
                  <Card
                    key={entity.id}
                    data-testid={`card-entity-${entity.id}`}
                    className={`bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] cursor-pointer transition-all hover:shadow-lg ${
                      selectedEntityId === entity.id ? "ring-2 ring-[#27ae60]" : ""
                    }`}
                    onClick={() => setSelectedEntityId(entity.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                            <Building2 className="h-4 w-4 text-[#27ae60]" />
                            {entity.entityName}
                          </CardTitle>
                          <CardDescription className="mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {entity.entityType} {entity.jurisdiction && `• ${entity.jurisdiction}`}
                          </CardDescription>
                        </div>
                        <Badge className={`${getRiskLevelColor(entity.riskLevel)} rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium`}>
                          {entity.riskLevel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {entity.networkMetrics ? (
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Connections</div>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg text-[#003d2b]" data-testid={`text-connections-${entity.id}`}>
                              {entity.networkMetrics.totalRelationships}
                            </div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk Exposure</div>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg text-[#003d2b]" data-testid={`text-risk-exposure-${entity.id}`}>
                              {parseFloat(entity.networkMetrics.riskExposureScore).toFixed(0)}
                            </div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Centrality</div>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-lg text-[#003d2b]">
                              {parseFloat(entity.networkMetrics.degreeCentrality || "0").toFixed(1)}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                          No network metrics available
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardContent className="py-12 text-center">
                  <Network className="h-16 w-16 text-[#808080] mx-auto mb-4" />
                  <h3 className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">
                    No Entities Found
                  </h3>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-4">
                    Discover your first entity to start building the relationship network
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Network View */}
          <TabsContent value="network" className="space-y-4">
            {selectedEntityId && networkData ? (
              <div className="space-y-4">
                {/* Entity Details */}
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <Shield className="h-5 w-5 text-[#27ae60]" />
                      {(networkData as any).entity.entityName}
                    </CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      {(networkData as any).entity.entityType} • {(networkData as any).entity.jurisdiction || "Unknown Jurisdiction"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(networkData as any).metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Total Connections</div>
                          <div className="text-2xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{(networkData as any).metrics.totalRelationships}</div>
                        </div>
                        <div>
                          <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Ownership Links</div>
                          <div className="text-2xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{(networkData as any).metrics.ownershipRelationships}</div>
                        </div>
                        <div>
                          <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Supplier/Customer</div>
                          <div className="text-2xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{(networkData as any).metrics.supplierRelationships}</div>
                        </div>
                        <div>
                          <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Risk Exposure</div>
                          <div className="text-2xl [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-red-700">
                            {parseFloat((networkData as any).metrics.riskExposureScore).toFixed(0)}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Relationships */}
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <GitBranch className="h-5 w-5 text-[#27ae60]" />
                      Relationship Map ({(networkData as any).relationships.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(networkData as any).relationships.length > 0 ? (
                      <div className="space-y-3">
                        {(networkData as any).relationships.map((rel: any) => {
                          const isSource = rel.sourceEntityId === selectedEntityId;
                          const relatedEntity = (networkData as any).entities.find(
                            (e: any) => e.id === (isSource ? rel.targetEntityId : rel.sourceEntityId)
                          );
                          const relType = (networkData as any).relationshipTypes.find(
                            (t: any) => t.id === rel.relationshipTypeId
                          );

                          return (
                            <div
                              key={rel.id}
                              data-testid={`relationship-${rel.id}`}
                              className="flex items-center justify-between p-3 border border-[#e4e4e4] rounded-lg hover:bg-[#f6f6f6] bg-[#fcfcfc]"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div
                                  className={`w-3 h-3 rounded-full`}
                                  style={{ backgroundColor: relType?.color || "#6B7280" }}
                                />
                                <div className="flex-1">
                                  <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">
                                    {isSource ? "→" : "←"} {relatedEntity?.entityName || "Unknown Entity"}
                                  </div>
                                  <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                    {relType?.typeName || "Unknown Relationship"}
                                    {rel.ownershipPercentage && (
                                      <span className="ml-2">
                                        ({parseFloat(rel.ownershipPercentage).toFixed(1)}% ownership)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                  Strength: {rel.strength}/100
                                </div>
                                <Badge variant="outline" className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">{rel.verificationStatus}</Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                        No relationships found for this entity
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardContent className="py-12 text-center">
                  <Network className="h-16 w-16 text-[#808080] mx-auto mb-4" />
                  <h3 className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">
                    No Entity Selected
                  </h3>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Select an entity from the Entities tab to view its network
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </main>
  );
}
