import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { HeaderDemo } from "../../components/HeaderDemo";

export const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to management page after 3 seconds
    const timer = setTimeout(() => {
      navigate("/subscription/manage");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
      <HeaderDemo />
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-[#808080]">
              Your subscription has been successfully activated. You'll be redirected to the management page shortly.
            </p>
            <Button
              onClick={() => navigate("/subscription/manage")}
              className="w-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
            >
              Go to Subscription Management
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

