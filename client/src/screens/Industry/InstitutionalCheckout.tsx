import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { 
  Building2, 
  TrendingUp, 
  Briefcase,
  CheckCircle, 
  Shield, 
  Users, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  CreditCard,
  Lock,
  Clock,
  FileText,
  Globe
} from "lucide-react";

interface InstitutionalPlan {
  id: string;
  name: string;
  description: string;
  targetCustomer: string;
  monthlyPrice: number;
  annualPrice: number;
  icon: any;
  features: string[];
  limits: {
    teamMembers: number;
    apiCalls: string;
    kycChecks: string;
    kybChecks: string;
    amlChecks: string;
  };
  addOns: {
    id: string;
    name: string;
    price: number;
    description: string;
  }[];
  badge?: string;
  badgeColor?: string;
}

const institutionalPlans: InstitutionalPlan[] = [
  {
    id: "startup-vc",
    name: "Startup VC",
    description: "Perfect for early-stage VCs and angel syndicates",
    targetCustomer: "Emerging VCs",
    monthlyPrice: 649,
    annualPrice: 6490,
    icon: TrendingUp,
    features: [
      "Automated KYC/KYB verification",
      "Basic AML screening",
      "Decision engine access",
      "Case management",
      "Standard audit logs",
      "Email support",
      "LP onboarding workflows",
      "API access with sandbox"
    ],
    limits: {
      teamMembers: 5,
      apiCalls: "25,000/month",
      kycChecks: "150 included",
      kybChecks: "75 included",
      amlChecks: "300 included"
    },
    addOns: [
      { id: "extra-kyc", name: "Extra KYC Checks", price: 2.20, description: "Per additional check" },
      { id: "extra-kyb", name: "Extra KYB Checks", price: 5.50, description: "Per additional check" },
      { id: "priority-support", name: "Priority Support", price: 149, description: "Per month" }
    ],
    badge: "Best for Startups",
    badgeColor: "bg-green-500"
  },
  {
    id: "growth-fund",
    name: "Growth Fund",
    description: "For mid-tier investment firms with LP requirements",
    targetCustomer: "Growth-stage Funds",
    monthlyPrice: 1499,
    annualPrice: 14990,
    icon: Building2,
    features: [
      "Everything in Startup VC",
      "Advanced decision engine rules",
      "Ongoing monitoring",
      "Enhanced due diligence workflows",
      "Multi-signal verification (99.8% accuracy)",
      "Beneficial ownership tracking",
      "Regulatory reporting templates",
      "Phone + email support",
      "Dedicated success manager",
      "Developer portal access"
    ],
    limits: {
      teamMembers: 15,
      apiCalls: "100,000/month",
      kycChecks: "400 included",
      kybChecks: "150 included",
      amlChecks: "800 included"
    },
    addOns: [
      { id: "extra-kyc", name: "Extra KYC Checks", price: 1.80, description: "Per additional check" },
      { id: "extra-kyb", name: "Extra KYB Checks", price: 4.50, description: "Per additional check" },
      { id: "ongoing-monitoring", name: "Continuous Monitoring", price: 399, description: "Per month" },
      { id: "custom-rules", name: "Custom Decision Rules", price: 249, description: "One-time setup" }
    ],
    badge: "Recommended",
    badgeColor: "bg-[#00A859]"
  },
  {
    id: "hedge-fund",
    name: "Hedge Fund",
    description: "Enterprise compliance for hedge funds and institutional investors",
    targetCustomer: "Hedge Funds & Family Offices",
    monthlyPrice: 3499,
    annualPrice: 34990,
    icon: Briefcase,
    features: [
      "Everything in Growth Fund",
      "Full institutional compliance suite",
      "Sanctions & PEP screening (real-time)",
      "Human oversight workflows",
      "Explainable AI decisions",
      "Formal audit reporting",
      "Custom integration support",
      "24/7 priority support",
      "Quarterly compliance reviews",
      "SOC 2 compliance documentation",
      "White-label options",
      "Full API & SDK access"
    ],
    limits: {
      teamMembers: 50,
      apiCalls: "500,000/month",
      kycChecks: "1,200 included",
      kybChecks: "600 included",
      amlChecks: "3,000 included"
    },
    addOns: [
      { id: "extra-kyc", name: "Extra KYC Checks", price: 1.40, description: "Per additional check" },
      { id: "extra-kyb", name: "Extra KYB Checks", price: 3.50, description: "Per additional check" },
      { id: "dedicated-analyst", name: "Dedicated Compliance Analyst", price: 2499, description: "Per month" },
      { id: "custom-integration", name: "Custom API Integration", price: 3999, description: "One-time setup" },
      { id: "on-site-training", name: "On-site Training", price: 1499, description: "Per session" }
    ],
    badge: "Enterprise",
    badgeColor: "bg-[#2C79D1]"
  }
];

export default function InstitutionalCheckout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<string>("growth-fund");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [teamSize, setTeamSize] = useState<string>("10");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "",
    registrationNumber: "",
    fundType: "",
    aum: "",
    primaryContact: "",
    email: user?.email || "",
    phone: ""
  });

  const currentPlan = institutionalPlans.find(p => p.id === selectedPlan)!;
  
  const calculateTotal = () => {
    const basePrice = billingCycle === "annual" ? currentPlan.annualPrice : currentPlan.monthlyPrice;
    const addOnTotal = selectedAddOns.reduce((sum, addOnId) => {
      const addOn = currentPlan.addOns.find(a => a.id === addOnId);
      return sum + (addOn?.price || 0);
    }, 0);
    
    const extraTeamMembers = Math.max(0, parseInt(teamSize) - currentPlan.limits.teamMembers);
    const teamMemberCost = extraTeamMembers * 49; // £49 per extra team member
    
    return {
      basePrice,
      addOnTotal: billingCycle === "annual" ? addOnTotal * 12 : addOnTotal,
      teamMemberCost: billingCycle === "annual" ? teamMemberCost * 12 : teamMemberCost,
      total: basePrice + (billingCycle === "annual" ? addOnTotal * 12 : addOnTotal) + (billingCycle === "annual" ? teamMemberCost * 12 : teamMemberCost),
      savings: billingCycle === "annual" ? (currentPlan.monthlyPrice * 12 - currentPlan.annualPrice) : 0
    };
  };

  const totals = calculateTotal();

  const createSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/institutional/checkout", {
        planId: selectedPlan,
        billingCycle,
        teamSize: parseInt(teamSize),
        addOns: selectedAddOns,
        companyInfo,
        totalAmount: totals.total
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Created",
        description: "Your institutional account has been activated. Welcome to TrustVerify!",
      });
      navigate("/compliance/decision-engine");
    },
    onError: (error: any) => {
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to process checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }
    createSubscriptionMutation.mutate();
  };

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addOnId) 
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const progressPercent = (step / 4) * 100;

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-center gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="mb-8">
          <Link to="/industries/institutional">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Institutional
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">Self-Service Checkout</Badge>
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-2">
              Institutional Compliance Platform
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
              Complete your subscription in minutes. No sales calls required.
            </p>
          </div>

          <div className="max-w-xl mx-auto mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {step} of 4</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <Progress value={progressPercent} className="h-2 [&>div]:bg-[#27ae60]" />
            <div className="flex justify-between mt-2 text-xs text-[#808080]">
              <span className={step >= 1 ? "text-[#27ae60] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium" : ""}>Select Plan</span>
              <span className={step >= 2 ? "text-[#27ae60] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium" : ""}>Configure</span>
              <span className={step >= 3 ? "text-[#27ae60] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium" : ""}>Company Details</span>
              <span className={step >= 4 ? "text-[#27ae60] [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium" : ""}>Payment</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl text-center mb-6">Choose Your Plan</h2>
            
            <div className="flex justify-center mb-6">
              <div className="bg-gray-200 rounded-lg p-1">
                <Button 
                  variant={billingCycle === "monthly" ? "default" : "ghost"}
                  onClick={() => setBillingCycle("monthly")}
                  className={billingCycle === "monthly" ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90" : ""}
                  data-testid="button-monthly"
                >
                  Monthly
                </Button>
                <Button 
                  variant={billingCycle === "annual" ? "default" : "ghost"}
                  onClick={() => setBillingCycle("annual")}
                  className={billingCycle === "annual" ? "bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90" : ""}
                  data-testid="button-annual"
                >
                  Annual (Save 17%)
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {institutionalPlans.map((plan) => {
                const PlanIcon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                const price = billingCycle === "annual" ? plan.annualPrice : plan.monthlyPrice;
                
                return (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all hover:shadow-lg bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] ${
                      isSelected ? "border-2 border-[#27ae60] shadow-lg" : ""
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <PlanIcon className={`h-8 w-8 ${isSelected ? "text-[#27ae60]" : "text-[#808080]"}`} />
                        {plan.badge && (
                          <Badge className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">{plan.badge}</Badge>
                        )}
                      </div>
                      <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">{plan.name}</CardTitle>
                      <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl">
                          £{price.toLocaleString()}
                        </div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                          {billingCycle === "annual" ? "per year" : "per month"}
                        </div>
                        {billingCycle === "annual" && (
                          <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#27ae60] text-sm">
                            Save £{((plan.monthlyPrice * 12) - plan.annualPrice).toLocaleString()}/year
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm">Includes:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-[#808080]" />
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{plan.limits.teamMembers} team members</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-[#808080]" />
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{plan.limits.apiCalls}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-xs mt-2 pt-2 border-t border-[#e4e4e4]">
                          <div className="text-center">
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#27ae60]">{plan.limits.kycChecks.replace(' included', '')}</div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">KYC</div>
                          </div>
                          <div className="text-center">
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#27ae60]">{plan.limits.kybChecks.replace(' included', '')}</div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">KYB</div>
                          </div>
                          <div className="text-center">
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#27ae60]">{plan.limits.amlChecks.replace(' included', '')}</div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">AML</div>
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-2 text-sm">
                        {plan.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-[#27ae60] mt-0.5 shrink-0" />
                            <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="text-gray-500 text-xs">
                            +{plan.features.length - 5} more features
                          </li>
                        )}
                      </ul>

                      <div className="mt-4 pt-4 border-t">
                        <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <Label htmlFor={plan.id} className="cursor-pointer">
                              {isSelected ? "Selected" : "Select this plan"}
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center mt-8">
              <Button 
                size="lg" 
                onClick={() => setStep(2)}
                className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg"
                data-testid="button-continue-step1"
              >
                Continue to Configuration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl text-center mb-6">Configure Your Plan</h2>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Users className="h-5 w-5 text-[#27ae60]" />
                  Team Size
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  {currentPlan.limits.teamMembers} team members included. Additional members £49/month each.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Select value={teamSize} onValueChange={setTeamSize}>
                    <SelectTrigger className="w-32" data-testid="select-team-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 25, 30, 40, 50, 75, 100].map(size => (
                        <SelectItem key={size} value={size.toString()}>{size} members</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {parseInt(teamSize) > currentPlan.limits.teamMembers && (
                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                      +£{(parseInt(teamSize) - currentPlan.limits.teamMembers) * 49}/month for extra members
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Zap className="h-5 w-5 text-[#27ae60]" />
                  Included Verification Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-[#f6f6f6] rounded-lg">
                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#27ae60] text-2xl">{currentPlan.limits.kycChecks}</div>
                    <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">KYC Checks</div>
                  </div>
                  <div className="text-center p-4 bg-[#f6f6f6] rounded-lg">
                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#27ae60] text-2xl">{currentPlan.limits.kybChecks}</div>
                    <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">KYB Checks</div>
                  </div>
                  <div className="text-center p-4 bg-[#f6f6f6] rounded-lg">
                    <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#27ae60] text-2xl">{currentPlan.limits.amlChecks}</div>
                    <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">AML Checks</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Shield className="h-5 w-5 text-[#27ae60]" />
                  Optional Add-Ons
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Enhance your compliance capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentPlan.addOns.map((addOn) => (
                    <div 
                      key={addOn.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-[#f6f6f6] ${
                        selectedAddOns.includes(addOn.id) ? "border-[#27ae60] bg-[#e8f5e9]" : "border-[#e4e4e4]"
                      }`}
                      onClick={() => toggleAddOn(addOn.id)}
                      data-testid={`addon-${addOn.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          checked={selectedAddOns.includes(addOn.id)} 
                          onCheckedChange={() => toggleAddOn(addOn.id)}
                        />
                        <div>
                          <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{addOn.name}</div>
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">{addOn.description}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">£{addOn.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(1)} data-testid="button-back-step2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                size="lg" 
                onClick={() => setStep(3)}
                className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg"
                data-testid="button-continue-step2"
              >
                Continue to Company Details
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl text-center mb-6">Company Information</h2>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Building2 className="h-5 w-5 text-[#27ae60]" />
                  Fund/Company Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="companyName">Company/Fund Name *</Label>
                    <Input 
                      id="companyName"
                      value={companyInfo.companyName}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, companyName: e.target.value }))}
                      placeholder="TrustVerify Capital Partners"
                      data-testid="input-company-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="registrationNumber">Company Registration Number</Label>
                    <Input 
                      id="registrationNumber"
                      value={companyInfo.registrationNumber}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, registrationNumber: e.target.value }))}
                      placeholder="12345678"
                      data-testid="input-registration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fundType">Fund/Entity Type *</Label>
                    <Select 
                      value={companyInfo.fundType} 
                      onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, fundType: value }))}
                    >
                      <SelectTrigger id="fundType" data-testid="select-fund-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vc">Venture Capital Fund</SelectItem>
                        <SelectItem value="pe">Private Equity Fund</SelectItem>
                        <SelectItem value="hedge">Hedge Fund</SelectItem>
                        <SelectItem value="family-office">Family Office</SelectItem>
                        <SelectItem value="angel-syndicate">Angel Syndicate</SelectItem>
                        <SelectItem value="investment-company">Investment Company</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="aum">Assets Under Management (AUM)</Label>
                    <Select 
                      value={companyInfo.aum} 
                      onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, aum: value }))}
                    >
                      <SelectTrigger id="aum" data-testid="select-aum">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10m">Under £10M</SelectItem>
                        <SelectItem value="10m-50m">£10M - £50M</SelectItem>
                        <SelectItem value="50m-100m">£50M - £100M</SelectItem>
                        <SelectItem value="100m-500m">£100M - £500M</SelectItem>
                        <SelectItem value="500m-1b">£500M - £1B</SelectItem>
                        <SelectItem value="over-1b">Over £1B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Users className="h-5 w-5 text-[#27ae60]" />
                  Primary Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="primaryContact">Full Name *</Label>
                    <Input 
                      id="primaryContact"
                      value={companyInfo.primaryContact}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, primaryContact: e.target.value }))}
                      placeholder="John Smith"
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@fund.com"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone"
                      type="tel"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+44 20 1234 5678"
                      data-testid="input-phone"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(2)} data-testid="button-back-step3">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                size="lg" 
                onClick={() => setStep(4)}
                disabled={!companyInfo.companyName || !companyInfo.fundType || !companyInfo.primaryContact || !companyInfo.email || !companyInfo.phone}
                className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg"
                data-testid="button-continue-step3"
              >
                Continue to Payment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl sm:text-3xl text-center mb-6">Review & Complete Payment</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <FileText className="h-5 w-5 text-[#27ae60]" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-[#e4e4e4]">
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{currentPlan.name} Plan</div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">{billingCycle === "annual" ? "Annual" : "Monthly"} billing</div>
                      </div>
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">£{totals.basePrice.toLocaleString()}</div>
                    </div>

                    {parseInt(teamSize) > currentPlan.limits.teamMembers && (
                      <div className="flex justify-between items-center py-2 border-b border-[#e4e4e4]">
                        <div>
                          <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Extra Team Members</div>
                          <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                            {parseInt(teamSize) - currentPlan.limits.teamMembers} additional @ £49/month
                          </div>
                        </div>
                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">£{totals.teamMemberCost.toLocaleString()}</div>
                      </div>
                    )}

                    {selectedAddOns.length > 0 && (
                      <div className="py-2 border-b border-[#e4e4e4]">
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] mb-2">Add-Ons</div>
                        {selectedAddOns.map(addOnId => {
                          const addOn = currentPlan.addOns.find(a => a.id === addOnId);
                          if (!addOn) return null;
                          const addOnPrice = billingCycle === "annual" ? addOn.price * 12 : addOn.price;
                          return (
                            <div key={addOnId} className="flex justify-between [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm py-1">
                              <span>{addOn.name}</span>
                              <span>£{addOnPrice.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {totals.savings > 0 && (
                      <div className="flex justify-between items-center py-2 text-[#27ae60]">
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Annual Discount</div>
                        <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">-£{totals.savings.toLocaleString()}</div>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center py-2">
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">Total</div>
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#27ae60] text-2xl">
                        £{totals.total.toLocaleString()}
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm font-normal">
                          /{billingCycle === "annual" ? "year" : "month"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <Building2 className="h-5 w-5 text-[#27ae60]" />
                      Company Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Company Name</div>
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{companyInfo.companyName}</div>
                      </div>
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Fund Type</div>
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] capitalize">{companyInfo.fundType.replace("-", " ")}</div>
                      </div>
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Primary Contact</div>
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{companyInfo.primaryContact}</div>
                      </div>
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Email</div>
                        <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{companyInfo.email}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <CreditCard className="h-5 w-5 text-[#27ae60]" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border border-[#e4e4e4] rounded-lg bg-[#f6f6f6]">
                      <div className="flex items-center gap-3 mb-3">
                        <Lock className="h-5 w-5 text-[#27ae60]" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Secure Payment via Stripe</span>
                      </div>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
                        You'll be redirected to Stripe's secure payment page to complete your purchase. 
                        We accept all major credit cards, direct debit, and bank transfer.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-[#e4e4e4] rounded-lg">
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        data-testid="checkbox-terms"
                      />
                      <div className="text-sm">
                        <Label htmlFor="terms" className="cursor-pointer [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                          I agree to the{" "}
                          <Link to="/terms-of-service" className="text-[#27ae60] underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy-policy" className="text-[#27ae60] underline">
                            Privacy Policy
                          </Link>
                          . I understand that my subscription will auto-renew and I can cancel anytime.
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-[#27ae60]/10 to-[#0052cc]/10 border-[#27ae60] bg-[#fcfcfc] rounded-[20px] border">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <Shield className="h-12 w-12 text-[#27ae60] mx-auto mb-2" />
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">Your Plan Includes</h3>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">99.8% verification accuracy</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Multi-signal decision engine</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Full audit trail & reporting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">LP & regulator-ready docs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                        <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Immediate platform access</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-[#808080]" />
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Setup in under 5 minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-[#808080]" />
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cancel anytime</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-[#808080]" />
                      <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">24/7 platform access</span>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  size="lg" 
                  className="w-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg"
                  onClick={handleCheckout}
                  disabled={!termsAccepted || createSubscriptionMutation.isPending}
                  data-testid="button-complete-payment"
                >
                  {createSubscriptionMutation.isPending ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Complete Payment - £{totals.total.toLocaleString()}
                    </>
                  )}
                </Button>

                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-xs text-center">
                  Secure payment processed by Stripe. Your card details are never stored on our servers.
                </p>
              </div>
            </div>

            <div className="flex justify-start mt-8">
              <Button variant="outline" onClick={() => setStep(3)} data-testid="button-back-step4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Company Details
              </Button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">
            Questions? Contact our team at{" "}
            <a href="mailto:institutional@trustverify.co.uk" className="text-[#27ae60] underline">
              institutional@trustverify.co.uk
            </a>{" "}
            or call{" "}
            <a href="tel:+442045427323" className="text-[#27ae60] underline">
              020 4542 7323
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
