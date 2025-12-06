import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'default' | 'cyberpunk' | 'ocean' | 'sunset' | 'forest' | 'winter';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  cardBg: string;
}

interface Theme {
  id: ThemeType;
  name: string;
  colors: ThemeColors;
  gradient: string;
  gradientColors: string[];
  isSeasonalTheme?: boolean;
}

// Check if we're in winter season (Dec 1 - Mar 1)
const isWinterSeason = (): boolean => {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  // December (11), January (0), February (1)
  return month === 11 || month === 0 || month === 1;
};

export const themes: Record<ThemeType, Theme> = {
  default: {
    id: 'default',
    name: 'Default Pink',
    colors: {
      primary: '#ff0ae2',
      secondary: '#9c40ff',
      accent: '#3b82f6',
      background: '#09090b',
      cardBg: 'rgba(17, 17, 22, 0.9)',
    },
    gradient: 'linear-gradient(135deg, #ff0ae2, #9c40ff, #3b82f6)',
    gradientColors: ['#ff0ae2', '#9c40ff', '#3b82f6', '#ff0ae2'],
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      primary: '#00ff9f',
      secondary: '#00b8ff',
      accent: '#ff00ff',
      background: '#0a0a0f',
      cardBg: 'rgba(10, 20, 30, 0.9)',
    },
    gradient: 'linear-gradient(135deg, #00ff9f, #00b8ff, #ff00ff)',
    gradientColors: ['#00ff9f', '#00b8ff', '#ff00ff', '#00ff9f'],
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    colors: {
      primary: '#06b6d4',
      secondary: '#0ea5e9',
      accent: '#8b5cf6',
      background: '#020617',
      cardBg: 'rgba(8, 20, 40, 0.9)',
    },
    gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9, #8b5cf6)',
    gradientColors: ['#06b6d4', '#0ea5e9', '#8b5cf6', '#06b6d4'],
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Blaze',
    colors: {
      primary: '#f97316',
      secondary: '#ef4444',
      accent: '#eab308',
      background: '#0c0a09',
      cardBg: 'rgba(25, 15, 10, 0.9)',
    },
    gradient: 'linear-gradient(135deg, #f97316, #ef4444, #eab308)',
    gradientColors: ['#f97316', '#ef4444', '#eab308', '#f97316'],
  },
  forest: {
    id: 'forest',
    name: 'Forest Night',
    colors: {
      primary: '#22c55e',
      secondary: '#10b981',
      accent: '#84cc16',
      background: '#052e16',
      cardBg: 'rgba(10, 30, 20, 0.9)',
    },
    gradient: 'linear-gradient(135deg, #22c55e, #10b981, #84cc16)',
    gradientColors: ['#22c55e', '#10b981', '#84cc16', '#22c55e'],
  },
  winter: {
    id: 'winter',
    name: '❄️ Winter Holiday',
    colors: {
      primary: '#ef4444',
      secondary: '#22c55e',
      accent: '#fbbf24',
      background: '#0c1929',
      cardBg: 'rgba(15, 30, 50, 0.9)',
    },
    gradient: 'linear-gradient(135deg, #ef4444, #22c55e, #fbbf24)',
    gradientColors: ['#ef4444', '#22c55e', '#fbbf24', '#ef4444'],
    isSeasonalTheme: true,
  },
};

interface ThemeContextType {
  theme: Theme;
  themeId: ThemeType;
  setTheme: (id: ThemeType) => void;
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
  isWinterSeason: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const winterActive = isWinterSeason();
  
  const [themeId, setThemeId] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('site-theme');
    // If it's winter season and user hasn't selected a theme, default to winter
    if (!saved && winterActive) {
      return 'winter';
    }
    return (saved as ThemeType) || 'default';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const theme = themes[themeId];

  useEffect(() => {
    // Apply CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-card-bg', theme.colors.cardBg);
    root.style.setProperty('--theme-gradient', theme.gradient);
    
    // Save to localStorage
    localStorage.setItem('site-theme', themeId);
    
    // Apply background color to body
    document.body.style.backgroundColor = theme.colors.background;
  }, [theme, themeId]);

  const setTheme = (id: ThemeType) => {
    setThemeId(id);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme, isTransitioning, setIsTransitioning, isWinterSeason: winterActive }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
