import { useEffect, useState } from 'react';
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

export function RoomPage({ userId }: RoomPageProps) {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [exhibits, setExhibits] = useState<Exhibit[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnRoom = user?.id === userId;

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        // Fetch room
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
        {/* Room Header */}
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

        {/* Bookshelf */}
        {room.bookshelf && room.bookshelf.length > 0 && (
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
        )}

        {/* Exhibits */}
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="font-[family-name:var(--font-headline)] text-3xl mb-12">
            Exhibits
          </h2>

          {exhibits.length === 0 ? (
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
          ) : (
            <div className="space-y-12">
              {exhibits.map((exhibit) => (
                <a
                  key={exhibit.id}
                  href={`/exhibit/${exhibit.id}`}
                  className="block p-12 border border-border hover:border-accent transition-colors group bg-card"
                >
                  <h3 className="font-[family-name:var(--font-headline)] text-3xl mb-4 group-hover:text-accent transition-colors">
                    {exhibit.title}
                  </h3>
                  {exhibit.openingNote && (
                    <p className="font-[family-name:var(--font-body)] text-lg text-muted-foreground leading-relaxed mb-4">
                      {exhibit.openingNote}
                    </p>
                  )}
                  <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
                    {exhibit.pieces.length} {exhibit.pieces.length === 1 ? 'piece' : 'pieces'}
                    {' • '}
                    {new Date(exhibit.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
