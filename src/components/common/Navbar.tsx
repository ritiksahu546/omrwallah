import React, { useState } from 'react';
import { 
  FileText, 
  Menu, 
  X, 
  Sparkles, 
  Layers, 
  CreditCard, 
  BookOpen, 
  HelpCircle, 
  User as UserIcon, 
  ArrowRight,
  Plus,
  LogOut,
  Sliders
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onUpgradePro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenAuth,
  onUpgradePro,
}) => {
  const { user, userProfile, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'Templates', route: 'templates' },
    { label: 'Practice', route: 'practice' },
    { label: 'Scan', route: 'scan' },
    { label: 'Pricing', route: 'pricing' },
    { label: 'Blog', route: 'blog' },
    { label: 'FAQ', route: 'faq' },
  ];

  const handleLogOut = async () => {
    setUserDropdownOpen(false);
    await logOut();
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:bg-blue-700 transition-colors">
              <div className="relative flex items-center justify-center">
                <FileText className="w-5 h-5 stroke-[2.2]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-slate-900">
                  OMR<span className="text-blue-600">Wallah</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-tight">
                Create • Practice • Scan • Evaluate
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  type="button"
                  onClick={() => onNavigate(link.route)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/90'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <PWAInstallButton variant="nav" />
            {user ? (
              <div className="flex items-center gap-2.5 relative">
                <button
                  type="button"
                  onClick={() => onNavigate('creator')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/25 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create OMR</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                      {(userProfile?.name || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {userProfile?.name || user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-900 truncate">
                          {userProfile?.name || user.displayName || 'Student'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          {userProfile?.plan || 'Free'} Tier
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('saved');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>Saved Sheets</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('profile');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>Student Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('settings');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5 text-slate-400" />
                        <span>Settings</span>
                      </button>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={handleLogOut}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/25 transition-all cursor-pointer"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger & actions (Clean: Primary action is in bottom navigation bar) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <PWAInstallButton variant="nav" className="text-[11px] px-2 py-1" />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-none cursor-pointer transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (Supplementary Navigation Only - Core items are in Bottom Bar) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {/* Mobile App Install Highlight */}
          <PWAInstallButton variant="mobile-item" className="mb-2" />

          {/* Quick Dashboard Action */}
          <div className="mb-2">
            <button
              type="button"
              onClick={() => {
                onNavigate('dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3.5 text-left text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs flex items-center justify-between cursor-pointer transition-colors"
            >
              <span>Dashboard & Saved Sheets</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Secondary Pages (Home & Practice are handled by Bottom Navigation Bar) */}
          <div className="divide-y divide-slate-100">
            {navLinks
              .filter((link) => link.route !== 'home' && link.route !== 'practice')
              .map((link) => (
                <button
                  key={link.route}
                  type="button"
                  onClick={() => {
                    onNavigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    currentRoute === link.route ? 'text-blue-600 font-extrabold' : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
          </div>

          <div className="pt-3 border-t border-slate-200">
            {user ? (
              <div className="space-y-2">
                <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {userProfile?.name || user.email}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {user.email}
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                    {userProfile?.plan || 'Free'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogOut}
                  className="w-full py-2 text-center text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl cursor-pointer transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-bold border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer shadow-xs"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
