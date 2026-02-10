import { useState } from 'react';
import { Sprout, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GardenMainNav } from '../components/GardenMainNav';

export function GardenSignUpPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    writerName: '',
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'account' | 'profile'>('account');

  const handleAccountNext = () => {
    setError('');
    
    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword) {
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

    setStep('profile');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.displayName.trim()) {
      setError('Please enter your display name');
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

      // Redirect to garden
      window.location.href = '/my-garden';
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
              Join The Garden
            </h1>
            <p className="font-['Libre_Baskerville'] text-lg text-[#8B7355]">
              A space for your writing to grow
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-['Inter'] text-sm font-semibold ${
                step === 'account' ? 'bg-[#8A9A7B] text-white' : 'bg-white border-2 border-[#8A9A7B] text-[#8A9A7B]'
              }`}>
                {step === 'profile' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <span className={`font-['Inter'] text-sm ${step === 'account' ? 'text-[#2C1810] font-semibold' : 'text-[#8B7355]'}`}>
                Account
              </span>
            </div>
            <div className={`h-px w-12 ${step === 'profile' ? 'bg-[#8A9A7B]' : 'bg-[#E0D8D0]'}`}></div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-['Inter'] text-sm font-semibold ${
                step === 'profile' ? 'bg-[#8A9A7B] text-white' : 'bg-white border-2 border-[#E0D8D0] text-[#8B7355]'
              }`}>
                2
              </div>
              <span className={`font-['Inter'] text-sm ${step === 'profile' ? 'text-[#2C1810] font-semibold' : 'text-[#8B7355]'}`}>
                Profile
              </span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white border-2 border-[#E0D8D0] rounded-lg p-8 shadow-lg">
            <form onSubmit={step === 'account' ? (e) => { e.preventDefault(); handleAccountNext(); } : handleSubmit} className="space-y-6">
              {step === 'account' && (
                <>
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
                        placeholder="At least 8 characters"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2C1810] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="mt-1 font-['Courier_New'] text-xs text-[#8B7355]">
                      Must be at least 8 characters
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors pr-12"
                        placeholder="Re-enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B7355] hover:text-[#2C1810] transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {step === 'profile' && (
                <>
                  {/* Display Name */}
                  <div>
                    <label htmlFor="displayName" className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                      Display Name *
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors"
                      placeholder="How should we address you?"
                      required
                    />
                    <p className="mt-1 font-['Courier_New'] text-xs text-[#8B7355]">
                      Your name as it will appear on your profile
                    </p>
                  </div>

                  {/* Writer Name (Optional) */}
                  <div>
                    <label htmlFor="writerName" className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                      Writer Name <span className="text-[#8B7355]">(Optional)</span>
                    </label>
                    <input
                      id="writerName"
                      type="text"
                      value={formData.writerName}
                      onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors"
                      placeholder="Your pen name or author byline"
                    />
                    <p className="mt-1 font-['Courier_New'] text-xs text-[#8B7355]">
                      A different name for your writing (uses display name if blank)
                    </p>
                  </div>

                  {/* Bio (Optional) */}
                  <div>
                    <label htmlFor="bio" className="block font-['Courier_New'] text-xs text-[#2C1810] uppercase tracking-wider mb-2">
                      Bio <span className="text-[#8B7355]">(Optional)</span>
                    </label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#FAF8F5] border-2 border-[#E0D8D0] focus:border-[#8A9A7B] focus:outline-none font-['Libre_Baskerville'] text-base text-[#2C1810] rounded-lg transition-colors resize-none"
                      placeholder="Tell us about yourself and your writing..."
                    />
                  </div>
                </>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-[#E11D48]/10 border-2 border-[#E11D48] rounded-lg">
                  <p className="font-['Courier_New'] text-sm text-[#E11D48]">
                    {error}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {step === 'profile' && (
                  <button
                    type="button"
                    onClick={() => setStep('account')}
                    className="flex-1 px-6 py-3 border-2 border-[#E0D8D0] text-[#2C1810] hover:bg-[#F5F0EB] transition-all font-['Cardo'] text-lg rounded-lg"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#8A9A7B] text-white hover:bg-[#7A8A6B] disabled:opacity-50 disabled:cursor-not-allowed transition-all font-['Cardo'] text-lg rounded-lg shadow-md"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating your garden...
                    </>
                  ) : step === 'account' ? (
                    'Continue'
                  ) : (
                    'Plant Your Garden'
                  )}
                </button>
              </div>
            </form>

            {/* Sign In Link */}
            {step === 'account' && (
              <div className="mt-6 pt-6 border-t border-[#E0D8D0] text-center">
                <p className="font-['Inter'] text-sm text-[#8B7355]">
                  Already have an account?{' '}
                  <a href="/garden/signin" className="text-[#8A9A7B] hover:text-[#7A8A6B] font-semibold transition-colors">
                    Sign In
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Philosophy */}
          <div className="mt-8 text-center">
            <p className="font-['Libre_Baskerville'] text-sm text-[#8B7355] italic leading-relaxed">
              "A garden, not a feed. Your writing grows at its own pace."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
