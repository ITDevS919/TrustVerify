import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Briefcase, Search, Plus, MapPin, PoundSterling, Clock } from "lucide-react";

type FormData = {
  position: string;
  department?: string;
  description?: string;
  requirements?: string;
  status?: string;
  postedDate?: string;
  closingDate?: string;
  salaryRange?: string;
  employmentType?: string;
  location?: string;
  numberOfPositions?: number;
};

export default function HRRecruitment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const { data: recruitmentData, isLoading } = useQuery<{ recruitments: any[]; total: number }>({
    queryKey: ['/api/hr/recruitments', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/hr/recruitments?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch recruitments");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: jobApplicationsData } = useQuery<{ jobApplications: any[] }>({
    queryKey: ['/api/hr/job-applications', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/hr/job-applications?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch job applications");
      return response.json();
    },
    enabled: !!user,
  });

  const jobs = recruitmentData?.recruitments || [];
  const candidates = jobApplicationsData?.jobApplications || [];

  const form = useForm<FormData>({
    defaultValues: {
      position: "",
      department: "",
      location: "",
      employmentType: "full_time",
      status: "open",
      description: "",
      requirements: "",
      salaryRange: "",
      numberOfPositions: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/hr/recruitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create job posting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/recruitments'] });
      toast({
        title: "Success",
        description: "Job posting created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const filteredJobs = jobs.filter((job: any) =>
    `${job.position} ${job.department || ''} ${job.location || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "closed": return "bg-red-100 text-red-600";
      case "on_hold": return "bg-[#FFB40033] text-[#FFB400]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const totalCandidates = candidates.length;
  const openPositions = jobs.filter((job: any) => job.status === 'open').length;

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
                Recruitment
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
                Manage job postings and candidates
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-app-secondary text-white" data-testid="button-post-job">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Create Job Posting</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                      Job Position
                    </label>
                    <Input 
                      {...form.register("position", { required: true })} 
                      placeholder="Senior Software Engineer" 
                      data-testid="input-job-title" 
                      className="bg-[#fcfcfc] border-[#e4e4e4]"
                    />
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
                        Location
                      </label>
                      <Input 
                        {...form.register("location")} 
                        placeholder="London, UK" 
                        data-testid="input-location" 
                        className="bg-[#fcfcfc] border-[#e4e4e4]"
                      />
                    </div>
                  </div>
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
                      Salary Range
                    </label>
                    <Input 
                      {...form.register("salaryRange")} 
                      placeholder="£50,000 - £80,000" 
                      data-testid="input-salary-range" 
                      className="bg-[#fcfcfc] border-[#e4e4e4]"
                    />
                  </div>
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                      Description
                    </label>
                    <Textarea 
                      {...form.register("description")} 
                      placeholder="Job description..." 
                      rows={4}
                      data-testid="input-description" 
                      className="bg-[#fcfcfc] border-[#e4e4e4]"
                    />
                  </div>
                  <div>
                    <label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm mb-2 block">
                      Requirements
                    </label>
                    <Textarea 
                      {...form.register("requirements")} 
                      placeholder="Job requirements..." 
                      rows={4}
                      data-testid="input-requirements" 
                      className="bg-[#fcfcfc] border-[#e4e4e4]"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" className="border-[#0b3a78] text-[#0b3a78]" onClick={() => setOpen(false)} data-testid="button-cancel">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-app-secondary text-white" disabled={createMutation.isPending} data-testid="button-submit-job">
                      {createMutation.isPending ? "Creating..." : "Create Job"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Open Positions</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#1DBF73] mt-1">{openPositions}</p>
                </div>
                <div className="bg-[#1DBF7333] p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-[#1DBF73]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Total Candidates</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#0b3a78] mt-1">{totalCandidates}</p>
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
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Total Positions</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#003d2b] mt-1">{jobs.length}</p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <Briefcase className="h-6 w-6 text-[#0b3a78]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-[#1DBF73]" />
                Job Postings ({filteredJobs.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#fcfcfc] border-[#e4e4e4]"
                  data-testid="input-search-jobs"
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
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Job Position</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Department</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Location</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Salary</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Type</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">
                        No job postings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredJobs.map((job: any) => (
                      <TableRow key={job.id} data-testid={`job-row-${job.id}`}>
                        <TableCell>
                          <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                            {job.position || job.title}
                          </div>
                        </TableCell>
                        <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{job.department || "—"}</TableCell>
                        <TableCell>
                          <div className="flex items-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            <MapPin className="h-3 w-3 mr-2" />
                            {job.location || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                          {job.salaryRange || (job.salaryMin && job.salaryMax ? (
                            <div className="flex items-center">
                              <PoundSterling className="h-3 w-3 mr-1" />
                              {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()} {job.currency}
                            </div>
                          ) : "—")}
                        </TableCell>
                        <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] capitalize">{job.employmentType?.replace('_', ' ') || "—"}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(job.status || "open")}>
                            {job.status?.replace('_', ' ') || "Open"}
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
  );
}
