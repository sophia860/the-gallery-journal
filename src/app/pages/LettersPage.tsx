import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { Send, Mail, MailOpen } from 'lucide-react';

interface Letter {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
  createdAt: string;
}

export function LettersPage() {
  const { user, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent' | 'compose'>('inbox');
  const [inbox, setInbox] = useState<Letter[]>([]);
  const [sent, setSent] = useState<Letter[]>([]);
  const [composing, setComposing] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    const fetchLetters = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/letters/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setInbox(data.inbox || []);
        setSent(data.sent || []);
      } catch (error) {
        console.error('Error fetching letters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, [user, accessToken]);

  const handleSend = async () => {
    if (!user || !accessToken || !recipientId || !body.trim()) return;

    setSending(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/letters`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            recipientId,
            subject: subject || '(No subject)',
            body,
          }),
        }
      );

      if (response.ok) {
        setRecipientId('');
        setSubject('');
        setBody('');
        setComposing(false);
        setActiveTab('sent');
        
        // Refresh letters
        const refreshResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/letters/${user.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        const data = await refreshResponse.json();
        setSent(data.sent || []);
      }
    } catch (error) {
      console.error('Error sending letter:', error);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const future = date > now;
    
    if (future) {
      const mins = Math.round((date.getTime() - now.getTime()) / 1000 / 60);
      return `Delivering in ${mins} min${mins !== 1 ? 's' : ''}`;
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-[family-name:var(--font-headline)] text-5xl mb-4">
            Letters
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xl text-muted-foreground">
            Slow correspondence with other writers. No seen receipts, no typing indicators. 
            Letters take 15 minutes to arrive.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-6 py-3 border transition-colors font-[family-name:var(--font-ui)] flex items-center gap-2 ${
              activeTab === 'inbox'
                ? 'border-accent bg-accent/10 text-foreground'
                : 'border-border hover:border-accent text-muted-foreground'
            }`}
          >
            <Mail className="w-4 h-4" />
            Inbox ({inbox.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-6 py-3 border transition-colors font-[family-name:var(--font-ui)] flex items-center gap-2 ${
              activeTab === 'sent'
                ? 'border-accent bg-accent/10 text-foreground'
                : 'border-border hover:border-accent text-muted-foreground'
            }`}
          >
            <Send className="w-4 h-4" />
            Sent ({sent.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('compose');
              setComposing(true);
            }}
            className="ml-auto px-6 py-3 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)]"
          >
            Compose Letter
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center font-[family-name:var(--font-ui)] text-muted-foreground">
            Loading letters...
          </div>
        ) : (
          <>
            {/* Inbox */}
            {activeTab === 'inbox' && (
              <div className="space-y-4">
                {inbox.length === 0 ? (
                  <div className="py-16 text-center">
                    <MailOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground font-[family-name:var(--font-body)]">
                      No letters yet
                    </p>
                  </div>
                ) : (
                  inbox.map((letter) => (
                    <div
                      key={letter.id}
                      className="p-8 border border-border bg-card hover:border-accent transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-[family-name:var(--font-headline)] text-2xl">
                          {letter.subject}
                        </h3>
                        <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
                          {formatDate(letter.sentAt)}
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed whitespace-pre-wrap">
                        {letter.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Sent */}
            {activeTab === 'sent' && (
              <div className="space-y-4">
                {sent.length === 0 ? (
                  <div className="py-16 text-center">
                    <Send className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg text-muted-foreground font-[family-name:var(--font-body)]">
                      No sent letters yet
                    </p>
                  </div>
                ) : (
                  sent.map((letter) => (
                    <div
                      key={letter.id}
                      className="p-8 border border-border bg-card"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-[family-name:var(--font-headline)] text-2xl">
                          {letter.subject}
                        </h3>
                        <div className="font-[family-name:var(--font-ui)] text-sm text-muted-foreground">
                          {formatDate(letter.sentAt)}
                        </div>
                      </div>
                      <p className="font-[family-name:var(--font-body)] text-lg leading-relaxed whitespace-pre-wrap text-muted-foreground">
                        {letter.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Compose */}
            {activeTab === 'compose' && composing && (
              <div className="space-y-6">
                <div>
                  <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                    Recipient ID (for now, paste writer's user ID)
                  </label>
                  <input
                    type="text"
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-body)]"
                    placeholder="User ID of recipient"
                  />
                </div>

                <div>
                  <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-headline)] text-2xl"
                    placeholder="(No subject)"
                  />
                </div>

                <div>
                  <label className="block font-[family-name:var(--font-ui)] text-sm mb-2">
                    Your letter
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={16}
                    className="w-full px-4 py-4 bg-input-background border border-border focus:border-accent focus:outline-none font-[family-name:var(--font-body)] text-lg leading-relaxed resize-none"
                    placeholder="Dear..."
                    style={{ lineHeight: '1.8' }}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSend}
                    disabled={sending || !recipientId || !body.trim()}
                    className="px-8 py-4 bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors font-[family-name:var(--font-ui)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send Letter (15 min delay)'}
                  </button>
                  <button
                    onClick={() => {
                      setComposing(false);
                      setActiveTab('inbox');
                    }}
                    className="px-6 py-4 border border-border hover:border-accent transition-colors font-[family-name:var(--font-ui)]"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-sm text-muted-foreground font-[family-name:var(--font-ui)]">
                  Note: Letters arrive 15 minutes after sending. There are no seen receipts or typing indicators. 
                  This is slow correspondence by design.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
