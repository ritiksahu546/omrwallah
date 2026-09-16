import React from 'react';
import { X, Crown, Check, Zap, Sparkles } from 'lucide-react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  onSelectPlan?: (plan: string) => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    if (typeof onUpgrade === 'function') {
      onUpgrade();
    }
    if (typeof onSelectPlan === 'function') {
      onSelectPlan('Pro');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-hidden">
        
        {/* Background glow badge */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10" />

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center border border-amber-500/30">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              PRO ACCESS
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              Unlock Advanced OMR Power
            </h3>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-6">
          Upgrade to OMRWallah Pro for high-speed camera scanning, unlimited saved templates, and in-depth question error diagnostics.
        </p>

        <div className="space-y-3 mb-6">
          {[
            'Unlimited custom A4 OMR sheets saving',
            'AI Mobile Scanner with instant accuracy validation',
            'Subject-wise breakdown & negative marking calculator',
            'Upload custom institute logo without watermarks',
            'Export vector crisp 300 DPI printer-ready PDFs',
            'Priority coaching support & regular updates',
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold block">SPECIAL LAUNCH OFFER</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">₹199</span>
              <span className="text-xs text-slate-500 font-semibold">/ month</span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Cancel Anytime
          </span>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Maybe Later
          </button>
          <button
            type="button"
            onClick={handleUpgradeClick}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Upgrade to Pro</span>
          </button>
        </div>

      </div>
    </div>
  );
};
