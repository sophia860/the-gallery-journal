import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function NewGardenSignUpPage() {
  const { signUp, supabase } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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
      console.log('[NewGardenSignUpPage] Attempting sign up...');
      await signUp(formData.email, formData.password, formData.displayName, formData.displayName);
      
      console.log('[NewGardenSignUpPage] Sign up successful, checking session...');
      
      // Verify session is actually stored before redirecting
      let attempts = 0;
      const maxAttempts = 10;
      
      while (attempts < maxAttempts) {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          console.log('[NewGardenSignUpPage] Session confirmed, redirecting to setup');
          // Session is confirmed, safe to redirect to onboarding
          window.location.href = '/setup';
          return;
        }
        
        // Wait 100ms before checking again
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // If we get here, session wasn't confirmed but signup succeeded
      console.warn('[NewGardenSignUpPage] Session not confirmed in time, redirecting anyway');
      window.location.href = '/setup';
    } catch (err: any) {
      console.error('[NewGardenSignUpPage] Sign up error:', err);
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/setup',
        }
      });

      if (oauthError) {
        setError(oauthError.message || 'Google sign-up failed');
        setLoading(false);
        return;
      }

      if (!data || !data.url) {
        setError('Google sign-up is not available yet. Please use email and password.');
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during Google sign-up.');
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div>
              <label 
                htmlFor="displayName"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Display name
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
                Email
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
                Password
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

            {/* Confirm Password */}
            <div>
              <label 
                htmlFor="confirmPassword"
                className="block font-['Inter'] text-sm font-medium mb-2"
                style={{ color: 'rgba(245, 240, 232, 0.7)' }}
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border transition-all duration-300 font-['Inter']"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#f5f0e8'
                }}
                placeholder="Re-enter your password"
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

            {/* Submit Button with Bloom Animation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 rounded-xl font-['Inter'] font-semibold text-white transition-all duration-300 hover:animate-bloom-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Planting your seed...
                </>
              ) : (
                'Plant the first seed'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div 
                className="w-full h-[1px]"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              ></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span 
                className="px-4 font-['Inter']"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(245, 240, 232, 0.5)'
                }}
              >
                or continue with
              </span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl font-['Inter'] font-medium text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="mt-6 text-center font-['Inter'] text-sm" style={{ color: 'rgba(245, 240, 232, 0.6)' }}>
            Already have a garden?{' '}
            <a 
              href="/garden/signin"
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