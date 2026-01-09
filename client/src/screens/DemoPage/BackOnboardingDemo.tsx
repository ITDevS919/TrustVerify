import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Fingerprint, 
  Globe, 
  User, 
  Building2,
  FileText,
  Smartphone,
  ArrowRight,
  Clock,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationStep {
  id: string;
  title: string;
  provider: string;
  icon: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  score?: number;
  duration?: number;
  signals?: string[];
}

export default function BankOnboardingDemo() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customerType, setCustomerType] = useState<'individual' | 'business'>('individual');
  
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>([
    {
      id: 'trustverify-kyc',
      title: 'Identity Verification (KYC)',
      provider: 'TrustVerify',
      icon: User,
      status: 'pending',
      signals: ['Document Scan', 'Liveness Detection', 'Face Match']
    },
    {
      id: 'trustverify-aml',
      title: 'AML Sanctions Screening',
      provider: 'TrustVerify',
      icon: Shield,
      status: 'pending',
      signals: ['1,200+ Watchlists', 'PEP Check', 'Adverse Media']
    },
    {
      id: 'trustverify-device',
      title: 'Device Intelligence',
      provider: 'TrustVerify',
      icon: Fingerprint,
      status: 'pending',
      signals: ['Device ID', 'Bot Detection', 'Velocity Check']
    },
    {
      id: 'trustverify-ip-risk',
      title: 'IP Risk Assessment',
      provider: 'TrustVerify',
      icon: Globe,
      status: 'pending',
      signals: ['Geolocation', 'Proxy/VPN', 'Fraud Score']
    }
  ]);

  const businessSteps: VerificationStep[] = [
    {
      id: 'trustverify-kyb',
      title: 'Business Verification (KYB)',
      provider: 'TrustVerify',
      icon: Building2,
      status: 'pending',
      signals: ['Company Registry', 'UBO Check', 'Director Verification']
    },
    {
      id: 'trustverify-aml',
      title: 'AML Sanctions Screening',
      provider: 'TrustVerify',
      icon: Shield,
      status: 'pending',
      signals: ['1,200+ Watchlists', 'PEP Check', 'Adverse Media']
    },
    {
      id: 'trustverify-device',
      title: 'Device Intelligence',
      provider: 'TrustVerify',
      icon: Fingerprint,
      status: 'pending',
      signals: ['Device ID', 'Bot Detection', 'Multi-Account']
    },
    {
      id: 'trustverify-ip-risk',
      title: 'IP Risk Assessment',
      provider: 'TrustVerify',
      icon: Globe,
      status: 'pending',
      signals: ['Geolocation', 'Proxy/VPN', 'Fraud Score']
    }
  ];

  const runVerification = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    
    const steps = customerType === 'individual' ? verificationSteps : businessSteps;
    const updatedSteps = [...steps].map(s => ({ ...s, status: 'pending' as 'pending' | 'processing' | 'completed' | 'failed' }));
    
    if (customerType === 'business') {
      setVerificationSteps(updatedSteps);
    } else {
      setVerificationSteps(updatedSteps);
    }

    for (let i = 0; i < updatedSteps.length; i++) {
      setCurrentStep(i);
      
      // Mark as processing
      updatedSteps[i] = { ...updatedSteps[i], status: 'processing' };
      setVerificationSteps([...updatedSteps]);

      toast({
        title: `${updatedSteps[i].provider} Processing`,
        description: updatedSteps[i].title,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      // Complete with mock score
      const score = Math.floor(75 + Math.random() * 23); // 75-98
      const duration = Math.floor(1.5 + Math.random() * 1.5); // 1.5-3 seconds
      
      updatedSteps[i] = { 
        ...updatedSteps[i], 
        status: 'completed',
        score,
        duration
      };
      setVerificationSteps([...updatedSteps]);

      toast({
        title: "✓ Verification Complete",
        description: `${updatedSteps[i].title}: Score ${score}/100`,
      });
    }

    setCurrentStep(updatedSteps.length);
    setIsRunning(false);

    // Show final result
    toast({
      title: "🎉 Onboarding Complete",
      description: "Customer risk assessment finished. View scoring dashboard.",
    });
  };

  const resetDemo = () => {
    setVerificationSteps(verificationSteps.map(s => ({ 
      ...s, 
      status: 'pending',
      score: undefined,
      duration: undefined
    })));
    setCurrentStep(0);
    setIsRunning(false);
  };

  const activeSteps = customerType === 'business' ? businessSteps : verificationSteps;
  const completedSteps = activeSteps.filter(s => s.status === 'completed').length;
  const progressPercent = (completedSteps / activeSteps.length) * 100;

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="w-full text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-4">
            Bank Customer Onboarding
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-lg sm:text-xl max-w-3xl mx-auto">
            Multi-Signal Risk Assessment for Proof of Concept
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
            <Info className="h-4 w-4" />
            <span>Powered by TrustVerify</span>
          </div>
        </div>

        {/* Customer Type Selector */}
        <div className="flex justify-center gap-4 mb-8 w-full">
          <Button
            variant={customerType === 'individual' ? 'default' : 'outline'}
            onClick={() => {
              setCustomerType('individual');
              resetDemo();
            }}
            disabled={isRunning}
            className={`h-[45px] rounded-lg ${customerType === 'individual' ? 'bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90' : 'border border-[#e4e4e4] hover:bg-[#f6f6f6]'}`}
            data-testid="button-individual-customer"
          >
            <User className="h-4 w-4 mr-2" />
            <span className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm ${customerType === 'individual' ? 'text-white' : 'text-[#003d2b]'}`}>Individual Customer</span>
          </Button>
          <Button
            variant={customerType === 'business' ? 'default' : 'outline'}
            onClick={() => {
              setCustomerType('business');
              resetDemo();
            }}
            disabled={isRunning}
            className={`h-[45px] rounded-lg ${customerType === 'business' ? 'bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90' : 'border border-[#e4e4e4] hover:bg-[#f6f6f6]'}`}
            data-testid="button-business-customer"
          >
            <Building2 className="h-4 w-4 mr-2" />
            <span className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm ${customerType === 'business' ? 'text-white' : 'text-[#003d2b]'}`}>Business Customer</span>
          </Button>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8 bg-[#fcfcfc] rounded-[20px] border-2 border-[#27ae60]/20 w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
              <span>Verification Progress</span>
              <Badge variant={isRunning ? "default" : completedSteps === activeSteps.length ? "default" : "secondary"} className="rounded-full">
                {isRunning ? 'In Progress' : completedSteps === activeSteps.length && completedSteps > 0 ? 'Complete' : 'Ready'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progressPercent} className="h-3" />
              <div className="flex justify-between text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                <span>{completedSteps} of {activeSteps.length} checks completed</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
          {activeSteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <Card 
                key={step.id}
                className={`bg-[#fcfcfc] rounded-[20px] border-2 transition-all duration-300 ${
                  step.status === 'processing' 
                    ? 'border-[#0052CC] shadow-lg shadow-[#0052CC]/20' 
                    : step.status === 'completed'
                    ? 'border-[#27ae60] bg-[#27ae60]/5'
                    : 'border-[#e4e4e4]'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg ${
                        step.status === 'completed' 
                          ? 'bg-[#27ae60]'
                          : step.status === 'processing'
                          ? 'bg-[#0052CC]'
                          : 'bg-[#e4e4e4]'
                      }`}>
                        <StepIcon className={`h-5 w-5 ${
                          step.status === 'pending' ? 'text-[#808080]' : 'text-white'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{step.title}</CardTitle>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">{step.provider}</p>
                      </div>
                    </div>
                    {step.status === 'completed' && (
                      <CheckCircle2 className="h-6 w-6 text-[#27ae60]" />
                    )}
                    {step.status === 'processing' && (
                      <div className="animate-spin">
                        <Clock className="h-6 w-6 text-[#0052CC]" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Signals */}
                    <div className="flex flex-wrap gap-2">
                      {step.signals?.map((signal) => (
                        <Badge key={signal} variant="outline" className="text-xs rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                          {signal}
                        </Badge>
                      ))}
                    </div>

                    {/* Results */}
                    {step.status === 'completed' && (
                      <div className="pt-3 border-t border-[#e4e4e4]">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Trust Score:</span>
                          <span className="text-lg font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">{step.score}/100</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Processing Time:</span>
                          <span className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{step.duration}s</span>
                        </div>
                      </div>
                    )}

                    {step.status === 'processing' && (
                      <div className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#0052CC] animate-pulse">
                        Verifying...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
          <Button
            size="lg"
            onClick={runVerification}
            disabled={isRunning}
            className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8"
            data-testid="button-start-verification"
          >
            {isRunning ? (
              <>
                <Clock className="h-5 w-5 mr-2 animate-spin" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Verification in Progress...</span>
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Start Verification</span>
              </>
            )}
          </Button>

          {completedSteps === activeSteps.length && completedSteps > 0 && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/bank-scoring-dashboard'}
              className="h-[45px] rounded-lg border border-[#0052CC] text-[#0052CC] hover:bg-[#0052CC] hover:text-white px-8"
              data-testid="button-view-dashboard"
            >
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">View Scoring Dashboard</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}

          {!isRunning && (
            <Button
              size="lg"
              variant="outline"
              onClick={resetDemo}
              className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]"
              data-testid="button-reset-demo"
            >
              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Reset Demo</span>
            </Button>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border-2 border-[#27ae60]/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex p-3 bg-[#27ae60]/10 rounded-full mb-3">
                  <Shield className="h-8 w-8 text-[#27ae60]" />
                </div>
                <h3 className="font-bold text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-2">Multi-Signal</h3>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Combines KYC/KYB, AML, device intelligence, and IP risk for comprehensive assessment
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border-2 border-[#0052CC]/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex p-3 bg-[#0052CC]/10 rounded-full mb-3">
                  <Clock className="h-8 w-8 text-[#0052CC]" />
                </div>
                <h3 className="font-bold text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-2">Real-Time</h3>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Instant risk assessment in under 10 seconds vs. manual review (2-5 days)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border-2 border-purple-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex p-3 bg-purple-500/10 rounded-full mb-3">
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="font-bold text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-2">Compliant</h3>
                <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Meets KYC, AML, GDPR, and banking regulatory requirements
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
