import { useEffect, useRef, useState } from 'react';

export function NightSkyBackground() {
  const [scrollY, setScrollY] = useState(0);
  const rafRef = useRef<number>();
  
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Deep space gradient with multiple atmospheric layers */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 20%, rgba(70, 90, 150, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 80%, rgba(120, 80, 150, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(80, 120, 140, 0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 30% 70%, rgba(100, 140, 120, 0.1) 0%, transparent 55%),
            linear-gradient(to bottom, 
              #080b14 0%,
              #0d1120 10%,
              #121828 25%,
              #1a1f3a 50%, 
              #141a2e 75%,
              #0f1428 90%,
              #0a0e1a 100%
            )
          `
        }}
      />
      
      {/* Animated aurora/nebula effects with parallax */}
      <div 
        className="aurora-layer absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.03}px)`
        }}
      >
        <div 
          className="aurora-1"
          style={{
            position: 'absolute',
            top: '5%',
            left: '15%',
            width: '700px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(122, 155, 118, 0.12) 0%, rgba(122, 155, 118, 0.06) 40%, transparent 70%)',
            filter: 'blur(90px)',
            opacity: 0.7,
          }}
        />
        <div 
          className="aurora-2"
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '600px',
            height: '450px',
            background: 'radial-gradient(ellipse, rgba(138, 157, 195, 0.1) 0%, rgba(138, 157, 195, 0.05) 40%, transparent 70%)',
            filter: 'blur(100px)',
            opacity: 0.6,
          }}
        />
        <div 
          className="aurora-3"
          style={{
            position: 'absolute',
            top: '55%',
            left: '55%',
            width: '550px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(150, 120, 180, 0.08) 0%, rgba(150, 120, 180, 0.04) 40%, transparent 70%)',
            filter: 'blur(110px)',
            opacity: 0.5,
          }}
        />
        <div 
          className="aurora-4"
          style={{
            position: 'absolute',
            top: '30%',
            right: '25%',
            width: '450px',
            height: '350px',
            background: 'radial-gradient(ellipse, rgba(100, 180, 160, 0.08) 0%, transparent 70%)',
            filter: 'blur(95px)',
            opacity: 0.45,
          }}
        />
      </div>
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.85); }
        }
        
        @keyframes twinkle-slow {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(0.9); }
        }
        
        @keyframes twinkle-bright {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.6; transform: scale(1.15); }
          50% { opacity: 0.4; transform: scale(0.9); }
          75% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px);
            opacity: 0;
          }
        }
        
        @keyframes aurora-pulse-1 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          33% { 
            transform: translate(40px, -30px) scale(1.15);
            opacity: 0.85;
          }
          66% { 
            transform: translate(-20px, 20px) scale(1.08);
            opacity: 0.75;
          }
        }
        
        @keyframes aurora-pulse-2 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.6;
          }
          40% { 
            transform: translate(-50px, 35px) scale(1.2);
            opacity: 0.8;
          }
          70% { 
            transform: translate(25px, -15px) scale(1.1);
            opacity: 0.7;
          }
        }
        
        @keyframes aurora-pulse-3 {
          0%, 100% { 
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 0.5;
          }
          50% { 
            transform: translate(30px, 45px) scale(1.25) rotate(5deg);
            opacity: 0.7;
          }
        }
        
        @keyframes aurora-pulse-4 {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
            opacity: 0.45;
          }
          60% { 
            transform: translate(-35px, -25px) scale(1.18);
            opacity: 0.65;
          }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-5px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }
        
        @keyframes firefly {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.6;
          }
          25% { 
            transform: translate(30px, -40px);
            opacity: 1;
          }
          50% { 
            transform: translate(-20px, -80px);
            opacity: 0.7;
          }
          75% { 
            transform: translate(40px, -60px);
            opacity: 0.9;
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% { 
            opacity: 0.4;
            filter: blur(20px);
          }
          50% { 
            opacity: 0.8;
            filter: blur(25px);
          }
        }
        
        .aurora-1 {
          animation: aurora-pulse-1 25s ease-in-out infinite;
        }
        
        .aurora-2 {
          animation: aurora-pulse-2 30s ease-in-out infinite;
        }
        
        .aurora-3 {
          animation: aurora-pulse-3 35s ease-in-out infinite;
        }
        
        .aurora-4 {
          animation: aurora-pulse-4 28s ease-in-out infinite;
        }
        
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
        }
        
        .star-tiny {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .star-small {
          animation: twinkle-slow 5s ease-in-out infinite;
        }
        
        .star-large {
          animation: twinkle-bright 4s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.9), 0 0 12px rgba(255, 255, 255, 0.5);
        }
        
        .shooting-star {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.5), transparent);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          animation: shooting-star 2.5s linear infinite;
        }
        
        .firefly {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
          animation: firefly 8s ease-in-out infinite;
        }
      `}</style>
      
      {/* Tiny distant stars - Layer 4 (fastest parallax) */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.2}px)`
        }}
      >
        {Array.from({ length: 250 }).map((_, i) => {
          const size = Math.random() * 1.2 + 0.4;
          return (
            <div
              key={`tiny-${i}`}
              className="star star-tiny"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.4
              }}
            />
          );
        })}
      </div>
      
      {/* Medium stars - Layer 3 */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.15}px)`
        }}
      >
        {Array.from({ length: 100 }).map((_, i) => {
          const size = Math.random() * 2.5 + 1;
          return (
            <div
              key={`small-${i}`}
              className="star star-small"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: 0.5 + Math.random() * 0.5
              }}
            />
          );
        })}
      </div>
      
      {/* Larger bright stars - Layer 2 */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.1}px)`
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => {
          const size = Math.random() * 3.5 + 2;
          return (
            <div
              key={`large-${i}`}
              className="star star-large"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 3}s`,
                opacity: 0.7 + Math.random() * 0.3
              }}
            />
          );
        })}
      </div>
      
      {/* Shooting stars - Layer 1 (slowest parallax) */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.05}px)`
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="shooting-star"
            style={{
              left: `${10 + Math.random() * 40}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 6 + Math.random() * 8}s`,
              animationDuration: `${2 + Math.random() * 1.5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Magical fireflies - greenish glowing particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`firefly-${i}`}
          className="firefly"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${60 + Math.random() * 30}%`,
            color: i % 3 === 0 
              ? 'rgba(122, 155, 118, 0.8)' 
              : i % 3 === 1 
              ? 'rgba(180, 200, 140, 0.7)'
              : 'rgba(140, 180, 150, 0.75)',
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 8}s`,
          }}
        />
      ))}
      
      {/* Soft glow particles floating */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${100 + Math.random() * 150}px`,
            height: `${100 + Math.random() * 150}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              i % 4 === 0 
                ? 'rgba(122, 155, 118, 0.04)' 
                : i % 4 === 1 
                ? 'rgba(138, 157, 195, 0.035)'
                : i % 4 === 2
                ? 'rgba(150, 120, 180, 0.03)'
                : 'rgba(100, 180, 160, 0.032)'
            } 0%, transparent 70%)`,
            animation: `float-gentle ${12 + Math.random() * 15}s ease-in-out infinite, glow-pulse ${8 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`,
            filter: 'blur(50px)',
          }}
        />
      ))}
      
      {/* Atmospheric depth layers */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(122, 155, 118, 0.03) 0%, transparent 60%)',
          pointerEvents: 'none'
        }}
      />
      
      {/* Enhanced vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at center, transparent 0%, rgba(8, 11, 20, 0.3) 80%, rgba(8, 11, 20, 0.6) 100%)
          `,
          pointerEvents: 'none'
        }}
      />
      
      {/* Subtle grain texture for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}
