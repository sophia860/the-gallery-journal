import { useState } from 'react';
import { Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GalleryNav } from '../components/GalleryNav';

export function SignInPage() {
  const { signIn, user, supabase } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get the redirect URL from query params or default to /studio
  const getRedirectUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    return redirect || '/studio';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Query the profiles table to get user role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Redirect based on role
        if (profile?.role === 'editor' || profile?.role === 'eic' || profile?.role === 'admin') {
          window.location.href = '/editor-dashboard';
        } else {
          window.location.href = getRedirectUrl();
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      console.log('[GitHub OAuth] Initiating GitHub sign-in...');
      console.log('[GitHub OAuth] IMPORTANT: Make sure GitHub OAuth is configured in your Supabase dashboard:');
      console.log('[GitHub OAuth] https://supabase.com/docs/guides/auth/social-login/auth-github');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/editor-dashboard`,
        },
      });

      if (error) {
        console.error('[GitHub OAuth] Error:', error);
        throw error;
      }

      console.log('[GitHub OAuth] Redirect initiated, user will be sent to GitHub...');
      
      // Note: The actual redirect happens automatically, and the user will be brought back
      // to the redirectTo URL after authenticating with GitHub
    } catch (err: any) {
      console.error('[GitHub OAuth] Sign-in failed:', err);
      
      // Provide helpful error message
      let errorMessage = 'Failed to sign in with GitHub.';
      
      if (err.message.includes('not enabled')) {
        errorMessage = 'GitHub sign-in is not configured. Please set up GitHub OAuth in your Supabase dashboard.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* The Gallery Navigation */}
      <GalleryNav />

      {/* Sign In Form */}
      <div className="pt-40 pb-24 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <h1 className="font-['Cardo'] text-6xl mb-4 text-[#2C2C2C]">
              Welcome Back
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[#717171] text-lg">
              Enter your room in The Gallery
            </p>
          </div>

          <div className="bg-white border-2 border-[#E0D8D0] p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-[#E11D48]/10 border border-[#E11D48] text-[#E11D48] font-['Courier_New'] text-sm">
                  {error}
                </div>
              )}

              <div>
                <label 
                  htmlFor="email" 
                  className="block font-['Courier_New'] text-xs tracking-wider text-[#717171] mb-2"
                >
                  EMAIL
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F0EB] border-2 border-[#E0D8D0] focus:border-[#C4918A] focus:outline-none font-[family-name:var(--font-body)]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block font-['Courier_New'] text-xs tracking-wider text-[#717171] mb-2"
                >
                  PASSWORD
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F5F0EB] border-2 border-[#E0D8D0] focus:border-[#C4918A] focus:outline-none font-[family-name:var(--font-body)]"
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E0D8D0]"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#717171] font-['Courier_New']">Or</span>
                </div>
              </div>
              
              {/* GitHub Sign In - For Editors */}
              <button
                onClick={handleGitHubSignIn}
                disabled={loading}
                className="mt-4 w-full px-6 py-4 bg-[#24292e] text-white hover:bg-[#1a1e22] transition-colors font-['Courier_New'] text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sign in with GitHub</span>
                <span className="ml-auto text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                  For Editors
                </span>
              </button>
              
              <a
                href={getRedirectUrl()}
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('demoMode', 'true');
                  }
                }}
                className="mt-4 w-full px-6 py-4 bg-white border-2 border-[#E0D8D0] text-[#717171] hover:border-[#C4918A] hover:text-[#2C2C2C] transition-colors font-['Courier_New'] text-sm flex items-center justify-center gap-2"
              >
                Continue as Guest (Demo Mode)
              </a>
            </div>

            <p className="mt-8 text-center font-['Courier_New'] text-sm text-[#717171]">
              Don't have a room yet?{' '}
              <a href="/signup" className="text-[#E11D48] hover:text-[#C01040] transition-colors">
                Join The Gallery
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}