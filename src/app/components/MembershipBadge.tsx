import { Crown, Sparkles } from 'lucide-react';

interface MembershipBadgeProps {
  tier: 'reader' | 'writer' | 'patron';
  size?: 'sm' | 'md' | 'lg';
}

export function MembershipBadge({ tier, size = 'md' }: MembershipBadgeProps) {
  if (tier === 'reader') return null; // Don't show badge for free tier

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  if (tier === 'patron') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} bg-gradient-to-r from-[#C4A265] to-[#B08D4F] text-white rounded-full font-['Courier_New'] tracking-wider uppercase`}>
        <Crown className={iconSize[size]} />
        Patron
      </div>
    );
  }

  if (tier === 'writer') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${sizeClasses[size]} bg-[#E11D48] text-white rounded-full font-['Courier_New'] tracking-wider uppercase`}>
        <Sparkles className={iconSize[size]} />
        Writer
      </div>
    );
  }

  return null;
}
