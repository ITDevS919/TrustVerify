/**
 * Seed Subscription Plans
 * Creates default subscription plans in the database
 */

import { db } from '../db.ts';
import { subscriptionPlans } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';

const plans = [
  {
    name: 'free',
    displayName: 'Free',
    description: 'Perfect for getting started with TrustVerify',
    price: '0.00',
    currency: 'USD',
    interval: 'month',
    stripePriceId: null, // Set this after creating in Stripe
    stripeProductId: null, // Set this after creating in Stripe
    features: [
      'Up to 100 API calls/month',
      'Basic fraud detection',
      'Email support',
      'Community access',
    ],
    limits: {
      apiCalls: 100,
      workflows: 1,
      webhooks: 1,
      transactions: 10,
    },
    isActive: true,
    isPublic: true,
    sortOrder: 1,
  },
  {
    name: 'basic',
    displayName: 'Basic',
    description: 'For small businesses and startups',
    price: '29.00',
    currency: 'USD',
    interval: 'month',
    stripePriceId: null, // Set this after creating in Stripe
    stripeProductId: null, // Set this after creating in Stripe
    features: [
      'Up to 10,000 API calls/month',
      'Advanced fraud detection',
      'Priority email support',
      '5 custom workflows',
      '10 webhooks',
      'Unlimited transactions',
      'Basic analytics',
    ],
    limits: {
      apiCalls: 10000,
      workflows: 5,
      webhooks: 10,
      transactions: -1, // Unlimited
    },
    isActive: true,
    isPublic: true,
    sortOrder: 2,
  },
  {
    name: 'pro',
    displayName: 'Pro',
    description: 'For growing businesses with higher volume',
    price: '99.00',
    currency: 'USD',
    interval: 'month',
    stripePriceId: null, // Set this after creating in Stripe
    stripeProductId: null, // Set this after creating in Stripe
    features: [
      'Up to 100,000 API calls/month',
      'AI-powered fraud detection',
      'Priority support (24/7)',
      'Unlimited workflows',
      'Unlimited webhooks',
      'Unlimited transactions',
      'Advanced analytics',
      'Custom integrations',
      'SLA guarantee',
    ],
    limits: {
      apiCalls: 100000,
      workflows: -1, // Unlimited
      webhooks: -1, // Unlimited
      transactions: -1, // Unlimited
    },
    isActive: true,
    isPublic: true,
    sortOrder: 3,
  },
  {
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: '499.00',
    currency: 'USD',
    interval: 'month',
    stripePriceId: null, // Set this after creating in Stripe
    stripeProductId: null, // Set this after creating in Stripe
    features: [
      'Unlimited API calls',
      'AI-powered fraud detection',
      'Dedicated account manager',
      '24/7 phone & email support',
      'Unlimited workflows',
      'Unlimited webhooks',
      'Unlimited transactions',
      'Advanced analytics & reporting',
      'Custom integrations',
      'SLA guarantee (99.9% uptime)',
      'On-premise deployment option',
      'Custom training & onboarding',
    ],
    limits: {
      apiCalls: -1, // Unlimited
      workflows: -1, // Unlimited
      webhooks: -1, // Unlimited
      transactions: -1, // Unlimited
    },
    isActive: true,
    isPublic: true,
    sortOrder: 4,
  },
];

async function seedSubscriptionPlans() {
  try {
    console.log('Starting to seed subscription plans...');

    for (const plan of plans) {
      // Check if plan already exists
      const existing = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.name, plan.name))
        .limit(1);

      if (existing.length > 0) {
        console.log(`Plan "${plan.name}" already exists, skipping...`);
        continue;
      }

      // Insert plan
      await db.insert(subscriptionPlans).values({
        ...plan,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`✓ Created subscription plan: ${plan.displayName}`);
    }

    console.log('✅ Successfully seeded subscription plans!');
    console.log('\n📝 Next steps:');
    console.log('1. Create products and prices in Stripe Dashboard');
    console.log('2. Update stripePriceId and stripeProductId in the database');
    console.log('3. Configure webhook endpoint: POST /api/subscriptions/webhook');
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
    process.exit(1);
  }
}

// Run seeder
seedSubscriptionPlans();

