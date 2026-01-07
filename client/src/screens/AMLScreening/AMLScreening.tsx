import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Bug,
  Lock,
  Eye,
  FileText,
  Zap,
  Building2,
  Search,
  UserCheck,
  Scan,
  ArrowRight,
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { Link } from 'wouter';

interface SecurityMetrics {
  configurationScore: number;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  timestamp: string;
  environment: string;
}

interface PenTestResult {
  testId: string;
  testName: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'pass' | 'fail' | 'warning';
  description: string;
  evidence?: any;
  remediation: string;
  timestamp: string;
}

export default function AMLScreeningPage() {
  const { user } = useAuth();
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [penTestResults, setPenTestResults] = useState<PenTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningPenTest, setRunningPenTest] = useState(false);

  useEffect(() => {
    loadSecurityStatus();
  }, []);

  const isDevelopment = (import.meta as any).env?.DEV || (import.meta as any).env?.VITE_ALLOW_ALL_ADMIN === 'true';
  const hasAdminAccess = isDevelopment || user?.email?.includes('@trustverify.co.uk') || user?.isAdmin;

  const loadSecurityStatus = async () => {
    try {
      const response = await apiRequest('GET', '/api/security/status');
      const data = await response.json();
      setSecurityMetrics(data);
    } catch (error) {
      console.error('Failed to load security status:', error);
    } finally {
      setLoading(false);
    }
  };

  const runPenetrationTest = async () => {
    setRunningPenTest(true);
    try {
      const response = await apiRequest('POST', '/api/security/pentest');
      const data = await response.json();
      setPenTestResults(data.results);
    } catch (error) {
      console.error('Failed to run penetration test:', error);
    } finally {
      setRunningPenTest(false);
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#27ae60]';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 rounded-full';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 rounded-full';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200 rounded-full';
      default: return 'bg-[#e4e4e4] text-[#808080] border-[#e4e4e4] rounded-full';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-[#27ae60]" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Eye className="h-4 w-4 text-[#808080]" />;
    }
  };

  if (!user || !hasAdminAccess) {
    return (
      <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
        <Header />
        <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-12">
          <Alert className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
            <Shield className="h-4 w-4 text-[#27ae60]" />
            <AlertTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Access Denied</AlertTitle>
            <AlertDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
              This security dashboard is only accessible to TrustVerify administrators.
            </AlertDescription>
          </Alert>
        </section>
        <Footer />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
        <Header />
        <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-12">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#27ae60]"></div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-8">
        <div className="mb-8 w-full">
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl flex items-center">
            <Shield className="h-8 w-8 mr-3 text-[#27ae60]" />
            Security Dashboard
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-2 text-base sm:text-lg">
            Monitor and manage TrustVerify's security infrastructure
          </p>
        </div>

        {/* Security Score Overview */}
        {securityMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 w-full">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080]">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-2">
                  <span className={getSecurityScoreColor(securityMetrics.configurationScore)}>
                    {securityMetrics.configurationScore}/100
                  </span>
                </div>
                <Progress value={securityMetrics.configurationScore} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080]">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-600 mb-2">
                  {securityMetrics.criticalIssues.length}
                </div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Require immediate attention</div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080]">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-yellow-600 mb-2">
                  {securityMetrics.warnings.length}
                </div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Should be addressed</div>
              </CardContent>
            </Card>

            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080]">Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b] mb-2 capitalize">
                  {securityMetrics.environment}
                </div>
                <Badge 
                  variant={securityMetrics.environment === 'production' ? 'default' : 'secondary'}
                  className="rounded-full"
                >
                  <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                    {securityMetrics.environment === 'production' ? 'Live' : 'Development'}
                  </span>
                </Badge>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-6 w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#fcfcfc] rounded-lg border border-[#e4e4e4]">
            <TabsTrigger value="overview" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Overview</TabsTrigger>
            <TabsTrigger value="issues" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Issues & Warnings</TabsTrigger>
            <TabsTrigger value="testing" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Penetration Testing</TabsTrigger>
            <TabsTrigger value="compliance" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <Zap className="h-5 w-5 mr-2 text-[#27ae60]" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Access verification and compliance tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link href="/biometric-verification">
                    <div className="p-4 border border-[#e4e4e4] rounded-lg hover:border-[#27ae60] hover:bg-[#e8f5e9] transition-colors cursor-pointer group bg-[#fcfcfc]" data-testid="quick-action-kyc">
                      <div className="flex items-center justify-between mb-2">
                        <UserCheck className="h-8 w-8 text-[#27ae60]" />
                        <ArrowRight className="h-4 w-4 text-[#808080] group-hover:text-[#27ae60] transition-colors" />
                      </div>
                      <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">KYC Verification</h4>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Identity & biometric verification</p>
                    </div>
                  </Link>
                  
                  <Link href="/kyb-verification">
                    <div className="p-4 border border-[#e4e4e4] rounded-lg hover:border-[#27ae60] hover:bg-[#e8f5e9] transition-colors cursor-pointer group bg-[#fcfcfc]" data-testid="quick-action-kyb">
                      <div className="flex items-center justify-between mb-2">
                        <Building2 className="h-8 w-8 text-[#27ae60]" />
                        <ArrowRight className="h-4 w-4 text-[#808080] group-hover:text-[#27ae60] transition-colors" />
                      </div>
                      <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">KYB Verification</h4>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Business entity verification</p>
                    </div>
                  </Link>
                  
                  <Link href="/aml-screening">
                    <div className="p-4 border border-[#e4e4e4] rounded-lg hover:border-[#27ae60] hover:bg-[#e8f5e9] transition-colors cursor-pointer group bg-[#fcfcfc]" data-testid="quick-action-aml">
                      <div className="flex items-center justify-between mb-2">
                        <Search className="h-8 w-8 text-[#27ae60]" />
                        <ArrowRight className="h-4 w-4 text-[#808080] group-hover:text-[#27ae60] transition-colors" />
                      </div>
                      <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">AML Screening</h4>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Sanctions & PEP checks</p>
                    </div>
                  </Link>
                  
                  <Link href="/interactive-verification">
                    <div className="p-4 border border-[#e4e4e4] rounded-lg hover:border-[#27ae60] hover:bg-[#e8f5e9] transition-colors cursor-pointer group bg-[#fcfcfc]" data-testid="quick-action-fraud">
                      <div className="flex items-center justify-between mb-2">
                        <Scan className="h-8 w-8 text-[#27ae60]" />
                        <ArrowRight className="h-4 w-4 text-[#808080] group-hover:text-[#27ae60] transition-colors" />
                      </div>
                      <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">Fraud Detection</h4>
                      <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Real-time fraud analysis</p>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* KYC/KYB/AML Verification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* KYC Stats */}
              <Card className="border-l-4 border-l-[#27ae60] bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <UserCheck className="h-5 w-5 mr-2 text-[#27ae60]" />
                      KYC Verification
                    </CardTitle>
                    <Badge className="bg-[#e8f5e9] text-[#27ae60] rounded-full">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Active</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#e8f5e9] rounded-lg">
                      <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">1,247</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Verified</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-yellow-600">23</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pending</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                      <span className="text-[#808080]">Success Rate</span>
                      <span className="font-medium text-[#27ae60]">98.2%</span>
                    </div>
                    <Progress value={98.2} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-[#e4e4e4] pt-3 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                    <span className="text-[#808080]">Avg. Processing Time</span>
                    <span className="font-medium text-[#003d2b]">2.3 mins</span>
                  </div>
                  <Link href="/biometric-verification">
                    <Button variant="outline" className="w-full h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" data-testid="kyc-start-btn">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Start KYC</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* KYB Stats */}
              <Card className="border-l-4 border-l-[#27ae60] bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <Building2 className="h-5 w-5 mr-2 text-[#27ae60]" />
                      KYB Verification
                    </CardTitle>
                    <Badge className="bg-[#e8f5e9] text-[#27ae60] rounded-full">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Active</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#e8f5e9] rounded-lg">
                      <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">384</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Verified</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-yellow-600">12</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">In Review</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                      <span className="text-[#808080]">Approval Rate</span>
                      <span className="font-medium text-[#27ae60]">94.7%</span>
                    </div>
                    <Progress value={94.7} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-[#e4e4e4] pt-3 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                    <span className="text-[#808080]">Avg. Processing Time</span>
                    <span className="font-medium text-[#003d2b]">1.2 days</span>
                  </div>
                  <Link href="/kyb-verification">
                    <Button variant="outline" className="w-full h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" data-testid="kyb-start-btn">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Start KYB</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* AML Stats */}
              <Card className="border-l-4 border-l-[#27ae60] bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                      <Search className="h-5 w-5 mr-2 text-[#27ae60]" />
                      AML Screening
                    </CardTitle>
                    <Badge className="bg-[#e8f5e9] text-[#27ae60] rounded-full">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Active</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[#e8f5e9] rounded-lg">
                      <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">5,892</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Screened</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-600">8</div>
                      <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Flagged</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                      <span className="text-[#808080]">Clear Rate</span>
                      <span className="font-medium text-[#27ae60]">99.86%</span>
                    </div>
                    <Progress value={99.86} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-sm border-t border-[#e4e4e4] pt-3 [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                    <span className="text-[#808080]">Active Monitoring</span>
                    <span className="font-medium text-[#003d2b]">1,823 entities</span>
                  </div>
                  <Link href="/aml-screening">
                    <Button variant="outline" className="w-full h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]" data-testid="aml-start-btn">
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">Run Screening</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Verification Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KYB Verification Details */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Building2 className="h-5 w-5 mr-2 text-[#27ae60]" />
                    KYB Verification Status
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Business entity verification checks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Company Registry Check</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Beneficial Owner Verification</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Director/Officer Screening</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Business Address Validation</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Financial Standing Check</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Industry Risk Assessment</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="pt-3 border-t border-[#e4e4e4]">
                    <Link href="/kyb-verification">
                      <Button className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90" data-testid="kyb-verify-btn">
                        <Building2 className="mr-2 h-4 w-4" />
                        <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Start Business Verification</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* AML Screening Details */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Search className="h-5 w-5 mr-2 text-[#27ae60]" />
                    AML Screening Status
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Anti-money laundering compliance checks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Global Sanctions Lists</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">PEP Database Screening</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Adverse Media Monitoring</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Watchlist Checks</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Real-time Monitoring</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Enhanced Due Diligence</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="pt-3 border-t border-[#e4e4e4]">
                    <Link href="/aml-screening">
                      <Button className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90" data-testid="aml-screen-btn">
                        <Search className="mr-2 h-4 w-4" />
                        <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">Run AML Screening</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Features Status */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <Lock className="h-5 w-5 mr-2 text-[#27ae60]" />
                    Security Features
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Current security implementation status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">HTTPS Enforcement</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">RBAC System</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Rate Limiting</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Input Sanitization</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Audit Logging</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">2FA Infrastructure</span>
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    <FileText className="h-5 w-5 mr-2 text-[#27ae60]" />
                    Compliance Status
                  </CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Regulatory compliance readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">GDPR Compliance</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">KYC/AML Standards</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">SOC 2 Readiness</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Data Retention</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {securityMetrics && (
              <div className="space-y-6">
                {/* Critical Issues */}
                {securityMetrics.criticalIssues.length > 0 && (
                  <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                    <CardHeader>
                      <CardTitle className="text-red-600 flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                        <XCircle className="h-5 w-5 mr-2" />
                        Critical Issues
                      </CardTitle>
                      <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">These issues require immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {securityMetrics.criticalIssues.map((issue, index) => (
                          <Alert key={index} className="border-red-200 bg-red-50 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800 [font-family:'DM_Sans_18pt-Regular',Helvetica]">{issue}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Warnings */}
                {securityMetrics.warnings.length > 0 && (
                  <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                    <CardHeader>
                      <CardTitle className="text-yellow-600 flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Warnings
                      </CardTitle>
                      <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">These issues should be addressed when possible</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {securityMetrics.warnings.map((warning, index) => (
                          <Alert key={index} className="border-yellow-200 bg-yellow-50 rounded-lg">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800 [font-family:'DM_Sans_18pt-Regular',Helvetica]">{warning}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {securityMetrics.recommendations.length > 0 && (
                  <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                    <CardHeader>
                      <CardTitle className="text-[#27ae60] flex items-center [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold">
                        <Zap className="h-5 w-5 mr-2" />
                        Recommendations
                      </CardTitle>
                      <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Suggested improvements for enhanced security</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {securityMetrics.recommendations.map((recommendation, index) => (
                          <div key={index} className="p-3 bg-[#e8f5e9] border border-[#27ae60] rounded-lg">
                            <p className="text-sm text-[#003d2b] [font-family:'DM_Sans_18pt-Regular',Helvetica]">{recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                  <div className="flex items-center">
                    <Bug className="h-5 w-5 mr-2 text-[#27ae60]" />
                    Penetration Testing
                  </div>
                  <Button 
                    onClick={runPenetrationTest} 
                    disabled={runningPenTest}
                    className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 px-8"
                  >
                    <span className="font-semibold text-white text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica]">
                      {runningPenTest ? 'Running Tests...' : 'Run Pen Test'}
                    </span>
                  </Button>
                </CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  Automated security testing to identify vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {penTestResults.length > 0 ? (
                  <div className="space-y-4">
                    {penTestResults.map((result, index) => (
                      <div key={index} className="border border-[#e4e4e4] rounded-lg p-4 bg-[#fcfcfc]">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(result.status)}
                            <h4 className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{result.testName}</h4>
                            <Badge className={getSeverityColor(result.severity)}>
                              <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">{result.severity}</span>
                            </Badge>
                          </div>
                          <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{result.category}</span>
                        </div>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-2">{result.description}</p>
                        <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60]">{result.remediation}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bug className="h-12 w-12 text-[#808080] mx-auto mb-4" />
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">No penetration test results yet</p>
                    <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Run a penetration test to identify security vulnerabilities</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GDPR */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">GDPR Compliance</CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">General Data Protection Regulation readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Data Subject Rights</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Lawful Basis Processing</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Data Retention Policy</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Breach Notification</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                </CardContent>
              </Card>

              {/* SOC 2 */}
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">SOC 2 Type I</CardTitle>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Service Organization Control readiness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Security Controls</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Availability Controls</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Processing Integrity</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Confidentiality</span>
                    <CheckCircle className="h-4 w-4 text-[#27ae60]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
      <Footer />
    </main>
  );
}