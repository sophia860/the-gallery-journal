import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { GalleryNav } from '../components/GalleryNav';
import { Footer } from '../components/Footer';

// Stripe Pricing Table configuration
const STRIPE_PRICING_TABLE_ID = 'prctbl_1SyzEcAkMm4rwALvscHB4hIf';
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Rh81cAkMm4rwALvxUZDLZjwyhJPUDmPk90DPPPWl8y2cS4pfFNyzM17GarTIgvzkAdLpzSFJ1mBusFdG8L3qozC009p9i9Vwg';

// Extend JSX for stripe-pricing-table web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'pricing-table-id': string;
          'publishable-key': string;
          'client-reference-id'?: string;
          'customer-email'?: string;
        },
        HTMLElement
      >;
    }
  }
}

export function PricingPage() {
  const { user } = useAuth();
  const { hasActiveSubscription, openCustomerPortal } = useSubscription();

  // Load Stripe pricing table script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <GalleryNav />

      <div className="flex-1 px-8 py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-['Cardo'] text-6xl text-[#2C2C2C] mb-4 italic">
              Join the Writers' Salon
            </h1>
            <p className="font-['Libre_Baskerville'] text-xl text-[#717171] mb-2 italic">
              Community Wall Membership
            </p>
            <div className="border-t border-[#E0D8D0] w-24 mx-auto my-8" />
            <p className="font-['Libre_Baskerville'] text-base text-[#717171] leading-relaxed max-w-2xl mx-auto">
              Get access to our private community wall, share your writing, appreciate others' work, and grow together in our intimate literary space.
            </p>
          </div>

          {/* Active Subscriber Message */}
          {hasActiveSubscription ? (
            <div className="text-center py-12 border border-[#E0D8D0] rounded-lg bg-white mb-12">
              <div className="text-4xl mb-4">&#10003;</div>
              <h2 className="font-['Cardo'] text-2xl text-[#2C2C2C] mb-2">
                You're a member!
              </h2>
              <p className="font-['Inter'] text-[#717171] mb-6">
                You have an active Community Wall membership.
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="/community-wall"
                  className="px-6 py-3 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm tracking-wider"
                >
                  ENTER THE SALON
                </a>
                <button
                  onClick={openCustomerPortal}
                  className="px-6 py-3 border-2 border-[#E0D8D0] text-[#2C2C2C] hover:border-[#C4918A] transition-colors font-['Courier_New'] text-sm tracking-wider"
                >
                  MANAGE SUBSCRIPTION
                </button>
              </div>
            </div>
          ) : (
            /* Stripe Pricing Table */
            <div className="mb-12">
              <stripe-pricing-table
                pricing-table-id={STRIPE_PRICING_TABLE_ID}
                publishable-key={STRIPE_PUBLISHABLE_KEY}
                client-reference-id={user?.id || ''}
                customer-email={user?.email || ''}
              />
            </div>
          )}

          {/* What's Included */}
          <div className="border-t border-[#E0D8D0] pt-12 mt-8">
            <h2 className="font-['Cardo'] text-3xl text-[#2C2C2C] text-center mb-8 italic">
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl mb-3">&#9998;</div>
                <h3 className="font-['Libre_Baskerville'] text-lg text-[#2C2C2C] mb-2">
                  Share Your Work
                </h3>
                <p className="font-['Inter'] text-sm text-[#717171]">
                  Submit your writing to the community wall for feedback and appreciation.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-3">&#9829;</div>
                <h3 className="font-['Libre_Baskerville'] text-lg text-[#2C2C2C] mb-2">
                  Appreciate Others
                </h3>
                <p className="font-['Inter'] text-sm text-[#717171]">
                  Heart and engage with community members' writing in our intimate salon.
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-3">&#9733;</div>
                <h3 className="font-['Libre_Baskerville'] text-lg text-[#2C2C2C] mb-2">
                  Grow Together
                </h3>
                <p className="font-['Inter'] text-sm text-[#717171]">
                  Join a supportive community of writers committed to the craft.
                </p>
              </div>
            </div>
          </div>

          {/* Existing subscriber link */}
          {!hasActiveSubscription && (
            <div className="text-center mt-12">
              <p className="font-['Inter'] text-sm text-[#717171]">
                Already a member?{' '}
                <button
                  onClick={openCustomerPortal}
                  className="text-[#E11D48] hover:underline"
                >
                  Manage your subscription
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
