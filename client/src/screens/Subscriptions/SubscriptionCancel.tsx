import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { XCircle } from "lucide-react";
import { Header } from "../../components/Header";

export const SubscriptionCancel = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#f6f6f6] w-full flex flex-col min-h-screen">
      <Header />
      <div className="flex items-center justify-center flex-1">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Checkout Canceled</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-[#808080]">
              Your subscription checkout was canceled. No charges were made.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/pricing")}
                className="flex-1 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                View Plans
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="flex-1"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

