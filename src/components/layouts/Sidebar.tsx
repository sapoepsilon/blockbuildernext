'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Boxes, 
  Settings, 
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Containers', href: '/containers', icon: Boxes },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-card transition-all duration-300 ease-in-out relative`}
    >
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-primary text-primary-foreground rounded-full p-1.5 z-10"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="p-4">
        <div className="flex items-center justify-center h-14">
          <span className={`font-bold text-xl ${!isOpen && 'hidden'}`}>
            BlockBuilder
          </span>
        </div>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-muted'
                  }`}
              >
                <Icon size={20} />
                <span className={`ml-3 ${!isOpen && 'hidden'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
