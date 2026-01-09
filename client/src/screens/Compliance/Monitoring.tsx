import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Eye,
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Settings,
  Filter,
  TrendingUp,
  Shield,
  Users,
  Building2,
  Zap
} from "lucide-react";

type AlertSeverity = "info" | "low" | "medium" | "high" | "critical";
type AlertStatus = "new" | "acknowledged" | "investigating" | "resolved" | "false_positive";

interface MonitoringSchedule {
  id: number;
  entityId: string;
  entityName: string;
  entityType: string;
  frequency: string;
  checkTypes: string[];
  riskTier: string;
  lastCheckAt: string;
  nextCheckAt: string;
  lastResult: string;
  consecutiveClears: number;
  isActive: boolean;
}

interface MonitoringAlert {
  id: number;
  entityId: string;
  entityName: string;
  alertType: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  source: string;
  status: AlertStatus;
  createdAt: string;
}

const mockSchedules: MonitoringSchedule[] = [
  { id: 1, entityId: "BUS-001", entityName: "Acme Trading Ltd", entityType: "business", frequency: "monthly", checkTypes: ["sanctions", "pep", "adverse_media"], riskTier: "enhanced", lastCheckAt: "2025-12-15T10:00:00Z", nextCheckAt: "2026-01-15T10:00:00Z", lastResult: "clear", consecutiveClears: 6, isActive: true },
  { id: 2, entityId: "BUS-002", entityName: "Global Investments Inc", entityType: "business", frequency: "quarterly", checkTypes: ["sanctions", "director_changes"], riskTier: "standard", lastCheckAt: "2025-10-01T10:00:00Z", nextCheckAt: "2026-01-01T10:00:00Z", lastResult: "clear", consecutiveClears: 4, isActive: true },
  { id: 3, entityId: "USR-003", entityName: "Robert Johnson", entityType: "user", frequency: "weekly", checkTypes: ["sanctions", "pep", "adverse_media", "credit_check"], riskTier: "enhanced", lastCheckAt: "2025-12-21T10:00:00Z", nextCheckAt: "2025-12-28T10:00:00Z", lastResult: "alert", consecutiveClears: 0, isActive: true },
  { id: 4, entityId: "BUS-004", entityName: "Tech Ventures LLC", entityType: "business", frequency: "annual", checkTypes: ["sanctions"], riskTier: "low", lastCheckAt: "2025-06-01T10:00:00Z", nextCheckAt: "2026-06-01T10:00:00Z", lastResult: "clear", consecutiveClears: 2, isActive: true },
];

const mockAlerts: MonitoringAlert[] = [
  { id: 1, entityId: "USR-003", entityName: "Robert Johnson", alertType: "adverse_media", severity: "high", title: "Adverse Media Match Detected", description: "New negative news article mentioning the entity in fraud investigation", source: "ComplyAdvantage", status: "new", createdAt: "2025-12-28T08:30:00Z" },
  { id: 2, entityId: "BUS-001", entityName: "Acme Trading Ltd", alertType: "director_change", severity: "medium", title: "Director Change Detected", description: "New director appointed: Jane Wilson (effective 2025-12-20)", source: "Companies House", status: "investigating", createdAt: "2025-12-27T14:15:00Z" },
  { id: 3, entityId: "BUS-005", entityName: "Oceanic Trade Co", alertType: "sanctions_hit", severity: "critical", title: "Sanctions List Match", description: "Entity added to OFAC SDN List", source: "Sanction Scanner", status: "acknowledged", createdAt: "2025-12-26T09:45:00Z" },
  { id: 4, entityId: "USR-007", entityName: "Michael Chen", alertType: "score_degradation", severity: "low", title: "Trust Score Decreased", description: "Trust score dropped from 85 to 72 due to failed verification", source: "TrustVerify", status: "resolved", createdAt: "2025-12-25T11:20:00Z" },
  { id: 5, entityId: "BUS-002", entityName: "Global Investments Inc", alertType: "ownership_change", severity: "medium", title: "UBO Structure Changed", description: "New ultimate beneficial owner identified: Sarah Miller (25%)", source: "Ondato", status: "new", createdAt: "2025-12-28T06:00:00Z" },
];

const getSeverityBadge = (severity: AlertSeverity) => {
  switch (severity) {
    case "critical":
      return <Badge className="bg-red-600 text-white rounded-full">Critical</Badge>;
    case "high":
      return <Badge className="bg-red-100 text-red-700 rounded-full">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-100 text-yellow-700 rounded-full">Medium</Badge>;
    case "low":
      return <Badge className="bg-blue-100 text-blue-700 rounded-full">Low</Badge>;
    case "info":
      return <Badge variant="secondary" className="rounded-full">Info</Badge>;
  }
};

const getStatusBadge = (status: AlertStatus) => {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-100 text-blue-700 rounded-full"><Bell className="h-3 w-3 mr-1" />New</Badge>;
    case "acknowledged":
      return <Badge className="bg-purple-100 text-purple-700 rounded-full"><Eye className="h-3 w-3 mr-1" />Acknowledged</Badge>;
    case "investigating":
      return <Badge className="bg-yellow-100 text-yellow-700 rounded-full"><Clock className="h-3 w-3 mr-1" />Investigating</Badge>;
    case "resolved":
      return <Badge className="bg-[#27ae60] text-white rounded-full"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
    case "false_positive":
      return <Badge variant="outline" className="rounded-full"><XCircle className="h-3 w-3 mr-1" />False Positive</Badge>;
  }
};

const getResultBadge = (result: string) => {
  if (result === "clear") {
    return <Badge className="bg-[#27ae60] text-white rounded-full"><CheckCircle className="h-3 w-3 mr-1" />Clear</Badge>;
  } else if (result === "alert") {
    return <Badge className="bg-red-100 text-red-700 rounded-full"><AlertTriangle className="h-3 w-3 mr-1" />Alert</Badge>;
  }
  return <Badge variant="outline" className="rounded-full">{result}</Badge>;
};

export default function MonitoringDashboard() {
  const [selectedTab, setSelectedTab] = useState("alerts");

  const stats = {
    activeSchedules: mockSchedules.filter(s => s.isActive).length,
    newAlerts: mockAlerts.filter(a => a.status === "new").length,
    criticalAlerts: mockAlerts.filter(a => a.severity === "critical" || a.severity === "high").length,
    checksToday: 47,
    avgClearRate: 94.2
  };

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl flex items-center gap-3">
                <Eye className="h-8 w-8 text-[#27ae60]" />
                Ongoing Monitoring
              </h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mt-1">
                Scheduled re-checks, change detection, and compliance alerts
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-[45px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]">
                <Settings className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Configure Schedules</span>
              </Button>
              <Button className="h-[45px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                <RefreshCw className="h-4 w-4 mr-2" />
                <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Run Check Now</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{stats.activeSchedules}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Active Schedules</div>
              </CardContent>
            </Card>
            <Card className={`bg-[#fcfcfc] rounded-[20px] border ${stats.newAlerts > 0 ? "border-blue-200" : "border-[#e4e4e4]"}`}>
              <CardContent className="pt-4">
                <div className={`text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] ${stats.newAlerts > 0 ? "text-blue-700" : "text-[#003d2b]"}`}>
                  {stats.newAlerts}
                </div>
                <div className={`text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] ${stats.newAlerts > 0 ? "text-blue-600" : "text-[#808080]"}`}>New Alerts</div>
              </CardContent>
            </Card>
            <Card className={`bg-[#fcfcfc] rounded-[20px] border ${stats.criticalAlerts > 0 ? "border-red-200" : "border-[#e4e4e4]"}`}>
              <CardContent className="pt-4">
                <div className={`text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] ${stats.criticalAlerts > 0 ? "text-red-700" : "text-[#003d2b]"}`}>
                  {stats.criticalAlerts}
                </div>
                <div className={`text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] ${stats.criticalAlerts > 0 ? "text-red-600" : "text-[#808080]"}`}>Critical/High</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">{stats.checksToday}</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Checks Today</div>
              </CardContent>
            </Card>
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-green-200">
              <CardContent className="pt-4">
                <div className="text-2xl font-bold [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#27ae60]">{stats.avgClearRate}%</div>
                <div className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60]">Clear Rate</div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6 bg-gray-200 rounded-lg p-1">
              <TabsTrigger value="alerts" className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <Bell className="h-4 w-4" />
                Alerts ({mockAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="schedules" className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <Calendar className="h-4 w-4" />
                Schedules ({mockSchedules.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Monitoring Alerts</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-[35px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]">
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Filter</span>
                      </Button>
                      <Button variant="outline" size="sm" className="h-[35px] rounded-lg border border-[#e4e4e4] hover:bg-[#f6f6f6]">
                        <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">Mark All Read</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Alert</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Entity</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Type</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Severity</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Status</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Source</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAlerts.map(alert => (
                        <TableRow key={alert.id} className="cursor-pointer hover:bg-[#f6f6f6]">
                          <TableCell>
                            <div className="font-medium text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{alert.title}</div>
                            <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] max-w-xs truncate">{alert.description}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{alert.entityName}</div>
                            <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{alert.entityId}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{alert.alertType.replace("_", " ")}</Badge>
                          </TableCell>
                          <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                          <TableCell>{getStatusBadge(alert.status)}</TableCell>
                          <TableCell className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{alert.source}</TableCell>
                          <TableCell className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedules">
              <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Monitoring Schedules</CardTitle>
                    <Button size="sm" className="h-[35px] rounded-lg bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm text-white">Add Schedule</span>
                    </Button>
                  </div>
                  <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                    Scheduled periodic re-checks for ongoing compliance monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Entity</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Frequency</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Check Types</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Risk Tier</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Last Check</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Next Check</TableHead>
                        <TableHead className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSchedules.map(schedule => (
                        <TableRow key={schedule.id}>
                          <TableCell>
                            <div className="font-medium text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">{schedule.entityName}</div>
                            <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{schedule.entityType}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">{schedule.frequency}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {schedule.checkTypes.slice(0, 2).map(type => (
                                <Badge key={type} variant="secondary" className="text-xs rounded-full [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                                  {type.replace("_", " ")}
                                </Badge>
                              ))}
                              {schedule.checkTypes.length > 2 && (
                                <Badge variant="secondary" className="text-xs rounded-full [font-family:'DM_Sans_18pt-Regular',Helvetica]">
                                  +{schedule.checkTypes.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={`rounded-full ${
                                schedule.riskTier === "enhanced" ? "bg-red-100 text-red-700" :
                                schedule.riskTier === "standard" ? "bg-yellow-100 text-yellow-700" :
                                "bg-[#27ae60] text-white"
                              }`}
                            >
                              {schedule.riskTier}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {new Date(schedule.lastCheckAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                            {new Date(schedule.nextCheckAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {getResultBadge(schedule.lastResult)}
                            {schedule.consecutiveClears > 3 && (
                              <span className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#27ae60] ml-1">
                                ({schedule.consecutiveClears} clear)
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Monitoring Coverage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                          <span className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Businesses
                          </span>
                          <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">156 / 180</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Users
                          </span>
                          <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">892 / 1,024</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                          <span className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            High-Risk Entities
                          </span>
                          <span className="font-medium [font-family:'DM_Sans_18pt-Medium',Helvetica]">45 / 45</span>
                        </div>
                        <Progress value={100} className="h-2 [&>div]:bg-[#27ae60]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Alert Trends (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Sanctions Hits</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">2</span>
                          <Badge className="bg-red-100 text-red-700 text-xs rounded-full">+100%</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">PEP Matches</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">5</span>
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs rounded-full">+25%</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Adverse Media</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">12</span>
                          <Badge className="bg-[#27ae60] text-white text-xs rounded-full">-15%</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Director Changes</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">8</span>
                          <Badge variant="outline" className="text-xs rounded-full border-[#e4e4e4] [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">0%</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">Ownership Changes</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold [font-family:'DM_Sans_18pt-Medium',Helvetica] text-[#003d2b]">3</span>
                          <Badge className="bg-[#27ae60] text-white text-xs rounded-full">-40%</Badge>
                        </div>
                      </div>
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
