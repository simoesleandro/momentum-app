import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { themes } from '../styles/themes';
import type { Theme } from '../styles/themes';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  themeKey: string;
  changeTheme: (themeKey: string) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const applyTheme = (themeKey: string) => {
    const selectedTheme = themes[themeKey] || themes.default;
    const root = window.document.documentElement;

    Object.entries(selectedTheme.colors).forEach(([name, colorSet]) => {
        // name is 'brand-primary', etc.
        // colorSet is { DEFAULT: '#...', light: '#...', dark: '#...' }
        // This is a type guard to satisfy TypeScript
        if(typeof colorSet.DEFAULT === 'string') {
          root.style.setProperty(`--${name}`, colorSet.DEFAULT);
        }
        if ('light' in colorSet && typeof colorSet.light === 'string') {
          root.style.setProperty(`--${name}-light`, colorSet.light);
        }
        if ('dark' in colorSet && typeof colorSet.dark === 'string') {
          root.style.setProperty(`--${name}-dark`, colorSet.dark);
        }
    });
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeKey, setThemeKey] = useState(() => {
      const storedThemeKey = localStorage.getItem('themeKey') || 'default';
      applyTheme(storedThemeKey); // Apply theme on initial load before React hydrates
      return storedThemeKey;
  });
  
  const [mode, setMode] = useState<ThemeMode>(() => (localStorage.getItem('themeMode') as ThemeMode) || 'light');

  useEffect(() => {
    // Apply theme colors
    applyTheme(themeKey);

    // Handle light/dark mode class
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);

    // Persist choices
    localStorage.setItem('themeKey', themeKey);
    localStorage.setItem('themeMode', mode);
  }, [themeKey, mode]);

  const changeTheme = (newThemeKey: string) => {
    if (themes[newThemeKey]) {
      setThemeKey(newThemeKey);
    }
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => themes[themeKey] || themes.default, [themeKey]);

  const value = { theme, mode, themeKey, changeTheme, toggleMode };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};