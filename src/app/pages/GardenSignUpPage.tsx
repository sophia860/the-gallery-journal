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
            {step === 'account' && (
              <>
                {/* Google Sign-In Button */}
                <button
                  type="button"
                  onClick={() => console.log('Google Sign-In clicked')}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-[#dadce0] rounded-lg hover:bg-[#f7f8f8] hover:shadow-sm transition-all active:scale-[0.98]"
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
                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-[#E0D8D0]"></div>
                  <span className="font-['Courier_New'] text-xs text-[#8B7355] uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-[#E0D8D0]"></div>
                </div>
              </>
            )}

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