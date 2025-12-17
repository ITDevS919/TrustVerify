import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";
import { Header} from "../../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { 
  Users, 
  Shield, 
  FileText, 
  AlertTriangle,
  Activity,
  Download,
  Eye
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "security" | "logs" | "settings">("overview");

  // Check admin access
  const isDevelopment = (import.meta as any).env?.DEV || (import.meta as any).env?.VITE_ALLOW_ALL_ADMIN === 'true';
  const hasAdminAccess = isDevelopment || user?.email?.includes('@trustverify.com') || user?.isAdmin;

  // Type definitions
  interface DashboardStats {
    totalUsers?: number;
    activeTransactions?: number;
    pendingKyc?: number;
    securityAlerts?: number;
  }

  interface Activity {
    action: string;
    timestamp: string;
    type: string;
  }

  // Fetch dashboard stats
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/stats');
      return await response.json();
    },
    enabled: !!user && hasAdminAccess,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache the data (replaced cacheTime)
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  // Fetch recent activities
  const { data: activities } = useQuery<Activity[]>({
    queryKey: ['admin', 'dashboard', 'activities'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/activities');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user && hasAdminAccess,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache the data (replaced cacheTime)
    refetchOnMount: true, // Always refetch on mount
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
      <Header />
      
      <div className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-[#003d2b] mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your platform, users, and security</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-semibold">{stats?.totalUsers || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Transactions</p>
                    <p className="text-2xl font-semibold">{stats?.activeTransactions || 0}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending KYC</p>
                    <p className="text-2xl font-semibold">{stats?.pendingKyc || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Security Alerts</p>
                    <p className="text-2xl font-semibold">{stats?.securityAlerts || 0}</p>
                  </div>
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 font-medium ${
                activeTab === "overview"
                  ? "text-[#003d2b] border-b-2 border-[#003d2b]"
                  : "text-gray-600 hover:text-[#003d2b]"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-2 font-medium ${
                activeTab === "users"
                  ? "text-[#003d2b] border-b-2 border-[#003d2b]"
                  : "text-gray-600 hover:text-[#003d2b]"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 font-medium ${
                activeTab === "security"
                  ? "text-[#003d2b] border-b-2 border-[#003d2b]"
                  : "text-gray-600 hover:text-[#003d2b]"
              }`}
            >
              Security
            </button>
            <button
              onClick={() => {
                setActiveTab("logs");
                navigate("/admin/logs");
              }}
              className={`px-4 py-2 font-medium ${
                activeTab === "logs"
                  ? "text-[#003d2b] border-b-2 border-[#003d2b]"
                  : "text-gray-600 hover:text-[#003d2b]"
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 font-medium ${
                activeTab === "settings"
                  ? "text-[#003d2b] border-b-2 border-[#003d2b]"
                  : "text-gray-600 hover:text-[#003d2b]"
              }`}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "overview" && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities && activities.length > 0 ? (
                        activities.slice(0, 10).map((activity, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{activity.action}</p>
                              <p className="text-sm text-gray-600">{activity.timestamp}</p>
                            </div>
                            <Badge variant={activity.type === "success" ? "default" : "destructive"}>
                              {activity.type}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-600 text-center py-4">No recent activities</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate("/admin/kyc-review")}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Review KYC Submissions
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate("/admin/users")}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate("/admin/logs")}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Audit Logs
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Database</span>
                          <Badge variant="default" className="bg-[#27Ae60] text-white">Healthy</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Status</span>
                          <Badge variant="default" className="bg-[#27Ae60] text-white">Operational</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Storage</span>
                          <Badge variant="default" className="bg-[#27Ae60] text-white">Normal</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex gap-4">
                    <Input
                      placeholder="Search users..."
                      className="flex-1"
                    />
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-gray-600">User management interface coming soon...</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-8 text-center text-gray-500">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p>Security monitoring dashboard</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">System configuration settings coming soon...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

