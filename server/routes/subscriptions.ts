/**
 * Subscription Routes
 * Handles subscription management endpoints
 */

import { Router, Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { subscriptionService } from '../services/subscription-service';
import Stripe from 'stripe';

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated || !(req as any).isAuthenticated()) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

const router = Router();

// Get all available subscription plans
router.get('/plans', async (_req, res) => {
  try {
    const plans = await storage.listSubscriptionPlans({ isActive: true, isPublic: true });
    res.json(plans);
  } catch (error: any) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({ error: 'Failed to fetch subscription plans' });
  }
});

// Get user's current subscription
router.get('/current', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await storage.getUserSubscriptionByUserId(req.user.id);
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Get plan details
    const plan = await storage.getSubscriptionPlan(subscription.planId);
    
    res.json({
      ...subscription,
      plan,
    });
  } catch (error: any) {
    console.error('Error fetching current subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Create a new subscription
router.post('/create', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { planId, paymentMethodId, trialDays } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    const subscription = await subscriptionService.createSubscription({
      userId: req.user.id,
      planId: parseInt(planId),
      paymentMethodId,
      trialDays: trialDays ? parseInt(trialDays) : undefined,
    });

    // Get plan details
    const plan = await storage.getSubscriptionPlan(subscription.planId);

    res.status(201).json({
      ...subscription,
      plan,
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    res.status(400).json({ error: error.message || 'Failed to create subscription' });
  }
});

// Create checkout session
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { planId, successUrl, cancelUrl } = req.body;

    if (!planId) {
      return res.status(400).json({ error: 'Plan ID is required' });
    }

    // Frontend should always provide these URLs, but fallback to environment variable if not provided
    const defaultFrontendUrl = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
    
    if (!successUrl && !defaultFrontendUrl) {
      return res.status(400).json({ error: 'successUrl is required or FRONTEND_URL must be set' });
    }
    if (!cancelUrl && !defaultFrontendUrl) {
      return res.status(400).json({ error: 'cancelUrl is required or FRONTEND_URL must be set' });
    }

    const finalSuccessUrl = successUrl || `${defaultFrontendUrl}/subscription/success`;
    const finalCancelUrl = cancelUrl || `${defaultFrontendUrl}/subscription/cancel`;

    const sessionUrl = await subscriptionService.createCheckoutSession(
      req.user.id,
      parseInt(planId),
      finalSuccessUrl,
      finalCancelUrl
    );

    res.json({ url: sessionUrl });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(400).json({ error: error.message || 'Failed to create checkout session' });
  }
});

// Update subscription (change plan or quantity)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscriptionId = parseInt(req.params.id);
    const subscription = await storage.getUserSubscription(subscriptionId);

    if (!subscription || subscription.userId !== req.user.id) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const { planId, quantity } = req.body;

    const updatedSubscription = await subscriptionService.updateSubscription({
      subscriptionId,
      planId: planId ? parseInt(planId) : undefined,
      quantity: quantity ? parseInt(quantity) : undefined,
    });

    // Get plan details
    const plan = await storage.getSubscriptionPlan(updatedSubscription.planId);

    res.json({
      ...updatedSubscription,
      plan,
    });
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    res.status(400).json({ error: error.message || 'Failed to update subscription' });
  }
});

// Cancel subscription
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscriptionId = parseInt(req.params.id);
    const subscription = await storage.getUserSubscription(subscriptionId);

    if (!subscription || subscription.userId !== req.user.id) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const { immediately } = req.body;

    const canceledSubscription = await subscriptionService.cancelSubscription(
      subscriptionId,
      immediately === true
    );

    // Get plan details
    const plan = await storage.getSubscriptionPlan(canceledSubscription.planId);

    res.json({
      ...canceledSubscription,
      plan,
    });
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    res.status(400).json({ error: error.message || 'Failed to cancel subscription' });
  }
});

// Resume subscription
router.post('/:id/resume', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscriptionId = parseInt(req.params.id);
    const subscription = await storage.getUserSubscription(subscriptionId);

    if (!subscription || subscription.userId !== req.user.id) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const resumedSubscription = await subscriptionService.resumeSubscription(subscriptionId);

    // Get plan details
    const plan = await storage.getSubscriptionPlan(resumedSubscription.planId);

    res.json({
      ...resumedSubscription,
      plan,
    });
  } catch (error: any) {
    console.error('Error resuming subscription:', error);
    res.status(400).json({ error: error.message || 'Failed to resume subscription' });
  }
});

// Get subscription invoices
router.get('/invoices', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const invoices = await storage.listSubscriptionInvoices(req.user.id, limit);

    res.json(invoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Get subscription usage
router.get('/usage', requireAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const subscription = await storage.getUserSubscriptionByUserId(req.user.id);
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const periodStart = req.query.periodStart 
      ? new Date(req.query.periodStart as string)
      : new Date(new Date().setDate(1)); // Start of current month
    const periodEnd = req.query.periodEnd
      ? new Date(req.query.periodEnd as string)
      : new Date(); // Current date

    const usage = await storage.listSubscriptionUsage(subscription.id, periodStart, periodEnd);

    res.json(usage);
  } catch (error: any) {
    console.error('Error fetching usage:', error);
    res.status(500).json({ error: 'Failed to fetch usage' });
  }
});

// Stripe webhook endpoint
// Note: This endpoint should use raw body for signature verification
// In Express, you may need to configure body parser to not parse this route
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send('Missing signature or webhook secret');
  }

  let event: Stripe.Event;

  try {
    // For Express, you may need to use req.rawBody if available
    // Otherwise, ensure the body is a Buffer or string
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    event = Stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await subscriptionService.handleWebhookEvent(event);
    res.json({ received: true });
  } catch (error: any) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: 'Failed to handle webhook event' });
  }
});

export default router;

