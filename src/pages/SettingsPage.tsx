import React, { useState } from 'react';
import { Sliders, Printer, Camera, Shield, Bell, Trash2, Save } from 'lucide-react';

interface SettingsPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ showToast }) => {
  const [scannerSensitivity, setScannerSensitivity] = useState('medium');
  const [defaultPaper, setDefaultPaper] = useState('A4');
  const [markingScheme, setMarkingScheme] = useState('neet');
  const [soundEffects, setSoundEffects] = useState(true);
  const [autoStraighten, setAutoStraighten] = useState(true);

  const handleSave = () => {
    showToast('Application preferences saved', 'success');
  };

  const handleClearCache = () => {
    if (window.confirm('Clear cached templates and test results?')) {
      localStorage.clear();
      showToast('Cache cleared successfully', 'info');
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Application Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Configure default OMR generation parameters, scanner sensitivity, and local preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Scanner Configuration */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Camera Scanner & Evaluation Engine
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Bubble Darkening Detection Threshold
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'lenient', label: 'Lenient (Faint pencil ok)' },
                  { id: 'medium', label: 'Standard (Ballpoint Pen)' },
                  { id: 'strict', label: 'Strict (Full Darkening)' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScannerSensitivity(s.id)}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer transition-colors ${
                      scannerSensitivity === s.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Perspective Auto-Straighten</span>
                <span className="text-slate-500 text-[11px]">Correct tilted camera angles using corner registration markers</span>
              </div>
              <input
                type="checkbox"
                checked={autoStraighten}
                onChange={(e) => setAutoStraighten(e.target.checked)}
                className="rounded text-blue-600 w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Print & Paper Preferences */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Printer className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Default Printing Standards
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Default Paper Size</label>
              <div className="grid grid-cols-3 gap-2">
                {['A4', 'Letter', 'A5'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setDefaultPaper(sz)}
                    className={`p-2.5 rounded-xl border text-center font-bold cursor-pointer ${
                      defaultPaper === sz
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    {sz} (210 × 297 mm)
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Default Negative Marking Scheme</label>
              <select
                value={markingScheme}
                onChange={(e) => setMarkingScheme(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
              >
                <option value="neet">NEET Pattern (+4 correct, -1 negative)</option>
                <option value="jee">JEE Main Pattern (+4 correct, -1 negative)</option>
                <option value="ssc">SSC / Banking (+2 correct, -0.5 negative)</option>
                <option value="none">No Negative Marking (+1 correct, 0 negative)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Storage Management */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Trash2 className="w-5 h-5 text-rose-600" />
            <h3 className="font-extrabold text-base text-slate-900">
              Data & Local Storage
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-800 block">Clear Local Cached Sheets</span>
              <span className="text-slate-500">Reset saved sheets and practice tests from browser storage</span>
            </div>

            <button
              type="button"
              onClick={handleClearCache}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl cursor-pointer"
            >
              Clear Storage
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>

      </div>

    </div>
  );
};
