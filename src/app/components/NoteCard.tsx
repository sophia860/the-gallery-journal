import { Tag, Link2 } from 'lucide-react';

interface NoteCardProps {
  id: string;
  title: string;
  preview: string;
  tags?: string[];
  status: 'seed' | 'sprout' | 'bloom';
  lastEdited: string;
  connectionCount?: number;
  onClick?: () => void;
}

const statusConfig = {
  seed: {
    label: 'Seed',
    color: '#D4B896',
    bgColor: '#FBF7F0',
    textColor: '#9B7E4F'
  },
  sprout: {
    label: 'Sprout',
    color: '#A3C4A0',
    bgColor: '#F0F7F0',
    textColor: '#5A7E58'
  },
  bloom: {
    label: 'Bloom',
    color: '#C48B8B',
    bgColor: '#FAF2F2',
    textColor: '#9E5A5A'
  }
};

export function NoteCard({
  id,
  title,
  preview,
  tags = [],
  status,
  lastEdited,
  connectionCount = 0,
  onClick
}: NoteCardProps) {
  const config = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-[#E5E0DA] rounded-lg p-5 hover:border-[#7A9E7E] transition-all duration-250 cursor-pointer group"
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)' }}
    >
      {/* Title */}
      <h3 className="font-['Lora'] text-xl font-semibold text-[#2C2C2C] mb-3 leading-tight group-hover:text-[#7A9E7E] transition-colors">
        {title}
      </h3>

      {/* Preview */}
      <p className="font-['Inter'] text-sm text-[#6B6B6B] mb-4 leading-relaxed line-clamp-3">
        {preview}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F0EDE8] text-[#6B6B6B] text-xs font-medium rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="inline-flex items-center px-2.5 py-1 text-[#9B9B9B] text-xs">
              +{tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F0EDE8]">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
            style={{
              backgroundColor: config.bgColor,
              color: config.textColor
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
            ></span>
            {config.label}
          </span>

          {/* Last Edited */}
          <span className="text-xs text-[#9B9B9B] font-['Inter']">
            {lastEdited}
          </span>
        </div>

        {/* Connection Count */}
        {connectionCount > 0 && (
          <div className="flex items-center gap-1 text-[#9B9B9B]">
            <Link2 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{connectionCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
