import { Router } from 'express';
import { createHash, randomBytes } from 'crypto';
import { storage } from '../storage';
import { requireDeveloperAuth } from '../middleware/apiAuth';
import { insertDeveloperAccountSchema, insertApiKeySchema } from '../shared/schema.ts';
import { z } from 'zod';
import { workflowService } from '../services/workflow-service';
import { webhookService } from '../services/webhook-service';

const router = Router();

// Apply authentication middleware to all developer routes
router.use(requireDeveloperAuth);

// Get developer account
router.get('/account', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    res.json(account);
  } catch (error) {
    console.error('Error fetching developer account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create developer account
router.post('/account', async (req, res) => {
  try {
    const existingAccount = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (existingAccount) {
      return res.status(400).json({ error: 'Developer account already exists' });
    }

    const validatedData = insertDeveloperAccountSchema.parse(req.body);
    const account = await storage.createDeveloperAccount({
      ...validatedData,
      userId: req.user!.id,
      status: 'approved', // Auto-approve developer accounts
      approvedAt: new Date(), // Set approval timestamp
    });

    res.status(201).json(account);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating developer account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get API keys
router.get('/api-keys', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const apiKeys = await storage.getApiKeysByDeveloperId(account.id);
    
    // Remove sensitive data before sending
    const safeKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      keyPrefix: key.keyPrefix,
      permissions: key.permissions,
      isActive: key.isActive,
      lastUsed: key.lastUsed,
      expiresAt: key.expiresAt,
      createdAt: key.createdAt,
      revokedAt: key.revokedAt
    }));

    res.json(safeKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new API key
router.post('/api-keys', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    if (account.status !== 'approved') {
      return res.status(403).json({ error: 'Developer account must be approved to create API keys' });
    }

    const validatedData = insertApiKeySchema.parse(req.body);
    
    // Generate secure API key
    const apiKeyValue = `tvk_${randomBytes(32).toString('hex')}`;
    const keyHash = createHash('sha256').update(apiKeyValue).digest('hex');
    const keyPrefix = apiKeyValue.substring(0, 12);

    const apiKey = await storage.createApiKey({
      developerId: account.id,
      name: validatedData.name,
      keyHash,
      keyPrefix,
      permissions: Array.isArray(validatedData.permissions) ? validatedData.permissions : [],
      expiresAt: validatedData.expiresAt || undefined
    });

    // Return the full key value only once
    res.status(201).json({
      id: apiKey.id,
      name: apiKey.name,
      key: apiKeyValue, // This is shown only once
      keyPrefix: apiKey.keyPrefix,
      permissions: apiKey.permissions,
      expiresAt: apiKey.expiresAt,
      createdAt: apiKey.createdAt
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Revoke API key
router.delete('/api-keys/:keyId', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const keyId = parseInt(req.params.keyId);
    if (isNaN(keyId)) {
      return res.status(400).json({ error: 'Invalid key ID' });
    }

    // Verify the key belongs to this developer
    const apiKeys = await storage.getApiKeysByDeveloperId(account.id);
    const keyExists = apiKeys.some(key => key.id === keyId);
    
    if (!keyExists) {
      return res.status(404).json({ error: 'API key not found' });
    }

    const revokedKey = await storage.revokeApiKey(keyId);
    res.json({ message: 'API key revoked successfully', key: revokedKey });
  } catch (error) {
    console.error('Error revoking API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get usage statistics
router.get('/usage/stats', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const period = req.query.period as 'day' | 'week' | 'month' || 'month';
    const stats = await storage.getApiUsageStats(account.id, period);

    res.json({
      period,
      stats,
      quota: {
        monthly: account.monthlyQuota ?? 0,
        current: account.currentUsage ?? 0,
        remaining: (account.monthlyQuota ?? 0) - (account.currentUsage ?? 0)
      }
    });
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get usage logs
router.get('/usage/logs', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = (page - 1) * limit;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (req.query.startDate) {
      startDate = new Date(req.query.startDate as string);
    }
    if (req.query.endDate) {
      endDate = new Date(req.query.endDate as string);
    }

    const logs = await storage.getApiUsageByDeveloper(account.id, startDate, endDate);
    
    // Apply pagination
    const paginatedLogs = logs.slice(offset, offset + limit);

    res.json({
      logs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: logs.length,
        totalPages: Math.ceil(logs.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching usage logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== Workflow Configuration Routes ====================

// Get all workflows for developer
router.get('/workflows', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const filters: any = {};
    if (req.query.industry) filters.industry = req.query.industry as string;
    if (req.query.useCase) filters.useCase = req.query.useCase as string;
    if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';

    const workflows = await workflowService.listWorkflows(account.id, filters);
    res.json(workflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single workflow
router.get('/workflows/:id', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const workflowId = parseInt(req.params.id);
    if (isNaN(workflowId)) {
      return res.status(400).json({ error: 'Invalid workflow ID' });
    }

    const workflow = await workflowService.getWorkflow(workflowId, account.id);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Error fetching workflow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create workflow
router.post('/workflows', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const workflow = await workflowService.createWorkflow(account.id, req.body);
    res.status(201).json(workflow);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating workflow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update workflow
router.put('/workflows/:id', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const workflowId = parseInt(req.params.id);
    if (isNaN(workflowId)) {
      return res.status(400).json({ error: 'Invalid workflow ID' });
    }

    const workflow = await workflowService.updateWorkflow(workflowId, account.id, req.body);
    res.json(workflow);
  } catch (error) {
    if (error instanceof Error && error.message === 'Workflow not found or access denied') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error updating workflow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete workflow
router.delete('/workflows/:id', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const workflowId = parseInt(req.params.id);
    if (isNaN(workflowId)) {
      return res.status(400).json({ error: 'Invalid workflow ID' });
    }

    await workflowService.deleteWorkflow(workflowId, account.id);
    res.json({ message: 'Workflow deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Workflow not found or access denied') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error deleting workflow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get industry templates
router.get('/templates', async (req, res) => {
  try {
    const filters: any = {};
    if (req.query.industry) filters.industry = req.query.industry as string;
    if (req.query.useCase) filters.useCase = req.query.useCase as string;

    const templates = await workflowService.getIndustryTemplates(filters);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single template
router.get('/templates/:id', async (req, res) => {
  try {
    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const template = await workflowService.getTemplate(templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create workflow from template
router.post('/templates/:id/create-workflow', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const templateId = parseInt(req.params.id);
    if (isNaN(templateId)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const workflow = await workflowService.createFromTemplate(account.id, templateId, req.body);
    res.status(201).json(workflow);
  } catch (error) {
    if (error instanceof Error && error.message === 'Template not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error creating workflow from template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== Webhook Configuration Routes ====================

// Get all webhooks
router.get('/webhooks', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const webhooks = await webhookService.listWebhooks(account.id);
    res.json(webhooks);
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single webhook
router.get('/webhooks/:id', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const webhookId = parseInt(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ error: 'Invalid webhook ID' });
    }

    const webhook = await webhookService.getWebhook(webhookId, account.id);
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    res.json(webhook);
  } catch (error) {
    console.error('Error fetching webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create webhook
router.post('/webhooks', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const webhook = await webhookService.createWebhook(account.id, req.body);
    res.status(201).json(webhook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error creating webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update webhook
router.put('/webhooks/:id', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const webhookId = parseInt(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ error: 'Invalid webhook ID' });
    }

    const webhook = await webhookService.updateWebhook(webhookId, account.id, req.body);
    res.json(webhook);
  } catch (error) {
    if (error instanceof Error && error.message === 'Webhook not found or access denied') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error updating webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete webhook
router.delete('/webhooks/:id', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const webhookId = parseInt(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ error: 'Invalid webhook ID' });
    }

    await webhookService.deleteWebhook(webhookId, account.id);
    res.json({ message: 'Webhook deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Webhook not found or access denied') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Error deleting webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get webhook delivery logs
router.get('/webhooks/:id/deliveries', async (req, res) => {
  try {
    const account = await storage.getDeveloperAccountByUserId(req.user!.id);
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const webhookId = parseInt(req.params.id);
    if (isNaN(webhookId)) {
      return res.status(400).json({ error: 'Invalid webhook ID' });
    }

    // Verify webhook belongs to developer
    const webhook = await webhookService.getWebhook(webhookId, account.id);
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }

    const limit = parseInt(req.query.limit as string) || 50;
    const deliveries = await webhookService.getDeliveryLogs(webhookId, account.id, limit);
    res.json(deliveries);
  } catch (error) {
    console.error('Error fetching webhook deliveries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;