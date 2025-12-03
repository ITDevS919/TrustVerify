import { Router } from 'express';
import { createHash, randomBytes } from 'crypto';
import { storage } from '../storage';
import { requireDeveloperAuth } from '../middleware/apiAuth';
import { insertDeveloperAccountSchema, insertApiKeySchema } from '../shared/schema.ts';
import { z } from 'zod';

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
      userId: req.user!.id
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

export default router;