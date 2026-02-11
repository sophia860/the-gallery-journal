import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NightSkyBackground } from '../../components/NightSkyBackground';

export function SignupPage() {
  const { signUp, supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    writerName: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.displayName) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(
        formData.email,
        formData.password,
        formData.displayName,
        formData.writerName || formData.displayName
      );
      window.location.href = '/garden/dashboard';
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/garden/dashboard'
        }
      });
      
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    }
  };

  const handleGuestMode = () => {
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', 'writer');
    window.location.href = '/garden/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center px-8 relative overflow-hidden">
      <NightSkyBackground />
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-['Playfair_Display'] italic text-[64px] text-[#7a9b76] mb-4" style={{ lineHeight: '1.1', textShadow: '0 0 40px rgba(122, 155, 118, 0.25)' }}>
            The Garden
          </h1>
          <p className="font-['Cormorant_Garamond'] text-[18px] text-[#8b9dc3]" style={{ lineHeight: '1.8' }}>
            Start here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[rgba(15,21,37,0.6)] border border-[rgba(122,155,118,0.2)] rounded p-10 backdrop-blur-md" style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
          <h2 className="font-['Cardo'] text-2xl text-[#e0e0e0] mb-6">Create Account</h2>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-[#dadce0] rounded-lg hover:bg-[#f7f8f8] hover:shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98] mb-6"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              color: '#3c4043',
            }}
          >
            {/* Google G Logo SVG */}
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.15)]"></div>
            <span className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/50">or</span>
            <div className="flex-1 h-px bg-[rgba(0,0,0,0.15)]"></div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                placeholder="your_password"
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                Display Name *
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                Writer Name
              </label>
              <input
                type="text"
                value={formData.writerName}
                onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors"
                placeholder="Your Writer Name"
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/70 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-[#121212] border border-[#333] rounded px-4 py-3 text-[#e0e0e0] focus:border-[#7a9b76] focus:outline-none transition-colors resize-none"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#7a9b76] hover:bg-[#8fb587] text-white font-['Courier_New'] text-[12px] uppercase tracking-[0.2em] py-4 rounded transition-colors cursor-pointer"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleGuestMode}
              className="font-['Courier_New'] text-[11px] uppercase tracking-[0.15em] text-[#e0e0e0]/60 hover:text-[#e0e0e0] transition-colors cursor-pointer"
            >
              Continue as Guest
            </button>
          </div>

          <div className="mt-6 text-center">
            <span className="font-['Cardo'] text-[14px] text-[#e0e0e0]/60">
              Already have an account?{' '}
              <a
                href="/garden/login"
                className="text-[#7a9b76] hover:text-[#8fb587] cursor-pointer"
              >
                Login
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}