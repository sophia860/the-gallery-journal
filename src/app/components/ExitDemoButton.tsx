import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ExitDemoButton() {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const demoMode = localStorage.getItem('demoMode');
    setIsDemo(demoMode === 'true');
  }, []);

  if (!isDemo) return null;

  const handleExitDemo = () => {
    localStorage.removeItem('demoMode');
    localStorage.removeItem('demoRole');
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleExitDemo}
      className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-full transition-all duration-300 flex items-center gap-2 font-['Inter'] text-sm font-semibold shadow-2xl hover:scale-105 group"
      style={{
        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)',
        border: '2px solid rgba(220, 38, 38, 0.6)',
        boxShadow: '0 8px 32px rgba(220, 38, 38, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)'
      }}
    >
      <X className="w-4 h-4 text-white" />
      <span className="text-white">Exit Demo</span>
    </button>
  );
}
