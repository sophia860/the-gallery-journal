import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { PAYMENT_CONFIG, PRICING } from '../config/payments';

// Initialize Stripe
let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(PAYMENT_CONFIG.stripe.publishableKey);
  }
  return stripePromise;
};

// Payment types
export type PaymentType = 'subscription' | 'one-time';
export type PaymentMethod = 'stripe' | 'paypal';

export interface PaymentDetails {
  amount: number;
  currency: string;
  type: PaymentType;
  description: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  subscriptionId?: string;
  error?: string;
}

/**
 * Process a Stripe card payment (one-time or subscription)
 */
export async function processStripePayment(
  cardElement: StripeCardElement,
  paymentDetails: PaymentDetails
): Promise<PaymentResult> {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      return { success: false, error: 'Stripe failed to load' };
    }

    if (paymentDetails.type === 'subscription') {
      // For subscriptions, we need to create a subscription via backend
      // This is a placeholder - in production, call your backend API
      console.log('Creating Stripe subscription:', paymentDetails);
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            subscriptionId: `sub_${Math.random().toString(36).substr(2, 9)}`,
          });
        }, 1500);
      });
    } else {
      // For one-time payments, create a PaymentIntent via backend
      console.log('Creating Stripe payment:', paymentDetails);
      
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            transactionId: `pi_${Math.random().toString(36).substr(2, 9)}`,
          });
        }, 1500);
      });
    }
  } catch (error: any) {
    console.error('Stripe payment error:', error);
    return { success: false, error: error.message || 'Payment failed' };
  }
}

/**
 * Process a PayPal payment (one-time or subscription)
 */
export async function processPayPalPayment(
  paymentDetails: PaymentDetails
): Promise<PaymentResult> {
  try {
    console.log('Processing PayPal payment:', paymentDetails);
    
    // PayPal SDK will handle the UI flow
    // This is called after PayPal approval
    
    // Simulate API call to capture payment
    return new Promise((resolve) => {
      setTimeout(() => {
        if (paymentDetails.type === 'subscription') {
          resolve({
            success: true,
            subscriptionId: `I-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
          });
        } else {
          resolve({
            success: true,
            transactionId: `PAY-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
          });
        }
      }, 1500);
    });
  } catch (error: any) {
    console.error('PayPal payment error:', error);
    return { success: false, error: error.message || 'Payment failed' };
  }
}

/**
 * Validate card details
 */
export function validateCardDetails(
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string,
  cvc: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation
  if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
    errors.push('Invalid card number');
  }
  
  if (!expiryMonth || !expiryYear) {
    errors.push('Invalid expiry date');
  } else {
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(expiryYear);
    const expMonth = parseInt(expiryMonth);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      errors.push('Card has expired');
    }
  }
  
  if (!cvc || cvc.length < 3) {
    errors.push('Invalid CVC');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Format card number with spaces
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\s/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ');
}

/**
 * Get card type from number
 */
export function getCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  
  return 'unknown';
}

/**
 * Load PayPal SDK dynamically
 */
export function loadPayPalSDK(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).paypal) {
      resolve((window as any).paypal);
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYMENT_CONFIG.paypal.clientId}&currency=${PAYMENT_CONFIG.currency}&intent=capture&vault=true`;
    script.onload = () => {
      resolve((window as any).paypal);
    };
    script.onerror = () => {
      reject(new Error('Failed to load PayPal SDK'));
    };
    document.body.appendChild(script);
  });
}

/**
 * Save payment method for future use
 */
export async function savePaymentMethod(
  method: PaymentMethod,
  details: any
): Promise<{ success: boolean; error?: string }> {
  try {
    // In production, save to backend
    console.log('Saving payment method:', method, details);
    
    // Store in localStorage for demo
    const saved = localStorage.getItem('saved_payment_methods') || '[]';
    const methods = JSON.parse(saved);
    methods.push({ method, details, savedAt: new Date().toISOString() });
    localStorage.setItem('saved_payment_methods', JSON.stringify(methods));
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Get saved payment methods
 */
export function getSavedPaymentMethods(): any[] {
  try {
    const saved = localStorage.getItem('saved_payment_methods') || '[]';
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

/**
 * Calculate processing fee (for display purposes)
 */
export function calculateProcessingFee(amount: number, method: PaymentMethod): number {
  // Stripe: 2.9% + $0.30
  // PayPal: 3.49% + $0.49
  if (method === 'stripe') {
    return Math.round((amount * 0.029 + 0.30) * 100) / 100;
  } else {
    return Math.round((amount * 0.0349 + 0.49) * 100) / 100;
  }
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}
