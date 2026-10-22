import React from 'react';
import { X, Check, Sparkles, Clock, ShieldCheck } from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planName: string) => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Core Features Unlocked Free During Open Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            OMRWallah Pro & Institute Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
            All 200-question OMR creation, A4 PDF export, interactive practice, and single-sheet optical scanning features are currently unlocked for free! Batch ZIP grading and multi-branch portals are launching soon.
          </p>
        </div>

        {/* Plans Comparison */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Free Active Tier */}
          <div className="border-2 border-emerald-500 bg-emerald-50/20 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Unlocked Now
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹0{' '}
                <span className="text-xs font-normal text-slate-500">
                  / Open Access
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Up to 200 Questions Custom OMR</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Custom Institute Logo & Watermark</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Pixel Darkness OMR Sheet Scanner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Printable Scorecard PDF Reports</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full mt-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Continue Using Free Tools
            </button>
          </div>

          {/* Upcoming Batch & Institute Suite */}
          <div className="border border-slate-200 rounded-2xl p-5 flex flex-col justify-between relative">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Educator & Institute Pro</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  Coming Soon
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900">
                ₹299{' '}
                <span className="text-xs font-normal text-slate-500">
                  / mo (Planned)
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700 pt-2">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Bulk ZIP & Multi-Page PDF Scanner</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Batch Rank List Excel/CSV Generator</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Multi-Branch Faculty Workspace</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Automated Student Result Dispatch</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('Educator Pro Waitlist')}
              className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Notify Me When Batch Pro Launches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
