import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Target, Search, PoundSterling, TrendingUp, Award, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CRMOpportunities() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: opportunitiesData, isLoading } = useQuery<{ opportunities: any[]; total: number }>({
    queryKey: ['/api/crm/opportunities', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/crm/opportunities?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch opportunities");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: contactsData } = useQuery<{ contacts: any[] }>({
    queryKey: ['/api/crm/contacts', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/crm/contacts?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch contacts");
      return response.json();
    },
    enabled: !!user,
  });

  const opportunities = opportunitiesData?.opportunities || [];
  const contacts = contactsData?.contacts || [];

  const filteredOpportunities = opportunities.filter((opp: any) => {
    const contact = contacts.find((c: any) => c.id === opp.contactId);
    const contactName = contact ? `${contact.firstName} ${contact.lastName}` : '';
    return `${opp.name} ${contactName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "prospecting": return "bg-[#0b3a7833] text-[#0b3a78]";
      case "qualification": return "bg-[#FFB40033] text-[#FFB400]";
      case "proposal": return "bg-[#27ae6033] text-[#27ae60]";
      case "negotiation": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "closed_won": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "closed_lost": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const totalValue = opportunities.reduce((sum: number, opp: any) => sum + (parseFloat(opp.value || opp.amount || 0)), 0);
  const wonOpps = opportunities.filter((o: any) => o.stage === 'closed_won').length;
  const openOpps = opportunities.filter((o: any) => o.stage !== 'closed_won' && o.stage !== 'closed_lost').length;
  const avgValue = opportunities.length > 0 ? totalValue / opportunities.length : 0;

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
        <div className="mb-12">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              CRM PORTAL
            </span>
          </Badge>
          <div className="mb-8">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
              Opportunities
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
              Track your sales pipeline
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Total Value</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-[#003d2b] mt-1">
                    £{totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <PoundSterling className="h-6 w-6 text-[#0b3a78]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Won Deals</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#1DBF73] mt-1">{wonOpps}</p>
                </div>
                <div className="bg-[#1DBF7333] p-3 rounded-lg">
                  <Award className="h-6 w-6 text-[#1DBF73]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Open Pipeline</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#0b3a78] mt-1">{openOpps}</p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-[#0b3a78]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Avg Deal Size</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl font-semibold text-[#FFB400] mt-1">
                    £{avgValue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#FFB40033] p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-[#FFB400]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <Target className="h-5 w-5 mr-2 text-[#1DBF73]" />
                All Opportunities ({filteredOpportunities.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#fcfcfc] border-[#e4e4e4]"
                  data-testid="input-search-opportunities"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 w-full bg-[#f7f7f7] rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Name</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Contact</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Amount</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Stage</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Close Date</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOpportunities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">
                        No opportunities found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOpportunities.map((opportunity: any) => {
                      const contact = contacts.find((c: any) => c.id === opportunity.contactId);
                      return (
                        <TableRow key={opportunity.id} data-testid={`opportunity-row-${opportunity.id}`}>
                          <TableCell>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              {opportunity.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {contact && (
                              <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                                {contact.firstName} {contact.lastName}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              £{parseFloat(opportunity.value || opportunity.amount || 0).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(opportunity.stage || "prospecting")}>
                              {opportunity.stage?.replace('_', ' ') || "Prospecting"}
                            </Badge>
                          </TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {opportunity.closeDate || opportunity.expectedCloseDate
                              ? new Date(opportunity.closeDate || opportunity.expectedCloseDate).toLocaleDateString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(opportunity.stage || "prospecting")}>
                              {opportunity.stage?.replace('_', ' ') || "Prospecting"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
