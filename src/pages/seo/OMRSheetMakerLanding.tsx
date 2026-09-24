import React from 'react';
import {
  Sliders,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  FileSpreadsheet,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface SEOPageProps {
  onNavigate: (route: string) => void;
}

export const OMRSheetMakerLanding: React.FC<SEOPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'What is the difference between an OMR maker and a generic template?',
      a: 'A generic template is fixed and unchangeable, whereas our OMR Sheet Maker lets you customize every design parameter: circle bubble sizes, spacing, roll number columns, section headings, school logos, and exam series sets.',
    },
    {
      q: 'Can I set roll number bubbles for my institute exams?',
      a: 'Yes! You can configure roll number matrices from 4 to 12 digits, as well as boxes, bubbles, or combined formats.',
    },
    {
      q: 'Can I design 2 sheets on a single A4 page to save printing paper?',
      a: 'Yes, our maker supports 1 or 2 sheets per A4 page, which is ideal for 20-30 question daily classroom quizzes.',
    },
    {
      q: 'Do I need graphic design software to make OMR sheets?',
      a: 'No. The entire maker runs in your web browser with a real-time live preview, producing publication-grade vector documents without Photoshop or CorelDraw.',
    },
  ];

  const relatedTools = [
    {
      title: 'OMR Sheet Generator',
      desc: 'Create custom question count answer sheets with personalized coaching headers.',
      route: 'omr-sheet-generator',
      path: 'omr-sheet-generator',
      tag: 'Custom Builder',
    },
    {
      title: 'OMR Sheet PDF Download',
      desc: 'Download high-resolution, print-ready vector A4 OMR PDFs for 50, 100, and 200 questions.',
      route: 'omr-sheet-pdf',
      path: 'omr-sheet-pdf',
      tag: 'Printable PDF',
    },
    {
      title: 'Ready OMR Templates',
      desc: 'Browse pre-built standard formats for coaching institutes, schools, and competitive tests.',
      route: 'templates',
      path: 'templates',
      tag: 'Pre-made Formats',
    },
    {
      title: 'OMR Practice Speed Training',
      desc: 'Build bubbling muscle memory and eliminate negative marking with timed speed drills.',
      route: 'omr-practice',
      path: 'omr-practice',
      tag: 'Practice Guide',
    },
    {
      title: 'Competitive Exam OMR Sheets',
      desc: 'Explore mock formats for NEET UG, JEE Main, SSC CGL, CTET, and CUET.',
      route: 'omr-exams',
      path: 'omr-exams',
      tag: 'Exam Hub',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold">
            <Sliders className="w-3.5 h-3.5" />
            <span>CUSTOM DESIGN STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            OMR Sheet Maker Online
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Design professional, customized Optical Mark Recognition answer sheets with custom bubble styles, roll number grids, and institutional branding. You can also export to{' '}
            <a
              href="https://omrwallah.in/omr-sheet-pdf"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-pdf');
                }
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              print-ready A4 PDF
            </a>{' '}
            or choose from{' '}
            <a
              href="https://omrwallah.in/templates"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('templates');
                }
              }}
              className="text-indigo-600 font-bold hover:underline"
            >
              ready templates
            </a>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://omrwallah.in/creator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('creator');
                }
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Open OMR Maker</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://omrwallah.in/templates"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('templates');
                }
              }}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition"
            >
              View Sample Formats
            </a>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Precision Design Controls for Every Assessment
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Maximize2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Bubble Geometry &amp; Sizing</h3>
              <p className="text-xs text-slate-600">Select circle, square, or rounded bubbles with small, medium, or large optical radiuses.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Flexible Identification Blocks</h3>
              <p className="text-xs text-slate-600">Configure candidate name, roll number, center code, exam series code, and signature fields.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Multi-Subject Sectioning</h3>
              <p className="text-xs text-slate-600">Divide questions into sections (e.g., Section A &amp; Section B) with individual subheadings.</p>
            </div>
          </div>
        </div>

        {/* Design Guide */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            How to Make a Custom OMR Sheet
          </h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              1. <strong>Set Total Questions and Options:</strong> Standard exams use 4 options (A, B, C, D), but you can also configure 5 options (A-E) or true/false formats.
            </p>
            <p>
              2. <strong>Adjust Column Spacing:</strong> For 50 questions, a 2-column layout provides generous bubble spacing. For 180 to 200 questions, a 4-column balanced grid keeps the entire sheet cleanly on a single A4 page.
            </p>
            <p>
              3. <strong>Brand Your Test:</strong> Insert school names, exam titles, instructions, and negative marking guidelines to give candidates authentic mock conditions.
            </p>
            <p>
              4. <strong>Download Print-Ready PDF:</strong> Once satisfied with the preview, export a vector PDF ready for immediate reproduction.
            </p>
          </div>
        </div>

        {/* Visible FAQs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
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

        {/* Related Tools Section */}
        <RelatedToolsSection
          title="Related OMR Tools &amp; Resources"
          subtitle="Explore complementary builders, print-ready PDFs, and exam mock templates."
          links={relatedTools}
          onNavigate={onNavigate}
        />

        {/* CTA */}
        <div className="p-6 sm:p-8 bg-indigo-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Start Making Your Custom OMR Sheet</h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Design custom sheets tailored to your exact syllabus and paper requirements.
          </p>
          <a
            href="https://omrwallah.in/creator"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                onNavigate('creator');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Launch OMR Sheet Maker
          </a>
        </div>
      </div>
    </div>
  );
};

