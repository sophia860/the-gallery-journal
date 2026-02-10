import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GalleryNav } from '../components/GalleryNav';
import { GalleryFooter } from '../components/GalleryFooter';

export function SignUpPage() {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    writerName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.writerName || formData.name
      );
      
      window.location.href = '/garden/home';
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <GalleryNav />

      <div className="px-8 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="font-['Special_Elite'] text-[#1A1A1A] mb-8 text-center" style={{ fontSize: 'clamp(36px, 6vw, 48px)', lineHeight: '1.2' }}>
            SIGN UP
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]"
                required
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Writer Name (optional)
              </label>
              <input
                type="text"
                value={formData.writerName}
                onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]"
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]"
                required
                style={{ borderRadius: 0 }}
              />
            </div>

            <div>
              <label className="block font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] text-[#1A1A1A] mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-[#FFFDF8] border border-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#8B2500] font-['Source_Serif_Pro'] text-[16px] text-[#1A1A1A]"
                required
                style={{ borderRadius: 0 }}
              />
            </div>

            {error && (
              <p className="font-['Source_Serif_Pro'] text-[14px] text-[#8B2500]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-[#8B2500] text-[#FFFDF8] hover:bg-[#6B1D00] transition-all font-['Courier_New'] text-[14px] uppercase tracking-[0.1em] disabled:opacity-50"
              style={{ borderRadius: 0 }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center font-['Source_Serif_Pro'] text-[14px] text-[#4A4A4A]">
            Already have an account?{' '}
            <a href="/signin" className="text-[#8B2500] hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>

      <GalleryFooter />
    </div>
  );
}
