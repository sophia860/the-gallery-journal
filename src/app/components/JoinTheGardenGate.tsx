import { Sprout, LogIn, UserPlus } from 'lucide-react';
import { NightSkyBackground } from './NightSkyBackground';

export function JoinTheGardenGate() {
  return (
    <div className="min-h-screen bg-[#050510] relative flex items-center justify-center">
      <NightSkyBackground />
      
      <div className="relative z-10 max-w-2xl mx-auto px-8 text-center">
        {/* Garden Icon */}
        <div className="mb-8 flex justify-center">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(122, 155, 118, 0.3) 0%, rgba(122, 155, 118, 0.1) 60%, transparent 100%)',
              boxShadow: '0 0 60px rgba(122, 155, 118, 0.4), inset 0 0 30px rgba(122, 155, 118, 0.2)'
            }}
          >
            <Sprout 
              className="w-16 h-16" 
              style={{ 
                color: '#7a9b76',
                filter: 'drop-shadow(0 0 20px rgba(122, 155, 118, 0.8))'
              }} 
            />
          </div>
        </div>

        {/* Title */}
        <h1 
          className="font-['Playfair_Display'] italic text-7xl text-white mb-6"
          style={{
            textShadow: '0 0 40px rgba(122, 155, 118, 0.6), 0 0 80px rgba(122, 155, 118, 0.4)',
            lineHeight: '1.2'
          }}
        >
          The Garden
        </h1>

        {/* Subtitle */}
        <p 
          className="font-['Libre_Baskerville'] text-xl text-[#c8cad8] mb-4 leading-relaxed"
          style={{ 
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
            lineHeight: '1.8'
          }}
        >
          A private space for writers.
        </p>
        <p 
          className="font-['Libre_Baskerville'] text-lg text-[#8b9dc3] mb-12 leading-relaxed"
          style={{ 
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
            lineHeight: '1.8'
          }}
        >
          Sign in to tend your garden.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/garden/signin"
            className="group px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 font-['Cardo'] text-lg relative overflow-hidden"
            style={{
              background: 'rgba(122, 155, 118, 0.2)',
              border: '2px solid rgba(122, 155, 118, 0.5)',
              boxShadow: '0 0 30px rgba(122, 155, 118, 0.3), inset 0 0 20px rgba(122, 155, 118, 0.1)'
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.3) 0%, transparent 70%)'
              }}
            />
            <LogIn className="w-5 h-5 relative z-10" style={{ color: '#7a9b76' }} />
            <span className="relative z-10" style={{ color: '#c8cad8' }}>Sign In</span>
          </a>

          <a
            href="/garden/signup"
            className="group px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 font-['Cardo'] text-lg relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(122, 155, 118, 0.4) 0%, rgba(138, 157, 195, 0.4) 100%)',
              border: '2px solid rgba(122, 155, 118, 0.7)',
              boxShadow: '0 0 40px rgba(122, 155, 118, 0.5), inset 0 0 30px rgba(122, 155, 118, 0.2)'
            }}
          >
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, rgba(122, 155, 118, 0.5) 0%, transparent 70%)'
              }}
            />
            <UserPlus className="w-5 h-5 relative z-10" style={{ color: '#fff' }} />
            <span className="relative z-10 text-white font-semibold">Create Account</span>
          </a>
        </div>
      </div>
    </div>
  );
}