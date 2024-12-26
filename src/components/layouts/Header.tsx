'use client';

import { FC } from 'react';
import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { SystemStatus } from '../metrics/SystemStatus';

interface HeaderProps {
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
}

export const Header: FC<HeaderProps> = ({ onToggleSidebar, onToggleTheme }) => {
  const { theme } = useTheme();

  return (
    <header className="h-16 border-b bg-card px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex-1 mx-4">
          <SystemStatus />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleTheme}
            className="p-2 hover:bg-accent rounded-lg"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
