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