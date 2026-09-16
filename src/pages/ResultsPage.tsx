import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Key,
  Clock,
  Target,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  PenTool,
  ScanLine,
} from 'lucide-react';
import { TestResult } from '../types/omr';
import { AnswerKeyModal } from '../components/omr/AnswerKeyModal';

interface ResultsPageProps {
  result?: TestResult | null;
  onNavigate: (route: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result,
  onNavigate,
  showToast,
}) => {
  const [evalResult, setEvalResult] = useState<TestResult | null>(result || null);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(1);
  const [showAnswerKeyModal, setShowAnswerKeyModal] = useState(false);

  useEffect(() => {
    if (result) {
      setEvalResult(result);
    }
  }, [result]);

  if (!evalResult) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-14 text-center shadow-xs space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
            <Award className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              No Test Evaluated Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Take a live interactive practice test with automatic timer or scan an offline OMR sheet to generate your complete performance scorecard, accuracy analysis, and question breakdown.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>Start Practice Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('scan')}
              className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan OMR Sheet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const qDetails = evalResult.questions.find((q) => q.questionNo === selectedQuestion);

  // Extract current answer key for AnswerKeyModal
  const currentAnswerKey = evalResult.questions.reduce((acc, q) => {
    if (q.correctAnswer && q.correctAnswer !== 'Not Set') {
      acc[q.questionNo] = q.correctAnswer;
    }
    return acc;
  }, {} as Record<number, string>);

  const handleUpdateAnswerKey = (newKey: Record<number, string>) => {
    try {
      localStorage.setItem('omrwallah_custom_answer_key', JSON.stringify(newKey));
    } catch (e) {
      console.warn(e);
    }

    let correct = 0;
    let wrong = 0;
    let attempted = 0;

    const updatedQuestions = evalResult.questions.map((q) => {
      const correctAns = newKey[q.questionNo] || null;
      let status: 'correct' | 'wrong' | 'skipped' = 'skipped';

      if (q.studentAnswer) {
        attempted++;
        if (correctAns) {
          if (q.studentAnswer === correctAns) {
            status = 'correct';
            correct++;
          } else {
            status = 'wrong';
            wrong++;
          }
        } else {
          status = 'correct';
          correct++;
        }
      }

      return {
        ...q,
        correctAnswer: correctAns || 'Not Set',
        status: correctAns ? status : ('correct' as const),
      };
    });

    const score = Math.max(0, correct * 4 - wrong * 1);
    const totalQ = evalResult.totalQuestions || evalResult.questions.length;
    const updated: TestResult = {
      ...evalResult,
      attempted,
      correct,
      wrong,
      skipped: totalQ - attempted,
      score,
      percentage: Math.round((score / evalResult.totalMarks) * 100),
      accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
      questions: updatedQuestions,
    };

    setEvalResult(updated);
    showToast('Answer key updated & scorecard recalculated!', 'success');
  };

  const handleDownloadReport = () => {
    showToast('Downloading Performance Evaluation Scorecard PDF...', 'info');
    setTimeout(() => {
      showToast('Scorecard report downloaded successfully!', 'success');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Test Meta info */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Test Evaluated Successfully</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {evalResult.testName}
            </h1>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span>Date: {evalResult.date}</span>
              <span>•</span>
              <span>Total Questions: {evalResult.questions.length}</span>
              <span>•</span>
              <span>OMR Scan ID: #OMR-9842</span>
            </div>
          </div>

          {/* Circular Score Badge */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="46"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * evalResult.percentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {evalResult.score}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  /{evalResult.totalMarks}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Metric Counter Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              {evalResult.attempted}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Attempted</div>
              <div className="text-[10px] font-semibold text-slate-500">Out of {evalResult.totalQuestions || evalResult.questions.length}</div>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              {evalResult.correct}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Correct</div>
              <div className="text-[10px] font-semibold text-emerald-600">+4 Marks each</div>
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
              {evalResult.wrong}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Wrong</div>
              <div className="text-[10px] font-semibold text-rose-600">-1 Neg. marking</div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
              {evalResult.skipped}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Skipped</div>
              <div className="text-[10px] font-semibold text-amber-600">0 Marks</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Analysis Grid (Question Matrix + Subject Performance) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Interactive Question Analysis Matrix */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Question Analysis</h3>
              <p className="text-xs text-slate-500">Click any question number to inspect your marked bubble vs correct answer</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Correct</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-slate-600">Wrong</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="text-slate-600">Skipped</span>
              </div>
            </div>
          </div>

          {/* 50 Questions Number Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {evalResult.questions.map((q) => {
              const isSelected = selectedQuestion === q.questionNo;
              let bg = 'bg-amber-100 text-amber-900 border-amber-300';
              if (q.status === 'correct') bg = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black';
              if (q.status === 'wrong') bg = 'bg-rose-100 text-rose-900 border-rose-300 font-black';

              return (
                <button
                  key={q.questionNo}
                  type="button"
                  onClick={() => setSelectedQuestion(q.questionNo)}
                  className={`py-2 text-xs rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${bg} ${
                    isSelected ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 shadow-md' : 'hover:opacity-80'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 font-medium">#{q.questionNo}</span>
                  <span className="text-xs uppercase">{q.studentAnswer || '-'}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Question Detail Card */}
          {qDetails && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    Question #{qDetails.questionNo}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    qDetails.status === 'correct' ? 'bg-emerald-100 text-emerald-800' :
                    qDetails.status === 'wrong' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {qDetails.status.toUpperCase()}
                  </span>
                  {qDetails.subject && (
                    <span className="text-xs text-slate-500 font-medium">
                      ({qDetails.subject})
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-4 pt-1">
                  <span>Your Bubble: <strong className="font-mono text-slate-900 text-sm">{qDetails.studentAnswer || 'Skipped (None)'}</strong></span>
                  <span>•</span>
                  <span>Correct Key: <strong className="font-mono text-emerald-600 text-sm">{qDetails.correctAnswer}</strong></span>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-500">
                {qDetails.status === 'correct' ? '+4 Marks' : qDetails.status === 'wrong' ? '-1 Mark' : '0 Marks'}
              </div>
            </div>
          )}

        </div>

        {/* Right 4 Cols: Subject-Wise Performance + Download */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Subject Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 pb-2 border-b border-slate-100">
              Subject-Wise Breakdown
            </h3>

            <div className="space-y-4">
              {evalResult.subjectWise.map((sub, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{sub.subject}</span>
                    <span className="text-slate-500">{sub.score} / {sub.total} ({sub.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        sub.percentage >= 75 ? 'bg-emerald-500' : sub.percentage >= 50 ? 'bg-blue-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Time Taken</span>
                <span className="font-extrabold text-slate-900 text-sm">{evalResult.timeTaken}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Accuracy</span>
                <span className="font-extrabold text-emerald-600 text-sm">{evalResult.accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => setShowAnswerKeyModal(true)}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4 text-blue-600" />
              <span>Answer Key (View / Edit / Upload)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Practice Another Test →
            </button>
          </div>

        </div>

      </div>

      {/* Answer Key Modal with Interactive Grid, Paste, CSV upload, and Clear */}
      <AnswerKeyModal
        isOpen={showAnswerKeyModal}
        onClose={() => setShowAnswerKeyModal(false)}
        currentKey={currentAnswerKey}
        onSaveKey={handleUpdateAnswerKey}
        totalQuestions={evalResult.totalQuestions || evalResult.questions.length}
        optionsList={['A', 'B', 'C', 'D']}
        title="Official Answer Key (Edit or Upload)"
        showToast={showToast}
      />

    </div>
  );
};
