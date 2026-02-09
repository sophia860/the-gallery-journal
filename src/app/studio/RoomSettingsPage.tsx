import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { ArrowLeft } from 'lucide-react';

interface Room {
  id: string;
  writerName: string;
  bio: string;
  atmosphere: 'warm' | 'cool' | 'stark';
  customFont: string;
  bookshelf: string[];
}

export function RoomSettingsPage() {
  const { user, accessToken } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    writerName: '',
    bio: '',
    atmosphere: 'warm' as 'warm' | 'cool' | 'stark',
    bookshelf: [] as string[],
  });
  const [newBookshelfItem, setNewBookshelfItem] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
            bookshelf: data.room.bookshelf || [],
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
    setSaveMessage('');

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
        setSaveMessage('Room settings saved');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating room:', error);
      setSaveMessage('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addBookshelfItem = () => {
    if (newBookshelfItem.trim()) {
      setFormData({
        ...formData,
        bookshelf: [...formData.bookshelf, newBookshelfItem.trim()],
      });
      setNewBookshelfItem('');
    }
  };

  const removeBookshelfItem = (index: number) => {
    setFormData({
      ...formData,
      bookshelf: formData.bookshelf.filter((_, i) => i !== index),
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-8 py-24">
        {/* Header */}
        <div className="mb-12">
          <a 
            href="/studio"
            className="inline-flex items-center gap-2 text-[#717171] hover:text-[#5B8A8A] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-['Courier_New'] text-sm">Back to Studio</span>
          </a>
          
          <h1 className="font-serif text-5xl mb-4 text-[#2B2B2B]">
            Room Settings
          </h1>
          <p className="text-lg text-[#717171]">
            Customize how your public room appears in the gallery
          </p>
        </div>

        {saveMessage && (
          <div className="mb-6 p-4 border-2 border-[#8A9A7B] bg-[#8A9A7B]/10 font-['Courier_New'] text-sm text-[#2B2B2B]">
            {saveMessage}
          </div>
        )}

        <div className="space-y-8">
          {/* Writer Name */}
          <div>
            <label className="block font-['Courier_New'] text-sm text-[#717171] mb-2">
              WRITER NAME
            </label>
            <input
              type="text"
              value={formData.writerName}
              onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#E0D8D0] bg-white font-serif text-lg focus:border-[#5B8A8A] focus:outline-none"
            />
            <p className="mt-2 text-sm text-[#717171]">
              How your name appears on your room and in the gallery
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block font-['Courier_New'] text-sm text-[#717171] mb-2">
              BIO
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border-2 border-[#E0D8D0] bg-white font-serif text-lg focus:border-[#5B8A8A] focus:outline-none resize-none"
              placeholder="Tell visitors about yourself and your work..."
            />
          </div>

          {/* Atmosphere */}
          <div>
            <label className="block font-['Courier_New'] text-sm text-[#717171] mb-3">
              ATMOSPHERE
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['warm', 'cool', 'stark'] as const).map((atmosphere) => (
                <button
                  key={atmosphere}
                  onClick={() => setFormData({ ...formData, atmosphere })}
                  className={`p-6 border-2 transition-colors ${
                    formData.atmosphere === atmosphere
                      ? 'border-[#5B8A8A] bg-[#5B8A8A]/10'
                      : 'border-[#E0D8D0] hover:border-[#5B8A8A]'
                  }`}
                >
                  <div
                    className={`w-full h-16 mb-3 border-2 border-[#E0D8D0] ${
                      atmosphere === 'warm' ? 'bg-[#F5F0EB]' :
                      atmosphere === 'cool' ? 'bg-[#E0E8F0]' :
                      'bg-white'
                    }`}
                  />
                  <div className="font-['Courier_New'] text-sm text-[#2B2B2B] uppercase">
                    {atmosphere}
                  </div>
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-[#717171]">
              The background color temperature of your room. This is the first thing visitors see.
            </p>
          </div>

          {/* Bookshelf */}
          <div>
            <label className="block font-['Courier_New'] text-sm text-[#717171] mb-2">
              BOOKSHELF
            </label>
            <p className="text-sm text-[#717171] mb-4">
              Curated influences: books, albums, films, other writers
            </p>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newBookshelfItem}
                onChange={(e) => setNewBookshelfItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addBookshelfItem()}
                className="flex-1 px-4 py-3 border-2 border-[#E0D8D0] bg-white font-serif focus:border-[#5B8A8A] focus:outline-none"
                placeholder="Add a book, album, or influence..."
              />
              <button
                onClick={addBookshelfItem}
                className="px-6 py-3 border-2 border-[#5B8A8A] bg-[#5B8A8A] text-white hover:bg-[#4A7979] transition-colors font-['Courier_New'] text-sm"
              >
                ADD
              </button>
            </div>

            {formData.bookshelf.length > 0 && (
              <div className="space-y-2">
                {formData.bookshelf.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border-2 border-[#E0D8D0] bg-white"
                  >
                    <span className="font-serif text-[#2B2B2B]">{item}</span>
                    <button
                      onClick={() => removeBookshelfItem(index)}
                      className="text-[#C4918A] hover:text-[#B37F79] font-['Courier_New'] text-sm"
                    >
                      REMOVE
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t-2 border-[#E0D8D0]">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 border-2 border-[#5B8A8A] bg-[#5B8A8A] text-white hover:bg-[#4A7979] transition-colors font-['Courier_New'] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'SAVING...' : 'SAVE ROOM SETTINGS'}
            </button>
            
            <a
              href={`/room/${user.id}`}
              className="ml-4 inline-block px-6 py-4 border-2 border-[#E0D8D0] hover:border-[#5B8A8A] transition-colors font-['Courier_New'] text-sm"
            >
              PREVIEW YOUR ROOM
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
