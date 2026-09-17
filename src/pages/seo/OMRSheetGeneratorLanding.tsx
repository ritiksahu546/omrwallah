import React from 'react';
import {
  Sparkles,
  Printer,
  Download,
  CheckCircle2,
  ArrowRight,
  Sliders,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SEOPageProps {
  onNavigate: (route: string) => void;
}

export const OMRSheetGeneratorLanding: React.FC<SEOPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'How does the online OMR sheet generator work?',
      a: 'The OMR sheet generator allows you to configure question counts (from 10 to 300), select bubble options (A-D, A-E), add custom institute branding, set roll number formats, and generate a print-ready vector PDF in seconds.',
    },
    {
      q: 'Can I download the generated OMR sheet in A4 PDF format?',
      a: 'Yes, every generated sheet is mathematically calibrated to standard A4 dimensions (210mm x 297mm) with corner registration marks and optical timing tracks for laser and inkjet printers.',
    },
    {
      q: 'Is there a cost to generate OMR sheets online?',
      a: 'Basic OMR sheet generation, layout customization, and standard PDF downloads are 100% free with no watermark.',
    },
    {
      q: 'Can I customize subject headers like Physics, Chemistry, and Biology?',
      a: 'Yes, our generator allows you to enable multi-subject sections with specific question ranges, negative marking indicators, and instructions.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ONLINE OMR GENERATION TOOL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Online OMR Sheet Generator
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create custom, print-ready A4 Optical Mark Recognition answer sheets for mock exams, schools, and competitive coaching tests with complete layout flexibility.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('creator')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Launch OMR Generator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition cursor-pointer"
            >
              Browse Ready Templates
            </button>
          </div>
        </div>

        {/* What the Tool Does */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            What is the OMR Sheet Generator?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            The OMR Sheet Generator by OMRWallah is a browser-based utility engineered to design optical answer sheets with millimeter precision. Whether you need a short 20-question classroom quiz or a comprehensive 200-question competitive mock exam, our generator automatically balances grid density, margins, and timing tracks so your sheets scan reliably on optical evaluation software and mobile camera scanners.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Custom Question Layouts</h3>
              <p className="text-xs text-slate-600">Choose from 1 to 4 columns, question groupings, and custom numbering schemes.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Calibrated A4 Dimensions</h3>
              <p className="text-xs text-slate-600">Strict margins ensure compatibility with standard office laser and inkjet printers.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Optical Timing Tracks</h3>
              <p className="text-xs text-slate-600">Corner registration marks and alignment tracks enable automated software reading.</p>
            </div>
          </div>
        </div>

        {/* Who It Is For */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Who Should Use This Generator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-900 text-base">Coaching Institutes</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Produce authentic weekly test series with institute logos, batch codes, and multi-subject sections matching actual exam formats.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-900 text-base">School Teachers & Educators</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Conduct chapter tests, Olympiad mock evaluations, and term assessments without expensive specialized stationery.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-900 text-base">Self-Study Aspirants</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Practice filling physical bubbles with a ballpoint pen under strict timer conditions to eliminate exam-day bubbling errors.
              </p>
            </div>
          </div>
        </div>

        {/* How to Use It */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            How to Generate an OMR Sheet in 4 Steps
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">STEP 1</span>
              <h3 className="font-bold text-slate-900 text-sm">Select Questions</h3>
              <p className="text-xs text-slate-600">Pick the total number of questions and columns.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">STEP 2</span>
              <h3 className="font-bold text-slate-900 text-sm">Add Branding</h3>
              <p className="text-xs text-slate-600">Input exam name, institute header, and roll number fields.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">STEP 3</span>
              <h3 className="font-bold text-slate-900 text-sm">Live Preview</h3>
              <p className="text-xs text-slate-600">Review the live A4 preview to ensure perfect spacing.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">STEP 4</span>
              <h3 className="font-bold text-slate-900 text-sm">Download PDF</h3>
              <p className="text-xs text-slate-600">Export high-resolution PDF ready for print.</p>
            </div>
          </div>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => onNavigate('creator')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition cursor-pointer"
            >
              Start Generating OMR Sheet
            </button>
          </div>
        </div>

        {/* Visible FAQs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
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

        {/* Bottom CTA & Internal Links */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Create Your Custom OMR Sheet?</h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Design your exam sheets online without software installation. 100% free and print-ready.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('creator')}
              className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl transition cursor-pointer shadow-xs"
            >
              Create OMR Sheet Now
            </button>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="px-6 py-3 bg-blue-800/60 hover:bg-blue-800 text-white font-bold text-sm rounded-xl border border-blue-400/40 transition cursor-pointer"
            >
              Try Online Practice Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
