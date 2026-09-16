import React from 'react';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  AlertTriangle,
  Zap,
  BarChart3,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { MOCK_STUDENT_STATS } from '../data/mockData';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Performance Analytics & Insights
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Deep diagnostic metrics on your exam accuracy, bubbling speed, and penalty mark reduction
        </p>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Avg Bubble Speed</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">2.4 sec</div>
          <span className="text-[11px] font-bold text-emerald-600">▲ 35% faster than last month</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Overall Accuracy</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">78.4%</div>
          <span className="text-[11px] font-bold text-emerald-600">▲ Top 12% in NEET Mock Cohort</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Negative Marks</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">-14 avg</div>
          <span className="text-[11px] font-bold text-emerald-600">▼ Down from -28 in April</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Questions</span>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">1,240</div>
          <span className="text-[11px] font-bold text-slate-400">Practiced on physical OMR</span>
        </div>
      </div>

      {/* Diagnosis & Error Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Error Categorization */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Mistake Pattern Diagnostic
          </h3>
          <p className="text-xs text-slate-500">Why marks were deducted in the last 5 tests</p>

          <div className="space-y-3 pt-2">
            {[
              { type: 'Conceptual Inaccuracy (Wrong answer picked)', count: 42, pct: 54, color: 'bg-rose-500' },
              { type: 'Silly / Calculation Errors', count: 18, pct: 24, color: 'bg-amber-500' },
              { type: 'Time Rush in Final 10 Minutes', count: 12, pct: 15, color: 'bg-blue-500' },
              { type: 'Misread Question (e.g. NOT / EXCEPT)', count: 5, pct: 7, color: 'bg-purple-500' },
            ].map((err, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800">{err.type}</span>
                  <span className="text-slate-900">{err.count} Qs ({err.pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${err.color}`} style={{ width: `${err.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Subject Breakdown & Readiness */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Subject Accuracy & Target Readiness
          </h3>
          <p className="text-xs text-slate-500">Benchmark against NEET/JEE competitive cutoffs</p>

          <div className="space-y-4 pt-2">
            {[
              { subject: 'Biology (Botany + Zoology)', score: 88, benchmark: 85, status: 'Ready' },
              { subject: 'Chemistry (Organic & Physical)', score: 81, benchmark: 80, status: 'On Track' },
              { subject: 'Physics (Mechanics & Electrodynamics)', score: 72, benchmark: 75, status: 'Needs Revision' },
              { subject: 'Mathematical Reasoning', score: 65, benchmark: 70, status: 'Critical Focus' },
            ].map((s, i) => (
              <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-900">{s.subject}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      s.status === 'Ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : s.status === 'On Track'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${s.score}%` }} />
                  </div>
                  <span className="text-xs font-mono font-black text-slate-800">{s.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
