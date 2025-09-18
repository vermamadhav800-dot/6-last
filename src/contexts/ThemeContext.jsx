"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  colorful: {
    name: 'Colorful',
    description: 'Vibrant and modern with gradients',
    primary: 'from-indigo-500 to-purple-500',
    secondary: 'from-purple-500 to-pink-500',
    accent: 'from-cyan-500 to-blue-500',
    background: 'from-slate-900 via-purple-900 to-slate-900',
    card: 'from-slate-800/50 to-slate-900/50',
    text: 'text-white',
    muted: 'text-slate-300',
    border: 'border-white/10',
    glow: 'shadow-indigo-500/25',
    isColorful: true
  },
  professional: {
    name: 'Professional Light',
    description: 'Clean and business-focused design',
    primary: 'from-slate-700 to-slate-800',
    secondary: 'from-slate-600 to-slate-700',
    accent: 'from-blue-600 to-blue-700',
    background: 'from-slate-50 via-blue-50/30 to-slate-100',
    card: 'from-white to-slate-50/90 backdrop-blur-sm',
    text: 'text-slate-900',
    muted: 'text-slate-600',
    border: 'border-slate-200/60',
    glow: 'shadow-slate-500/20',
    isColorful: false
  },
  dark: {
    name: 'Dark Professional',
    description: 'Elegant dark theme for professionals',
    primary: 'from-slate-800 to-slate-900',
    secondary: 'from-slate-700 to-slate-800',
    accent: 'from-blue-700 to-blue-800',
    background: 'from-slate-900 to-slate-950',
    card: 'from-slate-800/90 to-slate-900/90',
    text: 'text-slate-100',
    muted: 'text-slate-400',
    border: 'border-slate-700',
    glow: 'shadow-slate-500/30',
    isColorful: false
  },
  enterprise: {
    name: 'Enterprise Dark',
    description: 'Premium dark theme with blue accents',
    primary: 'from-slate-800 to-slate-900',
    secondary: 'from-slate-700 to-slate-800',
    accent: 'from-blue-600 to-blue-700',
    background: 'from-slate-950 via-slate-900 to-slate-950',
    card: 'from-slate-800/95 to-slate-900/95 backdrop-blur-sm',
    text: 'text-slate-50',
    muted: 'text-slate-300',
    border: 'border-slate-700/50',
    glow: 'shadow-blue-500/20',
    isColorful: false
  },
  modern: {
    name: 'Modern Professional',
    description: 'Contemporary design with subtle gradients',
    primary: 'from-slate-700 to-slate-800',
    secondary: 'from-slate-600 to-slate-700',
    accent: 'from-blue-500 to-blue-600',
    background: 'from-slate-100 via-blue-50/20 to-slate-200',
    card: 'from-white/95 to-slate-50/95 backdrop-blur-sm',
    text: 'text-slate-900',
    muted: 'text-slate-600',
    border: 'border-slate-200/60',
    glow: 'shadow-slate-400/20',
    isColorful: false
  },
  futuristic: {
    name: 'Futuristic Dark',
    description: 'High-tech dark theme with neon accents',
    primary: 'from-slate-800 to-slate-900',
    secondary: 'from-slate-700 to-slate-800',
    accent: 'from-cyan-500 to-blue-500',
    background: 'from-slate-950 via-slate-900 to-slate-950',
    card: 'from-slate-800/95 to-slate-900/95 backdrop-blur-sm',
    text: 'text-slate-100',
    muted: 'text-slate-300',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/30',
    isColorful: false
  }
};

export function AppThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('enterprise');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'enterprise';
    setCurrentTheme(savedTheme);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app-theme', currentTheme);
    }
  }, [currentTheme, isLoaded]);

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setCurrentTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}
