import React from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Printer,
  Download,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface ExamPageProps {
  onNavigate: (route: string) => void;
  onSelectTemplate?: (templateId: string) => void;
}

export const NeetOMRGuidePage: React.FC<ExamPageProps> = ({ onNavigate, onSelectTemplate }) => {
  const faqs = [
    {
      q: 'What is the structure of the NEET practice OMR sheet?',
      a: 'The NEET mock practice format consists of 200 questions divided into Physics, Chemistry, Botany, and Zoology. Each subject features Section A (35 mandatory questions) and Section B (15 questions where candidates choose 10 to attempt).',
    },
    {
      q: 'Which pen should be used for NEET OMR bubbling?',
      a: 'A ballpoint pen (blue or black) with a medium tip is standard. Gel pens and fountain pens should never be used as ink bleeds through the paper.',
    },
    {
      q: 'How much time should I reserve for bubbling in NEET?',
      a: 'Experienced educators recommend allocating 25 to 30 minutes for bubbling, using a batch strategy (e.g. solving and bubbling 20-30 questions per subject block) rather than leaving all 180 questions for the last 15 minutes.',
    },
    {
      q: 'Is this an official NTA NEET OMR sheet?',
      a: 'No. This is an independent educational practice sheet created by OMRWallah for student mock preparation and self-assessment. We have no affiliation with the National Testing Agency (NTA).',
    },
  ];

  const relatedExamsAndTools = [
    {
      title: 'JEE Mock OMR Sheet',
      desc: 'PCM engineering entrance layout with Section A MCQs and numerical value questions.',
      route: 'jee-omr-sheet',
      path: 'jee-omr-sheet',
      tag: 'Related Exam',
    },
    {
      title: 'CUET 50Q OMR Sheet',
      desc: 'Standardized 50-question double-column practice sheet for CUET UG domain mock tests.',
      route: 'cuet-omr-sheet',
      path: 'cuet-omr-sheet',
      tag: 'Related Exam',
    },
    {
      title: 'OMR Sheet Generator',
      desc: 'Create custom question count answer sheets with personalized coaching headers.',
      route: 'omr-sheet-generator',
      path: 'omr-sheet-generator',
      tag: 'Custom Builder',
    },
    {
      title: 'OMR Sheet PDF Download',
      desc: 'Download printable vector A4 PDF sheets calibrated to standard office printers.',
      route: 'omr-sheet-pdf',
      path: 'omr-sheet-pdf',
      tag: 'Printable PDF',
    },
    {
      title: 'OMR Practice Speed Training',
      desc: 'Master the "Solve 20, Bubble 20" batch strategy to eliminate negative marking and row mismatch.',
      route: 'omr-practice',
      path: 'omr-practice',
      tag: 'Practice Guide',
    },
    {
      title: 'All Competitive Exam OMR Sheets',
      desc: 'Browse our full catalog of exam-specific mock practice sheets and templates.',
      route: 'omr-exams',
      path: 'omr-exams',
      tag: 'Exam Hub',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEET PRACTICE &amp; FORMAT GUIDE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            NEET OMR Sheet Format &amp; Practice Guide
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive guide to practicing the 200-question medical entrance mock pattern. Learn time-saving bubbling techniques, Section A/B strategies, and print practice sheets using our{' '}
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-generator');
                }
              }}
              className="text-rose-700 font-bold hover:underline"
            >
              OMR Sheet Generator
            </a>{' '}
            or explore all{' '}
            <a
              href="https://omrwallah.in/omr-exams"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-exams');
                }
              }}
              className="text-rose-700 font-bold hover:underline"
            >
              competitive exam OMR sheets
            </a>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  if (onSelectTemplate) onSelectTemplate('neet-200');
                  onNavigate('creator');
                }
              }}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Download NEET 200Q Practice Sheet</span>
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

        {/* Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Informational Notice:</strong> OMRWallah is an educational practice platform. This guide and our downloadable templates are mock materials intended solely for student exam readiness. OMRWallah is strictly independent and is not affiliated with, endorsed by, or authorized by the National Testing Agency (NTA).
          </p>
        </div>

        {/* Structure Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            NEET Mock Exam Pattern Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-600 uppercase">Physics</span>
              <h3 className="font-bold text-slate-900 text-base">50 Questions</h3>
              <p className="text-xs text-slate-600">Section A (Q1-35) + Section B (Q36-50, attempt 10).</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-600 uppercase">Chemistry</span>
              <h3 className="font-bold text-slate-900 text-base">50 Questions</h3>
              <p className="text-xs text-slate-600">Section A (Q51-85) + Section B (Q86-100, attempt 10).</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-600 uppercase">Botany</span>
              <h3 className="font-bold text-slate-900 text-base">50 Questions</h3>
              <p className="text-xs text-slate-600">Section A (Q101-135) + Section B (Q136-150, attempt 10).</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-xs font-bold text-rose-600 uppercase">Zoology</span>
              <h3 className="font-bold text-slate-900 text-base">50 Questions</h3>
              <p className="text-xs text-slate-600">Section A (Q151-185) + Section B (Q186-200, attempt 10).</p>
            </div>
          </div>
        </div>

        {/* Actionable Bubbling Strategies */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Top 4 Bubbling Strategies for NEET Aspirants
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900">1. Adopt the Subject Batch Method</h3>
              <p className="text-xs leading-relaxed">Solve Botany completely in your question booklet, then bubble Botany all at once. This protects cognitive momentum and avoids row confusion.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900">2. Section B Strategy (Count 10 Only)</h3>
              <p className="text-xs leading-relaxed">In Section B, only 10 questions are evaluated. Mark your chosen 10 in your booklet before placing any ink on the sheet.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900">3. Spiral Inward or Outward</h3>
              <p className="text-xs leading-relaxed">Start bubbling from the inside center and spiral outward to avoid pushing ink outside the perimeter border.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <h3 className="font-bold text-slate-900">4. Finger Anchor Checkpoint</h3>
              <p className="text-xs leading-relaxed">Keep your non-writing index finger firmly anchored on the question number in your booklet while your writing hand darkens the sheet. Check our complete <a href="https://omrwallah.in/omr-practice" onClick={(e) => { if (!e.ctrlKey && !e.metaKey && e.button === 0) { e.preventDefault(); onNavigate('omr-practice'); } }} className="text-rose-700 font-bold hover:underline">OMR Practice Guide</a> for more speed drills.</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions About NEET OMR
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
          subtitle="Explore mock formats for engineering, central university, and competitive entrance exams."
          links={relatedExamsAndTools}
          onNavigate={onNavigate}
        />

        {/* CTA */}
        <div className="p-6 sm:p-8 bg-rose-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Download Your Free NEET Practice Sheet</h2>
          <p className="text-sm sm:text-base text-rose-100 max-w-xl mx-auto">
            Get an authentic A4 PDF format ready to print for your next full-length mock exam.
          </p>
          <a
            href="https://omrwallah.in/omr-sheet-generator"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                if (onSelectTemplate) onSelectTemplate('neet-200');
                onNavigate('creator');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Open NEET Template in Creator
          </a>
        </div>
      </div>
    </div>
  );
};

