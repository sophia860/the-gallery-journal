import { WorkType } from '../utils/notes';
import { workTypeColors, workTypeLabels } from '../utils/sampleData';

interface WorkTypeBadgeProps {
  workType: WorkType;
  size?: 'sm' | 'md' | 'lg';
}

export function WorkTypeBadge({ workType, size = 'sm' }: WorkTypeBadgeProps) {
  const colors = workTypeColors[workType];
  const label = workTypeLabels[workType];

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
    lg: 'text-[12px] px-3 py-1.5',
  };

  return (
    <span
      className={`inline-block font-['Cormorant_Garamond'] uppercase tracking-[0.15em] rounded-sm ${sizeClasses[size]}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {label}
    </span>
  );
}
