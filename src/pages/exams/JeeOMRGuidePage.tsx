import React from 'react';
import {
  FileText,
  AlertTriangle,
  Download,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface ExamPageProps {
  onNavigate: (route: string) => void;
  onSelectTemplate?: (templateId: string) => void;
}

export const JeeOMRGuidePage: React.FC<ExamPageProps> = ({ onNavigate, onSelectTemplate }) => {
  const faqs = [
    {
      q: 'Is JEE Main conducted on paper OMR or online CBT?',
      a: 'JEE Main is officially conducted in Computer Based Test (CBT) mode. However, most leading coaching institutes (such as in Kota, Hyderabad, and Delhi) administer regular offline paper-based mock tests with OMR answer sheets to build problem-solving stamina and evaluate students in physical exam environments.',
    },
    {
      q: 'What is the question format for JEE mock practice sheets?',
      a: 'A typical JEE practice sheet covers Physics, Chemistry, and Mathematics with multiple-choice questions (MCQs) and numerical value sections, totaling 75 to 90 questions.',
    },
    {
      q: 'How does OMRWallah help JEE aspirants?',
      a: 'OMRWallah enables students and coaching centers to download customized 75-90 question practice sheets formatted for Physics, Chemistry, and Math with +4 / -1 negative marking indicators.',
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
      title: 'CUET 50Q OMR Sheet',
      desc: 'Double-column 50-question answer sheet template for central university entrance mocks.',
      route: 'cuet-omr-sheet',
      path: 'cuet-omr-sheet',
      tag: 'Related Exam',
    },
    {
      title: 'OMR Sheet Generator',
      desc: 'Build customized PCM mock sheets with your institute name and test series codes.',
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
      desc: 'Learn time allocation discipline and row drift prevention techniques.',
      route: 'omr-practice',
      path: 'omr-practice',
      tag: 'Practice Guide',
    },
    {
      title: 'All Competitive Exam OMR Sheets',
      desc: 'Explore mock formats for NEET, JEE, SSC CGL, CTET, and CUET.',
      route: 'omr-exams',
      path: 'omr-exams',
      tag: 'Exam Hub',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ENGINEERING PRACTICE GUIDE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            JEE Mock OMR Sheet &amp; Practice Guide
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Format your PCM engineering mock test series with customized 75-90 question A4 OMR answer sheets using our{' '}
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-generator');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              OMR Sheet Generator
            </a>
            . Ideal for classroom practice, coaching mock tests, and self-assessment.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  if (onSelectTemplate) onSelectTemplate('jee-main');
                  onNavigate('creator');
                }
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Download JEE Practice Sheet</span>
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
              Practice Online With Timer
            </a>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Informational Notice:</strong> OMRWallah is an independent educational tool. This mock practice sheet is designed for personal study and coaching tests. We have no affiliation with NTA, IITs, or official JEE examination authorities.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why Engineering Aspirants Practice with Paper OMRs
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Even though the official examination is computer-based, intense pencil-and-paper problem solving remains the gold standard for mastering deep mathematical and physics derivations. Practicing on physical answer sheets helps students maintain structured test-taking discipline without screen fatigue. You can also explore our{' '}
            <a
              href="https://omrwallah.in/neet-omr-sheet"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('neet-omr-sheet');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              NEET OMR Sheet Guide
            </a>{' '}
            and{' '}
            <a
              href="https://omrwallah.in/cuet-omr-sheet"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('cuet-omr-sheet');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              CUET OMR Sheet Guide
            </a>{' '}
            for cross-exam preparation.
          </p>
        </div>

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

        {/* Related Exam OMR Sheets Section */}
        <RelatedToolsSection
          title="Related Exam OMR Sheets &amp; Tools"
          subtitle="Explore mock formats for medical, central university, and competitive exams."
          links={relatedExamsAndTools}
          onNavigate={onNavigate}
        />

        <div className="p-6 sm:p-8 bg-blue-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Generate Custom JEE Practice Sheet</h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Design your PCM question layout and download a vector A4 PDF in seconds.
          </p>
          <a
            href="https://omrwallah.in/omr-sheet-generator"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                onNavigate('creator');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Create Engineering Mock Sheet
          </a>
        </div>
      </div>
    </div>
  );
};

