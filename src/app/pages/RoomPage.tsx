import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Room {
  id: string;
  writerName: string;
  name: string;
  bio: string;
  atmosphere: 'warm' | 'cool' | 'stark';
  customFont: string;
  bookshelf: string[];
  ambientSound: string | null;
}

interface Exhibit {
  id: string;
  title: string;
  openingNote: string;
  pieces: string[];
  createdAt: string;
}

interface RoomPageProps {
  userId: string;
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

export function RoomPage({ userId }: RoomPageProps) {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnRoom = user?.id === userId;

  // Sample rooms data for demo writers
  const sampleRooms: Record<string, Room> = {
    'sample1': {
      id: 'sample1',
      writerName: 'Pam Martin-Lawrence',
      name: "Pam's Room",
      bio: 'Poet exploring love, memory, and the spaces between words.',
      atmosphere: 'warm',
      customFont: 'Libre Baskerville',
      bookshelf: ['Citizen by Claudia Rankine', 'The Wild Iris by Louise Glück', 'Bright Dead Things by Ada Limón'],
      ambientSound: null,
    },
    'sample2': {
      id: 'sample2',
      writerName: 'Ella B Winters',
      name: "Ella's Room",
      bio: 'Exploring heat, desire, and the physics of connection.',
      atmosphere: 'warm',
      customFont: 'Libre Baskerville',
      bookshelf: ['The Carrying by Ada Limón', 'Postcolonial Love Poem by Natalie Diaz', 'Crush by Richard Siken'],
      ambientSound: null,
    },
    'sample3': {
      id: 'sample3',
      writerName: 'Indee Sehrish Watson',
      name: "Indee's Room",
      bio: 'Finding poetry in the natural world and everyday objects.',
      atmosphere: 'cool',
      customFont: 'Libre Baskerville',
      bookshelf: ['Devotions by Mary Oliver', 'The Book of Delights by Ross Gay', 'Pilgrim at Tinker Creek by Annie Dillard'],
      ambientSound: null,
    },
    'sample4': {
      id: 'sample4',
      writerName: 'Bhavna Jain',
      name: "Bhavna's Room",
      bio: 'Writing clarity after storms, light after darkness.',
      atmosphere: 'cool',
      customFont: 'Libre Baskerville',
      bookshelf: ['Parable of the Sower by Octavia Butler', 'When Things Fall Apart by Pema Chödrön', 'The Argonauts by Maggie Nelson'],
      ambientSound: null,
    },
    'sample5': {
      id: 'sample5',
      writerName: 'Leonie Rowland',
      name: "Leonie's Room",
      bio: 'Celebrating the sacred ordinary, the holy mundane.',
      atmosphere: 'warm',
      customFont: 'Libre Baskerville',
      bookshelf: ['Gilead by Marilynne Robinson', 'Braiding Sweetgrass by Robin Wall Kimmerer', 'Ordinary Time by Barton Sutter'],
      ambientSound: null,
    },
    'sample6': {
      id: 'sample6',
      writerName: 'Seth Trochtenberg',
      name: "Seth's Room",
      bio: 'Urban poet. Observer of crowds and solitude.',
      atmosphere: 'stark',
      customFont: 'Libre Baskerville',
      bookshelf: ['The Waste Land by T.S. Eliot', 'The Colossus by Sylvia Plath', 'Lunch Poems by Frank O\'Hara'],
      ambientSound: null,
    },
    'sample7': {
      id: 'sample7',
      writerName: 'Sadiya Ali',
      name: "Sadiya's Room",
      bio: 'Writing grief, memory, and small sounds.',
      atmosphere: 'warm',
      customFont: 'Libre Baskerville',
      bookshelf: ['The Year of Magical Thinking by Joan Didion', 'The Light of the World by Elizabeth Alexander', 'Wild Embers by Nikita Gill'],
      ambientSound: null,
    },
    'sample8': {
      id: 'sample8',
      writerName: 'Luna Bailey',
      name: "Luna's Room",
      bio: 'Mother, writer, witness to becoming.',
      atmosphere: 'warm',
      customFont: 'Libre Baskerville',
      bookshelf: ['Life Work by Rachel Cusk', 'The Mother of All Questions by Rebecca Solnit', 'Good Bones by Maggie Smith'],
      ambientSound: null,
    },
    'brigearhartstaton': {
      id: 'brigearhartstaton',
      writerName: 'Bri Gearhart Staton',
      name: "Bri's Room",
      bio: 'Poet of place, memory, and the river\'s edge.',
      atmosphere: 'cool',
      customFont: 'Libre Baskerville',
      bookshelf: ['Devotions by Mary Oliver', 'New and Selected Poems by Mary Oliver', 'Upstream by Mary Oliver'],
      ambientSound: null,
    },
  };

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // Check if this is a sample room first
        if (sampleRooms[userId]) {
          setRoom(sampleRooms[userId]);
          setExhibits([]); // Sample rooms have no exhibits yet
          setLoading(false);
          return;
        }

        // Fetch room from backend
        const roomResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/rooms/${userId}`,
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

        // Fetch exhibits
        const exhibitsResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/exhibits/user/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        const exhibitsData = await exhibitsResponse.json();
        setExhibits(exhibitsData.exhibits || []);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="font-[family-name:var(--font-ui)] text-muted-foreground">
          Loading room...
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-headline)] text-4xl mb-4">
            Room not found
          </h1>
          <a href="/" className="text-accent hover:underline">
            Return to gallery
          </a>
        </div>
      </div>
    );
  }

  // Atmosphere background colors
  const atmosphereStyles = {
    warm: 'bg-[#F5F0EB]',
    cool: 'bg-[#E0E8F0]',
    stark: 'bg-white',
  };

  const atmosphereBg = atmosphereStyles[room.atmosphere] || atmosphereStyles.warm;

  return (
    <div className={`min-h-screen ${atmosphereBg} transition-colors duration-700`}>
      <div className="pt-32 pb-24">
        {/* Room Header - fades in on load */}
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-8 mb-24">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="font-[family-name:var(--font-headline)] text-6xl mb-4">
                  {room.writerName}
                </h1>
                {room.bio && (
                  <p className="font-[family-name:var(--font-body)] text-xl text-muted-foreground leading-relaxed max-w-2xl">
                    {room.bio}
                  </p>
                )}
              </div>
              
              {isOwnRoom && (
                <a
                  href="/dashboard"
                  className="px-4 py-2 border border-border hover:border-accent transition-colors font-[family-name:var(--font-ui)] text-sm"
                >
                  Edit room
                </a>
              )}
            </div>

            {/* Atmosphere indicator */}
            <div className="flex items-center gap-3 font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
              <div className={`w-6 h-6 ${atmosphereBg} border border-border`} />
              <span>
                Atmosphere: {room.atmosphere}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Bookshelf */}
        {room.bookshelf && room.bookshelf.length > 0 && (
          <ScrollReveal delay={200}>
            <div className="max-w-4xl mx-auto px-8 mb-24 py-12 border-t border-border">
              <h2 className="font-[family-name:var(--font-headline)] text-2xl mb-6">
                Bookshelf
              </h2>
              <div className="font-[family-name:var(--font-body)] text-muted-foreground">
                {room.bookshelf.map((item, index) => (
                  <div key={index} className="mb-2">
                    • {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Exhibits */}
        <div className="max-w-4xl mx-auto px-8">
          <ScrollReveal delay={100}>
            <h2 className="font-[family-name:var(--font-headline)] text-3xl mb-12">
              Exhibits
            </h2>
          </ScrollReveal>

          {exhibits.length === 0 ? (
            <ScrollReveal delay={200}>
              <div className="py-16 text-center">
                <p className="font-[family-name:var(--font-body)] text-lg text-muted-foreground mb-6">
                  {isOwnRoom ? "You haven't opened any exhibits yet." : "No exhibits yet."}
                </p>
                {isOwnRoom && (
                  <a
                    href="/dashboard"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)]"
                  >
                    Create your first exhibit
                  </a>
                )}
              </div>
            </ScrollReveal>
          ) : (
            <div className="space-y-12">
              {exhibits.map((exhibit, index) => {
                // Extract first 2 lines for preview
                const openingPreview = exhibit.openingNote 
                  ? exhibit.openingNote.split('\n').slice(0, 2).join(' ')
                  : '';
                
                return (
                  <ScrollReveal key={exhibit.id} delay={200 + index * 100}>
                    <a
                      href={`/exhibit/${exhibit.id}`}
                      className="block p-12 bg-card shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group border-t-2 border-t-[#C4918A]"
                    >
                      <h3 className="font-[family-name:var(--font-headline)] text-3xl mb-4 group-hover:text-[#C4918A] transition-colors">
                        {exhibit.title}
                      </h3>
                      {openingPreview && (
                        <p className="font-[family-name:var(--font-body)] text-lg text-muted-foreground leading-relaxed mb-4 italic line-clamp-2">
                          {openingPreview}
                        </p>
                      )}
                      <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground tracking-wide">
                        {exhibit.pieces.length} {exhibit.pieces.length === 1 ? 'piece' : 'pieces'}
                        <span className="mx-2">•</span>
                        {new Date(exhibit.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </a>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}