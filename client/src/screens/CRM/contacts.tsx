import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  Edit,
  Trash2
} from "lucide-react";

type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  accountId?: number;
  isActive: boolean;
  createdAt: string;
};

export default function CRMContacts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      company: ""
    }
  });

  const { data: contactsData, isLoading } = useQuery<{ contacts: Contact[]; total: number }>({
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

  const createContactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/crm/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create contact");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/crm/contacts'] });
      toast({
        title: "Success",
        description: "Contact created successfully",
      });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create contact",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: any) => {
    createContactMutation.mutate(data);
  };

  const contacts = contactsData?.contacts || [];
  const filteredContacts = contacts.filter(contact =>
    `${contact.firstName} ${contact.lastName} ${contact.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Contacts
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
                Manage your customer relationships
              </p>
            </div>
          
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-app-secondary text-white" data-testid="button-add-contact">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]" data-testid="dialog-add-contact">
              <DialogHeader>
                <DialogTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Add New Contact</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                      First Name
                    </label>
                    <Input 
                      {...form.register("firstName", { required: true })} 
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
                      data-testid="input-last-name" 
                      className="bg-[#fcfcfc] border-[#e4e4e4]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                    Email
                  </label>
                  <Input 
                    {...form.register("email", { required: true })} 
                    type="email" 
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
                    data-testid="input-phone" 
                    className="bg-[#fcfcfc] border-[#e4e4e4]"
                  />
                </div>
                
                <div>
                  <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                    Job Title
                  </label>
                  <Input 
                    {...form.register("jobTitle")} 
                    data-testid="input-job-title" 
                    className="bg-[#fcfcfc] border-[#e4e4e4]"
                  />
                </div>
                
                <div>
                  <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                    Company
                  </label>
                  <Input 
                    {...form.register("company")} 
                    data-testid="input-company" 
                    className="bg-[#fcfcfc] border-[#e4e4e4]"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" className="border-[#0b3a78] text-[#0b3a78]" onClick={() => setIsAddDialogOpen(false)} data-testid="button-cancel">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-app-secondary text-white" data-testid="button-submit">
                    Create Contact
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6 border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
              <Input
                placeholder="Search contacts by name or email..."
                className="pl-10 bg-[#fcfcfc] border-[#e4e4e4]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-contacts"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
              <Users className="h-5 w-5 mr-2 text-[#1DBF73]" />
              All Contacts ({filteredContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Loading contacts...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-[#808080] mx-auto mb-3" />
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">No contacts found</p>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mt-1">Create your first contact to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 border border-[#e4e4e4] rounded-lg bg-[#fcfcfc] hover:bg-[#f7f7f7] transition-colors"
                    data-testid={`contact-${contact.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-[#0b3a78] text-white rounded-full w-12 h-12 flex items-center justify-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                        {contact.firstName[0]}{contact.lastName[0]}
                      </div>
                      <div>
                        <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{contact.firstName} {contact.lastName}</h3>
                        {contact.jobTitle && (
                          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">{contact.jobTitle}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                            <Mail className="h-3 w-3 mr-1" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                              <Phone className="h-3 w-3 mr-1" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-[#0b3a78]" data-testid={`button-edit-${contact.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" data-testid={`button-delete-${contact.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
