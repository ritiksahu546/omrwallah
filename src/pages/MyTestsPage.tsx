import React, { useState } from 'react';
import { Search, Filter, Calendar, Award, CheckCircle2, ChevronRight, PenTool } from 'lucide-react';
import { MOCK_RECENT_TESTS } from '../data/mockData';

interface MyTestsPageProps {
  onViewResult: (testId: string) => void;
  onNavigate: (route: string) => void;
}

export const MyTestsPage: React.FC<MyTestsPageProps> = ({
  onViewResult,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTests = MOCK_RECENT_TESTS.filter((t) => {
    const matchesSearch = t.testName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Tests & Assessments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Complete archive of your physical and online practiced OMR tests
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0"
          >
            <PenTool className="w-4 h-4" />
            <span>New Practice</span>
          </button>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <tr>
                <th className="px-5 py-3">Test Title</th>
                <th className="px-5 py-3">Questions</th>
                <th className="px-5 py-3">Score & Accuracy</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date Completed</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-extrabold text-slate-900 text-sm">{t.testName}</div>
                    <div className="text-[11px] text-slate-400 font-medium">Standard A4 Sheet • Negative Marking (1/4th)</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-slate-600">
                    {t.questions} Qs
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                        t.score >= 80
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : t.score >= 70
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {t.score}% Score
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Evaluated</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-slate-500">
                    {t.date}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onViewResult(t.id)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs rounded-xl border border-blue-200 hover:border-blue-600 transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
