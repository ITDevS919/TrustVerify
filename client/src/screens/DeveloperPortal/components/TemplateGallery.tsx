import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Search, Filter, Copy, CheckCircle2 } from "lucide-react";
import { apiRequest } from "../../../lib/queryClient";

interface IndustryTemplate {
  id: number;
  name: string;
  industry: string;
  useCase: string;
  description?: string;
  workflowSteps: any[];
  defaultRules: any;
  recommendedSettings: any;
  documentation?: string;
  codeExamples: Array<{
    language: string;
    code: string;
    description: string;
  }>;
}

const industries = [
  { value: "all", label: "All Industries" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "fintech", label: "Fintech" },
  { value: "marketplace", label: "Marketplace" },
  { value: "crypto", label: "Cryptocurrency" },
  { value: "healthcare", label: "Healthcare" },
  { value: "real_estate", label: "Real Estate" },
  { value: "gaming", label: "Gaming" },
];

const useCases = [
  { value: "all", label: "All Use Cases" },
  { value: "checkout", label: "Checkout" },
  { value: "kyc", label: "KYC Verification" },
  { value: "escrow", label: "Escrow" },
  { value: "dispute_resolution", label: "Dispute Resolution" },
  { value: "account_opening", label: "Account Opening" },
];

export const TemplateGallery = () => {
  const [templates, setTemplates] = useState<IndustryTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<IndustryTemplate[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedUseCase, setSelectedUseCase] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<IndustryTemplate | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, selectedIndustry, selectedUseCase, searchQuery]);

  const fetchTemplates = async () => {
    try {
      const response = await apiRequest("GET", "/api/developer/templates");
      const data = await response.json();
      setTemplates(data);
      setFilteredTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      alert("Failed to load templates. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = [...templates];

    if (selectedIndustry !== "all") {
      filtered = filtered.filter((t) => t.industry === selectedIndustry);
    }

    if (selectedUseCase !== "all") {
      filtered = filtered.filter((t) => t.useCase === selectedUseCase);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          t.industry.toLowerCase().includes(query) ||
          t.useCase.toLowerCase().includes(query)
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleCreateFromTemplate = async (templateId: number) => {
    try {
      const response = await apiRequest("POST", `/api/developer/templates/${templateId}/create-workflow`, {
        name: `${selectedTemplate?.name} (Custom)`,
      });
      const workflow = await response.json();
      alert(`Workflow created successfully! ID: ${workflow.id}`);
      setSelectedTemplate(null);
    } catch (error: any) {
      console.error("Error creating workflow:", error);
      alert(error.message || "Failed to create workflow. Please ensure the backend server is running.");
    }
  };

  const copyCode = (code: string, exampleId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(exampleId);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getIndustryBadgeColor = (industry: string) => {
    const colors: Record<string, string> = {
      ecommerce: "bg-blue-100 text-blue-800",
      fintech: "bg-green-100 text-green-800",
      marketplace: "bg-purple-100 text-purple-800",
      crypto: "bg-orange-100 text-orange-800",
      healthcare: "bg-red-100 text-red-800",
      real_estate: "bg-yellow-100 text-yellow-800",
      gaming: "bg-pink-100 text-pink-800",
    };
    return colors[industry] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#808080]">Loading templates...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2.5">
        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
          Industry Templates
        </h2>
        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
          Choose from pre-built workflow templates tailored to your industry
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#808080]" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
          <SelectTrigger className="w-full sm:w-[200px] h-12">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            {industries.map((industry) => (
              <SelectItem key={industry.value} value={industry.value}>
                {industry.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedUseCase} onValueChange={setSelectedUseCase}>
          <SelectTrigger className="w-full sm:w-[200px] h-12">
            <SelectValue placeholder="Use Case" />
          </SelectTrigger>
          <SelectContent>
            {useCases.map((useCase) => (
              <SelectItem key={useCase.value} value={useCase.value}>
                {useCase.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="p-12 text-center">
          <CardContent>
            <p className="text-[#808080] text-lg">No templates found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4] hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                    {template.name}
                  </CardTitle>
                  <Badge className={getIndustryBadgeColor(template.industry)}>
                    {template.industry}
                  </Badge>
                </div>
                <CardDescription className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm mt-2">
                  {template.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-[#808080]">
                    <span className="font-medium">Use Case:</span>
                    <span>{template.useCase.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#808080]">
                    <span className="font-medium">Steps:</span>
                    <span>{template.workflowSteps?.length || 0} workflow steps</span>
                  </div>
                  <Button
                    className="w-full mt-2 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-[20px] p-6 md:p-8 relative my-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedTemplate(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>

            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl">
                    {selectedTemplate.name}
                  </h3>
                  <Badge className={getIndustryBadgeColor(selectedTemplate.industry)}>
                    {selectedTemplate.industry}
                  </Badge>
                </div>
                <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-base">
                  {selectedTemplate.description}
                </p>
              </div>

              {/* Workflow Steps */}
              <div>
                <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg mb-3">
                  Workflow Steps
                </h4>
                <div className="flex flex-col gap-2">
                  {selectedTemplate.workflowSteps?.map((step: any, index: number) => (
                    <div
                      key={step.id || index}
                      className="flex items-center gap-3 p-3 bg-[#f6f6f6] rounded-lg"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-app-secondary text-white rounded-full font-semibold">
                        {step.order || index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#003d2b]">{step.name}</div>
                        <div className="text-sm text-[#808080]">Type: {step.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Examples */}
              {selectedTemplate.codeExamples && selectedTemplate.codeExamples.length > 0 && (
                <div>
                  <h4 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg mb-3">
                    Code Examples
                  </h4>
                  <div className="flex flex-col gap-4">
                    {selectedTemplate.codeExamples.map((example, index) => {
                      const exampleId = `${selectedTemplate.id}-${index}`;
                      return (
                        <div key={index} className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#003d2b]">
                              {example.language}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyCode(example.code, exampleId)}
                              className="h-8"
                            >
                              {copiedCode === exampleId ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <pre className="bg-[#121728] rounded-lg p-4 overflow-x-auto">
                            <code className="text-[#27ae60] text-sm">{example.code}</code>
                          </pre>
                          {example.description && (
                            <p className="text-sm text-[#808080] mt-2">{example.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  className="flex-1 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                  onClick={() => handleCreateFromTemplate(selectedTemplate.id)}
                >
                  Create Workflow from Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

