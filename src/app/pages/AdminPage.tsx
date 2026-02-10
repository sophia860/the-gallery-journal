import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectId } from '/utils/supabase/info';
import { Trash2, AlertTriangle } from 'lucide-react';

export function AdminPage() {
  const { user, accessToken } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState('');

  const handleClearExhibits = async () => {
    if (!confirm('Are you sure you want to delete ALL exhibits from the gallery? This cannot be undone.')) {
      return;
    }

    setClearing(true);
    setMessage('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07dc516a/admin/clear-exhibits`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessage(`✓ Successfully cleared ${data.count} exhibits from the gallery`);
      } else {
        const error = await response.json();
        setMessage(`✗ Error: ${error.error || 'Failed to clear exhibits'}`);
      }
    } catch (error) {
      console.error('Error clearing exhibits:', error);
      setMessage('✗ Error: Failed to clear exhibits');
    } finally {
      setClearing(false);
    }
  };

  if (!user) {
    window.location.href = '/signin';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F5F0EB] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        <h1 className="heading-page mb-8">Admin Tools</h1>
        
        <div className="space-y-6">
          {/* Design System Demo */}
          <div className="card fade-grow-in">
            <h3 className="heading-card mb-4">🎨 Design System</h3>
            <p className="text-body mb-6">
              View the complete design system with live examples of colors, typography, buttons, cards, and micro-interactions.
            </p>
            <a
              href="/admin/design-system-demo"
              className="btn-primary"
            >
              View Design System Demo
            </a>
          </div>

          {/* Demo Mode */}
          <div className="card fade-grow-in" style={{ animationDelay: '100ms' }}>
            <h3 className="heading-card mb-4">👤 Demo Mode</h3>
            <p className="text-body mb-6">
              Test the platform with pre-configured Writer and Editor accounts without creating new users.
            </p>
            <a
              href="/admin/demo-mode"
              className="btn-primary"
            >
              Go to Demo Mode
            </a>
          </div>

          {/* Clear Exhibits Section */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="w-6 h-6 text-[#E11D48] flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-2">
                  Clear All Exhibits
                </h2>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] leading-relaxed mb-4">
                  This will permanently delete all exhibits/poems from the gallery. Use this to start fresh with real content.
                </p>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#E11D48] leading-relaxed">
                  <strong>Warning:</strong> This action cannot be undone!
                </p>
              </div>
            </div>

            <button
              onClick={handleClearExhibits}
              disabled={clearing}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg"
            >
              <Trash2 className="w-5 h-5" />
              {clearing ? 'Clearing...' : 'Clear All Exhibits'}
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`p-5 border-2 rounded-xl font-['Courier_New'] text-sm ${
              message.includes('✓')
                ? 'bg-[#8A9A7B]/10 border-[#8A9A7B] text-[#2C1810]'
                : 'bg-[#E11D48]/10 border-[#E11D48] text-[#2C1810]'
            }`}>
              {message}
            </div>
          )}

          {/* Info */}
          <div className="mt-8 p-6 bg-white/50 border border-[#E0D8D0] rounded-xl">
            <h3 className="font-['Cardo'] text-lg text-[#2C1810] mb-3">
              What gets cleared
            </h3>
            <ul className="space-y-2 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
              <li>• All exhibit data (poems, opening notes, metadata)</li>
              <li>• All user exhibit associations</li>
              <li>• Gallery will be completely empty after this operation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}