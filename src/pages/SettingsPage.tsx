import React, { useState } from 'react';
import {
  Sliders,
  Bell,
  ScanLine,
  Printer,
  Shield,
  Save,
  RotateCcw,
} from 'lucide-react';
import {
  AppSettings,
  DEFAULT_APP_SETTINGS,
  loadAppSettings,
  saveAppSettings,
} from '../utils/appSettings';

interface SettingsPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ showToast }) => {
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());

  const handleUpdate = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAppSettings(settings);
    showToast('Application preferences saved and applied!', 'success');
  };

  const handleReset = () => {
    setSettings(DEFAULT_APP_SETTINGS);
    saveAppSettings(DEFAULT_APP_SETTINGS);
    showToast('Preferences restored to default settings.', 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Customize your OMR scanner sensitivity, default print dimensions, marking scheme, and alerts
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Scanner & Evaluation Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <ScanLine className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Scanner & Optical Evaluation Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bubble Fill Detection Sensitivity
              </label>
              <select
                value={settings.scannerSensitivity}
                onChange={(e) =>
                  handleUpdate(
                    'scannerSensitivity',
                    e.target.value as AppSettings['scannerSensitivity']
                  )
                }
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
              >
                <option value="lenient">Lenient (Detects faint / partial pencil marks)</option>
                <option value="medium">Balanced (Recommended for Blue/Black Ball Pen)</option>
                <option value="strict">Strict (Requires heavy dark bubble fill)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Default Exam Marking Scheme
              </label>
              <select
                value={`${settings.defaultMarkingCorrect}_${settings.defaultMarkingWrong}`}
                onChange={(e) => {
                  const [c, w] = e.target.value.split('_').map(Number);
                  setSettings((prev) => ({
                    ...prev,
                    defaultMarkingCorrect: c,
                    defaultMarkingWrong: w,
                  }));
                }}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
              >
                <option value="4_-1">NEET / JEE (+4 Correct, -1 Wrong)</option>
                <option value="2_-0.5">UPSC / SSC (+2 Correct, -0.5 Wrong)</option>
                <option value="1_-0.25">Banking / Railway (+1 Correct, -0.25 Wrong)</option>
                <option value="1_0">School Assessment (+1 Correct, No Negative)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 sm:col-span-2">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Auto-Detect Corner Registration Marks
                </div>
                <div className="text-[11px] text-slate-500">
                  Automatically align the question grid using the 4 corner anchor squares during scanning
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoStraighten}
                onChange={(e) => handleUpdate('autoStraighten', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Print & PDF Export Defaults */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Printer className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Print & PDF Export Defaults
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Default Paper Size
              </label>
              <select
                value={settings.defaultPaperSize}
                onChange={(e) =>
                  handleUpdate(
                    'defaultPaperSize',
                    e.target.value as AppSettings['defaultPaperSize']
                  )
                }
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-600"
              >
                <option value="A4">Standard A4 (210 × 297 mm)</option>
                <option value="Letter">US Letter (216 × 279 mm)</option>
                <option value="Legal">Legal Sheet (216 × 356 mm)</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Auto-Save Creator Changes
                </div>
                <div className="text-[11px] text-slate-500">
                  Keep draft OMR configurations preserved in browser storage
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoSaveCreator}
                onChange={(e) => handleUpdate('autoSaveCreator', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Notifications & Alerts
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Weekly Performance Digest
                </div>
                <div className="text-[11px] text-slate-500">
                  Summary of practice accuracy and speed trends
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.emailReports}
                onChange={(e) => handleUpdate('emailReports', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Instant Evaluation Score Popups
                </div>
                <div className="text-[11px] text-slate-500">
                  Show toast notifications immediately after scanning or submitting a sheet
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.instantAlerts}
                onChange={(e) => handleUpdate('instantAlerts', e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
