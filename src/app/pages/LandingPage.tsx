import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Footer } from '../components/Footer';

interface Room {
  id: string;
  writerName: string;
  bio: string;
  atmosphere: string;
}

export function LandingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/discover/rooms`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        const data = await response.json();
        setRooms(data.rooms || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-8 mb-32">
        <h1 className="font-[family-name:var(--font-headline)] text-6xl md:text-7xl lg:text-8xl mb-8 leading-tight">
          A gallery for writing
        </h1>
        <p className="font-[family-name:var(--font-body)] text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
          Not a newsletter service. Not a content feed. A space designed by and for people who care 
          about how language looks, sounds, and feels. Every piece is curated like a little room in 
          a dream-museum: layered, thoughtful, and built around voice, not credentials.
        </p>
      </div>

      {/* Ethos Section */}
      <div className="max-w-4xl mx-auto px-8 mb-32 py-16 border-t border-b border-border">
        <h2 className="font-[family-name:var(--font-headline)] text-3xl mb-6">
          Writing deserves a place, not just a platform
        </h2>
        <div className="font-[family-name:var(--font-body)] text-lg leading-relaxed space-y-4 text-muted-foreground">
          <p>
            Substack flattens every voice into the same email template and takes 10% for the privilege. 
            Ghost offers independence but demands technical ability.
          </p>
          <p>
            PAGE sits in neither camp. It's a space where every writer gets a <em>room</em> — 
            with atmosphere, temperature, visual texture. When you visit someone's work, you don't 
            scroll past it in a feed. You walk into it.
          </p>
          <p className="text-foreground font-medium">
            No follower counts. No trending lists. No engagement metrics. Just intimacy.
          </p>
        </div>
      </div>

      {/* Featured Rooms */}
      <div className="max-w-6xl mx-auto px-8 mb-24">
        <h2 className="font-[family-name:var(--font-headline)] text-4xl mb-12">
          Enter a room
        </h2>

        {loading ? (
          <div className="font-[family-name:var(--font-ui)] text-muted-foreground">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="font-[family-name:var(--font-body)] text-lg text-muted-foreground py-16 text-center">
            <p className="mb-4">No rooms yet. Be the first to open one.</p>
            <a 
              href="/signup" 
              className="inline-block px-6 py-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Join PAGE
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <a
                key={room.id}
                href={`/room/${room.id}`}
                className="group block p-8 border border-border hover:border-accent transition-colors bg-card"
              >
                <div className="mb-4">
                  <div 
                    className={`w-12 h-12 ${
                      room.atmosphere === 'warm' ? 'bg-[#F5F0EB]' :
                      room.atmosphere === 'cool' ? 'bg-[#E0E8F0]' :
                      'bg-[#F0F0F0]'
                    } border border-border`}
                  />
                </div>
                <h3 className="font-[family-name:var(--font-headline)] text-2xl mb-3 group-hover:text-accent transition-colors">
                  {room.writerName}
                </h3>
                {room.bio && (
                  <p className="font-[family-name:var(--font-body)] text-muted-foreground line-clamp-3">
                    {room.bio}
                  </p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Principles Section */}
      <div className="max-w-4xl mx-auto px-8 py-16 border-t border-border">
        <h2 className="font-[family-name:var(--font-headline)] text-3xl mb-8">
          Built on Calm Technology
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-3">
              No attention technology
            </h3>
            <p className="font-[family-name:var(--font-body)] text-muted-foreground">
              No notification badges. No unread counters. No "you haven't posted in 7 days" emails.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-3">
              No algorithmic feeds
            </h3>
            <p className="font-[family-name:var(--font-body)] text-muted-foreground">
              Discovery happens through editorial curation, reader-built playlists, and wandering.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-3">
              Gallery spaciousness
            </h3>
            <p className="font-[family-name:var(--font-body)] text-muted-foreground">
              Generous margins. Slow scroll speeds. The writing breathes.
            </p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-headline)] text-xl mb-3">
              Intimacy metrics
            </h3>
            <p className="font-[family-name:var(--font-body)] text-muted-foreground">
              Not vanity metrics. See how many collected your lines, how long they stayed.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-8 py-24 text-center">
        <h2 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl mb-6">
          Open your room
        </h2>
        <p className="font-[family-name:var(--font-body)] text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Every writer on PAGE gets a space with atmosphere, temperature, and visual texture. 
          A place for your work to live and breathe.
        </p>
        <a 
          href="/signup" 
          className="inline-block px-8 py-4 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-lg"
        >
          Join PAGE
        </a>
      </div>

      <Footer />
    </div>
  );
}