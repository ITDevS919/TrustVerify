import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Scale, 
  Play, 
  Settings, 
  History, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Zap,
  BarChart3,
  Shield,
  Eye,
  Filter
} from "lucide-react";

type DecisionOutcome = "approved" | "approved_with_conditions" | "edd_required" | "manual_review" | "rejected" | "pending";

interface DecisionRule {
  id: number;
  name: string;
  category: string;
  priority: number;
  action: string;
  isActive: boolean;
  description?: string;
}

interface DecisionLog {
  id: number;
  entityId: string;
  entityType: string;
  decision: DecisionOutcome;
  decisionReason: string;
  riskScore: number;
  confidenceScore: number;
  decidedAt: string;
  isAutomated: boolean;
}

const mockRules: DecisionRule[] = [
  { id: 1, name: "Sanctions Match - Auto Reject", category: "aml", priority: 10, action: "rejected", isActive: true, description: "Automatically reject if sanctions match found" },
  { id: 2, name: "High Fraud Risk - Reject", category: "fraud", priority: 20, action: "rejected", isActive: true, description: "Reject if fraud risk score exceeds 0.8" },
  { id: 3, name: "PEP Match - EDD Required", category: "aml", priority: 30, action: "edd_required", isActive: true, description: "Require enhanced due diligence for PEPs" },
  { id: 4, name: "Incomplete UBO - EDD Required", category: "kyb", priority: 40, action: "edd_required", isActive: true, description: "Require EDD if beneficial ownership incomplete" },
  { id: 5, name: "High Risk IP - Manual Review", category: "fraud", priority: 50, action: "manual_review", isActive: true, description: "Flag for review if using proxy/VPN" },
  { id: 6, name: "Moderate Fraud Risk - Enhanced Monitoring", category: "fraud", priority: 60, action: "flag", isActive: true, description: "Add monitoring condition for moderate risk" },
  { id: 7, name: "Identity Verified Low Risk - Approve", category: "kyc", priority: 100, action: "approved", isActive: true, description: "Auto-approve if identity verified with low risk" },
];

const mockDecisionLogs: DecisionLog[] = [
  { id: 1, entityId: "USR-001234", entityType: "user", decision: "approved", decisionReason: "All checks passed", riskScore: 0.12, confidenceScore: 0.95, decidedAt: "2025-12-28T10:30:00Z", isAutomated: true },
  { id: 2, entityId: "BUS-005678", entityType: "business", decision: "edd_required", decisionReason: "PEP match detected - requires enhanced review", riskScore: 0.45, confidenceScore: 0.88, decidedAt: "2025-12-28T09:15:00Z", isAutomated: true },
  { id: 3, entityId: "TXN-009012", entityType: "transaction", decision: "manual_review", decisionReason: "High-risk IP detected", riskScore: 0.62, confidenceScore: 0.75, decidedAt: "2025-12-28T08:45:00Z", isAutomated: true },
  { id: 4, entityId: "USR-003456", entityType: "user", decision: "rejected", decisionReason: "Sanctions match: OFAC SDN List", riskScore: 0.98, confidenceScore: 0.99, decidedAt: "2025-12-27T16:20:00Z", isAutomated: true },
  { id: 5, entityId: "BUS-007890", entityType: "business", decision: "approved_with_conditions", decisionReason: "Approved with enhanced monitoring", riskScore: 0.35, confidenceScore: 0.82, decidedAt: "2025-12-27T14:10:00Z", isAutomated: true },
];

const getDecisionBadge = (decision: DecisionOutcome) => {
  switch (decision) {
    case "approved":
      return <Badge className="bg-[#27ae60] text-white hover:bg-[#27ae60] rounded-full"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
    case "approved_with_conditions":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full"><CheckCircle className="h-3 w-3 mr-1" />Approved w/ Conditions</Badge>;
    case "edd_required":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 rounded-full"><Eye className="h-3 w-3 mr-1" />EDD Required</Badge>;
    case "manual_review":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 rounded-full"><Clock className="h-3 w-3 mr-1" />Manual Review</Badge>;
    case "rejected":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-full"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    default:
      return <Badge variant="outline" className="rounded-full"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  }
};

const getRiskColor = (score: number) => {
  if (score < 0.3) return "text-green-600";
  if (score < 0.5) return "text-yellow-600";
  if (score < 0.7) return "text-orange-600";
  return "text-red-600";
};

export default function DecisionEngineDashboard() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [testEntityId, setTestEntityId] = useState("");
  const [isEvaluating, setIsEvaluating] = useState(false);

  const stats = {
    totalDecisions: 1247,
    autoApproved: 892,
    eddRequired: 198,
    manualReview: 112,
    rejected: 45,
    avgProcessingTime: "1.2s"
  };

  const handleTestEvaluate = async () => {
    setIsEvaluating(true);
    // Simulate API call
    setTimeout(() => {
      setIsEvaluating(false);
    }, 2000);
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-3">
                <Scale className="h-8 w-8 text-[#27ae60]" />
                Decision Engine
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
                Configure rules, evaluate entities, and review decision history
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => setSelectedTab("rules")}
                data-testid="button-configure-rules"
                className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Configure Rules</span>
              </Button>
              <Button 
                className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                onClick={() => setSelectedTab("test")}
                data-testid="button-run-evaluation"
              >
                <Play className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Run Evaluation</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{stats.totalDecisions.toLocaleString()}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Total Decisions</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-green-200">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">{stats.autoApproved}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60]">Auto Approved</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-yellow-200">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-yellow-700">{stats.eddRequired}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-yellow-600">EDD Required</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-orange-200">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-orange-700">{stats.manualReview}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-orange-600">Manual Review</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-700">{stats.rejected}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-red-600">Rejected</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{stats.avgProcessingTime}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Avg Processing</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <Settings className="h-4 w-4" />
                Rules ({mockRules.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <History className="h-4 w-4" />
                Decision History
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <Zap className="h-4 w-4" />
                Test Evaluation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Decision Distribution (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                          <span>Approved</span>
                          <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">71.5%</span>
                        </div>
                        <Progress value={71.5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                          <span>EDD Required</span>
                          <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">15.9%</span>
                        </div>
                        <Progress value={15.9} className="h-2 [&>div]:bg-yellow-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                          <span>Manual Review</span>
                          <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">9.0%</span>
                        </div>
                        <Progress value={9} className="h-2 [&>div]:bg-orange-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                          <span>Rejected</span>
                          <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">3.6%</span>
                        </div>
                        <Progress value={3.6} className="h-2 [&>div]:bg-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Recent Decisions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockDecisionLogs.slice(0, 4).map(log => (
                        <div key={log.id} className="flex items-center justify-between p-2 bg-[#f6f6f6] rounded-lg border border-[#e4e4e4]">
                          <div>
                            <div className="font-medium text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{log.entityId}</div>
                            <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{log.entityType}</div>
                          </div>
                          {getDecisionBadge(log.decision)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rules">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Decision Rules</CardTitle>
                    <Button size="sm" className="h-[35px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Add Rule</span>
                    </Button>
                  </div>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Rules are evaluated in priority order. Lower priority numbers execute first.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Priority</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Rule Name</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Category</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Action</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockRules.map(rule => (
                        <TableRow key={rule.id}>
                          <TableCell>
                            <Badge variant="outline" className="rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{rule.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{rule.name}</div>
                            <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{rule.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="rounded-full [font-family:'DM_Sans_18pt-Regular',Helvetica]">{rule.category.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            {getDecisionBadge(rule.action as DecisionOutcome)}
                          </TableCell>
                          <TableCell>
                            {rule.isActive ? (
                              <Badge className="bg-[#27ae60] text-white rounded-full">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="rounded-full">Inactive</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Decision History</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-[35px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]">
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Filter</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-[35px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Export</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Entity</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Type</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Decision</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Score</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Confidence</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Date</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDecisionLogs.map(log => (
                        <TableRow key={log.id} className="cursor-pointer hover:bg-[#f6f6f6]">
                          <TableCell className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{log.entityId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{log.entityType}</Badge>
                          </TableCell>
                          <TableCell>{getDecisionBadge(log.decision)}</TableCell>
                          <TableCell>
                            <span className={`font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] ${getRiskColor(log.riskScore)}`}>
                              {(log.riskScore * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                          <TableCell className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{(log.confidenceScore * 100).toFixed(0)}%</TableCell>
                          <TableCell className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {new Date(log.decidedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {log.isAutomated ? (
                              <Badge variant="secondary" className="rounded-full"><Zap className="h-3 w-3 mr-1" />Auto</Badge>
                            ) : (
                              <Badge variant="outline" className="rounded-full">Manual</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="test">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Test Evaluation</CardTitle>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                      Run a test evaluation against the decision engine with sample signals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Entity ID</Label>
                      <Input 
                        placeholder="e.g., USR-123456" 
                        value={testEntityId}
                        onChange={(e) => setTestEntityId(e.target.value)}
                        className="border-[#e4e4e4]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Identity Verified</Label>
                        <select className="w-full h-10 px-3 border border-[#e4e4e4] rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          <option value="true">Yes</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div>
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Identity Confidence</Label>
                        <Input type="number" placeholder="0.95" min="0" max="1" step="0.01" className="border-[#e4e4e4]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Sanctions Match</Label>
                        <select className="w-full h-10 px-3 border border-[#e4e4e4] rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                      <div>
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">PEP Match</Label>
                        <select className="w-full h-10 px-3 border border-[#e4e4e4] rounded-md [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Fraud Risk Score</Label>
                        <Input type="number" placeholder="0.15" min="0" max="1" step="0.01" className="border-[#e4e4e4]" />
                      </div>
                      <div>
                        <Label className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">IP Risk Score</Label>
                        <Input type="number" placeholder="0.10" min="0" max="1" step="0.01" className="border-[#e4e4e4]" />
                      </div>
                    </div>

                    <Button 
                      className="w-full h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                      onClick={handleTestEvaluate}
                      disabled={isEvaluating}
                    >
                      {isEvaluating ? (
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Evaluating...</span>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Run Evaluation</span>
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Evaluation Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Scale className="h-12 w-12 mx-auto mb-4 opacity-30 text-[#808080]" />
                      <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Configure signals and run evaluation to see results</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </main>
  );
}
