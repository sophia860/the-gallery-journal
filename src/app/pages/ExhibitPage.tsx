import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Piece {
  id: string;
  title: string;
  content: string;
  type: 'prose' | 'poetry';
}

interface Exhibit {
  id: string;
  userId: string;
  title: string;
  openingNote: string;
  pieces: string[];
}

interface Room {
  writerName: string;
  atmosphere: 'warm' | 'cool' | 'stark';
}

interface ExhibitPageProps {
  exhibitId: string;
}

// Scroll reveal component using IntersectionObserver
function ScrollReveal({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function ExhibitPage({ exhibitId }: ExhibitPageProps) {
  const { user, accessToken } = useAuth();
  const [exhibit, setExhibit] = useState<Exhibit | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [currentPieceIndex, setCurrentPieceIndex] = useState(0);
  const [selectedText, setSelectedText] = useState('');
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchExhibit = async () => {
      try {
        const exhibitResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/exhibits/${exhibitId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        const exhibitData = await exhibitResponse.json();
        if (exhibitData.exhibit) {
          setExhibit(exhibitData.exhibit);

          // Fetch room
          const roomResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/rooms/${exhibitData.exhibit.userId}`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
              },
            }
          );

          const roomData = await roomResponse.json();
          if (roomData.room) {
            setRoom(roomData.room);
          }

          // Fetch all pieces
          const piecesData: Piece[] = [];
          for (const pieceId of exhibitData.exhibit.pieces) {
            const pieceResponse = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/pieces/${pieceId}`,
              {
                headers: {
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
              }
            );

            const pieceData = await pieceResponse.json();
            if (pieceData.piece) {
              piecesData.push(pieceData.piece);
            }
          }

          setPieces(piecesData);
        }
      } catch (error) {
        console.error('Error fetching exhibit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibit();
  }, [exhibitId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      setSelectedText(text);
      setShowSavePrompt(true);
    }
  };

  const saveToCommonplace = async () => {
    if (!user || !accessToken || !selectedText) return;

    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/commonplace`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            pieceId: pieces[currentPieceIndex]?.id,
            text: selectedText,
            context: pieces[currentPieceIndex]?.title || '',
          }),
        }
      );

      setShowSavePrompt(false);
      setSelectedText('');
    } catch (error) {
      console.error('Error saving to commonplace:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="font-[family-name:var(--font-ui)] text-muted-foreground">
          Loading exhibit...
        </div>
      </div>
    );
  }

  if (!exhibit || !room || pieces.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-headline)] text-4xl mb-4">
            Exhibit not found
          </h1>
          <a href="/" className="text-accent hover:underline">
            Return to gallery
          </a>
        </div>
      </div>
    );
  }

  const currentPiece = pieces[currentPieceIndex];

  // Atmosphere background
  const atmosphereStyles = {
    warm: 'bg-[#F5F0EB]',
    cool: 'bg-[#E0E8F0]',
    stark: 'bg-white',
  };

  const atmosphereBg = atmosphereStyles[room.atmosphere] || atmosphereStyles.warm;

  return (
    <div className={`min-h-screen ${atmosphereBg} transition-colors duration-700 opacity-0 animate-[fadeIn_0.8s_ease-in_forwards]`}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      {/* Immersive reading view */}
      <div className="max-w-3xl mx-auto px-8 py-24">
        {/* Exhibit intro (shown before first piece) */}
        {currentPieceIndex === 0 && (
          <ScrollReveal>
            <div className="mb-24">
              <div className="mb-6">
                <a 
                  href={`/room/${exhibit.userId}`}
                  className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  ← {room.writerName}
                </a>
              </div>
              
              <h1 className="font-[family-name:var(--font-headline)] text-6xl mb-8 leading-tight">
                {exhibit.title}
              </h1>
              
              {/* Decorative horizontal rule */}
              <div className="flex justify-center mb-8">
                <span className="text-[#C4918A] text-2xl">—</span>
              </div>
              
              {exhibit.openingNote && (
                <p className="font-[family-name:var(--font-body)] text-xl text-muted-foreground leading-relaxed mb-12 border-l-2 border-[#C4918A] pl-6 italic">
                  {exhibit.openingNote}
                </p>
              )}

              <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground mb-12">
                {pieces.length} {pieces.length === 1 ? 'piece' : 'pieces'} in this exhibit
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Current piece */}
        <ScrollReveal delay={200}>
          <div className="mb-24">
            <h2 className="font-[family-name:var(--font-headline)] text-4xl mb-8 leading-tight">
              {currentPiece.title}
            </h2>

            {/* Large decorative opening quotation mark */}
            <div className="relative">
              <ScrollReveal delay={400} className="absolute -left-4 -top-8">
                <span className="font-['Cardo'] text-[120px] text-[#C4918A] opacity-10 leading-none select-none pointer-events-none">"</span>
              </ScrollReveal>
              
              <div 
                className={`mb-12 select-text relative z-10 ${
                  currentPiece.type === 'poetry'
                    ? 'font-[family-name:var(--font-poetry)] text-xl leading-loose whitespace-pre-wrap max-w-2xl'
                    : 'font-[family-name:var(--font-body)] text-lg leading-relaxed max-w-3xl'
                }`}
                onMouseUp={handleTextSelection}
                ref={textRef}
              >
                {currentPiece.content}
              </div>
            </div>

            <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground flex items-center gap-2">
              {currentPiece.type === 'poetry' ? 'A poem' : 'A piece'}
              <span className="text-[#C4918A]">✦</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Navigation */}
        <ScrollReveal delay={300}>
          <div className="flex justify-between items-center pt-12 border-t border-border">
            <button
              onClick={() => setCurrentPieceIndex(Math.max(0, currentPieceIndex - 1))}
              disabled={currentPieceIndex === 0}
              className="font-[family-name:var(--font-ui)] text-sm uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <span className="group-hover:underline underline-offset-4">← Previous piece</span>
            </button>

            <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
              {currentPieceIndex + 1} / {pieces.length}
            </div>

            {currentPieceIndex < pieces.length - 1 ? (
              <button
                onClick={() => setCurrentPieceIndex(currentPieceIndex + 1)}
                className="font-[family-name:var(--font-ui)] text-sm uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors group"
              >
                <span className="group-hover:underline underline-offset-4">Continue →</span>
              </button>
            ) : (
              <a
                href={`/room/${exhibit.userId}`}
                className="font-[family-name:var(--font-ui)] text-sm uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors group"
              >
                <span className="group-hover:underline underline-offset-4">Back to room →</span>
              </a>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Save to commonplace prompt */}
      {showSavePrompt && user && (
        <div className="fixed bottom-8 right-8 p-6 bg-card border-t-2 border-t-[#C4918A] rounded-lg shadow-xl max-w-sm">
          <p className="font-[family-name:var(--font-ui)] text-sm mb-4">
            Save selected text to your commonplace book?
          </p>
          <div className="flex gap-3">
            <button
              onClick={saveToCommonplace}
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)] text-sm rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setShowSavePrompt(false);
                setSelectedText('');
              }}
              className="px-4 py-2 border border-border hover:border-accent transition-colors font-[family-name:var(--font-ui)] text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}