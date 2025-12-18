import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";
import { Header} from "../../components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { 
  Users, 
  Shield, 
  FileText, 
  AlertTriangle,
  Activity,
  Download,
  Eye,
  Image,
  Save,
  Plus,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { apiRequest } from "../../lib/queryClient";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";

export const AdminDashboard = (): JSX.Element => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "security" | "settings" | "homepage">("overview");

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
              onClick={() => navigate("/security-dashboard")}
              className={`px-4 py-2 font-medium ${
                activeTab === "security"
                  ? "text-[#003d2b] border-b-2 border-[#003d2b]"
                  : "text-gray-600 hover:text-[#003d2b]"
              }`}
            >
              Security
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
            <button
              onClick={() => setActiveTab("homepage")}
              className={`px-4 py-2 font-medium ${
                activeTab === "homepage"
                  ? "text-[#003d2b] border-b-2 border-[#003d2b]"
                  : "text-gray-600 hover:text-[#003d2b]"
              }`}
            >
              Homepage
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
                        onClick={() => setActiveTab("users")}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users
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
              <UserManagement />
            )}

            {activeTab === "settings" && (
              <SystemSettings />
            )}

            {activeTab === "homepage" && (
              <HomepageContentManager />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Homepage Content Manager Component
const HomepageContentManager = () => {
  const [selectedSection, setSelectedSection] = useState<string>("hero_slider");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: homepageContent, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'homepage-content', selectedSection],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/homepage-content?section=${selectedSection}`);
      return await response.json();
    },
  });

  // Function to invalidate all homepage content queries
  const invalidateHomepageQueries = () => {
    // Invalidate admin queries
    queryClient.invalidateQueries({ queryKey: ['admin', 'homepage-content'] });
    // Invalidate public homepage queries (used by the actual homepage)
    queryClient.invalidateQueries({ queryKey: ['homepage-content'] });
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PUT', `/api/admin/homepage-content/${id}`, {
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      refetch();
      invalidateHomepageQueries();
      toast({
        title: "Success",
        description: "Content updated successfully. Homepage will refresh automatically.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', `/api/admin/homepage-content`, {
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      refetch();
      invalidateHomepageQueries();
      toast({
        title: "Success",
        description: "Content created successfully. Homepage will refresh automatically.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create content",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/admin/homepage-content/${id}`);
      if (!response.ok) throw new Error('Delete failed');
      return;
    },
    onSuccess: () => {
      refetch();
      invalidateHomepageQueries();
      toast({
        title: "Success",
        description: "Content deleted successfully. Homepage will refresh automatically.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete content",
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/admin/homepage-content/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return await response.json();
    },
    onSuccess: () => {
      invalidateHomepageQueries();
      toast({
        title: "Success",
        description: "Image uploaded successfully. Homepage will refresh automatically.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = async (file: File, contentId: number | null, field: 'imageUrl' | 'value', section: string, key: string) => {
    try {
      const result = await uploadImageMutation.mutateAsync(file);
      if (contentId) {
        updateMutation.mutate({
          id: contentId,
          data: { [field]: result.url },
        });
      } else {
        // Create new content entry
        createMutation.mutate({
          section,
          key,
          contentType: 'image',
          imageUrl: result.url,
          isActive: true,
        });
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  const sections = [
    { value: "hero_slider", label: "Hero Slider" },
    { value: "partners", label: "Partners Section" },
    { value: "features", label: "Features Section" },
    { value: "decorative_images", label: "Decorative Images" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Homepage Content Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Section</label>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-600">Loading content...</p>
          ) : (
            <div className="space-y-4">
              {selectedSection === "hero_slider" && (
                <HeroSliderEditor 
                  content={homepageContent || []} 
                  onUpdate={updateMutation.mutate}
                  onCreate={createMutation.mutate}
                  onDelete={deleteMutation.mutate}
                  onImageUpload={handleImageUpload}
                  section={selectedSection}
                />
              )}
              {selectedSection === "partners" && (
                <PartnersSectionEditor 
                  content={homepageContent || []} 
                  onUpdate={updateMutation.mutate}
                  onCreate={createMutation.mutate}
                  onDelete={deleteMutation.mutate}
                  onImageUpload={handleImageUpload}
                  section={selectedSection}
                />
              )}
              {selectedSection === "features" && (
                <FeaturesSectionEditor 
                  content={homepageContent || []} 
                  onUpdate={updateMutation.mutate}
                  onCreate={createMutation.mutate}
                  onDelete={deleteMutation.mutate}
                  onImageUpload={handleImageUpload}
                  section={selectedSection}
                />
              )}
              {selectedSection === "decorative_images" && (
                <DecorativeImagesEditor 
                  content={homepageContent || []} 
                  onUpdate={updateMutation.mutate}
                  onCreate={createMutation.mutate}
                  onDelete={deleteMutation.mutate}
                  onImageUpload={handleImageUpload}
                  section={selectedSection}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Hero Slider Editor Component
const HeroSliderEditor = ({ content, onUpdate, onCreate, onDelete, onImageUpload, section }: any) => {
  const slides = [1, 2, 3];
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});
  
  // Initialize form data from content
  useEffect(() => {
    if (content && content.length > 0) {
      const initialData: Record<string, Record<string, string>> = {};
      slides.forEach((slideNum) => {
        const slideContent = content.filter((c: any) => c.key?.startsWith(`slide_${slideNum}`));
        const badgeText = slideContent.find((c: any) => c.key === `slide_${slideNum}_badge_text`);
        const description = slideContent.find((c: any) => c.key === `slide_${slideNum}_description`);
        initialData[slideNum] = {
          badge_text: badgeText?.value || "",
          description: description?.value || "",
        };
      });
      setFormData(initialData);
    }
  }, [content]);
  
  const handleInputChange = (slideNum: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [slideNum]: {
        ...prev[slideNum],
        [field]: value,
      },
    }));
  };

  const handleSaveSlide = (slideNum: number) => {
    const slideContent = content.filter((c: any) => c.key?.startsWith(`slide_${slideNum}`));
    const badgeText = slideContent.find((c: any) => c.key === `slide_${slideNum}_badge_text`);
    const description = slideContent.find((c: any) => c.key === `slide_${slideNum}_description`);

    // Save badge text
    const badgeValue = formData[slideNum]?.['badge_text'];
    if (badgeValue !== undefined) {
      if (badgeText) {
        onUpdate({ id: badgeText.id, data: { value: badgeValue } });
      } else {
        onCreate({
          section,
          key: `slide_${slideNum}_badge_text`,
          contentType: 'text',
          value: badgeValue,
          isActive: true,
          order: slideNum,
        });
      }
    }

    // Save description
    const descValue = formData[slideNum]?.['description'];
    if (descValue !== undefined) {
      if (description) {
        onUpdate({ id: description.id, data: { value: descValue } });
      } else {
        onCreate({
          section,
          key: `slide_${slideNum}_description`,
          contentType: 'text',
          value: descValue,
          isActive: true,
          order: slideNum,
        });
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Hero Slider Slides</h3>
      </div>
      {slides.map((slideNum) => {
        const slideContent = content.filter((c: any) => c.key?.startsWith(`slide_${slideNum}`));
        const badgeText = slideContent.find((c: any) => c.key === `slide_${slideNum}_badge_text`);
        const description = slideContent.find((c: any) => c.key === `slide_${slideNum}_description`);
        const backgroundImage = slideContent.find((c: any) => c.key === `slide_${slideNum}_background`);
        const titleImage = slideContent.find((c: any) => c.key === `slide_${slideNum}_title_image`);
        
        return (
          <Card key={slideNum}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Slide {slideNum}</CardTitle>
                <Button
                  size="sm"
                  onClick={() => handleSaveSlide(slideNum)}
                  className="bg-app-primary text-white"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save Slide {slideNum}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Badge Text</label>
                <Input
                  value={formData[slideNum]?.['badge_text'] ?? badgeText?.value ?? ""}
                  onChange={(e) => handleInputChange(slideNum, 'badge_text', e.target.value)}
                  placeholder="Enter badge text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  className="w-full"
                  rows={3}
                  value={formData[slideNum]?.['description'] ?? description?.value ?? ""}
                  onChange={(e) => handleInputChange(slideNum, 'description', e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                {backgroundImage?.imageUrl && (
                  <img src={backgroundImage.imageUrl} alt="Background" className="w-full h-48 object-cover mb-2 rounded" />
                )}
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImageUpload(file, backgroundImage?.id || null, 'imageUrl', section, `slide_${slideNum}_background`);
                      }
                    }}
                    className="flex-1"
                  />
                  {backgroundImage && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(backgroundImage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title Image</label>
                {titleImage?.imageUrl && (
                  <img src={titleImage.imageUrl} alt="Title" className="w-full h-32 object-contain mb-2 rounded" />
                )}
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImageUpload(file, titleImage?.id || null, 'imageUrl', section, `slide_${slideNum}_title_image`);
                      }
                    }}
                    className="flex-1"
                  />
                  {titleImage && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(titleImage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// Partners Section Editor Component
const PartnersSectionEditor = ({ content, onUpdate, onCreate, onDelete, onImageUpload, section }: any) => {
  const badgeText = content.find((c: any) => c.key === 'partners_badge_text');
  const title = content.find((c: any) => c.key === 'partners_title');
  const description = content.find((c: any) => c.key === 'partners_description');
  const logos = content.filter((c: any) => c.key?.startsWith('partner_logo_'));
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [newLogoKey, setNewLogoKey] = useState("");

  // Initialize form data from content
  useEffect(() => {
    if (content && content.length > 0) {
      setFormData({
        badge_text: badgeText?.value || "",
        title: title?.value || "",
        description: description?.value || "",
      });
    }
  }, [content, badgeText, title, description]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSection = () => {
    // Save badge text
    const badgeValue = formData['badge_text'];
    if (badgeValue !== undefined) {
      if (badgeText) {
        onUpdate({ id: badgeText.id, data: { value: badgeValue } });
      } else {
        onCreate({
          section,
          key: 'partners_badge_text',
          contentType: 'text',
          value: badgeValue,
          isActive: true,
        });
      }
    }

    // Save title
    const titleValue = formData['title'];
    if (titleValue !== undefined) {
      if (title) {
        onUpdate({ id: title.id, data: { value: titleValue } });
      } else {
        onCreate({
          section,
          key: 'partners_title',
          contentType: 'text',
          value: titleValue,
          isActive: true,
        });
      }
    }

    // Save description
    const descValue = formData['description'];
    if (descValue !== undefined) {
      if (description) {
        onUpdate({ id: description.id, data: { value: descValue } });
      } else {
        onCreate({
          section,
          key: 'partners_description',
          contentType: 'text',
          value: descValue,
          isActive: true,
        });
      }
    }
  };

  const handleAddLogo = () => {
    if (!newLogoKey.trim()) return;
    const logoKey = `partner_logo_${newLogoKey.trim()}`;
    onCreate({
      section,
      key: logoKey,
      contentType: 'image',
      imageUrl: '',
      isActive: true,
    });
    setNewLogoKey("");
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Partners Section</h3>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Section Content</CardTitle>
            <Button
              size="sm"
              onClick={handleSaveSection}
              className="bg-app-primary text-white"
            >
              <Save className="w-4 h-4 mr-1" />
              Save Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Badge Text</label>
            <Input
              value={formData['badge_text'] ?? badgeText?.value ?? "OUR PARTNERS"}
              onChange={(e) => handleInputChange('badge_text', e.target.value)}
              placeholder="Enter badge text"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={formData['title'] ?? title?.value ?? ""}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              className="w-full"
              rows={3}
              value={formData['description'] ?? description?.value ?? ""}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter description"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Partner Logos</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Logo key (e.g., 1, 2, 3)"
                value={newLogoKey}
                onChange={(e) => setNewLogoKey(e.target.value)}
                className="w-32"
                onKeyPress={(e) => e.key === 'Enter' && handleAddLogo()}
              />
              <Button
                size="sm"
                onClick={handleAddLogo}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Logo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Manage partner logos. Each logo should have a unique key (e.g., partner_logo_1, partner_logo_2).</p>
          <div className="space-y-4">
            {logos.length > 0 ? (
              logos.map((logo: any, index: number) => (
                <div key={logo.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {logo.imageUrl && (
                    <img src={logo.imageUrl} alt={`Partner ${index + 1}`} className="w-32 h-16 object-contain" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{logo.key}</p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onImageUpload(file, logo.id, 'imageUrl', section, logo.key);
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(logo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No partner logos configured. Click "Add Logo" to create a new one.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Decorative Images Editor Component
const DecorativeImagesEditor = ({ content, onUpdate: _onUpdate, onCreate: _onCreate, onDelete, onImageUpload, section }: any) => {
  const decorativeImages = content.filter((c: any) => c.contentType === 'image' && c.section === 'decorative_images');

  const imagePositions = [
    { key: 'decorative_nate_shape', label: 'Nate Shape (Top Left)', defaultSrc: '/nate-shape.svg' },
    { key: 'decorative_star_1', label: 'Star 1 (Top Left)', defaultSrc: '/icon-star.svg' },
    { key: 'decorative_star_2', label: 'Star 2 (Top Right)', defaultSrc: '/icon-star-3.svg' },
    { key: 'decorative_star_3', label: 'Star 3 (Bottom Right)', defaultSrc: '/icon-star.svg' },
    { key: 'decorative_star_4', label: 'Star 4 (Bottom Left)', defaultSrc: '/icon-star-1.svg' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Decorative Images</h3>
      <p className="text-sm text-gray-600">Manage decorative images that appear throughout the homepage.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {imagePositions.map((position) => {
          const imageContent = decorativeImages.find((c: any) => c.key === position.key);
          return (
            <Card key={position.key}>
              <CardHeader>
                <CardTitle className="text-base">{position.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50">
                  {imageContent?.imageUrl ? (
                    <img 
                      src={imageContent.imageUrl} 
                      alt={position.label} 
                      className="max-w-full max-h-32 object-contain" 
                    />
                  ) : (
                    <div className="text-sm text-gray-400">No image set</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImageUpload(file, imageContent?.id || null, 'imageUrl', section, position.key);
                      }
                    }}
                    className="flex-1"
                  />
                  {imageContent && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(imageContent.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Features Section Editor Component
const FeaturesSectionEditor = ({ content, onUpdate, onCreate, onDelete, onImageUpload, section }: any) => {
  const features = content.filter((c: any) => c.key?.startsWith('feature_') && c.contentType === 'json');
  const [newFeatureTitle, setNewFeatureTitle] = useState("");
  const [newFeatureDescription, setNewFeatureDescription] = useState("");
  const [editingFeature, setEditingFeature] = useState<any>(null);

  const handleAddFeature = () => {
    if (!newFeatureTitle.trim()) return;
    const featureKey = `feature_${Date.now()}`;
    const featureData = {
      title: newFeatureTitle,
      description: newFeatureDescription,
      icon: "",
    };
    onCreate({
      section,
      key: featureKey,
      contentType: 'json',
      jsonData: featureData,
      isActive: true,
    });
    setNewFeatureTitle("");
    setNewFeatureDescription("");
  };

  const handleUpdateFeature = (feature: any, updates: any) => {
    onUpdate({
      id: feature.id,
      data: {
        jsonData: { ...feature.jsonData, ...updates },
      },
    });
    setEditingFeature(null);
  };

  const handleDeleteFeature = (featureId: number) => {
    onDelete(featureId);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Features Section</h3>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Feature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Feature Title</label>
            <Input
              value={newFeatureTitle}
              onChange={(e) => setNewFeatureTitle(e.target.value)}
              placeholder="Enter feature title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Feature Description</label>
            <Textarea
              className="w-full"
              rows={3}
              value={newFeatureDescription}
              onChange={(e) => setNewFeatureDescription(e.target.value)}
              placeholder="Enter feature description"
            />
          </div>
          <Button onClick={handleAddFeature} className="bg-app-primary text-white">
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.length > 0 ? (
              features.map((feature: any) => (
                <div key={feature.id} className="p-4 border rounded-lg">
                  {editingFeature?.id === feature.id ? (
                    <FeatureEditForm
                      feature={feature}
                      onSave={(updates: any) => handleUpdateFeature(feature, updates)}
                      onCancel={() => setEditingFeature(null)}
                      onImageUpload={(file: File) => onImageUpload(file, feature.id, 'imageUrl', section, feature.key)}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{feature.jsonData?.title || 'Untitled Feature'}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature.jsonData?.description || ''}</p>
                        {feature.jsonData?.icon && (
                          <img src={feature.jsonData.icon} alt="Feature icon" className="w-8 h-8 mt-2" />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingFeature(feature)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFeature(feature.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No features configured. Add a new feature above.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Feature Edit Form Component
const FeatureEditForm = ({ feature, onSave, onCancel, onImageUpload }: any) => {
  const [title, setTitle] = useState(feature.jsonData?.title || "");
  const [description, setDescription] = useState(feature.jsonData?.description || "");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter feature title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          className="w-full"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter feature description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Icon Image</label>
        {feature.jsonData?.icon && (
          <img src={feature.jsonData.icon} alt="Icon" className="w-16 h-16 mb-2 rounded" />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onImageUpload(file);
            }
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onSave({ title, description })}
          className="bg-app-primary text-white"
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

// User Management Component
const UserManagement = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const limit = 10;

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'users', page, searchQuery, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      });
      const response = await apiRequest('GET', `/api/admin/users?${params}`);
      return await response.json();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await apiRequest('PATCH', `/api/admin/users/${id}`, {
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update user' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
    onSuccess: (_data, variables) => {
      refetch();
      const action = variables.data.isAdmin ? "granted admin role to" : "removed admin role from";
      toast({
        title: "Success",
        description: `Successfully ${action} user`,
      });
      setSelectedUser(null);
    },
    onError: (error: any) => {
      console.error('Failed to update user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user. Please check the console for details.",
        variant: "destructive",
      });
    },
  });

  const handleExport = async () => {
    try {
      const response = await fetch('/api/admin/users/export', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Success",
        description: "Users exported successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export users",
        variant: "destructive",
      });
    }
  };

  const handleSetAdmin = async (userId: number, isAdmin: boolean) => {
    const user = usersData?.users?.find((u: any) => u.id === userId);
    const action = isAdmin ? "grant admin role to" : "remove admin role from";
    const confirmMessage = `Are you sure you want to ${action} ${user?.email || `user ${userId}`}?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    updateUserMutation.mutate({
      id: userId,
      data: { isAdmin },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>User Management</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users by username or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-600 text-center py-8">Loading users...</p>
          ) : usersData?.users && usersData.users.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username || 'N/A'}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.sanctionedUntil ? "destructive" : "default"} className="bg-green-500 text-white">
                          {user.sanctionedUntil ? "Suspended" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isAdmin ? (
                          <Badge variant="default" className="bg-blue-500">Admin</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{user.trustScore || '0.00'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetAdmin(user.id, !user.isAdmin)}
                            disabled={updateUserMutation.isPending}
                            title={user.isAdmin ? "Remove Admin Role" : "Grant Admin Role"}
                          >
                            {updateUserMutation.isPending ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                            ) : user.isAdmin ? (
                              <XCircle className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {usersData.pagination && usersData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, usersData.pagination.total)} of {usersData.pagination.total} users
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(usersData.pagination.totalPages, p + 1))}
                      disabled={page >= usersData.pagination.totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-600 text-center py-8">No users found</p>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <p className="text-sm text-gray-600">{selectedUser.username || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Trust Score</label>
                <p className="text-sm text-gray-600">{selectedUser.trustScore || '0.00'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Verification Level</label>
                <p className="text-sm text-gray-600">{selectedUser.verificationLevel || 'none'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <p className="text-sm text-gray-600">
                  {selectedUser.sanctionedUntil ? `Suspended until ${new Date(selectedUser.sanctionedUntil).toLocaleDateString()}` : 'Active'}
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    const action = selectedUser.isAdmin ? "remove admin role from" : "grant admin role to";
                    const confirmMessage = `Are you sure you want to ${action} ${selectedUser.email}?`;
                    if (window.confirm(confirmMessage)) {
                      handleSetAdmin(selectedUser.id, !selectedUser.isAdmin);
                    }
                  }}
                  variant={selectedUser.isAdmin ? "destructive" : "default"}
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? "Processing..." : selectedUser.isAdmin ? "Remove Admin" : "Make Admin"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// System Settings Component
const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const { data: settingsData, refetch } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/settings');
      return await response.json();
    },
  });

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
      setIsLoading(false);
    }
  }, [settingsData]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', '/api/admin/settings', {
        body: JSON.stringify(data),
      });
      return await response.json();
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(settings);
  };

  if (isLoading) {
    return <p className="text-sm text-gray-600">Loading settings...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Settings</CardTitle>
            <Button onClick={handleSave} className="bg-app-primary text-white">
              <Save className="w-4 h-4 mr-1" />
              Save Settings
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Maintenance Mode</label>
                  <p className="text-xs text-gray-500">Enable to put the system in maintenance mode</p>
                </div>
                <Select
                  value={settings.maintenanceMode ? "enabled" : "disabled"}
                  onValueChange={(value) => setSettings({ ...settings, maintenanceMode: value === "enabled" })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">Registration Enabled</label>
                  <p className="text-xs text-gray-500">Allow new user registrations</p>
                </div>
                <Select
                  value={settings.registrationEnabled !== false ? "enabled" : "disabled"}
                  onValueChange={(value) => setSettings({ ...settings, registrationEnabled: value === "enabled" })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium">MFA Required</label>
                  <p className="text-xs text-gray-500">Require multi-factor authentication for all users</p>
                </div>
                <Select
                  value={settings.mfaRequired ? "required" : "optional"}
                  onValueChange={(value) => setSettings({ ...settings, mfaRequired: value === "required" })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optional">Optional</SelectItem>
                    <SelectItem value="required">Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Minimum Password Length</label>
                <Input
                  type="number"
                  value={settings.minPasswordLength || 8}
                  onChange={(e) => setSettings({ ...settings, minPasswordLength: parseInt(e.target.value) || 8 })}
                  className="w-32 mt-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

