import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
import { Award, Search, TrendingUp, Users, Star } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function HRPerformance() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reviewsData, isLoading } = useQuery<{ reviews: any[]; total: number }>({
    queryKey: ['/api/hr/performance-reviews', { page: 1, limit: 100 }],
    queryFn: async () => {
      const response = await fetch("/api/hr/performance-reviews?page=1&limit=100", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch reviews");
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

  const reviews = reviewsData?.reviews || [];
  const employees = employeesData?.employees || [];

  const filteredReviews = reviews.filter((review: any) => {
    const employee = employees.find((emp: any) => emp.id === review.employeeId);
    const employeeName = employee ? `${employee.firstName} ${employee.lastName}` : '';
    return `${employeeName} ${review.reviewPeriod || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const getReviewTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "annual": return "bg-[#0b3a7833] text-[#0b3a78]";
      case "quarterly": return "bg-[#27ae6033] text-[#27ae60]";
      case "probation": return "bg-[#FFB40033] text-[#FFB400]";
      case "project_based": return "bg-[#1DBF7333] text-[#1DBF73]";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-[#1DBF73]";
    if (rating >= 3.5) return "text-[#0b3a78]";
    if (rating >= 2.5) return "text-[#FFB400]";
    return "text-red-600";
  };

  const totalReviews = reviews.length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, r: any) => sum + (parseFloat(r.overallRating) || 0), 0) / reviews.length).toFixed(2)
    : "0.00";
  const completedReviews = reviews.filter((r: any) => r.status === 'completed').length;

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
              Performance Reviews
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
              Track and manage employee performance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Total Reviews</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#003d2b] mt-1">{totalReviews}</p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <Award className="h-6 w-6 text-[#0b3a78]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Completed</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#1DBF73] mt-1">{completedReviews}</p>
                </div>
                <div className="bg-[#1DBF7333] p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-[#1DBF73]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Average Rating</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#FFB400] mt-1">{avgRating}</p>
                </div>
                <div className="bg-[#FFB40033] p-3 rounded-lg">
                  <Star className="h-6 w-6 text-[#FFB400]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">Employees</p>
                  <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-3xl font-semibold text-[#0b3a78] mt-1">{employees.length}</p>
                </div>
                <div className="bg-[#0b3a7833] p-3 rounded-lg">
                  <Users className="h-6 w-6 text-[#0b3a78]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <Award className="h-5 w-5 mr-2 text-[#1DBF73]" />
                Performance Reviews ({filteredReviews.length})
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
                <Input
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#fcfcfc] border-[#e4e4e4]"
                  data-testid="input-search-reviews"
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
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Review Period</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Rating</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Review Date</TableHead>
                    <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] py-8">
                        No performance reviews found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReviews.map((review: any) => {
                      const employee = employees.find((emp: any) => emp.id === review.employeeId);
                      const rating = parseFloat(review.overallRating) || 0;
                      return (
                        <TableRow key={review.id} data-testid={`review-row-${review.id}`}>
                          <TableCell>
                            <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                              {employee ? `${employee.firstName} ${employee.lastName}` : `Employee ${review.employeeId}`}
                            </div>
                          </TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {review.reviewPeriod || review.reviewDate ? new Date(review.reviewPeriod || review.reviewDate).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold ${getRatingColor(rating)}`}>
                              <Star className="h-4 w-4 mr-1 fill-current" />
                              {rating.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge className={review.status === 'completed' ? "bg-[#1DBF7333] text-[#1DBF73]" : "bg-[#FFB40033] text-[#FFB400]"}>
                              {review.status?.replace('_', ' ') || "Pending"}
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
      <Footer />
    </div>
  );
}
