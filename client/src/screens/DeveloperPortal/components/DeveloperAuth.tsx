import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { useAuth } from "../../../hooks/use-auth";
import { apiRequest } from "../../../lib/queryClient";
import { useToast } from "../../../hooks/use-toast";
import { Building2, Globe, FileText, AlertCircle } from "lucide-react";

interface DeveloperAuthProps {
  onSuccess: () => void;
}

export const DeveloperAuth = ({ onSuccess }: DeveloperAuthProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    description: "",
  });

  const checkDeveloperAccount = async () => {
    try {
      const response = await apiRequest("GET", "/api/developer/account");
      const account = await response.json();
      if (account && (account.status === "approved" || account.status === "pending")) {
        // Allow access to portal even if pending (with limitations)
        onSuccess();
        if (account.status === "pending") {
          toast({
            title: "Account Pending Approval",
            description: "Your developer account is pending approval. Some features may be limited until approval.",
            variant: "default",
          });
        }
        return true;
      }
      return false;
    } catch (error: any) {
      // Account doesn't exist
      return false;
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/developer/account", formData);
      const account = await response.json();
      toast({
        title: "Developer Account Created",
        description: account.status === "approved" 
          ? "Your developer account has been created and approved successfully!"
          : "Your developer account has been created and is pending approval.",
        variant: "default",
      });
      setIsSignup(false);
      // Allow access to portal regardless of status (approved or pending)
      if (account.status === "approved" || account.status === "pending") {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create developer account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check on mount
  useEffect(() => {
    checkDeveloperAccount();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Developer Portal Access</CardTitle>
            <CardDescription className="text-center">
              Please log in to access the Developer Portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => (window.location.href = "/login")}
                className="w-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                Go to Login
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/signup")}
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isSignup ? "Create Developer Account" : "Developer Account Required"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignup
              ? "Fill in your company details to create a developer account"
              : "You need a developer account to access the Developer Portal"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignup ? (
            <form onSubmit={handleCreateAccount} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="companyName" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Company Name *
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="Your Company Name"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourcompany.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your company and how you plan to use our API..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSignup(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Developer Account Required</h3>
                    <p className="text-sm text-blue-700">
                      To access the Developer Portal, you need to create a developer account. This
                      allows you to:
                    </p>
                    <ul className="list-disc list-inside text-sm text-blue-700 mt-2 space-y-1">
                      <li>Generate API keys for authentication</li>
                      <li>Create and manage custom workflows</li>
                      <li>Configure webhooks for real-time notifications</li>
                      <li>Access analytics and usage metrics</li>
                      <li>Download SDKs and integration tools</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsSignup(true)}
                className="w-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                Create Developer Account
              </Button>

              <Button
                variant="outline"
                onClick={checkDeveloperAccount}
                className="w-full"
              >
                Check Account Status
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

