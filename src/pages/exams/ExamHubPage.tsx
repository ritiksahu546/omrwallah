import React from 'react';
import {
  GraduationCap,
  ArrowRight,
  AlertCircle,
  FileSpreadsheet,
  FileDown,
  Clock,
  Sparkles,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface ExamHubPageProps {
  onNavigate: (route: string) => void;
}

export const ExamHubPage: React.FC<ExamHubPageProps> = ({ onNavigate }) => {
  const exams = [
    {
      id: 'neet',
      route: 'neet-omr-sheet',
      path: 'neet-omr-sheet',
      title: 'NEET OMR Sheet',
      fullTitle: 'NEET OMR Sheet Format & Practice Guide',
      desc: '200 questions mock pattern with Section A (35Q) and Section B (15Q optional) structure across Physics, Chemistry, Botany, and Zoology.',
      questions: '200 Questions',
      tag: 'Medical Entrance',
    },
    {
      id: 'jee',
      route: 'jee-omr-sheet',
      path: 'jee-omr-sheet',
      title: 'JEE OMR Sheet',
      fullTitle: 'JEE OMR Sheet Practice Guide',
      desc: 'Paper-based mock practice layout for engineering aspirants preparing for offline test series and school entrance exams.',
      questions: '75-90 Questions',
      tag: 'Engineering Entrance',
    },
    {
      id: 'ssc',
      route: 'ssc-omr-sheet',
      path: 'ssc-omr-sheet',
      title: 'SSC OMR Sheet',
      fullTitle: 'SSC CGL / CHSL 100Q OMR Practice Guide',
      desc: '100 questions format across General Intelligence, General Awareness, Quantitative Aptitude, and English Comprehension.',
      questions: '100 Questions',
      tag: 'Government Exams',
    },
    {
      id: 'cuet',
      route: 'cuet-omr-sheet',
      path: 'cuet-omr-sheet',
      title: 'CUET OMR Sheet',
      fullTitle: 'CUET (UG) 50Q OMR Practice Guide',
      desc: 'Modular 50-question mock format for Central University entrance domain test practice.',
      questions: '50 Questions / Section',
      tag: 'University Admissions',
    },
    {
      id: 'ctet',
      route: 'ctet-omr-sheet',
      path: 'ctet-omr-sheet',
      title: 'CTET OMR Sheet',
      fullTitle: 'CTET 150Q OMR Sheet Practice Guide',
      desc: '150 questions format for Paper 1 and Paper 2 teacher eligibility mock assessments.',
      questions: '150 Questions',
      tag: 'Teaching Eligibility',
    },
  ];

  const relatedTools = [
    {
      title: 'OMR Sheet Generator',
      desc: 'Create custom question layouts, section dividers, and institute branding.',
      route: 'omr-sheet-generator',
      path: 'omr-sheet-generator',
      tag: 'Generator',
    },
    {
      title: 'OMR Sheet PDF Download',
      desc: 'Download clean, high-resolution blank A4 answer sheets ready for printing.',
      route: 'omr-sheet-pdf',
      path: 'omr-sheet-pdf',
      tag: 'PDF Export',
    },
    {
      title: 'Online OMR Practice',
      desc: 'Interactive timed bubbling simulator with countdown timer and instant evaluation.',
      route: 'practice',
      path: 'practice',
      tag: 'Mock Test',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>COMPETITIVE EXAM GUIDES &amp; TEMPLATES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Competitive Exam OMR Sheets &amp; Practice Guides
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Free practice guides, mock question layouts, and printable A4 answer sheet formats for major competitive examinations across India. Design your own using the{' '}
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
            </a>{' '}
            or explore ready-to-use{' '}
            <a
              href="https://omrwallah.in/templates"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('templates');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              free OMR sheet templates
            </a>
            .
          </p>
        </div>

        {/* Informational Disclaimer Box */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Disclaimer:</strong> OMRWallah is an independent educational tool designed for mock test preparation and practice. The templates and guides provided on this website are mock simulation formats for self-study and coaching evaluations. OMRWallah is not affiliated with, endorsed by, or representing NTA, CBSE, UPSC, SSC, or any official examination authority.
          </p>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200">
                    {exam.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{exam.questions}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 hover:text-blue-600 transition">
                  <a
                    href={`https://omrwallah.in/${exam.path}`}
                    onClick={(e) => {
                      if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                        e.preventDefault();
                        onNavigate(exam.route);
                      }
                    }}
                  >
                    {exam.fullTitle}
                  </a>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{exam.desc}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <a
                  href={`https://omrwallah.in/${exam.path}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate(exam.route);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Read {exam.title} Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://omrwallah.in/templates"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('templates');
                    }
                  }}
                  className="text-slate-600 hover:text-slate-900 font-semibold text-xs"
                >
                  Get Sheet PDF
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* RELATED EXAM OMR SHEETS SECTION (Mandatory Requirement) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Navigation</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Related Exam OMR Sheets
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Direct access to dedicated exam-specific bubbling patterns, question counts, and marking schemes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map((exam) => (
              <a
                key={exam.id}
                href={`https://omrwallah.in/${exam.path}`}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(exam.route);
                  }
                }}
                className="p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl transition group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                    {exam.tag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{exam.desc}</p>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* General Practice Advice with contextual internal links */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why Competitive Aspirants Need Physical OMR Practice
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            While solving questions on a screen is convenient for concept revision, competitive examinations require physical stamina and precise motor coordination. A slight slip of the pen or darkening the wrong row can cost 5 marks in a negative marking scheme (+4 / -1). Practicing with print-ready A4 sheets from our{' '}
            <a
              href="https://omrwallah.in/omr-sheet-pdf"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-pdf');
                }
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              OMR sheet PDF download
            </a>{' '}
            builds muscle memory and minimizes exam-day nervousness. You can also evaluate your speed with{' '}
            <a
              href="https://omrwallah.in/practice"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('practice');
                }
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              online OMR practice
            </a>{' '}
            before printing physical sheets.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://omrwallah.in/creator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('creator');
                }
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition inline-block text-center"
            >
              Generate Custom Exam Sheet
            </a>
            <a
              href="https://omrwallah.in/practice"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('practice');
                }
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition inline-block text-center"
            >
              Online Mock Practice
            </a>
          </div>
        </div>

        {/* Related OMR Tools Section */}
        <RelatedToolsSection
          title="Related OMR Tools"
          subtitle="Generate custom sheets, export blank A4 formats, and practice bubbling online."
          links={relatedTools}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
};

