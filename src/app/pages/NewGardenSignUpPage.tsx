import { useState } from 'react';
import { Sprout, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function NewGardenSignUpPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.displayName, formData.displayName);
      // Redirect to setup flow
      window.location.href = '/setup';
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#A3C4A0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#D4B896]/10 rounded-full blur-3xl"></div>
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
            Start your garden
          </h1>
          <p className="font-['Inter'] text-base text-[#6B6B6B]">
            A place for your writing to grow
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-2 border-[#E5E0DA] rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                Display name
              </label>
              <input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors"
                placeholder="Your name"
                required
              />
            </div>

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
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block font-['Inter'] text-sm font-medium text-[#2C2C2C] mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-[#FAF8F5] border-2 border-[#E5E0DA] focus:border-[#7A9E7E] focus:outline-none font-['Inter'] text-base text-[#2C2C2C] rounded-lg transition-colors"
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#2C2C2C] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#7A9E7E] text-white hover:bg-[#6A8E6E] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Inter'] font-semibold text-base rounded-lg shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your garden...
                </>
              ) : (
                'Plant the first seed'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E0DA]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white font-['Inter'] text-[#9B9B9B]">or</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] transition-all font-['Inter'] font-medium text-[#2C2C2C] rounded-lg"
            >
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E0DA] hover:border-[#7A9E7E] transition-all font-['Inter'] font-medium text-[#2C2C2C] rounded-lg"
            >
              Continue with GitHub
            </button>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="mt-6 text-center font-['Inter'] text-sm text-[#6B6B6B]">
          Already have a garden?{' '}
          <a href="/garden/signin" className="text-[#7A9E7E] hover:text-[#6A8E6E] font-semibold transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
