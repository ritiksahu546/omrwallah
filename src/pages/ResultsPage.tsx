import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  RotateCcw,
  Download,
  BarChart2,
  Sparkles,
  FileText,
  Key,
  Layers,
  Filter,
  Trash2,
  History,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { TestResult } from '../types/omr';
import { AnswerKeyModal } from '../components/omr/AnswerKeyModal';

interface ResultsPageProps {
  result: TestResult | null;
  testResults?: TestResult[];
  onSelectResult?: (res: TestResult) => void;
  onUpdateResult?: (res: TestResult) => void;
  onDeleteResult?: (id: string) => void;
  onRetake: () => void;
  onNavigate: (route: string) => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  result: initialResult,
  testResults = [],
  onSelectResult,
  onUpdateResult,
  onDeleteResult,
  onRetake,
  onNavigate,
  showToast,
}) => {
  const [localResult, setLocalResult] = useState<TestResult | null>(
    initialResult || (testResults.length > 0 ? testResults[0] : null)
  );
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'wrong' | 'skipped'>('all');
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    if (initialResult) {
      setLocalResult(initialResult);
    } else if (testResults.length > 0 && !localResult) {
      setLocalResult(testResults[0]);
    }
  }, [initialResult, testResults]);

  const handleUpdateAnswerKey = (newKey: Record<number, string>) => {
    if (!localResult) return;

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;

    for (let q = 1; q <= localResult.totalQuestions; q++) {
      const studentAns = localResult.answers[q];
      const correctAns = newKey[q] || 'A';

      if (!studentAns) {
        unattemptedCount++;
      } else if (studentAns === correctAns) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    const totalAttempted = correctCount + wrongCount;
    const accuracy = totalAttempted > 0 ? Math.round((correctCount / totalAttempted) * 100) : 0;
    const score = correctCount * 4 - wrongCount * 1;

    const updatedSections = localResult.sectionPerformance?.map((sec) => {
      return { ...sec };
    });

    const updatedResult: TestResult = {
      ...localResult,
      correct: correctCount,
      wrong: wrongCount,
      unattempted: unattemptedCount,
      attempted: totalAttempted,
      score,
      accuracy,
      answerKey: newKey,
      sectionPerformance: updatedSections,
    };

    setLocalResult(updatedResult);
    onUpdateResult?.(updatedResult);

    if (showToast) {
      showToast('Scorecard recalculated with updated Answer Key!', 'success');
    }
  };

  if (!localResult) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4 my-12 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900">No Test Results Available</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          You have not evaluated an OMR sheet or completed a practice test yet. Start a practice session or scan a sheet to view detailed scorecards!
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Practice Online Now
          </button>
          <button
            type="button"
            onClick={() => onNavigate('scan')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Scan OMR Sheet
          </button>
        </div>
      </div>
    );
  }

  const percentage = Math.max(
    0,
    Math.round((localResult.score / (localResult.maxScore || localResult.totalQuestions * 4)) * 100)
  );

  // Real PDF Report Generator using jsPDF
  const handleDownloadReport = () => {
    setIsExportingPdf(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageW, 36, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('OMRWALLAH OFFICIAL EVALUATION SCORECARD', 14, 16);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Assessment: ${localResult.testName}`, 14, 24);
      doc.text(`Date: ${localResult.date}   |   Time Taken: ${localResult.timeTaken}`, 14, 30);

      // Summary Box
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, 42, pageW - 28, 28, 3, 3, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(
        `Net Score: ${localResult.score} / ${localResult.maxScore} (${percentage}%)`,
        20,
        52
      );

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Total Questions: ${localResult.totalQuestions}   |   Attempted: ${localResult.attempted}   |   Accuracy: ${localResult.accuracy}%`,
        20,
        60
      );
      doc.text(
        `Correct: ${localResult.correct}   |   Incorrect: ${localResult.wrong}   |   Skipped: ${localResult.unattempted}`,
        20,
        66
      );

      let yPos = 78;

      // Section Performance if present
      if (localResult.sectionPerformance && localResult.sectionPerformance.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Subject / Section Breakdown:', 14, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        for (const sec of localResult.sectionPerformance) {
          doc.text(
            `• ${sec.sectionName}: ${sec.score}/${sec.maxScore} Marks  (Correct: ${sec.correct}, Wrong: ${sec.wrong}, Skipped: ${sec.unattempted}, Accuracy: ${sec.accuracy}%)`,
            18,
            yPos
          );
          yPos += 5.5;
        }
        yPos += 4;
      }

      // Question-by-Question Table Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Question-by-Question Evaluation Matrix:', 14, yPos);
      yPos += 6;

      doc.setFontSize(8.5);
      const cols = 4;
      const colW = (pageW - 28) / cols;
      const rowsPerCol = Math.ceil(localResult.totalQuestions / cols);

      for (let r = 0; r < rowsPerCol; r++) {
        if (yPos > 282) {
          doc.addPage();
          yPos = 18;
        }
        for (let c = 0; c < cols; c++) {
          const qNum = c * rowsPerCol + r + 1;
          if (qNum > localResult.totalQuestions) continue;

          const sAns = localResult.answers[qNum] || '-';
          const kAns = localResult.answerKey[qNum] || 'A';
          const status = !localResult.answers[qNum]
            ? 'SKIP'
            : sAns === kAns
            ? 'OK'
            : 'ERR';

          const xPos = 14 + c * colW;
          doc.setFont('courier', status === 'ERR' ? 'bold' : 'normal');
          if (status === 'OK') doc.setTextColor(5, 150, 105);
          else if (status === 'ERR') doc.setTextColor(225, 29, 72);
          else doc.setTextColor(100, 116, 139);

          doc.text(
            `Q${String(qNum).padStart(3, '0')}: ${sAns} (Key:${kAns}) [${status}]`,
            xPos,
            yPos
          );
        }
        yPos += 4.5;
      }

      const safeTitle = (localResult.testName || 'Scorecard')
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .replace(/-+/g, '-');
      doc.save(`OMRWallah-${safeTitle}-Report.pdf`);

      if (showToast) {
        showToast('Scorecard PDF report downloaded!', 'success');
      }
    } catch (err) {
      console.error('Error generating scorecard PDF:', err);
      if (showToast) {
        showToast('Failed to export PDF report.', 'error');
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Previous Attempts Switcher Bar (if user has multiple evaluated tests) */}
      {testResults.length > 1 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <History className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Evaluated Test History ({testResults.length} Attempts):</span>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={localResult.id}
              onChange={(e) => {
                const found = testResults.find((r) => r.id === e.target.value);
                if (found) {
                  setLocalResult(found);
                  onSelectResult?.(found);
                }
              }}
              className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:border-blue-600"
            >
              {testResults.map((tr) => (
                <option key={tr.id} value={tr.id}>
                  {tr.testName} — {tr.score}/{tr.maxScore} ({tr.date})
                </option>
              ))}
            </select>
            {onDeleteResult && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Delete this test result from your history?')) {
                    onDeleteResult(localResult.id);
                  }
                }}
                title="Delete this result"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Banner Scorecard */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluation Report Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {localResult.testName}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span>Date: {localResult.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Time: {localResult.timeTaken}
              </span>
              <span>•</span>
              <span>Total Questions: {localResult.totalQuestions}</span>
            </div>
          </div>

          {/* Score Circle / Pill */}
          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5">
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Total Score
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
                {localResult.score}{' '}
                <span className="text-lg font-normal text-slate-400">
                  / {localResult.maxScore}
                </span>
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                (+4 Correct, -1 Wrong)
              </div>
            </div>

            <div className="h-12 w-[1px] bg-white/15" />

            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Accuracy
              </div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-0.5">
                {localResult.accuracy}%
              </div>
              <div className="text-[10px] text-slate-300 font-semibold mt-0.5">
                {localResult.attempted}/{localResult.totalQuestions} Attempted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Breakdown Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{localResult.correct}</div>
            <div className="text-xs font-semibold text-slate-500">
              Correct (+{localResult.correct * 4})
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{localResult.wrong}</div>
            <div className="text-xs font-semibold text-slate-500">
              Incorrect (-{localResult.wrong})
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0">
            <MinusCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{localResult.unattempted}</div>
            <div className="text-xs font-semibold text-slate-500">Skipped (0)</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{percentage}%</div>
            <div className="text-xs font-semibold text-slate-500">Overall Score %</div>
          </div>
        </div>
      </div>

      {/* Section-wise Performance Breakdown */}
      {localResult.sectionPerformance && localResult.sectionPerformance.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Subject / Section-wise Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed breakdown of your performance across exam sections
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {localResult.sectionPerformance.map((sec, i) => (
              <div key={i} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900 uppercase tracking-wide">
                    {sec.sectionName}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {sec.score} / {sec.maxScore} Marks
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(sec.correct / sec.totalQuestions) * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Correct: ${sec.correct}`}
                  />
                  <div
                    style={{ width: `${(sec.wrong / sec.totalQuestions) * 100}%` }}
                    className="bg-rose-500 h-full"
                    title={`Wrong: ${sec.wrong}`}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                  <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-200/60">
                    <div className="text-xs font-black text-slate-800">{sec.totalQuestions}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Total</div>
                  </div>
                  <div className="bg-emerald-50/60 rounded-lg p-1.5 border border-emerald-200/60">
                    <div className="text-xs font-black text-emerald-700">{sec.correct}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Right</div>
                  </div>
                  <div className="bg-rose-50/60 rounded-lg p-1.5 border border-rose-200/60">
                    <div className="text-xs font-black text-rose-700">{sec.wrong}</div>
                    <div className="text-[10px] text-rose-600 font-semibold">Wrong</div>
                  </div>
                  <div className="bg-blue-50/60 rounded-lg p-1.5 border border-blue-200/60">
                    <div className="text-xs font-black text-blue-700">{sec.accuracy}%</div>
                    <div className="text-[10px] text-blue-600 font-semibold">Acc.</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRetake}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
          </button>

          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Key className="w-4 h-4 text-emerald-600" />
            <span>Edit Answer Key & Recalculate</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>View Full Analytics</span>
          </button>
        </div>

        <button
          type="button"
          disabled={isExportingPdf}
          onClick={handleDownloadReport}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white border border-slate-900 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isExportingPdf ? 'Generating PDF...' : 'Download Scorecard PDF'}</span>
        </button>
      </div>

      {/* Question-by-Question Answer Key Comparison */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Question-by-Question Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Compare your marked bubbles against the official answer key
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
              {(['all', 'correct', 'wrong', 'skipped'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer ${
                    filterMode === mode
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {Array.from({ length: localResult.totalQuestions }).map((_, idx) => {
            const qNum = idx + 1;
            const studentAns = localResult.answers[qNum];
            const correctAns = localResult.answerKey[qNum] || 'A';
            const isSkipped = !studentAns;
            const isCorrect = !isSkipped && studentAns === correctAns;

            if (filterMode === 'correct' && !isCorrect) return null;
            if (filterMode === 'wrong' && (isCorrect || isSkipped)) return null;
            if (filterMode === 'skipped' && !isSkipped) return null;

            return (
              <div
                key={qNum}
                className={`p-3 rounded-xl border flex flex-col justify-between gap-2 ${
                  isSkipped
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : isCorrect
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/60 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs">Q.{qNum}</span>
                  {isSkipped ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      Skipped
                    </span>
                  ) : isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-black/5">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Yours</span>
                    <span className="font-black">{studentAns || '—'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Correct</span>
                    <span className="font-black text-emerald-700">{correctAns}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Answer Key Modal for post-test recalculation */}
      <AnswerKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        questionsCount={localResult.totalQuestions}
        answerKey={localResult.answerKey}
        onSaveKey={handleUpdateAnswerKey}
      />
    </div>
  );
};
