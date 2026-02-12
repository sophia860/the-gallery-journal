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

      // Wait for auth state to fully propagate before navigating
      // This prevents the redirect loop where MyGardenPage sees no user yet
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verify session is established before redirecting
      const { data: sessionCheck } = await supabase.auth.getSession();
      if (sessionCheck.session) {
        console.log('[NewGardenSignInPage] Session confirmed, navigating to /my-garden');
        // Navigate to garden after successful sign in
        window.history.pushState({}, '', '/my-garden');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } else {
        console.warn('[NewGardenSignInPage] Session not found after sign in, retrying...');
        // Retry after another short wait
        await new Promise(resolve => setTimeout(resolve, 500));
        window.history.pushState({}, '', '/my-garden');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
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
          redirectTo: window.location.origin + '/my-garden',
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
          redirectTo: window.location.origin + '/my-garden',
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
    <div className="min-h-screen bg-[#FAF8F5] relative overflow-hidden">
      {/* Back to Gallery Button - Fixed Position */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E5E0DA] rounded-full shadow-sm hover:shadow-md transition-all font-['Inter'] text-sm text-[#6B6B6B] hover:text-[#2C2C2C]"
      >
        Back to Gallery
      </a>

      {/* Botanical Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Decorative botanical elements */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-[0.04]">
          <Sprout className="w-full h-full text-[#7A9E7E]" />
        </div>
        <div className="absolute bottom-20 right-10 w-40 h-40 opacity-[0.04]">
          <Sprout className="w-full h-full text-[#7A9E7E]" />
        </div>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center pt-16 pb-8">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="flex items-center gap-3 group"
        >
          <Sprout className="w-8 h-8 text-[#7A9E7E] group-hover:scale-110 transition-transform" />
          <span className="font-['Playfair_Display'] text-2xl text-[#2C2C2C] italic">
            garden
          </span>
        </a>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#2C2C2C] italic mb-2">
          Welcome back
        </h1>
        <p className="font-['Inter'] text-[#9B9B9B] text-sm">
          Return to your garden
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-md mx-auto px-6 pb-16">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-['Inter'] text-sm font-medium text-[#6B6B6B] mb-1.5">
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
            <label htmlFor="password" className="block font-['Inter'] text-sm font-medium text-[#6B6B6B] mb-1.5">
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
              <span className="font-['Inter'] text-sm text-[#6B6B6B]">Remember me</span>
            </label>
            <a
              href="/garden/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/garden/forgot-password');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="font-['Inter'] text-sm text-[#7A9E7E] hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="font-['Inter'] text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7A9E7E] hover:bg-[#6B8F6F] text-white font-['Inter'] text-base font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                Signing in...
              </>
            ) : (
              'Return to your garden'
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-[#E5E0DA]"></div>
            <span className="font-['Inter'] text-xs text-[#9B9B9B] uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-[#E5E0DA]"></div>
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 border-2 border-[#E5E0DA] rounded-lg hover:bg-[#F5F0EB] transition-colors font-['Inter'] text-sm text-[#6B6B6B] disabled:opacity-60"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={handleGithubSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-3 border-2 border-[#E5E0DA] rounded-lg hover:bg-[#F5F0EB] transition-colors font-['Inter'] text-sm text-[#6B6B6B] disabled:opacity-60"
            >
              Continue with GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center font-['Inter'] text-sm text-[#9B9B9B] mt-6">
            New here?{' '}
            <a
              href="/garden/signup"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/garden/signup');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-[#7A9E7E] hover:underline font-medium"
            >
              Plant your first seed
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
