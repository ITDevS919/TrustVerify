import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Plus, Trash2, GripVertical, Save, Play, X } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { apiRequest } from "../../../lib/queryClient";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface WorkflowStep {
  id: string;
  name: string;
  type: 'kyc' | 'fraud_check' | 'escrow' | 'dispute' | 'payment' | 'custom';
  order: number;
  config: Record<string, any>;
  conditions?: {
    if?: string;
    then?: string;
    else?: string;
  };
}

interface Workflow {
  id?: number;
  name: string;
  description?: string;
  industry: string;
  useCase: string;
  workflowSteps: WorkflowStep[];
  rules: Record<string, any>;
  triggers: string[];
  isActive: boolean;
}

const stepTypes = [
  { value: 'kyc', label: 'KYC Verification' },
  { value: 'fraud_check', label: 'Fraud Check' },
  { value: 'escrow', label: 'Escrow' },
  { value: 'dispute', label: 'Dispute Resolution' },
  { value: 'payment', label: 'Payment Processing' },
  { value: 'custom', label: 'Custom Step' },
];

const industries = [
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'gaming', label: 'Gaming' },
];

const useCases = [
  { value: 'checkout', label: 'Checkout' },
  { value: 'kyc', label: 'KYC Verification' },
  { value: 'escrow', label: 'Escrow' },
  { value: 'dispute_resolution', label: 'Dispute Resolution' },
  { value: 'account_opening', label: 'Account Opening' },
  { value: 'transaction_monitoring', label: 'Transaction Monitoring' },
];

export const WorkflowBuilder = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await apiRequest("GET", "/api/developer/workflows");
      const data = await response.json();
      setWorkflows(data);
    } catch (error) {
      console.error("Error fetching workflows:", error);
      alert("Failed to load workflows. Please ensure the backend server is running.");
    }
  };

  const createNewWorkflow = () => {
    setCurrentWorkflow({
      name: "",
      description: "",
      industry: "ecommerce",
      useCase: "checkout",
      workflowSteps: [],
      rules: {},
      triggers: [],
      isActive: false,
    });
  };

  const addStep = () => {
    if (!currentWorkflow) return;

    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      name: "New Step",
      type: "custom",
      order: currentWorkflow.workflowSteps.length + 1,
      config: {},
    };

    setCurrentWorkflow({
      ...currentWorkflow,
      workflowSteps: [...currentWorkflow.workflowSteps, newStep],
    });
    setEditingStep(newStep);
    setShowStepForm(true);
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    if (!currentWorkflow) return;

    setCurrentWorkflow({
      ...currentWorkflow,
      workflowSteps: currentWorkflow.workflowSteps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    });
  };

  const deleteStep = (stepId: string) => {
    if (!currentWorkflow) return;

    const updatedSteps = currentWorkflow.workflowSteps
      .filter((step) => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index + 1 }));

    setCurrentWorkflow({
      ...currentWorkflow,
      workflowSteps: updatedSteps,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!currentWorkflow || !over || active.id === over.id) return;

    const oldIndex = currentWorkflow.workflowSteps.findIndex((step) => step.id === active.id);
    const newIndex = currentWorkflow.workflowSteps.findIndex((step) => step.id === over.id);

    const newSteps = arrayMove(currentWorkflow.workflowSteps, oldIndex, newIndex).map(
      (step, index) => ({ ...step, order: index + 1 })
    );

    setCurrentWorkflow({
      ...currentWorkflow,
      workflowSteps: newSteps,
    });
  };

  const saveWorkflow = async () => {
    if (!currentWorkflow || !currentWorkflow.name) {
      alert("Please provide a workflow name");
      return;
    }

    if (currentWorkflow.workflowSteps.length === 0) {
      alert("Please add at least one workflow step");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (currentWorkflow.id) {
        response = await apiRequest("PUT", `/api/developer/workflows/${currentWorkflow.id}`, currentWorkflow);
      } else {
        response = await apiRequest("POST", "/api/developer/workflows", currentWorkflow);
      }
      const saved = await response.json();
      alert("Workflow saved successfully!");
      setCurrentWorkflow(null);
      fetchWorkflows();
    } catch (error: any) {
      console.error("Error saving workflow:", error);
      alert(error.message || "Failed to save workflow. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflow = (workflow: Workflow) => {
    setCurrentWorkflow(workflow);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2.5">
        <h2 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-2xl md:text-3xl lg:text-[40px] tracking-[0] leading-[normal]">
          Workflow Builder
        </h2>
        <p className="[font-family:'DM_Sans_18pt-Regular',Helvetica] font-normal text-[#808080] text-sm md:text-base lg:text-lg tracking-[0] leading-6 md:leading-8">
          Create custom workflows tailored to your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <Card className="lg:col-span-1 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                My Workflows
              </CardTitle>
              <Button
                size="sm"
                onClick={createNewWorkflow}
                className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentWorkflow?.id === workflow.id
                      ? "bg-app-secondary/10 border-app-secondary"
                      : "bg-white border-[#e4e4e4] hover:border-app-secondary"
                  }`}
                  onClick={() => loadWorkflow(workflow)}
                >
                  <div className="font-medium text-[#003d2b]">{workflow.name}</div>
                  <div className="text-sm text-[#808080] mt-1">
                    {workflow.industry} • {workflow.useCase}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={workflow.isActive ? "default" : "secondary"}>
                      {workflow.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-[#808080]">
                      {workflow.workflowSteps.length} steps
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workflow Editor */}
        <Card className="lg:col-span-2 bg-[#fcfcfc] rounded-[20px] border-[0.8px] border-solid border-[#e4e4e4]">
          {currentWorkflow ? (
            <>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-lg">
                    {currentWorkflow.id ? "Edit Workflow" : "New Workflow"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setCurrentWorkflow(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Basic Info */}
                <div className="flex flex-col gap-4">
                  <div>
                    <Label htmlFor="workflow-name">Workflow Name</Label>
                    <Input
                      id="workflow-name"
                      value={currentWorkflow.name}
                      onChange={(e) =>
                        setCurrentWorkflow({ ...currentWorkflow, name: e.target.value })
                      }
                      placeholder="e.g., E-commerce Checkout Flow"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="workflow-description">Description</Label>
                    <Textarea
                      id="workflow-description"
                      value={currentWorkflow.description || ""}
                      onChange={(e) =>
                        setCurrentWorkflow({ ...currentWorkflow, description: e.target.value })
                      }
                      placeholder="Describe your workflow..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={currentWorkflow.industry}
                        onValueChange={(value) =>
                          setCurrentWorkflow({ ...currentWorkflow, industry: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind.value} value={ind.value}>
                              {ind.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="use-case">Use Case</Label>
                      <Select
                        value={currentWorkflow.useCase}
                        onValueChange={(value) =>
                          setCurrentWorkflow({ ...currentWorkflow, useCase: value })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {useCases.map((uc) => (
                            <SelectItem key={uc.value} value={uc.value}>
                              {uc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Workflow Steps */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg font-semibold">Workflow Steps</Label>
                    <Button size="sm" onClick={addStep} variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Step
                    </Button>
                  </div>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={currentWorkflow.workflowSteps.map((step) => step.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-3">
                        {currentWorkflow.workflowSteps.map((step, index) => (
                          <SortableStepItem
                            key={step.id}
                            step={step}
                            index={index}
                            onEdit={() => {
                              setEditingStep(step);
                              setShowStepForm(true);
                            }}
                            onDelete={() => deleteStep(step.id)}
                          />
                        ))}
                        {currentWorkflow.workflowSteps.length === 0 && (
                          <div className="text-center py-8 text-[#808080]">
                            No steps added yet. Click "Add Step" to get started.
                          </div>
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={saveWorkflow}
                    disabled={loading}
                    className="flex-1 bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Workflow"}
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentWorkflow(null)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-[#808080] text-lg mb-4">No workflow selected</p>
              <Button
                onClick={createNewWorkflow}
                className="bg-[linear-gradient(128deg,rgba(39,174,96,1)_0%,rgba(0,82,204,1)_100%)] hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Workflow
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Step Editor Modal */}
      {showStepForm && editingStep && currentWorkflow && (
        <StepEditorModal
          step={editingStep}
          onSave={(updates) => {
            updateStep(editingStep.id, updates);
            setShowStepForm(false);
            setEditingStep(null);
          }}
          onClose={() => {
            setShowStepForm(false);
            setEditingStep(null);
          }}
        />
      )}
    </div>
  );
};

interface SortableStepItemProps {
  step: WorkflowStep;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

const SortableStepItem = ({ step, index, onEdit, onDelete }: SortableStepItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-[#e4e4e4] hover:border-app-secondary transition-colors"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-5 h-5 text-[#808080]" />
      </div>
      <div className="w-8 h-8 flex items-center justify-center bg-app-secondary text-white rounded-full font-semibold">
        {step.order}
      </div>
      <div className="flex-1">
        <div className="font-medium text-[#003d2b]">{step.name}</div>
        <div className="text-sm text-[#808080]">
          {stepTypes.find((t) => t.value === step.type)?.label || step.type}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

interface StepEditorModalProps {
  step: WorkflowStep;
  onSave: (updates: Partial<WorkflowStep>) => void;
  onClose: () => void;
}

const StepEditorModal = ({ step, onSave, onClose }: StepEditorModalProps) => {
  const [formData, setFormData] = useState<WorkflowStep>(step);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-[20px] p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="[font-family:'Suisse_Intl-SemiBold',Helvetica] font-semibold text-[#003d2b] text-xl mb-4">
          Edit Step
        </h3>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="step-name">Step Name</Label>
            <Input
              id="step-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="step-type">Step Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: WorkflowStep['type']) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stepTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="step-config">Configuration (JSON)</Label>
            <Textarea
              id="step-config"
              value={JSON.stringify(formData.config, null, 2)}
              onChange={(e) => {
                try {
                  const config = JSON.parse(e.target.value);
                  setFormData({ ...formData, config });
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              className="mt-1 font-mono text-sm"
              rows={6}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Button onClick={handleSave} className="flex-1 bg-app-secondary hover:opacity-90">
            Save
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

