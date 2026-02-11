import { useEffect, useState } from 'react';
import { GardenNav } from '../../components/GardenNav';

interface Notification {
  id: string;
  type: 'replant_request' | 'circle_invitation' | 'feedback' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired?: boolean;
  actionUrl?: string;
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const stored = localStorage.getItem('gardenNotifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      // Initialize with demo notifications
      const demoNotifications: Notification[] = [
        {
          id: '1',
          type: 'replant_request',
          title: 'Publication Offer from The Gallery',
          message: 'Editor Bea Sophia wants to publish "Memory is a kind of architecture" in the Spring 2026 issue. This is a Replant Request—your piece would move from your Garden to the public Gallery. View the request to accept or decline.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionRequired: true,
          actionUrl: '/garden/harvest',
        },
        {
          id: '2',
          type: 'circle_invitation',
          title: 'Circle Invitation',
          message: 'Sarah M. invited you to join "Poetry Workshop Circle"',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionRequired: true,
        },
        {
          id: '3',
          type: 'feedback',
          title: 'New Petal on your writing',
          message: 'Alex R. left a petal on "The light through winter trees"',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: false,
        },
        {
          id: '4',
          type: 'system',
          title: 'Welcome to The Garden',
          message: 'Start planting your first piece. Remember: there are no rejections here, only growth.',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          read: true,
        },
      ];
      setNotifications(demoNotifications);
      localStorage.setItem('gardenNotifications', JSON.stringify(demoNotifications));
    }
  }, []);

  const saveNotifications = (updated: Notification[]) => {
    setNotifications(updated);
    localStorage.setItem('gardenNotifications', JSON.stringify(updated));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const handleAccept = (id: string) => {
    alert('Request accepted! (This would trigger actual logic in production)');
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const handleDecline = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'replant_request':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#7a9b76" strokeWidth="2" fill="none">
            <path d="M12 20 L12 8 M8 12 L12 8 L16 12" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="4" r="2" fill="#7a9b76"/>
          </svg>
        );
      case 'circle_invitation':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#8b9dc3" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="8"/>
            <circle cx="9" cy="12" r="1.5" fill="#8b9dc3"/>
            <circle cx="15" cy="12" r="1.5" fill="#8b9dc3"/>
          </svg>
        );
      case 'feedback':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#c4a46c" strokeWidth="2" fill="none">
            <path d="M12 4 L14 10 L20 10 L15 14 L17 20 L12 16 L7 20 L9 14 L4 10 L10 10 Z" strokeLinejoin="round"/>
          </svg>
        );
      case 'system':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6" stroke="#8b9dc3" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="9"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <circle cx="12" cy="16" r="0.5" fill="#8b9dc3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative">
      {/* Starfield */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="stars-layer-1"></div>
        <div className="stars-layer-2"></div>
      </div>

      <style>{`
        .stars-layer-1, .stars-layer-2 {
          position: absolute;
          inset: 0;
          background-repeat: repeat;
        }

        .stars-layer-1 {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(122, 155, 118, 0.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(122, 155, 118, 0.3), transparent);
          background-size: 200% 200%;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 40% 40%, rgba(139, 157, 195, 0.3), transparent);
          background-size: 200% 200%;
        }
      `}</style>

      <GardenNav />

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-24">
        <h1 className="font-['Playfair_Display'] italic text-[48px] text-[#7a9b76] mb-12" style={{ lineHeight: '1.1' }}>
          Notifications
        </h1>

        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]">
              No notifications yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded p-6 backdrop-blur-sm ${
                  !notif.read ? 'border-[rgba(122,155,118,0.4)]' : ''
                }`}
                onClick={() => !notif.read && markAsRead(notif.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-['Cormorant_Garamond'] text-[18px] text-[#f5f0e8]">
                        {notif.title}
                      </h3>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-[#8b9dc3]/60">
                        {formatTimestamp(notif.timestamp)}
                      </span>
                    </div>

                    <p className="font-['Cormorant_Garamond'] text-[16px] text-[#e8ddd0]/80 mb-4" style={{ lineHeight: '1.6' }}>
                      {notif.message}
                    </p>

                    {/* Action buttons */}
                    {notif.actionRequired && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAccept(notif.id);
                          }}
                          className="px-6 py-2 bg-[rgba(122,155,118,0.15)] border border-[#7a9b76] hover:bg-[rgba(122,155,118,0.25)] text-[#7a9b76] transition-all font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDecline(notif.id);
                          }}
                          className="px-6 py-2 border border-[rgba(196,164,108,0.2)] hover:border-[#c4a46c] text-[#e8ddd0] hover:text-[#f5f0e8] transition-all font-['Cormorant_Garamond'] text-[13px] uppercase tracking-[0.15em] rounded cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {/* Unread indicator */}
                    {!notif.read && (
                      <div className="mt-3">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#7a9b76]"></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}