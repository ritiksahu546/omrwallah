import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Calendar,
  Award,
  ArrowRight,
  Search,
  PenTool,
  Trash2,
  ScanLine,
} from 'lucide-react';
import { TestResult } from '../types/omr';

interface MyTestsPageProps {
  onViewResult: (testId: string) => void;
  onNavigate: (route: string) => void;
  testResults?: TestResult[];
  onDeleteResult?: (testId: string) => void;
}

export const MyTestsPage: React.FC<MyTestsPageProps> = ({
  onViewResult,
  onNavigate,
  testResults = [],
  onDeleteResult,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTests = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return testResults;
    return testResults.filter(
      (t) =>
        t.testName.toLowerCase().includes(q) ||
        t.date.toLowerCase().includes(q)
    );
  }, [testResults, searchTerm]);

  const stats = useMemo(() => {
    const total = testResults.length;
    if (total === 0) {
      return { total: 0, avgAccuracy: 0, bestPct: 0 };
    }
    const avgAccuracy = Math.round(
      testResults.reduce((acc, t) => acc + (t.accuracy || 0), 0) / total
    );
    const bestPct = Math.max(
      ...testResults.map((t) =>
        Math.max(
          0,
          Math.round((t.score / (t.maxScore || t.totalQuestions * 4)) * 100)
        )
      )
    );
    return { total, avgAccuracy, bestPct };
  }, [testResults]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Practice & Scanned Tests
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Track all your attempted OMR sessions, scanned sheets, scores, and detailed reports
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('scan')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ScanLine className="w-4 h-4" />
            <span>Scan OMR</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <PenTool className="w-4 h-4" />
            <span>Take New Practice Test</span>
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Attempts</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {stats.total} Tests
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Average Accuracy</div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">
              {stats.avgAccuracy}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="text-xs text-slate-500 font-semibold">Highest Score %</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">
              {stats.bestPct}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-extrabold text-base text-slate-900">
            Attempted Tests History ({filteredTests.length})
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter tests by name or date..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {filteredTests.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm font-bold text-slate-800">
              {testResults.length === 0
                ? 'No practice or scanned tests recorded yet'
                : 'No tests match your filter'}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start an interactive practice mock or scan an OMR sheet to build your evaluation history.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase">
                <tr>
                  <th className="px-5 py-3.5">Assessment Name</th>
                  <th className="px-5 py-3.5">Questions</th>
                  <th className="px-5 py-3.5">Attempted</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Score</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTests.map((t) => {
                  const pct = Math.max(
                    0,
                    Math.round((t.score / (t.maxScore || t.totalQuestions * 4)) * 100)
                  );
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {t.testName}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {t.totalQuestions} Questions
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {t.attempted}/{t.totalQuestions} ({t.accuracy}% Acc.)
                      </td>
                      <td className="px-5 py-4 text-slate-500 text-xs">{t.date}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                            pct >= 80
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : pct >= 60
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {t.score}/{t.maxScore} ({pct}%)
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onViewResult(t.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <span>View Report</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          {onDeleteResult && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm('Delete this test result?')) {
                                  onDeleteResult(t.id);
                                }
                              }}
                              title="Delete Test Result"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
