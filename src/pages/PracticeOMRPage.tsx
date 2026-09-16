import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  Sparkles,
  Trophy,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { DEFAULT_OMR_CONFIG } from '../data/templates';
import { OMRConfig } from '../types/omr';

interface PracticeOMRPageProps {
  onCompleteTest: (markedAnswers: Record<number, string>) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PracticeOMRPage: React.FC<PracticeOMRPageProps> = ({
  onCompleteTest,
  showToast,
}) => {
  const [markedAnswers, setMarkedAnswers] = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(45 * 60); // 45 mins
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('NEET Full Length Test');
  const [zoomScale, setZoomScale] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 0.44 : 0.85
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setZoomScale((prev) => (prev > 0.65 ? 0.44 : prev));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 50 questions test config
  const practiceConfig: OMRConfig = {
    ...DEFAULT_OMR_CONFIG,
    questionsCount: 50,
    layoutColumns: '3',
    header: {
      ...DEFAULT_OMR_CONFIG.header,
      schoolName: 'OMRWALLAH MOCK TESTING PORTAL',
      examName: 'ALL INDIA SPEED PRACTICE TEST #03',
      tagline: 'Simulate the real exam hall experience',
    },
  };

  useEffect(() => {
    let interval: any;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBubbleClick = (qNum: number, option: string) => {
    setMarkedAnswers((prev) => {
      const next = { ...prev };
      if (next[qNum] === option) {
        delete next[qNum];
      } else {
        next[qNum] = option;
      }
      return next;
    });
  };

  const attemptedCount = Object.keys(markedAnswers).length;

  const handleSubmit = () => {
    if (attemptedCount === 0) {
      showToast('Please mark at least one bubble before submitting.', 'error');
      return;
    }

    if (window.confirm(`You have attempted ${attemptedCount} of 50 questions. Submit now for evaluation?`)) {
      setTimerRunning(false);
      showToast('Test submitted! Evaluating your physical bubble sheet...', 'success');
      onCompleteTest(markedAnswers);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all marked bubbles?')) {
      setMarkedAnswers({});
      showToast('All answers cleared', 'info');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden">
      
      {/* Top Test Control Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-2xs z-20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-slate-900">
              Interactive Practice Mode
            </h1>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Live Timer
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Click bubbles directly on sheet or use keyboard to simulate real test pressure
          </p>
        </div>

        {/* Timer & Attempt Tracker */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.max(0.35, prev - 0.1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-slate-700 px-1 min-w-[38px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.min(1.2, prev + 0.1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 text-white rounded-xl font-mono text-xs sm:text-sm font-black shadow-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          {/* Attempt counter pill */}
          <div className="px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold">
            <span className="hidden sm:inline">Attempted: </span>
            <span className="font-black text-blue-600">{attemptedCount} / 50</span>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
            title="Clear all bubbles"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Main Canvas with Interactive OMR Sheet */}
      <div className="flex-1 overflow-auto p-2 sm:p-8 flex justify-center items-start">
        <div className="bg-white rounded-xl shadow-xl border border-slate-300 p-1 sm:p-4 max-w-full overflow-x-auto">
          <OMRSheetRenderer
            config={practiceConfig}
            interactive={true}
            markedAnswers={markedAnswers}
            onAnswerChange={handleBubbleClick}
            scale={zoomScale}
          />
        </div>
      </div>

    </div>
  );
};
