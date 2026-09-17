import React from 'react';
import {
  Download,
  Printer,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface SEOPageProps {
  onNavigate: (route: string) => void;
}

export const OMRSheetPdfLanding: React.FC<SEOPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'Are the downloaded OMR sheet PDFs high resolution?',
      a: 'Yes, our PDFs are generated using vector rendering with 300+ DPI equivalent sharpness, ensuring optical scanner markers and bubble perimeters print crisply without pixelation.',
    },
    {
      q: 'What paper size should I use to print the OMR PDF?',
      a: 'Standard A4 paper (210mm x 297mm) is the standard size. We recommend 70 GSM to 80 GSM white paper to prevent ink bleed-through when students darken bubbles with ballpoint pens.',
    },
    {
      q: 'Do I need to select "Fit to Page" when printing?',
      a: 'No, always select "Actual Size" (100% scale) in your printer settings to prevent distortion of registration timing marks.',
    },
    {
      q: 'Are there watermarks on the downloaded PDF?',
      a: 'No, all downloaded PDFs are 100% clean and free of watermarks.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-extrabold">
            <Download className="w-3.5 h-3.5" />
            <span>PRINT-READY PDF EXPORT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            OMR Sheet PDF – Download &amp; Print Free
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Download high-resolution, vector-calibrated A4 OMR sheet PDFs for standard 25, 50, 100, 180, and 200 question competitive practice exams.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="px-6 py-3 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>Download Ready PDF Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('creator')}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition cursor-pointer"
            >
              Generate Custom PDF
            </button>
          </div>
        </div>

        {/* Popular Formats Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Popular OMR Sheet PDF Formats
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">CLASSIC</span>
                <span className="text-xs text-slate-500 font-semibold">1 Page A4</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">50 Questions OMR PDF</h3>
              <p className="text-xs text-slate-600">Double column layout with roll number grid, candidate signature, and scoring box.</p>
              <button
                type="button"
                onClick={() => onNavigate('templates')}
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition cursor-pointer"
              >
                View 50Q Sheet
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">COMPETITIVE</span>
                <span className="text-xs text-slate-500 font-semibold">1 Page A4</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">100 Questions OMR PDF</h3>
              <p className="text-xs text-slate-600">Four column layout suitable for State PSCs, SSC CGL Tier-1, and CUET practice.</p>
              <button
                type="button"
                onClick={() => onNavigate('templates')}
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition cursor-pointer"
              >
                View 100Q Sheet
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 space-y-3 bg-slate-50">
              <div className="flex justify-between items-start">
                <span className="text-xs font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">MEDICAL</span>
                <span className="text-xs text-slate-500 font-semibold">1 Page A4</span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">200 Questions (Section A &amp; B)</h3>
              <p className="text-xs text-slate-600">Section A (35 questions) and Section B (15 optional) division for NEET mock practice.</p>
              <button
                type="button"
                onClick={() => onNavigate('templates')}
                className="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition cursor-pointer"
              >
                View 200Q Sheet
              </button>
            </div>
          </div>
        </div>

        {/* Printing Best Practices */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Printing Best Practices for Reliable Optical Reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <p><strong>Print at 100% Scale:</strong> Never choose "Shrink to Fit" or "Fit to Printable Area", which shifts corner registration marks.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <p><strong>Use 70 to 80 GSM Paper:</strong> Thinner paper can cause ink bleed-through when students press hard with ballpoint pens.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <p><strong>Clean Registration Corners:</strong> Keep corner black calibration squares sharp and free from printer streaks.</p>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
              <p><strong>Laser or Quality Inkjet:</strong> Both work seamlessly as long as black toner/ink density is consistent.</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-700" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions About OMR PDFs
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
        <div className="p-6 sm:p-8 bg-cyan-800 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Generate &amp; Download Your OMR Sheet PDF</h2>
          <p className="text-sm sm:text-base text-cyan-100 max-w-xl mx-auto">
            100% free vector PDF download ready for instant printing.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('creator')}
            className="px-6 py-3 bg-white text-cyan-900 hover:bg-cyan-50 font-bold text-sm rounded-xl transition cursor-pointer shadow-xs"
          >
            Create OMR PDF Now
          </button>
        </div>
      </div>
    </div>
  );
};
