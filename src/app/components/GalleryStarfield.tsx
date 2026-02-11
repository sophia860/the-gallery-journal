export function GalleryStarfield() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Deep indigo night gradient - warmer than Garden */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 75%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 60%),
            linear-gradient(to bottom, 
              #0a1128 0%,
              #0f172a 15%,
              #1e1b4b 30%,
              #1e3a8a 50%, 
              #1e293b 75%,
              #0f172a 90%,
              #0a1128 100%
            )
          `
        }}
      />
      
      {/* Warm aurora effects - golden and amber tones */}
      <div className="aurora-layer absolute inset-0">
        <div 
          className="aurora-gallery-1"
          style={{
            position: 'absolute',
            top: '8%',
            left: '20%',
            width: '650px',
            height: '450px',
            background: 'radial-gradient(ellipse, rgba(196, 164, 108, 0.1) 0%, rgba(196, 164, 108, 0.05) 40%, transparent 70%)',
            filter: 'blur(100px)',
            opacity: 0.8,
          }}
        />
        <div 
          className="aurora-gallery-2"
          style={{
            position: 'absolute',
            bottom: '12%',
            right: '15%',
            width: '550px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(212, 180, 124, 0.09) 0%, rgba(212, 180, 124, 0.04) 40%, transparent 70%)',
            filter: 'blur(110px)',
            opacity: 0.7,
          }}
        />
        <div 
          className="aurora-gallery-3"
          style={{
            position: 'absolute',
            top: '50%',
            left: '60%',
            width: '500px',
            height: '350px',
            background: 'radial-gradient(ellipse, rgba(180, 140, 100, 0.08) 0%, transparent 70%)',
            filter: 'blur(95px)',
            opacity: 0.6,
          }}
        />
        <div 
          className="aurora-gallery-4"
          style={{
            position: 'absolute',
            top: '25%',
            right: '30%',
            width: '480px',
            height: '320px',
            background: 'radial-gradient(ellipse, rgba(160, 130, 160, 0.07) 0%, transparent 70%)',
            filter: 'blur(105px)',
            opacity: 0.5,
          }}
        />
      </div>
      
      <style>{`
        @keyframes twinkle-gallery {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.9); }
        }
        
        @keyframes twinkle-slow-gallery {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.92); }
        }
        
        @keyframes twinkle-bright-gallery {
          0%, 100% { opacity: 1; transform: scale(1); }
          30% { opacity: 0.7; transform: scale(1.12); }
          60% { opacity: 0.5; transform: scale(0.95); }
        }
        
        @keyframes shooting-star-gallery {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(280px) translateY(280px) rotate(-45deg);
            opacity: 0;
          }
        }
        
        @keyframes aurora-pulse-gallery-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.8;
          }
          40% { 
            transform: translate(50px, -40px) scale(1.2);
            opacity: 1;
          }
          70% { 
            transform: translate(-25px, 25px) scale(1.1);
            opacity: 0.85;
          }
        }
        
        @keyframes aurora-pulse-gallery-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          45% { 
            transform: translate(-55px, 40px) scale(1.25);
            opacity: 0.9;
          }
        }
        
        @keyframes aurora-pulse-gallery-3 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: translate(40px, 50px) scale(1.3);
            opacity: 0.8;
          }
        }
        
        @keyframes aurora-pulse-gallery-4 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          55% { 
            transform: translate(-45px, -30px) scale(1.22);
            opacity: 0.75;
          }
        }
        
        @keyframes float-elegant {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-18px) translateX(8px); }
          50% { transform: translateY(-8px) translateX(-6px); }
          75% { transform: translateY(-22px) translateX(4px); }
        }
        
        @keyframes golden-spark {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.5;
          }
          25% { 
            transform: translate(25px, -35px) scale(1.3);
            opacity: 1;
          }
          50% { 
            transform: translate(-15px, -70px) scale(0.9);
            opacity: 0.6;
          }
          75% { 
            transform: translate(35px, -50px) scale(1.15);
            opacity: 0.85;
          }
        }
        
        @keyframes glow-pulse-gallery {
          0%, 100% { 
            opacity: 0.5;
            filter: blur(25px);
          }
          50% { 
            opacity: 0.9;
            filter: blur(30px);
          }
        }
        
        .aurora-gallery-1 {
          animation: aurora-pulse-gallery-1 28s ease-in-out infinite;
        }
        
        .aurora-gallery-2 {
          animation: aurora-pulse-gallery-2 33s ease-in-out infinite;
        }
        
        .aurora-gallery-3 {
          animation: aurora-pulse-gallery-3 38s ease-in-out infinite;
        }
        
        .aurora-gallery-4 {
          animation: aurora-pulse-gallery-4 31s ease-in-out infinite;
        }
        
        .star-gallery {
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        
        .star-gallery-tiny {
          animation: twinkle-gallery 3.5s ease-in-out infinite;
        }
        
        .star-gallery-small {
          animation: twinkle-slow-gallery 5.5s ease-in-out infinite;
        }
        
        .star-gallery-large {
          animation: twinkle-bright-gallery 4.5s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.95), 0 0 14px rgba(255, 255, 255, 0.6);
        }
        
        .shooting-star-gallery {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(255, 240, 200, 0.6), transparent);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
          animation: shooting-star-gallery 2.8s linear infinite;
        }
        
        .golden-spark {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          box-shadow: 0 0 12px currentColor, 0 0 24px currentColor, 0 0 36px currentColor;
          animation: golden-spark 10s ease-in-out infinite;
        }
      `}</style>
      
      {/* Tiny distant stars - Layer 1 */}
      {Array.from({ length: 280 }).map((_, i) => {
        const size = Math.random() * 1.3 + 0.5;
        return (
          <div
            key={`tiny-${i}`}
            className="star-gallery star-gallery-tiny"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${Math.random() * 3.5}s`,
              animationDuration: `${2.5 + Math.random() * 3.5}s`,
              opacity: 0.35 + Math.random() * 0.45
            }}
          />
        );
      })}
      
      {/* Medium stars - Layer 2 */}
      {Array.from({ length: 110 }).map((_, i) => {
        const size = Math.random() * 2.8 + 1.2;
        return (
          <div
            key={`small-${i}`}
            className="star-gallery star-gallery-small"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${Math.random() * 5.5}s`,
              animationDuration: `${3.5 + Math.random() * 4.5}s`,
              opacity: 0.55 + Math.random() * 0.45
            }}
          />
        );
      })}
      
      {/* Larger bright stars - Layer 3 */}
      {Array.from({ length: 45 }).map((_, i) => {
        const size = Math.random() * 4 + 2.2;
        return (
          <div
            key={`large-${i}`}
            className="star-gallery star-gallery-large"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${Math.random() * 4.5}s`,
              animationDuration: `${3.5 + Math.random() * 3.5}s`,
              opacity: 0.75 + Math.random() * 0.25
            }}
          />
        );
      })}
      
      {/* Shooting stars */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`shooting-${i}`}
          className="shooting-star-gallery"
          style={{
            left: `${12 + Math.random() * 38}%`,
            top: `${Math.random() * 48}%`,
            animationDelay: `${i * 7 + Math.random() * 9}s`,
            animationDuration: `${2.3 + Math.random() * 1.8}s`,
          }}
        />
      ))}
      
      {/* Golden sparks - Gallery themed */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`spark-${i}`}
          className="golden-spark"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${65 + Math.random() * 28}%`,
            color: i % 3 === 0 
              ? 'rgba(196, 164, 108, 0.75)' 
              : i % 3 === 1 
              ? 'rgba(212, 180, 124, 0.7)'
              : 'rgba(220, 200, 150, 0.65)',
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 10}s`,
          }}
        />
      ))}
      
      {/* Soft glow particles */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${110 + Math.random() * 160}px`,
            height: `${110 + Math.random() * 160}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              i % 4 === 0 
                ? 'rgba(196, 164, 108, 0.045)' 
                : i % 4 === 1 
                ? 'rgba(212, 180, 124, 0.04)'
                : i % 4 === 2
                ? 'rgba(180, 140, 160, 0.035)'
                : 'rgba(190, 160, 130, 0.038)'
            } 0%, transparent 70%)`,
            animation: `float-elegant ${14 + Math.random() * 18}s ease-in-out infinite, glow-pulse-gallery ${9 + Math.random() * 7}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 10}s`,
            filter: 'blur(55px)',
          }}
        />
      ))}
      
      {/* Atmospheric depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(196, 164, 108, 0.025) 0%, transparent 65%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Enhanced vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(13, 10, 21, 0.35) 78%, rgba(13, 10, 21, 0.65) 100%)
          `,
          pointerEvents: 'none'
        }}
      />
      
      {/* Subtle film grain */}
      <div 
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}