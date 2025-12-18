import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Building2, 
  TrendingUp, 
  PoundSterling,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function CRMDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/crm/contacts', { page: 1, limit: 10 }],
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
    queryKey: ['/api/crm/leads', { page: 1, limit: 10 }],
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
    queryKey: ['/api/crm/opportunities', { page: 1, limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/crm/opportunities?page=1&limit=10", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch opportunities");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/crm/analytics'],
    queryFn: async () => {
      const response = await fetch("/api/crm/analytics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!user,
  });

  const isLoading = contactsLoading || leadsLoading || opportunitiesLoading || analyticsLoading;

  const contacts = contactsData?.contacts || [];
  const leads = leadsData?.leads || [];
  const opportunities = opportunitiesData?.opportunities || [];

  const totalContacts = analyticsData?.totalContacts || contacts.length;
  const activeLeads = analyticsData?.totalLeads || leads.length;
  const openOpportunities = analyticsData?.totalOpportunities || opportunities.length;

  const stats = [
    {
      title: "Total Contacts",
      value: totalContacts.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-[#0b3a78]",
      bgColor: "bg-[#0b3a7833]"
    },
    {
      title: "Active Leads",
      value: activeLeads.toLocaleString(),
      change: "+8.2%",
      trend: "up",
      icon: Target,
      color: "text-[#27ae60]",
      bgColor: "bg-[#27ae6033]"
    },
    {
      title: "Open Opportunities",
      value: openOpportunities.toLocaleString(),
      change: "+15%",
      trend: "up",
      icon: Building2,
      color: "text-[#FFB400]",
      bgColor: "bg-[#FFB40033]"
    },
    {
      title: "Revenue Pipeline",
      value: analyticsData?.totalRevenue ? `£${((analyticsData.totalRevenue / 1000).toFixed(1))}k` : "£0",
      change: "+15.3%",
      trend: "up",
      icon: PoundSterling,
      color: "text-[#1DBF73]",
      bgColor: "bg-[#1DBF7333]"
    }
  ];

  const recentActivities = [
    { type: "lead", action: "New lead created", name: "John Smith from Acme Corp", time: "2 hours ago", icon: Target },
    { type: "deal", action: "Deal moved to negotiation", name: "Enterprise Package - £50K", time: "4 hours ago", icon: Building2 },
    { type: "contact", action: "Contact updated", name: "Sarah Johnson", time: "6 hours ago", icon: Users },
    { type: "activity", action: "Call scheduled", name: "Follow-up with Tech Solutions Ltd", time: "1 day ago", icon: Calendar },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Please log in to access the CRM portal.</p>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
                CRM Dashboard
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
                Sales pipeline overview and key metrics
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-app-secondary text-white" 
                onClick={() => navigate("/crm/leads")}
                data-testid="button-add-lead"
              >
                <Target className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
              <Button 
                variant="outline" 
                className="border-[#0b3a78] text-[#0b3a78]"
                onClick={() => navigate("/crm/contacts")}
                data-testid="button-view-contacts"
              >
                <Users className="h-4 w-4 mr-2" />
                View Contacts
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
            
            return (
              <Card key={stat.title} className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]" data-testid={`stat-card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center text-sm font-semibold ${
                      stat.trend === "up" ? "text-[#27ae60]" : "text-red-600"
                    }`}>
                      <TrendIcon className="h-4 w-4 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  {isLoading ? (
                    <>
                      <div className="h-8 w-20 mb-1 bg-[#f7f7f7] rounded animate-pulse" />
                      <div className="h-4 w-24 bg-[#f7f7f7] rounded animate-pulse" />
                    </>
                  ) : (
                    <>
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#003d2b] mb-1">{stat.value}</div>
                      <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{stat.title}</div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Overview */}
          <Card className="lg:col-span-2 border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#1DBF73]" />
                Sales Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { stage: "Prospecting", count: opportunities.filter((o: any) => o.stage === 'prospecting').length || 0, value: "£125K", color: "bg-[#0b3a78]" },
                  { stage: "Qualification", count: opportunities.filter((o: any) => o.stage === 'qualification').length || 0, value: "£89K", color: "bg-[#FFB400]" },
                  { stage: "Proposal", count: opportunities.filter((o: any) => o.stage === 'proposal').length || 0, value: "£156K", color: "bg-[#27ae60]" },
                  { stage: "Negotiation", count: opportunities.filter((o: any) => o.stage === 'negotiation').length || 0, value: "£78K", color: "bg-[#1DBF73]" },
                  { stage: "Closing", count: opportunities.filter((o: any) => o.stage === 'closed_won').length || 0, value: "£39K", color: "bg-[#27ae60]" },
                ].map((stage) => (
                  <div key={stage.stage} className="space-y-2" data-testid={`pipeline-stage-${stage.stage.toLowerCase()}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{stage.stage}</span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{stage.count} deals · {stage.value}</span>
                    </div>
                    <div className="w-full bg-[#f7f7f7] rounded-full h-2">
                      <div 
                        className={`${stage.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max((stage.count / Math.max(openOpportunities, 1)) * 100, 5)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <Activity className="h-5 w-5 mr-2 text-[#0b3a78]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 pb-4 border-b border-[#e4e4e4] last:border-0" data-testid={`activity-${index}`}>
                      <div className="bg-[#f7f7f7] p-2 rounded-lg">
                        <Icon className="h-4 w-4 text-[#808080]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] text-sm font-medium text-[#003d2b]">{activity.action}</p>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] truncate">{activity.name}</p>
                        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080] mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6 border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="w-full justify-start border-[#0b3a78] text-[#0b3a78]" 
                onClick={() => navigate("/crm/contacts")}
                data-testid="action-manage-contacts"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Contacts
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-[#0b3a78] text-[#0b3a78]" 
                onClick={() => navigate("/crm/leads")}
                data-testid="action-view-leads"
              >
                <Target className="h-4 w-4 mr-2" />
                View Leads
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-[#0b3a78] text-[#0b3a78]" 
                onClick={() => navigate("/crm/opportunities")}
                data-testid="action-track-opportunities"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Track Opportunities
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-[#0b3a78] text-[#0b3a78]" 
                data-testid="action-view-reports"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div> 
    </div>
  );
}
