import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Filter,
  Search,
  Eye,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Calendar,
  BarChart3,
  Inbox
} from "lucide-react";

type CaseStatus = "open" | "assigned" | "in_progress" | "pending_info" | "resolved" | "closed";
type CasePriority = "low" | "medium" | "high" | "critical";

interface ComplianceCase {
  id: number;
  caseNumber: string;
  entityId: string;
  entityType: string;
  entityName: string;
  caseType: string;
  priority: CasePriority;
  status: CaseStatus;
  assignedTo?: string;
  assignedTeam: string;
  summary: string;
  slaDueAt: string;
  slaBreached: boolean;
  createdAt: string;
}

const mockCases: ComplianceCase[] = [
  { id: 1, caseNumber: "CASE-2025-001234", entityId: "BUS-005678", entityType: "business", entityName: "Acme Trading Ltd", caseType: "edd", priority: "high", status: "in_progress", assignedTo: "John Smith", assignedTeam: "compliance_team", summary: "PEP match detected - CEO is a politically exposed person", slaDueAt: "2025-12-29T10:00:00Z", slaBreached: false, createdAt: "2025-12-28T09:15:00Z" },
  { id: 2, caseNumber: "CASE-2025-001233", entityId: "USR-003456", entityType: "user", entityName: "Robert Johnson", caseType: "onboarding_review", priority: "critical", status: "open", assignedTeam: "aml_team", summary: "Potential sanctions match - requires immediate review", slaDueAt: "2025-12-28T14:00:00Z", slaBreached: true, createdAt: "2025-12-27T16:20:00Z" },
  { id: 3, caseNumber: "CASE-2025-001232", entityId: "TXN-009012", entityType: "transaction", entityName: "Wire Transfer #9012", caseType: "alert_investigation", priority: "medium", status: "assigned", assignedTo: "Sarah Chen", assignedTeam: "fraud_team", summary: "High-risk IP address detected during transaction", slaDueAt: "2025-12-30T16:00:00Z", slaBreached: false, createdAt: "2025-12-28T08:45:00Z" },
  { id: 4, caseNumber: "CASE-2025-001231", entityId: "BUS-007890", entityType: "business", entityName: "Global Investments Inc", caseType: "periodic_review", priority: "low", status: "pending_info", assignedTo: "Mike Williams", assignedTeam: "compliance_team", summary: "Annual periodic review - awaiting updated documents", slaDueAt: "2025-12-31T17:00:00Z", slaBreached: false, createdAt: "2025-12-26T11:30:00Z" },
  { id: 5, caseNumber: "CASE-2025-001230", entityId: "USR-001234", entityType: "user", entityName: "Alice Brown", caseType: "edd", priority: "medium", status: "resolved", assignedTo: "John Smith", assignedTeam: "compliance_team", summary: "Enhanced due diligence completed - moderate risk accepted", slaDueAt: "2025-12-27T12:00:00Z", slaBreached: false, createdAt: "2025-12-25T14:00:00Z" },
];

const getStatusBadge = (status: CaseStatus) => {
  switch (status) {
    case "open":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full"><Inbox className="h-3 w-3 mr-1" />Open</Badge>;
    case "assigned":
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 rounded-full"><UserPlus className="h-3 w-3 mr-1" />Assigned</Badge>;
    case "in_progress":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 rounded-full"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
    case "pending_info":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 rounded-full"><MessageSquare className="h-3 w-3 mr-1" />Pending Info</Badge>;
    case "resolved":
      return <Badge className="bg-[#27ae60] text-white hover:bg-[#27ae60] rounded-full"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
    case "closed":
      return <Badge variant="secondary" className="rounded-full"><XCircle className="h-3 w-3 mr-1" />Closed</Badge>;
    default:
      return <Badge variant="outline" className="rounded-full">{status}</Badge>;
  }
};

const getPriorityBadge = (priority: CasePriority) => {
  switch (priority) {
    case "critical":
      return <Badge className="bg-red-600 text-white rounded-full">Critical</Badge>;
    case "high":
      return <Badge className="bg-red-100 text-red-700 rounded-full">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-700 rounded-full">Medium</Badge>;
    case "low":
      return <Badge className="bg-gray-100 text-gray-700 rounded-full">Low</Badge>;
  }
};

export default function CaseManagementDashboard() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCase, setSelectedCase] = useState<ComplianceCase | null>(null);

  const stats = {
    totalOpen: mockCases.filter(c => c.status !== "resolved" && c.status !== "closed").length,
    critical: mockCases.filter(c => c.priority === "critical" && c.status !== "resolved").length,
    slaBreached: mockCases.filter(c => c.slaBreached).length,
    resolvedToday: 8,
    avgResolutionTime: "18.5 hrs"
  };

  const filteredCases = mockCases.filter(c => {
    if (selectedTab === "open") return c.status !== "resolved" && c.status !== "closed";
    if (selectedTab === "my") return c.assignedTo === "John Smith";
    if (selectedTab === "critical") return c.priority === "critical" || c.priority === "high";
    return true;
  });

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-3">
                <Users className="h-8 w-8 text-[#27ae60]" />
                Case Management
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
                Review and manage compliance cases requiring human oversight
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Reports</span>
              </Button>
              <Button className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                <FileText className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Create Case</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{stats.totalOpen}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Open Cases</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-red-200">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-red-700">{stats.critical}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-red-600">Critical Priority</div>
              </CardContent>
            </Card>
            <Card className={`bg-[#fcfcfc] rounded-[20px] border ${stats.slaBreached > 0 ? "border-orange-200" : "border-[#e4e4e4]"}`}>
              <CardContent className="pt-4">
                <div className={`text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] ${stats.slaBreached > 0 ? "text-orange-700" : "text-[#003d2b]"}`}>
                  {stats.slaBreached}
                </div>
                <div className={`text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] ${stats.slaBreached > 0 ? "text-orange-600" : "text-[#808080]"}`}>SLA Breached</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-green-200">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">{stats.resolvedToday}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60]">Resolved Today</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{stats.avgResolutionTime}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Avg Resolution</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 w-full">
            <div className="md:col-span-2">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Cases</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#808080]" />
                        <Input 
                          placeholder="Search cases..." 
                          className="pl-9 w-64 border-[#e4e4e4]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="sm" className="border-[#e4e4e4] hover:bg-[#f6f6f6]">
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Filter</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="mb-4 bg-gray-200 rounded-lg p-1">
                      <TabsTrigger value="all" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">All Cases</TabsTrigger>
                      <TabsTrigger value="open" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Open</TabsTrigger>
                      <TabsTrigger value="my" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">My Cases</TabsTrigger>
                      <TabsTrigger value="critical" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Critical</TabsTrigger>
                    </TabsList>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Case</TableHead>
                          <TableHead>Entity</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>SLA</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCases.map(c => (
                          <TableRow 
                            key={c.id} 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => setSelectedCase(c)}
                          >
                            <TableCell>
                              <div className="font-medium text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{c.caseNumber}</div>
                              <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{c.assignedTeam}</div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{c.entityName}</div>
                              <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{c.entityId}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{c.caseType.replace("_", " ")}</Badge>
                            </TableCell>
                            <TableCell>{getPriorityBadge(c.priority)}</TableCell>
                            <TableCell>{getStatusBadge(c.status)}</TableCell>
                            <TableCell>
                              {c.slaBreached ? (
                                <span className="text-red-600 font-medium text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Breached
                                </span>
                              ) : (
                                <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                                  {new Date(c.slaDueAt).toLocaleDateString()}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              {selectedCase ? (
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">{selectedCase.caseNumber}</CardTitle>
                      {getPriorityBadge(selectedCase.priority)}
                    </div>
                    <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{selectedCase.entityName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Status</div>
                      <div className="mt-1">{getStatusBadge(selectedCase.status)}</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Summary</div>
                      <p className="text-sm mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{selectedCase.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Assigned To</div>
                        <div className="text-sm mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{selectedCase.assignedTo || "Unassigned"}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">Team</div>
                        <div className="text-sm mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">{selectedCase.assignedTeam.replace("_", " ")}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080]">SLA Due</div>
                      <div className={`text-sm mt-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] ${selectedCase.slaBreached ? "text-red-600 font-medium" : "text-[#003d2b]"}`}>
                        {new Date(selectedCase.slaDueAt).toLocaleString()}
                        {selectedCase.slaBreached && " (BREACHED)"}
                      </div>
                    </div>

                    <div className="border-t border-[#e4e4e4] pt-4">
                      <div className="text-sm font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#808080] mb-2">Add Note</div>
                      <Textarea placeholder="Enter case note..." className="mb-2 border-[#e4e4e4]" />
                      <Button size="sm" className="w-full h-[35px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Add Note</span>
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1 h-[40px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Approve</span>
                      </Button>
                      <Button variant="destructive" className="flex-1 h-[40px] rounded-lg">
                        <XCircle className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Reject</span>
                      </Button>
                    </div>

                    <Button variant="outline" className="w-full h-[40px] rounded-lg border-[#e4e4e4] hover:bg-[#f6f6f6]">
                      <Eye className="h-4 w-4 mr-2" />
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-[#003d2b]">View Full Details</span>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-30 text-[#808080]" />
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Select a case to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
