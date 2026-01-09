import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  User,
  Building2,
  Globe,
  FileText,
  Bell,
  RefreshCw,
  Download,
  Eye,
  Flag,
  Activity,
  TrendingUp,
  Users,
  AlertCircle,
  Filter,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScreeningResult {
  id: string;
  name: string;
  type: 'individual' | 'business';
  dateOfBirth?: string;
  nationality?: string;
  registrationNumber?: string;
  screeningDate: string;
  status: 'clear' | 'match' | 'potential_match' | 'pending';
  pepStatus: boolean;
  sanctionsMatch: boolean;
  adverseMedia: boolean;
  riskScore: number;
  matchDetails?: string[];
}

interface MonitoringAlert {
  id: string;
  entityName: string;
  entityType: 'individual' | 'business';
  alertType: 'new_sanction' | 'pep_update' | 'adverse_media' | 'watchlist_addition';
  severity: 'low' | 'medium' | 'high' | 'critical';
  dateDetected: string;
  status: 'new' | 'reviewing' | 'resolved' | 'escalated';
  description: string;
}

export default function AMLScreeningPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("screening");
  const [screeningType, setScreeningType] = useState<'individual' | 'business'>('individual');
  const [isScreening, setIsScreening] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(0);

  // Individual screening fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nationality, setNationality] = useState("");

  // Business screening fields
  const [businessName, setBusinessName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [registrationCountry, setRegistrationCountry] = useState("");

  // Results
  const [screeningResults, setScreeningResults] = useState<ScreeningResult[]>([
    {
      id: 'SCR-001',
      name: 'John Smith',
      type: 'individual',
      dateOfBirth: '1985-03-15',
      nationality: 'United Kingdom',
      screeningDate: '2025-12-20',
      status: 'clear',
      pepStatus: false,
      sanctionsMatch: false,
      adverseMedia: false,
      riskScore: 12
    },
    {
      id: 'SCR-002',
      name: 'Acme Holdings Ltd',
      type: 'business',
      registrationNumber: '12345678',
      screeningDate: '2025-12-19',
      status: 'potential_match',
      pepStatus: false,
      sanctionsMatch: false,
      adverseMedia: true,
      riskScore: 45,
      matchDetails: ['Media mention: Regulatory investigation 2024']
    },
    {
      id: 'SCR-003',
      name: 'Viktor Petrov',
      type: 'individual',
      dateOfBirth: '1970-08-22',
      nationality: 'Russia',
      screeningDate: '2025-12-18',
      status: 'match',
      pepStatus: true,
      sanctionsMatch: true,
      adverseMedia: true,
      riskScore: 95,
      matchDetails: ['OFAC SDN List Match', 'EU Sanctions List Match', 'PEP: Former Government Official']
    }
  ]);

  const [monitoringAlerts, _setMonitoringAlerts] = useState<MonitoringAlert[]>([
    {
      id: 'ALT-001',
      entityName: 'Global Trade Corp',
      entityType: 'business',
      alertType: 'new_sanction',
      severity: 'critical',
      dateDetected: '2025-12-20T10:30:00Z',
      status: 'new',
      description: 'Entity added to EU consolidated sanctions list'
    },
    {
      id: 'ALT-002',
      entityName: 'Maria Santos',
      entityType: 'individual',
      alertType: 'pep_update',
      severity: 'medium',
      dateDetected: '2025-12-19T14:15:00Z',
      status: 'reviewing',
      description: 'PEP status changed: Appointed as government minister'
    },
    {
      id: 'ALT-003',
      entityName: 'Nexus Financial Services',
      entityType: 'business',
      alertType: 'adverse_media',
      severity: 'high',
      dateDetected: '2025-12-18T09:00:00Z',
      status: 'escalated',
      description: 'Multiple media reports of money laundering allegations'
    }
  ]);

  const runScreening = async () => {
    setIsScreening(true);
    setScreeningProgress(0);

    const stages = [
      { progress: 20, label: 'Checking global sanctions lists...' },
      { progress: 40, label: 'Screening PEP databases...' },
      { progress: 60, label: 'Searching adverse media...' },
      { progress: 80, label: 'Analyzing watchlists...' },
      { progress: 100, label: 'Compiling results...' }
    ];

    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScreeningProgress(stage.progress);
    }

    const newResult: ScreeningResult = {
      id: `SCR-${Date.now().toString().slice(-6)}`,
      name: screeningType === 'individual' ? `${firstName} ${lastName}` : businessName,
      type: screeningType,
      dateOfBirth: screeningType === 'individual' ? dateOfBirth : undefined,
      nationality: screeningType === 'individual' ? nationality : undefined,
      registrationNumber: screeningType === 'business' ? registrationNumber : undefined,
      screeningDate: new Date().toISOString().split('T')[0],
      status: 'clear',
      pepStatus: false,
      sanctionsMatch: false,
      adverseMedia: false,
      riskScore: Math.floor(Math.random() * 25)
    };

    setScreeningResults([newResult, ...screeningResults]);
    setIsScreening(false);

    toast({
      title: "Screening Complete",
      description: `${newResult.name} has been screened. Status: Clear`,
    });

    // Reset form
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setNationality("");
    setBusinessName("");
    setRegistrationNumber("");
    setRegistrationCountry("");
  };

  const getStatusBadge = (status: ScreeningResult['status']) => {
    switch (status) {
      case 'clear':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Clear</Badge>;
      case 'match':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Match</Badge>;
      case 'potential_match':
        return <Badge className="bg-amber-500"><AlertTriangle className="h-3 w-3 mr-1" />Potential Match</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getSeverityBadge = (severity: MonitoringAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const getAlertStatusBadge = (status: MonitoringAlert['status']) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'reviewing':
        return <Badge className="bg-purple-500">Reviewing</Badge>;
      case 'escalated':
        return <Badge variant="destructive">Escalated</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-green-600';
  };

  const countries = [
    "United Kingdom", "United States", "Germany", "France", "Netherlands",
    "Ireland", "Spain", "Italy", "Canada", "Australia", "Russia", "China", "Other"
  ];

  const stats = {
    totalScreenings: screeningResults.length,
    clearResults: screeningResults.filter(r => r.status === 'clear').length,
    matchesFound: screeningResults.filter(r => r.status === 'match').length,
    pendingReview: screeningResults.filter(r => r.status === 'potential_match').length,
    activeAlerts: monitoringAlerts.filter(a => a.status !== 'resolved').length,
    entitiesMonitored: 1247
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <section className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        {/* Header */}
        <div className="mb-6 w-full">
          <div className="flex items-center justify-center  gap-3 mb-3">
            <Shield className="h-8 w-8 text-[#27ae60]" />
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl">
                AML & PEP Screening
              </h1>
            </div>
          </div>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-center">
            Anti-Money Laundering compliance and Politically Exposed Person screening
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 w-full">
          <Card className="bg-[#fcfcfc] rounded-[16px] border border-[#e4e4e4]">
            <CardContent className="p-4 text-center">
              <Search className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl text-[#003d2b] font-semibold">{stats.totalScreenings}</p>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Total Screenings</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[16px] border border-[#e4e4e4]">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl text-[#27ae60] font-semibold">{stats.clearResults}</p>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Clear Results</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[16px] border border-[#e4e4e4]">
            <CardContent className="p-4 text-center">
              <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl text-red-600 font-semibold">{stats.matchesFound}</p>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Matches Found</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[16px] border border-[#e4e4e4]">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl text-amber-600 font-semibold">{stats.pendingReview}</p>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[16px] border border-[#e4e4e4]">
            <CardContent className="p-4 text-center">
              <Bell className="h-6 w-6 text-[#436cc8] mx-auto mb-2" />
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl text-[#436cc8] font-semibold">{stats.activeAlerts}</p>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Active Alerts</p>
            </CardContent>
          </Card>
          <Card className="bg-[#fcfcfc] rounded-[16px] border border-[#e4e4e4]">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 text-[#27ae60] mx-auto mb-2" />
              <p className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-2xl text-[#003d2b] font-semibold">{stats.entitiesMonitored.toLocaleString()}</p>
              <p className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Monitored</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-200 rounded-lg p-1">
            <TabsTrigger value="screening" data-testid="tab-screening">
              <Search className="h-4 w-4 mr-2" />
              New Screening
            </TabsTrigger>
            <TabsTrigger value="results" data-testid="tab-results">
              <FileText className="h-4 w-4 mr-2" />
              Results History
            </TabsTrigger>
            <TabsTrigger value="monitoring" data-testid="tab-monitoring">
              <Activity className="h-4 w-4 mr-2" />
              Ongoing Monitoring
            </TabsTrigger>
            <TabsTrigger value="alerts" data-testid="tab-alerts">
              <Bell className="h-4 w-4 mr-2" />
              Alerts ({stats.activeAlerts})
            </TabsTrigger>
          </TabsList>

          {/* New Screening Tab */}
          <TabsContent value="screening">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-[#fcfcfc] border border-[#e4e4e4] rounded-[20px]" data-testid="screening-form">
                <CardHeader>
                  <CardTitle>Run AML/PEP Screening</CardTitle>
                  <CardDescription>
                    Screen individuals or businesses against global sanctions lists, PEP databases, and adverse media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Screening Type Toggle */}
                  <div className="flex gap-4">
                    <Button
                      variant=  {screeningType === 'individual' ? 'outline' : 'default'}
                      onClick={() => setScreeningType('individual')}
                      className="flex-1"
                      data-testid="button-type-individual"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Individual
                    </Button>
                    <Button
                      variant={screeningType === 'business' ? 'outline' : 'default'}
                      onClick={() => setScreeningType('business')}
                      className="flex-1"
                      data-testid="button-type-business"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Business
                    </Button>
                  </div>

                  {screeningType === 'individual' ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="e.g., John"
                            data-testid="input-first-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="e.g., Smith"
                            data-testid="input-last-name"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input
                            id="dob"
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            data-testid="input-dob"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality</Label>
                          <Select value={nationality} onValueChange={setNationality}>
                            <SelectTrigger data-testid="select-nationality">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g., Acme Corporation Ltd"
                          data-testid="input-business-name"
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="regNumber">Registration Number</Label>
                          <Input
                            id="regNumber"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                            placeholder="e.g., 12345678"
                            data-testid="input-reg-number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="regCountry">Country of Registration</Label>
                          <Select value={registrationCountry} onValueChange={setRegistrationCountry}>
                            <SelectTrigger data-testid="select-reg-country">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map(c => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {isScreening && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Screening in progress...</span>
                        <span>{screeningProgress}%</span>
                      </div>
                      <Progress value={screeningProgress} className="h-2" />
                    </div>
                  )}

                  <Button
                    onClick={runScreening}
                    disabled={isScreening || (screeningType === 'individual' ? !firstName || !lastName : !businessName)}
                    className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90 disabled:opacity-50"
                    data-testid="button-run-screening"
                  >
                    {isScreening ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Screening...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-white text-sm">Run AML/PEP Screening</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Screening Coverage Info */}
              <Card className="bg-[#fcfcfc] border border-[#e4e4e4] rounded-[20px]">
                <CardHeader>
                  <CardTitle className="text-lg">Screening Coverage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Global Sanctions Lists</h4>
                        <p className="text-xs text-gray-500">OFAC, EU, UN, HMT + 200 more</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">PEP Databases</h4>
                        <p className="text-xs text-gray-500">2M+ politically exposed persons</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Adverse Media</h4>
                        <p className="text-xs text-gray-500">Real-time news & media screening</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Flag className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Watchlists</h4>
                        <p className="text-xs text-gray-500">Law enforcement & regulatory lists</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="font-medium text-blue-900 text-sm mb-1">Real-Time Updates</h4>
                    <p className="text-xs text-blue-700">
                      Our databases are updated every 15 minutes with the latest sanctions and PEP data
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results History Tab */}
          <TabsContent value="results">
            <Card className="bg-[#fcfcfc] border border-[#e4e4e4] rounded-[20px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Screening Results</CardTitle>
                    <CardDescription>View and manage all screening results</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid="button-export-results">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-filter-results">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name/Entity</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>PEP</TableHead>
                      <TableHead>Sanctions</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screeningResults.map((result) => (
                      <TableRow key={result.id} data-testid={`row-result-${result.id}`}>
                        <TableCell className="font-mono text-xs">{result.id}</TableCell>
                        <TableCell className="font-medium">{result.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {result.type === 'individual' ? <User className="h-3 w-3 mr-1" /> : <Building2 className="h-3 w-3 mr-1" />}
                            {result.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">{result.screeningDate}</TableCell>
                        <TableCell>{getStatusBadge(result.status)}</TableCell>
                        <TableCell>
                          {result.pepStatus ? (
                            <Badge variant="destructive" className="text-xs">PEP</Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {result.sanctionsMatch ? (
                            <Badge variant="destructive" className="text-xs">Match</Badge>
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`font-semibold ${getRiskColor(result.riskScore)}`}>
                            {result.riskScore}/100
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" data-testid={`button-view-${result.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ongoing Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-[#fcfcfc] border border-[#e4e4e4] rounded-[20px]">
                <CardHeader>
                  <CardTitle>Ongoing Monitoring</CardTitle>
                  <CardDescription>
                    Continuously monitor entities for changes in sanctions, PEP status, and adverse media
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="h-6 w-6 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-900">Monitoring Active</h4>
                          <p className="text-sm text-green-700">{stats.entitiesMonitored.toLocaleString()} entities under continuous monitoring</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500">Live</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Users className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium">Individuals Monitored</h4>
                        </div>
                        <p className="text-3xl font-bold">892</p>
                        <p className="text-sm text-gray-500">+23 added this month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Building2 className="h-5 w-5 text-purple-600" />
                          <h4 className="font-medium">Businesses Monitored</h4>
                        </div>
                        <p className="text-3xl font-bold">355</p>
                        <p className="text-sm text-gray-500">+8 added this month</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Monitoring Schedule</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <span>Sanctions List Updates</span>
                        </div>
                        <Badge variant="outline">Every 15 min</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5 text-purple-600" />
                          <span>PEP Database Refresh</span>
                        </div>
                        <Badge variant="outline">Daily</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600" />
                          <span>Adverse Media Scan</span>
                        </div>
                        <Badge variant="outline">Every 6 hours</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <span>Risk Score Recalculation</span>
                        </div>
                        <Badge variant="outline">Weekly</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fcfcfc] border border-[#e4e4e4] rounded-[20px]">
                <CardHeader>
                  <CardTitle className="text-lg">Add to Monitoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Automatically monitor screened entities for ongoing changes
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-add-individual">
                      <User className="h-4 w-4 mr-2" />
                      Add Individual
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-add-business">
                      <Building2 className="h-4 w-4 mr-2" />
                      Add Business
                    </Button>
                    <Button variant="outline" className="w-full justify-start" data-testid="button-bulk-upload">
                      <FileText className="h-4 w-4 mr-2" />
                      Bulk Upload (CSV)
                    </Button>
                  </div>

                  <Separator />

                  <div className="bg-amber-50 rounded-lg p-3">
                    <h4 className="font-medium text-amber-900 text-sm mb-1">Pricing</h4>
                    <p className="text-xs text-amber-700">
                      £0.05 per entity/month for ongoing monitoring
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card className="bg-[#fcfcfc] border border-[#e4e4e4] rounded-[20px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Monitoring Alerts</CardTitle>
                    <CardDescription>Review and action alerts from ongoing monitoring</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" data-testid="button-mark-all-read">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark All Read
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoringAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`border rounded-lg p-4 ${alert.severity === 'critical' ? 'border-red-300 bg-red-50' : ''}`}
                      data-testid={`alert-${alert.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {alert.entityType === 'individual' ? (
                            <User className="h-5 w-5 text-gray-600 mt-1" />
                          ) : (
                            <Building2 className="h-5 w-5 text-gray-600 mt-1" />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{alert.entityName}</h4>
                              {getSeverityBadge(alert.severity)}
                              {getAlertStatusBadge(alert.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(alert.dateDetected).toLocaleDateString()}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {alert.alertType.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" data-testid={`button-review-${alert.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" data-testid={`button-action-${alert.id}`}>
                            Take Action
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Compliance Info */}
        <Card className="mt-8 bg-[#e8f5e9] border border-[#27ae60] rounded-[20px]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-[#27ae60]" />
                <div>
                  <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">FATF Compliant</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Meets international AML standards</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-6 w-6 text-[#436cc8]" />
                <div>
                  <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">240+ Countries</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Global sanctions coverage</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-6 w-6 text-[#27ae60]" />
                <div>
                  <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Real-Time</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Updates every 15 minutes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-6 w-6 text-amber-600" />
                <div>
                  <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Audit Trail</h4>
                  <p className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Complete screening history</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      <Footer />
    </main>
  );
}
