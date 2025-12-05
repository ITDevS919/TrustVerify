import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Badge } from "../../../components/ui/badge";
import { Textarea } from "../../../components/ui/textarea";
import { Switch } from "../../../components/ui/switch";
import { apiRequest } from "../../../lib/queryClient";
import {
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Copy,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

interface WebhookDelivery {
  id: number;
  eventType: string;
  status: string;
  statusCode?: number;
  attemptNumber: number;
  deliveredAt?: string;
  createdAt: string;
}

export const WebhookManager = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    events: [] as string[],
    isActive: true,
  });

  const webhookEvents = [
    "transaction.created",
    "transaction.completed",
    "transaction.failed",
    "kyc.verified",
    "kyc.rejected",
    "fraud.detected",
    "dispute.created",
    "dispute.resolved",
  ];

  useEffect(() => {
    fetchWebhooks();
  }, []);

  useEffect(() => {
    if (selectedWebhook) {
      fetchDeliveries(selectedWebhook.id);
    }
  }, [selectedWebhook]);

  const fetchWebhooks = async () => {
    try {
      const response = await apiRequest("GET", "/api/developer/webhooks");
      const data = await response.json();
      setWebhooks(data);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
    }
  };

  const fetchDeliveries = async (webhookId: number) => {
    try {
      const response = await apiRequest("GET", `/api/developer/webhooks/${webhookId}/deliveries`);
      const data = await response.json();
      setDeliveries(data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url) {
      alert("Name and URL are required");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("POST", "/api/developer/webhooks", formData);
      await fetchWebhooks();
      setShowCreateModal(false);
      setFormData({ name: "", url: "", events: [], isActive: true });
    } catch (error: any) {
      alert(error.message || "Failed to create webhook");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebhook = async (id: number) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;

    try {
      await apiRequest("DELETE", `/api/developer/webhooks/${id}`);
      await fetchWebhooks();
      if (selectedWebhook?.id === id) {
        setSelectedWebhook(null);
      }
    } catch (error: any) {
      alert(error.message || "Failed to delete webhook");
    }
  };

  const handleToggleActive = async (webhook: Webhook) => {
    try {
      await apiRequest("PUT", `/api/developer/webhooks/${webhook.id}`, {
        ...webhook,
        isActive: !webhook.isActive,
      });
      await fetchWebhooks();
    } catch (error: any) {
      alert(error.message || "Failed to update webhook");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2.5">
        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
          Webhook Management
        </h2>
        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
          Configure webhooks to receive real-time notifications about events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Webhooks List */}
        <Card className="lg:col-span-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                Webhooks
              </CardTitle>
              <Button
                size="sm"
                onClick={() => setShowCreateModal(true)}
                className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedWebhook?.id === webhook.id
                      ? "bg-app-secondary/10 border-app-secondary"
                      : "bg-white border-[#e4e4e4] hover:border-app-secondary"
                  }`}
                  onClick={() => setSelectedWebhook(webhook)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-[#003d2b]">{webhook.name}</div>
                    <Switch
                      checked={webhook.isActive}
                      onCheckedChange={() => handleToggleActive(webhook)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="text-sm text-[#808080] truncate">{webhook.url}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={webhook.isActive ? "default" : "secondary"}>
                      {webhook.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-[#808080]">
                      {webhook.events.length} events
                    </span>
                  </div>
                </div>
              ))}
              {webhooks.length === 0 && (
                <div className="text-center py-8 text-[#808080]">
                  No webhooks configured. Click "New" to create one.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Webhook Details & Delivery Logs */}
        <Card className="lg:col-span-2 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          {selectedWebhook ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                    {selectedWebhook.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteWebhook(selectedWebhook.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div>
                  <Label className="text-sm text-[#808080]">Webhook URL</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={selectedWebhook.url} readOnly className="font-mono text-sm" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(selectedWebhook.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-[#808080]">Subscribed Events</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedWebhook.events.map((event) => (
                      <Badge key={event} variant="outline">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-semibold text-[#003d2b]">
                      Delivery Logs
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fetchDeliveries(selectedWebhook.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Refresh
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
                    {deliveries.map((delivery) => (
                      <div
                        key={delivery.id}
                        className="p-3 bg-white rounded-lg border border-[#e4e4e4]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={getStatusColor(delivery.status)}>
                              {getStatusIcon(delivery.status)}
                            </span>
                            <span className="font-medium text-[#003d2b]">
                              {delivery.eventType}
                            </span>
                          </div>
                          <Badge className={getStatusColor(delivery.status)}>
                            {delivery.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-[#808080] space-y-1">
                          <div>Attempt: {delivery.attemptNumber}</div>
                          {delivery.statusCode && (
                            <div>Status Code: {delivery.statusCode}</div>
                          )}
                          <div>
                            {delivery.deliveredAt
                              ? `Delivered: ${new Date(delivery.deliveredAt).toLocaleString()}`
                              : `Created: ${new Date(delivery.createdAt).toLocaleString()}`}
                          </div>
                        </div>
                      </div>
                    ))}
                    {deliveries.length === 0 && (
                      <div className="text-center py-8 text-[#808080]">
                        No delivery logs yet
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-[#808080] text-lg mb-4">Select a webhook to view details</p>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white">
            <CardHeader>
              <CardTitle>Create Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateWebhook} className="flex flex-col gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Webhook"
                    required
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://your-server.com/webhook"
                    required
                  />
                </div>
                <div>
                  <Label>Events</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {webhookEvents.map((event) => (
                      <Button
                        key={event}
                        type="button"
                        variant={
                          formData.events.includes(event) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          if (formData.events.includes(event)) {
                            setFormData({
                              ...formData,
                              events: formData.events.filter((e) => e !== event),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              events: [...formData.events, event],
                            });
                          }
                        }}
                      >
                        {event}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label>Active</Label>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                  >
                    {loading ? "Creating..." : "Create Webhook"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};


