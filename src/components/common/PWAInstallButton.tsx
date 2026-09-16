import React, { useState } from 'react';
import { Download, Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'banner' | 'card' | 'mobile-item';
  className?: string;
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
  onInstalled,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('omr_pwa_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  // If already installed, hide
  if (isInstalled || (variant === 'banner' && dismissed)) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (isInstallable) {
      setInstalling(true);
      const success = await install();
      setInstalling(false);
      if (success && onInstalled) {
        onInstalled();
      }
    } else {
      // If browser doesn't expose prompt yet (or already triggered), show instruction modal
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {/* 1. Navbar compact button */}
      {variant === 'nav' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors shadow-2xs cursor-pointer ${className}`}
          title="Install OMRWallah App on your Device"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">App</span>
        </button>
      )}

      {/* 2. Mobile Drawer Menu Item */}
      {variant === 'mobile-item' && (
        <button
          type="button"
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md active:scale-98 transition-transform cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-xs">Download OMRWallah App</p>
              <p className="text-[10px] text-blue-100 font-normal">Install on Mobile • Fast & Offline</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-white text-blue-700 text-[10px] font-black rounded-md uppercase tracking-wider">
            Install
          </span>
        </button>
      )}

      {/* 3. Bottom Mobile Banner (dismissible) */}
      {variant === 'banner' && (
        <aside
          aria-label="App installation prompt"
          className={`fixed bottom-16 sm:bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:max-w-sm z-40 bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/pwa-192x192.png"
              alt="OMRWallah App"
              className="w-10 h-10 rounded-xl shadow-md border border-white/10 shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-bold text-xs tracking-tight text-white truncate">
                Install OMRWallah App
              </h3>
              <p className="text-[11px] text-slate-300 truncate">
                Scan sheets faster & practice offline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              disabled={installing}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDismissed(true);
                try {
                  sessionStorage.setItem('omr_pwa_banner_dismissed', 'true');
                } catch {
                  // ignore
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss banner"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* 4. Card variant */}
      {variant === 'card' && (
        <div className={`p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">OMRWallah Mobile App</h3>
              <p className="text-xs text-slate-600">Install directly on Android or iPhone</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer shrink-0"
          >
            Install Now
          </button>
        </div>
      )}

      {/* iOS / Instruction Guide Modal */}
      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 relative">
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src="/pwa-192x192.png"
                alt="OMRWallah App"
                className="w-12 h-12 rounded-xl shadow-md border border-slate-200"
              />
              <div>
                <h3 id="ios-install-title" className="text-base font-bold text-slate-900">
                  Install OMRWallah
                </h3>
                <p className="text-xs text-slate-500">Add to your Phone Home Screen</p>
              </div>
            </div>

            <div className="space-y-3 py-2 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-800">
                    {isIOS ? 'Safari Toolbar' : 'Browser Menu'}
                  </p>
                  <p className="text-slate-500 mt-0.5">
                    {isIOS ? (
                      <>
                        Tap the <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> <strong>Share</strong> button at the bottom of Safari.
                      </>
                    ) : (
                      <>
                        Tap the <strong>three dots (⋮)</strong> menu in the browser top-right corner.
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Select Add to Home Screen</p>
                  <p className="text-slate-500 mt-0.5">
                    Scroll down and select <PlusSquare className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> <strong>Add to Home Screen</strong> or <strong>Install App</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Launch anytime like an App!</p>
                  <p className="text-slate-500 mt-0.5">
                    The OMRWallah icon will appear on your phone home screen without needing Google Play Store.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 active:scale-98 transition shadow-sm cursor-pointer"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
