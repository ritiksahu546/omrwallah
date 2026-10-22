import React, { useMemo } from 'react';
import {
  TrendingUp,
  Target,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle2,
  PenTool,
  ScanLine,
} from 'lucide-react';
import { TestResult } from '../types/omr';

interface AnalyticsPageProps {
  onNavigate?: (route: string) => void;
  testResults?: TestResult[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onNavigate,
  testResults = [],
}) => {
  const hasData = testResults.length > 0;

  const analytics = useMemo(() => {
    if (!hasData) {
      return {
        avgSecPerQ: 0,
        overallAccuracy: 0,
        avgScorePct: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalSkipped: 0,
        totalQuestionsAll: 0,
        subjectBreakdown: [
          { subject: 'Physics', accuracy: 0, speed: '—', color: 'bg-blue-600' },
          { subject: 'Chemistry', accuracy: 0, speed: '—', color: 'bg-emerald-600' },
          { subject: 'Biology', accuracy: 0, speed: '—', color: 'bg-indigo-600' },
          { subject: 'Mathematics', accuracy: 0, speed: '—', color: 'bg-amber-600' },
        ],
        recentTrend: [] as { label: string; score: number; testName: string }[],
      };
    }

    let totalSeconds = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;
    let totalQuestionsAll = 0;

    for (const tr of testResults) {
      totalAttempted += tr.attempted || 0;
      totalCorrect += tr.correct || 0;
      totalWrong += tr.wrong || 0;
      totalSkipped += tr.unattempted || 0;
      totalQuestionsAll += tr.totalQuestions || 0;

      if (tr.timeTaken && tr.timeTaken.includes(':')) {
        const [m, s] = tr.timeTaken.split(':').map((n) => parseInt(n, 10) || 0);
        totalSeconds += m * 60 + s;
      } else {
        totalSeconds += (tr.attempted || 1) * 32;
      }
    }

    const avgSecPerQ =
      totalAttempted > 0 ? Number((totalSeconds / totalAttempted).toFixed(1)) : 0;
    const overallAccuracy =
      totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    const pcts = testResults.map((tr) =>
      Math.max(
        0,
        Math.min(
          100,
          Math.round((tr.score / (tr.maxScore || tr.totalQuestions * 4)) * 100)
        )
      )
    );
    const avgScorePct = Math.round(
      pcts.reduce((a, b) => a + b, 0) / testResults.length
    );

    // Subject aggregation
    const subjAcc: Record<string, { sum: number; count: number }> = {
      Physics: { sum: 0, count: 0 },
      Chemistry: { sum: 0, count: 0 },
      Biology: { sum: 0, count: 0 },
      Mathematics: { sum: 0, count: 0 },
    };

    for (const tr of testResults) {
      if (tr.sectionPerformance && tr.sectionPerformance.length > 0) {
        for (const sec of tr.sectionPerformance) {
          const n = sec.sectionName.toLowerCase();
          if (n.includes('phy')) {
            subjAcc.Physics.sum += sec.accuracy;
            subjAcc.Physics.count++;
          } else if (n.includes('chem')) {
            subjAcc.Chemistry.sum += sec.accuracy;
            subjAcc.Chemistry.count++;
          } else if (n.includes('bio') || n.includes('bot') || n.includes('zoo')) {
            subjAcc.Biology.sum += sec.accuracy;
            subjAcc.Biology.count++;
          } else if (n.includes('math')) {
            subjAcc.Mathematics.sum += sec.accuracy;
            subjAcc.Mathematics.count++;
          }
        }
      } else {
        subjAcc.Physics.sum += tr.accuracy;
        subjAcc.Physics.count++;
        subjAcc.Chemistry.sum += tr.accuracy;
        subjAcc.Chemistry.count++;
      }
    }

    const getSpeedLabel = (acc: number, count: number) => {
      if (count === 0) return 'No data';
      if (acc >= 80) return 'Strong';
      if (acc >= 60) return 'Moderate';
      return 'Needs Focus';
    };

    const subjectBreakdown = (
      [
        { key: 'Physics', color: 'bg-blue-600' },
        { key: 'Chemistry', color: 'bg-emerald-600' },
        { key: 'Biology', color: 'bg-indigo-600' },
        { key: 'Mathematics', color: 'bg-amber-600' },
      ] as const
    ).map((item) => {
      const entry = subjAcc[item.key];
      const acc = entry.count > 0 ? Math.round(entry.sum / entry.count) : 0;
      return {
        subject: item.key,
        accuracy: acc,
        speed: getSpeedLabel(acc, entry.count),
        color: item.color,
      };
    });

    const recentTrend = testResults
      .slice(0, 7)
      .reverse()
      .map((tr, i) => ({
        label: `T${i + 1}`,
        score: Math.max(
          0,
          Math.min(
            100,
            Math.round((tr.score / (tr.maxScore || tr.totalQuestions * 4)) * 100)
          )
        ),
        testName: tr.testName,
      }));

    return {
      avgSecPerQ,
      overallAccuracy,
      avgScorePct,
      totalCorrect,
      totalWrong,
      totalSkipped,
      totalQuestionsAll,
      subjectBreakdown,
      recentTrend,
    };
  }, [hasData, testResults]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Performance Analytics & Insights
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          Deep dive into your bubbling speed, subject-wise accuracy, and response distribution
        </p>
      </div>

      {/* Top 3 Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
              Avg. Time Per Question
            </span>
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-3xl font-black mt-2">
            {hasData ? `${analytics.avgSecPerQ} sec` : '0.0 sec'}
          </div>
          <p className="text-xs text-blue-100 mt-1">
            {hasData
              ? `Calculated across ${testResults.length} evaluated test(s)`
              : 'Complete a practice test to measure speed'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              Overall Accuracy Rate
            </span>
            <Target className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="text-3xl font-black mt-2">
            {hasData ? `${analytics.overallAccuracy}%` : '0%'}
          </div>
          <p className="text-xs text-emerald-100 mt-1">
            {hasData
              ? `${analytics.totalCorrect} correct out of ${analytics.totalCorrect + analytics.totalWrong} attempted`
              : 'No practice data recorded yet'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Average Net Score %
            </span>
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black mt-2 text-amber-400">
            {hasData ? `${analytics.avgScorePct}%` : '—'}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {hasData
              ? `Across ${analytics.totalQuestionsAll} total questions evaluated`
              : 'Take a mock test to unlock score analytics'}
          </p>
        </div>
      </div>

      {/* Empty State Call-to-Action when no tests taken */}
      {!hasData && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-extrabold text-slate-900">
              Your Analytics Dashboard is Ready
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Once you complete an online OMR practice test or scan a physical OMR sheet, your real accuracy trends, subject breakdown, and response statistics will appear here automatically.
            </p>
          </div>
          {onNavigate && (
            <div className="flex flex-wrap justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('practice')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Start Practice Test</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('scan')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>Scan OMR Sheet</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test-by-Test Score Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Score Progression Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Percentage score across your recent evaluated tests
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              {hasData ? `${testResults.length} Attempt(s)` : '0% Avg'}
            </span>
          </div>

          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
            {(hasData
              ? analytics.recentTrend
              : [
                  { label: 'T1', score: 0, testName: 'No test' },
                  { label: 'T2', score: 0, testName: 'No test' },
                  { label: 'T3', score: 0, testName: 'No test' },
                  { label: 'T4', score: 0, testName: 'No test' },
                  { label: 'T5', score: 0, testName: 'No test' },
                ]
            ).map((item, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                title={`${item.testName}: ${item.score}%`}
              >
                <span className="text-[11px] font-black text-blue-700">
                  {item.score}%
                </span>
                <div className="w-full max-w-[42px] bg-blue-100 rounded-t-xl overflow-hidden flex items-end h-36">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-xl transition-all duration-500"
                    style={{ height: `${Math.max(4, item.score)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject-wise Mastery */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Subject Mastery Breakdown
            </h3>
            <p className="text-xs text-slate-500">
              Accuracy by subject across evaluated sections
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {analytics.subjectBreakdown.map((item) => (
              <div key={item.subject} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.subject}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">
                      Status: <strong>{item.speed}</strong>
                    </span>
                    <span className="font-black text-slate-900">{item.accuracy}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cumulative Response Distribution */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Cumulative Response Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Correct Responses</span>
            </div>
            <div className="text-2xl font-black text-emerald-950">
              {analytics.totalCorrect} Questions
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Total questions answered accurately across all your evaluated OMR tests.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Incorrect Responses (Negative Marks)</span>
            </div>
            <div className="text-2xl font-black text-rose-950">
              {analytics.totalWrong} Questions
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Review these questions in your test scorecards to eliminate negative marking penalties.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              <span>Unattempted / Skipped</span>
            </div>
            <div className="text-2xl font-black text-amber-950">
              {analytics.totalSkipped} Questions
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Questions left blank across your practice and scanned OMR sheets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
