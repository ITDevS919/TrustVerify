import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  User,
  Building2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  DollarSign,
  Activity,
  BarChart3,
  ArrowLeft,
  FileText,
  Download,
  Printer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SignalScore {
  provider: string;
  score: number;
  weight: number;
  status: 'pass' | 'warning' | 'fail';
  factors: { name: string; value: string; status: 'pass' | 'warning' | 'fail' }[];
}

export default function BankScoringDashboard() {
  const { toast } = useToast();
  const [customerType] = useState<'individual' | 'business'>('individual');
  const [reportOpen, setReportOpen] = useState(false);

  // Mock data for individual customer
  const individualSignals: SignalScore[] = [
    {
      provider: 'TrustVerify KYC',
      score: 94,
      weight: 35,
      status: 'pass',
      factors: [
        { name: 'Document Verification', value: 'Verified', status: 'pass' },
        { name: 'Liveness Detection', value: 'Passed', status: 'pass' },
        { name: 'Face Match', value: '98% Confidence', status: 'pass' },
        { name: 'Address Validation', value: 'Confirmed', status: 'pass' }
      ]
    },
    {
      provider: 'TrustVerify AML',
      score: 89,
      weight: 25,
      status: 'pass',
      factors: [
        { name: 'Sanctions Lists', value: 'Clear', status: 'pass' },
        { name: 'PEP Check', value: 'Not a PEP', status: 'pass' },
        { name: 'Adverse Media', value: 'No Matches', status: 'pass' },
        { name: 'Watchlist Screening', value: '1,200+ Lists Clear', status: 'pass' }
      ]
    },
    {
      provider: 'TrustVerify Device Intelligence',
      score: 92,
      weight: 25,
      status: 'pass',
      factors: [
        { name: 'Device Trust', value: 'High', status: 'pass' },
        { name: 'Bot Detection', value: 'Human', status: 'pass' },
        { name: 'Account Velocity', value: 'Normal', status: 'pass' },
        { name: 'Incognito Mode', value: 'Not Detected', status: 'pass' }
      ]
    },
    {
      provider: 'TrustVerify IP Risk',
      score: 88,
      weight: 15,
      status: 'pass',
      factors: [
        { name: 'Fraud Score', value: '12/100 (Low)', status: 'pass' },
        { name: 'Proxy/VPN', value: 'Not Detected', status: 'pass' },
        { name: 'Geolocation Match', value: 'UK - Matches Address', status: 'pass' },
        { name: 'IP Reputation', value: 'Clean', status: 'pass' }
      ]
    }
  ];

  // Calculate weighted score
  const calculateFinalScore = (signals: SignalScore[]) => {
    const totalWeight = signals.reduce((sum, s) => sum + s.weight, 0);
    const weightedSum = signals.reduce((sum, s) => sum + (s.score * s.weight), 0);
    return Math.round(weightedSum / totalWeight);
  };

  const finalScore = calculateFinalScore(individualSignals);

  const getRiskLevel = (score: number): { level: string; color: string; icon: any; decision: string } => {
    if (score >= 85) return { 
      level: 'Safe', 
      color: 'text-green-600 bg-green-100 border-green-300',
      icon: CheckCircle2,
      decision: 'Auto-Approve'
    };
    if (score >= 70) return { 
      level: 'Low Risk', 
      color: 'text-blue-600 bg-blue-100 border-blue-300',
      icon: CheckCircle2,
      decision: 'Approve with Monitoring'
    };
    if (score >= 50) return { 
      level: 'Medium Risk', 
      color: 'text-yellow-600 bg-yellow-100 border-yellow-300',
      icon: AlertTriangle,
      decision: 'Manual Review Required'
    };
    if (score >= 30) return { 
      level: 'High Risk', 
      color: 'text-orange-600 bg-orange-100 border-orange-300',
      icon: AlertTriangle,
      decision: 'Enhanced Due Diligence'
    };
    return { 
      level: 'Critical Risk', 
      color: 'text-red-600 bg-red-100 border-red-300',
      icon: XCircle,
      decision: 'Reject Application'
    };
  };

  const riskInfo = getRiskLevel(finalScore);
  const RiskIcon = riskInfo.icon;

  // Generate PDF Report (text-based for download)
  const generatePDFReport = () => {
    const reportId = `KYC-${Date.now().toString().slice(-8)}`;
    const reportDate = new Date().toLocaleString('en-GB');
    
    const reportContent = `
================================================================================
                    TRUSTVERIFY COMPLIANCE VERIFICATION REPORT
================================================================================

Report ID: ${reportId}
Generated: ${reportDate}
Customer Type: ${customerType.charAt(0).toUpperCase() + customerType.slice(1)}
Verification Status: ${riskInfo.decision}

================================================================================
                              EXECUTIVE SUMMARY
================================================================================

Overall Risk Score: ${finalScore}/100
Risk Level: ${riskInfo.level}
Recommended Action: ${riskInfo.decision}
Processing Time: 8.3 seconds
Cost per Check: £1.04

================================================================================
                           VERIFICATION DETAILS
================================================================================

${individualSignals.map(signal => `
${signal.provider.toUpperCase()}
${'─'.repeat(50)}
Score: ${signal.score}/100 (Weight: ${signal.weight}%)
Status: ${signal.status.toUpperCase()}

Factors:
${signal.factors.map(f => `  • ${f.name}: ${f.value} [${f.status.toUpperCase()}]`).join('\n')}
`).join('\n')}

================================================================================
                          REGULATORY COMPLIANCE
================================================================================

This verification has been conducted in accordance with:
- UK Money Laundering Regulations 2017 (as amended)
- Financial Conduct Authority (FCA) Guidelines
- JMLSG Guidance on Prevention of Money Laundering
- 5th Anti-Money Laundering Directive (5AMLD)
- 6th Anti-Money Laundering Directive (6AMLD)
- General Data Protection Regulation (GDPR)

Compliance Status:
  ✓ KYC Compliant - Identity verification complete
  ✓ AML Verified - Sanctions and watchlist screening clear
  ✓ GDPR Secure - Data processed securely under Article 6(1)(c)

================================================================================
                              CERTIFICATION
================================================================================

This report has been generated by TrustVerify's automated compliance verification
system. All checks have been performed using industry-leading data providers.

Multi-signal assessment combines:
- Identity Verification (99.2% accuracy)
- Sanctions Screening (99.5% accuracy)
- Device Intelligence (99.1% accuracy)
- IP Risk Analysis (98.5% accuracy)

Report certified by: TrustVerify Compliance Engine v2.1
Verification ID: ${reportId}

For queries regarding this report, please contact:
Email: compliance@trustverify.co.uk
Phone: 020 4542 7323

================================================================================
                         END OF VERIFICATION REPORT
================================================================================

This document is confidential and intended solely for the use of the addressee.
Any unauthorized review, use, disclosure, or distribution is prohibited.

© ${new Date().getFullYear()} TrustVerify Ltd. All rights reserved.
15 Grey Street, Newcastle upon Tyne NE1 6EE, United Kingdom
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TrustVerify-Compliance-Report-${reportId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "PDF Report Downloaded",
      description: `Compliance report saved as TrustVerify-Compliance-Report-${reportId}.txt`,
    });
  };

  // Generate JSON Export
  const generateJSONReport = () => {
    const reportId = `KYC-${Date.now().toString().slice(-8)}`;
    
    const jsonReport = {
      reportMetadata: {
        reportId: reportId,
        generatedAt: new Date().toISOString(),
        generatedBy: "TrustVerify Compliance Engine v2.1",
        format: "JSON",
        version: "1.0"
      },
      customerAssessment: {
        customerType: customerType,
        overallScore: finalScore,
        riskLevel: riskInfo.level,
        recommendedAction: riskInfo.decision,
        processingTime: "8.3 seconds",
        costPerCheck: "£1.04"
      },
      signalBreakdown: individualSignals.map(signal => ({
        provider: signal.provider,
        score: signal.score,
        weight: signal.weight,
        status: signal.status,
        factors: signal.factors.map(f => ({
          name: f.name,
          value: f.value,
          status: f.status
        }))
      })),
      complianceStatus: {
        kycCompliant: true,
        amlVerified: true,
        gdprSecure: true,
        regulations: [
          "UK Money Laundering Regulations 2017",
          "Financial Conduct Authority (FCA) Guidelines",
          "JMLSG Guidance on Prevention of Money Laundering",
          "5th Anti-Money Laundering Directive (5AMLD)",
          "6th Anti-Money Laundering Directive (6AMLD)",
          "General Data Protection Regulation (GDPR)"
        ]
      },
      signalAccuracy: {
        identityVerification: "99.2%",
        sanctionsScreening: "99.5%",
        deviceIntelligence: "99.1%",
        ipRiskAnalysis: "98.5%"
      },
      certification: {
        certifiedBy: "TrustVerify Compliance Engine v2.1",
        verificationId: reportId,
        contactEmail: "compliance@trustverify.co.uk",
        contactPhone: "020 4542 7323",
        companyAddress: "15 Grey Street, Newcastle upon Tyne NE1 6EE, United Kingdom"
      }
    };

    const blob = new Blob([JSON.stringify(jsonReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TrustVerify-Report-${reportId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "JSON Export Complete",
      description: `Report exported as TrustVerify-Report-${reportId}.json`,
    });
  };

  // Print Report
  const handlePrintReport = () => {
    toast({
      title: "Print Ready",
      description: "Opening print dialog...",
    });
    window.print();
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="mb-8 w-full">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/bank-onboarding-demo'}
            className="mb-4 border border-[#e4e4e4]"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Onboarding
          </Button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl mb-2">
                Customer Risk Scoring Dashboard
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base sm:text-lg lg:text-xl">
                Multi-Signal Assessment Results
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto text-base sm:text-lg">
                {customerType === 'individual' ? <User className="h-4 sm:h-5 w-4 sm:w-5 mr-2" /> : <Building2 className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />}
                {customerType === 'individual' ? 'Individual' : 'Business'}
              </Badge>
              
              <Dialog open={reportOpen} onOpenChange={setReportOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg" data-testid="button-generate-report">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Generate Report</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">
                      Compliance Verification Report
                    </DialogTitle>
                    <DialogDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      Complete customer onboarding assessment report for regulatory compliance
                    </DialogDescription>
                  </DialogHeader>
                  
                  {/* Report Content */}
                  <div className="space-y-6 mt-4">
                    {/* Report Header */}
                    <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Report ID</div>
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">KYC-{Date.now().toString().slice(-8)}</div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Generated</div>
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{new Date().toLocaleString('en-GB')}</div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Customer Type</div>
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] capitalize">{customerType}</div>
                          </div>
                          <div>
                            <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Verification Status</div>
                            <Badge className="bg-[#27ae60] text-white rounded-full px-4 py-1.5 h-auto">{riskInfo.decision}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Executive Summary */}
                    <div>
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-[#27ae60]" />
                        Executive Summary
                      </h3>
                      <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                        <CardContent className="pt-6">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center pb-3 border-b border-[#e4e4e4]">
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Overall Risk Score</span>
                              <span className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">{finalScore}/100</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-[#e4e4e4]">
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Level</span>
                              <Badge className={`${riskInfo.color} rounded-full px-4 py-1.5 h-auto`}>{riskInfo.level}</Badge>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-[#e4e4e4]">
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Recommended Action</span>
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#27ae60]">{riskInfo.decision}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Processing Time</span>
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">8.3 seconds</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Verification Details */}
                    <div>
                      <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg mb-3">Verification Details</h3>
                      <div className="space-y-3">
                        {individualSignals.map((signal) => (
                          <Card key={signal.provider} className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-center">
                                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-base">{signal.provider}</CardTitle>
                                <Badge variant={signal.status === 'pass' ? 'default' : 'destructive'} className="bg-[#003d2b1a] text-[#003d2b] hover:bg-[#003d2b1a] rounded-full px-4 py-1.5 h-auto">
                                  {signal.score}/100 (Weight: {signal.weight}%)
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {signal.factors.map((factor) => (
                                  <div key={factor.name} className="flex justify-between items-center">
                                    <span className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{factor.name}:</span>
                                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] flex items-center gap-1">
                                      {factor.status === 'pass' && <CheckCircle2 className="h-3 w-3 text-[#27ae60]" />}
                                      {factor.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Compliance Statement */}
                    <Card className="bg-[#f6f6f6] border border-[#e4e4e4] rounded-[20px]">
                      <CardContent className="pt-6">
                        <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Regulatory Compliance</h4>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                          This verification has been conducted in accordance with KYC, AML, and GDPR regulations. 
                          All customer data has been processed securely and verification results have been documented 
                          for audit purposes. The multi-signal assessment combines identity verification, sanctions screening, 
                          device intelligence, and IP risk analysis to provide a comprehensive risk profile.
                        </p>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-center">
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-[#27ae60]" />
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">KYC Compliant</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-[#27ae60]" />
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">AML Verified</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-[#27ae60]" />
                            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">GDPR Secure</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Download Options */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={generatePDFReport}
                        className="flex-1 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg"
                        data-testid="button-download-pdf"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Download PDF</span>
                      </Button>
                      <Button
                        onClick={generateJSONReport}
                        variant="outline"
                        className="flex-1 border border-[#e4e4e4] h-12 rounded-lg"
                        data-testid="button-export-json"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Export JSON</span>
                      </Button>
                      <Button
                        onClick={handlePrintReport}
                        variant="outline"
                        className="flex-1 border border-[#e4e4e4] h-12 rounded-lg"
                        data-testid="button-print"
                      >
                        <Printer className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Print Report</span>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className={`mb-8 bg-[#fcfcfc] rounded-[20px] border-4 ${riskInfo.color} w-full`}>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Display */}
              <div className="text-center md:col-span-1">
                <div className="mb-3">
                  <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-6xl">{finalScore}</div>
                  <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-sm">out of 100</div>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskInfo.color} border-2`}>
                  <RiskIcon className="h-5 w-5" />
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">{riskInfo.level}</span>
                </div>
              </div>

              {/* Decision */}
              <div className="md:col-span-2 flex flex-col justify-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg mb-2">Recommended Action</h3>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#27ae60] text-white text-lg px-4 py-2 rounded-full">
                        {riskInfo.decision}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e4e4e4]">
                    <div>
                      <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Processing Time</div>
                      <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg flex items-center gap-2 mt-1 text-[#003d2b]">
                        <Clock className="h-4 w-4 text-[#27ae60]" />
                        8.3 seconds
                      </div>
                    </div>
                    <div>
                      <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Cost per Check</div>
                      <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg flex items-center gap-2 mt-1 text-[#003d2b]">
                        <DollarSign className="h-4 w-4 text-[#27ae60]" />
                        £1.04
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal Breakdown */}
        <Tabs defaultValue="overview" className="mb-8 w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Signal Overview</TabsTrigger>
            <TabsTrigger value="details" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">Detailed Factors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {individualSignals.map((signal) => (
                <Card key={signal.provider} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{signal.provider}</CardTitle>
                      <Badge variant={signal.status === 'pass' ? 'default' : 'destructive'}>
                        {signal.score}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Score</span>
                          <span className="font-medium">{signal.score}%</span>
                        </div>
                        <Progress value={signal.score} className="h-2" />
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Weight in Final Score</span>
                          <span className="font-bold text-[#0A3778]">{signal.weight}%</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-500 mb-2">Key Checks</div>
                        <div className="flex flex-wrap gap-1">
                          {signal.factors.slice(0, 3).map((factor) => (
                            <Badge key={factor.name} variant="outline" className="text-xs">
                              {factor.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Weight Distribution Chart */}
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <BarChart3 className="h-5 w-5 text-[#27ae60]" />
                  Score Weight Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {individualSignals.map((signal) => (
                    <div key={signal.provider}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{signal.provider}</span>
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{signal.weight}%</span>
                      </div>
                      <div className="h-8 bg-[#f6f6f6] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] flex items-center justify-end pr-3"
                          style={{ width: `${signal.weight * 2.5}%` }}
                        >
                          <span className="text-white text-xs [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">{signal.weight}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6 mt-6">
            {individualSignals.map((signal) => (
              <Card key={signal.provider} className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader className="bg-[#f6f6f6]">
                  <div className="flex items-center justify-between">
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl">{signal.provider}</CardTitle>
                    <div className="text-right">
                      <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">{signal.score}/100</div>
                      <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Weight: {signal.weight}%</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {signal.factors.map((factor) => (
                      <div 
                        key={factor.name}
                        className={`p-4 rounded-lg border-2 ${
                          factor.status === 'pass' 
                            ? 'border-[#27ae60]/20 bg-[#e8f5e9]' 
                            : factor.status === 'warning'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b] mb-1">
                              {factor.name}
                            </div>
                            <div className={`text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium ${
                              factor.status === 'pass' ? 'text-[#27ae60]' : 
                              factor.status === 'warning' ? 'text-yellow-700' : 'text-red-700'
                            }`}>
                              {factor.value}
                            </div>
                          </div>
                          {factor.status === 'pass' && (
                            <CheckCircle2 className="h-5 w-5 text-[#27ae60]" />
                          )}
                          {factor.status === 'warning' && (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          )}
                          {factor.status === 'fail' && (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* ROI Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-[#27ae60] mx-auto mb-2" />
                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl">95%</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">Cost Reduction</div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">vs. Manual Review (£50)</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <div className="text-center">
                <Activity className="h-8 w-8 text-[#27ae60] mx-auto mb-2" />
                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl">99.8%</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">Accuracy Rate</div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Multi-signal verification</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-[#27ae60] mx-auto mb-2" />
                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl">8.3s</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">Avg. Processing</div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">vs. 2-5 days manual</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <CardContent className="pt-6">
              <div className="text-center">
                <Shield className="h-8 w-8 text-[#27ae60] mx-auto mb-2" />
                <div className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl">85%</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">Fraud Prevention</div>
                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2">Avg. £12K saved per block</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  );
}
