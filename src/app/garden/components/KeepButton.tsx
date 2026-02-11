import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface KeepButtonProps {
  writingId: string;
  title: string;
  author: string;
  authorId: string;
  excerpt: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
  source?: 'gallery' | 'explore' | 'neighbouring';
}

export function KeepButton({ writingId, title, author, authorId, excerpt, growthStage, source = 'explore' }: KeepButtonProps) {
  const { user } = useAuth();
  const [isKept, setIsKept] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const kept = localStorage.getItem(`kept_${user.id}`);
    if (kept) {
      const keptList = JSON.parse(kept);
      setIsKept(keptList.some((k: any) => k.writingId === writingId));
    }
  }, [user, writingId]);

  const handleKeep = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      window.location.href = '/garden/login';
      return;
    }

    const stored = localStorage.getItem(`kept_${user.id}`);
    let kept = stored ? JSON.parse(stored) : [];

    if (isKept) {
      // Remove from kept
      kept = kept.filter((k: any) => k.writingId !== writingId);
      setIsKept(false);
    } else {
      // Add to kept
      kept.push({
        id: Date.now().toString(),
        writingId,
        title,
        author,
        authorId,
        excerpt,
        growthStage,
        savedAt: new Date().toISOString(),
        source,
      });
      setIsKept(true);
    }

    localStorage.setItem(`kept_${user.id}`, JSON.stringify(kept));
  };

  return (
    <button
      onClick={handleKeep}
      className="group flex items-center gap-2 px-3 py-2 rounded border border-[rgba(122,155,118,0.2)] hover:border-[#7a9b76] transition-all cursor-pointer"
      title={isKept ? 'Remove from kept' : 'Keep for me'}
    >
      <svg 
        viewBox="0 0 24 24" 
        className="w-4 h-4" 
        stroke="#7a9b76" 
        strokeWidth="2" 
        fill={isKept ? '#7a9b76' : 'none'}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]">
        {isKept ? 'Kept' : 'Keep'}
      </span>
    </button>
  );
}
