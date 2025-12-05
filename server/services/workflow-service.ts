/**
 * Workflow Service
 * Manages industry-specific workflow configurations and customizations
 */

import { storage } from '../storage';
import { z } from 'zod';

export interface WorkflowStep {
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

export interface WorkflowConfiguration {
  id?: number;
  developerId: number;
  name: string;
  description?: string;
  industry: string;
  useCase: string;
  workflowSteps: WorkflowStep[];
  rules: Record<string, any>;
  triggers: string[];
  isActive: boolean;
  isTemplate?: boolean;
  version?: number;
}

export interface IndustryTemplate {
  id?: number;
  name: string;
  industry: string;
  useCase: string;
  description?: string;
  workflowSteps: WorkflowStep[];
  defaultRules: Record<string, any>;
  recommendedSettings: Record<string, any>;
  documentation?: string;
  codeExamples: Array<{
    language: string;
    code: string;
    description: string;
  }>;
}

const workflowStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['kyc', 'fraud_check', 'escrow', 'dispute', 'payment', 'custom']),
  order: z.number(),
  config: z.record(z.any()),
  conditions: z.object({
    if: z.string().optional(),
    then: z.string().optional(),
    else: z.string().optional(),
  }).optional(),
});

const workflowConfigurationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  industry: z.string().min(1),
  useCase: z.string().min(1),
  workflowSteps: z.array(workflowStepSchema),
  rules: z.record(z.any()).default({}),
  triggers: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

export class WorkflowService {
  /**
   * Create a new workflow configuration
   */
  async createWorkflow(
    developerId: number,
    data: Omit<WorkflowConfiguration, 'id' | 'developerId'>
  ): Promise<WorkflowConfiguration> {
    const validated = workflowConfigurationSchema.parse(data);
    
    const workflow = await storage.createWorkflowConfiguration({
      developerId,
      ...validated,
      isTemplate: false,
      version: 1,
    });

    return workflow;
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(workflowId: number, developerId: number): Promise<WorkflowConfiguration | null> {
    const workflow = await storage.getWorkflowConfiguration(workflowId);
    
    if (!workflow || workflow.developerId !== developerId) {
      return null;
    }

    return workflow;
  }

  /**
   * List all workflows for a developer
   */
  async listWorkflows(developerId: number, filters?: {
    industry?: string;
    useCase?: string;
    isActive?: boolean;
  }): Promise<WorkflowConfiguration[]> {
    return await storage.listWorkflowConfigurations(developerId, filters);
  }

  /**
   * Update workflow configuration
   */
  async updateWorkflow(
    workflowId: number,
    developerId: number,
    updates: Partial<WorkflowConfiguration>
  ): Promise<WorkflowConfiguration> {
    // Verify ownership
    const existing = await this.getWorkflow(workflowId, developerId);
    if (!existing) {
      throw new Error('Workflow not found or access denied');
    }

    const validated = workflowConfigurationSchema.partial().parse(updates);
    
    return await storage.updateWorkflowConfiguration(workflowId, {
      ...validated,
      version: (existing.version || 1) + 1,
    });
  }

  /**
   * Delete workflow
   */
  async deleteWorkflow(workflowId: number, developerId: number): Promise<void> {
    const existing = await this.getWorkflow(workflowId, developerId);
    if (!existing) {
      throw new Error('Workflow not found or access denied');
    }

    await storage.deleteWorkflowConfiguration(workflowId);
  }

  /**
   * Get industry templates
   */
  async getIndustryTemplates(filters?: {
    industry?: string;
    useCase?: string;
  }): Promise<IndustryTemplate[]> {
    return await storage.listIndustryTemplates(filters);
  }

  /**
   * Get specific template
   */
  async getTemplate(templateId: number): Promise<IndustryTemplate | null> {
    return await storage.getIndustryTemplate(templateId);
  }

  /**
   * Create workflow from template
   */
  async createFromTemplate(
    developerId: number,
    templateId: number,
    customizations?: Partial<WorkflowConfiguration>
  ): Promise<WorkflowConfiguration> {
    const template = await this.getTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    return await this.createWorkflow(developerId, {
      name: customizations?.name || `${template.name} (Custom)`,
      description: customizations?.description || template.description,
      industry: template.industry,
      useCase: template.useCase,
      workflowSteps: customizations?.workflowSteps || template.workflowSteps,
      rules: { ...template.defaultRules, ...(customizations?.rules || {}) },
      triggers: customizations?.triggers || [],
      isActive: true,
    });
  }

  /**
   * Validate workflow configuration
   */
  validateWorkflow(workflow: WorkflowConfiguration): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!workflow.workflowSteps || workflow.workflowSteps.length === 0) {
      errors.push('Workflow must have at least one step');
    }

    // Check for duplicate step IDs
    const stepIds = workflow.workflowSteps.map(s => s.id);
    const duplicates = stepIds.filter((id, index) => stepIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push(`Duplicate step IDs: ${duplicates.join(', ')}`);
    }

    // Validate step order
    const orders = workflow.workflowSteps.map(s => s.order).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        errors.push('Step orders must be sequential starting from 1');
        break;
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const workflowService = new WorkflowService();

