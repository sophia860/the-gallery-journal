import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function SignupPage() {
  const { signUp, supabase } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    writerName: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.displayName) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      console.log('[SignupPage] Attempting signup...');
      await signUp(
        formData.email,
        formData.password,
        formData.displayName,
        formData.writerName || formData.displayName
      );
      console.log('[SignupPage] Signup successful, redirecting...');
      // FIX: Session is now verified in AuthContext.signUp, safe to redirect
      // Small delay to ensure DOM is ready for redirect
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/garden/dashboard';
    } catch (err: any) {
      console.error('[SignupPage] Signup error:', err);
      
      if (err.message && err.message.includes('already been registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.message && err.message.includes('User already registered')) {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('[SignupPage] Google sign-up button clicked');
    setError('');
    setLoading(true);

    try {
      console.log('[SignupPage] Initiating Google OAuth...');
      
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectUrl = `${origin}/garden/dashboard`;
      
      console.log('[SignupPage] OAuth redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('[SignupPage] Google OAuth error:', error);
        
        if (error.message.includes('not enabled') || error.message.includes('Provider')) {
          setError('Google sign-up is not configured yet. Please contact support or use email/password signup.');
        } else if (error.message.includes('popup')) {
          setError('Pop-up was blocked. Please allow pop-ups for this site and try again.');
        } else {
          setError(`Google sign-up failed: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // Check if OAuth is configured (data.url will be null if not configured)
      if (!data || !data.url) {
        console.error('[SignupPage] Google OAuth not configured - no redirect URL provided');
        setError('Google sign-in is not available yet. Please use email and password to sign in.');
        setLoading(false);
        return;
      }

      console.log('[SignupPage] OAuth initiated successfully, redirecting to Google...');
      // Manually redirect to ensure it works in all environments
      window.location.href = data.url;
    } catch (error: any) {
      console.error('[SignupPage] Unexpected error during Google sign-up:', error);
      setError(error.message || 'An unexpected error occurred during Google sign-up.');
      setLoading(false);
    }
  };

  // Generate stars with random positions and animation delays
  const stars = Array.from({ length: 90 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() > 0.7 ? (Math.random() * 2 + 2) : (Math.random() * 2 + 1),
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 4 + 2,
    delay: Math.random() * 6
  }));

  // Generate bright stars with glow
  const brightStars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 3 + 4,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 4
  }));

  // Generate shooting stars
  const shootingStars = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 50 + 10}%`,
    top: `${Math.random() * 50 + 10}%`,
    delay: i * 12 + 6
  }));

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Animated Starry Sky Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#050d1a] via-[#0a1628] to-[#0d1a2b]" style={{ zIndex: 0 }}>
        {/* Regular twinkling stars */}
        {stars.map(star => (
          <div
            key={`star-${star.id}`}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.size > 2 ? '#fffef0' : '#ffffff',
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              boxShadow: star.size > 2 ? '0 0 2px rgba(255, 254, 240, 0.8)' : 'none'
            }}
          />
        ))}

        {/* Bright stars with glow */}
        {brightStars.map(star => (
          <div
            key={`bright-${star.id}`}
            className="absolute rounded-full animate-pulse-glow"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#fffef0',
              boxShadow: '0 0 8px rgba(255, 254, 240, 0.9), 0 0 16px rgba(255, 254, 240, 0.6), 0 0 24px rgba(255, 254, 240, 0.3)',
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map(star => (
          <div
            key={`shooting-${star.id}`}
            className="absolute animate-shooting-star"
            style={{
              left: star.left,
              top: star.top,
              width: '100px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
              transform: 'rotate(-45deg)',
              animationDelay: `${star.delay}s`
            }}
          />
        ))}

        {/* Aurora glow at horizon */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 opacity-30"
          style={{
            background: 'linear-gradient(to top, rgba(42, 157, 143, 0.15), rgba(38, 70, 83, 0.08), transparent)'
          }}
        />

        {/* Subtle parallax drift overlay */}
        <div 
          className="absolute inset-0 animate-slow-drift"
          style={{
            background: 'radial-gradient(ellipse at 30% 40%, rgba(42, 157, 143, 0.03), transparent 50%)'
          }}
        />
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glassmorphism Card */}
        <div 
          className="backdrop-blur-xl rounded-2xl border p-8 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Glowing Icon */}
          <div className="flex justify-center mb-6">
            <div 
              className="text-5xl animate-bloom"
              style={{
                filter: 'drop-shadow(0 0 12px rgba(124, 154, 110, 0.7)) drop-shadow(0 0 24px rgba(124, 154, 110, 0.4))'
              }}
            >
              🌱
            </div>
          </div>

          {/* Title */}
          <h1 
            className="font-['Cardo'] text-4xl text-center mb-2"
            style={{ color: '#f5f0e8' }}
          >
            Start your garden
          </h1>

          {/* Subtitle */}
          <p 
            className="font-['Cardo'] text-center italic mb-8 text-lg"
            style={{ color: 'rgba(245, 240, 232, 0.6)' }}
          >
            A place for your writing to grow
          </p>

          {/* Error Message */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-xl border"
              style={{
                background: 'rgba(251, 146, 60, 0.15)',
                borderColor: 'rgba(251, 146, 60, 0.4)',
                color: '#fbbf24'
              }}
            >
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Google Sign-Up */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 px-6 py-3.5 rounded-xl border transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#f5f0e8'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </g>
            </svg>
            <span className="font-['Inter'] font-medium">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 font-['Inter'] text-xs uppercase tracking-wider" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(245, 240, 232, 0.4)' }}>
                or
              </span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label 
                htmlFor="displayName"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="Your name"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="your@email.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Password *
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="At least 8 characters"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
                required
                minLength={8}
              />
            </div>

            {/* Writer Name (Optional) */}
            <div>
              <label 
                htmlFor="writerName"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Writer Name <span style={{ color: 'rgba(245, 240, 232, 0.4)' }}>(optional)</span>
              </label>
              <input
                id="writerName"
                type="text"
                value={formData.writerName}
                onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="Your pen name"
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c9a6e';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 154, 110, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button with Bloom Animation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-['Inter'] font-semibold text-white transition-all duration-300 hover:animate-bloom-button disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #5a7a4a 0%, #7c9a6e 100%)',
                boxShadow: '0 4px 16px rgba(90, 122, 74, 0.4)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 32px rgba(90, 122, 74, 0.8), 0 0 24px rgba(124, 154, 110, 0.4)';
                  e.currentTarget.style.filter = 'brightness(1.15)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(90, 122, 74, 0.4)';
                e.currentTarget.style.filter = 'brightness(1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {loading ? 'Planting your seed...' : 'Plant the first seed'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center font-['Inter'] text-sm" style={{ color: 'rgba(245, 240, 232, 0.6)' }}>
            Already have a garden?{' '}
            <a 
              href="/garden/login"
              className="font-semibold transition-colors"
              style={{ 
                color: '#7c9a6e',
                textShadow: '0 0 8px rgba(124, 154, 110, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#8fb587';
                e.currentTarget.style.textShadow = '0 0 12px rgba(124, 154, 110, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#7c9a6e';
                e.currentTarget.style.textShadow = '0 0 8px rgba(124, 154, 110, 0.4)';
              }}
            >
              Sign in
            </a>
          </p>

          {/* Inspirational Quote */}
          <p 
            className="mt-8 text-center font-['Cardo'] text-sm italic"
            style={{ color: 'rgba(245, 240, 232, 0.4)' }}
          >
            "Every great story begins with a single seed."
          </p>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes shooting-star {
          0% { transform: translateX(-100px) translateY(-100px) rotate(-45deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(300px) translateY(300px) rotate(-45deg); opacity: 0; }
        }
        
        @keyframes slow-drift {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
        
        @keyframes bloom {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          25% { transform: scale(1.05) rotate(-2deg); }
          50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
          75% { transform: scale(1.05) rotate(-2deg); }
        }
        
        @keyframes bloom-button {
          0%, 100% { transform: scale(1.02); }
          50% { transform: scale(1.05); }
        }
        
        .animate-twinkle {
          animation: twinkle infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow infinite;
        }
        
        .animate-shooting-star {
          animation: shooting-star 3s ease-out infinite;
        }
        
        .animate-slow-drift {
          animation: slow-drift 20s ease-in-out infinite;
        }
        
        .animate-bloom {
          animation: bloom 4s ease-in-out infinite;
        }
        
        .animate-bloom-button {
          animation: bloom-button 0.6s ease-in-out;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
