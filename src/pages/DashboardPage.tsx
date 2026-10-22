import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  Plus,
  PenTool,
  ScanLine,
  ChevronRight,
  FileText,
  Users,
  CheckCircle2,
  Edit3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TestResult } from '../types/omr';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onViewResult: (testId: string) => void;
  testResults?: TestResult[];
  savedSheetsCount?: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onViewResult,
  testResults = [],
  savedSheetsCount = 0,
}) => {
  const { user, userProfile } = useAuth();
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  // Determine student name dynamically with intelligent fallbacks
  const getStudentDisplayName = (): string => {
    const profileName = userProfile?.name?.trim();
    if (profileName && profileName.toLowerCase() !== 'student') {
      return profileName;
    }
    const authName = user?.displayName?.trim();
    if (authName && authName.toLowerCase() !== 'student') {
      return authName;
    }
    try {
      const cached = localStorage.getItem('omrwallah_user_name')?.trim();
      if (cached && cached.toLowerCase() !== 'student') {
        return cached;
      }
    } catch (e) {}

    if (user?.email) {
      const prefix = user.email.split('@')[0];
      const cleanParts = prefix
        .replace(/^(gig|user|student|test)[._-]?/i, '')
        .split(/[._\d-]/)
        .filter((p) => p.length >= 2);
      if (cleanParts.length > 0) {
        return cleanParts
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
          .join(' ');
      }
      const rawPart = prefix.split(/[._\d-]/)[0];
      if (rawPart && rawPart.length >= 2) {
        return rawPart.charAt(0).toUpperCase() + rawPart.slice(1).toLowerCase();
      }
    }
    return 'Student';
  };

  const studentName = getStudentDisplayName();
  const professorName =
    userProfile?.name?.trim() || user?.displayName?.trim() || 'Professor';

  // Derive real statistics from persisted testResults
  const stats = useMemo(() => {
    const testsTaken = testResults.length;
    if (testsTaken === 0) {
      return {
        testsTaken: 0,
        averageScorePct: 0,
        bestScorePct: 0,
        latestScorePct: 0,
        practiceTimeLabel: '0h 0m',
        subjectScores: [
          { subject: 'Physics', score: 0, color: 'bg-blue-600' },
          { subject: 'Chemistry', score: 0, color: 'bg-emerald-600' },
          { subject: 'Biology', score: 0, color: 'bg-indigo-600' },
          { subject: 'Maths', score: 0, color: 'bg-amber-600' },
        ],
      };
    }

    const pcts = testResults.map((tr) => {
      const max = tr.maxScore || tr.totalQuestions * 4 || 100;
      return Math.max(0, Math.min(100, Math.round((tr.score / max) * 100)));
    });

    const averageScorePct = Math.round(
      pcts.reduce((sum, v) => sum + v, 0) / testsTaken
    );
    const bestScorePct = Math.max(...pcts);
    const latestScorePct = pcts[0] || 0;

    // Estimate total practice minutes from timeTaken ("MM:SS") or question count
    let totalSeconds = 0;
    for (const tr of testResults) {
      if (tr.timeTaken && tr.timeTaken.includes(':')) {
        const parts = tr.timeTaken.split(':').map((n) => parseInt(n, 10) || 0);
        if (parts.length === 2) {
          totalSeconds += parts[0] * 60 + parts[1];
        }
      } else {
        totalSeconds += tr.attempted * 35;
      }
    }
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.max(1, Math.round((totalSeconds % 3600) / 60));
    const practiceTimeLabel = `${hrs}h ${mins}m`;

    // Aggregate section accuracy if present, else distribute based on real accuracy
    const sectionMap: Record<string, { totalAcc: number; count: number }> = {
      Physics: { totalAcc: 0, count: 0 },
      Chemistry: { totalAcc: 0, count: 0 },
      Biology: { totalAcc: 0, count: 0 },
      Maths: { totalAcc: 0, count: 0 },
    };

    for (const tr of testResults) {
      if (tr.sectionPerformance && tr.sectionPerformance.length > 0) {
        for (const sec of tr.sectionPerformance) {
          const name = sec.sectionName.toLowerCase();
          if (name.includes('phy')) {
            sectionMap.Physics.totalAcc += sec.accuracy;
            sectionMap.Physics.count++;
          } else if (name.includes('chem')) {
            sectionMap.Chemistry.totalAcc += sec.accuracy;
            sectionMap.Chemistry.count++;
          } else if (name.includes('bio') || name.includes('bot') || name.includes('zoo')) {
            sectionMap.Biology.totalAcc += sec.accuracy;
            sectionMap.Biology.count++;
          } else if (name.includes('math')) {
            sectionMap.Maths.totalAcc += sec.accuracy;
            sectionMap.Maths.count++;
          }
        }
      } else {
        // General test without named sections contributes to overall subject baseline
        sectionMap.Physics.totalAcc += tr.accuracy;
        sectionMap.Physics.count++;
        sectionMap.Chemistry.totalAcc += tr.accuracy;
        sectionMap.Chemistry.count++;
      }
    }

    const subjectScores = [
      {
        subject: 'Physics',
        score:
          sectionMap.Physics.count > 0
            ? Math.round(sectionMap.Physics.totalAcc / sectionMap.Physics.count)
            : 0,
        color: 'bg-blue-600',
      },
      {
        subject: 'Chemistry',
        score:
          sectionMap.Chemistry.count > 0
            ? Math.round(sectionMap.Chemistry.totalAcc / sectionMap.Chemistry.count)
            : 0,
        color: 'bg-emerald-600',
      },
      {
        subject: 'Biology',
        score:
          sectionMap.Biology.count > 0
            ? Math.round(sectionMap.Biology.totalAcc / sectionMap.Biology.count)
            : 0,
        color: 'bg-indigo-600',
      },
      {
        subject: 'Maths',
        score:
          sectionMap.Maths.count > 0
            ? Math.round(sectionMap.Maths.totalAcc / sectionMap.Maths.count)
            : 0,
        color: 'bg-amber-600',
      },
    ];

    return {
      testsTaken,
      averageScorePct,
      bestScorePct,
      latestScorePct,
      practiceTimeLabel,
      subjectScores,
    };
  }, [testResults]);

  const recentTests = useMemo(() => testResults.slice(0, 6), [testResults]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 min-w-0 box-border">
      {/* Top Welcome Header & Integrated Role Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Hello, {userRole === 'student' ? studentName : professorName} 👋</span>
              <button
                type="button"
                onClick={() => onNavigate('profile')}
                title="Edit student profile & name"
                className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer inline-flex items-center"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              {userProfile?.targetExam ||
                (userRole === 'student' ? 'NEET Aspirant' : 'Coaching Faculty')}
            </span>

            {/* Role Switcher positioned immediately adjacent to user identity */}
            <div
              className="bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 flex items-center text-xs font-bold shrink-0"
              role="tablist"
              aria-label="Dashboard role view"
            >
              <button
                type="button"
                role="tab"
                aria-selected={userRole === 'student'}
                onClick={() => setUserRole('student')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  userRole === 'student'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student View
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={userRole === 'teacher'}
                onClick={() => setUserRole('teacher')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  userRole === 'teacher'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Teacher View
              </button>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Keep practicing, keep improving! Consistent bubbling builds exam speed.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full min-w-0">
        {userRole === 'student' ? (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {stats.testsTaken}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Tests Taken
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {stats.averageScorePct}%
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Average Score
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {stats.bestScorePct}%
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Best Score
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {stats.practiceTimeLabel}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Practice Time
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {savedSheetsCount}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Sheets Created
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {testResults.filter((r) => r.id.startsWith('scan-')).length}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Scanned Sheets
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {stats.testsTaken}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Sheets Evaluated
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3 sm:gap-4 min-w-0 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {stats.averageScorePct}%
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1 truncate">
                  Avg Evaluation Score
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Access Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-3 w-full min-w-0">
        <button
          type="button"
          onClick={() => onNavigate('creator')}
          className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group min-w-0"
        >
          <div className="min-w-0 flex-1 pr-3">
            <div className="font-extrabold text-sm sm:text-base leading-snug">
              Create New OMR
            </div>
            <div className="text-xs text-blue-100/90 mt-0.5">
              A4 Print ready generator
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 text-white" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('practice')}
          className="p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group min-w-0"
        >
          <div className="min-w-0 flex-1 pr-3">
            <div className="font-extrabold text-sm sm:text-base leading-snug">
              Interactive Practice
            </div>
            <div className="text-xs text-emerald-100/90 mt-0.5">
              Live bubbling timer test
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <PenTool className="w-5 h-5 text-white" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('scan')}
          className="p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group min-w-0"
        >
          <div className="min-w-0 flex-1 pr-3">
            <div className="font-extrabold text-sm sm:text-base leading-snug">
              Scan OMR Sheet
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              Camera / Image evaluate
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>

      {/* Recent Tests Table Card */}
      <div className="w-full min-w-0 max-w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between min-w-0">
          <div className="min-w-0 flex-1 pr-2">
            <h2 className="font-extrabold text-base text-slate-900 truncate">
              Recent Tests
            </h2>
            <p className="text-xs text-slate-500 truncate">
              Your latest evaluated assessments and mock scores
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('tests')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTests.length === 0 ? (
          <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">No tests evaluated yet</p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xs mx-auto">
                Take a practice test or evaluate an OMR sheet to view your results here.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-200 transition-colors cursor-pointer"
            >
              Start First Practice Test →
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[500px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <tr>
                  <th className="px-4 py-3">Test Name</th>
                  <th className="px-4 py-3">Questions</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTests.map((t) => {
                  const pct = Math.max(
                    0,
                    Math.round((t.score / (t.maxScore || t.totalQuestions * 4)) * 100)
                  );
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          <span className="truncate max-w-[140px] sm:max-w-xs">
                            {t.testName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs font-medium">
                        {t.totalQuestions} Qs
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                            pct >= 80
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : pct >= 60
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {t.score}/{t.maxScore} ({pct}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-slate-700">
                        {t.accuracy}%
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                        {t.date}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onViewResult(t.id)}
                          className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lower Row: Progress Chart & Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full min-w-0">
        {/* Your Progress Line Visual */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4 min-w-0">
            <div className="min-w-0 flex-1 pr-2">
              <h2 className="font-extrabold text-base text-slate-900 truncate">
                Your Progress
              </h2>
              <p className="text-xs text-slate-500 truncate">
                Score progression across recent tests (Target: 85%+)
              </p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full shrink-0">
              Latest: {stats.latestScorePct}%
            </span>
          </div>

          {testResults.length === 0 ? (
            <div className="h-40 sm:h-44 w-full flex flex-col items-center justify-center p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-700">No Score History Yet</p>
              <p className="text-xs text-slate-400 max-w-xs mt-0.5">
                Take practice tests to plot your accuracy and score trend graph automatically.
              </p>
            </div>
          ) : (
            <div className="h-40 sm:h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-3 border border-slate-100 rounded-xl bg-slate-50/40">
              {testResults
                .slice(0, 8)
                .reverse()
                .map((tr, idx) => {
                  const pct = Math.max(
                    8,
                    Math.min(
                      100,
                      Math.round(
                        (tr.score / (tr.maxScore || tr.totalQuestions * 4)) * 100
                      )
                    )
                  );
                  return (
                    <button
                      key={tr.id || idx}
                      type="button"
                      onClick={() => onViewResult(tr.id)}
                      className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer"
                      title={`${tr.testName}: ${pct}%`}
                    >
                      <span className="text-[10px] font-black text-blue-700">
                        {pct}%
                      </span>
                      <div className="w-full max-w-[36px] bg-blue-100 rounded-t-lg overflow-hidden flex items-end h-24">
                        <div
                          className="w-full bg-gradient-to-t from-blue-600 to-cyan-500 rounded-t-lg transition-all duration-500 group-hover:from-blue-700 group-hover:to-blue-500"
                          style={{ height: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate max-w-[60px]">
                        #{idx + 1}
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* Subject Performance Bars */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs min-w-0 overflow-hidden">
          <div className="mb-4 min-w-0">
            <h2 className="font-extrabold text-base text-slate-900 truncate">
              Subject Performance
            </h2>
            <p className="text-xs text-slate-500 truncate">
              Average accuracy across test topics
            </p>
          </div>

          <div className="space-y-3.5">
            {stats.subjectScores.map((sub) => (
              <div key={sub.subject} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{sub.subject}</span>
                  <span className="text-slate-600">{sub.score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sub.color} rounded-full transition-all duration-500`}
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="w-full mt-5 py-2.5 text-center text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            Start Practice Test →
          </button>
        </div>
      </div>
    </div>
  );
};
