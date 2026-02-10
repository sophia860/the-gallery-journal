'use client';

import { useState } from 'react';

interface PaywallProps {
  onSubscribe?: () => void;
}

export function Paywall({ onSubscribe }: PaywallProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType: selectedPlan }),
      });
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="paywall-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      margin: '24px auto',
      maxWidth: '600px',
    }}>
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
        Join the Community Wall
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '32px', maxWidth: '400px' }}>
        Get exclusive access to our creative community, share your work, and connect with fellow artists.
      </p>
      
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <button
          onClick={() => setSelectedPlan('monthly')}
          style={{
            padding: '16px 24px',
            border: selectedPlan === 'monthly' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: selectedPlan === 'monthly' ? '#eff6ff' : 'white',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>$8/month</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Billed monthly</div>
        </button>
        <button
          onClick={() => setSelectedPlan('yearly')}
          style={{
            padding: '16px 24px',
            border: selectedPlan === 'yearly' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: selectedPlan === 'yearly' ? '#eff6ff' : 'white',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontWeight: 'bold' }}>$80/year</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Save $16</div>
        </button>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          padding: '14px 32px',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '8px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Loading...' : 'Subscribe Now'}
      </button>
    </div>
  );
}
