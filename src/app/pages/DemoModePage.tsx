import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircle, Shield, LogOut, Check } from 'lucide-react';

export function DemoModePage() {
  const { user, signOut } = useAuth();
  const [currentRole, setCurrentRole] = useState<'writer' | 'editor'>('writer');
  const [demoActive, setDemoActive] = useState(false);

  useEffect(() => {
    // Check if demo mode is active
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    const storedRole = localStorage.getItem('demoRole') as 'writer' | 'editor' || 'writer';
    setDemoActive(isDemoMode);
    setCurrentRole(storedRole);
  }, []);

  const activateDemoMode = (role: 'writer' | 'editor') => {
    // Sign out first if there's a real user
    if (user && user.id !== 'demo-user') {
      signOut();
    }

    // Set demo mode
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoRole', role);
    
    // Reload to activate
    window.location.reload();
  };

  const deactivateDemoMode = async () => {
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoRole');
    await signOut();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] to-[#F5F0EB] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8">
        <h1 className="font-['Cardo'] text-6xl mb-6 text-[#2C1810] italic">
          Demo Mode
        </h1>
        <p className="font-['Libre_Baskerville'] text-xl text-[#8B7355] mb-12">
          Test PAGE without creating an account
        </p>

        {/* Current Status */}
        <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 mb-8">
          <h2 className="font-['Cardo'] text-3xl text-[#2C1810] mb-4">
            Current Status
          </h2>
          {demoActive ? (
            <div className="flex items-center gap-3 p-4 bg-[#8A9A7B]/10 border border-[#8A9A7B] rounded-lg">
              <Check className="w-6 h-6 text-[#8A9A7B]" />
              <div>
                <p className="font-['Cardo'] text-lg text-[#2C1810]">
                  Demo mode active as <strong>{currentRole}</strong>
                </p>
                <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
                  {currentRole === 'writer' 
                    ? 'Access to writing tools, garden, and submission'
                    : 'Access to editorial dashboard and submissions review'}
                </p>
              </div>
            </div>
          ) : (
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
              Demo mode is not active. Choose a role below to activate.
            </p>
          )}
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Writer Demo */}
          <div className="bg-white border-2 border-[#E0D8D0] hover:border-[#8A9A7B] rounded-xl p-8 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <UserCircle className="w-8 h-8 text-[#8A9A7B]" />
              <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">
                Writer Demo
              </h3>
            </div>
            
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6 leading-relaxed">
              Experience PAGE as a writer with full access to:
            </p>

            <ul className="space-y-2 mb-6 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
              <li className="flex items-start gap-2">
                <span className="text-[#8A9A7B]">✓</span>
                <span>Writing garden with Seeds, Sprouts, Blooms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8A9A7B]">✓</span>
                <span>Distraction-free editor</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8A9A7B]">✓</span>
                <span>Tag constellations and private notes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8A9A7B]">✓</span>
                <span>Submit to editors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#8A9A7B]">✓</span>
                <span>Create exhibits and manage work</span>
              </li>
            </ul>

            <button
              onClick={() => activateDemoMode('writer')}
              disabled={demoActive && currentRole === 'writer'}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-['Cardo'] text-base transition-all ${
                demoActive && currentRole === 'writer'
                  ? 'bg-[#8A9A7B]/20 text-[#8A9A7B] border-2 border-[#8A9A7B] cursor-not-allowed'
                  : 'bg-[#8A9A7B] text-white hover:bg-[#6F7D62] hover:shadow-lg'
              }`}
            >
              {demoActive && currentRole === 'writer' ? (
                <>
                  <Check className="w-5 h-5" />
                  Active
                </>
              ) : (
                <>
                  <UserCircle className="w-5 h-5" />
                  Try as Writer
                </>
              )}
            </button>
          </div>

          {/* Editor Demo */}
          <div className="bg-white border-2 border-[#E0D8D0] hover:border-[#E11D48] rounded-xl p-8 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-[#E11D48]" />
              <h3 className="font-['Cardo'] text-2xl text-[#2C1810]">
                Editor Demo
              </h3>
            </div>
            
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6 leading-relaxed">
              Experience PAGE as an editor with access to:
            </p>

            <ul className="space-y-2 mb-6 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48]">✓</span>
                <span>Editorial dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48]">✓</span>
                <span>Review all submissions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48]">✓</span>
                <span>Accept/reject pieces</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48]">✓</span>
                <span>Add editor notes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#E11D48]">✓</span>
                <span>Manage editorial workflow</span>
              </li>
            </ul>

            <button
              onClick={() => activateDemoMode('editor')}
              disabled={demoActive && currentRole === 'editor'}
              className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-['Cardo'] text-base transition-all ${
                demoActive && currentRole === 'editor'
                  ? 'bg-[#E11D48]/20 text-[#E11D48] border-2 border-[#E11D48] cursor-not-allowed'
                  : 'bg-[#E11D48] text-white hover:bg-[#C01040] hover:shadow-lg'
              }`}
            >
              {demoActive && currentRole === 'editor' ? (
                <>
                  <Check className="w-5 h-5" />
                  Active
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Try as Editor
                </>
              )}
            </button>
          </div>
        </div>

        {/* Deactivate Demo Mode */}
        {demoActive && (
          <div className="bg-white border-2 border-[#E0D8D0] rounded-xl p-8 text-center">
            <h3 className="font-['Cardo'] text-2xl text-[#2C1810] mb-4">
              Exit Demo Mode
            </h3>
            <p className="font-[family-name:var(--font-ui)] text-sm text-[#8B7355] mb-6">
              Return to regular mode or sign in with a real account
            </p>
            <button
              onClick={deactivateDemoMode}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#E0D8D0] text-[#2C1810] hover:border-[#E11D48] hover:text-[#E11D48] transition-all font-['Cardo'] text-base rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Exit Demo Mode
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-6 bg-white/50 border border-[#E0D8D0] rounded-xl">
          <h4 className="font-['Cardo'] text-lg text-[#2C1810] mb-3">
            About Demo Mode
          </h4>
          <ul className="space-y-2 font-[family-name:var(--font-ui)] text-sm text-[#8B7355]">
            <li>• Demo mode lets you explore PAGE without creating an account</li>
            <li>• All features are available, but data is stored locally</li>
            <li>• Switch between Writer and Editor roles anytime</li>
            <li>• Demo data is temporary and will be cleared when you exit</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
