import { useState } from 'react';
import { Check, Sparkles, Crown, Heart, BookOpen, Zap } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { useAuth } from '../contexts/AuthContext';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const tiers: PricingTier[] = [
  {
    id: 'reader',
    name: 'Reader',
    price: 0,
    interval: 'month',
    description: 'For those who love to discover great writing',
    features: [
      'Access to The Collection Gallery',
      'Read all published works',
      'Follow favorite writers',
      'Bookmark pieces',
      '3 free submissions/month',
      'Monthly newsletter',
    ],
    cta: 'Start Reading',
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    id: 'writer',
    name: 'Writer',
    price: 12,
    interval: 'month',
    description: 'For writers ready to share their voice',
    features: [
      'Everything in Reader',
      'Your own Writer\'s Studio',
      'Unlimited submissions',
      'Priority editorial response',
      'Personal Room & portfolio',
      'Community Wall access',
      'Gallery Wall publication',
      'Analytics dashboard',
    ],
    cta: 'Start Writing',
    popular: true,
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 'patron',
    name: 'Patron',
    price: 30,
    interval: 'month',
    description: 'Support the literary arts & get exclusive access',
    features: [
      'Everything in Writer',
      'Unlimited submissions',
      'Priority editorial response',
      'Quarterly editorial feedback',
      'Early access to new features',
      'Exclusive patron-only events',
      'Digital anthology collection',
      'Custom room themes',
      'Patron badge on profile',
      'Support emerging writers',
    ],
    cta: 'Become a Patron',
    icon: <Crown className="w-6 h-6 text-[#C4A265]" />,
  },
];

const additionalServices = [
  {
    name: 'Editorial Feedback',
    price: 45,
    type: 'one-time',
    description: 'Detailed feedback on one piece from our editorial team',
    features: [
      'Line-by-line commentary',
      'Structural analysis',
      '30-minute video call',
      'Revision suggestions',
      '7-day turnaround',
    ],
  },
  {
    name: 'Workshop Submission',
    price: 5,
    type: 'per-submission',
    description: 'Submit work for review (non-members only)',
    features: [
      'Professional consideration',
      'Response within 90 days',
      'Personalized rejection notes',
      'Eligible for publication',
    ],
  },
  {
    name: 'Curated Anthology',
    price: 15,
    type: 'one-time',
    description: 'Digital collection of our best quarterly works',
    features: [
      'PDF & ePub formats',
      'Exclusive editor\'s note',
      'Author interviews',
      'Beautiful typography',
      'DRM-free',
    ],
  },
];

export function PricingPage() {
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const getPrice = (tier: PricingTier) => {
    if (tier.price === 0) return 'Free';
    if (billingInterval === 'year') {
      const yearlyPrice = tier.price * 12 * 0.85; // 15% discount
      return `$${Math.round(yearlyPrice)}/year`;
    }
    return `$${tier.price}/mo`;
  };

  const getSavings = (tier: PricingTier) => {
    if (tier.price === 0 || billingInterval === 'month') return null;
    const savings = tier.price * 12 * 0.15;
    return `Save $${Math.round(savings)}`;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <GalleryNav />

      {/* Hero */}
      <section className="pt-40 pb-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-['Cardo'] text-7xl text-[#2C1810] mb-6 italic">
            Invest in Literary Excellence
          </h1>
          <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] leading-relaxed max-w-2xl mx-auto">
            Choose the plan that supports your creative journey. Every membership supports writers and keeps the literary arts thriving.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-8 mb-12 flex justify-center">
        <div className="inline-flex items-center gap-3 bg-white border border-[#E0D8D0] rounded-full p-1">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-6 py-2 rounded-full font-['Cardo'] text-sm transition-all ${
              billingInterval === 'month'
                ? 'bg-[#E11D48] text-white'
                : 'text-[#8B7355] hover:text-[#2C1810]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-6 py-2 rounded-full font-['Cardo'] text-sm transition-all ${
              billingInterval === 'year'
                ? 'bg-[#E11D48] text-white'
                : 'text-[#8B7355] hover:text-[#2C1810]'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-[#C4A265] text-white px-2 py-0.5 rounded-full">
              Save 15%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Tiers */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`bg-white border-2 rounded-lg p-8 relative ${
                tier.popular
                  ? 'border-[#E11D48] shadow-xl scale-105'
                  : 'border-[#E0D8D0] hover:border-[#C4A265] transition-all'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#E11D48] text-white px-4 py-1 rounded-full text-xs font-['Courier_New'] tracking-wider">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`${tier.popular ? 'text-[#E11D48]' : 'text-[#8B7355]'}`}>
                  {tier.icon}
                </div>
                <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">{tier.name}</h3>
              </div>

              <div className="mb-4">
                <div className="font-['Cardo'] text-5xl text-[#2C1810] mb-1">
                  {getPrice(tier)}
                </div>
                {getSavings(tier) && (
                  <div className="text-xs text-[#C4A265] font-['Courier_New']">
                    {getSavings(tier)}
                  </div>
                )}
              </div>

              <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] mb-6 leading-relaxed">
                {tier.description}
              </p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#C4A265] flex-shrink-0 mt-0.5" />
                    <span className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={user ? '/studio' : '/signup'}
                className={`block w-full py-4 text-center font-['Cardo'] text-sm tracking-wider transition-all ${
                  tier.popular
                    ? 'bg-[#E11D48] text-white hover:bg-[#C01040]'
                    : 'bg-white border-2 border-[#E0D8D0] text-[#2C1810] hover:border-[#E11D48] hover:text-[#E11D48]'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Services */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-[#C4A265]"></div>
            <Zap className="w-5 h-5 text-[#C4A265]" />
            <div className="h-px w-16 bg-[#C4A265]"></div>
          </div>
          <h2 className="font-['Cardo'] text-5xl text-[#2C1810] mb-4 italic">
            À La Carte Services
          </h2>
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
            Professional services to elevate your work
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {additionalServices.map((service) => (
            <div
              key={service.name}
              className="bg-white border border-[#E0D8D0] rounded-lg p-8 hover:border-[#C4A265] transition-all"
            >
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">{service.name}</h3>
                <div className="text-right">
                  <div className="font-['Cardo'] text-3xl text-[#E11D48]">${service.price}</div>
                  <div className="text-xs text-[#8B7355] font-['Courier_New']">
                    {service.type}
                  </div>
                </div>
              </div>

              <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#C4A265] flex-shrink-0 mt-0.5" />
                    <span className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 bg-white border-2 border-[#E0D8D0] text-[#2C1810] hover:border-[#E11D48] hover:text-[#E11D48] transition-all font-['Cardo'] text-sm tracking-wider">
                Purchase
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Writer Support CTA */}
      <section className="max-w-4xl mx-auto px-8 pb-20">
        <div className="bg-gradient-to-br from-[#E11D48] to-[#C01040] rounded-lg p-12 text-center text-white">
          <Heart className="w-12 h-12 mx-auto mb-6" />
          <h2 className="font-['Cardo'] text-4xl mb-4 italic">Support a Writer Directly</h2>
          <p className="font-['Libre_Baskerville'] text-lg mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">
            Leave tips on your favorite pieces or become a monthly patron of writers you love. 100% goes directly to the writer.
          </p>
          <a
            href="/community-wall"
            className="inline-block px-8 py-4 bg-white text-[#E11D48] hover:bg-[#FAF8F5] transition-colors font-['Cardo'] text-sm tracking-wider"
          >
            Discover Writers to Support
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-8 pb-20">
        <h2 className="font-['Cardo'] text-4xl text-[#2C1810] text-center mb-12 italic">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          <div className="bg-white border border-[#E0D8D0] rounded-lg p-6">
            <h3 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">
              Can I switch plans anytime?
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
              Yes! Upgrade or downgrade at any time. Changes take effect immediately, and we'll prorate any differences.
            </p>
          </div>

          <div className="bg-white border border-[#E0D8D0] rounded-lg p-6">
            <h3 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">
              Do you charge submission fees?
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
              Everyone gets 3 free submissions per month! Writer and Patron members enjoy unlimited submissions with priority editorial response. Additional submissions for free users are $5 each.
            </p>
          </div>

          <div className="bg-white border border-[#E0D8D0] rounded-lg p-6">
            <h3 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">
              How do writer tips work?
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
              Readers can leave one-time tips ($3, $5, $10, or custom amount) on any piece. 100% goes to the writer. We handle all payment processing.
            </p>
          </div>

          <div className="bg-white border border-[#E0D8D0] rounded-lg p-6">
            <h3 className="font-['Cardo'] text-xl text-[#2C1810] mb-2">
              What's included in editorial feedback?
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed">
              Our editors provide comprehensive line edits, structural suggestions, and a 30-minute video call to discuss your piece. Turnaround is 7 days.
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}