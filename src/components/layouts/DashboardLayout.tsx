'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ErrorBoundary } from 'react-error-boundary';
import { useTheme } from 'next-themes';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <div className="flex h-screen">
          <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header 
              onToggleSidebar={toggleSidebar} 
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6">
              {children}
            </main>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}
