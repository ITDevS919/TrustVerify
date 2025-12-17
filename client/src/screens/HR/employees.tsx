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
import { Users, Search, Plus, Mail, Phone, Building, Calendar } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  position: string;
  jobTitle: string;
  employmentType?: string;
  status?: string;
  hireDate?: string;
  salary?: number;
};

export default function HREmployees() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const { data: employeesData, isLoading } = useQuery<{ employees: any[]; total: number }>({
    queryKey: ['/api/hr/employees', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/hr/employees?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch employees");
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
      department: "",
      position: "",
      jobTitle: "",
      employmentType: "full_time",
      status: "active",
    },
  });

  const employees = employeesData?.employees || [];

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/hr/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add employee");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/employees'] });
      toast({
        title: "Success",
        description: "Employee added successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add employee",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const filteredEmployees = employees.filter((employee: any) =>
    `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.department || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "on_leave": return "bg-[#FFB40033] text-[#FFB400]";
      case "terminated": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Please log in to access the HR portal.</p>
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
              HR PORTAL
            </span>
          </Badge>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
                Employees
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
                Manage your workforce
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-app-secondary text-white" data-testid="button-add-employee">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Add New Employee</DialogTitle>
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
                        placeholder="john.doe@company.com" 
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
                        Department
                      </label>
                      <Input 
                        {...form.register("department")} 
                        placeholder="Engineering" 
                        data-testid="input-department" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Position
                      </label>
                      <Input 
                        {...form.register("position", { required: true })} 
                        placeholder="Software Engineer" 
                        data-testid="input-position" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                        Employment Type
                      </label>
                      <Select onValueChange={(value) => form.setValue("employmentType", value)} defaultValue={form.watch("employmentType")}>
                        <SelectTrigger data-testid="select-employment-type" className="bg-[#fcfcfc] border-[#e4e4e4]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="intern">Intern</SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" className="border-[#0b3a78] text-[#0b3a78]" onClick={() => setOpen(false)} data-testid="button-cancel">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-app-secondary text-white" disabled={createMutation.isPending} data-testid="button-submit-employee">
                      {createMutation.isPending ? "Adding..." : "Add Employee"}
                    </Button>
                  </div>
                </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <Users className="h-5 w-5 mr-2 text-[#1DBF73]" />
                All Employees ({filteredEmployees.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#fcfcfc] border-[#e4e4e4]"
                  data-testid="input-search-employees"
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
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Department</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Position</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Type</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">
                        No employees found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee: any) => (
                      <TableRow key={employee.id} data-testid={`employee-row-${employee.id}`}>
                        <TableCell>
                          <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                            {employee.firstName} {employee.lastName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                              <Mail className="h-3 w-3 mr-2" />
                              {employee.email}
                            </div>
                            {employee.phone && (
                              <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                <Phone className="h-3 w-3 mr-2" />
                                {employee.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            <Building className="h-3 w-3 mr-2" />
                            {employee.department || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{employee.position || employee.jobTitle}</TableCell>
                        <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] capitalize">{employee.employmentType?.replace('_', ' ') || "—"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(employee.status || "active")}>
                            {employee.status?.replace('_', ' ') || "Active"}
                          </Badge>
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
