import React from 'react';
import {
  FileText,
  AlertTriangle,
  Download,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface ExamPageProps {
  onNavigate: (route: string) => void;
  onSelectTemplate?: (templateId: string) => void;
}

export const CuetOMRGuidePage: React.FC<ExamPageProps> = ({ onNavigate, onSelectTemplate }) => {
  const faqs = [
    {
      q: 'How many questions are typically in a CUET domain subject mock test?',
      a: 'A standard CUET domain subject test comprises 50 questions, where students are generally expected to attempt 40 questions within the stipulated time limit.',
    },
    {
      q: 'Can I generate a 50-question OMR sheet for CUET practice?',
      a: 'Yes, OMRWallah has a dedicated 50-question template with double-column layout, perfect for CUET domain mock evaluations.',
    },
    {
      q: 'Is OMRWallah officially affiliated with CUET or NTA?',
      a: 'No, OMRWallah is an independent educational tool designed solely for candidate practice and self-study.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 text-violet-800 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNIVERSITY ENTRANCE PREP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            CUET 50-Question OMR Practice Sheet &amp; Guide
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Download 50-question mock OMR answer sheets for Common University Entrance Test (CUET UG) domain and general test preparation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onSelectTemplate) onSelectTemplate('standard-50');
                onNavigate('creator');
              }}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Download 50Q CUET Practice Sheet</span>
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition cursor-pointer"
            >
              Practice Online
            </button>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Informational Notice:</strong> OMRWallah is an independent educational tool. This mock practice sheet is designed for personal study. We have no affiliation with CUET, UGC, or NTA.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-violet-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Generate CUET Mock Practice Sheet</h2>
          <p className="text-sm sm:text-base text-violet-100 max-w-xl mx-auto">
            Get instant print-ready A4 PDFs for your domain mock tests.
          </p>
          <button
            type="button"
            onClick={() => {
              if (onSelectTemplate) onSelectTemplate('standard-50');
              onNavigate('creator');
            }}
            className="px-6 py-3 bg-white text-violet-800 hover:bg-violet-50 font-bold text-sm rounded-xl transition cursor-pointer shadow-xs"
          >
            Create CUET Practice Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
