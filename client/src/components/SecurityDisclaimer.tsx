import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SecurityDisclaimerProps {
  variant?: 'default' | 'compact';
}

export function SecurityDisclaimer({ variant = 'default' }: SecurityDisclaimerProps) {
  if (variant === 'compact') {
    return (
      <div className="text-xs text-gray-500 text-center p-3 border-t bg-gray-50">
        <p className="mb-1">
          <strong>Disclaimer:</strong> Analysis results are for informational purposes only and should not be the sole basis for security decisions.
        </p>
        <p>
          TrustVerify provides technical analysis but cannot guarantee complete accuracy. Always verify website legitimacy through official channels.
        </p>
      </div>
    );
  }

  return (
    <Card className="mt-8 bg-[#f7f7f7] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <Info className="h-5 w-5 text-app-secondary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Important Disclaimer</h3>
            <div className="space-y-3 [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-sm text-[#808080]">
              <p>
                <strong className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Informational Tool Only:</strong> This website integrity checker provides technical analysis for educational and informational purposes. Results should not be the sole basis for making security or business decisions.
              </p>
              
              <p>
                <strong className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Accuracy Limitations:</strong> While we use real-time security analysis, no automated system can guarantee 100% accuracy. False positives and false negatives may occur. Always verify website legitimacy through official channels.
              </p>
              
              <p>
                <strong className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Not Professional Advice:</strong> This analysis does not constitute professional security, legal, or financial advice. For critical decisions, consult qualified professionals.
              </p>

              <p>
                <strong className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">No Warranty:</strong> TrustVerify provides this service "as is" without warranties of any kind. We are not liable for any decisions made based on our analysis results.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e4e4e4] pt-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-app-secondary" />
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Found an issue with our analysis?</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium"
              onClick={() => window.open('mailto:support@trustverify.com?subject=Website Analysis Feedback', '_blank')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium"
              onClick={() => window.open('/contact', '_blank')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Request Review
            </Button>
          </div>
          
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-xs text-[#808080] mt-3">
            We continuously improve our analysis accuracy and welcome your feedback to enhance our service.
          </p>
        </div>

        <div className="mt-4 p-3 bg-[#f7f7f7] border border-[#e4e4e4] rounded-[10px]">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-xs text-[#003d2b]">
              <strong className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold">Security Reminder:</strong> Never share sensitive information (passwords, financial details, personal data) with websites you haven't independently verified, regardless of our analysis results.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}