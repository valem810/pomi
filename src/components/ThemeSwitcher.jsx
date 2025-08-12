import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();


  return (
    <div className="bg-background border border-input flex items-center justify-center rounded-full p-1">
      <button
        onClick={() => handleThemeChange('light')}
        className={`p-2 rounded-full transition-all ${
          theme === 'light' ? 'text-[#1d35bd]' : 'text-muted-foreground'
        } hover:bg-primary hover:text-[#000000] hover:scale-105 hover:ring-2`}
        aria-label="Tema claro"
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        onClick={() => handleThemeChange('dark')}
        className={`p-2 rounded-full transition-all ${
          theme === 'dark' ? 'text-[#1d35bd]' : 'text-muted-foreground'
        } hover:bg-primary hover:text-[#000000] hover:scale-105 hover:ring-2`}
        aria-label="Tema oscuro"
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        onClick={() => handleThemeChange('system')}
        className={`p-2 rounded-full transition-all ${
          theme === 'system' ? 'text-[#1d35bd]' : 'text-muted-foreground'
        } hover:bg-primary hover:text-[#000000] hover:scale-105 hover:ring-2`}
        aria-label="Tema del sistema"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
