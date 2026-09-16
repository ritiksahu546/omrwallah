import React from 'react';
import {
  LayoutDashboard,
  FileEdit,
  BookOpenCheck,
  Award,
  User,
  ScanLine,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const { user } = useAuth();

  // Don't show bottom nav inside the intense full-page A4 Creator editor
  // because creator has its own sticky mobile bottom action bar
  if (currentRoute === 'creator') {
    return null;
  }

  const navItems = [
    {
      id: user ? 'dashboard' : 'home',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'creator',
      label: 'Create',
      icon: FileEdit,
      highlight: true,
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: BookOpenCheck,
    },
    {
      id: 'results',
      label: 'Results',
      icon: Award,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around select-none no-print"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          currentRoute === item.id ||
          (item.id === 'practice' && currentRoute === 'tests') ||
          (item.id === 'profile' && currentRoute === 'settings');

        if (item.highlight) {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center -mt-4 group cursor-pointer focus:outline-none"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-transform active:scale-95 border-2 border-white">
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-black text-blue-600 mt-0.5">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors cursor-pointer focus:outline-none ${
              isActive
                ? 'text-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4] text-blue-600' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
