import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, CheckCircle } from "lucide-react";

import { Header } from "../../components/Header";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { useMutation } from "@tanstack/react-query";


const apiEndpoints = [
  {
    title: "Domain Trust API",
    endpoint: "GET /api/fraud/domain/{domain}",
    color: "text-[#0052cc]",
  },
  {
    title: "Phone Verify API",
    endpoint: "GET /api/fraud/phone/{phone}",
    color: "text-[#27ae60]",
  },
  {
    title: "Website Analysis",
    endpoint: "POST /api/fraud/analyze",
    color: "text-purple-500",
  },
  {
    title: "Fraud Reports",
    endpoint: "POST /api/fraud/reports",
    color: "text-[#f29f5c]",
  },
];

type ContentSection = {
  label: string;
  icon: string;
  renderContent: () => JSX.Element;
};

export const FraudPrevention = (): JSX.Element => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeSectionLabel, setActiveSectionLabel] = useState(
    "Domain Trust"
  );
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  
  // Input states
  const [domainInput, setDomainInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [reportForm, setReportForm] = useState({
    reportType: "",
    targetDomain: "",
    targetPhoneNumber: "",
    targetEmail: "",
    severity: "",
    description: "",
    evidence: ""
  });
  
  // Results states
  const [domainResult, setDomainResult] = useState<any>(null);
  const [phoneResult, setPhoneResult] = useState<any>(null);
  const [websiteResult, setWebsiteResult] = useState<any>(null);
  const [comprehensiveResult, setComprehensiveResult] = useState<any>(null);
  
  // Domain Trust Score Check
  const domainCheckMutation = useMutation({
    mutationFn: async (domain: string) => {
      const response = await fetch(`/api/fraud/domain/${encodeURIComponent(domain)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Domain check failed");
      return response.json();
    },
    onSuccess: (data) => {
      setDomainResult(data);
      toast({
        title: "Domain Analysis Complete",
        description: `Trust Score: ${data.trustScore}% - Risk Level: ${data.riskLevel}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze domain. Please check your API key.",
        variant: "destructive",
      });
    },
  });

  // Phone Number Verification
  const phoneCheckMutation = useMutation({
    mutationFn: async (phoneNumber: string) => {
      const response = await fetch(`/api/fraud/phone/${encodeURIComponent(phoneNumber)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Phone check failed");
      return response.json();
    },
    onSuccess: (data) => {
      setPhoneResult(data);
      toast({
        title: "Phone Analysis Complete",
        description: `Risk Level: ${data.riskLevel} - Fraud Score: ${data.fraudScore}%`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze phone number. Please check your API key.",
        variant: "destructive",
      });
    },
  });

  // Website Analysis
  const websiteAnalysisMutation = useMutation({
    mutationFn: async (url: string) => {
      const encodedUrl = encodeURIComponent(url);
      const response = await fetch(`/api/fraud/analyze/${encodedUrl}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Website analysis failed");
      return response.json();
    },
    onSuccess: (data) => {
      setWebsiteResult(data);
      toast({
        title: "Website Analysis Complete",
        description: `Risk Score: ${data.riskScore}% - Category: ${data.category}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Unable to analyze website. Please check your API key.",
        variant: "destructive",
      });
    },
  });

  // Submit Fraud Report
  const reportMutation = useMutation({
    mutationFn: async (reportData: any) => {
      const response = await fetch("/api/fraud/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Report submission failed");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your fraud report has been submitted successfully.",
      });
      setReportForm({
        reportType: "",
        targetDomain: "",
        targetPhoneNumber: "",
        targetEmail: "",
        severity: "",
        description: "",
        evidence: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Unable to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Comprehensive Fraud Check
  const comprehensiveCheckMutation = useMutation({
    mutationFn: async (data: { domain?: string; phoneNumber?: string; url?: string }) => {
      const response = await fetch("/api/fraud/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Comprehensive check failed");
      return response.json();
    },
    onSuccess: (data) => {
      setComprehensiveResult(data);
      toast({
        title: "Comprehensive Check Complete",
        description: `Found ${data.reports?.length || 0} related fraud reports`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Check Failed",
        description: error.message || "Unable to perform comprehensive check.",
        variant: "destructive",
      });
    },
  });

  const handleDomainCheck = () => {
    if (!domainInput.trim()) {
      toast({
        title: "Missing Domain",
        description: "Please enter a domain to check",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to website integrity checker
    const domain = domainInput.trim();
    const url = domain.startsWith('http') ? domain : `https://${domain}`;
    navigate(`/website-integrity?url=${encodeURIComponent(url)}`);
  };

  const handlePhoneCheck = () => {
    if (!phoneInput.trim()) {
      toast({
        title: "Missing Phone Number",
        description: "Please enter a phone number to check",
        variant: "destructive",
      });
      return;
    }
    phoneCheckMutation.mutate(phoneInput.trim());
  };

  const handleWebsiteAnalysis = () => {
    if (!urlInput.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }
    websiteAnalysisMutation.mutate(urlInput.trim());
  };

  const handleReportSubmit = () => {
    if (!reportForm.reportType || !reportForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields",
        variant: "destructive",
      });
      return;
    }
    reportMutation.mutate(reportForm);
  };

  const handleComprehensiveCheck = () => {
    const data: any = {};
    if (domainInput.trim()) data.domain = domainInput.trim();
    if (phoneInput.trim()) data.phoneNumber = phoneInput.trim();
    if (urlInput.trim()) data.url = urlInput.trim();
    
    if (Object.keys(data).length === 0) {
      toast({
        title: "No Data Provided",
        description: "Please enter at least one item to check",
        variant: "destructive",
      });
      return;
    }
    
    comprehensiveCheckMutation.mutate(data);
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const contentSections: ContentSection[] = [
  {
    label: "Domain Trust",
    icon: "/fi-4400149.svg",
    renderContent: () => (
      <Card className="w-full bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4]">
        <CardContent className="flex flex-col items-start gap-[30px] p-4 md:p-6">
          <div className="flex flex-col items-start gap-6 w-full">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[46px] h-[46px]"
                alt="Domain Trust Icon"
                src="/p-2-rounded-lg-bg-accent-10 2.svg"
              />

              <div className="flex flex-col items-start gap-[5px] flex-1">
                <h2 className="w-full [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                  Domain Trust Score API
                </h2>

                <p className="flex items-center justify-center w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                  Check Domain Trust Scores And Risk Levels For Fraud Prevention
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2.5 w-full">
              <label className="flex w-full [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                Domain to check
              </label>

              <Input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="Example.com"
                className="h-[50px] w-full bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
              />
            </div>
          </div>

          {domainResult && (
            <Alert className="bg-[#f7f7f7] border border-[#e4e4e4] rounded-[10px]">
              <CheckCircle className="h-4 w-4 text-[#27ae60]" />
              <AlertDescription className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Trust Score:</span>
                  <Badge variant="outline" className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">{domainResult.trustScore}%</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Level:</span>
                  <Badge className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] ${getRiskBadgeColor(domainResult.riskLevel)}`}>
                    {domainResult.riskLevel}
                  </Badge>
                </div>
                {domainResult.category && (
                  <div className="flex items-center gap-2">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Category:</span>
                    <Badge variant="secondary" className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">{domainResult.category}</Badge>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleDomainCheck}
            disabled={domainCheckMutation.isPending}
            className="w-full h-[50px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[-0.20px] leading-[18px]" 
            type="button"
          >
            {domainCheckMutation.isPending ? "Checking..." : "Check Domain Trust"}
          </Button>
        </CardContent>
      </Card>
    ),
  },
  {
    label: "Phone Verify",
    icon: "/fi-13738939.svg",
    renderContent: () => (
      <Card className="w-full bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4]">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-start gap-[30px] w-full">
            <div className="flex flex-col items-start gap-6 w-full">
              <div className="flex items-center gap-2.5">
                <img
                  className="w-[46px] h-[46px]"
                  alt="Phone verification icon"
                  src="/p-2-rounded-lg-bg-accent-10 3.svg"
                />

                <div className="flex flex-col items-start gap-[5px] flex-1">
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                    Phone Number Verification API
                  </h2>

                  <p className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                    Verify Phone Numbers And Check For Scam/spam Indicators
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-2.5 w-full">
                <Label className="flex [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] leading-6 text-base tracking-[0]">
                  Phone Number
                </Label>

                <Input
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+123456789"
                  className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0]"
                />
              </div>
            </div>

            {phoneResult && (
              <Alert className="bg-[#f7f7f7] border border-[#e4e4e4] rounded-[10px]">
                <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                <AlertDescription className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Fraud Score:</span>
                    <Badge variant="outline" className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">{phoneResult.fraudScore}%</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Level:</span>
                    <Badge className={`[font-family:'DM_Sans_18pt-Regular',Helvetica] ${getRiskBadgeColor(phoneResult.riskLevel)}`}>
                      {phoneResult.riskLevel}
                    </Badge>
                  </div>
                  {phoneResult.carrier && (
                    <div className="flex items-center gap-2">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Carrier:</span>
                      <Badge variant="secondary" className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">{phoneResult.carrier}</Badge>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handlePhoneCheck}
              disabled={phoneCheckMutation.isPending}
              className="h-[50px] w-full rounded-lg overflow-hidden bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
            >
              <span className="flex items-center justify-center [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm text-center tracking-[-0.20px] leading-[18px] whitespace-nowrap">
                {phoneCheckMutation.isPending ? "Verifying..." : "Verify Phone Number"}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    label: "Website Analysis",
    icon: "/fi-1850978.svg",
    renderContent: () => (
      <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4] w-full">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5">
                <img
                  className="w-[46px] h-[46px]"
                  alt="Website Analysis"
                  src="/p-2-rounded-lg-bg-accent-10 4.svg"
                />
                <div className="flex flex-col gap-[5px] flex-1">
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                    Website Analysis API
                  </h2>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                    Comprehensive Website Security And Fraud Analysis
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Label
                  htmlFor="website-url"
                  className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6"
                >
                  Website URL
                </Label>
                <Input
                  id="website-url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="h-[50px] px-5 py-[15px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0]"
                />
              </div>
            </div>

            {websiteResult && (
              <Alert className="bg-[#f7f7f7] border border-[#e4e4e4] rounded-[10px]">
                <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                <AlertDescription className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Score:</span>
                    <Badge variant="outline" className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">{websiteResult.riskScore}%</Badge>
                  </div>
                  {websiteResult.category && (
                    <div className="flex items-center gap-2">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Category:</span>
                      <Badge variant="secondary" className="[font-family:'DM_Sans_18pt-Regular',Helvetica]">{websiteResult.category}</Badge>
                    </div>
                  )}
                  {websiteResult.hasValidSSL !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">SSL Valid:</span>
                      <Badge className={websiteResult.hasValidSSL ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {websiteResult.hasValidSSL ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleWebsiteAnalysis}
              disabled={websiteAnalysisMutation.isPending}
              className="h-[50px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[-0.20px] leading-[18px]"
            >
              {websiteAnalysisMutation.isPending ? "Analyzing..." : "Analyze Website"}
            </Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    label: "Report Fraud",
    icon: "/fi-11494722.svg",
    renderContent: () => (
      <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] w-full">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col items-start gap-6">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[46px] h-[46px]"
                alt="Report icon"
                src="/p-2-rounded-lg-bg-accent-10 5.svg"
              />

              <div className="flex flex-col items-start gap-[5px] flex-1">
                <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                  Submit Fraud Report
                </h2>

                <p className="flex items-center justify-center [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                  Report Fraudulent Websites, Phone Numbers, Or Suspicious
                  Activities
                </p>
              </div>
            </div>

              <div className="flex flex-col items-start gap-[30px] w-full">
                <div className="flex flex-col items-start gap-5 w-full">
                  <div className="flex flex-col items-start gap-5 w-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 w-full">
                    <div className="flex flex-col items-start gap-2.5 flex-1">
                      <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                        Report Type
                      </Label>

                      <Select 
                        value={reportForm.reportType} 
                        onValueChange={(value) => setReportForm({...reportForm, reportType: value})}
                      >
                        <SelectTrigger className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                          <SelectValue placeholder="Select Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Fraudulent Website</SelectItem>
                          <SelectItem value="phone">Scam Phone Number</SelectItem>
                          <SelectItem value="email">Phishing Email</SelectItem>
                          <SelectItem value="user">Suspicious User</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col items-start gap-2.5 flex-1">
                      <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                        Severity
                      </Label>

                      <Select 
                        value={reportForm.severity} 
                        onValueChange={(value) => setReportForm({...reportForm, severity: value})}
                      >
                        <SelectTrigger className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                          <SelectValue placeholder="Select Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-[19px] w-full">
                    <div className="flex flex-col items-start gap-2.5 flex-1 w-full">
                      <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                        Target Domain
                      </Label>

                      <Input
                        value={reportForm.targetDomain}
                        onChange={(e) => setReportForm({...reportForm, targetDomain: e.target.value})}
                        placeholder="fraudulent-site.com"
                        className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                      />
                    </div>

                    <div className="flex flex-col items-start gap-2.5 flex-1 w-full">
                      <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                        Target Phone
                      </Label>

                      <Input
                        value={reportForm.targetPhoneNumber}
                        onChange={(e) => setReportForm({...reportForm, targetPhoneNumber: e.target.value})}
                        placeholder="+123456789"
                        className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                      />
                    </div>

                    <div className="flex flex-col items-start gap-2.5 flex-1 w-full">
                      <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                        Target Email
                      </Label>

                      <Input
                        value={reportForm.targetEmail}
                        onChange={(e) => setReportForm({...reportForm, targetEmail: e.target.value})}
                        placeholder="scam@example.com"
                        className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-5 w-full">
                  <div className="flex flex-col items-start gap-2.5 w-full">
                    <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                      Description
                    </Label>

                    <Textarea
                      value={reportForm.description}
                      onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                      placeholder="Describe the fraudulent activity in detail....."
                      className="h-[104px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base resize-none"
                    />
                  </div>

                  <div className="flex flex-col items-start gap-2.5 w-full">
                    <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                      Evidence/Supporting Information
                    </Label>

                    <Textarea
                      value={reportForm.evidence}
                      onChange={(e) => setReportForm({...reportForm, evidence: e.target.value})}
                      placeholder="Any evidence, URLs etc...."
                      className="h-[104px] bg-[#fcfcfc] rounded-[10px] border border-solid border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base resize-none"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleReportSubmit}
                disabled={reportMutation.isPending}
                className="w-full h-[50px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[-0.20px] leading-[18px]"
              >
                {reportMutation.isPending ? "Submitting..." : "Submit Fraud Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    label: "Multi-Check",
    icon: "/fi-16549387.svg",
    renderContent: () => (
      <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-[#e4e4e4] w-full">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-[30px]">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2.5">
                <img
                  className="w-[46px] h-[46px]"
                  alt="Comprehensive Fraud Check"
                  src="/p-2-rounded-lg-bg-accent-10 6.svg"
                />
                <div className="flex flex-col gap-[5px] flex-1">
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                    Comprehensive Fraud Check
                  </h2>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base tracking-[0] leading-6">
                    Run Multiple Fraud Checks Simultaneously And Get
                    Comprehensive Results
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-[19px]">
                <div className="flex flex-col gap-2.5 flex-1 w-full">
                  <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                    Domain
                  </Label>
                  <Input
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="example.com"
                    className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                  />
                </div>
                <div className="flex flex-col gap-2.5 flex-1 w-full">
                  <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                    Phone Number
                  </Label>
                  <Input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+123456789"
                    className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                  />
                </div>
                <div className="flex flex-col gap-2.5 flex-1 w-full">
                  <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-base tracking-[0] leading-6">
                    Website URL
                  </Label>
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    className="h-[50px] bg-[#fcfcfc] rounded-[10px] border border-[#e4e4e4] px-5 py-[15px] [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base"
                  />
                </div>
              </div>
            </div>

            {comprehensiveResult && (
              <Alert className="bg-[#f7f7f7] border border-[#e4e4e4] rounded-[10px]">
                <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                <AlertDescription className="flex flex-col gap-3">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b]">Comprehensive Check Results:</h4>
                  
                  {comprehensiveResult.domain && (
                    <div className="border-l-4 border-[#0052cc] pl-4">
                      <h5 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#0052cc]">Domain Analysis</h5>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                        Trust Score: {comprehensiveResult.domain.trustScore}% | Risk: {comprehensiveResult.domain.riskLevel}
                      </p>
                    </div>
                  )}
                  
                  {comprehensiveResult.phone && (
                    <div className="border-l-4 border-[#27ae60] pl-4">
                      <h5 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#27ae60]">Phone Analysis</h5>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                        Fraud Score: {comprehensiveResult.phone.fraudScore}% | Risk: {comprehensiveResult.phone.riskLevel}
                      </p>
                    </div>
                  )}
                  
                  {comprehensiveResult.website && (
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-purple-700">Website Analysis</h5>
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                        Risk Score: {comprehensiveResult.website.riskScore}% | Category: {comprehensiveResult.website.category}
                      </p>
                    </div>
                  )}
                  
                  <div className="border-l-4 border-[#f29f5c] pl-4">
                    <h5 className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#f29f5c]">Related Reports</h5>
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      {comprehensiveResult.reports?.length || 0} fraud reports found
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleComprehensiveCheck}
              disabled={comprehensiveCheckMutation.isPending}
              className="h-[50px] w-full rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] [font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-white text-sm tracking-[-0.20px] leading-[18px] hover:opacity-90"
            >
              {comprehensiveCheckMutation.isPending ? "Running Comprehensive Check..." : "Run Comprehensive Check"}
            </Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
];

  const activeSection =
    contentSections.find(
      (section) => section.label === activeSectionLabel
    ) ?? contentSections[0];

  return (
    <div className="bg-[#f6f6f6] w-full flex flex-col">
      <Header />
      <section className="flex flex-col items-start gap-[30px] w-full px-[20px] md:px-[50px] py-[40px] md:py-[50px]">
        <header className="flex flex-col items-start gap-2.5 w-full text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsSidebarMenuOpen(true)}
              className="md:hidden p-2.5 transition-colors flex-shrink-0"
              aria-label="Toggle dashboard menu"
            >
              <img className="w-5 h-5" alt="Menu" src="/fi-9091429.png" />
            </button>

            <h1 className="w-auto [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl md:text-5xl tracking-[0] leading-[normal]">
              Fraud Prevention Dashboard
            </h1>
          </div>

          <p className="w-full [font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base md:text-xl tracking-[0] leading-6 md:leading-8">
            Comprehensive fraud detection and prevention tools
          </p>
        </header>

        <div className="flex flex-col md:flex-row items-start gap-6 w-full">
          <Card className="hidden md:block md:w-[330px] bg-white rounded-[14px] overflow-hidden border-[0.8px] border-solid border-neutral-200 shadow-[0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_0px_0px_transparent,0px_1px_3px_#0000001a,0px_1px_2px_-1px_#0000001a] order-2 md:order-1">
            <CardContent className="flex flex-col items-start gap-2.5 p-6">
              {contentSections.map((section) => {
                const isActive = section.label === activeSection.label;

                return (
                  <button
                    key={section.label}
                    type="button"
                    onClick={() => setActiveSectionLabel(section.label)}
                    className={`flex items-center gap-2.5 w-full h-[50px] px-[15px] py-[13px] rounded-[10px] transition-colors duration-150 ${
                      isActive ? "bg-app-secondary" : ""
                    }`}
                  >
                    <img className="w-6 h-6" alt={section.label} src={section.icon} />
                    <span
                      className={`[font-family:'DM_Sans_18pt-${
                        isActive ? "SemiBold" : "Regular"
                      }',Helvetica] ${
                        isActive
                          ? "font-semibold text-white"
                          : "font-normal text-[#808080]"
                      } text-base tracking-[0] leading-5 whitespace-nowrap`}
                    >
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex flex-col flex-1 items-start gap-[22px] order-1 md:order-2 w-full">
            <div className="w-full">{activeSection?.renderContent()}</div>
            <Card className="w-full bg-[#fcfcfc] rounded-[20px] overflow-hidden border-[0.8px] border-solid border-[#e4e4e4]">
              <CardContent className="flex flex-col items-start gap-6 p-4 md:p-6">
                <div className="flex flex-col items-start gap-[5px] text-left w-full">
                  <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg md:text-xl tracking-[0] leading-6">
                    API Integration Information
                  </h2>

                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base tracking-[0] leading-6">
                    Use These Endpoints To Integrate Fraud Prevention Into Your Applications
                  </p>
                </div>

                <div className="flex flex-col gap-5 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                    {apiEndpoints.map((api, index) => (
                      <div key={`${api.title}-${index}`} className="flex flex-col gap-[11px]">
                        <div
                          className={`[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium ${api.color} text-sm md:text-base tracking-[0] leading-[normal]`}
                        >
                          {api.title}
                        </div>

                        <div className="flex h-10 items-center px-4 py-2 w-full bg-[#f0f0f0] rounded-lg">
                          <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#003d2b] text-xs md:text-sm text-left tracking-[0] leading-[normal]">
                            {api.endpoint}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isSidebarMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <Card className="h-full bg-white rounded-none border-0 shadow-none">
          <CardContent className="flex flex-col items-start gap-6 p-6 pt-20">
            <div className="flex items-center justify-between w-full mb-2">
              <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl tracking-[0] leading-6">
                Dashboard Sections
              </h2>
              <button
                type="button"
                onClick={() => setIsSidebarMenuOpen(false)}
                className="p-2 rounded-lg bg-[#f8f8f8] hover:bg-[#e8e8e8] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 text-[#003d2b]" />
              </button>
            </div>

            <div className="flex flex-col items-start gap-4 w-full">
              <div className="flex flex-col items-start gap-2.5 w-full">
                {contentSections.map((section) => {
                  const isActive = section.label === activeSection.label;

                  return (
                    <button
                      key={section.label}
                      type="button"
                      onClick={() => {
                        setActiveSectionLabel(section.label);
                        setIsSidebarMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 w-full h-[50px] px-[15px] rounded-[10px] transition-colors ${
                        isActive ? "bg-app-secondary" : "bg-[#f8f8f8]"
                      }`}
                    >
                      <img className="w-6 h-6" alt={section.label} src={section.icon} />
                      <span
                        className={`[font-family:'DM_Sans_18pt-${
                          isActive ? "SemiBold" : "Regular"
                        }',Helvetica] ${
                          isActive ? "font-semibold text-white" : "font-normal text-[#808080]"
                        } text-sm tracking-[0] leading-5 whitespace-nowrap`}
                      >
                        {section.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isSidebarMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarMenuOpen(false)}
        />
      )}
    </div>
  );
};
