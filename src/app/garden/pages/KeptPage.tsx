import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';
import { useAuth } from '../../contexts/AuthContext';

interface KeptPiece {
  id: string;
  writingId: string;
  title: string;
  author: string;
  authorId: string;
  excerpt: string;
  growthStage: 'seed' | 'sprout' | 'bloom';
  savedAt: string;
  source: 'gallery' | 'explore' | 'neighbouring';
}

export function KeptPage() {
  const { user, supabase } = useAuth();
  const [kept, setKept] = useState<KeptPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      window.location.href = '/garden/login';
      return;
    }
    
    loadKept();
  }, [user]);

  const loadKept = async () => {
    if (!user) return;
    
    try {
      // Load from localStorage for now (can be moved to Supabase later)
      const stored = localStorage.getItem(`kept_${user.id}`);
      if (stored) {
        setKept(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading kept pieces:', error);
    }
    
    setLoading(false);
  };

  const removeKept = (id: string) => {
    if (!user) return;
    
    const updated = kept.filter(k => k.id !== id);
    setKept(updated);
    localStorage.setItem(`kept_${user.id}`, JSON.stringify(updated));
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'seed': return '🌰';
      case 'sprout': return '🌱';
      case 'bloom': return '🌸';
      default: return '🌱';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <GardenNav />
        <div className="pt-24 flex items-center justify-center">
          <p className="text-[#e0e0e0]/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />

      <div className="pt-24 px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Cardo'] italic text-4xl text-[#7a9b76] mb-2">
              Kept
            </h1>
            <p className="font-['Cardo'] text-[#e0e0e0]/60">
              Things you wanted to remember.
            </p>
          </div>

          {/* Kept Grid */}
          {kept.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-['Cardo'] text-xl text-[#e0e0e0]/60 mb-4">
                Nothing kept yet
              </p>
              <p className="font-['Cardo'] text-sm text-[#e0e0e0]/40">
                When you find writing that resonates, keep it here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {kept.map((piece) => (
                <div
                  key={piece.id}
                  className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#7a9b76] transition-colors"
                >
                  {/* Author & Stage */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.15em] text-[#7a9b76]/70">
                      {piece.author}
                    </p>
                    <span className="text-lg">
                      {getStateIcon(piece.growthStage)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-['Georgia'] text-xl text-[#e0e0e0] mb-2 line-clamp-2">
                    {piece.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60 mb-4 line-clamp-3">
                    {piece.excerpt}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#333]">
                    <button
                      onClick={() => window.location.href = `/garden/read/${piece.writingId}`}
                      className="flex-1 text-sm text-[#7a9b76] hover:text-[#8fb587] transition-colors cursor-pointer"
                    >
                      Read →
                    </button>
                    <button
                      onClick={() => removeKept(piece.id)}
                      className="text-sm text-[#e0e0e0]/40 hover:text-[#e0e0e0] transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}
