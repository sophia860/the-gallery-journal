import { Sparkles, Crown, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

interface UpgradePromptProps {
  feature: string;
  tier: 'writer' | 'patron';
  context?: string;
}

export function UpgradePrompt({ feature, tier, context }: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const tierInfo = {
    writer: {
      name: 'Writer',
      price: '$12/month',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-[#E11D48] to-[#C01040]',
      benefits: [
        'Submit unlimited work',
        'Personal Writer\'s Room',
        'Community Wall access',
        'Analytics dashboard',
      ],
    },
    patron: {
      name: 'Patron',
      price: '$30/month',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-[#C4A265] to-[#B08D4F]',
      benefits: [
        'Priority review',
        'Editorial feedback',
        'Exclusive events',
        'Custom room themes',
      ],
    },
  };

  const info = tierInfo[tier];

  return (
    <div className="fixed bottom-8 right-8 max-w-md bg-white border-2 border-[#E0D8D0] rounded-lg shadow-2xl p-6 z-50 animate-slide-up">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 p-1 hover:bg-[#F5F0E8] rounded-full transition-colors"
      >
        <X className="w-4 h-4 text-[#8B7355]" />
      </button>

      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 bg-gradient-to-br ${info.color} text-white rounded-lg`}>
          {info.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-['Cardo'] text-xl text-[#2C1810] mb-1">
            Unlock {feature}
          </h3>
          <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
            {context || `Available with ${info.name} membership`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="font-['Cardo'] text-3xl text-[#2C1810] mb-3">
          {info.price}
        </div>
        <ul className="space-y-2">
          {info.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-2 font-[family-name:var(--font-ui)] text-sm text-[#2C1810]">
              <div className="w-1.5 h-1.5 bg-[#C4A265] rounded-full"></div>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="/pricing"
        className="flex items-center justify-between w-full py-3 px-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Cardo'] text-sm tracking-wider group"
      >
        <span>Upgrade to {info.name}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}
