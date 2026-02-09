import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface SubscriptionState {
  hasActiveSubscription: boolean;
  subscriptionTier: 'monthly' | 'yearly' | null;
  subscriptionStatus: 'active' | 'trialing' | 'past_due' | 'canceled' | 'none';
  currentPeriodEnd: string | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  openCustomerPortal: () => void;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

const CUSTOMER_PORTAL_URL = 'https://billing.stripe.com/p/login/aEUaHT8Kw5uXbMQ3cc';

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuth();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<'monthly' | 'yearly' | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionState['subscriptionStatus']>('none');
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = async () => {
    if (!user || !accessToken) {
      setHasActiveSubscription(false);
      setSubscriptionTier(null);
      setSubscriptionStatus('none');
      setCurrentPeriodEnd(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/check-subscription`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check subscription status');
      }

      const data = await response.json();

      setHasActiveSubscription(data.active);
      setSubscriptionTier(data.tier || null);
      setSubscriptionStatus(data.status || 'none');
      setCurrentPeriodEnd(data.currentPeriodEnd || null);
    } catch (err) {
      console.error('Error checking subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setHasActiveSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user, accessToken]);

  const openCustomerPortal = () => {
    window.open(CUSTOMER_PORTAL_URL, '_blank');
  };

  const value: SubscriptionState = {
    hasActiveSubscription,
    subscriptionTier,
    subscriptionStatus,
    currentPeriodEnd,
    loading,
    error,
    refreshSubscription: checkSubscription,
    openCustomerPortal,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    console.error('useSubscription must be used within a SubscriptionProvider');
    return {
      hasActiveSubscription: false,
      subscriptionTier: null,
      subscriptionStatus: 'none' as const,
      currentPeriodEnd: null,
      loading: false,
      error: null,
      refreshSubscription: async () => {},
      openCustomerPortal: () => {},
    };
  }
  return context;
}
