import { Check, Sprout, TrendingUp, Home, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { GardenMainNav } from '../components/GardenMainNav';
import { PaymentModal } from '../components/PaymentModal';
import { PRICING } from '../../config/payments';

export function PricingPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    amount: number;
    planName: string;
    type: 'subscription' | 'one-time';
    description: string;
    interval?: string;
  } | null>(null);

  const handleSelectPlan = (plan: typeof selectedPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (result: any) => {
    console.log('Payment successful:', result);
    setShowPaymentModal(false);
    // Store subscription in localStorage for demo
    if (selectedPlan && selectedPlan.type === 'subscription') {
      localStorage.setItem('subscription_tier', selectedPlan.planName.toLowerCase());
    }
    // Show success message
    alert(`Successfully subscribed to ${selectedPlan?.planName}!`);
    // Redirect to dashboard
    window.location.href = '/my-garden';
  };

  return (
    <div className="min-h-screen bg-[#0f1729] relative overflow-hidden">
      {/* Starfield Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="stars-layer"></div>
        <div className="stars-layer-2"></div>
        <div className="stars-layer-3"></div>
      </div>

      <style>{`
        .stars-layer {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 10% 10%, white, transparent),
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 30% 15%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(3px 3px at 40% 40%, rgba(255, 255, 255, 0.95), transparent),
            radial-gradient(1px 1px at 50% 25%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 70% 50%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 80% 20%, white, transparent),
            radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 15% 60%, rgba(200, 210, 255, 0.9), transparent);
          background-size: 200% 200%;
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 8% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(1px 1px at 18% 55%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 28% 12%, white, transparent),
            radial-gradient(1px 1px at 38% 68%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 48% 82%, rgba(255, 255, 255, 0.8), transparent);
          background-size: 250% 250%;
          animation: twinkle 6s ease-in-out infinite reverse;
        }

        .stars-layer-3 {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(1px 1px at 6% 16%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(1px 1px at 16% 46%, rgba(255, 255, 255, 0.85), transparent),
            radial-gradient(1px 1px at 26% 76%, rgba(255, 255, 255, 0.8), transparent),
            radial-gradient(2px 2px at 36% 6%, white, transparent);
          background-size: 300% 300%;
          animation: twinkle 8s ease-in-out infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .glass-card {
          background: rgba(15, 23, 41, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 157, 195, 0.2);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>

      <GardenMainNav variant="dark" />

      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="font-['Playfair_Display'] text-7xl text-white italic font-bold mb-6" style={{ textShadow: '0 0 40px rgba(96, 165, 250, 0.4)' }}>
              Choose Your Plan
            </h1>
            <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] max-w-2xl mx-auto" style={{ lineHeight: '1.8' }}>
              Start free, grow as you write. Unlock more features at your own pace.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* FREE - Seedling */}
            <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Sprout className="w-10 h-10 text-[#10b981]" style={{ filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.6))' }} />
                <div>
                  <h3 className="font-['Cardo'] text-3xl text-white italic">Seedling</h3>
                  <p className="font-['Inter'] text-sm text-[#8b9dc3]">Free Forever</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-['Cardo'] text-5xl text-white">$0</span>
                  <span className="font-['Inter'] text-sm text-[#8b9dc3]">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Write unlimited pieces</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Join up to 2 circles</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Organic discovery in Explore</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Basic writing editor</span>
                </li>
              </ul>

              <button className="w-full py-3 rounded-lg font-['Cardo'] text-lg font-semibold bg-gradient-to-r from-[#10b981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] shadow-lg shadow-green-500/30 transition-all">
                Start Free
              </button>
            </div>

            {/* MID - Gardener */}
            <div className="glass-card rounded-2xl p-8 relative hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300" style={{ 
              border: '2px solid rgba(96, 165, 250, 0.4)',
              boxShadow: '0 0 40px rgba(96, 165, 250, 0.2)'
            }}>
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white rounded-full text-xs font-['Inter'] font-semibold uppercase tracking-wider shadow-lg">
                Most Popular
              </div>

              <div className="flex items-center gap-3 mb-6 mt-2">
                <TrendingUp className="w-10 h-10 text-[#60a5fa]" style={{ filter: 'drop-shadow(0 0 15px rgba(96, 165, 250, 0.6))' }} />
                <div>
                  <h3 className="font-['Cardo'] text-3xl text-white italic">Gardener</h3>
                  <p className="font-['Inter'] text-sm text-[#8b9dc3]">For Active Writers</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-['Cardo'] text-5xl text-white">$8</span>
                  <span className="font-['Inter'] text-sm text-[#8b9dc3]">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]"><strong className="text-white">Everything in Seedling</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Unlimited circles</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Writing analytics & insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Priority browse placement</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#60a5fa] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Custom garden themes</span>
                </li>
              </ul>

              <button className="w-full py-3 rounded-lg font-['Cardo'] text-lg font-semibold bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white hover:from-[#3b82f6] hover:to-[#2563eb] shadow-lg shadow-blue-500/40 transition-all" onClick={() => handleSelectPlan({
                amount: 8,
                planName: 'Gardener',
                type: 'subscription',
                description: 'Unlimited Circles, Propose Grafts, Priority Support',
                interval: 'month'
              })}>
                Upgrade to Gardener
              </button>
            </div>

            {/* TOP - Greenhouse */}
            <div className="glass-card rounded-2xl p-8 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <Home className="w-10 h-10 text-[#f59e0b]" style={{ filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.6))' }} />
                <div>
                  <h3 className="font-['Cardo'] text-3xl text-white italic">Greenhouse</h3>
                  <p className="font-['Inter'] text-sm text-[#8b9dc3]">Professional Tier</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-['Cardo'] text-5xl text-white">$18</span>
                  <span className="font-['Inter'] text-sm text-[#8b9dc3]">/month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]"><strong className="text-white">Everything in Gardener</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]"><strong className="text-[#f59e0b]">Direct submission to editors</strong> with priority note</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Unlimited garden themes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Greenhouse contributor badge</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#f59e0b] flex-shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm text-[#c8cad8]">Early access to new features</span>
                </li>
              </ul>

              <button className="w-full py-3 rounded-lg font-['Cardo'] text-lg font-semibold bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] hover:to-[#b45309] shadow-lg shadow-amber-500/40 transition-all" onClick={() => handleSelectPlan({
                amount: 18,
                planName: 'Greenhouse',
                type: 'subscription',
                description: 'Everything in Gardener + Direct Editor Submissions + Featured Placement',
                interval: 'month'
              })}>
                Upgrade to Greenhouse
              </button>
            </div>
          </div>

          {/* FAQ or Additional Info */}
          <div className="mt-16 text-center">
            <p className="font-['Inter'] text-sm text-[#8b9dc3]">
              All plans include access to Greenhouse rooms, Cuttings marketplace, and core Garden features.
            </p>
            <p className="font-['Inter'] text-xs text-[#8b9dc3] mt-4">
              Questions? <a href="mailto:hello@page.garden" className="text-[#60a5fa] hover:text-[#7cb8ff] underline">Contact us</a>
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={selectedPlan.amount}
          type={selectedPlan.type}
          description={selectedPlan.description}
          planName={selectedPlan.planName}
          interval={selectedPlan.interval}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}