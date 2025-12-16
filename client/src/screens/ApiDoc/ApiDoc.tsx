import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Code, Play } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState("");

  const apiSections = [
    {
      title: "Authentication",
      endpoints: [
        {
          method: "POST",
          path: "/v1/auth/login",
          description: "Authenticate and obtain access token",
          parameters: ["email", "password"],
          response: "Access token and user information"
        },
        {
          method: "POST", 
          path: "/v1/auth/refresh",
          description: "Refresh expired access token",
          parameters: ["refresh_token"],
          response: "New access token"
        }
      ]
    },
    {
      title: "Transactions",
      endpoints: [
        {
          method: "POST",
          path: "/v1/transactions/create",
          description: "Create a new secure transaction",
          parameters: ["amount", "currency", "recipient", "description"],
          response: "Transaction ID and escrow details"
        },
        {
          method: "GET",
          path: "/v1/transactions/{id}",
          description: "Get transaction details by ID",
          parameters: ["transaction_id"],
          response: "Complete transaction information"
        },
        {
          method: "PATCH",
          path: "/v1/transactions/{id}/status",
          description: "Update transaction status",
          parameters: ["transaction_id", "status"],
          response: "Updated transaction status"
        }
      ]
    },
    {
      title: "Fraud Detection",
      endpoints: [
        {
          method: "POST",
          path: "/v1/fraud/check",
          description: "Perform fraud risk assessment",
          parameters: ["transaction_data", "user_data", "device_data"],
          response: "Risk score and fraud indicators"
        },
        {
          method: "GET",
          path: "/v1/fraud/reports",
          description: "Retrieve fraud detection reports",
          parameters: ["date_range", "risk_level"],
          response: "List of fraud reports"
        }
      ]
    },
    {
      title: "KYC Verification",
      endpoints: [
        {
          method: "POST",
          path: "/v1/kyc/verify",
          description: "Submit KYC verification request",
          parameters: ["user_id", "documents", "verification_level"],
          response: "Verification request ID and status"
        },
        {
          method: "GET",
          path: "/v1/kyc/status/{id}",
          description: "Check KYC verification status",
          parameters: ["verification_id"],
          response: "Current verification status and results"
        }
      ]
    }
  ];

  const codeExamples = {
    curl: `curl -X POST https://api.trustverify.io/v1/transactions/create \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 1000.00,
    "currency": "GBP",
    "recipient": "user@example.com",
    "description": "Service payment"
  }'`,
    
    javascript: `const response = await fetch('https://api.trustverify.io/v1/transactions/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 1000.00,
    currency: 'GBP',
    recipient: 'user@example.com',
    description: 'Service payment'
  })
});

const transaction = await response.json();`,
    
    python: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
}

data = {
    'amount': 1000.00,
    'currency': 'GBP',
    'recipient': 'user@example.com',
    'description': 'Service payment'
}

response = requests.post(
    'https://api.trustverify.io/v1/transactions/create',
    headers=headers,
    json=data
)

transaction = response.json()`,
    
    php: `<?php
$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => 'https://api.trustverify.io/v1/transactions/create',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer YOUR_API_KEY',
        'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode([
        'amount' => 1000.00,
        'currency' => 'GBP',
        'recipient' => 'user@example.com',
        'description' => 'Service payment'
    ])
]);

$response = curl_exec($ch);
$transaction = json_decode($response, true);
curl_close($ch);
?>`
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="px-6 pt-24 pb-16 bg-white">
        <div className="max-w-[1270px] mx-auto text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] text-[#003d2b] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-sm leading-[14px] tracking-[0]">
              API DOCUMENTATION
            </span>
          </Badge>
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[36px] sm:text-[42px] lg:text-[48px] leading-[110%] text-[#003d2b] tracking-[-0.6px]">
              TrustVerify API Documentation
            </h1>
            <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-lg sm:text-xl text-[#808080] leading-[27px]">
              Complete reference with interactive examples, authentication guidance, and testing tools.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-[1270px] mx-auto px-6 md:px-10 pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="border border-[#e4e4e4] rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="text-lg [font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">API Reference</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {apiSections.map((section, index) => (
                    <div key={index}>
                      <div className="px-4 py-2 bg-[#f7f7f7] border-b border-[#e4e4e4]">
                        <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-sm text-[#003d2b]">{section.title}</h4>
                      </div>
                      {section.endpoints.map((endpoint, endpointIndex) => (
                        <button
                          key={endpointIndex}
                          className={`w-full text-left px-4 py-2 text-sm border-b border-[#f0f0f0] transition-colors ${
                            activeEndpoint === `${section.title}-${endpointIndex}` ? 'bg-[#e8f5ef]' : 'hover:bg-[#f7f7f7]'
                          }`}
                          onClick={() => setActiveEndpoint(`${section.title}-${endpointIndex}`)}
                        >
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                              className={`text-xs ${endpoint.method === 'GET' ? 'bg-[#2a8f5c]' : 'bg-[#b8752e]'} rounded-lg text-white`}
                            >
                              {endpoint.method}
                            </Badge>
                            <span className="truncate text-[#003d2b]">{endpoint.path}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-[#f4f4f4] rounded-lg p-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="examples">Code Examples</TabsTrigger>
                <TabsTrigger value="testing">API Testing</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">TrustVerify API Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-lg text-[#003d2b] mb-3">Base URL</h3>
                      <code className="bg-[#f7f7f7] px-3 py-2 rounded block text-[#003d2b]">
                        https://api.trustverify.io/v1
                      </code>
                    </div>

                    <div>
                      <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-lg text-[#003d2b] mb-3">Rate Limits</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-[#808080]">API Calls:</span>
                          <span className="font-medium text-[#003d2b]">1000/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#808080]">Fraud Checks:</span>
                          <span className="font-medium text-[#003d2b]">500/hour</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#808080]">KYC Verifications:</span>
                          <span className="font-medium text-[#003d2b]">100/hour</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-lg text-[#003d2b] mb-3">Supported Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-[#e4e4e4] rounded-[14px] p-4 bg-white">
                          <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Secure Transactions</h4>
                          <p className="text-sm text-[#808080]">
                            Create and manage escrow-protected transactions with fraud prevention.
                          </p>
                        </div>
                        <div className="border border-[#e4e4e4] rounded-[14px] p-4 bg-white">
                          <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Fraud Detection</h4>
                          <p className="text-sm text-[#808080]">
                            AI-powered fraud detection with real-time risk assessment.
                          </p>
                        </div>
                        <div className="border border-[#e4e4e4] rounded-[14px] p-4 bg-white">
                          <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">KYC Verification</h4>
                          <p className="text-sm text-[#808080]">
                            Automated identity verification with document processing.
                          </p>
                        </div>
                        <div className="border border-[#e4e4e4] rounded-[14px] p-4 bg-white">
                          <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Webhooks</h4>
                          <p className="text-sm text-[#808080]">
                            Real-time notifications for transaction and fraud events.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="authentication">
                <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[#808080]">
                      All API requests require authentication using Bearer tokens. Include your API key 
                      in the Authorization header of every request.
                    </p>
                    
                    <div className="bg-[#121728] text-green-400 p-4 rounded-lg font-mono text-sm">
                      Authorization: Bearer YOUR_API_KEY
                    </div>

                    <div className="bg-[#fff7e5] border border-[#f3d28c] p-4 rounded-lg">
                      <div className="text-[#b58500] text-sm">
                        <strong>Security Note:</strong> Never expose your API keys in client-side code. 
                        Always use them server-side and implement proper key rotation.
                      </div>
                    </div>

                    <div>
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#003d2b] mb-2">Error Responses</h4>
                      <div className="space-y-2">
                        <div className="border border-[#e4e4e4] rounded-[12px] p-3">
                          <code className="text-red-600">401 Unauthorized</code>
                          <p className="text-sm text-[#808080] mt-1">Invalid or missing API key</p>
                        </div>
                        <div className="border border-[#e4e4e4] rounded-[12px] p-3">
                          <code className="text-red-600">403 Forbidden</code>
                          <p className="text-sm text-[#808080] mt-1">Insufficient permissions</p>
                        </div>
                        <div className="border border-[#e4e4e4] rounded-[12px] p-3">
                          <code className="text-red-600">429 Too Many Requests</code>
                          <p className="text-sm text-[#808080] mt-1">Rate limit exceeded</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="examples">
                <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">Code Examples</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="curl" className="space-y-4">
                      <TabsList className="bg-[#f4f4f4] rounded-lg p-1">
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="php">PHP</TabsTrigger>
                      </TabsList>

                      {Object.entries(codeExamples).map(([language, code]) => (
                        <TabsContent key={language} value={language}>
                          <div className="bg-[#121728] text-green-400 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">{code}</pre>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testing">
                <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <CardHeader>
                    <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] text-[#003d2b]">API Testing Tools</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-[#e4e4e4] rounded-[14px] p-4 bg-white">
                        <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#003d2b] mb-2 flex items-center">
                          <Play className="h-4 w-4 mr-2" />
                          Interactive Playground
                        </h4>
                        <p className="text-sm text-[#808080] mb-3">
                          Test API endpoints directly from your browser with real-time responses.
                        </p>
                        <Button size="sm" className="w-full bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px]">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Playground
                        </Button>
                      </div>

                      <div className="border border-[#e4e4e4] rounded-[14px] p-4 bg-white">
                        <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#003d2b] mb-2 flex items-center">
                          <Code className="h-4 w-4 mr-2" />
                          Postman Collection
                        </h4>
                        <p className="text-sm text-[#808080] mb-3">
                          Import our complete API collection for easy testing in Postman.
                        </p>
                        <Button size="sm" variant="outline" className="w-full border-[#0b3a78] text-[#0b3a78] hover:bg-[#0b3a780d] rounded-[10px]">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Download Collection
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#003d2b] mb-3">Testing Environments</h4>
                      <div className="space-y-3">
                        <div className="border border-[#e4e4e4] rounded-[12px] p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#003d2b]">Sandbox</span>
                            <Badge variant="secondary">Testing</Badge>
                          </div>
                          <code className="text-sm bg-[#f7f7f7] px-2 py-1 rounded text-[#003d2b]">
                            https://sandbox-api.trustverify.io/v1
                          </code>
                          <p className="text-sm text-[#808080] mt-2">
                            Safe testing environment with simulated responses. No real transactions processed.
                          </p>
                        </div>
                        
                        <div className="border border-[#e4e4e4] rounded-[12px] p-3 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-[#003d2b]">Production</span>
                            <Badge>Live</Badge>
                          </div>
                          <code className="text-sm bg-[#f7f7f7] px-2 py-1 rounded text-[#003d2b]">
                            https://api.trustverify.io/v1
                          </code>
                          <p className="text-sm text-[#808080] mt-2">
                            Live environment for production use. Real transactions and fraud detection.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}