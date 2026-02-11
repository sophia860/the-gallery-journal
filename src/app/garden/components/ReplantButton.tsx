import { useAuth } from '../../contexts/AuthContext';

interface ReplantButtonProps {
  writingId: string;
  title: string;
  author: string;
  authorId: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
}

export function ReplantButton({ writingId, title, author, authorId, growthStage }: ReplantButtonProps) {
  const { user } = useAuth();

  // Only show for blooms
  if (growthStage !== 'bloom') {
    return null;
  }

  const handleReplant = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/garden/login';
      return;
    }

    // Store replant context in localStorage
    const replantContext = {
      fromWritingId: writingId,
      fromTitle: title,
      fromAuthor: author,
      fromAuthorId: authorId,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('replant_context', JSON.stringify(replantContext));
    
    // Navigate to write page
    window.location.href = '/garden/write';
  };

  return (
    <button
      onClick={handleReplant}
      className="group flex items-center gap-2 px-3 py-2 rounded border border-[rgba(139,157,195,0.2)] hover:border-[#8b9dc3] transition-all cursor-pointer"
      title="Plant something new from this"
    >
      <svg 
        viewBox="0 0 24 24" 
        className="w-4 h-4" 
        stroke="#8b9dc3" 
        strokeWidth="2" 
        fill="none"
      >
        <path d="M12 20 L12 8 M8 12 L12 8 L16 12" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="4" r="2" fill="#8b9dc3"/>
        <path d="M6 20 Q12 16, 18 20" strokeLinecap="round"/>
      </svg>
      <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#8b9dc3]">
        Replant
      </span>
    </button>
  );
}
