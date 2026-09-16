import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Clock,
  RotateCcw,
  Send,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Bookmark,
  BookmarkCheck,
  Pause,
  Play,
  Grid,
  Keyboard,
  X,
  Key,
  ChevronDown,
  Layers,
  Sparkles,
  Sliders,
  Check,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ArrowLeft,
} from 'lucide-react';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { DEFAULT_OMR_CONFIG } from '../data/templates';
import { OMRConfig, OMRSectionConfig, QuestionLayout } from '../types/omr';
import { AnswerKeyModal } from '../components/omr/AnswerKeyModal';

export interface ExamPreset {
  id: string;
  name: string;
  badge: string;
  questionsCount: number;
  durationMinutes: number;
  description: string;
  sections?: OMRSectionConfig[];
}

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'neet-180',
    name: 'NEET UG Full Mock',
    badge: '180 Qs • 3 Hrs',
    questionsCount: 180,
    durationMinutes: 180,
    description: 'Physics (1-45), Chemistry (46-90), Biology (91-180) • 720 Marks',
    sections: [
      { id: 'phy', name: 'Physics', startQ: 1, endQ: 45, startQuestion: 1, endQuestion: 45 },
      { id: 'chem', name: 'Chemistry', startQ: 46, endQ: 90, startQuestion: 46, endQuestion: 90 },
      { id: 'bio', name: 'Biology', startQ: 91, endQ: 180, startQuestion: 91, endQuestion: 180 },
    ],
  },
  {
    id: 'neet-200',
    name: 'NEET UG 200 Questions (Section A+B)',
    badge: '200 Qs • 200 Mins',
    questionsCount: 200,
    durationMinutes: 200,
    description: 'Physics (1-50), Chemistry (51-100), Botany (101-150), Zoology (151-200)',
    sections: [
      { id: 'phy', name: 'Physics', startQ: 1, endQ: 50, startQuestion: 1, endQuestion: 50 },
      { id: 'chem', name: 'Chemistry', startQ: 51, endQ: 100, startQuestion: 51, endQuestion: 100 },
      { id: 'bot', name: 'Botany', startQ: 101, endQ: 150, startQuestion: 101, endQuestion: 150 },
      { id: 'zoo', name: 'Zoology', startQ: 151, endQ: 200, startQuestion: 151, endQuestion: 200 },
    ],
  },
  {
    id: 'upsc-ssc-100',
    name: 'UPSC / SSC / State PSC Full Paper',
    badge: '100 Qs • 2 Hrs',
    questionsCount: 100,
    durationMinutes: 120,
    description: 'GS, Reasoning, Quantitative Aptitude & English • 4 Columns',
  },
  {
    id: 'police-banking-150',
    name: 'Police SI / Banking / Defence / CET',
    badge: '150 Qs • 2.5 Hrs',
    questionsCount: 150,
    durationMinutes: 150,
    description: 'Standard 150 questions competitive examination layout',
  },
  {
    id: 'jee-90',
    name: 'JEE Main Pattern',
    badge: '90 Qs • 3 Hrs',
    questionsCount: 90,
    durationMinutes: 180,
    description: 'Physics (1-30), Chemistry (31-60), Mathematics (61-90) • 360 Marks',
    sections: [
      { id: 'phy', name: 'Physics', startQ: 1, endQ: 30, startQuestion: 1, endQuestion: 30 },
      { id: 'chem', name: 'Chemistry', startQ: 31, endQ: 60, startQuestion: 31, endQuestion: 60 },
      { id: 'math', name: 'Mathematics', startQ: 61, endQ: 90, startQuestion: 61, endQuestion: 90 },
    ],
  },
  {
    id: 'standard-50',
    name: 'Standard Practice Mock Drill',
    badge: '50 Qs • 45 Mins',
    questionsCount: 50,
    durationMinutes: 45,
    description: 'Standard 50 questions speed drill for daily evaluation',
  },
  {
    id: 'speed-20',
    name: 'Rapid Fire Sprint',
    badge: '20 Qs • 15 Mins',
    questionsCount: 20,
    durationMinutes: 15,
    description: 'Quick 20 questions accuracy & reflex test',
  },
];

interface PracticeOMRPageProps {
  onCompleteTest: (
    markedAnswers: Record<number, string>,
    customKey?: Record<number, string>,
    testMeta?: {
      totalQuestions?: number;
      testName?: string;
      timeTaken?: string;
      sections?: { name: string; startQ: number; endQ: number }[];
    }
  ) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
  onNavigate?: (route: string) => void;
}

export const PracticeOMRPage: React.FC<PracticeOMRPageProps> = ({
  onCompleteTest,
  showToast,
  isZenMode = false,
  onToggleZenMode,
  onNavigate,
}) => {
  // Question count & Exam preset state
  const [questionsCount, setQuestionsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('omrwallah_practice_q_count');
      return saved ? parseInt(saved, 10) || 50 : 50;
    } catch {
      return 50;
    }
  });

  const [activePresetId, setActivePresetId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('omrwallah_practice_preset_id');
      return saved || 'standard-50';
    } catch {
      return 'standard-50';
    }
  });

  const [examName, setExamName] = useState<string>('Standard Practice Mock Drill');
  const [totalDurationSeconds, setTotalDurationSeconds] = useState<number>(45 * 60);

  const [markedAnswers, setMarkedAnswers] = useState<Record<number, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
  const [customAnswerKey, setCustomAnswerKey] = useState<Record<number, string>>(() => {
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

  const [showAnswerKeyModal, setShowAnswerKeyModal] = useState(false);
  const [showExamSelectorModal, setShowExamSelectorModal] = useState(false);
  const [currentActiveQ, setCurrentActiveQ] = useState<number>(1);
  const [secondsLeft, setSecondsLeft] = useState<number>(45 * 60);
  const [timerRunning, setTimerRunning] = useState<boolean>(true);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [paperTheme, setPaperTheme] = useState<'paper' | 'dark'>('paper');
  const [paletteFilter, setPaletteFilter] = useState<'all' | 'answered' | 'flagged' | 'unanswered'>('all');
  const [customQInput, setCustomQInput] = useState<string>('100');
  const [customMinInput, setCustomMinInput] = useState<string>('90');

  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit scale calculation
  const getAutoFitScale = useCallback(() => {
    if (typeof window === 'undefined') return 0.85;
    const clientWidth = containerRef.current?.clientWidth || window.innerWidth;
    // Standard A4 width in 96 DPI CSS pixels is 793.7px
    const a4PxWidth = 794;

    if (clientWidth < 640) {
      // Mobile screen: fit nicely within screen width with margins
      const available = Math.max(260, clientWidth - 16);
      const fit = available / a4PxWidth;
      return Math.min(1, Math.max(0.35, parseFloat(fit.toFixed(2))));
    } else if (clientWidth < 1024) {
      const available = clientWidth - 32;
      const fit = available / a4PxWidth;
      return Math.min(0.9, Math.max(0.5, parseFloat(fit.toFixed(2))));
    }
    return 0.85;
  }, []);

  const [zoomScale, setZoomScale] = useState<number>(() => getAutoFitScale());

  // Auto-adjust scale on mount and on window resize
  useEffect(() => {
    // Initial auto-fit once DOM mounted
    const timer = setTimeout(() => {
      setZoomScale(getAutoFitScale());
    }, 50);

    const handleResize = () => {
      if (window.innerWidth < 640) {
        setZoomScale(getAutoFitScale());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [getAutoFitScale]);

  // Derive OMR sheet configuration dynamically based on questionsCount & active preset
  const practiceConfig: OMRConfig = useMemo(() => {
    let cols: QuestionLayout = 'auto';
    let density: 'standard' | 'compact' | 'spacious' = 'standard';

    if (questionsCount <= 30) {
      cols = '2';
      density = 'spacious';
    } else if (questionsCount <= 60) {
      cols = '3';
      density = 'standard';
    } else if (questionsCount <= 100) {
      cols = '4';
      density = 'standard';
    } else {
      cols = '4';
      density = 'compact';
    }

    // Match preset sections if applicable
    let sections: OMRSectionConfig[] | undefined = undefined;
    const currentPreset = EXAM_PRESETS.find((p) => p.id === activePresetId);
    if (currentPreset?.sections && currentPreset.questionsCount === questionsCount) {
      sections = currentPreset.sections;
    } else if (questionsCount === 180) {
      sections = [
        { id: 'phy', name: 'Physics', startQ: 1, endQ: 45, startQuestion: 1, endQuestion: 45 },
        { id: 'chem', name: 'Chemistry', startQ: 46, endQ: 90, startQuestion: 46, endQuestion: 90 },
        { id: 'bio', name: 'Biology', startQ: 91, endQ: 180, startQuestion: 91, endQuestion: 180 },
      ];
    } else if (questionsCount === 200) {
      sections = [
        { id: 'phy', name: 'Physics', startQ: 1, endQ: 50, startQuestion: 1, endQuestion: 50 },
        { id: 'chem', name: 'Chemistry', startQ: 51, endQ: 100, startQuestion: 51, endQuestion: 100 },
        { id: 'bot', name: 'Botany', startQ: 101, endQ: 150, startQuestion: 101, endQuestion: 150 },
        { id: 'zoo', name: 'Zoology', startQ: 151, endQ: 200, startQuestion: 151, endQuestion: 200 },
      ];
    } else if (questionsCount === 90) {
      sections = [
        { id: 'phy', name: 'Physics', startQ: 1, endQ: 30, startQuestion: 1, endQuestion: 30 },
        { id: 'chem', name: 'Chemistry', startQ: 31, endQ: 60, startQuestion: 31, endQuestion: 60 },
        { id: 'math', name: 'Mathematics', startQ: 61, endQ: 90, startQuestion: 61, endQuestion: 90 },
      ];
    }

    return {
      ...DEFAULT_OMR_CONFIG,
      questionsCount,
      layoutColumns: cols,
      gridDensity: density,
      enableSections: Boolean(sections && sections.length > 0),
      sections,
      header: {
        ...DEFAULT_OMR_CONFIG.header,
        schoolName: 'OMRWALLAH SPEED MOCK PORTAL',
        examName: `${examName.toUpperCase()} (${questionsCount} Qs)`,
        tagline: 'Simulate the Real Exam Hall Experience',
        timeDuration: `${Math.round(totalDurationSeconds / 60)} Mins`,
      },
    };
  }, [questionsCount, activePresetId, examName, totalDurationSeconds]);

  // Apply exam preset
  const handleSelectPreset = (preset: ExamPreset) => {
    const hasMarked = Object.keys(markedAnswers).length > 0;
    if (hasMarked && !window.confirm('Preset badalne par aapke abhi ke bhare hue bubbles reset ho jayenge. Kya aap aage badhna chahte hain?')) {
      return;
    }

    setQuestionsCount(preset.questionsCount);
    setActivePresetId(preset.id);
    setExamName(preset.name);
    const newSecs = preset.durationMinutes * 60;
    setTotalDurationSeconds(newSecs);
    setSecondsLeft(newSecs);
    setTimerRunning(true);
    setMarkedAnswers({});
    setMarkedForReview({});
    setCurrentActiveQ(1);
    setShowExamSelectorModal(false);

    try {
      localStorage.setItem('omrwallah_practice_q_count', String(preset.questionsCount));
      localStorage.setItem('omrwallah_practice_preset_id', preset.id);
    } catch (e) {
      console.warn(e);
    }

    showToast(`${preset.name} (${preset.questionsCount} Questions) configured!`, 'success');
  };

  // Apply custom question count
  const handleApplyCustomQuestions = () => {
    const qNum = parseInt(customQInput, 10);
    const mNum = parseInt(customMinInput, 10) || 60;

    if (isNaN(qNum) || qNum < 5 || qNum > 200) {
      showToast('Kripya 5 se 200 ke beech question count dalein.', 'error');
      return;
    }

    const hasMarked = Object.keys(markedAnswers).length > 0;
    if (hasMarked && !window.confirm('Question count badalne par aapke abhi ke bhare hue bubbles reset ho jayenge. Aage badhein?')) {
      return;
    }

    setQuestionsCount(qNum);
    setActivePresetId('custom');
    setExamName(`Custom Mock Test (${qNum} Qs)`);
    const newSecs = mNum * 60;
    setTotalDurationSeconds(newSecs);
    setSecondsLeft(newSecs);
    setTimerRunning(true);
    setMarkedAnswers({});
    setMarkedForReview({});
    setCurrentActiveQ(1);
    setShowExamSelectorModal(false);

    try {
      localStorage.setItem('omrwallah_practice_q_count', String(qNum));
      localStorage.setItem('omrwallah_practice_preset_id', 'custom');
    } catch (e) {
      console.warn(e);
    }

    showToast(`${qNum} Questions test configured (${mNum} Mins)!`, 'success');
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
      onCompleteTest(markedAnswers, customAnswerKey, {
        totalQuestions: questionsCount,
        testName: examName,
        timeTaken: formatTimer(totalDurationSeconds),
        sections: practiceConfig.sections?.map((s) => ({
          name: s.name,
          startQ: s.startQuestion || (s as any).startQ,
          endQ: s.endQuestion || (s as any).endQ,
        })),
      });
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsLeft, markedAnswers, onCompleteTest, showToast, questionsCount, examName, totalDurationSeconds, customAnswerKey, practiceConfig]);

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
  };

  // Keyboard shortcut listener for fast bubbling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        if (currentActiveQ < questionsCount) {
          setCurrentActiveQ((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentActiveQ((prev) => Math.min(questionsCount, prev + 1));
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentActiveQ((prev) => Math.max(1, prev - 1));
      } else if (key === 'R') {
        toggleReviewFlag(currentActiveQ);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentActiveQ, markedForReview, questionsCount]);

  const attemptedCount = Object.keys(markedAnswers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = Math.max(0, questionsCount - attemptedCount);

  const handleSubmit = () => {
    if (attemptedCount === 0) {
      showToast('Kripya submit karne se pehle kam se kam 1 question bubble karein.', 'error');
      return;
    }

    const confirmMsg =
      reviewCount > 0
        ? `Aapne ${attemptedCount}/${questionsCount} questions attempt kiye hain (${reviewCount} flagged). Kya aap test submit karna chahte hain?`
        : `Aapne ${attemptedCount}/${questionsCount} questions attempt kiye hain. Kya aap evaluation ke liye submit karna chahte hain?`;

    if (window.confirm(confirmMsg)) {
      setTimerRunning(false);
      showToast('Test submit ho gaya! Evaluating scorecard...', 'success');
      const timeSpentSecs = totalDurationSeconds - secondsLeft;
      onCompleteTest(markedAnswers, customAnswerKey, {
        totalQuestions: questionsCount,
        testName: examName,
        timeTaken: formatTimer(timeSpentSecs),
        sections: practiceConfig.sections?.map((s) => ({
          name: s.name,
          startQ: s.startQuestion || (s as any).startQ,
          endQ: s.endQuestion || (s as any).endQ,
        })),
      });
    }
  };

  const handleClear = () => {
    if (window.confirm('Sabhi bhare hue bubbles clear karein?')) {
      setMarkedAnswers({});
      setMarkedForReview({});
      showToast('Sabhi answers clear kar diye gaye', 'info');
    }
  };

  return (
    <div
      className={`flex flex-col h-full w-full ${
        paperTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      } overflow-hidden relative select-none`}
    >
      {/* Top Test Control Bar */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-2.5 sm:px-6 py-2 shadow-xs z-20 shrink-0">
        
        {/* ROW 1: Exit, Exam Preset, Timer, and Primary SUBMIT (Always visible, Never cut off!) */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Left: Exit button & Exam Preset Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  if (attemptedCount > 0) {
                    if (window.confirm('Test chal raha hai. Kya aap sach me exit karna chahte hain?')) {
                      onNavigate('dashboard');
                    }
                  } else {
                    onNavigate('dashboard');
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Exit Practice Mode"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Question Count & Exam Preset Trigger Button */}
            <button
              type="button"
              onClick={() => setShowExamSelectorModal(true)}
              className="flex items-center gap-1 text-xs font-black px-2 sm:px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 border border-blue-200 transition-colors cursor-pointer shrink-0"
              title="Change Exam Pattern & Question Count"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="truncate max-w-[110px] sm:max-w-[180px] font-bold">
                {questionsCount} Qs
              </span>
              <ChevronDown className="w-3 h-3 text-blue-500" />
            </button>
          </div>

          {/* Center: Live Timer with Pulse */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-xl font-mono text-xs sm:text-sm font-black shadow-xs transition-colors ${
                secondsLeft < 300
                  ? 'bg-rose-600 text-white animate-pulse'
                  : secondsLeft < 600
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-900 text-white dark:bg-slate-800 dark:border dark:border-slate-700'
              }`}
              title="Exam Time Remaining"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTimer(secondsLeft)}</span>
              <button
                type="button"
                onClick={() => setTimerRunning((p) => !p)}
                className="p-0.5 hover:bg-white/20 rounded cursor-pointer ml-0.5"
                title={timerRunning ? 'Pause Timer' : 'Resume Timer'}
              >
                {timerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Right: Submit Test Button (PRIORITY 1 - Never cut off, prominent) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3 sm:px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-black shadow-xs shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title="Submit Test & View Evaluation"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* ROW 2: Tool Strip (Active Q, Flag, Palette, Answer Key, Zoom, More) */}
        <div className="flex items-center justify-between gap-1.5 mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          
          {/* Left: Active Question Indicator & Flag Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
              Q.<strong className="text-blue-600 dark:text-blue-400 font-black text-sm">#{currentActiveQ}</strong>
              <span className="hidden sm:inline text-slate-400 dark:text-slate-500 font-normal"> / {questionsCount}</span>
            </span>

            <button
              type="button"
              onClick={() => toggleReviewFlag(currentActiveQ)}
              className={`flex items-center gap-1 text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                markedForReview[currentActiveQ]
                  ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-purple-600'
              }`}
            >
              {markedForReview[currentActiveQ] ? (
                <BookmarkCheck className="w-3 h-3 text-purple-600 fill-purple-200" />
              ) : (
                <Bookmark className="w-3 h-3 text-slate-400" />
              )}
              <span>{markedForReview[currentActiveQ] ? 'Flagged' : 'Flag'}</span>
            </button>

            {/* Attempted counter */}
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold ml-1">
              <span>Done:</span>
              <span className="font-bold text-slate-900 dark:text-slate-200">
                {attemptedCount}/{questionsCount}
              </span>
            </div>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Palette Trigger */}
            <button
              type="button"
              onClick={() => setShowPalette((p) => !p)}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                showPalette
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Question Palette"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden xs:inline">Palette</span>
              <span className="text-[10px] bg-blue-500/15 text-blue-700 dark:text-blue-300 px-1 rounded font-mono font-bold">
                {attemptedCount}/{questionsCount}
              </span>
            </button>

            {/* Answer Key Trigger */}
            <button
              type="button"
              onClick={() => setShowAnswerKeyModal(true)}
              className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                Object.keys(customAnswerKey).length > 0
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Answer Key"
            >
              <Key className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] hidden xs:inline">Key</span>
              {Object.keys(customAnswerKey).length > 0 && (
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-1 rounded font-bold">
                  {Object.keys(customAnswerKey).length}
                </span>
              )}
            </button>

            {/* Zoom Controls with Auto-Fit */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.max(0.35, parseFloat((prev - 0.08).toFixed(2))))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setZoomScale(getAutoFitScale())}
                className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-300 hover:underline px-1 cursor-pointer"
                title="Reset to Fit Screen"
              >
                Fit {Math.round(zoomScale * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoomScale((prev) => Math.min(1.4, parseFloat((prev + 0.08).toFixed(2))))}
                className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded hover:bg-white dark:hover:bg-slate-700 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
            </div>

            {/* Desktop Only Extra Buttons */}
            <div className="hidden md:flex items-center gap-1 shrink-0">
              {onToggleZenMode && (
                <button
                  type="button"
                  onClick={onToggleZenMode}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isZenMode
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                  title={isZenMode ? 'Exit Zen Mode' : 'Zen Mode'}
                >
                  {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowShortcutsModal(true)}
                className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Clear All Bubbles"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile / Compact More Dropdown Trigger */}
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setShowMoreMenu((p) => !p)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="More Options"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowExamSelectorModal(true);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    <span>Change Pattern ({questionsCount} Qs)</span>
                  </button>
                  {onToggleZenMode && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onToggleZenMode();
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>{isZenMode ? 'Exit Zen Mode' : 'Fullscreen Zen'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowShortcutsModal(true);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
                  >
                    <Keyboard className="w-3.5 h-3.5 text-slate-500" />
                    <span>Shortcuts Guide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      handleClear();
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 cursor-pointer border-t border-slate-100 dark:border-slate-800"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Clear All Bubbles</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Canvas Area with Centered Interactive OMR Sheet */}
        <div
          ref={containerRef}
          className={`flex-1 overflow-auto p-1.5 sm:p-4 flex justify-center items-start min-w-0 ${
            paperTheme === 'paper' ? 'bg-slate-100' : 'bg-slate-950'
          }`}
        >
          <div className="flex justify-center items-start transition-all duration-150 py-1">
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
          <aside className="w-72 sm:w-80 bg-white border-l border-slate-200 shadow-2xl flex flex-col z-30 shrink-0 animate-in slide-in-from-right duration-200">
            <div className="p-3 sm:p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Question Palette</h3>
                <p className="text-xs text-slate-500">
                  {questionsCount} Questions • {examName}
                </p>
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
            <div className="px-3 sm:px-4 py-2.5 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-1.5 text-center text-xs">
              <button
                type="button"
                onClick={() => setPaletteFilter(paletteFilter === 'answered' ? 'all' : 'answered')}
                className={`border rounded-lg p-1.5 cursor-pointer transition-colors ${
                  paletteFilter === 'answered'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <div className="font-black text-sm">{attemptedCount}</div>
                <div className="text-[10px] font-semibold">Answered</div>
              </button>

              <button
                type="button"
                onClick={() => setPaletteFilter(paletteFilter === 'flagged' ? 'all' : 'flagged')}
                className={`border rounded-lg p-1.5 cursor-pointer transition-colors ${
                  paletteFilter === 'flagged'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
                }`}
              >
                <div className="font-black text-sm">{reviewCount}</div>
                <div className="text-[10px] font-semibold">Flagged</div>
              </button>

              <button
                type="button"
                onClick={() => setPaletteFilter(paletteFilter === 'unanswered' ? 'all' : 'unanswered')}
                className={`border rounded-lg p-1.5 cursor-pointer transition-colors ${
                  paletteFilter === 'unanswered'
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="font-black text-sm">{unattemptedCount}</div>
                <div className="text-[10px] font-semibold">Left</div>
              </button>
            </div>

            {/* Section Quick Jump Pills (for NEET / JEE / Multi-section papers) */}
            {practiceConfig.sections && practiceConfig.sections.length > 0 && (
              <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex gap-1 overflow-x-auto">
                {practiceConfig.sections.map((sec) => (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setCurrentActiveQ(sec.startQuestion || (sec as any).startQ)}
                    className="text-[10px] font-bold px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors whitespace-nowrap cursor-pointer shrink-0"
                  >
                    {sec.name} ({sec.startQuestion || (sec as any).startQ}-{sec.endQuestion || (sec as any).endQ})
                  </button>
                ))}
              </div>
            )}

            {/* Questions Grid 1 to questionsCount */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4">
              <div className="grid grid-cols-5 gap-1.5">
                {Array.from({ length: questionsCount }).map((_, idx) => {
                  const qNum = idx + 1;
                  const isAnswered = Boolean(markedAnswers[qNum]);
                  const isFlagged = Boolean(markedForReview[qNum]);
                  const isActive = currentActiveQ === qNum;

                  // Filter visibility
                  if (paletteFilter === 'answered' && !isAnswered) return null;
                  if (paletteFilter === 'flagged' && !isFlagged) return null;
                  if (paletteFilter === 'unanswered' && isAnswered) return null;

                  return (
                    <button
                      key={qNum}
                      type="button"
                      onClick={() => {
                        setCurrentActiveQ(qNum);
                      }}
                      className={`h-9 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                        isActive
                          ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 z-10'
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
                        <span className="text-[8.5px] font-black -mt-0.5 opacity-90">
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
            <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Selected: <strong>Q.{currentActiveQ}</strong>
                </span>
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
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Assessment</span>
              </button>
            </div>
          </aside>
        )}

      </div>

      {/* Mobile Floating Quick-Answer & Navigation Bar (only visible on mobile screens) */}
      <div className="sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-between gap-1 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] z-30 shrink-0">
        
        {/* Previous Question Button */}
        <button
          type="button"
          onClick={() => setCurrentActiveQ((p) => Math.max(1, p - 1))}
          disabled={currentActiveQ <= 1}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0"
          title="Previous Question"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Center: Active Question Badge & Quick Option Buttons */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="px-2 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg text-center shrink-0">
            <span className="text-[11px] font-black text-blue-700 dark:text-blue-300 block leading-tight">
              Q.{currentActiveQ}
            </span>
            <span className="text-[8px] text-slate-500 dark:text-slate-400 font-bold block">
              {markedAnswers[currentActiveQ] ? `Ans: ${markedAnswers[currentActiveQ]}` : 'Unfilled'}
            </span>
          </div>

          {/* Bubbles A, B, C, D */}
          <div className="flex items-center gap-1.5">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const isSelected = markedAnswers[currentActiveQ] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    handleBubbleClick(currentActiveQ, opt);
                    if (currentActiveQ < questionsCount) {
                      setTimeout(() => setCurrentActiveQ((p) => Math.min(questionsCount, p + 1)), 250);
                    }
                  }}
                  className={`w-9 h-9 rounded-full font-black text-xs flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white ring-2 ring-blue-500 ring-offset-1 scale-105 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-400 active:scale-95'
                  }`}
                  title={`Select Option ${opt}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next Question Button */}
        <button
          type="button"
          onClick={() => setCurrentActiveQ((p) => Math.min(questionsCount, p + 1))}
          disabled={currentActiveQ >= questionsCount}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1 font-bold text-xs shrink-0"
          title="Next Question"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* Exam Pattern & Question Count Selector Modal */}
      {showExamSelectorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Select Exam Pattern & Questions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose standard exam format (20 to 200 Questions) or set custom count
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExamSelectorModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Standard Indian Exam Formats
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {EXAM_PRESETS.map((preset) => {
                  const isSelected = activePresetId === preset.id && questionsCount === preset.questionsCount;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-600/30 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">
                        {preset.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-auto">
                        <span className="text-[10px] font-black bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
                          {preset.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Questions Card */}
              <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Custom Question Count (Apne hisab se number dalein)</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Total Questions (5 - 200):
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={200}
                      value={customQInput}
                      onChange={(e) => setCustomQInput(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g. 100 or 180"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Duration (Minutes):
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={customMinInput}
                      onChange={(e) => setCustomMinInput(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="e.g. 120"
                    />
                  </div>
                </div>

                {/* Quick Number Selector Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-slate-500">Quick values:</span>
                  {[25, 40, 60, 75, 100, 120, 150, 180, 200].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        setCustomQInput(String(num));
                        setCustomMinInput(String(num >= 100 ? Math.round(num * 1.1) : num));
                      }}
                      className="px-2 py-0.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-700 text-[10px] font-bold rounded-md cursor-pointer transition-colors"
                    >
                      {num} Qs
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleApplyCustomQuestions}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Apply Custom Questions ({customQInput} Qs)
                </button>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowExamSelectorModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Answer Key Modal configured with dynamic totalQuestions */}
      <AnswerKeyModal
        isOpen={showAnswerKeyModal}
        onClose={() => setShowAnswerKeyModal(false)}
        currentKey={customAnswerKey}
        onSaveKey={(newKey) => {
          setCustomAnswerKey(newKey);
          try {
            localStorage.setItem('omrwallah_custom_answer_key', JSON.stringify(newKey));
          } catch (e) {
            console.warn(e);
          }
        }}
        totalQuestions={questionsCount}
        optionsList={['A', 'B', 'C', 'D']}
        title={`Exam Answer Key (${questionsCount} Questions)`}
        showToast={showToast}
      />
    </div>
  );
};
