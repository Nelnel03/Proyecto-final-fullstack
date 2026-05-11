import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: isDark ? '#fbbf24' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 8px',
        marginRight: '8px',
        transition: 'color 0.3s'
      }}
      title="Alternar Tema"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
}

export default DarkModeToggle;
