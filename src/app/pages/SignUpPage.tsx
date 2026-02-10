import { useState } from 'react';
import { Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GalleryNav } from '../components/GalleryNav';

export function SignUpPage() {
  const { signUp, user } = useAuth();
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
      
      // Redirect to studio after successful signup
      window.location.href = '/studio';
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* The Gallery Navigation */}
      <GalleryNav />

      {/* Sign Up Form */}
      <div className="pt-40 pb-24 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center">
            <h1 className="font-['Cardo'] text-6xl mb-4 text-[#2C2C2C]">
              Open Your Room
            </h1>
            <p className="font-[family-name:var(--font-body)] text-[#717171] text-lg">
              Join The Gallery and create your own literary space
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
                  htmlFor="name" 
                  className="block font-['Courier_New'] text-xs tracking-wider text-[#717171] mb-2"
                >
                  YOUR NAME
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F0EB] border-2 border-[#E0D8D0] focus:border-[#C4918A] focus:outline-none font-[family-name:var(--font-body)]"
                  placeholder="Virginia Woolf"
                />
              </div>

              <div>
                <label 
                  htmlFor="writerName" 
                  className="block font-['Courier_New'] text-xs tracking-wider text-[#717171] mb-2"
                >
                  WRITER NAME (OPTIONAL)
                </label>
                <input
                  id="writerName"
                  type="text"
                  value={formData.writerName}
                  onChange={(e) => setFormData({ ...formData, writerName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F0EB] border-2 border-[#E0D8D0] focus:border-[#C4918A] focus:outline-none font-[family-name:var(--font-body)]"
                  placeholder="Leave blank to use your name"
                />
                <p className="mt-2 text-xs text-[#717171] font-['Courier_New']">
                  This is how your name will appear on your room
                </p>
              </div>

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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F5F0EB] border-2 border-[#E0D8D0] focus:border-[#C4918A] focus:outline-none font-[family-name:var(--font-body)]"
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-[#E11D48] text-white hover:bg-[#C01040] transition-colors font-['Courier_New'] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'CREATING YOUR ROOM...' : 'JOIN THE GALLERY'}
              </button>
            </form>

            <p className="mt-8 text-center font-['Courier_New'] text-sm text-[#717171]">
              Already have a room?{' '}
              <a href="/signin" className="text-[#E11D48] hover:text-[#C01040] transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}