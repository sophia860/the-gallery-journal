import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function EditorLoginPage() {
  const { signIn, supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // For demo: editor@thegallery.com / demo
      if (formData.email === 'editor@thegallery.com' && formData.password === 'demo') {
        localStorage.setItem('editor_logged_in', 'true');
        localStorage.setItem('editor_name', 'Demo Editor');
        localStorage.setItem('editor_role', 'editor');
        window.location.href = '/editor/dashboard';
        return;
      }

      await signIn(formData.email, formData.password);
      // Check if user is editor
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .single();
      
      if (profile?.role === 'editor') {
        window.location.href = '/editor/dashboard';
      } else {
        setError('Editor access only');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-8 relative overflow-hidden">
      {/* Starfield background */}
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
            radial-gradient(1px 1px at 20% 30%, rgba(196, 164, 108, 0.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(196, 164, 108, 0.3), transparent);
          background-size: 200% 200%
;
        }

        .stars-layer-2 {
          background-image:
            radial-gradient(1px 1px at 40% 40%, rgba(139, 157, 195, 0.3), transparent);
          background-size: 200% 200%;
        }
      `}</style>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-['Playfair_Display'] italic text-[64px] text-[#c4a46c] mb-4" style={{ lineHeight: '1.1', textShadow: '0 0 40px rgba(196, 164, 108, 0.25)' }}>
            The Studio
          </h1>
          <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
            Editor access only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[rgba(15,21,37,0.6)] border border-[rgba(196,164,108,0.2)] rounded p-10 backdrop-blur-md" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
          <h2 className="font-['Cardo'] text-2xl text-[#e0e0e0] mb-6">Editor Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#c4a46c] focus:outline-none transition-colors"
                placeholder="editor@thegallery.com"
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#c4a46c] focus:outline-none transition-colors"
                placeholder="your_password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-[#c4a46c] hover:bg-[#d4b47c] text-[#0d1117] font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] py-4 rounded transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Enter Studio'}
          </button>

          <div className="mt-6 p-4 bg-[rgba(196,164,108,0.1)] border border-[rgba(196,164,108,0.2)] rounded">
            <p className="font-['Courier_New'] text-[10px] uppercase tracking-[0.15em] text-[#c4a46c]/70 mb-2">
              Demo Access
            </p>
            <p className="font-['Cardo'] text-[13px] text-[#e0e0e0]/60 mb-0">
              editor@thegallery.com / demo
            </p>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#8b9dc3]/60 hover:text-[#8b9dc3] transition-colors cursor-pointer"
            >
              ← Back to Gallery
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
