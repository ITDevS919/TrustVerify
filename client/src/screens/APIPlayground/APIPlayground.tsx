import { useState, useCallback } from "react";
import type { ComponentType } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  Play,
  Copy,
  CheckCircle,
  Code,
  Terminal,
  ChevronRight,
  Settings,
  Zap,
  Shield,
  CreditCard,
  Users,
  FileJson,
  Clock,
  AlertTriangle,
  Globe,
  Key,
  Trash2,
  RotateCcw,
  History,
  Beaker,
  BookOpen,
  Loader2,
  Check,
  X,
  Info
} from "lucide-react";
import { SiNodedotjs, SiPython, SiPhp, SiGo } from "react-icons/si";

interface EndpointConfig {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  name: string;
  description: string;
  category: string;
  categoryIcon: any;
  categoryColor: string;
  headers: { key: string; value: string; required: boolean; description: string }[];
  pathParams: { key: string; description: string; example: string }[];
  queryParams: { key: string; description: string; example: string; required: boolean }[];
  bodySchema: string;
  exampleBody: string;
  exampleResponse: string;
}

interface RequestHistoryItem {
  id: string;
  timestamp: Date;
  method: string;
  path: string;
  status: number;
  duration: number;
  success: boolean;
}

const endpoints: EndpointConfig[] = [
  {
    id: "verify-identity",
    method: "POST",
    path: "/api/verify/identity",
    name: "Verify Identity",
    description: "Verify user identity using personal information and documents",
    category: "Identity Verification",
    categoryIcon: Users,
    categoryColor: "blue",
    headers: [
      { key: "Authorization", value: "Bearer {api_key}", required: true, description: "Your API key" },
      { key: "Content-Type", value: "application/json", required: true, description: "Request content type" },
      { key: "X-Request-ID", value: "", required: false, description: "Unique request identifier for tracing" }
    ],
    pathParams: [],
    queryParams: [],
    bodySchema: `{
  "firstName": "string (required)",
  "lastName": "string (required)", 
  "dateOfBirth": "string (YYYY-MM-DD, required)",
  "email": "string (valid email, required)",
  "phone": "string (E.164 format, optional)",
  "address": {
    "street": "string",
    "city": "string",
    "postcode": "string",
    "country": "string (ISO 3166-1 alpha-2)"
  },
  "documentType": "passport | driving_licence | national_id",
  "documentNumber": "string"
}`,
    exampleBody: `{
  "firstName": "John",
  "lastName": "Smith",
  "dateOfBirth": "1990-05-15",
  "email": "john.smith@example.com",
  "phone": "+447700900123",
  "address": {
    "street": "123 High Street",
    "city": "London",
    "postcode": "SW1A 1AA",
    "country": "GB"
  },
  "documentType": "passport",
  "documentNumber": "123456789"
}`,
    exampleResponse: `{
  "success": true,
  "verificationId": "ver_abc123def456",
  "status": "verified",
  "confidence": 0.95,
  "checks": {
    "identity": { "status": "pass", "score": 98 },
    "document": { "status": "pass", "score": 95 },
    "address": { "status": "pass", "score": 92 }
  },
  "riskIndicators": [],
  "timestamp": "2025-12-19T10:30:00Z"
}`
  },
  {
    id: "verify-document",
    method: "POST",
    path: "/api/verify/document",
    name: "Verify Document",
    description: "Validate and authenticate identity documents",
    category: "Identity Verification",
    categoryIcon: Users,
    categoryColor: "blue",
    headers: [
      { key: "Authorization", value: "Bearer {api_key}", required: true, description: "Your API key" },
      { key: "Content-Type", value: "application/json", required: true, description: "Request content type" }
    ],
    pathParams: [],
    queryParams: [],
    bodySchema: `{
  "documentType": "passport | driving_licence | national_id (required)",
  "frontImage": "string (base64 or URL, required)",
  "backImage": "string (base64 or URL, optional for passports)",
  "countryCode": "string (ISO 3166-1 alpha-2, required)",
  "extractData": "boolean (optional, default: true)"
}`,
    exampleBody: `{
  "documentType": "driving_licence",
  "frontImage": "https://example.com/documents/front.jpg",
  "backImage": "https://example.com/documents/back.jpg",
  "countryCode": "GB",
  "extractData": true
}`,
    exampleResponse: `{
  "success": true,
  "documentId": "doc_xyz789abc123",
  "authentic": true,
  "confidence": 0.97,
  "extractedData": {
    "fullName": "JOHN SMITH",
    "dateOfBirth": "1990-05-15",
    "documentNumber": "SMITH905150JN9AB",
    "expiryDate": "2028-05-14",
    "issueDate": "2018-05-15"
  },
  "securityChecks": {
    "hologram": "detected",
    "microprint": "verified",
    "uvFeatures": "present"
  }
}`
  },
  {
    id: "fraud-prevention",
    method: "POST",
    path: "/api/fraud/prevention",
    name: "Fraud Check",
    description: "Perform comprehensive fraud risk assessment on transactions",
    category: "Fraud Prevention",
    categoryIcon: Shield,
    categoryColor: "red",
    headers: [
      { key: "Authorization", value: "Bearer {api_key}", required: true, description: "Your API key" },
      { key: "Content-Type", value: "application/json", required: true, description: "Request content type" }
    ],
    pathParams: [],
    queryParams: [],
    bodySchema: `{
  "transactionId": "string (required)",
  "amount": "number (required, max 1000000000)",
  "currency": "string (ISO 4217, required)",
  "customerEmail": "string (valid email, required)",
  "customerIp": "string (valid IP, required)",
  "deviceFingerprint": "string (max 500 chars, optional)",
  "billingAddress": {
    "street": "string",
    "city": "string",
    "postcode": "string",
    "country": "string"
  },
  "metadata": "object (optional)"
}`,
    exampleBody: `{
  "transactionId": "txn_20251219_001",
  "amount": 299.99,
  "currency": "GBP",
  "customerEmail": "customer@example.com",
  "customerIp": "192.168.1.100",
  "deviceFingerprint": "fp_abc123xyz789",
  "billingAddress": {
    "street": "456 Commerce Lane",
    "city": "Manchester",
    "postcode": "M1 1AA",
    "country": "GB"
  },
  "metadata": {
    "productCategory": "electronics",
    "isNewCustomer": false
  }
}`,
    exampleResponse: `{
  "success": true,
  "checkId": "chk_fraud_123456",
  "riskScore": 15,
  "riskLevel": "low",
  "recommendation": "approve",
  "signals": {
    "velocity": { "risk": "low", "details": "Normal transaction frequency" },
    "geolocation": { "risk": "low", "details": "IP matches billing country" },
    "deviceReputation": { "risk": "low", "details": "Known trusted device" },
    "emailReputation": { "risk": "low", "details": "Verified email domain" }
  },
  "processingTime": 145
}`
  },
  {
    id: "trustscore",
    method: "GET",
    path: "/api/user/trustscore/{userId}",
    name: "Get TrustScore",
    description: "Retrieve the TrustScore for a specific user",
    category: "Risk Intelligence",
    categoryIcon: Zap,
    categoryColor: "purple",
    headers: [
      { key: "Authorization", value: "Bearer {api_key}", required: true, description: "Your API key" }
    ],
    pathParams: [
      { key: "userId", description: "The unique identifier of the user", example: "user_abc123def456" }
    ],
    queryParams: [
      { key: "includeHistory", description: "Include score history", example: "true", required: false },
      { key: "period", description: "History period in days", example: "30", required: false }
    ],
    bodySchema: "",
    exampleBody: "",
    exampleResponse: `{
  "success": true,
  "userId": "user_abc123def456",
  "trustScore": 847,
  "tier": "gold",
  "factors": {
    "identityVerification": 95,
    "transactionHistory": 88,
    "accountAge": 75,
    "behaviourPatterns": 82
  },
  "lastUpdated": "2025-12-19T09:00:00Z",
  "trend": "improving"
}`
  },
  {
    id: "create-transaction",
    method: "POST",
    path: "/api/transactions/create",
    name: "Create Transaction",
    description: "Create a new protected escrow transaction",
    category: "Transactions",
    categoryIcon: CreditCard,
    categoryColor: "green",
    headers: [
      { key: "Authorization", value: "Bearer {api_key}", required: true, description: "Your API key" },
      { key: "Content-Type", value: "application/json", required: true, description: "Request content type" },
      { key: "Idempotency-Key", value: "", required: false, description: "Unique key for idempotent requests" }
    ],
    pathParams: [],
    queryParams: [],
    bodySchema: `{
  "buyerId": "string (required)",
  "sellerId": "string (required)",
  "amount": "number (required)",
  "currency": "string (ISO 4217, required)",
  "description": "string (required)",
  "category": "goods | services | digital | property",
  "deliveryDeadline": "string (ISO 8601, optional)",
  "autoRelease": "boolean (optional)",
  "protectionLevel": "standard | enhanced | premium"
}`,
    exampleBody: `{
  "buyerId": "buyer_john123",
  "sellerId": "seller_shop456",
  "amount": 1500.00,
  "currency": "GBP",
  "description": "MacBook Pro 14-inch M3",
  "category": "goods",
  "deliveryDeadline": "2025-12-26T18:00:00Z",
  "autoRelease": false,
  "protectionLevel": "enhanced"
}`,
    exampleResponse: `{
  "success": true,
  "transactionId": "txn_esc_789xyz123",
  "status": "pending_payment",
  "escrowAmount": 1500.00,
  "currency": "GBP",
  "protectionLevel": "enhanced",
  "fees": {
    "platformFee": 22.50,
    "insuranceFee": 7.50,
    "total": 30.00
  },
  "paymentUrl": "https://pay.trustverify.io/txn_esc_789xyz123",
  "expiresAt": "2025-12-20T10:30:00Z"
}`
  },
  {
    id: "webhook-test",
    method: "POST",
    path: "/api/webhooks/test",
    name: "Test Webhook",
    description: "Send a test webhook event to your configured endpoint",
    category: "Webhooks",
    categoryIcon: Globe,
    categoryColor: "cyan",
    headers: [
      { key: "Authorization", value: "Bearer {api_key}", required: true, description: "Your API key" },
      { key: "Content-Type", value: "application/json", required: true, description: "Request content type" }
    ],
    pathParams: [],
    queryParams: [],
    bodySchema: `{
  "endpointId": "string (required)",
  "eventType": "string (required)",
  "payload": "object (optional, custom test data)"
}`,
    exampleBody: `{
  "endpointId": "wh_endpoint_abc123",
  "eventType": "transaction.completed",
  "payload": {
    "transactionId": "txn_test_123",
    "amount": 500.00,
    "status": "completed"
  }
}`,
    exampleResponse: `{
  "success": true,
  "deliveryId": "del_wh_xyz789",
  "endpoint": "https://yourapp.com/webhooks",
  "responseCode": 200,
  "responseTime": 234,
  "delivered": true
}`
  }
];

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-700 border-green-300",
  POST: "bg-blue-100 text-blue-700 border-blue-300",
  PUT: "bg-amber-100 text-amber-700 border-amber-300",
  PATCH: "bg-purple-100 text-purple-700 border-purple-300",
  DELETE: "bg-red-100 text-red-700 border-red-300"
};

export default function ApiPlayground() {
  const { toast } = useToast();
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointConfig>(endpoints[0]);
  const [environment, setEnvironment] = useState<"sandbox" | "production">("sandbox");
  const [apiKey, setApiKey] = useState("");
  const [requestBody, setRequestBody] = useState(endpoints[0].exampleBody);
  const [pathParamValues, setPathParamValues] = useState<Record<string, string>>({});
  const [queryParamValues, setQueryParamValues] = useState<Record<string, string>>({});
  const [headerValues, setHeaderValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("request");
  const [codeLanguage, setCodeLanguage] = useState("curl");
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const baseUrl = environment === "sandbox" 
    ? "https://sandbox-api.trustverify.co.uk/v1"
    : "https://api.trustverify.co.uk/v1";

  const handleEndpointChange = useCallback((endpointId: string) => {
    const endpoint = endpoints.find(e => e.id === endpointId);
    if (endpoint) {
      setSelectedEndpoint(endpoint);
      setRequestBody(endpoint.exampleBody);
      setPathParamValues({});
      setQueryParamValues({});
      setResponse(null);
      setResponseStatus(null);
      setResponseTime(null);
    }
  }, []);

  const buildRequestUrl = useCallback(() => {
    let path = selectedEndpoint.path;
    
    selectedEndpoint.pathParams.forEach(param => {
      const value = pathParamValues[param.key] || param.example;
      path = path.replace(`{${param.key}}`, value);
    });
    
    const queryString = selectedEndpoint.queryParams
      .filter(param => queryParamValues[param.key])
      .map(param => `${param.key}=${encodeURIComponent(queryParamValues[param.key])}`)
      .join("&");
    
    return `${baseUrl}${path}${queryString ? `?${queryString}` : ""}`;
  }, [selectedEndpoint, pathParamValues, queryParamValues, baseUrl]);

  const executeRequest = async () => {
    if (!apiKey && environment === "production") {
      toast({
        title: "API Key Required",
        description: "Please enter your API key to make production requests.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      let responseData: string;
      let status: number;
      let duration: number;
      let isSuccess: boolean;

      // Build the request URL with path parameters
      let requestPath = selectedEndpoint.path;
      selectedEndpoint.pathParams.forEach(param => {
        const value = pathParamValues[param.key] || param.example;
        requestPath = requestPath.replace(`{${param.key}}`, value);
      });
      
      const queryString = selectedEndpoint.queryParams
        .filter(param => queryParamValues[param.key])
        .map(param => `${param.key}=${encodeURIComponent(queryParamValues[param.key])}`)
        .join("&");
      
      const fullRequestUrl = `${baseUrl}${requestPath}${queryString ? `?${queryString}` : ""}`;
      const localPath = `${requestPath}${queryString ? `?${queryString}` : ""}`;

      // Validate JSON body before sending
      if (selectedEndpoint.method !== "GET" && requestBody) {
        try {
          JSON.parse(requestBody);
        } catch (e) {
          toast({
            title: "Invalid JSON",
            description: "Request body is not valid JSON. Please check the syntax.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
      }

      // Build headers including custom user headers
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (apiKey) {
        requestHeaders['Authorization'] = `Bearer ${apiKey}`;
      }
      
      // Add custom header values
      Object.entries(headerValues).forEach(([key, value]) => {
        if (value) {
          requestHeaders[key] = value;
        }
      });

      // Check if this is a local endpoint we can call directly
      const isLocalEndpoint = selectedEndpoint.path.startsWith('/api/');
      
      if (isLocalEndpoint) {
        // Attempt real API call to local server
        try {
          const fetchOptions: RequestInit = {
            method: selectedEndpoint.method,
            headers: requestHeaders,
            credentials: 'include'
          };

          if (selectedEndpoint.method !== "GET" && requestBody) {
            fetchOptions.body = requestBody;
          }

          const response = await fetch(localPath, fetchOptions);
          duration = Date.now() - startTime;
          status = response.status;
          isSuccess = response.ok;
          
          try {
            const data = await response.json();
            responseData = JSON.stringify(data, null, 2);
          } catch {
            const text = await response.text();
            responseData = text || `HTTP ${status}`;
          }
          
          if (!response.ok) {
            toast({
              title: `Request Failed (${status})`,
              description: `${selectedEndpoint.method} ${selectedEndpoint.path} returned an error`,
              variant: "destructive"
            });
          } else {
            toast({
              title: "Request Successful",
              description: `${selectedEndpoint.method} ${selectedEndpoint.path} completed in ${duration}ms`
            });
          }
        } catch (fetchError) {
          // Network error or endpoint not available - fall back to simulated response
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
          duration = Date.now() - startTime;
          status = 200;
          isSuccess = true;
          responseData = selectedEndpoint.exampleResponse;
          
          toast({
            title: "Simulated Response",
            description: "Using simulated response (API endpoint not available)",
          });
        }
      } else {
        // External API - show simulated response with display URL
        // In a production playground, this would use a backend proxy to make the actual call
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
        duration = Date.now() - startTime;
        status = 200;
        isSuccess = true;
        responseData = selectedEndpoint.exampleResponse;
        
        toast({
          title: environment === "sandbox" ? "Sandbox Mode" : "Simulated Response",
          description: `Request would be sent to: ${fullRequestUrl}`,
        });
      }
      
      setResponse(responseData);
      setResponseStatus(status);
      setResponseTime(duration);
      
      const historyItem: RequestHistoryItem = {
        id: `req_${Date.now()}`,
        timestamp: new Date(),
        method: selectedEndpoint.method,
        path: selectedEndpoint.path,
        status: status,
        duration,
        success: isSuccess
      };
      
      setRequestHistory(prev => [historyItem, ...prev.slice(0, 19)]);
      setActiveTab("response");
    } catch (error) {
      const duration = Date.now() - startTime;
      setResponse(JSON.stringify({ error: "Request failed", message: String(error) }, null, 2));
      setResponseStatus(500);
      setResponseTime(duration);
      
      const historyItem: RequestHistoryItem = {
        id: `req_${Date.now()}`,
        timestamp: new Date(),
        method: selectedEndpoint.method,
        path: selectedEndpoint.path,
        status: 500,
        duration,
        success: false
      };
      
      setRequestHistory(prev => [historyItem, ...prev.slice(0, 19)]);
      setActiveTab("response");
      
      toast({
        title: "Request Failed",
        description: String(error),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Copied",
      description: "Code copied to clipboard"
    });
  };

  const generateCodeSnippet = useCallback(() => {
    const url = buildRequestUrl();
    const hasBody = selectedEndpoint.method !== "GET" && requestBody;

    switch (codeLanguage) {
      case "curl":
        return `curl -X ${selectedEndpoint.method} "${url}" \\
  -H "Authorization: Bearer ${apiKey || 'your_api_key'}" \\
  -H "Content-Type: application/json"${hasBody ? ` \\
  -d '${requestBody}'` : ""}`;

      case "nodejs":
        return `const response = await fetch('${url}', {
  method: '${selectedEndpoint.method}',
  headers: {
    'Authorization': 'Bearer ${apiKey || 'your_api_key'}',
    'Content-Type': 'application/json'
  }${hasBody ? `,
  body: JSON.stringify(${requestBody})` : ""}
});

const data = await response.json();
console.log(data);`;

      case "python":
        return `import requests

response = requests.${selectedEndpoint.method.toLowerCase()}(
    '${url}',
    headers={
        'Authorization': 'Bearer ${apiKey || 'your_api_key'}',
        'Content-Type': 'application/json'
    }${hasBody ? `,
    json=${requestBody.replace(/"/g, "'")}` : ""}
)

print(response.json())`;

      case "php":
        return `<?php
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => '${url}',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => '${selectedEndpoint.method}',
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ${apiKey || 'your_api_key'}',
        'Content-Type: application/json'
    ],${hasBody ? `
    CURLOPT_POSTFIELDS => '${requestBody}'` : ""}
]);

$response = curl_exec($ch);
curl_close($ch);

print_r(json_decode($response, true));`;

      case "go":
        return `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
    "io/ioutil"
)

func main() {
    ${hasBody ? `body := []byte(\`${requestBody}\`)
    req, _ := http.NewRequest("${selectedEndpoint.method}", "${url}", bytes.NewBuffer(body))` : `req, _ := http.NewRequest("${selectedEndpoint.method}", "${url}", nil)`}
    
    req.Header.Set("Authorization", "Bearer ${apiKey || 'your_api_key'}")
    req.Header.Set("Content-Type", "application/json")
    
    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
    
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}`;

      default:
        return "";
    }
  }, [selectedEndpoint, apiKey, requestBody, codeLanguage, buildRequestUrl]);

  const clearHistory = () => {
    setRequestHistory([]);
    toast({
      title: "History Cleared",
      description: "Request history has been cleared"
    });
  };

  const categories = Array.from(new Set(endpoints.map(e => e.category)));

  return (
    <main className="bg-[#f6f6f6] overflow-hidden w-full mx-auto flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-col items-start gap-[30px] w-full max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-[110px] py-20">
        <div className="w-full">
          <div className="flex items-center space-x-2 text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] mb-2">
            <Link to="/developer-portal" className="hover:text-[#27ae60]" data-testid="link-developer-portal">Developer Portal</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#003d2b]">API Playground</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-3xl sm:text-4xl lg:text-5xl">API Playground</h1>
              <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] text-base sm:text-lg lg:text-xl mt-2">
                Test TrustVerify API endpoints interactively. Execute requests and see real-time responses.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="environment" className="text-sm font-medium text-gray-700">Environment:</Label>
                <Select value={environment} onValueChange={(v: "sandbox" | "production") => setEnvironment(v)}>
                  <SelectTrigger className="w-36" data-testid="select-environment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sandbox" data-testid="option-sandbox">
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4 text-blue-600" />
                        Sandbox
                      </div>
                    </SelectItem>
                    <SelectItem value="production" data-testid="option-production">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        Production
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={() => window.open('/api-reference', '_blank')} data-testid="button-api-reference">
                <BookOpen className="h-4 w-4 mr-2" />
                API Reference
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
          <div className="lg:col-span-1">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4] sticky top-8">
              <CardHeader className="pb-3">
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">Endpoints</CardTitle>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">Select an endpoint to test</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="p-4 space-y-4">
                    {categories.map(category => (
                      <div key={category}>
                        <div className="text-xs [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] uppercase tracking-wider mb-2">
                          {category}
                        </div>
                        <div className="space-y-1">
                          {endpoints
                            .filter(e => e.category === category)
                            .map(endpoint => (
                              <button
                                key={endpoint.id}
                                onClick={() => handleEndpointChange(endpoint.id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors ${
                                  selectedEndpoint.id === endpoint.id
                                    ? "bg-[#e8f5e9] border border-[#27ae60]"
                                    : "hover:bg-[#f6f6f6] border border-transparent"
                                }`}
                                data-testid={`button-endpoint-${endpoint.id}`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs font-mono ${methodColors[endpoint.method]}`}
                                  >
                                    {endpoint.method}
                                  </Badge>
                                </div>
                                <div className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">{endpoint.name}</div>
                                <div className="text-xs [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] truncate">{endpoint.path}</div>
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-[#fcfcfc] rounded-[20px] border border-[#e4e4e4]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`text-sm font-mono px-3 py-1 ${methodColors[selectedEndpoint.method]}`}
                    >
                      {selectedEndpoint.method}
                    </Badge>
                    <code className="text-sm bg-[#f6f6f6] px-3 py-1 rounded-lg [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#003d2b]">
                      {buildRequestUrl()}
                    </code>
                  </div>
                  <Button 
                    onClick={executeRequest} 
                    disabled={isLoading}
                    className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] text-white hover:opacity-90 h-12 rounded-lg"
                    data-testid="button-send-request"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm">{isLoading ? "Sending..." : "Send Request"}</span>
                  </Button>
                </div>
                <CardDescription className="mt-2 [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">
                  {selectedEndpoint.description}
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full max-w-md bg-gray-200 rounded-lg p-1">
                    <TabsTrigger value="request" data-testid="tab-request" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                      <Settings className="h-4 w-4 mr-2" />
                      Request
                    </TabsTrigger>
                    <TabsTrigger value="response" data-testid="tab-response" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                      <FileJson className="h-4 w-4 mr-2" />
                      Response
                    </TabsTrigger>
                    <TabsTrigger value="code" data-testid="tab-code" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger value="history" data-testid="tab-history" className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium">
                      <History className="h-4 w-4 mr-2" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="request" className="mt-6 space-y-6">
                    <div>
                      <Label className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">API Key</Label>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="relative flex-1">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type={showApiKey ? "text" : "password"}
                            placeholder={environment === "sandbox" ? "Optional in sandbox mode" : "Enter your API key"}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="pl-10 pr-10 font-mono"
                            data-testid="input-api-key"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            data-testid="button-toggle-api-key"
                          >
                            {showApiKey ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => window.open('/developer-portal', '_blank')}
                          data-testid="button-get-api-key"
                        >
                          Get Key
                        </Button>
                      </div>
                      {environment === "sandbox" && (
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          Sandbox mode uses simulated responses. No API key required.
                        </p>
                      )}
                    </div>

                    {selectedEndpoint.pathParams.length > 0 && (
                      <div>
                        <Label className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Path Parameters</Label>
                        <div className="mt-2 space-y-3">
                          {selectedEndpoint.pathParams.map(param => (
                            <div key={param.key} className="flex items-center gap-3">
                              <div className="w-32">
                                <code className="text-sm text-purple-600 font-mono">{`{${param.key}}`}</code>
                              </div>
                              <Input
                                placeholder={param.example}
                                value={pathParamValues[param.key] || ""}
                                onChange={(e) => setPathParamValues(prev => ({
                                  ...prev,
                                  [param.key]: e.target.value
                                }))}
                                className="font-mono"
                                data-testid={`input-path-${param.key}`}
                              />
                              <p className="text-xs text-gray-500 flex-1">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.queryParams.length > 0 && (
                      <div>
                        <Label className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Query Parameters</Label>
                        <div className="mt-2 space-y-3">
                          {selectedEndpoint.queryParams.map(param => (
                            <div key={param.key} className="flex items-center gap-3">
                              <div className="w-32 flex items-center gap-1">
                                <code className="text-sm text-blue-600 font-mono">{param.key}</code>
                                {param.required && <span className="text-red-500">*</span>}
                              </div>
                              <Input
                                placeholder={param.example}
                                value={queryParamValues[param.key] || ""}
                                onChange={(e) => setQueryParamValues(prev => ({
                                  ...prev,
                                  [param.key]: e.target.value
                                }))}
                                className="font-mono"
                                data-testid={`input-query-${param.key}`}
                              />
                              <p className="text-xs text-gray-500 flex-1">{param.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEndpoint.method !== "GET" && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm [font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b]">Request Body</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setRequestBody(selectedEndpoint.exampleBody)}
                              data-testid="button-reset-body"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Reset
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(requestBody, "body")}
                              data-testid="button-copy-body"
                            >
                              {copiedCode === "body" ? (
                                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              Copy
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          className="font-mono text-sm min-h-[200px] bg-gray-50"
                          placeholder="Enter JSON request body"
                          data-testid="textarea-request-body"
                        />
                        <div className="mt-2">
                          <details className="text-sm">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              View Schema
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-x-auto">
                              {selectedEndpoint.bodySchema}
                            </pre>
                          </details>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="response" className="mt-6">
                    {response ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Badge 
                              variant="outline" 
                              className={responseStatus && responseStatus < 400 
                                ? "bg-green-100 text-green-700 border-green-300" 
                                : "bg-red-100 text-red-700 border-red-300"
                              }
                            >
                              {responseStatus && responseStatus < 400 ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              )}
                              {responseStatus}
                            </Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {responseTime}ms
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(response, "response")}
                            data-testid="button-copy-response"
                          >
                            {copiedCode === "response" ? (
                              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            Copy
                          </Button>
                        </div>
                        <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto font-mono">
                          {response}
                        </pre>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Terminal className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No response yet</p>
                        <p className="text-sm text-gray-400 mt-1">Send a request to see the response here</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="code" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {[
                          { id: "curl", name: "cURL", icon: Terminal },
                          { id: "nodejs", name: "Node.js", icon: SiNodedotjs },
                          { id: "python", name: "Python", icon: SiPython },
                          { id: "php", name: "PHP", icon: SiPhp },
                          { id: "go", name: "Go", icon: SiGo }
                        ].map(lang => {
                          const IconComponent = lang.icon as ComponentType<{ className?: string }>;
                          return (
                            <Button
                              key={lang.id}
                              variant={codeLanguage === lang.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCodeLanguage(lang.id)}
                              className={codeLanguage === lang.id ? "bg-blue-600" : ""}
                              data-testid={`button-lang-${lang.id}`}
                            >
                              <IconComponent className="h-4 w-4 mr-2" />
                              {lang.name}
                            </Button>
                          );
                        })}
                      </div>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => copyToClipboard(generateCodeSnippet(), "code")}
                          data-testid="button-copy-code"
                        >
                          {copiedCode === "code" ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm overflow-x-auto font-mono">
                          {generateCodeSnippet()}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-6">
                    {requestHistory.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            Showing {requestHistory.length} recent request{requestHistory.length > 1 ? "s" : ""}
                          </p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearHistory}
                            data-testid="button-clear-history"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Clear
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {requestHistory.map((item) => (
                            <div 
                              key={item.id} 
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                              data-testid={`history-item-${item.id}`}
                            >
                              <div className="flex items-center gap-3">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs font-mono ${methodColors[item.method]}`}
                                >
                                  {item.method}
                                </Badge>
                                <code className="text-sm text-gray-600 font-mono">{item.path}</code>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge 
                                  variant="outline"
                                  className={item.success 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-red-100 text-red-700"
                                  }
                                >
                                  {item.status}
                                </Badge>
                                <span className="text-xs text-gray-500">{item.duration}ms</span>
                                <span className="text-xs text-gray-400">
                                  {item.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No request history</p>
                        <p className="text-sm text-gray-400 mt-1">Your requests will appear here</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#27ae60]/10 to-[#0052cc]/10 border border-[#27ae60]/20 bg-[#fcfcfc] rounded-[20px]">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#27ae60]/10 rounded-lg">
                    <Info className="h-6 w-6 text-[#27ae60]" />
                  </div>
                  <div>
                    <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Sandbox Mode Tips</h3>
                    <ul className="text-sm [font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080] space-y-1">
                      <li>• Sandbox mode returns simulated responses - no real data is processed</li>
                      <li>• All requests are rate-limited to 100 requests/minute in sandbox</li>
                      <li>• Use test data only - never submit real customer information in sandbox</li>
                      <li>• Switch to Production environment when ready to process real transactions</li>
                    </ul>
                    <div className="mt-4 flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => window.open('/sdk-documentation', '_blank')} data-testid="button-sdk-docs">
                        <Code className="h-4 w-4 mr-2" />
                        SDK Documentation
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open('/webhooks', '_blank')} data-testid="button-webhooks">
                        <Globe className="h-4 w-4 mr-2" />
                        Configure Webhooks
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
