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
