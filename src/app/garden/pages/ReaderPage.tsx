import { useState, useEffect } from 'react';
import { GardenNav } from '../components/GardenNav';
import { GardenFooter } from '../components/GardenFooter';
import { useAuth } from '../../contexts/AuthContext';

// CONNECTIONS ARE THE PRIMARY DISCOVERY MECHANISM
export function ReaderPage() {
  const { user, supabase } = useAuth();
  const [writing, setWriting] = useState<any>(null);
  const [connectedWritings, setConnectedWritings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get writing ID from URL
  const writingId = window.location.pathname.split('/garden/read/')[1];

  useEffect(() => {
    if (writingId) {
      loadWriting();
    }
  }, [writingId]);

  const loadWriting = async () => {
    setLoading(true);
    try {
      // Load the writing
      const { data: writingData } = await supabase
        .from('writings')
        .select(`
          *,
          profiles:user_id (
            full_name,
            garden_name
          )
        `)
        .eq('id', writingId)
        .single();

      if (writingData) {
        setWriting(writingData);

        // Load connected writings (grows_from and grows_into)
        const connectionIds = [
          ...(writingData.grows_from || []),
          ...(writingData.grows_into || [])
        ];

        if (connectionIds.length > 0) {
          const { data: connections } = await supabase
            .from('writings')
            .select(`
              *,
              profiles:user_id (
                full_name,
                garden_name
              )
            `)
            .in('id', connectionIds)
            .eq('visibility', 'garden'); // Only show public connections

          setConnectedWritings(connections || []);
        }
      }
    } catch (error) {
      console.error('Error loading writing:', error);
    }
    setLoading(false);
  };

  const wanderToRandomBloom = async () => {
    // Load a random public bloom
    const { data: writings } = await supabase
      .from('writings')
      .select('id')
      .eq('visibility', 'garden')
      .eq('growth_stage', 'bloom');

    if (writings && writings.length > 0) {
      const randomIndex = Math.floor(Math.random() * writings.length);
      window.location.href = `/garden/read/${writings[randomIndex].id}`;
    }
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-[#7a9b76] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!writing) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <GardenNav />
        <div className="pt-24 px-8 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-['Cardo'] text-xl text-[#e0e0e0]/60">
              Writing not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <GardenNav />
      
      <div className="pt-24 px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Wander button at top */}
          <div className="mb-8 text-center">
            <button
              onClick={wanderToRandomBloom}
              className="px-6 py-2 border border-[#7a9b76]/30 hover:border-[#7a9b76] text-[#7a9b76] hover:bg-[#7a9b76]/10 transition-colors cursor-pointer font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded"
            >
              Wander to another bloom →
            </button>
          </div>

          {/* Author */}
          <p className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#7a9b76]/70 mb-4">
            {writing.profiles?.garden_name || writing.profiles?.full_name || 'Anonymous'}
          </p>

          {/* Title */}
          <h1 className="font-['Playfair_Display'] italic text-[48px] text-[#e0e0e0] mb-8" style={{ lineHeight: '1.2' }}>
            {writing.title}
          </h1>

          {/* Content */}
          <div 
            className="font-['Georgia'] text-[19px] text-[#e0e0e0] mb-12 prose prose-invert max-w-none"
            style={{ lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: writing.content }}
          />

          {/* Tags */}
          {writing.tags && writing.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12 pb-12 border-b border-[#333]">
              {writing.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-[#7a9b76]/10 border border-[#7a9b76]/30 rounded text-[#7a9b76] text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* CONNECTED PIECES - PRIMARY DISCOVERY MECHANISM */}
          <div className="mb-12">
            <h2 className="font-['Cardo'] text-3xl text-[#7a9b76] mb-6">
              Connected Pieces
            </h2>
            
            {connectedWritings.length === 0 ? (
              <div className="p-8 bg-[#1a1a1a] border border-[#333] rounded-lg text-center">
                <p className="font-['Cardo'] text-[#e0e0e0]/60">
                  This piece stands alone. No connections yet.
                </p>
                <p className="font-['Cardo'] text-sm text-[#e0e0e0]/40 mt-2">
                  Discovery happens through following threads between ideas.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="font-['Cardo'] text-[#e0e0e0]/60 mb-6">
                  Follow the threads between ideas. This is how you discover new writing.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {connectedWritings.map((connected) => (
                    <div
                      key={connected.id}
                      className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 hover:border-[#7a9b76] transition-colors cursor-pointer"
                      onClick={() => window.location.href = `/garden/read/${connected.id}`}
                    >
                      <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.15em] text-[#7a9b76]/60 mb-2">
                        {connected.profiles?.garden_name || connected.profiles?.full_name || 'Anonymous'}
                      </p>
                      <h3 className="font-['Georgia'] text-xl text-[#e0e0e0] mb-2">
                        {connected.title}
                      </h3>
                      <p className="font-['Georgia'] text-sm text-[#e0e0e0]/60 line-clamp-3">
                        {stripHtml(connected.content).substring(0, 150)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 pt-8 border-t border-[#333]">
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-[#333] hover:border-[#7a9b76] text-[#e0e0e0] transition-colors cursor-pointer font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded"
            >
              ← Back
            </button>
            <button
              onClick={() => window.location.href = '/garden/explore'}
              className="px-6 py-3 border border-[#333] hover:border-[#7a9b76] text-[#e0e0e0] transition-colors cursor-pointer font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] rounded"
            >
              Gallery
            </button>
          </div>
        </div>
      </div>

      <GardenFooter />
    </div>
  );
}