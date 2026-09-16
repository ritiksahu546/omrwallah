import React from 'react';
import {
  LayoutDashboard,
  FileEdit,
  Layers,
  FolderOpen,
  BookOpenCheck,
  PenTool,
  ScanLine,
  Award,
  BarChart3,
  User,
  Settings,
  Crown,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenProModal?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  onOpenProModal,
  collapsed = false,
  onToggleCollapse,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'creator', label: 'Create OMR', icon: FileEdit },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'saved', label: 'Saved Sheets', icon: FolderOpen },
    { id: 'tests', label: 'My Tests', icon: BookOpenCheck },
    { id: 'practice', label: 'Practice OMR', icon: PenTool },
    { id: 'scan', label: 'Scan OMR', icon: ScanLine },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleProClick = () => {
    if (typeof onOpenProModal === 'function') {
      onOpenProModal();
    } else {
      onNavigate('pricing');
    }
  };

  return (
    <aside
      className={`hidden md:flex bg-[#0b132b] text-slate-300 flex-col justify-between border-r border-slate-800 transition-all duration-300 select-none flex-shrink-0 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      } min-h-screen`}
    >
      {/* Top Workspace Header & Collapse Toggle */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-black tracking-wider uppercase text-slate-300 block truncate">
                  Student Workspace
                </span>
                <span className="text-[10px] text-slate-500 font-medium block truncate">
                  Portal Navigation
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" title="Active Workspace" />
            </div>
          )}

          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Pro Promotion Card */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950/60 border border-blue-500/30 rounded-2xl p-3.5 text-center shadow-lg relative overflow-hidden group">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/40 mx-auto flex items-center justify-center mb-2 shadow-inner">
              <Crown className="w-4 h-4" />
            </div>
            <h4 className="text-white font-bold text-sm">Upgrade to Pro</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 mb-3 leading-snug">
              Unlock advanced scanner, unlimited sheets & detailed analytics.
            </p>
            <button
              type="button"
              onClick={handleProClick}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/40 transition-all cursor-pointer"
            >
              Get Pro Now
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleProClick}
            className="w-full p-2.5 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 flex items-center justify-center transition-colors cursor-pointer"
            title="Upgrade to Pro"
          >
            <Crown className="w-5 h-5" />
          </button>
        )}
      </div>
    </aside>
  );
};
