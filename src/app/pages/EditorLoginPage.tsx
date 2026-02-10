import { useState, useEffect } from 'react';
import { Key, ArrowRight, Mail, Lock, UserPlus, Copy, CheckCircle } from 'lucide-react';
import { enableDemoMode } from '../../services/editorService';

interface EditorInvite {
  token: string;
  email: string;
  role: 'editor' | 'managing_editor';
  used: boolean;
  createdAt: string;
}

export function EditorLoginPage() {
  const [mode, setMode] = useState<'login' | 'invite'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<EditorInvite | null>(null);

  useEffect(() => {
    // Check for invite token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('invite');
    
    if (token) {
      // Validate invite token
      const invites = JSON.parse(localStorage.getItem('editor_invites') || '[]');
      const invite = invites.find((inv: EditorInvite) => inv.token === token && !inv.used);
      
      if (invite) {
        setMode('invite');
        setInviteToken(token);
        setInviteData(invite);
        setEmail(invite.email);
      } else {
        setError('This invite link is invalid or has already been used.');
      }
    }
  }, []);

  const handleDemoLogin = () => {
    // Enable demo mode
    enableDemoMode();
    localStorage.setItem('editor_logged_in', 'true');
    localStorage.setItem('editor_name', 'Demo Editor');
    localStorage.setItem('editor_role', 'editor');
    
    // Redirect to dashboard
    window.location.href = '/editors/dashboard';
  };

  const handleInviteSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      // Mark invite as used
      const invites = JSON.parse(localStorage.getItem('editor_invites') || '[]');
      const updatedInvites = invites.map((inv: EditorInvite) => 
        inv.token === inviteToken ? { ...inv, used: true } : inv
      );
      localStorage.setItem('editor_invites', JSON.stringify(updatedInvites));

      // Create editor account (in demo mode, just store in localStorage)
      enableDemoMode();
      localStorage.setItem('editor_logged_in', 'true');
      localStorage.setItem('editor_name', email.split('@')[0]);
      localStorage.setItem('editor_role', inviteData?.role || 'editor');
      localStorage.setItem('editor_email', email);

      // TODO: In production, create Supabase user with auth.admin.createUser

      // Redirect to dashboard
      window.location.href = '/editors/dashboard';
    } catch (err) {
      setError('Failed to complete setup. Please try again.');
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // For demo purposes, check for demo credentials
    if (email === 'editor@thegallery.com' && password === 'demo') {
      handleDemoLogin();
      return;
    }

    // TODO: Implement real Supabase authentication
    setError('Invalid credentials. Use editor@thegallery.com / demo for demo mode.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#F5F0EB] to-[#FAF8F5] flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2C1810] to-[#1A1A1A] rounded-2xl mb-6 shadow-xl">
            <Key className="w-10 h-10 text-[#C4A265]" />
          </div>
          <h1 className="font-['Cardo'] text-6xl text-[#2C1810] italic mb-3">
            {mode === 'invite' ? 'Welcome' : 'Editor Studio'}
          </h1>
          <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
            {mode === 'invite' 
              ? 'Complete your account setup'
              : 'The private door of The Gallery'
            }
          </p>
        </div>

        {/* Invite Setup Form */}
        {mode === 'invite' && inviteData && (
          <form onSubmit={handleInviteSetup} className="bg-white border-2 border-[#E0D8D0] rounded-2xl p-8 shadow-xl mb-6">
            <div className="mb-6 p-4 bg-[#8A9A7B]/10 border-2 border-[#8A9A7B]/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-5 h-5 text-[#8A9A7B]" />
                <p className="font-['Inter'] text-sm font-semibold text-[#2C1810]">
                  You've been invited as {inviteData.role === 'managing_editor' ? 'Managing Editor' : 'Editor'}
                </p>
              </div>
              <p className="font-['Inter'] text-xs text-[#8B7355]">
                Set up your password to access the editorial dashboard
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block font-['Inter'] text-sm font-medium text-[#2C1810] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#E0D8D0] rounded-xl bg-[#F5F0EB]/30 font-['Inter'] text-sm text-[#8B7355]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block font-['Inter'] text-sm font-medium text-[#2C1810] mb-2">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#E0D8D0] rounded-xl focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-['Inter'] text-sm font-medium text-[#2C1810] mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#E0D8D0] rounded-xl focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-[#E11D48]/10 border-2 border-[#E11D48]/20 rounded-xl">
                  <p className="font-['Inter'] text-sm text-[#E11D48]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#2C1810] text-white hover:bg-[#1A1A1A] transition-all font-['Cardo'] text-lg tracking-wide group disabled:opacity-50 rounded-xl shadow-lg"
              >
                {loading ? 'Setting up...' : 'Complete Setup'}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}

        {/* Normal Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="bg-white border-2 border-[#E0D8D0] rounded-2xl p-8 shadow-xl mb-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block font-['Inter'] text-sm font-medium text-[#2C1810] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="editor@thegallery.com"
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#E0D8D0] rounded-xl focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block font-['Inter'] text-sm font-medium text-[#2C1810] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-11 pr-4 py-3 border-2 border-[#E0D8D0] rounded-xl focus:border-[#8A9A7B] focus:outline-none font-['Inter'] text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-[#E11D48]/10 border-2 border-[#E11D48]/20 rounded-xl">
                  <p className="font-['Inter'] text-sm text-[#E11D48]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#2C1810] text-white hover:bg-[#1A1A1A] transition-all font-['Cardo'] text-lg tracking-wide group disabled:opacity-50 rounded-xl shadow-lg"
              >
                {loading ? 'Logging in...' : 'Log In'}
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        )}

        {/* Demo Mode Card */}
        {mode === 'login' && (
          <div className="p-6 bg-white/60 border-2 border-[#E0D8D0] rounded-2xl backdrop-blur-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#8A9A7B]/10 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5 text-[#8A9A7B]" />
              </div>
              <div>
                <h3 className="font-['Cardo'] text-lg text-[#2C1810] mb-1">Demo Mode</h3>
                <p className="font-['Inter'] text-sm text-[#8B7355] leading-relaxed">
                  Try the editor dashboard without authentication. Perfect for exploring features.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full px-4 py-3 border-2 border-[#8A9A7B] text-[#8A9A7B] hover:bg-[#8A9A7B] hover:text-white transition-all font-['Inter'] text-sm font-medium rounded-xl"
            >
              Launch Demo Dashboard
            </button>
          </div>
        )}

        {/* Back to Gallery */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#8B7355] hover:text-[#2C1810] transition-colors font-['Libre_Baskerville']"
          >
            ← Back to The Gallery
          </a>
        </div>
      </div>
    </div>
  );
}
