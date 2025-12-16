import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Settings, Webhook as WebhookIcon, CheckCircle, AlertCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebhookEndpoint {
  id: string;
  url: string;
  description: string;
  events: string[];
  status: 'active' | 'inactive';
  secretKey: string;
  created: string;
  lastDelivery: string;
  successRate: number;
}

interface WebhookEvent {
  name: string;
  description: string;
  enabled: boolean;
  examplePayload: string;
}

export function Webhook() {
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      url: 'https://api.yourapp.com/webhooks/trustverify',
      description: 'Production webhook endpoint',
      events: ['transaction.created', 'transaction.completed', 'fraud.detected'],
      status: 'active',
      secretKey: 'whsec_abc123xyz789...',
      created: '2025-01-15',
      lastDelivery: '2025-01-19T10:30:00Z',
      successRate: 98.5
    }
  ]);

  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([
    {
      name: 'transaction.created',
      description: 'New transaction initiated',
      enabled: true,
      examplePayload: `{
  "event": "transaction.created",
  "data": {
    "id": "txn_abc123",
    "amount": 1000.00,
    "currency": "GBP",
    "status": "pending",
    "created_at": "2025-01-19T10:30:00Z"
  }
}`
    },
    {
      name: 'transaction.completed',
      description: 'Transaction successfully completed',
      enabled: true,
      examplePayload: `{
  "event": "transaction.completed",
  "data": {
    "id": "txn_abc123",
    "amount": 1000.00,
    "currency": "GBP",
    "status": "completed",
    "completed_at": "2025-01-19T11:00:00Z"
  }
}`
    },
    {
      name: 'fraud.detected',
      description: 'Suspicious activity identified',
      enabled: true,
      examplePayload: `{
  "event": "fraud.detected",
  "data": {
    "transaction_id": "txn_abc123",
    "risk_score": 85,
    "fraud_indicators": ["unusual_location", "velocity_check"],
    "detected_at": "2025-01-19T10:32:00Z"
  }
}`
    },
    {
      name: 'kyc.verified',
      description: 'KYC verification completed',
      enabled: false,
      examplePayload: `{
  "event": "kyc.verified",
  "data": {
    "user_id": "usr_def456",
    "verification_level": "full",
    "status": "approved",
    "verified_at": "2025-01-19T09:15:00Z"
  }
}`
    },
    {
      name: 'dispute.raised',
      description: 'New dispute created',
      enabled: false,
      examplePayload: `{
  "event": "dispute.raised",
  "data": {
    "dispute_id": "dsp_ghi789",
    "transaction_id": "txn_abc123",
    "reason": "goods_not_received",
    "raised_at": "2025-01-19T14:20:00Z"
  }
}`
    }
  ]);

  const [newEndpointUrl, setNewEndpointUrl] = useState("");
  const [newEndpointDescription, setNewEndpointDescription] = useState("");
  const { toast } = useToast();

  const handleToggleEvent = (eventName: string) => {
    setWebhookEvents(prev => prev.map(event => 
      event.name === eventName ? { ...event, enabled: !event.enabled } : event
    ));
  };

  const handleAddEndpoint = () => {
    if (!newEndpointUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a webhook URL.",
        variant: "destructive",
      });
      return;
    }

    const newEndpoint: WebhookEndpoint = {
      id: Date.now().toString(),
      url: newEndpointUrl,
      description: newEndpointDescription || 'New webhook endpoint',
      events: webhookEvents.filter(e => e.enabled).map(e => e.name),
      status: 'active',
      secretKey: `whsec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      lastDelivery: 'Never',
      successRate: 0
    };

    setEndpoints(prev => [...prev, newEndpoint]);
    setNewEndpointUrl("");
    setNewEndpointDescription("");
    
    toast({
      title: "Webhook Endpoint Added",
      description: "New webhook endpoint has been configured successfully.",
    });
  };

  const handleToggleEndpoint = (endpointId: string) => {
    setEndpoints(prev => prev.map(endpoint => 
      endpoint.id === endpointId 
        ? { ...endpoint, status: endpoint.status === 'active' ? 'inactive' : 'active' }
        : endpoint
    ));
  };

  const handleTestEndpoint = (endpoint: WebhookEndpoint) => {
    toast({
      title: "Test Webhook Sent",
      description: `Test payload sent to ${endpoint.url}`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-[1270px] mx-auto px-6 md:px-10 py-24">
        <div className="mb-12 text-center">
          <Badge className="h-[30px] bg-[#003d2b1a] hover:bg-[#003d2b1a] rounded-[800px] px-4 mb-6 border-0">
            <span className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#003d2b] text-sm leading-[14px] tracking-[0]">
              WEBHOOK CONFIGURATION
            </span>
          </Badge>
          <h1 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[42px] sm:text-[48px] lg:text-[54px] leading-[110%] text-[#003d2b] tracking-[-0.8px] mb-4">
            Webhook Configuration
          </h1>
          <p className="[font-family:'DM_Sans_18pt-Medium',Helvetica] font-medium text-[#808080] text-lg max-w-3xl mx-auto">
            Configure webhook endpoints to receive real-time notifications about events in your TrustVerify account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Webhook Events */}
          <div className="space-y-6">
            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Available Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {webhookEvents.map((event) => (
                  <div key={event.name} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                      <Switch
                        checked={event.enabled}
                        onCheckedChange={() => handleToggleEvent(event.name)}
                      />
                    </div>
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer">
                        View example payload
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {event.examplePayload}
                      </pre>
                    </details>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-[#f4f4f4] border border-[#e4e4e4] p-4 rounded-lg">
                  <h4 className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] font-semibold text-[#003d2b] mb-2">Webhook Signatures</h4>
                  <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                    All webhook payloads are signed with a secret key. Verify the signature 
                    to ensure the webhook is from TrustVerify.
                  </p>
                </div>
                <div className="bg-[#003d2b] text-app-secondary p-3 rounded font-mono text-sm">
                  <div>X-TrustVerify-Signature: sha256=...</div>
                </div>
                <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-sm text-[#808080]">
                  Use the secret key provided for each endpoint to verify webhook authenticity.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Endpoints */}
          <div className="space-y-6">
            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <div className="flex items-center">
                  <WebhookIcon className="h-5 w-5 mr-2 text-[#0b3a78]" />
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">
                    Add New Endpoint
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Webhook URL</label>
                  <Input
                    placeholder="https://your-domain.com/webhooks"
                    value={newEndpointUrl}
                    onChange={(e) => setNewEndpointUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
                  <Input
                    placeholder="Production webhook endpoint"
                    value={newEndpointDescription}
                    onChange={(e) => setNewEndpointDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddEndpoint} className="w-full bg-app-secondary hover:bg-app-secondary/90 text-white rounded-[10px] min-h-[44px]">
                  <WebhookIcon className="h-4 w-4 mr-2" />
                  <span className="[font-family:'DM_Sans_18pt-Bold',Helvetica] font-bold">Add Endpoint</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Configured Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                {endpoints.length === 0 ? (
                  <div className="text-center py-8">
                    <WebhookIcon className="h-12 w-12 text-[#808080] mx-auto mb-4" />
                    <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-[#808080]">No webhook endpoints configured</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                      <div key={endpoint.id} className="border rounded p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant={endpoint.status === 'active' ? 'default' : 'secondary'}>
                              {endpoint.status}
                            </Badge>
                            <span className="text-sm font-medium">{endpoint.description}</span>
                          </div>
                          <Switch
                            checked={endpoint.status === 'active'}
                            onCheckedChange={() => handleToggleEndpoint(endpoint.id)}
                          />
                        </div>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">URL: </span>
                            <code className="bg-gray-100 px-1 rounded">{endpoint.url}</code>
                          </div>
                          
                          <div>
                            <span className="font-medium">Events: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {endpoint.events.map((event) => (
                                <Badge key={event} variant="outline" className="text-xs">
                                  {event}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">Success Rate: </span>
                              <span className={endpoint.successRate > 95 ? 'text-green-600' : 'text-yellow-600'}>
                                {endpoint.successRate}%
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTestEndpoint(endpoint)}
                              >
                                <Play className="h-3 w-3 mr-1" />
                                Test
                              </Button>
                            </div>
                          </div>

                          <div>
                            <span className="font-medium">Secret Key: </span>
                            <code className="bg-gray-100 px-1 rounded text-xs">
                              {endpoint.secretKey}
                            </code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-[#e4e4e4] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <CardHeader>
                <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b]">Delivery Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-[#e4e4e4] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-app-secondary" />
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-sm font-semibold text-[#003d2b]">transaction.created</div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">2025-01-19 10:30:45</div>
                      </div>
                    </div>
                    <Badge className="bg-[#1DBF731a] text-[#003d2b] border-0 rounded-[800px]">200 OK</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-[#e4e4e4] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-app-secondary" />
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-sm font-semibold text-[#003d2b]">fraud.detected</div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">2025-01-19 10:32:12</div>
                      </div>
                    </div>
                    <Badge className="bg-[#1DBF731a] text-[#003d2b] border-0 rounded-[800px]">200 OK</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border border-[#e4e4e4] rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="h-5 w-5 text-[#FF4B26]" />
                      <div>
                        <div className="[font-family:'DM_Sans_18pt-SemiBold',Helvetica] text-sm font-semibold text-[#003d2b]">transaction.completed</div>
                        <div className="[font-family:'DM_Sans_18pt-Regular',Helvetica] text-xs text-[#808080]">2025-01-19 09:15:23</div>
                      </div>
                    </div>
                    <Badge className="bg-[#FF4B261a] text-[#FF4B26] border-0 rounded-[800px]">500 Error</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}