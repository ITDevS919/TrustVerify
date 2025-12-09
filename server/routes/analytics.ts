/**
 * Analytics & Reporting API Routes
 */

import { Router, Request, Response } from 'express';
import { analyticsService } from '../services/analytics-service';
import { usageBillingTracker } from '../services/usage-billing-tracker';

// Simple requireAuth middleware (inline for now)
// In production, this should use the proper auth middleware
const requireAuth = (req: any, res: any, next: any) => {
  // Check if user is authenticated (for session-based auth)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  // Check for API key (for API-based auth)
  if (req.apiKey && req.developer) {
    return next();
  }
  // Check for JWT token in header
  if (req.user) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

const router = Router();

// All analytics routes require authentication
router.use(requireAuth);

/**
 * GET /api/analytics/verification-volume
 * Get KYC/KYB verification volume statistics
 */
router.get('/verification-volume', async (req: Request, res: Response) => {
  try {
    const periodStart = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const periodEnd = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const stats = await analyticsService.getVerificationVolume(periodStart, periodEnd);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching verification volume:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch verification volume' });
  }
});

/**
 * GET /api/analytics/dispute-rates
 * Get dispute rate statistics
 */
router.get('/dispute-rates', async (req: Request, res: Response) => {
  try {
    const periodStart = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const periodEnd = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const stats = await analyticsService.getDisputeRates(periodStart, periodEnd);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching dispute rates:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch dispute rates' });
  }
});

/**
 * GET /api/analytics/fraud-accuracy
 * Get fraud detection accuracy statistics
 */
router.get('/fraud-accuracy', async (req: Request, res: Response) => {
  try {
    const periodStart = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const periodEnd = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const stats = await analyticsService.getFraudAccuracy(periodStart, periodEnd);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching fraud accuracy:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch fraud accuracy' });
  }
});

/**
 * GET /api/analytics/marketplace-badges
 * Get marketplace trust badge adoption statistics
 */
router.get('/marketplace-badges', async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getMarketplaceBadgeStats();
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching marketplace badge stats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch marketplace badge stats' });
  }
});

/**
 * GET /api/analytics/resolution-times
 * Get dispute resolution time statistics
 */
router.get('/resolution-times', async (req: Request, res: Response) => {
  try {
    const periodStart = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const periodEnd = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const stats = await analyticsService.getResolutionTimes(periodStart, periodEnd);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching resolution times:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch resolution times' });
  }
});

/**
 * GET /api/analytics/hr-onboarding
 * Get HR onboarding completion statistics
 */
router.get('/hr-onboarding', async (req: Request, res: Response) => {
  try {
    const periodStart = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const periodEnd = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const stats = await analyticsService.getHROnboardingStats(periodStart, periodEnd);
    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching HR onboarding stats:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch HR onboarding stats' });
  }
});

/**
 * GET /api/analytics/usage
 * Get usage-based billing summary for current developer
 */
router.get('/usage', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { storage } = await import('../storage');
    const account = await storage.getDeveloperAccountByUserId(req.user.id);
    
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const periodStart = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const periodEnd = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const summary = periodStart && periodEnd
      ? await usageBillingTracker.getUsageSummary(account.id, periodStart, periodEnd)
      : await usageBillingTracker.getCurrentMonthUsage(account.id);

    res.json(summary);
  } catch (error: any) {
    console.error('Error fetching usage summary:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch usage summary' });
  }
});

/**
 * GET /api/analytics/usage/:module
 * Get usage statistics for a specific module
 */
router.get('/usage/:module', async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { storage } = await import('../storage');
    const account = await storage.getDeveloperAccountByUserId(req.user.id);
    
    if (!account) {
      return res.status(404).json({ error: 'Developer account not found' });
    }

    const module = req.params.module as any;
    const periodStart = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const periodEnd = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    if (!periodStart || !periodEnd) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      periodStart = start;
      periodEnd = end;
    }

    const stats = await usageBillingTracker.getModuleUsageStats(
      account.id,
      module,
      periodStart,
      periodEnd
    );

    res.json(stats);
  } catch (error: any) {
    console.error('Error fetching module usage:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch module usage' });
  }
});

export default router;

