import React, { useState } from 'react';
import {
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  Plus,
  PenTool,
  ScanLine,
  ChevronRight,
  FileText,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_STUDENT_STATS, MOCK_RECENT_TESTS } from '../data/mockData';

interface DashboardPageProps {
  onNavigate: (route: string) => void;
  onViewResult: (testId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onViewResult,
}) => {
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 min-w-0 box-border">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Hello, {userRole === 'student' ? 'Student' : 'Professor'} 👋
            </h1>
            <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              {userRole === 'student' ? 'NEET Aspirant' : 'Coaching Faculty'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep practicing, keep improving! Consistent bubbling builds exam speed.
          </p>
        </div>

        {/* Quick Actions & Role Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setUserRole('student')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                userRole === 'student' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Student View
            </button>
            <button
              type="button"
              onClick={() => setUserRole('teacher')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                userRole === 'teacher' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              Teacher View
            </button>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('creator')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create OMR</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 w-full min-w-0">
        {userRole === 'student' ? (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">
                  {MOCK_STUDENT_STATS.testsTaken}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Tests Taken</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">
                  {MOCK_STUDENT_STATS.averageScore}%
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Average Score</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">
                  {MOCK_STUDENT_STATS.bestScore}%
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Best Score</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">
                  {MOCK_STUDENT_STATS.practiceTime}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Practice Time</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">0</div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Tests Created</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">0</div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Students Enrolled</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">0</div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Sheets Evaluated</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-5 shadow-xs flex items-center gap-2.5 sm:gap-3.5 min-w-0 overflow-hidden">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="text-lg sm:text-2xl font-black text-slate-900 truncate">0%</div>
                <div className="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">Class Avg Score</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Access Action Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full min-w-0">
        <button
          type="button"
          onClick={() => onNavigate('creator')}
          className="p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group min-w-0"
        >
          <div className="min-w-0 flex-1 pr-2">
            <div className="font-extrabold text-sm truncate">Create New OMR</div>
            <div className="text-[11px] text-blue-100 truncate">A4 Print ready generator</div>
          </div>
          <Plus className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('practice')}
          className="p-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group min-w-0"
        >
          <div className="min-w-0 flex-1 pr-2">
            <div className="font-extrabold text-sm truncate">Interactive Practice</div>
            <div className="text-[11px] text-emerald-100 truncate">Live bubbling timer test</div>
          </div>
          <PenTool className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('scan')}
          className="p-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group min-w-0"
        >
          <div className="min-w-0 flex-1 pr-2">
            <div className="font-extrabold text-sm truncate">Scan OMR Sheet</div>
            <div className="text-[11px] text-slate-300 truncate">Camera / Image evaluate</div>
          </div>
          <ScanLine className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Recent Tests Table Card */}
      <div className="w-full min-w-0 max-w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between min-w-0">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-extrabold text-base text-slate-900 truncate">Recent Tests</h3>
            <p className="text-xs text-slate-500 truncate">Your latest evaluated assessments and mock scores</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {MOCK_RECENT_TESTS.length === 0 ? (
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
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
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
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_RECENT_TESTS.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        <span className="truncate max-w-[140px] sm:max-w-xs">{t.testName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-medium">
                      {t.questions} Qs
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                          t.score >= 80
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : t.score >= 70
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {t.score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 font-medium">
                      {t.date}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onViewResult(t.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
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
              <h3 className="font-extrabold text-base text-slate-900 truncate">Your Progress</h3>
              <p className="text-xs text-slate-500 truncate">Monthly score progression (Target: 85%+)</p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-full shrink-0">
              Latest: 0%
            </span>
          </div>

          {/* Progress Visual or Empty placeholder */}
          <div className="h-40 sm:h-44 w-full flex flex-col items-center justify-center p-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">No Score History Yet</p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
              Take practice tests to plot your monthly accuracy and score trend graph automatically.
            </p>
          </div>
        </div>

        {/* Subject Performance Bars */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs min-w-0 overflow-hidden">
          <div className="mb-4 min-w-0">
            <h3 className="font-extrabold text-base text-slate-900 truncate">Subject Performance</h3>
            <p className="text-xs text-slate-500 truncate">Average accuracy across test topics</p>
          </div>

          <div className="space-y-3.5">
            {[
              { subject: 'Physics', score: 0, color: 'bg-blue-600' },
              { subject: 'Chemistry', score: 0, color: 'bg-emerald-600' },
              { subject: 'Biology', score: 0, color: 'bg-indigo-600' },
              { subject: 'Maths', score: 0, color: 'bg-amber-600' },
            ].map((sub) => (
              <div key={sub.subject} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{sub.subject}</span>
                  <span className="text-slate-400">{sub.score}%</span>
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
            className="w-full mt-5 py-2.5 text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            Start Practice Test →
          </button>
        </div>

      </div>

    </div>
  );
};
