import { X, Heart, Share2 } from 'lucide-react';
import { useState } from 'react';

interface ReadingModalProps {
  title: string;
  author: string;
  authorInitials?: string;
  authorColor?: string;
  category: string;
  content: string;
  readingTime?: number;
  hearts?: number;
  hasHearted?: boolean;
  onClose: () => void;
  onHeart?: () => void;
}

export function ReadingModal({
  title,
  author,
  authorInitials = 'AA',
  authorColor = '#8B7355',
  category,
  content,
  readingTime = 1,
  hearts = 0,
  hasHearted = false,
  onClose,
  onHeart,
}: ReadingModalProps) {
  const [localHasHearted, setLocalHasHearted] = useState(hasHearted);
  const [localHearts, setLocalHearts] = useState(hearts);

  const handleHeart = () => {
    setLocalHasHearted(!localHasHearted);
    setLocalHearts(localHasHearted ? localHearts - 1 : localHearts + 1);
    onHeart?.();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Read "${title}" by ${author} on The Gallery`,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="bg-[#FEFCF8] max-w-4xl w-full max-h-[95vh] overflow-y-auto relative shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-[#E8E0D8] rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6 text-[#2C2C2C]" />
        </button>

        {/* Content */}
        <div className="p-8 md:p-16">
          {/* Header */}
          <div className="mb-12">
            {/* Category Badge */}
            <span className="inline-block px-3 py-1 bg-[#E11D48]/10 text-[#E11D48] text-xs font-['Inter'] uppercase tracking-wider mb-6">
              {category}
            </span>

            {/* Title */}
            <h1 className="font-['Cardo'] text-5xl md:text-6xl text-[#2C2C2C] mb-6 leading-tight">
              {title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-['Inter'] font-semibold text-sm"
                style={{ backgroundColor: authorColor }}
              >
                {authorInitials}
              </div>
              <div>
                <p className="font-['Inter'] text-[#2C2C2C] font-medium">
                  {author}
                </p>
                <p className="text-xs text-[#717171] font-['Inter']">
                  {readingTime} min read
                </p>
              </div>
            </div>
          </div>

          {/* Poem Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div className="font-['Libre_Baskerville'] text-xl leading-loose whitespace-pre-wrap text-[#2C2C2C]">
              {content}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-8 border-t border-[#E8E0D8] flex items-center justify-between">
            <button
              onClick={handleHeart}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                localHasHearted
                  ? 'bg-[#E11D48]/10 text-[#E11D48]'
                  : 'bg-[#F5F0EB] text-[#717171] hover:bg-[#E0D8D0]'
              }`}
            >
              <Heart className={`w-5 h-5 ${localHasHearted ? 'fill-current' : ''}`} />
              <span className="font-['Inter'] font-medium">{localHearts}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-[#2C2C2C] text-white hover:bg-[#1A1A1A] transition-colors rounded-full"
            >
              <Share2 className="w-4 h-4" />
              <span className="font-['Inter'] text-sm">Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
