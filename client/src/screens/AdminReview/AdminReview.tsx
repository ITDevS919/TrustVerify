import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Download, Eye, AlertCircle, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface KycSubmission {
  submissionId: string;
  userId: number;
  userEmail: string;
  userName: string;
  userPhone?: string;
  documentType: string;
  documentNumber?: string;
  frontImagePath: string;
  backImagePath?: string;
  selfieImagePath: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  manualMatchScore?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  finalResult?: 'pass' | 'fail' | 'review';
  reviewNotes?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  userType?: 'hr_candidate' | 'marketplace_seller' | 'ecommerce_customer' | 'beta_user';
}

export const AdminReview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<KycSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");

  // Review form state
  const [manualMatchScore, setManualMatchScore] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [finalResult, setFinalResult] = useState<'pass' | 'fail' | 'review'>('review');
  const [reviewNotes, setReviewNotes] = useState("");

  // For MVP testing, allow all authenticated users
  // In production, this should check isAdmin or email domain
  const isDevelopment = (import.meta as any).env?.DEV || (import.meta as any).env?.VITE_ALLOW_ALL_ADMIN === 'true';
  const hasAdminAccess = isDevelopment || user?.email?.includes('@trustverify.com') || user?.isAdmin;

  // Fetch all submissions
  const { data: submissions = [], isLoading } = useQuery<KycSubmission[]>({
    queryKey: ['admin', 'kyc', 'submissions', statusFilter, userTypeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (userTypeFilter !== 'all') params.append('userType', userTypeFilter);
      
      const response = await apiRequest('GET', `/api/admin/kyc/submissions?${params.toString()}`);
      const data = await response.json();
      // Ensure we return an array
      return Array.isArray(data) ? data : [];
    },
    enabled: !!user && hasAdminAccess,
  });

  // Update review mutation
  const reviewMutation = useMutation({
    mutationFn: async (data: {
      submissionId: string;
      manualMatchScore?: number;
      riskLevel?: 'low' | 'medium' | 'high';
      finalResult?: 'pass' | 'fail' | 'review';
      reviewNotes?: string;
    }) => {
      return apiRequest('PATCH', `/api/admin/kyc/submissions/${data.submissionId}/review`, {
        manualMatchScore: data.manualMatchScore,
        riskLevel: data.riskLevel,
        finalResult: data.finalResult,
        reviewNotes: data.reviewNotes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'kyc', 'submissions'] });
      toast({
        title: "Review submitted",
        description: "The verification review has been saved successfully.",
      });
      setSelectedSubmission(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  // Export CSV
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/kyc/export', {
        credentials: 'include',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kyc_submissions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Export successful",
        description: "CSV file downloaded successfully.",
      });
    },
  });

  const filteredSubmissions = Array.isArray(submissions) 
    ? submissions.filter(submission => {
        const matchesSearch = 
          submission.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          submission.submissionId.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
      })
    : [];

  const handleSelectSubmission = (submission: KycSubmission) => {
    setSelectedSubmission(submission);
    setManualMatchScore(submission.manualMatchScore || 0);
    setRiskLevel(submission.riskLevel || 'low');
    setFinalResult(submission.finalResult || 'review');
    setReviewNotes(submission.reviewNotes || '');
  };

  const handleSubmitReview = () => {
    if (!selectedSubmission) return;

    reviewMutation.mutate({
      submissionId: selectedSubmission.submissionId,
      manualMatchScore,
      riskLevel,
      finalResult,
      reviewNotes,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      reviewing: { className: "bg-blue-100 text-blue-800", label: "Reviewing" },
      approved: { className: "bg-green-100 text-green-800", label: "Approved" },
      rejected: { className: "bg-red-100 text-red-800", label: "Rejected" },
    };
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getRiskBadge = (risk?: string) => {
    if (!risk) return null;
    const variants: Record<string, { className: string }> = {
      low: { className: "bg-green-100 text-green-800" },
      medium: { className: "bg-yellow-100 text-yellow-800" },
      high: { className: "bg-red-100 text-red-800" },
    };
    const variant = variants[risk] || variants.low;
    return <Badge className={variant.className}>{risk.toUpperCase()}</Badge>;
  };

  const getImageUrl = async (imagePath: string) => {
    // If it's a storage key (from cloud storage), we need to get the file ID first
    // For now, if it contains 'kyc/' it's a storage key, otherwise it's a legacy path
    if (imagePath.includes('kyc/') || imagePath.startsWith('kyc/')) {
      // This is a storage key - we need to find the file ID from the database
      // For now, return a placeholder - the backend should handle this
      return `/api/files/${imagePath}`;
    }
    // Legacy path handling
    const filename = imagePath.split(/[/\\]/).pop() || imagePath;
    return `/api/files/${filename}`;
  };

  if (!user || !hasAdminAccess) {
    return (
      <main className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
        <Header />
        <div className="flex items-center justify-center flex-1 p-8">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
      <Header />
      
      <section className="flex flex-col items-start gap-6 w-full px-6 sm:px-8 xl:px-[107px] py-[72px]">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-0 h-auto hover:bg-transparent"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-[22px] tracking-[0] leading-[normal]">
            Back
          </span>
        </Button>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl">
                KYC Admin Review
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base mt-2">
                Manual verification review for MVP testing
              </p>
            </div>
          </div>
          <Button
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          {/* Submissions List */}
          <div className="lg:col-span-1">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Submissions ({filteredSubmissions.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="hr_candidate">HR Candidates</SelectItem>
                      <SelectItem value="marketplace_seller">Marketplace Sellers</SelectItem>
                      <SelectItem value="ecommerce_customer">E-commerce Customers</SelectItem>
                      <SelectItem value="beta_user">Beta Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submission List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No submissions found</div>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <Card
                        key={submission.submissionId}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedSubmission?.submissionId === submission.submissionId
                            ? 'border-[#27ae60] border-2'
                            : ''
                        }`}
                        onClick={() => handleSelectSubmission(submission)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{submission.userName}</h3>
                              <p className="text-xs text-gray-500">{submission.userEmail}</p>
                            </div>
                            {getStatusBadge(submission.status)}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </span>
                            {submission.userType && (
                              <Badge variant="outline" className="text-xs">
                                {submission.userType.replace('_', ' ')}
                              </Badge>
                            )}
                            {getRiskBadge(submission.riskLevel)}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div className="lg:col-span-2">
            {selectedSubmission ? (
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Review Submission: {selectedSubmission.submissionId}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* User Information */}
                  <div>
                    <h3 className="font-semibold mb-3">User Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Name:</span>
                        <p className="font-medium">{selectedSubmission.userName}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium">{selectedSubmission.userEmail}</p>
                      </div>
                      {selectedSubmission.userPhone && (
                        <div>
                          <span className="text-gray-500">Phone:</span>
                          <p className="font-medium">{selectedSubmission.userPhone}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Document Type:</span>
                        <p className="font-medium">{selectedSubmission.documentType}</p>
                      </div>
                      {selectedSubmission.documentNumber && (
                        <div>
                          <span className="text-gray-500">Document Number:</span>
                          <p className="font-medium">{selectedSubmission.documentNumber}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">Submitted:</span>
                        <p className="font-medium">
                          {new Date(selectedSubmission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="font-semibold mb-3">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Front ID</p>
                        <img
                          src={getImageUrl(selectedSubmission.frontImagePath)}
                          alt="Front ID"
                          className="w-full h-48 object-contain border rounded-lg bg-gray-50"
                        />
                      </div>
                      {selectedSubmission.backImagePath && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Back ID</p>
                          <img
                            src={getImageUrl(selectedSubmission.backImagePath)}
                            alt="Back ID"
                            className="w-full h-48 object-contain border rounded-lg bg-gray-50"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Selfie</p>
                        <img
                          src={getImageUrl(selectedSubmission.selfieImagePath)}
                          alt="Selfie"
                          className="w-full h-48 object-contain border rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Review Form */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Review Details</h3>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Manual Match Score (0-100%)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={manualMatchScore}
                        onChange={(e) => setManualMatchScore(parseInt(e.target.value) || 0)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Risk Level</label>
                      <Select value={riskLevel} onValueChange={(v: any) => setRiskLevel(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Final Result</label>
                      <Select value={finalResult} onValueChange={(v: any) => setFinalResult(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pass">Pass</SelectItem>
                          <SelectItem value="fail">Fail</SelectItem>
                          <SelectItem value="review">Needs Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Review Notes</label>
                      <Textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes about your review..."
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSubmitReview}
                        disabled={reviewMutation.isPending}
                        className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] flex-1"
                      >
                        {reviewMutation.isPending ? "Saving..." : "Save Review"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSubmission(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white">
                <CardContent className="p-12 text-center">
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Select a Submission</h3>
                  <p className="text-gray-500">
                    Choose a submission from the list to begin review
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

