import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Target, 
  Building2, 
  TrendingUp, 
  PoundSterling,
  Calendar,
  Activity,
  Plus,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CRMDashboard = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "leads" | "opportunities" | "interactions">("overview");

  // Fetch CRM data
  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/crm/contacts", { page: 1, limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/crm/contacts?page=1&limit=10", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/crm/leads", { page: 1, limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/crm/leads?page=1&limit=10", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch leads");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["/api/crm/opportunities", { page: 1, limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/crm/opportunities?page=1&limit=10", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch opportunities");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["/api/crm/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/crm/analytics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!user,
  });

  const stats = [
    {
      title: "Total Contacts",
      value: analyticsData?.totalContacts || 0,
      icon: Users,
      bgColor: "bg-[#0b3a7833]",
      color: "text-[#0b3a78]",
      trend: "up",
      change: "+12%",
    },
    {
      title: "Active Leads",
      value: analyticsData?.totalLeads || 0,
      icon: Target,
      bgColor: "bg-[#27ae6033]",
      color: "text-[#27ae60]",
      trend: "up",
      change: "+8%",
    },
    {
      title: "Opportunities",
      value: analyticsData?.totalOpportunities || 0,
      icon: TrendingUp,
      bgColor: "bg-[#FFB40033]",
      color: "text-[#FFB400]",
      trend: "up",
      change: "+15%",
    },
    {
      title: "Total Revenue",
      value: `£${((analyticsData?.totalRevenue || 0) / 1000).toFixed(1)}k`,
      icon: PoundSterling,
      bgColor: "bg-[#1DBF7333]",
      color: "text-[#1DBF73]",
      trend: "up",
      change: "+23%",
    },
  ];

  const contacts = contactsData?.contacts || [];
  const leads = leadsData?.leads || [];
  const opportunities = opportunitiesData?.opportunities || [];

  const getLeadStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new": return "bg-[#0b3a7833] text-[#0b3a78]";
      case "contacted": return "bg-[#FFB40033] text-[#FFB400]";
      case "qualified": return "bg-[#27ae6033] text-[#27ae60]";
      case "converted": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "lost": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getOpportunityStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case "prospecting": return "bg-[#0b3a7833] text-[#0b3a78]";
      case "qualification": return "bg-[#FFB40033] text-[#FFB400]";
      case "proposal": return "bg-[#27ae6033] text-[#27ae60]";
      case "negotiation": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "closed_won": return "bg-green-100 text-green-600";
      case "closed_lost": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Please log in to access the CRM portal.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f6]">
      <Header />
      
      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-16">
        {/* Header */}
        <div className="mb-12">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              CRM PORTAL
            </span>
          </Badge>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
            Customer Relationship Management
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
            Manage your contacts, leads, opportunities, and customer interactions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="flex items-center text-sm font-semibold text-[#27ae60]">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#003d2b] mb-1">
                    {stat.value}
                  </div>
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                    {stat.title}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-[#f7f7f7] rounded-[10px] p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-[#003d2b]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white data-[state=active]:text-[#003d2b]">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-white data-[state=active]:text-[#003d2b]">
              Leads
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-white data-[state=active]:text-[#003d2b]">
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="interactions" className="data-[state=active]:bg-white data-[state=active]:text-[#003d2b]">
              Interactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Contacts */}
              <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    Recent Contacts
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("contacts")}
                    className="text-[#0b3a78]"
                  >
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {contactsLoading ? (
                    <div className="text-center py-8 text-[#808080]">Loading...</div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-8 text-[#808080]">No contacts yet</div>
                  ) : (
                    <div className="space-y-4">
                      {contacts.slice(0, 5).map((contact: any) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 bg-[#f7f7f7] rounded-lg">
                          <div>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              {contact.firstName} {contact.lastName}
                            </div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                              {contact.company || contact.email}
                            </div>
                          </div>
                          <Badge className={contact.status === "active" ? "bg-[#27ae6033] text-[#27ae60]" : "bg-gray-100 text-gray-600"}>
                            {contact.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Leads */}
              <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    Recent Leads
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setActiveTab("leads")}
                    className="text-[#0b3a78]"
                  >
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="text-center py-8 text-[#808080]">Loading...</div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-8 text-[#808080]">No leads yet</div>
                  ) : (
                    <div className="space-y-4">
                      {leads.slice(0, 5).map((lead: any) => (
                        <div key={lead.id} className="flex items-center justify-between p-3 bg-[#f7f7f7] rounded-lg">
                          <div>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              {lead.firstName} {lead.lastName}
                            </div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                              {lead.company || lead.email}
                            </div>
                          </div>
                          <Badge className={getLeadStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Opportunities */}
            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  Recent Opportunities
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab("opportunities")}
                  className="text-[#0b3a78]"
                >
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {opportunitiesLoading ? (
                  <div className="text-center py-8 text-[#808080]">Loading...</div>
                ) : opportunities.length === 0 ? (
                  <div className="text-center py-8 text-[#808080]">No opportunities yet</div>
                ) : (
                  <div className="space-y-4">
                    {opportunities.slice(0, 5).map((opp: any) => (
                      <div key={opp.id} className="flex items-center justify-between p-4 bg-[#f7f7f7] rounded-lg">
                        <div className="flex-1">
                          <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-1">
                            {opp.name}
                          </div>
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-2">
                            {opp.description}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              £{parseFloat(opp.value || 0).toLocaleString()}
                            </div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                              {opp.probability}% probability
                            </div>
                          </div>
                        </div>
                        <Badge className={getOpportunityStageColor(opp.stage)}>
                          {opp.stage?.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-2xl text-[#003d2b]">
                All Contacts
              </h2>
              <Button className="bg-app-secondary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
            {contactsLoading ? (
              <div className="text-center py-12 text-[#808080]">Loading contacts...</div>
            ) : contacts.length === 0 ? (
              <Card className="border border-[#e4e4e4] rounded-[20px]">
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-[#808080] mx-auto mb-4" />
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg mb-4">
                    No contacts yet. Start building your customer database.
                  </p>
                  <Button className="bg-app-secondary text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Contact
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map((contact: any) => (
                  <Card key={contact.id} className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`bg-[#0b3a7833] p-3 rounded-lg`}>
                          <Users className="h-6 w-6 text-[#0b3a78]" />
                        </div>
                        <Badge className={contact.status === "active" ? "bg-[#27ae6033] text-[#27ae60]" : "bg-gray-100 text-gray-600"}>
                          {contact.status}
                        </Badge>
                      </div>
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg mb-2">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.company && (
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-2 flex items-center">
                          <Building2 className="h-4 w-4 mr-2" />
                          {contact.company}
                        </div>
                      )}
                      {contact.email && (
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-2 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {contact.email}
                        </div>
                      )}
                      {contact.phone && (
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-4 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {contact.phone}
                        </div>
                      )}
                      <Button variant="outline" className="w-full border-[#0b3a78] text-[#0b3a78]">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-2xl text-[#003d2b]">
                All Leads
              </h2>
              <Button className="bg-app-secondary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
            {leadsLoading ? (
              <div className="text-center py-12 text-[#808080]">Loading leads...</div>
            ) : leads.length === 0 ? (
              <Card className="border border-[#e4e4e4] rounded-[20px]">
                <CardContent className="p-12 text-center">
                  <Target className="h-12 w-12 text-[#808080] mx-auto mb-4" />
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg mb-4">
                    No leads yet. Start capturing leads to grow your business.
                  </p>
                  <Button className="bg-app-secondary text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Lead
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {leads.map((lead: any) => (
                  <Card key={lead.id} className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                              {lead.firstName} {lead.lastName}
                            </h3>
                            <Badge className={getLeadStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                            {lead.score && (
                              <Badge className="bg-[#FFB40033] text-[#FFB400]">
                                Score: {lead.score}
                              </Badge>
                            )}
                          </div>
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-2">
                            {lead.company || lead.email}
                          </div>
                          {lead.estimatedValue && (
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              Estimated Value: £{parseFloat(lead.estimatedValue || 0).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <Button variant="outline" className="border-[#0b3a78] text-[#0b3a78]">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-2xl text-[#003d2b]">
                All Opportunities
              </h2>
              <Button className="bg-app-secondary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Opportunity
              </Button>
            </div>
            {opportunitiesLoading ? (
              <div className="text-center py-12 text-[#808080]">Loading opportunities...</div>
            ) : opportunities.length === 0 ? (
              <Card className="border border-[#e4e4e4] rounded-[20px]">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="h-12 w-12 text-[#808080] mx-auto mb-4" />
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg mb-4">
                    No opportunities yet. Convert leads into opportunities to track sales.
                  </p>
                  <Button className="bg-app-secondary text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Opportunity
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp: any) => (
                  <Card key={opp.id} className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                              {opp.name}
                            </h3>
                            <Badge className={getOpportunityStageColor(opp.stage)}>
                              {opp.stage?.replace('_', ' ')}
                            </Badge>
                            <Badge className="bg-[#FFB40033] text-[#FFB400]">
                              {opp.probability}% probability
                            </Badge>
                          </div>
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-3">
                            {opp.description}
                          </div>
                          <div className="flex items-center gap-6">
                            <div>
                              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mb-1">
                                Value
                              </div>
                              <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                                £{parseFloat(opp.value || 0).toLocaleString()}
                              </div>
                            </div>
                            {opp.expectedCloseDate && (
                              <div>
                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mb-1">
                                  Expected Close
                                </div>
                                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#003d2b]">
                                  {new Date(opp.expectedCloseDate).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" className="border-[#0b3a78] text-[#0b3a78]">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="interactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-2xl text-[#003d2b]">
                All Interactions
              </h2>
              <Button className="bg-app-secondary text-white">
                <Plus className="h-4 w-4 mr-2" />
                Log Interaction
              </Button>
            </div>
            <Card className="border border-[#e4e4e4] rounded-[20px]">
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 text-[#808080] mx-auto mb-4" />
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg">
                  Interaction history will appear here. Log calls, emails, meetings, and notes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

