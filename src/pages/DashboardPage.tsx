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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Welcome Header (matching reference image #4) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Hello, {userRole === 'student' ? 'Student' : 'Professor'} 👋
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {userRole === 'student' ? 'NEET Aspirant' : 'Coaching Faculty'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Keep practicing, keep improving! Consistent bubbling builds exam speed.
          </p>
        </div>

        {/* Quick Actions & Role Switcher */}
        <div className="flex items-center gap-2">
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create OMR</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards (matching reference image #4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userRole === 'student' ? (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {MOCK_STUDENT_STATS.testsTaken}
                </div>
                <div className="text-xs font-semibold text-slate-500">Tests Taken</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {MOCK_STUDENT_STATS.averageScore}%
                </div>
                <div className="text-xs font-semibold text-slate-500">Average Score</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {MOCK_STUDENT_STATS.bestScore}%
                </div>
                <div className="text-xs font-semibold text-slate-500">Best Score</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  {MOCK_STUDENT_STATS.practiceTime}
                </div>
                <div className="text-xs font-semibold text-slate-500">Practice Time</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">28</div>
                <div className="text-xs font-semibold text-slate-500">Tests Created</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">420</div>
                <div className="text-xs font-semibold text-slate-500">Students Enrolled</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">1,850</div>
                <div className="text-xs font-semibold text-slate-500">Sheets Evaluated</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">74.5%</div>
                <div className="text-xs font-semibold text-slate-500">Class Avg Score</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Access Action Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onNavigate('creator')}
          className="p-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div>
            <div className="font-extrabold text-sm">Create New OMR</div>
            <div className="text-[11px] text-blue-100">A4 Print ready generator</div>
          </div>
          <Plus className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('practice')}
          className="p-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div>
            <div className="font-extrabold text-sm">Interactive Practice</div>
            <div className="text-[11px] text-emerald-100">Live bubbling timer test</div>
          </div>
          <PenTool className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('scan')}
          className="p-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl text-left flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <div>
            <div className="font-extrabold text-sm">Scan OMR Sheet</div>
            <div className="text-[11px] text-slate-300">Camera / Image evaluate</div>
          </div>
          <ScanLine className="w-5 h-5" />
        </button>
      </div>

      {/* Recent Tests Table (matching reference image #4) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Recent Tests</h3>
            <p className="text-xs text-slate-500">Your latest evaluated assessments and mock scores</p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('results')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <tr>
                <th className="px-5 py-3">Test Name</th>
                <th className="px-5 py-3">Questions</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECENT_TESTS.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span>{t.testName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 text-xs font-medium">
                    {t.questions} Qs
                  </td>
                  <td className="px-5 py-3.5">
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
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-medium">
                    {t.date}
                  </td>
                  <td className="px-5 py-3.5 text-right">
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
      </div>

      {/* Lower Row: Progress Chart & Subject Performance (matching reference image #4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Your Progress Line Visual */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Your Progress</h3>
              <p className="text-xs text-slate-500">Monthly score progression (Target: 85%+)</p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
              Latest: 76%
            </span>
          </div>

          {/* SVG Line Chart */}
          <div className="h-44 w-full relative pt-4 pb-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeWidth="1" />

              {/* Area */}
              <path
                d="M 20 90 Q 100 80, 160 65 T 300 45 T 400 40 T 480 30 L 480 120 L 20 120 Z"
                fill="url(#chartGrad)"
              />

              {/* Line */}
              <path
                d="M 20 90 Q 100 80, 160 65 T 300 45 T 400 40 T 480 30"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Points */}
              <circle cx="20" cy="90" r="4" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="160" cy="65" r="4" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="300" cy="45" r="4" fill="#2563eb" stroke="#fff" strokeWidth="2" />
              <circle cx="480" cy="30" r="6" fill="#2563eb" stroke="#fff" strokeWidth="2.5" />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2">
              <span>Apr (58%)</span>
              <span>May (64%)</span>
              <span>Jun (70%)</span>
              <span>Jul (72%)</span>
              <span>Aug (74%)</span>
              <span className="text-blue-600">Sep (76%)</span>
            </div>
          </div>
        </div>

        {/* Subject Performance Bars */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="mb-4">
            <h3 className="font-extrabold text-base text-slate-900">Subject Performance</h3>
            <p className="text-xs text-slate-500">Average accuracy across test topics</p>
          </div>

          <div className="space-y-3.5">
            {[
              { subject: 'Physics', score: 72, color: 'bg-blue-600' },
              { subject: 'Chemistry', score: 81, color: 'bg-emerald-600' },
              { subject: 'Biology', score: 88, color: 'bg-indigo-600' },
              { subject: 'Maths', score: 65, color: 'bg-amber-600' },
            ].map((sub) => (
              <div key={sub.subject} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{sub.subject}</span>
                  <span className="text-slate-900">{sub.score}%</span>
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
            onClick={() => onNavigate('analytics')}
            className="w-full mt-5 py-2 text-center text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer"
          >
            Detailed Analytics Breakdown →
          </button>
        </div>

      </div>

    </div>
  );
};
