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

  const relatedExamsAndTools = [
    {
      title: 'NEET OMR Sheet Guide',
      desc: '200-question medical entrance mock format with Physics, Chemistry, Botany, and Zoology sections.',
      route: 'neet-omr-sheet',
      path: 'neet-omr-sheet',
      tag: 'Related Exam',
    },
    {
      title: 'JEE Mock OMR Sheet',
      desc: 'PCM engineering entrance layout with Section A MCQs and numerical value questions.',
      route: 'jee-omr-sheet',
      path: 'jee-omr-sheet',
      tag: 'Related Exam',
    },
    {
      title: 'All Competitive Exam OMR Sheets',
      desc: 'Browse complete catalog of national entrance exam practice sheets and formats.',
      route: 'omr-exams',
      path: 'omr-exams',
      tag: 'Exam Hub',
    },
    {
      title: 'OMR Sheet Generator',
      desc: 'Design custom 50-question domain test sheets with your coaching name and test series code.',
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
      desc: 'Practice rapid bubbling to complete domain subjects with maximum accuracy.',
      route: 'omr-practice',
      path: 'omr-practice',
      tag: 'Practice Guide',
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
            Download 50-question mock OMR answer sheets for Common University Entrance Test (CUET UG) domain and general test preparation using our{' '}
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-generator');
                }
              }}
              className="text-violet-700 font-bold hover:underline"
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
                  if (onSelectTemplate) onSelectTemplate('standard-50');
                  onNavigate('creator');
                }
              }}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Download 50Q CUET Practice Sheet</span>
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

        {/* Related Exam OMR Sheets Section */}
        <RelatedToolsSection
          title="Related Exam OMR Sheets &amp; Tools"
          subtitle="Explore mock formats for medical, engineering, and central entrance exams."
          links={relatedExamsAndTools}
          onNavigate={onNavigate}
        />

        <div className="p-6 sm:p-8 bg-violet-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Generate CUET Mock Practice Sheet</h2>
          <p className="text-sm sm:text-base text-violet-100 max-w-xl mx-auto">
            Get instant print-ready A4 PDFs for your domain mock tests.
          </p>
          <a
            href="https://omrwallah.in/omr-sheet-generator"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                if (onSelectTemplate) onSelectTemplate('standard-50');
                onNavigate('creator');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-violet-800 hover:bg-violet-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Create CUET Practice Sheet
          </a>
        </div>
      </div>
    </div>
  );
};

