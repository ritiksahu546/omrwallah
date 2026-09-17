import React from 'react';
import {
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  Printer,
  FileSpreadsheet,
} from 'lucide-react';

interface SEOPageProps {
  onNavigate: (route: string) => void;
}

export const OMRCoachingLanding: React.FC<SEOPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'Can coaching institutes add their custom institute logo to the OMR sheet?',
      a: 'Yes, OMRWallah allows coaching centers to add institute names, branch details, test series codes, and custom header notes to give mock tests a branded, professional look.',
    },
    {
      q: 'Does it support Section A and Section B optional question patterns for NEET/JEE?',
      a: 'Yes, our generator supports multi-section structures with custom question numbering, starting offsets, and section labels.',
    },
    {
      q: 'Can we print these OMR sheets on regular Xerox or laser printers?',
      a: 'Yes! Our sheets are mathematically formatted for standard A4 paper, allowing coaching centers to print test batches using standard office printers without expensive specialized OMR paper.',
    },
    {
      q: 'How does OMRWallah help coaching centers evaluate bulk mock tests?',
      a: 'Our platform pairs printable test sheets with an integrated mobile camera scanner and digital evaluation pipeline, allowing faculty to scan and evaluate batches quickly.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
            <Building2 className="w-3.5 h-3.5" />
            <span>FOR COACHING INSTITUTES &amp; ACADEMIES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            OMR Sheet for Coaching Institutes
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Design, brand, and print customized A4 OMR answer sheets for weekly test series, rank booster mock exams, and batch-wise assessments.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('creator')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Design Institute OMR Sheet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('pricing')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition cursor-pointer"
            >
              Explore Coaching Plans
            </button>
          </div>
        </div>

        {/* Benefits for Coaching */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Engineered for High-Volume Test Series
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Full Institute Branding</h3>
              <p className="text-xs text-slate-600">Add your academy name, tagline, branch locator, and test series code on every sheet.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Batch &amp; Roll Number Grids</h3>
              <p className="text-xs text-slate-600">Customizable 4 to 12 digit roll number bubbles tailored to your student ERP IDs.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Printer className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Massive Cost Savings</h3>
              <p className="text-xs text-slate-600">Print on standard 75 GSM A4 paper using regular office printers. No expensive OMR stationery required.</p>
            </div>
          </div>
        </div>

        {/* Exam Patterns Supported */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Supported Competitive Exam Formats
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Coaching centers across India use OMRWallah to prepare mock tests for NEET (UG) 200-question formats, JEE Main 75-question formats, UPSC Prelims 100-question General Studies papers, and State PSC test series.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="font-black text-slate-900 text-sm">NEET 200Q</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Section A + B</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="font-black text-slate-900 text-sm">JEE Main 75Q</span>
              <p className="text-[11px] text-slate-500 mt-0.5">PCM Grid</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="font-black text-slate-900 text-sm">UPSC / SSC 100Q</span>
              <p className="text-[11px] text-slate-500 mt-0.5">General Studies</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="font-black text-slate-900 text-sm">Custom 20-300Q</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Modular</p>
            </div>
          </div>
        </div>

        {/* Visible FAQs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions for Coaching Institutes
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

        {/* CTA */}
        <div className="p-6 sm:p-8 bg-blue-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Upgrade Your Coaching Test Series Today</h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Design branded test papers that provide students with genuine exam-hall practice.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('creator')}
            className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl transition cursor-pointer shadow-xs"
          >
            Create Institute OMR Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
