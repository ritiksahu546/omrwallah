import React from 'react';
import {
  FileText,
  AlertTriangle,
  Download,
  ArrowRight,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface ExamPageProps {
  onNavigate: (route: string) => void;
  onSelectTemplate?: (templateId: string) => void;
}

export const SscOMRGuidePage: React.FC<ExamPageProps> = ({ onNavigate, onSelectTemplate }) => {
  const faqs = [
    {
      q: 'What is the standard 100-question format used for SSC and State PSC practice?',
      a: 'A 100-question layout is typically arranged in 4 clean columns of 25 questions each, covering Quantitative Aptitude, Reasoning, General Awareness, and English.',
    },
    {
      q: 'Can I download the 100-question practice sheet in A4 PDF?',
      a: 'Yes, OMRWallah provides a free, instant 100-question A4 vector PDF format ready to print on any home or office printer.',
    },
    {
      q: 'Is OMRWallah associated with the Staff Selection Commission (SSC)?',
      a: 'No. OMRWallah is an independent educational tool for student preparation and has no affiliation with SSC or government recruitment boards.',
    },
  ];

  const relatedExamsAndTools = [
    {
      title: 'CTET 150Q OMR Sheet',
      desc: '150-question mock format for Central Teacher Eligibility Test and State TET exams.',
      route: 'ctet-omr-sheet',
      path: 'ctet-omr-sheet',
      tag: 'Related Exam',
    },
    {
      title: 'All Competitive Exam OMR Sheets',
      desc: 'Explore mock formats for NEET UG, JEE Main, CTET, CUET, and government exams.',
      route: 'omr-exams',
      path: 'omr-exams',
      tag: 'Exam Hub',
    },
    {
      title: 'OMR Sheet Generator',
      desc: 'Customize your own 100-question exam sheet with roll code grids and coaching headers.',
      route: 'omr-sheet-generator',
      path: 'omr-sheet-generator',
      tag: 'Custom Builder',
    },
    {
      title: 'OMR Sheet PDF Download',
      desc: 'Download instant print-ready vector A4 PDFs without watermarks.',
      route: 'omr-sheet-pdf',
      path: 'omr-sheet-pdf',
      tag: 'Printable PDF',
    },
    {
      title: 'OMR Practice Speed Training',
      desc: 'Practice timed bubbling drills to avoid negative marking and row shifting errors.',
      route: 'omr-practice',
      path: 'omr-practice',
      tag: 'Practice Guide',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GOVERNMENT EXAM PREP</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            SSC &amp; State PSC 100-Question OMR Practice Guide
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Download and print standard 100-question A4 OMR answer sheets for SSC CGL, CHSL, MTS, and State Public Service Commission mock practice using our{' '}
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-generator');
                }
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              OMR Sheet Generator
            </a>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  if (onSelectTemplate) onSelectTemplate('standard-100');
                  onNavigate('creator');
                }
              }}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Download 100Q Practice Sheet</span>
              <Download className="w-4 h-4" />
            </a>
            <a
              href="https://omrwallah.in/practice"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('practice');
                }
              }}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition"
            >
              Practice Online
            </a>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Informational Notice:</strong> OMRWallah is an independent educational tool. This mock practice sheet is designed for personal study and coaching tests. We have no affiliation with SSC, State PSCs, or government agencies.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
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

        {/* Related Exam OMR Sheets Section */}
        <RelatedToolsSection
          title="Related Exam OMR Sheets &amp; Tools"
          subtitle="Explore mock formats for teacher recruitment, central exams, and test practice."
          links={relatedExamsAndTools}
          onNavigate={onNavigate}
        />

        <div className="p-6 sm:p-8 bg-emerald-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Get 100-Question OMR Sheet Now</h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            100% free A4 vector PDF download without watermarks.
          </p>
          <a
            href="https://omrwallah.in/omr-sheet-generator"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                if (onSelectTemplate) onSelectTemplate('standard-100');
                onNavigate('creator');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Open 100Q Template
          </a>
        </div>
      </div>
    </div>
  );
};

