import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Target, Search, Plus, Mail, Phone, Building, ArrowRight, UserPlus } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  source: string;
  status?: string;
  score?: number;
  estimatedValue?: number;
};

export default function CRMLeads() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const { data: leadsData, isLoading } = useQuery<{ leads: any[]; total: number }>({
    queryKey: ['/api/crm/leads', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/crm/leads?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch leads");
      return response.json();
    },
    enabled: !!user,
  });

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      source: "",
      status: "new",
      score: 0,
    },
  });

  const leads = leadsData?.leads || [];

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create lead");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/leads'] });
      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lead",
        variant: "destructive",
      });
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (leadId: number) => {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'converted', convertedAt: new Date().toISOString() }),
      });
      if (!response.ok) throw new Error("Failed to convert lead");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/crm/contacts'] });
      toast({
        title: "Success",
        description: "Lead converted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to convert lead",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const filteredLeads = leads?.filter((lead: any) =>
    `${lead.firstName} ${lead.lastName} ${lead.email} ${lead.company}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "new": return "bg-[#0b3a7833] text-[#0b3a78]";
      case "contacted": return "bg-[#FFB40033] text-[#FFB400]";
      case "qualified": return "bg-[#27ae6033] text-[#27ae60]";
      case "converted": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "lost": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const newLeads = leads?.filter((l: any) => l.status === 'new')?.length || 0;
  const qualifiedLeads = leads?.filter((l: any) => l.status === 'qualified')?.length || 0;
  const convertedLeads = leads?.filter((l: any) => l.status === 'converted')?.length || 0;

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
                Leads
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
                Manage your sales leads
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-app-secondary text-white" data-testid="button-add-lead">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Add New Lead</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        First Name
                      </label>
                      <Input 
                        {...form.register("firstName", { required: true })} 
                        placeholder="John" 
                        data-testid="input-first-name" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Last Name
                      </label>
                      <Input 
                        {...form.register("lastName", { required: true })} 
                        placeholder="Doe" 
                        data-testid="input-last-name" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Email
                      </label>
                      <Input 
                        {...form.register("email", { required: true })} 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        data-testid="input-email" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Phone
                      </label>
                      <Input 
                        {...form.register("phone")} 
                        placeholder="+44 20 1234 5678" 
                        data-testid="input-phone" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Company
                      </label>
                      <Input 
                        {...form.register("company")} 
                        placeholder="Acme Corp" 
                        data-testid="input-company" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Job Title
                      </label>
                      <Input 
                        {...form.register("jobTitle")} 
                        placeholder="Marketing Director" 
                        data-testid="input-job-title" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Source
                      </label>
                      <Input 
                        {...form.register("source", { required: true })} 
                        placeholder="Website, Referral, etc." 
                        data-testid="input-source" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Status
                      </label>
                      <Select onValueChange={(value) => form.setValue("status", value)} defaultValue={form.watch("status")}>
                        <SelectTrigger data-testid="select-status" className="bg-[#fcfcfc] border-[#e4e4e4]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" className="border-[#0b3a78] text-[#0b3a78]" onClick={() => setOpen(false)} data-testid="button-cancel">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-app-secondary text-white" disabled={createMutation.isPending} data-testid="button-submit-lead">
                      {createMutation.isPending ? "Creating..." : "Create Lead"}
                    </Button>
                  </div>
                </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">New Leads</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#0b3a78] mt-1">{newLeads}</p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <Target className="h-6 w-6 text-[#0b3a78]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Qualified</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#27ae60] mt-1">{qualifiedLeads}</p>
                </div>
                <div className="bg-[#27ae6033] p-3 rounded-lg">
                  <Target className="h-6 w-6 text-[#27ae60]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Converted</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#1DBF73] mt-1">{convertedLeads}</p>
                </div>
                <div className="bg-[#1DBF7333] p-3 rounded-lg">
                  <ArrowRight className="h-6 w-6 text-[#1DBF73]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Total Leads</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#003d2b] mt-1">{leads.length}</p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <Target className="h-6 w-6 text-[#0b3a78]" />
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
                All Leads ({filteredLeads.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#fcfcfc] border-[#e4e4e4]"
                  data-testid="input-search-leads"
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
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Company</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Source</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">
                        No leads found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead: any) => (
                      <TableRow key={lead.id} data-testid={`lead-row-${lead.id}`}>
                        <TableCell>
                          <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                            {lead.firstName} {lead.lastName}
                          </div>
                          {lead.jobTitle && (
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{lead.jobTitle}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              <Mail className="h-3 w-3 mr-2" />
                              {lead.email}
                            </div>
                            {lead.phone && (
                              <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                <Phone className="h-3 w-3 mr-2" />
                                {lead.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.company && (
                            <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              <Building className="h-3 w-3 mr-2" />
                              {lead.company}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{lead.source || "—"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(lead.status || "new")}>
                            {lead.status?.replace('_', ' ') || "New"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lead.status !== 'converted' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-[#0b3a78] text-[#0b3a78]"
                              onClick={() => convertMutation.mutate(lead.id)}
                              disabled={convertMutation.isPending}
                              data-testid={`button-convert-${lead.id}`}
                            >
                              <ArrowRight className="h-3 w-3 mr-1" />
                              Convert
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
      </div>
    </div>  
  );
}
