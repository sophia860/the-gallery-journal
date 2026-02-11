import { useState } from 'react';
import { Sprout, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';

export function GardenSignInPage() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      await signIn(formData.email, formData.password);
      
      // Redirect to garden
      const redirect = new URLSearchParams(window.location.search).get('redirect') || '/my-garden';
      window.location.href = redirect;
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F0EB] to-[#FAF8F5]">
      <GardenMainNav />

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#8A9A7B]/20 rounded-full mb-6">
              <Sprout className="w-8 h-8 text-[#8A9A7B]" />
            </div>
            <h1 className="font-['Cardo'] text-5xl text-[#2C1810] mb-4 italic">
              Welcome Back
            </h1>
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
              Return to your garden
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8 shadow-lg">
            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={() => console.log('Google Sign-In clicked')}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-[#dadce0] rounded-lg hover:bg-[#f7f8f8] hover:shadow-sm transition-all active:scale-[0.98] mb-6"
              style={{
                fontFamily: 'inherit',
                fontSize: '14px',
                letterSpacing: '0.5px',
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
              <div className="flex-1 h-px bg-[#E0D8D0]"></div>
              <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-[#E0D8D0]"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2C1810] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a 
                  href="/garden/forgot-password" 
                  className="font-['Inter'] text-sm text-[#8A9A7B] hover:text-[#7A8A6B] transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-[#E11D48]/10 border-2 border-[#E11D48] rounded-lg">
                  <p className="font-['Courier_New'] text-sm text-[#E11D48]">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 pt-6 border-t border-[#E0D8D0] text-center">
              <p className="font-['Inter'] text-sm text-[#8B7355]">
                Don't have an account?{' '}
                <a href="/garden/signup" className="text-[#8A9A7B] hover:text-[#7A8A6B] font-semibold transition-colors">
                  Join The Garden
                </a>
              </p>
            </div>
          </div>

          {/* Philosophy */}
          <div className="mt-8 text-center">
            <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] italic leading-relaxed">
              "A space where your writing grows, not where it competes."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}