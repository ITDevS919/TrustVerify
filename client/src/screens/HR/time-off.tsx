import { useQuery } from "@tanstack/react-query";
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
import { Calendar, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HRTimeOff() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: leaveRequestsData, isLoading } = useQuery<{ leaveRequests: any[]; total: number }>({
    queryKey: ['/api/hr/leave-requests', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/hr/leave-requests?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch leave requests");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: employeesData } = useQuery<{ employees: any[] }>({
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

  const timeOffRequests = leaveRequestsData?.leaveRequests || [];
  const employees = employeesData?.employees || [];

  const filteredRequests = timeOffRequests.filter((request: any) => {
    const employee = employees.find((emp: any) => emp.id === request.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
    return `${employeeName} ${request.leaveType} ${request.status}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-[#1DBF7333] text-[#1DBF73]";
      case "pending": return "bg-[#FFB40033] text-[#FFB400]";
      case "rejected": return "bg-red-100 text-red-600";
      case "cancelled": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const pendingCount = timeOffRequests.filter((r: any) => r.status === 'pending').length;
  const approvedCount = timeOffRequests.filter((r: any) => r.status === 'approved').length;

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
          <div className="mb-8">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
              Time Off Management
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
              Review and manage leave requests
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Pending Requests</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#FFB400] mt-1">{pendingCount}</p>
                </div>
                <div className="bg-[#FFB40033] p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-[#FFB400]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Approved This Month</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#1DBF73] mt-1">{approvedCount}</p>
                </div>
                <div className="bg-[#1DBF7333] p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-[#1DBF73]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Total Requests</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#003d2b] mt-1">{timeOffRequests.length}</p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-[#0b3a78]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#1DBF73]" />
                Time Off Requests ({filteredRequests.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#fcfcfc] border-[#e4e4e4]"
                  data-testid="input-search-requests"
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
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Employee</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Leave Type</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Start Date</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">End Date</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Days</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">
                        No time-off requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request: any) => {
                      const employee = employees.find((emp: any) => emp.id === request.employeeId);
                      return (
                        <TableRow key={request.id} data-testid={`request-row-${request.id}`}>
                          <TableCell>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              {employee ? `${employee.firstName} ${employee.lastName}` : `Employee ${request.employeeId}`}
                            </div>
                          </TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] capitalize">{request.leaveType?.replace('_', ' ') || "—"}</TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{request.startDate ? new Date(request.startDate).toLocaleDateString() : "—"}</TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{request.endDate ? new Date(request.endDate).toLocaleDateString() : "—"}</TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{request.days || "—"}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status || "pending")}>
                              {request.status?.replace('_', ' ') || "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="border-[#1DBF73] text-[#1DBF73]" data-testid={`button-approve-${request.id}`}>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-600 text-red-600" data-testid={`button-reject-${request.id}`}>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
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
      <Footer />
    </div>
  );
}
