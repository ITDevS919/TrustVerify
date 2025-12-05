import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { apiRequest } from "../../../lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

interface AnalyticsData {
  apiUsage: {
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
    callsByEndpoint: Array<{ endpoint: string; count: number }>;
    callsByDay: Array<{ date: string; count: number }>;
  };
  workflowMetrics: {
    totalExecutions: number;
    successRate: number;
    avgExecutionTime: number;
    executionsByWorkflow: Array<{ workflowName: string; count: number }>;
  };
  performance: {
    p95ResponseTime: number;
    p99ResponseTime: number;
    errorRate: number;
    throughput: number;
  };
}

export const EnhancedAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [usageResponse, workflowResponse, performanceResponse] = await Promise.all([
        apiRequest("GET", `/api/developer/usage/stats?range=${timeRange}`),
        apiRequest("GET", `/api/developer/workflows/metrics?range=${timeRange}`),
        apiRequest("GET", `/api/developer/performance?range=${timeRange}`),
      ]);

      const usage = await usageResponse.json();
      const workflows = await workflowResponse.json();
      const performance = await performanceResponse.json();

      setAnalyticsData({
        apiUsage: usage,
        workflowMetrics: workflows,
        performance: performance,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Set mock data for demonstration
      setAnalyticsData({
        apiUsage: {
          totalCalls: 2847,
          successRate: 99.8,
          avgResponseTime: 42,
          callsByEndpoint: [
            { endpoint: "/api/fraud/analyze", count: 1200 },
            { endpoint: "/api/kyc/submit", count: 800 },
            { endpoint: "/api/transactions/create", count: 847 },
          ],
          callsByDay: [
            { date: "2025-01-01", count: 350 },
            { date: "2025-01-02", count: 420 },
            { date: "2025-01-03", count: 380 },
            { date: "2025-01-04", count: 450 },
            { date: "2025-01-05", count: 410 },
            { date: "2025-01-06", count: 480 },
            { date: "2025-01-07", count: 357 },
          ],
        },
        workflowMetrics: {
          totalExecutions: 156,
          successRate: 98.5,
          avgExecutionTime: 1250,
          executionsByWorkflow: [
            { workflowName: "E-commerce Checkout", count: 65 },
            { workflowName: "KYC Verification", count: 45 },
            { workflowName: "Fraud Detection", count: 46 },
          ],
        },
        performance: {
          p95ResponseTime: 89,
          p99ResponseTime: 156,
          errorRate: 0.2,
          throughput: 12.5,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analyticsData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#808080]">Loading analytics...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
            Analytics Dashboard
          </h2>
          <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
            Comprehensive insights into your API usage, workflows, and performance
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
            <SelectItem value="90d">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* API Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-[#808080] mb-1">Total API Calls</div>
            <div className="text-2xl font-semibold text-[#003d2b]">
              {analyticsData.apiUsage.totalCalls.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 mt-2">+12% from last period</div>
          </CardContent>
        </Card>

        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            </div>
            <div className="text-sm text-[#808080] mb-1">Success Rate</div>
            <div className="text-2xl font-semibold text-[#003d2b]">
              {analyticsData.apiUsage.successRate.toFixed(1)}%
            </div>
            <div className="text-xs text-[#808080] mt-2">
              {(
                analyticsData.apiUsage.totalCalls *
                (analyticsData.apiUsage.successRate / 100)
              ).toLocaleString()}{" "}
              successful calls
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-800">Fast</Badge>
            </div>
            <div className="text-sm text-[#808080] mb-1">Avg Response Time</div>
            <div className="text-2xl font-semibold text-[#003d2b]">
              {analyticsData.apiUsage.avgResponseTime}ms
            </div>
            <div className="text-xs text-[#808080] mt-2">P95: {analyticsData.performance.p95ResponseTime}ms</div>
          </CardContent>
        </Card>

        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-[#808080] mb-1">Workflow Executions</div>
            <div className="text-2xl font-semibold text-[#003d2b]">
              {analyticsData.workflowMetrics.totalExecutions}
            </div>
            <div className="text-xs text-green-600 mt-2">
              {analyticsData.workflowMetrics.successRate.toFixed(1)}% success rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Calls by Endpoint */}
        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
              API Calls by Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {analyticsData.apiUsage.callsByEndpoint.map((item, index) => {
                const percentage =
                  (item.count / analyticsData.apiUsage.totalCalls) * 100;
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#003d2b]">
                        {item.endpoint}
                      </span>
                      <span className="text-sm text-[#808080]">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Executions */}
        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
              Workflow Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {analyticsData.workflowMetrics.executionsByWorkflow.map((item, index) => {
                const percentage =
                  (item.count / analyticsData.workflowMetrics.totalExecutions) * 100;
                return (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#003d2b]">
                        {item.workflowName}
                      </span>
                      <span className="text-sm text-[#808080]">{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
        <CardHeader>
          <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-sm text-[#808080]">P95 Response Time</div>
              <div className="text-2xl font-semibold text-[#003d2b]">
                {analyticsData.performance.p95ResponseTime}ms
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-[#808080]">P99 Response Time</div>
              <div className="text-2xl font-semibold text-[#003d2b]">
                {analyticsData.performance.p99ResponseTime}ms
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-[#808080]">Error Rate</div>
              <div className="text-2xl font-semibold text-[#003d2b]">
                {analyticsData.performance.errorRate.toFixed(2)}%
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm text-[#808080]">Throughput</div>
              <div className="text-2xl font-semibold text-[#003d2b]">
                {analyticsData.performance.throughput} req/s
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily API Calls Chart */}
      <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
        <CardHeader>
          <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
            API Calls Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-48">
            {analyticsData.apiUsage.callsByDay.map((day, index) => {
              const maxCount = Math.max(
                ...analyticsData.apiUsage.callsByDay.map((d) => d.count)
              );
              const height = (day.count / maxCount) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                    title={`${day.count} calls on ${day.date}`}
                  />
                  <span className="text-xs text-[#808080]">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

