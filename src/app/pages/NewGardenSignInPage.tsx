import { useState } from 'react';
import { Sprout, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function NewGardenSignInPage() {
  const { signIn, supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      console.log('[NewGardenSignInPage] Attempting sign in...');
      await signIn(formData.email, formData.password);
      
    console.log('[NewGardenSignInPage] Sign in successful');
            // Navigate to garden after successful sign in - full reload ensures auth state is ready
      window.location.href = '/garden/dashboard';
          } catch (err: any) {
      console.error('[NewGardenSignInPage] Sign in error:', err);
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/garden/dashboard',
        }
      });

      if (error) {
        setError(error.message || 'Google sign-in failed');
        setLoading(false);
        return;
      }

      if (!data || !data.url) {
        setError('Google sign-in is not available yet. Please use email and password to sign in.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during Google sign-in.');
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/garden/dashboard',
        }
      });

      if (error) {
        setError(error.message || 'GitHub sign-in failed');
        setLoading(false);
        return;
      }

      if (!data || !data.url) {
        setError('GitHub sign-in is not available yet. Please use email and password to sign in.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during GitHub sign-in.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-12">
      {/* Back to Gallery Button - Fixed Position */}
      <a 
        href="/"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border-2 border-[#E5E0DA] hover:border-[#7A9E7E] rounded-lg transition-all shadow-sm hover:shadow-md group"
      >
        <svg className="w-5 h-5 text-[#7A9E7E] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-['Inter'] text-sm font-medium text-[#2C2C2C]">
          Back to Gallery
        </span>
      </a>

      {/* Botanical Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#A3C4A0]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#D4B896]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-[#C48B8B]/5 rounded-full blur-2xl"></div>
        
        {/* Decorative botanical elements */}
        <svg className="absolute top-10 right-20 w-32 h-32 text-[#A3C4A0]/8" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 10 Q60 30 50 50 Q40 30 50 10" />
          <path d="M50 50 Q70 60 50 80 Q30 60 50 50" />
          <circle cx="50" cy="50" r="3" />
        </svg>
        <svg className="absolute bottom-20 left-20 w-40 h-40 text-[#D4B896]/8" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 20 L55 40 L50 60 L45 40 Z" />
          <circle cx="50" cy="60" r="8" />
        </svg>
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <Sprout className="w-8 h-8 text-[#7A9E7E]" />
            <span className="font-['Lora'] text-3xl font-semibold text-[#2C2C2C] lowercase italic">
              garden
            </span>
          </a>
          <h1 className="font-['Lora'] text-3xl font-semibold text-[#2C2C2C] mb-2">
            Welcome back
          </h1>
          <p className="font-['Inter'] text-base text-[#6B6B6B]">
            Return to your garden
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#2C2C2C] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="w-4 h-4 border-2 border-[#E5E0DA] rounded text-[#7A9E7E] focus:ring-2 focus:ring-[#7A9E7E]/20"
                />
                <span className="font-['Inter'] text-sm text-[#6B6B6B]">
                  Remember me
                </span>
              </label>
              <a
                href="/garden/forgot-password"
                className="font-['Inter'] text-sm text-[#7A9E7E] hover:text-[#6A8E6E] font-medium transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-[#FAF2F2] border-2 border-[#C48B8B] rounded-lg">
                <p className="font-['Inter'] text-sm text-[#9E5A5A]">
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C4795B] text-white hover:bg-[#B4694B] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Inter'] font-semibold text-base rounded-lg shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Return to your garden'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E0DA]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white font-['Inter'] text-[#9B9B9B]">or continue with</span>
            </div>
          </div>

          {/* Social Sign In */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] transition-all font-['Inter'] font-medium text-[#2C2C2C] rounded-lg flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              type="button"
              onClick={handleGithubSignIn}
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] transition-all font-['Inter'] font-medium text-[#2C2C2C] rounded-lg flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 text-center font-['Inter'] text-sm text-[#6B6B6B]">
          New here?{' '}
          <a href="/garden/signup" className="text-[#7A9E7E] hover:text-[#6A8E6E] font-semibold transition-colors">
            Plant your first seed
          </a>
        </p>
      </div>
    </div>
  );
}
