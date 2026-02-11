import { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Check, Loader } from 'lucide-react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, processStripePayment, processPayPalPayment, loadPayPalSDK, formatCurrency, PaymentType } from '../../services/PaymentService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  type: PaymentType;
  description: string;
  planName?: string;
  interval?: string;
  onSuccess: (result: any) => void;
  onError?: (error: string) => void;
}

// Stripe payment form component (must be inside Elements provider)
function StripePaymentForm({ 
  amount, 
  currency, 
  type, 
  description,
  onSuccess,
  onError,
  onProcessing
}: {
  amount: number;
  currency: string;
  type: PaymentType;
  description: string;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
  onProcessing: (processing: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      return;
    }

    onProcessing(true);
    setError('');

    const result = await processStripePayment(cardElement, {
      amount,
      currency,
      type,
      description,
    });

    onProcessing(false);

    if (result.success) {
      onSuccess(result);
    } else {
      const errorMsg = result.error || 'Payment failed';
      setError(errorMsg);
      onError(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-['Inter'] text-[#2C1810] mb-2">
          Card Information
        </label>
        <div className="p-4 border-2 border-[#E0D8D0] rounded-lg bg-[#FAF8F5]">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#2C1810',
                  fontFamily: "'Libre Baskerville', serif",
                  '::placeholder': {
                    color: '#8B7355',
                  },
                },
                invalid: {
                  color: '#E11D48',
                },
              },
            }}
          />
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-[#E11D48]/10 border border-[#E11D48] rounded-lg">
          <p className="text-sm text-[#E11D48] font-['Inter']">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe}
        className="w-full py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        Pay {formatCurrency(amount, currency)}
      </button>
    </form>
  );
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  currency = 'USD',
  type,
  description,
  planName,
  interval,
  onSuccess,
  onError
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const stripePromise = getStripe();

  useEffect(() => {
    if (isOpen && paymentMethod === 'paypal') {
      loadPayPalSDK()
        .then((paypal) => {
          setPaypalLoaded(true);
          if (paypalRef.current && !paypalRef.current.hasChildNodes()) {
            renderPayPalButton(paypal);
          }
        })
        .catch((error) => {
          console.error('Failed to load PayPal:', error);
          onError?.('Failed to load PayPal. Please try Stripe.');
        });
    }
  }, [isOpen, paymentMethod]);

  const renderPayPalButton = (paypal: any) => {
    if (!paypalRef.current) return;

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        if (type === 'subscription') {
          // For subscriptions, create subscription
          return actions.subscription.create({
            plan_id: 'P-DEMO-PLAN-ID', // Replace with actual plan ID
          });
        } else {
          // For one-time payments, create order
          return actions.order.create({
            purchase_units: [{
              description: description,
              amount: {
                currency_code: currency,
                value: amount.toFixed(2),
              },
            }],
          });
        }
      },
      onApprove: async (data: any, actions: any) => {
        setProcessing(true);
        
        if (type === 'subscription') {
          const result = await processPayPalPayment({
            amount,
            currency,
            type,
            description,
            metadata: { subscriptionId: data.subscriptionID },
          });
          
          setProcessing(false);
          
          if (result.success) {
            onSuccess(result);
          } else {
            onError?.(result.error || 'Payment failed');
          }
        } else {
          const order = await actions.order.capture();
          
          const result = await processPayPalPayment({
            amount,
            currency,
            type,
            description,
            metadata: { orderId: order.id },
          });
          
          setProcessing(false);
          
          if (result.success) {
            onSuccess(result);
          } else {
            onError?.(result.error || 'Payment failed');
          }
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        setProcessing(false);
        onError?.('PayPal payment failed');
      },
    }).render(paypalRef.current);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-8"
      onClick={onClose}
    >
      <div 
        className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E0D8D0]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-['Cardo'] text-2xl text-[#2C1810] italic">
              {type === 'subscription' ? 'Subscribe' : 'Complete Payment'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F0EB] rounded-lg transition-all"
            >
              <X className="w-5 h-5 text-[#8B7355]" />
            </button>
          </div>
          
          {/* Plan details */}
          <div className="space-y-1">
            {planName && (
              <p className="font-['Cardo'] text-lg text-[#2C1810]">{planName}</p>
            )}
            <p className="text-sm text-[#8B7355] font-['Inter']">{description}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-['Cardo'] text-3xl text-[#2C1810]">
                {formatCurrency(amount, currency)}
              </span>
              {interval && (
                <span className="text-sm text-[#8B7355] font-['Inter']">
                  / {interval}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Payment form */}
        <div className="p-6">
          {/* Payment method selector */}
          <div className="mb-6">
            <label className="block text-sm font-['Inter'] text-[#2C1810] mb-3">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`p-4 border-2 rounded-lg transition-all font-['Inter'] text-sm flex flex-col items-center gap-2 ${
                  paymentMethod === 'stripe'
                    ? 'border-[#8A9A7B] bg-[#8A9A7B]/10'
                    : 'border-[#E0D8D0] hover:border-[#8A9A7B]/50'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                Credit Card
                {paymentMethod === 'stripe' && (
                  <Check className="w-4 h-4 text-[#8A9A7B]" />
                )}
              </button>
              
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 border-2 rounded-lg transition-all font-['Inter'] text-sm flex flex-col items-center gap-2 ${
                  paymentMethod === 'paypal'
                    ? 'border-[#8A9A7B] bg-[#8A9A7B]/10'
                    : 'border-[#E0D8D0] hover:border-[#8A9A7B]/50'
                }`}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#003087">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.653h8.53c2.87 0 4.865.616 5.934 1.833 1.033 1.18 1.354 2.816 1.012 5.146-.008.056-.02.11-.03.165a7.3 7.3 0 0 1-1.702 3.575c-.76.86-1.742 1.495-2.913 1.89a11.8 11.8 0 0 1-3.958.65h-.997a.77.77 0 0 0-.76.653l-.82 5.178-.024.15a.64.64 0 0 1-.633.74H7.076z"/>
                </svg>
                PayPal
                {paymentMethod === 'paypal' && (
                  <Check className="w-4 h-4 text-[#8A9A7B]" />
                )}
              </button>
            </div>
          </div>

          {/* Stripe form */}
          {paymentMethod === 'stripe' && (
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                amount={amount}
                currency={currency}
                type={type}
                description={description}
                onSuccess={onSuccess}
                onError={(error) => onError?.(error)}
                onProcessing={setProcessing}
              />
            </Elements>
          )}

          {/* PayPal button */}
          {paymentMethod === 'paypal' && (
            <div>
              <div ref={paypalRef} className="mb-4"></div>
              {!paypalLoaded && (
                <div className="flex items-center justify-center py-8">
                  <Loader className="w-6 h-6 text-[#8A9A7B] animate-spin" />
                </div>
              )}
            </div>
          )}

          {/* Terms checkbox */}
          <div className="mt-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-[#8A9A7B] border-[#E0D8D0] rounded focus:ring-[#8A9A7B]"
            />
            <label htmlFor="terms" className="text-xs text-[#8B7355] font-['Inter'] leading-relaxed">
              I agree to the{' '}
              <a href="/terms" className="text-[#8A9A7B] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-[#8A9A7B] hover:underline">
                Privacy Policy
              </a>
              {type === 'subscription' && (
                <>
                  . This subscription will automatically renew each {interval} until cancelled.
                </>
              )}
            </label>
          </div>

          {/* Processing indicator */}
          {processing && (
            <div className="mt-4 p-4 bg-[#8A9A7B]/10 border border-[#8A9A7B] rounded-lg">
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 text-[#8A9A7B] animate-spin" />
                <p className="text-sm text-[#8A9A7B] font-['Inter']">
                  Processing payment...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#FAF8F5] border-t border-[#E0D8D0]">
          <div className="flex items-center gap-2 text-xs text-[#8B7355] font-['Inter']">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure payment powered by Stripe and PayPal
          </div>
        </div>
      </div>
    </div>
  );
}
