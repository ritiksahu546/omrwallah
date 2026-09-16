import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Minimize2,
  Bookmark,
  BookmarkCheck,
  HelpCircle,
  Pause,
  Play,
  Grid,
  ChevronLeft,
  ChevronRight,
  Eye,
  Keyboard,
  X,
  FileCheck2,
} from 'lucide-react';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { DEFAULT_OMR_CONFIG } from '../data/templates';
import { OMRConfig } from '../types/omr';

interface PracticeOMRPageProps {
  onCompleteTest: (markedAnswers: Record<number, string>) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const PracticeOMRPage: React.FC<PracticeOMRPageProps> = ({
  onCompleteTest,
  showToast,
  isZenMode = false,
  onToggleZenMode,
}) => {
  const [markedAnswers, setMarkedAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [currentActiveQ, setCurrentActiveQ] = useState<number>(1);
  const [secondsLeft, setSecondsLeft] = useState<number>(45 * 60); // 45 mins
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [paperTheme, setPaperTheme] = useState<'paper' | 'dark'>('paper');

  const [zoomScale, setZoomScale] = useState<number>(() =>
    typeof window !== 'undefined' && window.innerWidth < 640 ? 0.44 : 0.85
  );

  const containerRef = useRef<HTMLDivElement>(null);

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

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && timerRunning) {
      setTimerRunning(false);
      showToast('Time is up! Submitting test automatically...', 'info');
      onCompleteTest(markedAnswers);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft, markedAnswers, onCompleteTest, showToast]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Bubble click handler
  const handleBubbleClick = (qNum: number, option: string) => {
    setCurrentActiveQ(qNum);
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

  // Toggle mark for review
  const toggleReviewFlag = (qNum: number) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [qNum]: !prev[qNum],
    }));
    showToast(
      markedForReview[qNum] ? `Question ${qNum} unflagged` : `Question ${qNum} marked for review`,
      'info'
    );
  };

  // Keyboard shortcut listener for fast bubbling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      const key = e.key.toUpperCase();
      const optionMap: Record<string, string> = {
        'A': 'A', '1': 'A',
        'B': 'B', '2': 'B',
        'C': 'C', '3': 'C',
        'D': 'D', '4': 'D',
      };

      if (optionMap[key]) {
        handleBubbleClick(currentActiveQ, optionMap[key]);
        if (currentActiveQ < 50) {
          setCurrentActiveQ((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentActiveQ((prev) => Math.min(50, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentActiveQ((prev) => Math.max(1, prev - 1));
      } else if (key === 'R') {
        toggleReviewFlag(currentActiveQ);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentActiveQ, markedForReview]);

  const attemptedCount = Object.keys(markedAnswers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = 50 - attemptedCount;

  const handleSubmit = () => {
    if (attemptedCount === 0) {
      showToast('Please mark at least one bubble before submitting.', 'error');
      return;
    }

    const confirmMsg = reviewCount > 0
      ? `You have attempted ${attemptedCount}/50 questions (${reviewCount} marked for review). Submit now?`
      : `You have attempted ${attemptedCount} of 50 questions. Submit now for evaluation?`;

    if (window.confirm(confirmMsg)) {
      setTimerRunning(false);
      showToast('Test submitted! Evaluating your physical bubble sheet...', 'success');
      onCompleteTest(markedAnswers);
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all marked bubbles? This action cannot be undone.')) {
      setMarkedAnswers({});
      setMarkedForReview({});
      showToast('All answers cleared', 'info');
    }
  };

  return (
    <div className={`flex flex-col h-full w-full ${paperTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} overflow-hidden relative select-none`}>
      
      {/* Top Test Control Bar */}
      <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs z-20 shrink-0">
        
        {/* Left: Test Info & Question Indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">
                Interactive Practice
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                Live Test
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
              <span>Active Q: <strong className="text-blue-600 font-black">#{currentActiveQ}</strong></span>
              <span>•</span>
              <button
                type="button"
                onClick={() => toggleReviewFlag(currentActiveQ)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-purple-600 cursor-pointer"
              >
                {markedForReview[currentActiveQ] ? (
                  <BookmarkCheck className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{markedForReview[currentActiveQ] ? 'Flagged' : 'Flag Q'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center: Live Timer with Pulse */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-black shadow-xs transition-colors ${
              secondsLeft < 300
                ? 'bg-rose-600 text-white animate-pulse'
                : secondsLeft < 600
                ? 'bg-amber-500 text-white'
                : 'bg-slate-900 text-white'
            }`}
            title="Exam Time Remaining"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatTimer(secondsLeft)}</span>
            <button
              type="button"
              onClick={() => setTimerRunning((p) => !p)}
              className="ml-1 p-0.5 hover:bg-white/20 rounded cursor-pointer"
              title={timerRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>

          {/* Attempt counter pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold">
            <span>Attempted:</span>
            <span className="font-black text-blue-600">{attemptedCount}/50</span>
            {reviewCount > 0 && (
              <span className="ml-1 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full font-bold">
                {reviewCount} flagged
              </span>
            )}
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Question Palette Drawer Button */}
          <button
            type="button"
            onClick={() => setShowPalette((p) => !p)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showPalette
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle Question Palette"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Palette</span>
            <span className="text-[10px] bg-blue-500/20 px-1 rounded font-mono">
              {attemptedCount}/50
            </span>
          </button>

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
            <button
              type="button"
              onClick={() => setZoomScale(0.85)}
              className="text-[11px] font-mono font-bold text-slate-700 px-1.5 hover:text-blue-600 cursor-pointer"
              title="Reset Zoom to 85%"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.min(1.25, prev + 0.1))}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zen / Fullscreen Mode Toggle */}
          {onToggleZenMode && (
            <button
              type="button"
              onClick={onToggleZenMode}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isZenMode
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={isZenMode ? 'Exit Zen Mode (Show Nav)' : 'Zen Mode (Distraction Free)'}
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {/* Keyboard Shortcuts Guide */}
          <button
            type="button"
            onClick={() => setShowShortcutsModal(true)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl cursor-pointer"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            title="Clear all bubbles"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        
        {/* Canvas Area with Interactive OMR Sheet */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto p-2 sm:p-6 flex justify-center items-start min-w-0"
        >
          <div className={`transition-all duration-300 ${
            paperTheme === 'paper'
              ? 'bg-white rounded-xl shadow-2xl border border-slate-300 p-1 sm:p-4'
              : 'bg-slate-900 rounded-xl shadow-2xl border border-slate-700 p-1 sm:p-4'
          } max-w-full overflow-x-auto`}>
            <OMRSheetRenderer
              config={practiceConfig}
              interactive={true}
              markedAnswers={markedAnswers}
              onAnswerChange={handleBubbleClick}
              scale={zoomScale}
            />
          </div>
        </div>

        {/* Question Palette Sidebar (Right Panel) */}
        {showPalette && (
          <aside className="w-72 sm:w-80 bg-white border-l border-slate-200 shadow-xl flex flex-col z-30 shrink-0 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Question Palette</h3>
                <p className="text-xs text-slate-500">50 Questions • NEET Pattern</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPalette(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Legend */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-1.5">
                <div className="font-black text-emerald-700">{attemptedCount}</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Answered</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-1.5">
                <div className="font-black text-purple-700">{reviewCount}</div>
                <div className="text-[10px] text-purple-600 font-semibold">Flagged</div>
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-1.5">
                <div className="font-black text-slate-700">{unattemptedCount}</div>
                <div className="text-[10px] text-slate-500 font-semibold">Left</div>
              </div>
            </div>

            {/* Questions Grid 1 to 50 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 50 }).map((_, idx) => {
                  const qNum = idx + 1;
                  const isAnswered = Boolean(markedAnswers[qNum]);
                  const isFlagged = Boolean(markedForReview[qNum]);
                  const isActive = currentActiveQ === qNum;

                  return (
                    <button
                      key={qNum}
                      type="button"
                      onClick={() => {
                        setCurrentActiveQ(qNum);
                      }}
                      className={`h-10 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        isActive
                          ? 'ring-2 ring-blue-600 ring-offset-2'
                          : ''
                      } ${
                        isFlagged
                          ? 'bg-purple-600 text-white shadow-xs'
                          : isAnswered
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <span>{qNum}</span>
                      {isAnswered && (
                        <span className="text-[9px] font-black -mt-0.5 opacity-90">
                          {markedAnswers[qNum]}
                        </span>
                      )}
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions in Palette */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Selected: <strong>Q.{currentActiveQ}</strong></span>
                <button
                  type="button"
                  onClick={() => toggleReviewFlag(currentActiveQ)}
                  className="font-bold text-purple-600 hover:underline cursor-pointer"
                >
                  {markedForReview[currentActiveQ] ? 'Remove Flag' : 'Flag This Q'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </aside>
        )}

      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcutsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900">Speed Exam Keyboard Controls</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowShortcutsModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Use these shortcuts to simulate rapid exam bubbling without touching the mouse:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-medium text-slate-700">Mark Bubble (A, B, C, D)</span>
                <div className="flex gap-1 font-mono font-bold text-slate-800">
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">A</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">B</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">C</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">D</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-medium text-slate-700">Alternative Options (1, 2, 3, 4)</span>
                <div className="flex gap-1 font-mono font-bold text-slate-800">
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">1</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">2</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">3</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">4</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-medium text-slate-700">Next / Previous Question</span>
                <div className="flex gap-1 font-mono font-bold text-slate-800">
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">↑</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">↓</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">←</kbd>
                  <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs">→</kbd>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-medium text-slate-700">Flag / Review Question</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded shadow-2xs font-mono font-bold">R</kbd>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowShortcutsModal(false)}
              className="w-full mt-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 cursor-pointer"
            >
              Got It, Continue Test
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
