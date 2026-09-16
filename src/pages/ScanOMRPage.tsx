import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ScanLine,
  Lightbulb,
  Maximize2,
  RotateCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { DEFAULT_OMR_CONFIG } from '../data/templates';

interface ScanOMRPageProps {
  onScanComplete: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ScanOMRPage: React.FC<ScanOMRPageProps> = ({
  onScanComplete,
  showToast,
}) => {
  const [scanMode, setScanMode] = useState<'upload' | 'camera'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Position sheet within brackets');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tips = [
    { title: 'Use good lighting', desc: 'Even daylight or direct lamp prevents dark shadows.' },
    { title: 'Place on a flat surface', desc: 'Avoid folds, wrinkles, or curled paper corners.' },
    { title: 'Make sure all 4 corners are visible', desc: 'Corner black registration marks must be in frame.' },
    { title: 'Keep the sheet straight', desc: 'Hold camera directly perpendicular to the page.' },
    { title: 'Avoid shadows', desc: 'Keep phone angle steady away from hand shadows.' },
    { title: 'Use high resolution', desc: 'Clean focus ensures 99.8% bubble recognition.' },
  ];

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(15);
    setScanStatusText('Detecting 4 corner registration marks...');

    setTimeout(() => {
      setScanProgress(45);
      setScanStatusText('Straightening perspective & grid alignment...');
    }, 700);

    setTimeout(() => {
      setScanProgress(75);
      setScanStatusText('Scanning 50 filled bubbles against Answer Key...');
    }, 1400);

    setTimeout(() => {
      setScanProgress(100);
      setScanStatusText('Evaluation Complete! Generating scorecard...');
    }, 2100);

    setTimeout(() => {
      setIsScanning(false);
      showToast('OMR Sheet scanned and evaluated with 98.4% confidence!', 'success');
      onScanComplete();
    }, 2600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCapturedImage(url);
      showToast('Image uploaded. Ready to scan!', 'info');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="text-center sm:text-left">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Scan Your OMR Sheet
          </h1>
          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Beta AI Scanner
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Upload a clear photograph or use your phone/web camera to evaluate in seconds
        </p>
      </div>

      {/* Mode Switcher Buttons (matching reference image #5) */}
      <div className="flex justify-center sm:justify-start gap-2">
        <button
          type="button"
          onClick={() => setScanMode('upload')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${
            scanMode === 'upload'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>

        <button
          type="button"
          onClick={() => setScanMode('camera')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${
            scanMode === 'camera'
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Use Camera</span>
        </button>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Viewport Frame (matching reference image #5) */}
        <div className="lg:col-span-8">
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 aspect-[4/3] flex items-center justify-center">
            
            {/* Viewport Canvas or Image */}
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured OMR"
                className="w-full h-full object-contain"
              />
            ) : (
              /* Simulated high-fidelity live camera viewfinder */
              <div className="relative w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
                
                {/* Scaled realistic OMR sheet representation inside viewfinder */}
                <div className="w-[320px] h-[440px] bg-white rounded-sm shadow-2xl overflow-hidden opacity-90 scale-[0.75] sm:scale-[0.85] border border-slate-400 pointer-events-none transform -rotate-1">
                  <OMRSheetRenderer
                    config={{
                      ...DEFAULT_OMR_CONFIG,
                      questionsCount: 40,
                      header: {
                        ...DEFAULT_OMR_CONFIG.header,
                        schoolName: 'OMRWallah Demo Institute',
                        tagline: 'Know Today, Grow Tomorrow',
                      },
                    }}
                    interactive={false}
                  />
                </div>

                {/* Reticle Scanner Line Animation when scanning */}
                {isScanning && (
                  <div className="absolute inset-x-8 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-bounce" />
                )}
              </div>
            )}

            {/* Corner Alignment Reticle Guides (Cyan brackets at 4 corners from reference #5) */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg pointer-events-none" />
            <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg pointer-events-none" />
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg pointer-events-none" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-cyan-400 rounded-br-lg pointer-events-none" />

            {/* Status bar inside camera viewport */}
            <div className="absolute bottom-4 inset-x-8 bg-slate-900/85 backdrop-blur-md border border-slate-700 rounded-2xl py-2 px-4 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="font-semibold truncate">{scanStatusText}</span>
              </div>
              <span className="font-mono text-cyan-400 font-bold">
                {scanProgress > 0 ? `${scanProgress}%` : 'READY'}
              </span>
            </div>

          </div>

          {/* Action Bar Below Camera */}
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              disabled={isScanning}
              onClick={handleStartScan}
              className="w-full sm:flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ScanLine className="w-5 h-5" />
              <span>{isScanning ? 'Analyzing Sheet...' : 'Capture & Scan'}</span>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl border border-slate-300 transition-colors cursor-pointer text-center"
            >
              Or Upload from Gallery
            </button>
          </div>
        </div>

        {/* Right Sidebar: Scanning Tips (matching reference image #5) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900">
              Tips for Better Scanning
            </h3>
          </div>

          <div className="space-y-3.5">
            {tips.map((t, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">{t.title}</h4>
                  <p className="text-slate-500 leading-snug">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zero Guesswork Guarantee:</strong> If faint bubbles or double markings are detected, the system will flag the question for manual teacher verification instead of guessing.
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
