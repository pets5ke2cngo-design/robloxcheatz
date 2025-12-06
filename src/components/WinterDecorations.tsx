import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';

// Snowflake characters
const snowflakeChars = ['❄', '❅', '❆', '✻', '✼', '❉', '✺'];

// Light bulb colors - brighter
const bulbColors = ['#FFE082', '#42A5F5', '#EF5350', '#FFA726', '#AB47BC', '#66BB6A'];

interface Snowflake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  char: string;
  opacity: number;
  swing: number;
}

interface Bulb {
  id: number;
  colorIndex: number;
  hangOffset: number;
  swayDelay: number;
  wireLength: number;
}

const WinterDecorations: React.FC = () => {
  const { themeId } = useTheme();
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [bulbs, setBulbs] = useState<Bulb[]>([]);
  const [isOn, setIsOn] = useState<boolean[]>([]);
  
  const isWinterTheme = themeId === 'winter';
  
  useEffect(() => {
    const updateBulbs = () => {
      const width = window.innerWidth;
      const count = Math.max(25, Math.floor(width / 30));
      const newBulbs: Bulb[] = [];
      const newIsOn: boolean[] = [];
      for (let i = 0; i < count; i++) {
        newBulbs.push({
          id: i,
          colorIndex: i % bulbColors.length,
          hangOffset: 3 + Math.random() * 6,
          swayDelay: Math.random() * 2,
          wireLength: 4 + Math.floor(Math.random() * 5),
        });
        newIsOn.push(Math.random() > 0.3);
      }
      setBulbs(newBulbs);
      setIsOn(newIsOn);
    };
    
    updateBulbs();
    window.addEventListener('resize', updateBulbs);
    return () => window.removeEventListener('resize', updateBulbs);
  }, []);
  
  // Random blinking - faster
  useEffect(() => {
    if (!isWinterTheme || bulbs.length === 0) return;
    
    const interval = setInterval(() => {
      setIsOn(prev => {
        const newState = [...prev];
        const toggleCount = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < toggleCount; i++) {
          const idx = Math.floor(Math.random() * newState.length);
          newState[idx] = !newState[idx];
        }
        return newState;
      });
    }, 200 + Math.random() * 400);
    
    return () => clearInterval(interval);
  }, [isWinterTheme, bulbs.length]);
  
  useEffect(() => {
    if (!isWinterTheme) {
      setSnowflakes([]);
      return;
    }
    
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 60; i++) {
      flakes.push({
        id: i,
        x: Math.random() * 100,
        size: 14 + Math.random() * 16,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 5,
        char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
        opacity: 0.5 + Math.random() * 0.4,
        swing: 20 + Math.random() * 40,
      });
    }
    setSnowflakes(flakes);
  }, [isWinterTheme]);
  
  if (!isWinterTheme) return null;
  
  return (
    <>
      {/* Christmas Lights Garland */}
      <div className="fixed top-0 left-0 right-0 pointer-events-none z-[9999]" style={{ height: '40px' }}>
        {/* Light bulbs (behind the gradient wire, z-index: 1) */}
        <div className="garland-bulbs" style={{ zIndex: 1 }}>
          {bulbs.map((bulb, idx) => {
            const color = bulbColors[bulb.colorIndex];
            const on = isOn[idx] ?? true;
            return (
              <div 
                key={bulb.id} 
                className="bulb-container"
                style={{
                  animationDelay: `${bulb.swayDelay}s`,
                  paddingTop: `${bulb.hangOffset}px`,
                }}
              >
                {/* Green wire from cord to socket - starts from top (behind gradient) */}
                <div className="bulb-wire" style={{ height: `${bulb.wireLength + 6}px`, marginTop: '-6px' }} />
                {/* Socket/cap */}
                <div className="bulb-socket" />
                {/* Light bulb */}
                <div 
                  className="light-bulb"
                  style={{
                    backgroundColor: on ? color : '#333',
                    boxShadow: on 
                      ? `0 0 8px 3px ${color}, 0 0 15px 5px ${color}80, inset 0 -3px 6px rgba(0,0,0,0.3)` 
                      : 'inset 0 -3px 6px rgba(0,0,0,0.3)',
                    opacity: on ? 1 : 0.4,
                  }}
                />
              </div>
            );
          })}
        </div>
        
        {/* Gradient wire/cord (on top, z-index: 2) */}
        <div className="garland-wire" style={{ zIndex: 2 }} />
      </div>
      
      {/* Falling snowflakes */}
      <div 
        className="fixed pointer-events-none z-[50]" 
        style={{ 
          top: 0, 
          left: 0, 
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            style={{
              position: 'absolute',
              left: `${flake.x}%`,
              top: '-30px',
              fontSize: `${flake.size}px`,
              opacity: flake.opacity,
              color: 'white',
              textShadow: '0 0 5px rgba(255,255,255,0.5)',
              animation: `snowfall-${flake.id} ${flake.duration}s linear ${flake.delay}s infinite`,
            }}
          >
            {flake.char}
          </div>
        ))}
        
        {/* Generate unique keyframes for each snowflake */}
        <style>
          {snowflakes.map((flake) => `
            @keyframes snowfall-${flake.id} {
              0% {
                transform: translateY(0) translateX(0) rotate(0deg);
              }
              25% {
                transform: translateY(28vh) translateX(${flake.swing}px) rotate(90deg);
              }
              50% {
                transform: translateY(55vh) translateX(${-flake.swing * 0.5}px) rotate(180deg);
              }
              75% {
                transform: translateY(82vh) translateX(${flake.swing}px) rotate(270deg);
              }
              100% {
                transform: translateY(110vh) translateX(0) rotate(360deg);
              }
            }
          `).join('\n')}
        </style>
      </div>
      
      {/* CSS */}
      <style>{`
        /* Main wire along top with animated gradient */
        .garland-wire {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(
            90deg,
            #ef4444 0%,
            #22c55e 16.66%,
            #fbbf24 33.33%,
            #ef4444 50%,
            #22c55e 66.66%,
            #fbbf24 83.33%,
            #ef4444 100%
          );
          background-size: 200% 100%;
          animation: garland-gradient 9s linear infinite;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(239, 68, 68, 0.3);
        }
        
        @keyframes garland-gradient {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: -200% 0%;
          }
        }
        
        /* Container for all bulbs */
        .garland-bulbs {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          padding: 0 10px;
        }
        
        /* Individual bulb container */
        .bulb-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: bulb-sway 3s ease-in-out infinite;
        }
        
        /* Wire from main cord to socket */
        .bulb-wire {
          width: 3px;
          background: linear-gradient(to bottom, #1a5a1a, #2d7a2d);
          margin-top: 0;
          border-radius: 1px;
        }
        
        /* Socket/cap */
        .bulb-socket {
          width: 7px;
          height: 5px;
          background: linear-gradient(to bottom, #3d7a3d, #1a5a1a);
          border-radius: 2px 2px 0 0;
        }
        
        /* The actual light bulb */
        .light-bulb {
          width: 10px;
          height: 16px;
          border-radius: 50%;
          transition: all 0.25s ease;
          margin-top: -1px;
        }
        
        @keyframes bulb-sway {
          0%, 100% { transform: rotate(1.5deg); }
          50% { transform: rotate(-1.5deg); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .bulb-container { animation: none !important; }
        }
      `}</style>
    </>
  );
};

export default WinterDecorations;
