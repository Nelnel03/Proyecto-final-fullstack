import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('modoOscuro');
    return saved === 'activado';
  });

  useEffect(() => {
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('modoOscuro', 'activado');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('modoOscuro', 'desactivado');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
