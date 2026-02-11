import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { NightSkyBackground } from '../components/NightSkyBackground';

export function EditorLoginPage() {
  const { signIn } = useAuth();
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
      await signIn(formData.email, formData.password);
      // TODO: Check if user has editor role
      window.location.href = '/editor/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-8 relative overflow-hidden">
      <NightSkyBackground />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <h1 
            className="font-['Playfair_Display'] italic text-[64px] text-[#c4a46c] mb-4" 
            style={{ lineHeight: '1.1', textShadow: '0 0 40px rgba(196, 164, 108, 0.3)' }}
          >
            Editor Access
          </h1>
          <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
            For curators and editors only.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="rounded-xl p-10 backdrop-blur-xl" 
          style={{ 
            background: 'rgba(15,21,37,0.6)', 
            border: '1px solid rgba(196, 164, 108, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' 
          }}
        >
          <h2 className="font-['Playfair_Display'] italic text-2xl text-white/95 mb-6">Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.15em] text-white/70 mb-2">
                Editor Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#c4a46c] focus:outline-none transition-colors"
                placeholder="editor@page.com"
              />
            </div>

            <div>
              <label className="block font-['Cormorant_Garamond'] text-[11px] uppercase tracking-[0.15em] text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-white focus:border-[#c4a46c] focus:outline-none transition-colors"
                placeholder="your_password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 rounded-lg backdrop-blur-xl transition-all cursor-pointer"
            style={{
              background: 'rgba(196, 164, 108, 0.2)',
              border: '1px solid rgba(196, 164, 108, 0.4)',
              color: 'white'
            }}
          >
            <span className="font-['Cormorant_Garamond'] text-[12px] uppercase tracking-[0.2em]">
              {loading ? 'Signing in...' : 'Sign In'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              localStorage.setItem('demoMode', 'true');
              localStorage.setItem('demoRole', 'editor');
              window.location.href = '/editor/dashboard';
            }}
            className="w-full mt-4 py-3 rounded-lg border border-[rgba(196,164,108,0.3)] hover:border-[rgba(196,164,108,0.6)] hover:bg-[rgba(196,164,108,0.05)] text-[#8b9dc3] hover:text-[#c4a46c] transition-all font-['Inter'] text-sm"
          >
            Try Editor Demo
          </button>

          <div className="mt-6 text-center">
            <a
              href="/garden/login"
              className="font-['Cormorant_Garamond'] text-[13px] text-white/50 hover:text-white/70 cursor-pointer transition-colors"
            >
              ← Back to Garden
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}