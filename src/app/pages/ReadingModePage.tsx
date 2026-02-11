import { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Flower2, Leaf, User } from 'lucide-react';
import { GardenMainNav } from '../components/GardenMainNav';
import { NightSkyBackground } from '../components/NightSkyBackground';
import { Writing } from '/src/types/garden';

interface ReadingModePageProps {
  writingId: string;
}

export function ReadingModePage({ writingId }: ReadingModePageProps) {
  const [writing, setWriting] = useState<Writing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWriting();
  }, [writingId]);

  const loadWriting = async () => {
    try {
      setLoading(true);
      // Try to fetch from database first
      // For now, fall back to mock data
      useMockWriting();
    } catch (error) {
      console.error('Error loading writing:', error);
      useMockWriting();
    } finally {
      setLoading(false);
    }
  };

  const useMockWriting = () => {
    const mockWritings: Writing[] = [
      {
        id: '1',
        user_id: 'user-1',
        title: 'The Weight of Autumn',
        content: `There's a heaviness that settles in when the leaves begin to turn. Not sadness exactly, but a kind of melancholy nostalgia for summers not quite finished. I walk through the park and feel time slipping through my fingers like sand, like water, like the wind that carries these dying leaves into piles at the edges of memory.

My grandmother used to say that autumn is when the earth exhales. All summer long it holds its breath, green and tense with growing. Then September comes and everything loosens. The trees let go. The garden stops trying.

I think about this as I watch the light change, growing gold and slanted. There's wisdom in letting go, she would say. In releasing what we've held too tightly.

The air smells different now. Wood smoke and decay, apples falling in someone's yard. I collect these scents like pressed flowers, storing them away for winter when I'll need to remember that beauty can exist in endings.`,
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'poetry',
        word_count: 156,
        character_count: 890,
        tags: ['autumn', 'reflection', 'nature'],
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'poetry',
        profile: {
          display_name: 'Maya Chen',
          writer_name: 'Maya Chen'
        }
      },
      {
        id: '2',
        user_id: 'user-2',
        title: 'Letters to My Younger Self',
        content: `Dear 25-year-old me,

I know you think you have it all figured out. I know you believe that success means climbing ladders and checking boxes. Let me tell you something that will save you years of wondering: you're allowed to change your mind. You're allowed to want different things. This isn't failure. This is growth.

That apartment you're saving for? You won't want it in three years. That career path that seems so certain? It will bore you to tears. The person you think you'll marry? They're wonderful, but wrong for you.

And here's the hardest truth: all of this is okay.

You will spend so much time apologizing for changing, for growing, for becoming someone you didn't expect to be. Stop. Evolution is not betrayal.

The you that exists right now is perfect for right now. And the you that exists in ten years will look back at this moment with such tenderness, such understanding. She will know that every version of you—the confused one, the certain one, the lost one—was exactly who you needed to be.

So make your plans. Dream your dreams. But hold them loosely. The best parts of your life will be the things you didn't see coming.

With love and hindsight,
35-year-old you`,
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'essay',
        word_count: 234,
        character_count: 1340,
        tags: ['personal', 'growth', 'wisdom'],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'essay',
        profile: {
          display_name: 'Jordan Rivers',
          writer_name: 'Jordan Rivers'
        }
      },
      {
        id: '3',
        user_id: 'user-3',
        title: 'The House on Maple Street',
        content: `The house appeared overnight, or so the neighborhood children claimed. One day there was an empty lot overgrown with weeds and wildflowers, and the next—a Victorian mansion with peeling paint and windows that reflected clouds that weren't in the sky.

Old Mrs. Patterson swore she saw lights moving inside at 3 AM, even though the electric company had no record of service to that address. The mailman refused to deliver there after finding letters addressed to people who'd been dead for forty years.

I walked past it every day on my way to work. Each morning I promised myself I wouldn't look, and each morning I failed. There was something magnetic about it, something that pulled at the edges of my vision.

Then one Tuesday, the front door was open.

Not just unlocked—open. Standing wide in invitation, a glimpse of hardwood floors and wallpaper that seemed to shift in patterns I couldn't quite focus on.

I should have kept walking. I should have called someone. Instead, I found myself climbing the porch steps, one hand reaching for the doorframe, the other clutching my briefcase like it might protect me from whatever waited inside.

The house smelled like my childhood—sugar cookies and old books and the particular dust that accumulates in places where time moves differently. I stepped across the threshold.

The door closed behind me.

It's been three weeks now, or maybe three years. Time works strangely here. I've explored seventeen rooms, each one bigger than the last, each one containing memories that aren't mine but feel familiar anyway.

Sometimes I think about leaving. But then I remember: I can't recall what was outside. Can't picture the street, the city, the life I had before.

Maybe I've always been here.

Maybe the house isn't the strange thing. Maybe I am.`,
        growth_stage: 'bloom',
        visibility: 'public',
        work_type: 'fiction',
        word_count: 312,
        character_count: 1820,
        tags: ['fiction', 'mystery', 'magical-realism'],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'fiction',
        profile: {
          display_name: 'River Park',
          writer_name: 'River Park'
        }
      }
    ];

    const foundWriting = mockWritings.find(w => w.id === writingId) || mockWritings[0];
    setWriting(foundWriting);
  };

  const getGrowthIcon = () => {
    if (!writing) return null;
    
    switch (writing.growth_stage) {
      case 'seed': 
        return <div 
          className="w-3 h-3 rounded-full" 
          style={{ 
            background: '#d4a574',
            boxShadow: '0 0 8px rgba(212, 165, 116, 0.6)' 
          }}
        ></div>;
      case 'sprout': 
        return <Leaf 
          className="w-5 h-5" 
          style={{ 
            color: '#10b981',
            filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.5))' 
          }} 
        />;
      case 'bloom': 
        return <Flower2 
          className="w-6 h-6" 
          style={{ 
            color: '#ec4899',
            filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))' 
          }} 
        />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center">
        <NightSkyBackground />
        <div className="relative z-10 text-center">
          <Flower2 className="w-12 h-12 text-[#60a5fa] animate-pulse mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 15px rgba(96, 165, 250, 0.6))' }} />
          <p className="font-['Libre_Baskerville'] text-lg text-[#c8cad8]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!writing) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] relative flex items-center justify-center">
        <NightSkyBackground />
        <GardenMainNav variant="dark" />
        <div className="relative z-10 text-center pt-32">
          <p className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] mb-4">Writing not found</p>
          <a href="/explore" className="text-[#60a5fa] hover:underline">Back to Explore</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      <NightSkyBackground />
      <GardenMainNav variant="dark" />

      <div className="relative z-10 pt-32 pb-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <a
            href="/explore"
            className="inline-flex items-center gap-2 mb-8 text-[#8b9dc3] hover:text-[#60a5fa] transition-colors font-['Inter'] text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Explore
          </a>

          {/* Writing Card */}
          <div 
            className="rounded-2xl overflow-hidden backdrop-blur-xl"
            style={{
              background: 'rgba(15, 23, 41, 0.7)',
              border: '1px solid rgba(139, 157, 195, 0.25)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
            }}
          >
            {/* Author Header */}
            <div className="bg-gradient-to-br from-[#1a2332] via-[#0f1729] to-[#1a1f3a] border-b border-[rgba(139,157,195,0.2)] p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#60a5fa] via-[#3b82f6] to-[#2563eb] rounded-full flex items-center justify-center text-white font-['Cardo'] text-2xl font-bold shadow-xl" style={{ boxShadow: '0 0 25px rgba(96, 165, 250, 0.5), inset 0 2px 10px rgba(255,255,255,0.3)' }}>
                  {writing.profile?.display_name?.[0]?.toUpperCase() || 'W'}
                </div>
                <div className="flex-1">
                  <p className="font-['Cardo'] text-xl text-white font-semibold italic mb-1" style={{ textShadow: '0 0 15px rgba(96, 165, 250, 0.4)' }}>
                    {writing.profile?.writer_name || writing.profile?.display_name || 'Anonymous'}'s Garden
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getGrowthIcon()}
                      <span className="text-xs font-['Inter'] uppercase tracking-wider text-[#8b9dc3]">
                        {writing.growth_stage}
                      </span>
                    </div>
                    <div className="h-4 w-px bg-[rgba(139,157,195,0.3)]"></div>
                    <span className="text-xs text-[#8b9dc3] font-['Inter'] italic">
                      {writing.work_type}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Writing Content */}
            <div className="p-8 md:p-12">
              <h1 className="font-['Playfair_Display'] italic text-5xl text-white mb-8 leading-tight" style={{ textShadow: '0 0 25px rgba(255, 255, 255, 0.2)' }}>
                {writing.title}
              </h1>

              <div className="prose prose-invert max-w-none">
                {writing.content.split('\n\n').map((paragraph, index) => (
                  <p 
                    key={index}
                    className="font-['Libre_Baskerville'] text-lg text-[#c8cad8] leading-relaxed mb-6"
                    style={{ lineHeight: '1.8' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              {writing.tags && writing.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-[rgba(139,157,195,0.2)]">
                  {writing.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-[rgba(96,165,250,0.12)] border border-[rgba(96,165,250,0.25)] text-[#60a5fa] text-xs font-['Inter'] font-medium rounded-full"
                    >
                      <span className="opacity-60">#</span>{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border-[rgba(139,157,195,0.2)] text-xs text-[#8b9dc3] font-['Inter']">
                <div className="flex items-center gap-4">
                  <span>{writing.word_count} words</span>
                  <div className="h-4 w-px bg-[rgba(139,157,195,0.3)]"></div>
                  <span>
                    {new Date(writing.published_at || writing.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
