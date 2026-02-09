import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';

interface CommonplaceEntry {
  id: string;
  text: string;
  context: string;
  savedAt: string;
}

export function CommonplacePage() {
  const { user, accessToken } = useAuth();
  const [entries, setEntries] = useState<CommonplaceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    const fetchCommonplace = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/commonplace/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setEntries(data.entries || []);
      } catch (error) {
        console.error('Error fetching commonplace book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommonplace();
  }, [user, accessToken]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-headline)] text-5xl mb-4">
            Your Commonplace Book
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xl text-muted-foreground">
            A private garden of collected fragments. Lines that stayed with you.
          </p>
        </div>

        {loading ? (
          <div className="font-[family-name:var(--font-ui)] text-muted-foreground">
            Loading your collection...
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-[family-name:var(--font-body)] text-lg text-muted-foreground mb-6">
              You haven't collected any lines yet. When you're reading a piece, select 
              text to save it here.
            </p>
            <a
              href="/"
              className="text-accent hover:underline font-[family-name:var(--font-ui)]"
            >
              Explore the gallery
            </a>
          </div>
        ) : (
          <div className="space-y-12">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-8 border border-border bg-card"
              >
                <blockquote className="font-[family-name:var(--font-poetry)] text-xl leading-relaxed mb-6 italic">
                  "{entry.text}"
                </blockquote>
                
                {entry.context && (
                  <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground mb-2">
                    From: {entry.context}
                  </div>
                )}
                
                <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
                  Saved {new Date(entry.savedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
