import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Key, Copy, Plus, Trash2, CheckCircle, AlertCircle, Building2, Shield, CreditCard, Gamepad2, ShoppingCart, Coins, Landmark, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface IndustryConfig {
  id: string;
  name: string;
  icon: any;
  description: string;
  useCases: string[];
  permissions: string[];
  rateLimits: {
    apiCalls: number;
    fraudChecks: number;
    kycVerifications: number;
  };
  features: string[];
}

export default function ApiKeysPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const industryConfigs: IndustryConfig[] = [
    {
      id: 'banking',
      name: 'Banking & Financial Services',
      icon: Landmark,
      description: 'Comprehensive fraud protection, AML compliance, and regulatory reporting for traditional banking operations.',
      useCases: [
        'Account opening fraud prevention',
        'Transaction monitoring & AML',
        'Regulatory compliance reporting',
        'Wire transfer verification',
        'Credit application screening'
      ],
      permissions: ['transactions', 'fraud_detection', 'kyc', 'aml_screening', 'regulatory_reporting', 'compliance_monitoring'],
      rateLimits: {
        apiCalls: 5000,
        fraudChecks: 2000,
        kycVerifications: 500
      },
      features: ['Real-time AML screening', 'PEP/Sanctions checking', 'Enhanced due diligence', 'Regulatory reporting dashboard']
    },
    {
      id: 'fintech',
      name: 'Fintech & Digital Payments',
      icon: CreditCard,
      description: 'High-velocity fraud detection and seamless KYC for modern payment platforms and neobanks.',
      useCases: [
        'Real-time payment fraud detection',
        'Digital wallet security',
        'P2P transfer protection',
        'Instant KYC verification',
        'Account takeover prevention'
      ],
      permissions: ['transactions', 'fraud_detection', 'kyc', 'real_time_monitoring', 'device_fingerprinting', 'behavioral_analytics'],
      rateLimits: {
        apiCalls: 10000,
        fraudChecks: 5000,
        kycVerifications: 1000
      },
      features: ['Sub-second verification', 'Device fingerprinting', 'Behavioral analytics', 'Mobile-first KYC']
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: Shield,
      description: 'Claims fraud detection, policy verification, and risk assessment for insurance providers.',
      useCases: [
        'Claims fraud detection',
        'Policy application screening',
        'Premium fraud prevention',
        'Identity verification for claims',
        'Staged accident detection'
      ],
      permissions: ['fraud_detection', 'kyc', 'risk_assessment', 'claims_analysis', 'identity_verification'],
      rateLimits: {
        apiCalls: 3000,
        fraudChecks: 1500,
        kycVerifications: 300
      },
      features: ['Claims pattern analysis', 'Medical records verification', 'Vehicle fraud detection', 'Property damage assessment']
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency & Blockchain',
      icon: Coins,
      description: 'Wallet risk scoring, DeFi protection, and crypto-specific fraud prevention.',
      useCases: [
        'Wallet risk assessment',
        'DeFi protocol protection',
        'Exchange fraud prevention',
        'Smart contract auditing',
        'Crypto AML compliance'
      ],
      permissions: ['fraud_detection', 'wallet_analysis', 'blockchain_monitoring', 'smart_contract_audit', 'crypto_aml'],
      rateLimits: {
        apiCalls: 7500,
        fraudChecks: 3000,
        kycVerifications: 750
      },
      features: ['Wallet reputation scoring', 'Cross-chain analysis', 'DeFi risk assessment', 'Token contract verification']
    },
    {
      id: 'ecommerce',
      name: 'E-commerce & Marketplaces',
      icon: ShoppingCart,
      description: 'Checkout fraud prevention, seller verification, and marketplace trust & safety.',
      useCases: [
        'Payment fraud prevention',
        'Account creation abuse',
        'Seller verification',
        'Chargeback protection',
        'Review fraud detection'
      ],
      permissions: ['transactions', 'fraud_detection', 'seller_verification', 'chargeback_protection', 'review_monitoring'],
      rateLimits: {
        apiCalls: 15000,
        fraudChecks: 7500,
        kycVerifications: 1500
      },
      features: ['Real-time checkout protection', 'Seller trust scoring', 'Review authenticity', 'Inventory fraud detection']
    },
    {
      id: 'retail',
      name: 'Retail & Point-of-Sale',
      icon: Building2,
      description: 'In-store and online fraud protection for retail operations and loyalty programs.',
      useCases: [
        'Card-present fraud detection',
        'Loyalty program abuse',
        'Return fraud prevention',
        'Gift card fraud protection',
        'Employee fraud monitoring'
      ],
      permissions: ['transactions', 'fraud_detection', 'loyalty_monitoring', 'return_analysis', 'employee_monitoring'],
      rateLimits: {
        apiCalls: 8000,
        fraudChecks: 4000,
        kycVerifications: 800
      },
      features: ['POS integration', 'Loyalty fraud detection', 'Return pattern analysis', 'Employee activity monitoring']
    },
    {
      id: 'igaming',
      name: 'iGaming & Online Gambling',
      icon: Gamepad2,
      description: 'Player verification, bonus abuse prevention, and regulatory compliance for gaming operators.',
      useCases: [
        'Player age verification',
        'Bonus abuse detection',
        'Multi-account prevention',
        'Responsible gambling controls',
        'Regulatory compliance'
      ],
      permissions: ['fraud_detection', 'kyc', 'age_verification', 'bonus_monitoring', 'gambling_compliance', 'geolocation'],
      rateLimits: {
        apiCalls: 5000,
        fraudChecks: 2500,
        kycVerifications: 1000
      },
      features: ['Age verification', 'Geolocation compliance', 'Bonus abuse detection', 'Responsible gambling tools']
    },
    {
      id: 'logistics',
      name: 'Logistics & Supply Chain',
      icon: Truck,
      description: 'Shipment verification, carrier authentication, and supply chain fraud prevention for logistics operations.',
      useCases: [
        'Shipment tracking verification',
        'Carrier identity validation',
        'Delivery confirmation fraud',
        'Supply chain transparency',
        'Package tampering detection'
      ],
      permissions: ['fraud_detection', 'shipment_tracking', 'carrier_verification', 'delivery_monitoring', 'supply_chain_audit'],
      rateLimits: {
        apiCalls: 6000,
        fraudChecks: 3000,
        kycVerifications: 500
      },
      features: ['Real-time shipment tracking', 'Carrier authentication', 'Delivery fraud detection', 'Supply chain audit trails']
    }
  ];

  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyNotes, setNewKeyNotes] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedUseCase, setSelectedUseCase] = useState<string>("");
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("test");
  const [wizardStep, setWizardStep] = useState(1);

  const selectedIndustryConfig = industryConfigs.find(config => config.id === selectedIndustry);

  // Reset use case when industry changes to prevent stale selections
  useEffect(() => {
    setSelectedUseCase("");
  }, [selectedIndustry]);

  // Fetch API keys from backend
  const { data: apiKeys = [], isLoading, error } = useQuery({
    queryKey: ['/api/api-keys'],
    queryFn: async () => {
      const res = await fetch('/api/api-keys');
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please log in to view your API keys');
        }
        throw new Error('Failed to fetch API keys');
      }
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  });

  // Create API key mutation
  const createApiKeyMutation = useMutation({
    mutationFn: async (data: { name: string; industry: string; useCase: string; environment?: string; notes?: string; permissions?: string[] }) => {
      const res = await apiRequest("POST", "/api/api-keys", data);
      return await res.json();
    },
    onSuccess: (newApiKey: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
      setNewKeyName("");
      setNewKeyNotes("");
      setSelectedIndustry("");
      setSelectedUseCase("");
      setSelectedEnvironment("test");
      setWizardStep(1);
      toast({
        title: "API Key Generated Successfully",
        description: selectedEnvironment === 'production' 
          ? "⚠️ This production key will only be shown once. Save it securely now!"
          : `Test key "${newApiKey.name || newKeyName}" created. You can view it anytime in your dashboard.`,
        duration: 10000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create API key",
        variant: "destructive",
      });
    }
  });

  // Revoke API key mutation
  const revokeApiKeyMutation = useMutation({
    mutationFn: async (keyId: string) => {
      const res = await apiRequest("DELETE", `/api/api-keys/${keyId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys'] });
      toast({
        title: "API Key Revoked",
        description: "The API key has been revoked and is no longer valid.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke API key",
        variant: "destructive",
      });
    }
  });

  const handleToggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Key Name Required",
        description: "Please enter a name for your API key.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedIndustry) {
      toast({
        title: "Industry Required",
        description: "Please select an industry for your API key.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedUseCase) {
      toast({
        title: "Use Case Required",
        description: "Please select a use case for your API key.",
        variant: "destructive",
      });
      return;
    }

    const industryConfig = selectedIndustryConfig!;
    
    createApiKeyMutation.mutate({
      name: newKeyName,
      industry: selectedIndustry,
      useCase: selectedUseCase,
      environment: selectedEnvironment,
      notes: newKeyNotes,
      permissions: industryConfig.permissions
    });
  };

  const handleNextStep = () => {
    if (wizardStep === 1 && !newKeyName.trim()) {
      toast({
        title: "Key Name Required",
        description: "Please enter a name for your API key.",
        variant: "destructive",
      });
      return;
    }
    if (wizardStep === 2 && !selectedIndustry) {
      toast({
        title: "Industry Required",
        description: "Please select an industry for your API key.",
        variant: "destructive",
      });
      return;
    }
    if (wizardStep === 3 && !selectedUseCase) {
      toast({
        title: "Use Case Required",
        description: "Please select a use case for your API key.",
        variant: "destructive",
      });
      return;
    }
    setWizardStep(wizardStep + 1);
  };

  const handlePrevStep = () => {
    setWizardStep(wizardStep - 1);
  };

  const handleRevokeKey = (keyId: string) => {
    revokeApiKeyMutation.mutate(keyId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="px-6 pt-24 pb-16 bg-white">
        <div className="max-w-[1270px] mx-auto text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
              API KEYS
            </span>
          </Badge>
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[36px] sm:text-[42px] lg:text-[48px] leading-[110%] text-[#003d2b] tracking-[-0.6px]">
              Manage Your TrustVerify API Keys
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg sm:text-xl text-[#808080] leading-[27px]">
              Create, rotate, and manage scoped API keys with industry-tailored permissions and rate limits.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-20 overflow-visible">

        {/* Generate New Key */}
        <Card className="mb-6 overflow-visible border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center">
                <Plus className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-lg sm:text-xl [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Generate New API Key</span>
              </div>
              {/* Step Indicator - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        wizardStep === step
                          ? 'bg-app-secondary text-white ring-4 ring-app-secondary/20'
                          : wizardStep > step
                          ? 'bg-app-secondary text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {wizardStep > step ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-8 h-0.5 mx-1 ${
                          wizardStep > step ? 'bg-[#00A859]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardTitle>
            <p className="text-sm text-[#808080] mt-2 font-medium">
              {wizardStep === 1 && "Step 1: Basic Information"}
              {wizardStep === 2 && "Step 2: Select Industry"}
              {wizardStep === 3 && "Step 3: Choose Use Case"}
              {wizardStep === 4 && "Step 4: Environment & Review"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6 overflow-visible">
            {/* Step 1: Basic Information */}
            {wizardStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="keyName" className="text-sm font-medium text-[#003d2b]">API Key Name *</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production Banking API, Test E-commerce Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="h-11 text-base"
                    data-testid="input-key-name"
                  />
                  <p className="text-xs text-[#808080]">Give your API key a descriptive name to identify its purpose</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyNotes" className="text-sm font-medium text-[#003d2b]">Notes (Optional)</Label>
                  <Textarea
                    id="keyNotes"
                    placeholder="Add notes about where this key will be used, deployment environment, or any other context..."
                    value={newKeyNotes}
                    onChange={(e) => setNewKeyNotes(e.target.value)}
                    className="min-h-[80px] text-base"
                    data-testid="input-key-notes"
                  />
                  <p className="text-xs text-[#808080]">Optional: Add context to help you remember this key's purpose later</p>
                </div>
              </>
            )}

            {/* Step 2: Industry Selection */}
            {wizardStep === 2 && (
              <>
                <div className="space-y-2 relative">
                  <Label htmlFor="industry" className="text-sm font-medium">Select Your Industry *</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-full h-11 text-base" data-testid="select-industry">
                      <SelectValue placeholder="Choose the industry that best matches your use case" />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      className="z-[9999] max-h-[280px] min-w-[var(--radix-select-trigger-width)] bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden"
                    >
                      <div className="overflow-y-auto max-h-[280px]">
                        {industryConfigs.map((industry) => {
                          const IconComponent = industry.icon;
                          return (
                            <SelectItem 
                              key={industry.id} 
                              value={industry.id} 
                              className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-3 px-4 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <IconComponent className="h-5 w-5 flex-shrink-0 text-gray-700" />
                                <span className="text-sm font-medium text-gray-900">{industry.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </div>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Select the industry to apply tailored permissions and rate limits</p>
                </div>
                
                {/* Industry Description */}
                {selectedIndustryConfig && (
                  <div className="bg-[#f7f7f7] border border-[#e4e4e4] rounded-[12px] p-4 sm:p-5 mt-4">
                    <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2 text-sm sm:text-base">{selectedIndustryConfig.name}</h4>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs sm:text-sm text-[#808080] mb-4">{selectedIndustryConfig.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2 text-sm">Key Features:</h5>
                        <ul className="text-xs text-[#808080] space-y-1.5">
                          {selectedIndustryConfig.features.map((feature, index) => (
                            <li key={index}>• {feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2 text-sm">Rate Limits:</h5>
                        <div className="text-xs text-[#808080] space-y-1.5">
                          <div>API Calls: {selectedIndustryConfig.rateLimits.apiCalls.toLocaleString()}/hour</div>
                          <div>Fraud Checks: {selectedIndustryConfig.rateLimits.fraudChecks.toLocaleString()}/hour</div>
                          <div>KYC Verifications: {selectedIndustryConfig.rateLimits.kycVerifications.toLocaleString()}/hour</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Use Case Selection */}
            {wizardStep === 3 && selectedIndustryConfig && (
              <div className="space-y-2 relative">
                <Label htmlFor="useCase" className="text-sm font-medium">Primary Use Case *</Label>
                <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
                  <SelectTrigger className="w-full h-11 text-base" data-testid="select-usecase">
                    <SelectValue placeholder="Select your primary use case" />
                  </SelectTrigger>
                  <SelectContent 
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="z-[9999] max-h-[280px] min-w-[var(--radix-select-trigger-width)] bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden"
                  >
                    <div className="overflow-y-auto max-h-[280px]">
                      {selectedIndustryConfig.useCases.map((useCase, index) => (
                        <SelectItem 
                          key={index} 
                          value={useCase} 
                          className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-3 px-4 text-sm transition-colors"
                        >
                          {useCase}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Choose the specific scenario this API key will be used for</p>
              </div>
            )}

            {/* Step 4: Environment & Review */}
            {wizardStep === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="environment" className="text-sm font-medium">Environment *</Label>
                  <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                    <SelectTrigger className="w-full h-11 text-base" data-testid="select-environment">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent 
                      position="popper"
                      side="bottom"
                      align="start"
                      sideOffset={4}
                      className="z-[9999] max-h-[200px] min-w-[var(--radix-select-trigger-width)] bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden"
                    >
                      <SelectItem value="test" className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50 py-3 px-4">
                        <div>
                          <div className="font-medium">Test / Development</div>
                          <div className="text-xs text-gray-500">For testing and development purposes</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="production" className="cursor-pointer hover:bg-amber-50 focus:bg-amber-50 py-3 px-4">
                        <div>
                          <div className="font-medium text-amber-700">Production</div>
                          <div className="text-xs text-amber-600">⚠️ Live environment - key shown only once!</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">Production keys are shown only once for security</p>
                </div>

                {selectedEnvironment === 'production' && (
                  <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-900 mb-1">Production Key Security</h4>
                        <p className="text-sm text-amber-800 mb-2">
                          For security reasons, production keys are displayed only once after generation. Make sure to save it securely before closing this page.
                        </p>
                        <ul className="text-xs text-amber-700 space-y-1">
                          <li>• Store in a secure password manager or secret vault</li>
                          <li>• Never commit to version control or share publicly</li>
                          <li>• Use environment variables in your applications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-gray-900">Review Configuration</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">Key Name:</span>
                      <p className="font-medium text-gray-900 break-words">{newKeyName}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Environment:</span>
                      <p className="font-medium text-gray-900 capitalize">{selectedEnvironment}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Industry:</span>
                      <p className="font-medium text-gray-900 break-words">{selectedIndustryConfig?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Use Case:</span>
                      <p className="font-medium text-gray-900 break-words text-xs sm:text-sm">{selectedUseCase}</p>
                    </div>
                  </div>
                  {newKeyNotes && (
                    <div>
                      <span className="text-gray-500 text-xs">Notes:</span>
                      <p className="text-xs sm:text-sm text-gray-700 mt-1 break-words">{newKeyNotes}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4">
              <Button 
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={wizardStep === 1}
                className="h-11 w-full sm:w-auto border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px]"
                data-testid="button-prev-step"
              >
                Previous
              </Button>

              {wizardStep < 4 ? (
                <Button 
                  type="button"
                  onClick={handleNextStep}
                  className="h-11 w-full sm:w-auto sm:min-w-32 bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px]"
                  data-testid="button-next-step"
                >
                  Next Step
                </Button>
              ) : (
                <Button 
                  type="button"
                  onClick={handleGenerateKey}
                  disabled={!newKeyName || !selectedIndustry || !selectedUseCase}
                  className="h-11 w-full sm:w-auto sm:min-w-32 bg-app-secondary hover:bg-app-secondary/90 text-white disabled:bg-gray-300 disabled:text-gray-500 rounded-[10px]"
                  data-testid="button-generate-key"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generate Key
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Existing Keys */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="border border-[#e4e4e4] rounded-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6 text-center">
                <div className="text-gray-500">Loading API keys...</div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border border-[#e4e4e4] rounded-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6 text-center">
                <div className="text-red-500">
                  {error instanceof Error ? error.message : 'Failed to load API keys. Please try again.'}
                </div>
                {error instanceof Error && error.message.includes('log in') && (
                  <Button 
                    className="mt-4" 
                    onClick={() => window.location.href = '/login'}
                    data-testid="link-login"
                  >
                    Go to Login
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : !Array.isArray(apiKeys) || apiKeys.length === 0 ? (
            <Card className="border border-[#e4e4e4] rounded-[16px] shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
              <CardContent className="p-6 text-center">
                <div className="text-gray-500">No API keys generated yet. Create your first key above.</div>
              </CardContent>
            </Card>
          ) : (
            apiKeys.map((apiKey: any) => {
            const keyIndustryConfig = industryConfigs.find(config => config.id === apiKey.industry);
            const IconComponent = keyIndustryConfig?.icon || Key;
            
            return (
              <Card key={apiKey.id} className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent className="h-5 w-5 text-gray-600 flex-shrink-0" />
                        <h3 className="text-base sm:text-lg font-semibold break-words">{apiKey.name}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant={apiKey.status === 'active' ? 'default' : 'destructive'}>
                          {apiKey.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {keyIndustryConfig?.name || 'General'}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                        <span className="truncate">Created: {apiKey.created}</span>
                        <span className="truncate">Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                    {apiKey.status === 'active' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeKey(apiKey.id)}
                        className="w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    )}
                  </div>

                  {/* Use Case */}
                  <div className="mb-4">
                    <span className="text-sm font-medium">Primary Use Case:</span>
                    <p className="text-sm text-gray-600 mt-1 break-words">{apiKey.useCase}</p>
                  </div>

                  {/* API Keys (Dual: Publishable + Secret) */}
                  <div className="mb-4 space-y-3">
                    {/* Publishable Key - Safe to show */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Publishable Key</span>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Safe to use client-side
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <code className="bg-gray-100 px-3 py-2 rounded text-xs sm:text-sm break-all flex-1 font-mono">
                          {apiKey.publishableKey || 'pk_test_xxxxxxxxxxxxxx'}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyKey(apiKey.publishableKey)}
                          className="flex-1 sm:flex-none"
                          data-testid={`button-copy-publishable-${apiKey.id}`}
                        >
                          {copiedKey === apiKey.publishableKey ? (
                            <><CheckCircle className="h-4 w-4 text-green-500 mr-1" /><span className="sm:hidden">Copied!</span></>
                          ) : (
                            <><Copy className="h-4 w-4 mr-1" /><span className="sm:hidden">Copy</span></>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Secret Key - Hidden by default */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Secret Key</span>
                        <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                          Keep secret
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <code className="bg-gray-100 px-3 py-2 rounded text-xs sm:text-sm break-all flex-1 font-mono">
                          {apiKey.secretKey || 'sk_••••••••••••••••'}
                        </code>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleKeyVisibility(apiKey.id)}
                            className="flex-1 sm:flex-none"
                            data-testid={`button-toggle-secret-${apiKey.id}`}
                          >
                            {showKeys[apiKey.id] ? (
                              <><EyeOff className="h-4 w-4 mr-1" /><span className="sm:hidden">Hide</span></>
                            ) : (
                              <><Eye className="h-4 w-4 mr-1" /><span className="sm:hidden">Show</span></>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyKey(apiKey.secretKey)}
                            className="flex-1 sm:flex-none"
                            data-testid={`button-copy-secret-${apiKey.id}`}
                          >
                            {copiedKey === apiKey.secretKey ? (
                              <><CheckCircle className="h-4 w-4 text-green-500 mr-1" /><span className="sm:hidden">Copied!</span></>
                            ) : (
                              <><Copy className="h-4 w-4 mr-1" /><span className="sm:hidden">Copy</span></>
                            )}
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-red-600 mt-1 flex items-start gap-1">
                        <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>Never share your secret key or commit it to version control</span>
                      </p>
                    </div>
                  </div>

                  {/* Permissions and Rate Limits Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Permissions */}
                    <div>
                      <span className="text-sm font-medium mb-2 block">Permissions:</span>
                      <div className="flex flex-wrap gap-2">
                        {apiKey.permissions.map((permission: string) => (
                          <Badge key={permission} variant="secondary">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Rate Limits */}
                    <div>
                      <span className="text-sm font-medium mb-2 block">Rate Limits:</span>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">API Calls:</span>
                            <span className="font-medium">{apiKey.rateLimits.apiCalls.toLocaleString()}/hour</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Fraud Checks:</span>
                            <span className="font-medium">{apiKey.rateLimits.fraudChecks.toLocaleString()}/hour</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">KYC Verifications:</span>
                            <span className="font-medium">{apiKey.rateLimits.kycVerifications.toLocaleString()}/hour</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          }))}
        </div>

        {/* Security Guidelines */}
        <Card className="mt-6 border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <CardHeader>
            <CardTitle>Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Security */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">General Security</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Store API keys securely and never expose them in client-side code</li>
                  <li>• Use environment variables to store keys in your applications</li>
                  <li>• Regularly rotate your API keys for enhanced security</li>
                  <li>• Revoke unused or compromised keys immediately</li>
                  <li>• Use different keys for different environments (production, staging, development)</li>
                  <li>• Monitor API key usage and set up alerts for unusual activity</li>
                </ul>
              </div>

              {/* Industry-Specific Considerations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Industry-Specific Considerations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• <strong>Banking & Fintech:</strong> Implement additional AML monitoring and regulatory compliance logging</li>
                  <li>• <strong>Insurance:</strong> Ensure claims data encryption and fraud pattern analysis auditing</li>
                  <li>• <strong>Crypto:</strong> Use wallet-specific permissions and blockchain monitoring alerts</li>
                  <li>• <strong>E-commerce:</strong> Monitor transaction velocity and implement chargeback protection</li>
                  <li>• <strong>iGaming:</strong> Comply with age verification and responsible gambling regulations</li>
                  <li>• <strong>Retail:</strong> Secure POS integrations and loyalty program fraud monitoring</li>
                </ul>
              </div>
            </div>

            {/* Rate Limit Information */}
            <div className="mt-6 p-4 bg-[#f7f7f7] border border-[#e4e4e4] rounded-[12px]">
              <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Rate Limit Management</h4>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080] mb-2">
                Each industry configuration has tailored rate limits to match typical usage patterns and security requirements.
              </p>
              <div className="text-xs text-[#003d2b]">
                <strong>Contact Support:</strong> If you need higher rate limits for your use case, please reach out to our support team with details about your expected usage patterns.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}