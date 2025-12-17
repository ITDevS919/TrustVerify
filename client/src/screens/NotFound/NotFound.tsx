import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full flex flex-col relative min-h-screen">
      <section className="flex flex-col items-center justify-center gap-6 w-full px-4 sm:px-6 md:px-[50px] py-10 md:py-[70px] flex-1">
        <Card className="w-full max-w-[600px] bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardContent className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-15 h-15 flex items-center justify-center rounded-full bg-[#e7000b33]">
                <AlertCircle className="h-10 w-10 text-[#e7000b]" />
              </div>

              <div className="flex flex-col items-center gap-4">
                <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-4xl sm:text-5xl tracking-[0] leading-[normal]">
                  404
                </h1>
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl tracking-[0] leading-[normal]">
                  Page Not Found
                </h2>
              </div>

              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg tracking-[0] leading-6 max-w-md">
                The page you're looking for doesn't exist or has been moved. Please check the URL or return to the homepage.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-4">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full sm:w-auto h-[50px] px-4 bg-app-primary hover:opacity-90 rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[-0.20px] leading-[18px]"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Button>
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full sm:w-auto h-[50px] px-6 border border-solid border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a78]/10 rounded-lg [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-sm tracking-[-0.20px] leading-[18px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
