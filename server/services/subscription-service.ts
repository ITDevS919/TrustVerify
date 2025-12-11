/**
 * Subscription Service
 * Handles subscription management with Stripe integration
 */

import Stripe from "stripe";
import { storage } from "../storage";
import type { User, SubscriptionPlan, UserSubscription } from "../shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required for subscription services');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export interface CreateSubscriptionParams {
  userId: number;
  planId: number;
  paymentMethodId?: string;
  trialDays?: number;
}

export interface UpdateSubscriptionParams {
  subscriptionId: number;
  planId?: number;
  quantity?: number;
}

export class SubscriptionService {
  /**
   * Create a Stripe customer for a user
   */
  async createStripeCustomer(user: User, email: string): Promise<Stripe.Customer> {
    return await stripe.customers.create({
      email,
      metadata: {
        userId: user.id.toString(),
        username: user.username || '',
      },
    });
  }

  /**
   * Get or create Stripe customer for a user
   */
  async getOrCreateStripeCustomer(user: User, email: string, existingCustomerId?: string): Promise<Stripe.Customer> {
    if (existingCustomerId) {
      try {
        return await stripe.customers.retrieve(existingCustomerId) as Stripe.Customer;
      } catch (error) {
        // Customer not found, create new one
      }
    }
    return await this.createStripeCustomer(user, email);
  }

  /**
   * Create a new subscription
   */
  async createSubscription(params: CreateSubscriptionParams): Promise<UserSubscription> {
    const { userId, planId, paymentMethodId, trialDays } = params;

    // Get the plan
    const plan = await storage.getSubscriptionPlan(planId);
    if (!plan || !plan.isActive) {
      throw new Error('Subscription plan not found or inactive');
    }

    if (!plan.stripePriceId) {
      throw new Error('Subscription plan does not have a Stripe price ID');
    }

    // Get user
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if user already has an active subscription
    const existingSubscription = await storage.getUserSubscriptionByUserId(userId);
    if (existingSubscription && existingSubscription.status === 'active') {
      throw new Error('User already has an active subscription');
    }

    // Get or create Stripe customer
    const customer = await this.getOrCreateStripeCustomer(
      user,
      user.email,
      existingSubscription?.stripeCustomerId || undefined
    );

    // Create subscription in Stripe
    const subscriptionParams: Stripe.SubscriptionCreateParams = {
      customer: customer.id,
      items: [{ price: plan.stripePriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    };

    // Add trial period if specified
    if (trialDays && trialDays > 0) {
      subscriptionParams.trial_period_days = trialDays;
    }

    // Attach payment method if provided
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    const stripeSubscription = await stripe.subscriptions.create(subscriptionParams);

    // Calculate period dates
    const currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    const trialStart = stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : undefined;
    const trialEnd = stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : undefined;

    // Create subscription in database
    const subscription = await storage.createUserSubscription({
      userId,
      planId,
      status: stripeSubscription.status === 'trialing' ? 'trialing' : 'active',
      stripeSubscriptionId: stripeSubscription.id,
      stripeCustomerId: customer.id,
      currentPeriodStart,
      currentPeriodEnd,
      trialStart,
      trialEnd,
      quantity: stripeSubscription.items.data[0]?.quantity || 1,
      metadata: {
        stripeSubscription: stripeSubscription.id,
        stripeCustomer: customer.id,
      },
    });

    return subscription;
  }

  /**
   * Update an existing subscription
   */
  async updateSubscription(params: UpdateSubscriptionParams): Promise<UserSubscription> {
    const { subscriptionId, planId, quantity } = params;

    const subscription = await storage.getUserSubscription(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new Error('Subscription does not have a Stripe subscription ID');
    }

    const updates: Stripe.SubscriptionUpdateParams = {};

    // Update plan if provided
    if (planId) {
      const newPlan = await storage.getSubscriptionPlan(planId);
      if (!newPlan || !newPlan.stripePriceId) {
        throw new Error('New plan not found or does not have a Stripe price ID');
      }

      // Get current subscription from Stripe
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      
      // Update subscription items
      updates.items = [{
        id: stripeSubscription.items.data[0].id,
        price: newPlan.stripePriceId,
      }];
    }

    // Update quantity if provided
    if (quantity !== undefined) {
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
      updates.items = [{
        id: stripeSubscription.items.data[0].id,
        quantity,
      }];
    }

    // Update in Stripe
    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      updates
    );

    // Update in database
    const updatedSubscription = await storage.updateUserSubscription(subscriptionId, {
      planId: planId || subscription.planId,
      quantity: quantity || subscription.quantity,
      currentPeriodStart: new Date(updatedStripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(updatedStripeSubscription.current_period_end * 1000),
      status: updatedStripeSubscription.status as any,
    });

    return updatedSubscription!;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: number, cancelImmediately: boolean = false): Promise<UserSubscription> {
    const subscription = await storage.getUserSubscription(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new Error('Subscription does not have a Stripe subscription ID');
    }

    if (cancelImmediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
      return await storage.updateUserSubscription(subscriptionId, {
        status: 'canceled',
        cancelAtPeriodEnd: false,
        canceledAt: new Date(),
      }) || subscription;
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
      return await storage.cancelUserSubscription(subscriptionId, new Date()) || subscription;
    }
  }

  /**
   * Resume a canceled subscription
   */
  async resumeSubscription(subscriptionId: number): Promise<UserSubscription> {
    const subscription = await storage.getUserSubscription(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new Error('Subscription does not have a Stripe subscription ID');
    }

    // Remove cancellation in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    // Update in database
    return await storage.updateUserSubscription(subscriptionId, {
      status: 'active',
      cancelAtPeriodEnd: false,
      canceledAt: null,
    }) || subscription;
  }

  /**
   * Get subscription checkout session URL
   */
  async createCheckoutSession(userId: number, planId: number, successUrl: string, cancelUrl: string): Promise<string> {
    const plan = await storage.getSubscriptionPlan(planId);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    // If the plan has no Stripe price (e.g., free tier or Stripe not configured),
    // create the subscription locally and return the success URL so the client
    // can continue without redirecting to Stripe Checkout.
    if (!plan.stripePriceId) {
      const now = new Date();
      const oneMonthFromNow = new Date(now);
      oneMonthFromNow.setMonth(now.getMonth() + 1);

      await storage.createUserSubscription({
        userId,
        planId,
        status: 'active',
        stripeSubscriptionId: null,
        stripeCustomerId: null,
        currentPeriodStart: now,
        currentPeriodEnd: oneMonthFromNow,
        cancelAtPeriodEnd: false,
        canceledAt: null,
        trialStart: null,
        trialEnd: null,
        quantity: 1,
        metadata: {
          note: 'Local subscription created without Stripe price ID',
        },
      });

      // No external checkout needed; return a URL the client can navigate to.
      return successUrl;
    }

    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get or create Stripe customer
    const existingSubscription = await storage.getUserSubscriptionByUserId(userId);
    let customerId = existingSubscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await this.getOrCreateStripeCustomer(user, user.email);
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
      },
    });

    return session.url || '';
  }

  /**
   * Handle Stripe webhook event
   */
  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled webhook event type: ${event.type}`);
    }
  }

  private async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await storage.getUserSubscriptionByStripeId(stripeSubscription.id);
    if (!subscription) {
      console.error(`Subscription not found for Stripe ID: ${stripeSubscription.id}`);
      return;
    }

    const plan = await storage.getSubscriptionPlanByStripePriceId(
      stripeSubscription.items.data[0]?.price.id || ''
    );

    await storage.updateUserSubscription(subscription.id, {
      status: stripeSubscription.status as any,
      planId: plan?.id || subscription.planId,
      currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null,
      trialStart: stripeSubscription.trial_start ? new Date(stripeSubscription.trial_start * 1000) : null,
      trialEnd: stripeSubscription.trial_end ? new Date(stripeSubscription.trial_end * 1000) : null,
      quantity: stripeSubscription.items.data[0]?.quantity || 1,
    });
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription): Promise<void> {
    const subscription = await storage.getUserSubscriptionByStripeId(stripeSubscription.id);
    if (!subscription) {
      return;
    }

    await storage.updateUserSubscription(subscription.id, {
      status: 'canceled',
      canceledAt: new Date(),
    });
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription || typeof invoice.subscription === 'string') {
      return;
    }

    const subscription = await storage.getUserSubscriptionByStripeId(invoice.subscription);
    if (!subscription) {
      return;
    }

    // Create or update invoice record
    const existingInvoice = await storage.getSubscriptionInvoiceByStripeId(invoice.id);
    if (existingInvoice) {
      await storage.updateSubscriptionInvoice(existingInvoice.id, {
        status: 'paid',
        paidAt: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
      });
    } else {
      await storage.createSubscriptionInvoice({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        stripeInvoiceId: invoice.id,
        amount: (invoice.amount_paid / 100).toFixed(2),
        currency: invoice.currency,
        status: 'paid',
        hostedInvoiceUrl: invoice.hosted_invoice_url || undefined,
        invoicePdf: invoice.invoice_pdf || undefined,
        periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : undefined,
        periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : undefined,
        paidAt: invoice.status_transitions.paid_at ? new Date(invoice.status_transitions.paid_at * 1000) : new Date(),
      });
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    if (!invoice.subscription || typeof invoice.subscription === 'string') {
      return;
    }

    const subscription = await storage.getUserSubscriptionByStripeId(invoice.subscription);
    if (!subscription) {
      return;
    }

    // Update subscription status
    await storage.updateUserSubscription(subscription.id, {
      status: 'past_due',
    });

    // Create or update invoice record
    const existingInvoice = await storage.getSubscriptionInvoiceByStripeId(invoice.id);
    if (existingInvoice) {
      await storage.updateSubscriptionInvoice(existingInvoice.id, {
        status: 'open',
      });
    } else {
      await storage.createSubscriptionInvoice({
        subscriptionId: subscription.id,
        userId: subscription.userId,
        stripeInvoiceId: invoice.id,
        amount: (invoice.amount_due / 100).toFixed(2),
        currency: invoice.currency,
        status: 'open',
        hostedInvoiceUrl: invoice.hosted_invoice_url || undefined,
        periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : undefined,
        periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : undefined,
      });
    }
  }
}

export const subscriptionService = new SubscriptionService();

