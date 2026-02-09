import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';

interface Room {
  id: string;
  writerName: string;
  bio: string;
  atmosphere: 'warm' | 'cool' | 'stark';
  customFont: string;
  bookshelf: string[];
}

export function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    writerName: '',
    bio: '',
    atmosphere: 'warm' as 'warm' | 'cool' | 'stark',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    const fetchRoom = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/rooms/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        if (data.room) {
          setRoom(data.room);
          setFormData({
            writerName: data.room.writerName,
            bio: data.room.bio || '',
            atmosphere: data.room.atmosphere || 'warm',
          });
        }
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    };

    fetchRoom();
  }, [user, accessToken]);

  const handleSave = async () => {
    if (!user || !accessToken) return;

    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/rooms/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (data.room) {
        setRoom(data.room);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating room:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="flex justify-between items-start mb-12">
          <h1 className="font-[family-name:var(--font-headline)] text-5xl">
            Your Dashboard
          </h1>
          <a
            href={`/room/${user.id}`}
            className="px-4 py-2 border border-border hover:border-accent transition-colors font-[family-name:var(--font-ui)] text-sm"
          >
            View your room
          </a>
        </div>

        {/* Room Settings */}
        <div className="mb-16 p-8 border border-border bg-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-[family-name:var(--font-headline)] text-2xl">
              Room Settings
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 border border-border hover:border-accent transition-colors font-[family-name:var(--font-ui)] text-sm"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <div className="space-y-6">
              <div>
                <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                  Writer name
                </label>
                <input
                  type="text"
                  value={formData.writerName}
                  onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
                  className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-body)]"
                />
              </div>

              <div>
                <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-body)] resize-none"
                  placeholder="Tell visitors about yourself and your work..."
                />
              </div>

              <div>
                <label className="block font-[family-name:var(--font-ui)] text-sm mb-3">
                  Atmosphere
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['warm', 'cool', 'stark'] as const).map((atmosphere) => (
                    <button
                      key={atmosphere}
                      onClick={() => setFormData({ ...formData, atmosphere })}
                      className={`p-4 border transition-colors ${
                        formData.atmosphere === atmosphere
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent'
                      }`}
                    >
                      <div
                        className={`w-full h-12 mb-2 border border-border ${
                          atmosphere === 'warm' ? 'bg-[#F5F0EB]' :
                          atmosphere === 'cool' ? 'bg-[#E0E8F0]' :
                          'bg-white'
                        }`}
                      />
                      <div className="font-[family-name:var(--font-ui)] text-sm capitalize">
                        {atmosphere}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)] disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    if (room) {
                      setFormData({
                        writerName: room.writerName,
                        bio: room.bio || '',
                        atmosphere: room.atmosphere || 'warm',
                      });
                    }
                  }}
                  className="px-6 py-3 border border-border hover:border-accent transition-colors font-[family-name:var(--font-ui)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 font-[family-name:var(--font-body)]">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Writer name</div>
                <div>{room?.writerName}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Bio</div>
                <div className="whitespace-pre-wrap">{room?.bio || 'No bio yet'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Atmosphere</div>
                <div className="capitalize">{room?.atmosphere}</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <a
            href="/dashboard/new-exhibit"
            className="p-8 border border-border hover:border-accent transition-colors group"
          >
            <h3 className="font-[family-name:var(--font-headline)] text-2xl mb-3 group-hover:text-accent transition-colors">
              Open a new exhibit
            </h3>
            <p className="font-[family-name:var(--font-body)] text-muted-foreground">
              Create a curated collection of your writing
            </p>
          </a>

          <a
            href="/commonplace"
            className="p-8 border border-border hover:border-accent transition-colors group"
          >
            <h3 className="font-[family-name:var(--font-headline)] text-2xl mb-3 group-hover:text-accent transition-colors">
              Your commonplace book
            </h3>
            <p className="font-[family-name:var(--font-body)] text-muted-foreground">
              View lines you've collected from other writers
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
