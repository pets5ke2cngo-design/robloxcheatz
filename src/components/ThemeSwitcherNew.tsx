import React, { useState, useEffect, useRef } from 'react';
import { useTheme, themes, ThemeType } from './ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, themeId, setTheme, isTransitioning, setIsTransitioning } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeSelect = async (newThemeId: ThemeType) => {
    if (newThemeId === themeId) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    setIsTransitioning(true);

    // Wait for blur animation
    await new Promise(resolve => setTimeout(resolve, 400));

    // Change theme
    setTheme(newThemeId);

    // Wait for theme to apply
    await new Promise(resolve => setTimeout(resolve, 600));

    // Remove transition overlay
    setIsTransitioning(false);
  };

  return (
    <>
      {/* Theme Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Blur backdrop */}
          <div 
            className="absolute inset-0 backdrop-blur-xl bg-black/70"
            style={{ animation: 'themeOverlayFadeIn 0.3s ease-out forwards' }}
          />
          
          {/* Loading spinner */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative">
              {/* Outer ring */}
              <div 
                className="w-16 h-16 rounded-full border-4 border-transparent"
                style={{ 
                  borderTopColor: theme.colors.primary,
                  borderRightColor: theme.colors.secondary,
                  animation: 'themeSpin 1s linear infinite'
                }}
              />
              {/* Inner ring */}
              <div 
                className="absolute inset-2 rounded-full border-4 border-transparent"
                style={{ 
                  borderBottomColor: theme.colors.accent,
                  borderLeftColor: theme.colors.primary,
                  animation: 'themeSpin 0.8s linear infinite reverse'
                }}
              />
              {/* Center dot */}
              <div 
                className="absolute inset-0 m-auto w-3 h-3 rounded-full"
                style={{ 
                  background: theme.gradient,
                  animation: 'themePulse 1s ease-in-out infinite'
                }}
              />
            </div>
            <p 
              className="text-sm font-medium"
              style={{ 
                background: theme.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'themePulse 1.5s ease-in-out infinite'
              }}
            >
              Applying theme...
            </p>
          </div>

          {/* Morphing particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: theme.gradient,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.6,
                  animation: `themeFloat ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Theme Switcher Button */}
      <div ref={dropdownRef} className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/90 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
          style={{ boxShadow: `0 0 20px ${theme.colors.primary}20` }}
        >
          {/* Color preview */}
          <div 
            className="w-5 h-5 rounded-full"
            style={{ background: theme.gradient }}
          />
          <span>Theme</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 py-2 rounded-xl bg-[#0f0f14]/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ animation: 'themeDropdownSlideIn 0.2s ease-out forwards' }}
          >
            {Object.values(themes).map((t, index) => (
              <button
                key={t.id}
                onClick={() => handleThemeSelect(t.id)}
                className={`cursor-target w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-200 ${
                  themeId === t.id 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
                style={{ 
                  animation: `themeItemFadeIn 0.2s ease-out forwards`,
                  animationDelay: `${index * 0.05}s`,
                  opacity: 0
                }}
              >
                {/* Theme color preview */}
                <div 
                  className="w-6 h-6 rounded-lg flex-shrink-0"
                  style={{ background: t.gradient }}
                />
                <span className="text-sm font-medium">{t.name}</span>
                {themeId === t.id && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={t.colors.primary}
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4 ml-auto"
                  >
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes themeOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes themeSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes themePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        
        @keyframes themeFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.3; }
        }
        
        @keyframes themeDropdownSlideIn {
          from { 
            opacity: 0; 
            transform: translateX(-50%) translateY(10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateX(-50%) translateY(0) scale(1); 
          }
        }
        
        @keyframes themeItemFadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
};

export default ThemeSwitcher;
