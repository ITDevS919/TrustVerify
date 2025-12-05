import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Play, Copy, CheckCircle2, AlertCircle } from "lucide-react";

interface ApiEndpoint {
  method: string;
  endpoint: string;
  description: string;
  parameters?: Record<string, any>;
  exampleRequest?: any;
  exampleResponse?: any;
}

const apiEndpoints: ApiEndpoint[] = [
  {
    method: "POST",
    endpoint: "/api/v1/transactions/create",
    description: "Create a new secure transaction",
    parameters: {
      amount: "number (required)",
      currency: "string (required)",
      recipient: "string (required)",
      description: "string (optional)",
      escrow: "boolean (optional)",
    },
    exampleRequest: {
      amount: 1000.00,
      currency: "USD",
      recipient: "user@example.com",
      description: "Service payment",
      escrow: true,
    },
    exampleResponse: {
      id: "txn_123456",
      status: "pending",
      amount: 1000.00,
      currency: "USD",
      createdAt: "2025-01-15T10:00:00Z",
    },
  },
  {
    method: "GET",
    endpoint: "/api/v1/transactions/{id}",
    description: "Get transaction details",
    parameters: {
      id: "string (required) - Transaction ID",
    },
    exampleRequest: null,
    exampleResponse: {
      id: "txn_123456",
      status: "completed",
      amount: 1000.00,
      currency: "USD",
      buyerId: "user_123",
      sellerId: "user_456",
      createdAt: "2025-01-15T10:00:00Z",
      completedAt: "2025-01-15T10:05:00Z",
    },
  },
  {
    method: "POST",
    endpoint: "/api/v1/fraud/check",
    description: "Perform fraud analysis on transaction data",
    parameters: {
      transactionId: "string (required)",
      userId: "string (required)",
      ipAddress: "string (required)",
      userAgent: "string (optional)",
    },
    exampleRequest: {
      transactionId: "txn_123456",
      userId: "user_123",
      ipAddress: "192.168.1.1",
      userAgent: "Mozilla/5.0...",
    },
    exampleResponse: {
      riskScore: 23,
      riskLevel: "low",
      fraudProbability: 0.08,
      recommendations: ["Allow transaction", "No additional verification required"],
    },
  },
  {
    method: "POST",
    endpoint: "/api/v1/kyc/verify",
    description: "Initiate KYC verification process",
    parameters: {
      userId: "string (required)",
      documentType: "string (required)",
      documentData: "string (required) - Base64 encoded document",
    },
    exampleRequest: {
      userId: "user_123",
      documentType: "passport",
      documentData: "base64_encoded_data...",
    },
    exampleResponse: {
      verificationId: "kyc_123456",
      status: "pending",
      submittedAt: "2025-01-15T10:00:00Z",
    },
  },
];

export const ApiExplorer = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiEndpoints[0]);
  const [requestBody, setRequestBody] = useState<string>("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedEndpoint.exampleRequest) {
      setRequestBody(JSON.stringify(selectedEndpoint.exampleRequest, null, 2));
    } else {
      setRequestBody("");
    }
    setResponse(null);
    setError(null);
  }, [selectedEndpoint]);

  const handleTestRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = selectedEndpoint.endpoint.replace("{id}", "test_id");
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_API_KEY",
        },
      };

      if (selectedEndpoint.method !== "GET" && requestBody) {
        options.body = requestBody;
      }

      // Simulate API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo, return example response
      setResponse(selectedEndpoint.exampleResponse);
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-green-100 text-green-800",
      POST: "bg-blue-100 text-blue-800",
      PUT: "bg-yellow-100 text-yellow-800",
      DELETE: "bg-red-100 text-red-800",
    };
    return colors[method] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2.5">
        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
          API Explorer
        </h2>
        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
          Test API endpoints interactively with real-time request/response
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoint List */}
        <Card className="lg:col-span-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
              Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {apiEndpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedEndpoint.endpoint === endpoint.endpoint
                      ? "bg-app-secondary/10 border-app-secondary"
                      : "bg-white border-[#e4e4e4] hover:border-app-secondary"
                  }`}
                  onClick={() => setSelectedEndpoint(endpoint)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <span className="text-xs text-[#808080] font-mono">
                      {endpoint.endpoint.split("/").pop()}
                    </span>
                  </div>
                  <p className="text-sm text-[#808080] line-clamp-2">
                    {endpoint.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Request Builder */}
        <Card className="lg:col-span-2 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                Request
              </CardTitle>
              <Button
                size="sm"
                onClick={() => copyToClipboard(requestBody)}
                variant="ghost"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getMethodColor(selectedEndpoint.method)}>
                  {selectedEndpoint.method}
                </Badge>
                <span className="font-mono text-sm text-[#003d2b]">
                  {selectedEndpoint.endpoint}
                </span>
              </div>
              <p className="text-sm text-[#808080] mb-4">
                {selectedEndpoint.description}
              </p>
            </div>

            {selectedEndpoint.parameters && (
              <div>
                <Label className="text-sm font-semibold mb-2 block">Parameters</Label>
                <div className="bg-[#f6f6f6] rounded-lg p-3 text-sm">
                  <pre className="text-[#808080]">
                    {Object.entries(selectedEndpoint.parameters).map(([key, value]) => (
                      <div key={key} className="mb-1">
                        <span className="font-semibold text-[#003d2b]">{key}:</span>{" "}
                        <span>{value}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              </div>
            )}

            {selectedEndpoint.method !== "GET" && (
              <div>
                <Label htmlFor="request-body" className="mb-2 block">
                  Request Body
                </Label>
                <Textarea
                  id="request-body"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="font-mono text-sm bg-[#121728] text-[#27ae60]"
                  rows={10}
                  placeholder="Enter JSON request body..."
                />
              </div>
            )}

            <Button
              onClick={handleTestRequest}
              disabled={loading}
              className="w-full bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
            >
              <Play className="w-4 h-4 mr-2" />
              {loading ? "Sending Request..." : "Send Request"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Response */}
      {(response || error) && (
        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                Response
              </CardTitle>
              {response && (
                <Button
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(response, null, 2))}
                  variant="ghost"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : (
              <pre className="bg-[#121728] rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-white">
                  {JSON.stringify(response, null, 2)}
                </code>
              </pre>
            )}
          </CardContent>
        </Card>
      )}

      {/* Example Response */}
      {selectedEndpoint.exampleResponse && !response && !error && (
        <Card className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
              Example Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-[#121728] rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-white">
                {JSON.stringify(selectedEndpoint.exampleResponse, null, 2)}
              </code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

