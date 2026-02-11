/**
 * Payment Configuration
 * 
 * IMPORTANT: Replace these placeholder keys with your actual Stripe and PayPal keys before launch.
 * 
 * Stripe Keys:
 * - Get from: https://dashboard.stripe.com/apikeys
 * - Use test keys for development (pk_test_...)
 * - Use live keys for production (pk_live_...)
 * 
 * PayPal Keys:
 * - Get from: https://developer.paypal.com/dashboard/applications
 * - Use sandbox client ID for development
 * - Use live client ID for production
 */

export const PAYMENT_CONFIG = {
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_REPLACE_WITH_YOUR_STRIPE_KEY',
    // Example test key format: pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  },
  
  paypal: {
    clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'REPLACE_WITH_YOUR_PAYPAL_CLIENT_ID',
    // Example sandbox format: AZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    // Example live format: AZxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  },
  
  // Currency settings
  currency: 'USD',
  locale: 'en-US',
  
  // Price IDs for Stripe subscriptions (create these in Stripe Dashboard)
  stripePriceIds: {
    gardener_monthly: import.meta.env.VITE_STRIPE_PRICE_GARDENER || 'price_REPLACE_GARDENER',
    greenhouse_monthly: import.meta.env.VITE_STRIPE_PRICE_GREENHOUSE || 'price_REPLACE_GREENHOUSE',
    perennial_monthly: import.meta.env.VITE_STRIPE_PRICE_PERENNIAL || 'price_REPLACE_PERENNIAL',
  },
  
  // PayPal Plan IDs (create these in PayPal Dashboard)
  paypalPlanIds: {
    gardener_monthly: import.meta.env.VITE_PAYPAL_PLAN_GARDENER || 'P-REPLACE_GARDENER',
    greenhouse_monthly: import.meta.env.VITE_PAYPAL_PLAN_GREENHOUSE || 'P-REPLACE_GREENHOUSE',
    perennial_monthly: import.meta.env.VITE_PAYPAL_PLAN_PERENNIAL || 'P-REPLACE_PERENNIAL',
  },
};

// Pricing information
export const PRICING = {
  subscriptions: {
    gardener: {
      name: 'Gardener',
      amount: 8,
      interval: 'month',
      description: 'Unlimited Circles, Propose Grafts, Priority Support',
    },
    greenhouse: {
      name: 'Greenhouse',
      amount: 18,
      interval: 'month',
      description: 'Everything in Gardener + Direct Editor Submissions + Featured Placement',
    },
  },
  
  oneTime: {
    graft_curation: {
      name: 'Graft Curation Fee',
      amount: 8,
      description: 'One-time fee to propose and curate a Graft anthology',
    },
  },
  
  perennial: {
    writer_subscription: {
      name: 'Perennial Subscription',
      amount: 3,
      interval: 'month',
      description: 'Subscribe to this writer\'s exclusive content',
    },
  },
  
  tips: {
    amounts: [1, 3, 5],
    description: 'Support this writer with a tip',
  },
};
