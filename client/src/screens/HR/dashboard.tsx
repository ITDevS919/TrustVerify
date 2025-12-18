import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  Clock,
  Award,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function HRDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: employeesData, isLoading: employeesLoading } = useQuery({
    queryKey: ['/api/hr/employees', { page: 1, limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/hr/employees?page=1&limit=10", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch employees");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: recruitmentData, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/hr/recruitment', { status: 'open', page: 1, limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/hr/recruitment?status=open&page=1&limit=10", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch recruitment");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: leaveRequestsData, isLoading: timeOffLoading } = useQuery({
    queryKey: ['/api/hr/leave-requests', { status: 'pending' }],
    queryFn: async () => {
      const response = await fetch("/api/hr/leave-requests?status=pending", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch leave requests");
      return response.json();
    },
    enabled: !!user,
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/hr/analytics'],
    queryFn: async () => {
      const response = await fetch("/api/hr/analytics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!user,
  });

  const isLoading = employeesLoading || jobsLoading || timeOffLoading || analyticsLoading;

  const employees = employeesData?.employees || [];
  const recruitment = recruitmentData?.recruitment || [];
  const leaveRequests = leaveRequestsData || [];

  const totalEmployees = analyticsData?.totalEmployees || employees.length;
  const openPositions = analyticsData?.openPositions || recruitment.length;
  const pendingRequests = analyticsData?.employeesOnLeave || leaveRequests.length;

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees.toLocaleString(),
      change: "+8",
      trend: "up",
      icon: Users,
      color: "text-[#0b3a78]",
      bgColor: "bg-[#0b3a7833]"
    },
    {
      title: "Open Positions",
      value: openPositions.toLocaleString(),
      change: "+3",
      trend: "up",
      icon: Briefcase,
      color: "text-[#FFB400]",
      bgColor: "bg-[#FFB40033]"
    },
    {
      title: "Pending Requests",
      value: pendingRequests.toLocaleString(),
      change: "-2",
      trend: "down",
      icon: Calendar,
      color: "text-[#27ae60]",
      bgColor: "bg-[#27ae6033]"
    },
    {
      title: "New Hires (30d)",
      value: "14",
      change: "+5",
      trend: "up",
      icon: UserPlus,
      color: "text-[#1DBF73]",
      bgColor: "bg-[#1DBF7333]"
    }
  ];

  const departmentBreakdown = [
    { name: "Engineering", count: 48, percentage: 31 },
    { name: "Sales", count: 32, percentage: 21 },
    { name: "Marketing", count: 24, percentage: 15 },
    { name: "Operations", count: 28, percentage: 18 },
    { name: "Finance", count: 16, percentage: 10 },
    { name: "Other", count: 8, percentage: 5 }
  ];

  const recentActivities = [
    { type: "hire", action: "New employee onboarded", name: "Alice Johnson - Software Engineer", time: "1 hour ago", icon: UserPlus },
    { type: "leave", action: "Leave approved", name: "Bob Smith - 5 days annual leave", time: "3 hours ago", icon: Calendar },
    { type: "review", action: "Performance review completed", name: "Sarah Williams - Q4 2025", time: "1 day ago", icon: Award },
    { type: "position", action: "New position posted", name: "Senior Product Manager", time: "2 days ago", icon: Briefcase },
  ];

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
        {/* Header */}
        <div className="mb-12">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              HR PORTAL
            </span>
          </Badge>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
                HR Dashboard
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg">
                Employee insights and workforce analytics
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                className="bg-app-secondary text-white" 
                onClick={() => navigate("/hr/recruitment")}
                data-testid="button-post-job"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                Post Job
              </Button>
              <Button 
                variant="outline" 
                className="border-[#0b3a78] text-[#0b3a78]"
                onClick={() => navigate("/hr/employees")}
                data-testid="button-view-employees"
              >
                <Users className="h-4 w-4 mr-2" />
                View Employees
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
                      <Skeleton className="h-8 w-20 mb-1" />
                      <Skeleton className="h-4 w-24" />
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
          {/* Department Breakdown */}
          <Card className="lg:col-span-2 border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <CardHeader>
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-[#1DBF73]" />
                Headcount by Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentBreakdown.map((dept) => (
                  <div key={dept.name} className="space-y-2" data-testid={`dept-${dept.name.toLowerCase()}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{dept.name}</span>
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{dept.count} employees · {dept.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#f7f7f7] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#0b3a78] to-[#1DBF73] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${dept.percentage}%` }}
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
                <Clock className="h-5 w-5 mr-2 text-[#0b3a78]" />
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
                onClick={() => navigate("/hr/employees")}
                data-testid="action-manage-employees"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Employees
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-[#0b3a78] text-[#0b3a78]" 
                onClick={() => navigate("/hr/recruitment")}
                data-testid="action-view-recruitment"
              >
                <Briefcase className="h-4 w-4 mr-2" />
                View Recruitment
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-[#0b3a78] text-[#0b3a78]" 
                onClick={() => navigate("/hr/time-off")}
                data-testid="action-manage-time-off"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Manage Time Off
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-[#0b3a78] text-[#0b3a78]" 
                onClick={() => navigate("/hr/performance")}
                data-testid="action-view-performance"
              >
                <Award className="h-4 w-4 mr-2" />
                View Performance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
