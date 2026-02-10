import { useState } from 'react';
import { Check, Sparkles, Crown, Heart, BookOpen, Feather, Pen } from 'lucide-react';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';
import { useAuth } from '../contexts/AuthContext';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon: React.ReactNode;
}

const tiers: PricingTier[] = [
  {
    id: 'community',
    name: 'Community',
    price: 0,
    interval: 'month',
    tagline: 'A place at the table',
    description: 'Step into The Gallery. Browse curated collections, submit your voice to our editors, and join a community that values the written word.',
    features: [
      'Full access to The Collection',
      '3 editorial submissions per month',
      'Follow your favorite voices',
      'Save pieces to return to',
      'Monthly literary newsletter',
    ],
    cta: 'Enter The Gallery',
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    id: 'member',
    name: 'Member',
    price: 12,
    interval: 'month',
    tagline: 'A room of your own',
    description: 'Claim your Studio. Craft without limits, submit freely, and build your presence in a space designed for serious writers.',
    features: [
      'Everything in Community',
      'Your private Writer\'s Studio',
      'Unlimited editorial submissions',
      'Priority review from our editors',
      'Your personal Room & portfolio',
      'Insights into your readership',
    ],
    cta: 'Claim Your Studio',
    popular: true,
    icon: <Pen className="w-6 h-6" />,
  },
  {
    id: 'patron',
    name: 'Patron',
    price: 30,
    interval: 'month',
    tagline: 'Champion of the literary arts',
    description: 'Sustain the craft. Your patronage supports emerging writers, enriches our editorial work, and deepens your connection to literature.',
    features: [
      'Everything in Member',
      'Unlimited submissions with priority',
      'Quarterly feedback sessions',
      'Early access to new features',
      'Private patron-only gatherings',
      'Curated digital anthologies',
      'Custom room aesthetics',
      'Badge of literary patronage',
      'Direct support for emerging writers',
    ],
    cta: 'Become a Patron',
    icon: <Crown className="w-6 h-6 text-[#C4A265]" />,
  },
];

const additionalServices = [
  {
    name: 'Editorial Consultation',
    price: 45,
    type: 'one piece',
    description: 'Work one-on-one with our editors on a single piece',
    features: [
      'Line-by-line commentary',
      'Structural guidance',
      'Revision roadmap',
      'Returned within 7 days',
    ],
  },
  {
    name: 'Additional Submissions',
    price: 5,
    type: 'per piece',
    description: 'Extra submissions beyond your monthly allowance',
    features: [
      'Full editorial consideration',
      'Response within 90 days',
      'Personal feedback included',
      'Eligible for publication',
    ],
  },
  {
    name: 'Quarterly Anthology',
    price: 15,
    type: 'seasonal',
    description: 'Our finest work, collected and designed',
    features: [
      'PDF & ePub editions',
      'Editor\'s introduction',
      'Author conversations',
      'Heirloom typography',
      'Yours to keep forever',
    ],
  },
];

export function PricingPage() {
  const { user } = useAuth();
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');

  const getPrice = (tier: PricingTier) => {
    if (tier.price === 0) return 'Free';
    if (billingInterval === 'year') {
      const yearlyPrice = tier.price * 12 * 0.85;
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
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#F5F0EB] to-[#FAF8F5]">
      <GalleryNav />

      {/* Hero */}
      <section className="pt-40 pb-24 px-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#C4A265_0%,_transparent_70%)] opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Feather className="w-8 h-8 text-[#C4A265]" />
          </div>
          <h1 className="font-['Cardo'] text-8xl text-[#2C1810] mb-6 italic leading-tight">
            Everyone Has<br />a Voice
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#C4A265] to-transparent"></div>
          </div>
          <p className="font-['Libre_Baskerville'] text-2xl text-[#8B7355] leading-relaxed max-w-3xl mx-auto mb-4">
            The Gallery is free to join. Submit your work, read exceptional writing, and connect with a community that honors the craft.
          </p>
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]/70 leading-relaxed max-w-2xl mx-auto italic">
            Memberships offer deeper tools and support—not gatekeeping.
          </p>
        </div>
      </section>

      {/* Testimonial */}
      <section className="max-w-4xl mx-auto px-8 mb-20">
        <div className="bg-white/50 backdrop-blur-sm border-2 border-[#E0D8D0] rounded-lg p-8 md:p-12 text-center">
          <p className="font-['Libre_Baskerville'] text-lg text-[#2C1810] leading-loose italic mb-6">
            "The Gallery feels less like a platform and more like a sanctuary. It's where I write without the noise of metrics, where my work lives and breathes in a space that treats it with care."
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-[#C4A265]"></div>
            <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">
              Sarah M., Poet
            </span>
            <div className="h-px w-12 bg-[#C4A265]"></div>
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-8 mb-16 flex justify-center">
        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border-2 border-[#E0D8D0] shadow-sm rounded-full p-1.5">
          <button
            onClick={() => setBillingInterval('month')}
            className={`px-8 py-3 rounded-full font-['Cardo'] text-base transition-all ${
              billingInterval === 'month'
                ? 'bg-[#E11D48] text-white shadow-md'
                : 'text-[#8B7355] hover:text-[#2C1810]'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={`px-8 py-3 rounded-full font-['Cardo'] text-base transition-all ${
              billingInterval === 'year'
                ? 'bg-[#E11D48] text-white shadow-md'
                : 'text-[#8B7355] hover:text-[#2C1810]'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-[#C4A265] text-white px-2 py-1 rounded-full">
              15% off
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Tiers */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`group relative bg-gradient-to-b from-white to-[#FAF7F2] border-2 rounded-2xl p-8 transition-all duration-300 ${
                tier.popular
                  ? 'border-[#E11D48] shadow-2xl scale-105 md:-translate-y-4'
                  : 'border-[#E0D8D0] hover:border-[#C4A265] hover:shadow-xl hover:-translate-y-2'
              }`}
            >
              {/* Decorative corner accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${tier.popular ? 'opacity-10' : 'opacity-5'} overflow-hidden rounded-tr-2xl`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${tier.popular ? 'from-[#E11D48]' : 'from-[#C4A265]'} to-transparent`}></div>
              </div>

              {tier.popular && (
                <div className="mb-6 text-center">
                  <span className="inline-block px-4 py-1.5 bg-[#E11D48]/10 border border-[#E11D48]/20 rounded-full text-xs text-[#E11D48] font-['Courier_New'] uppercase tracking-wider">
                    Most chosen by writers
                  </span>
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${tier.popular ? 'bg-[#E11D48]/10 text-[#E11D48]' : 'bg-[#C4A265]/10 text-[#8B7355]'}`}>
                  {tier.icon}
                </div>
                <div>
                  <h3 className="font-['Cardo'] text-3xl text-[#2C1810]">{tier.name}</h3>
                  <p className="font-['Cardo'] text-sm text-[#8B7355] italic">{tier.tagline}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="font-['Cardo'] text-6xl text-[#2C1810] mb-2">
                  {getPrice(tier)}
                </div>
                {getSavings(tier) && (
                  <div className="text-xs text-[#C4A265] font-['Courier_New'] tracking-wider">
                    {getSavings(tier)}
                  </div>
                )}
              </div>

              <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] mb-8 leading-relaxed">
                {tier.description}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-[#E0D8D0] to-transparent"></div>
                <div className="w-1.5 h-1.5 bg-[#C4A265] rotate-45"></div>
                <div className="h-px flex-1 bg-gradient-to-l from-[#E0D8D0] to-transparent"></div>
              </div>

              <ul className="space-y-3 mb-10">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#C4A265] flex-shrink-0 mt-0.5" />
                    <span className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810] leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={user ? '/studio' : '/signup'}
                className={`block w-full py-4 text-center font-['Cardo'] text-base tracking-wide transition-all duration-300 ${
                  tier.popular
                    ? 'bg-[#E11D48] text-white hover:bg-[#C01040] shadow-lg hover:shadow-xl'
                    : 'bg-white border-2 border-[#E0D8D0] text-[#2C1810] hover:border-[#E11D48] hover:text-[#E11D48]'
                }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="bg-gradient-to-br from-white to-[#FAF7F2] border-2 border-[#E0D8D0] rounded-2xl p-12 md:p-16">
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 bg-[#C4A265]/10 rounded-full mb-6">
              <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-widest">
                Our Philosophy
              </span>
            </div>
            <h2 className="font-['Cardo'] text-4xl text-[#2C1810] italic mb-6">
              A Different Kind of Platform
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-[#8B7355] font-['Libre_Baskerville'] text-base leading-loose">
            <div>
              <p className="mb-4">
                No follower counts. No algorithmic feeds. No pressure to post daily to stay visible.
              </p>
              <p>
                The Gallery is built on the belief that writing deserves space—to exist, to breathe, to be discovered slowly and read carefully.
              </p>
            </div>
            <div>
              <p className="mb-4">
                Every membership sustains our editorial team, supports emerging writers, and keeps The Gallery ad-free and calm.
              </p>
              <p className="italic">
                Your subscription isn't just for you—it's for everyone who needs a quieter place to write and read.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="max-w-7xl mx-auto px-8 pb-24">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#C4A265] to-transparent"></div>
            <Sparkles className="w-6 h-6 text-[#C4A265]" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#C4A265] to-transparent"></div>
          </div>
          <h2 className="font-['Cardo'] text-5xl text-[#2C1810] mb-4 italic">
            À La Carte
          </h2>
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355] max-w-2xl mx-auto">
            Additional services to deepen your practice
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {additionalServices.map((service) => (
            <div
              key={service.name}
              className="group bg-white border-2 border-[#E0D8D0] rounded-xl p-8 hover:border-[#C4A265] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">{service.name}</h3>
                <div className="text-right">
                  <div className="font-['Cardo'] text-3xl text-[#E11D48]">${service.price}</div>
                  <div className="text-xs text-[#8B7355] font-['Courier_New'] tracking-wider">
                    {service.type}
                  </div>
                </div>
              </div>

              <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] mb-6 leading-relaxed">
                {service.description}
              </p>

              <ul className="space-y-2.5 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C4A265] flex-shrink-0 mt-0.5" />
                    <span className="font-[family-name:var(--font-ui)] text-sm text-[#2C1810]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button className="w-full py-3 bg-white border-2 border-[#E0D8D0] text-[#2C1810] hover:border-[#E11D48] hover:text-[#E11D48] transition-all font-['Cardo'] text-sm tracking-wider group-hover:shadow-md">
                Learn More
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Writer Support CTA */}
      <section className="max-w-5xl mx-auto px-8 pb-24">
        <div className="relative bg-gradient-to-br from-[#E11D48] via-[#C01040] to-[#B91C1C] rounded-2xl p-12 md:p-16 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"></div>
          <div className="relative">
            <Heart className="w-16 h-16 mx-auto mb-8 opacity-90" />
            <h2 className="font-['Cardo'] text-5xl mb-6 italic">
              Support Writers Directly
            </h2>
            <p className="font-['Libre_Baskerville'] text-xl mb-10 opacity-95 leading-relaxed max-w-2xl mx-auto">
              Leave tips on pieces that move you. Every dollar goes directly to the writer—no platform fees, no middlemen.
            </p>
            <a
              href="/community-wall"
              className="inline-block px-10 py-5 bg-white text-[#E11D48] hover:bg-[#FAF8F5] transition-all font-['Cardo'] text-lg tracking-wide shadow-xl hover:shadow-2xl"
            >
              Discover Writers to Support
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-8 pb-24">
        <div className="text-center mb-12">
          <h2 className="font-['Cardo'] text-5xl text-[#2C1810] italic">
            Questions
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 hover:border-[#C4A265] transition-all">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-3">
              Can everyone really submit for free?
            </h3>
            <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed">
              Yes. Every community member gets 3 editorial submissions per month. Memberships add unlimited submissions and priority responses—they're about depth and tools, not access.
            </p>
          </div>

          <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 hover:border-[#C4A265] transition-all">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-3">
              What happens to my work if I cancel?
            </h3>
            <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed">
              Your Room stays live. Your published work remains accessible. You simply return to the Community tier—still full access, with 3 submissions per month.
            </p>
          </div>

          <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 hover:border-[#C4A265] transition-all">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-3">
              How do tips work?
            </h3>
            <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed">
              Readers can leave one-time tips ($3, $5, $10, or custom) on any piece. 100% goes to the writer. We handle processing and send monthly payouts.
            </p>
          </div>

          <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 hover:border-[#C4A265] transition-all">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-3">
              What's the editorial response time?
            </h3>
            <p className="font-['Libre_Baskerville'] text-base text-[#8B7355] leading-relaxed">
              Community members receive responses within 90 days. Members and Patrons get priority review—typically within 30 days. All submissions receive personal consideration.
            </p>
          </div>
        </div>
      </section>

      <GalleryFooter />
    </div>
  );
}