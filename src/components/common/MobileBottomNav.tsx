import React from 'react';
import { LayoutGrid, FileEdit, BookOpen, Award, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const isHome = currentRoute === 'home';
  const isCreate = currentRoute === 'creator';
  const isPractice = currentRoute === 'practice';
  const isResults = currentRoute === 'results';
  const isProfile = currentRoute === 'profile';

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden"
    >
      <div className="grid grid-cols-5 items-end px-2 pt-1 pb-2">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="flex flex-col items-center justify-center py-1 cursor-pointer transition-colors group"
        >
          <div
            className={`p-1 transition-transform group-active:scale-90 ${
              isHome ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] tracking-tight transition-colors ${
              isHome ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            Home
          </span>
        </button>

        {/* 2. Create (Elevated circular floating action button) */}
        <button
          type="button"
          onClick={() => onNavigate('creator')}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
        >
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-white transition-transform group-active:scale-90 ${
              isCreate ? 'ring-2 ring-blue-600 ring-offset-2' : ''
            }`}
          >
            <FileEdit className="w-5 h-5 stroke-[2.4]" />
          </div>
          <span
            className={`text-[11px] mt-0.5 tracking-tight ${
              isCreate ? 'text-blue-700 font-extrabold' : 'text-blue-600 font-bold'
            }`}
          >
            Create
          </span>
        </button>

        {/* 3. Practice */}
        <button
          type="button"
          onClick={() => onNavigate('practice')}
          className="flex flex-col items-center justify-center py-1 cursor-pointer transition-colors group"
        >
          <div
            className={`p-1 transition-transform group-active:scale-90 ${
              isPractice ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] tracking-tight transition-colors ${
              isPractice ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            Practice
          </span>
        </button>

        {/* 4. Results */}
        <button
          type="button"
          onClick={() => onNavigate('results')}
          className="flex flex-col items-center justify-center py-1 cursor-pointer transition-colors group"
        >
          <div
            className={`p-1 transition-transform group-active:scale-90 ${
              isResults ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <Award className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] tracking-tight transition-colors ${
              isResults ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            Results
          </span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="flex flex-col items-center justify-center py-1 cursor-pointer transition-colors group"
        >
          <div
            className={`p-1 transition-transform group-active:scale-90 ${
              isProfile ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[11px] tracking-tight transition-colors ${
              isProfile ? 'text-blue-600 font-bold' : 'text-slate-500 font-medium'
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
