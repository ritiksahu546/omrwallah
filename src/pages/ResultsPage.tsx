import React, { useState } from 'react';
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
} from 'lucide-react';
import { MOCK_SAMPLE_RESULT } from '../data/mockData';
import { TestResult } from '../types/omr';

interface ResultsPageProps {
  result?: TestResult;
  onNavigate: (route: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result = MOCK_SAMPLE_RESULT,
  onNavigate,
  showToast,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(7);
  const [showAnswerKeyModal, setShowAnswerKeyModal] = useState(false);

  const qDetails = result.questions.find((q) => q.questionNo === selectedQuestion);

  const handleDownloadReport = () => {
    showToast('Downloading Performance Evaluation Scorecard PDF...', 'info');
    setTimeout(() => {
      showToast('Scorecard report downloaded successfully!', 'success');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner (matching reference image #6) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Test Meta info */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Test Evaluated Successfully</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {result.testName}
            </h1>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
              <span>Date: {result.date}</span>
              <span>•</span>
              <span>Total Questions: {result.questions.length}</span>
              <span>•</span>
              <span>OMR Scan ID: #OMR-9842</span>
            </div>
          </div>

          {/* Circular Score Badge (matching reference #6 72/100) */}
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
                  strokeDashoffset={289 - (289 * result.percentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 leading-none">
                  {result.score}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  /{result.totalMarks}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Metric Counter Pills (matching reference #6) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              {result.attempted}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Attempted</div>
              <div className="text-[10px] font-semibold text-slate-500">Out of 100</div>
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
              {result.correct}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Correct</div>
              <div className="text-[10px] font-semibold text-emerald-600">+4 Marks each</div>
            </div>
          </div>

          <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black">
              {result.wrong}
            </div>
            <div>
              <div className="text-xs font-black text-slate-900">Wrong</div>
              <div className="text-[10px] font-semibold text-rose-600">-1 Neg. marking</div>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
              {result.skipped}
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
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="text-slate-600">Skipped</span>
              </div>
            </div>
          </div>

          {/* Interactive Question Bubbles Matrix (1 to 50) */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {result.questions.map((q) => {
              const isSelected = selectedQuestion === q.questionNo;

              let colorClasses = 'bg-slate-100 text-slate-600 border-slate-300';
              if (q.status === 'correct') {
                colorClasses = 'bg-emerald-500 text-white border-emerald-600 shadow-xs';
              } else if (q.status === 'wrong') {
                colorClasses = 'bg-rose-500 text-white border-rose-600 shadow-xs';
              } else if (q.status === 'skipped') {
                colorClasses = 'bg-slate-200 text-slate-700 border-slate-300';
              }

              return (
                <button
                  key={q.questionNo}
                  type="button"
                  onClick={() => setSelectedQuestion(q.questionNo)}
                  className={`h-9 rounded-xl font-bold text-xs border flex items-center justify-center transition-all cursor-pointer ${colorClasses} ${
                    isSelected ? 'ring-3 ring-blue-500 ring-offset-2 scale-105' : 'hover:scale-102'
                  }`}
                >
                  {q.questionNo}
                </button>
              );
            })}
          </div>

          {/* Selected Question Detail Drawer / Box */}
          {qDetails && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    Question #{qDetails.questionNo}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                    {qDetails.subject}
                  </span>
                </div>

                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase ${
                    qDetails.status === 'correct'
                      ? 'bg-emerald-100 text-emerald-800'
                      : qDetails.status === 'wrong'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {qDetails.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-200/70">
                <div>
                  <span className="text-slate-500 block">Your Marked Answer:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {qDetails.studentAnswer ? `Option (${qDetails.studentAnswer})` : 'Not Attempted'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Official Correct Answer:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">
                    Option ({qDetails.correctAnswer})
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Score Impact:</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {qDetails.status === 'correct' ? '+4 Marks' : qDetails.status === 'wrong' ? '-1 Mark' : '0'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Subject Wise Breakdown & Actions (matching reference #6) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              Subject Wise Performance
            </h3>

            <div className="space-y-3.5">
              {result.subjectWise.map((sub) => (
                <div key={sub.subject} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{sub.subject}</span>
                    <span className="text-slate-900">{sub.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${sub.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Time Taken</span>
                <span className="font-extrabold text-slate-900 text-sm">{result.timeTaken}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Accuracy</span>
                <span className="font-extrabold text-emerald-600 text-sm">{result.accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Action CTAs (matching reference image #6) */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => setShowAnswerKeyModal(true)}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Key className="w-4 h-4 text-blue-600" />
              <span>View Answer Key</span>
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

      {/* Answer Key Modal */}
      {showAnswerKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-extrabold text-lg text-slate-900">Official Answer Key (50 Questions)</h3>
              <button
                type="button"
                onClick={() => setShowAnswerKeyModal(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="grid grid-cols-5 gap-2 text-xs">
                {result.questions.map((q) => (
                  <div key={q.questionNo} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <span className="text-slate-400 block text-[10px] font-bold">Q{q.questionNo}</span>
                    <span className="font-black text-blue-600 text-sm">{q.correctAnswer}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setShowAnswerKeyModal(false)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
