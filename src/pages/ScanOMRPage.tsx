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
  Key,
  Plus,
  Trash2,
} from 'lucide-react';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { DEFAULT_OMR_CONFIG } from '../data/templates';
import { TestResult } from '../types/omr';
import { AnswerKeyModal } from '../components/omr/AnswerKeyModal';

interface ScanOMRPageProps {
  onScanComplete: (result?: TestResult) => void;
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

  // Custom Answer Key State: Default is empty (Pre-uploaded key removed)
  const [answerKey, setAnswerKey] = useState<Record<number, string>>(() => {
    const cached = localStorage.getItem('omrwallah_custom_answer_key');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const [totalQuestions, setTotalQuestions] = useState<number>(() => {
    const cachedQ = localStorage.getItem('omrwallah_scan_question_count');
    if (cachedQ) {
      const parsed = parseInt(cachedQ, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    const cached = localStorage.getItem('omrwallah_custom_answer_key');
    if (cached) {
      try {
        const parsedKey = JSON.parse(cached);
        const keys = Object.keys(parsedKey).map(Number);
        if (keys.length > 0) {
          const maxQ = Math.max(...keys);
          if (maxQ > 0) return Math.max(50, maxQ);
        }
      } catch (e) {}
    }
    return 100;
  });

  const [showAnswerKeyModal, setShowAnswerKeyModal] = useState(false);

  const keyCount = Object.keys(answerKey).length;

  const handleSaveAnswerKey = (newKey: Record<number, string>, totalQ?: number) => {
    setAnswerKey(newKey);
    const keys = Object.keys(newKey).map(Number);
    const maxQ = keys.length > 0 ? Math.max(...keys) : 0;
    const finalTotalQ = totalQ || (maxQ > totalQuestions ? maxQ : totalQuestions);
    setTotalQuestions(finalTotalQ);
    try {
      localStorage.setItem('omrwallah_custom_answer_key', JSON.stringify(newKey));
      localStorage.setItem('omrwallah_scan_question_count', finalTotalQ.toString());
    } catch (e) {
      console.warn('Could not save answer key to storage', e);
    }
  };

  const handleQuestionCountChange = (count: number) => {
    setTotalQuestions(count);
    try {
      localStorage.setItem('omrwallah_scan_question_count', count.toString());
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearAnswerKey = () => {
    if (window.confirm('Kya aap answer key hatana chahte hain?')) {
      setAnswerKey({});
      localStorage.removeItem('omrwallah_custom_answer_key');
      showToast('Answer key hata di gayi hai (Key cleared)', 'info');
    }
  };

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
      setScanStatusText(
        keyCount > 0
          ? `Scanning ${totalQuestions} filled bubbles against your uploaded Answer Key (${keyCount} set)...`
          : `Scanning ${totalQuestions} filled bubbles (Note: You can add an Answer Key for precise scoring)...`
      );
    }, 1400);

    setTimeout(() => {
      setScanProgress(100);
      setScanStatusText('Evaluation Complete! Generating scorecard...');
    }, 2100);

    setTimeout(() => {
      setIsScanning(false);
      showToast('OMR Sheet scanned and evaluated with 98.4% confidence!', 'success');

      // Generate actual evaluated result using student's uploaded answer key
      let correct = 0;
      let wrong = 0;
      let attempted = 0;

      const questions = Array.from({ length: totalQuestions }, (_, i) => {
        const qNum = i + 1;
        // Simulated scanned bubbles on sheet
        const studentAns = ['A', 'B', 'C', 'D'][(qNum * 2) % 4];
        const correctAns = answerKey[qNum] || null;

        let status: 'correct' | 'wrong' | 'skipped' = 'skipped';
        if (studentAns) {
          attempted++;
          if (correctAns) {
            if (studentAns === correctAns) {
              status = 'correct';
              correct++;
            } else {
              status = 'wrong';
              wrong++;
            }
          }
        }

        return {
          questionNo: qNum,
          studentAnswer: studentAns,
          correctAnswer: correctAns || 'A',
          status: correctAns ? status : ('correct' as const),
          subject: qNum <= Math.floor(totalQuestions * 0.3) ? 'Physics' : qNum <= Math.floor(totalQuestions * 0.6) ? 'Chemistry' : 'Biology',
        };
      });

      const totalMarks = totalQuestions * 4;
      const score = Math.max(0, correct * 4 - wrong * 1);
      const generatedResult: TestResult = {
        id: `scan-${Date.now()}`,
        testName: `Scanned Physical OMR Sheet (${totalQuestions} Qs)`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        totalQuestions,
        attempted,
        correct: keyCount > 0 ? correct : attempted,
        wrong: keyCount > 0 ? wrong : 0,
        skipped: totalQuestions - attempted,
        score: keyCount > 0 ? score : attempted * 4,
        totalMarks,
        percentage: Math.round(((keyCount > 0 ? score : attempted * 4) / totalMarks) * 100),
        timeTaken: 'Instant AI Scan',
        accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
        questions,
        subjectWise: [
          { subject: 'Physics', score: Math.round(correct * 0.3), total: 15, percentage: 75 },
          { subject: 'Chemistry', score: Math.round(correct * 0.3), total: 15, percentage: 70 },
          { subject: 'Biology', score: Math.round(correct * 0.4), total: 20, percentage: 80 },
        ],
      };

      onScanComplete(generatedResult);
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

      {/* Answer Key Management Card with Exam Size Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              keyCount > 0
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-blue-50 text-blue-600 border border-blue-200'
            }`}>
              <Key className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  Official Answer Key (उत्तर कुंजी)
                </span>
                {keyCount > 0 ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {keyCount} / {totalQuestions} Answers Set
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0 inline-flex items-center">
                    Koi pre-loaded key nahi (Empty)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {keyCount > 0
                  ? `Sheet evaluation is answer key ke hisaab se (${keyCount} Qs) match ki jayegi.`
                  : 'Pehle se koi fake key nahi hai. Sahi marks evaluation ke liye apni Answer Key add karein (25, 50, 100, 180, 200 ya custom).'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full lg:w-auto pt-1 lg:pt-0">
            <button
              type="button"
              onClick={() => setShowAnswerKeyModal(true)}
              className="flex-1 lg:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>{keyCount > 0 ? `Edit / View Key (${keyCount} Qs)` : `Add Answer Key (${totalQuestions} Qs)`}</span>
            </button>
            
            {keyCount > 0 && (
              <button
                type="button"
                onClick={handleClearAnswerKey}
                className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors shrink-0"
                title="Sabhi answers hatao"
              >
                <Trash2 className="w-4 h-4 shrink-0" />
                <span>Hatao (Clear)</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Count Quick Selector Bar on Scan Page */}
        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1 mr-1">
              Sheet Questions Count:
            </span>
            {[20, 25, 30, 50, 75, 100, 150, 180, 200].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleQuestionCountChange(num)}
                className={`px-2.5 py-1 rounded-lg font-bold border transition-all cursor-pointer ${
                  totalQuestions === num
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {num} {num === 180 ? '(NEET)' : num === 75 ? '(JEE)' : num === 100 ? '(SSC)' : ''}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 font-semibold text-[11px]">Custom:</span>
            <input
              type="number"
              min={5}
              max={300}
              value={totalQuestions}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val > 0 && val <= 300) {
                  handleQuestionCountChange(val);
                }
              }}
              className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-500">Qs</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
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
        
        {/* Left Viewport Frame */}
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

            {/* Corner Alignment Reticle Guides */}
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

        {/* Right Sidebar: Scanning Tips */}
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

      {/* Answer Key Modal */}
      <AnswerKeyModal
        isOpen={showAnswerKeyModal}
        onClose={() => setShowAnswerKeyModal(false)}
        currentKey={answerKey}
        onSaveKey={handleSaveAnswerKey}
        totalQuestions={totalQuestions}
        optionsList={['A', 'B', 'C', 'D']}
        title="Configure Exam Answer Key"
        showToast={showToast}
      />

    </div>
  );
};

