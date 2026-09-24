import React from 'react';
import {
  School,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface SEOPageProps {
  onNavigate: (route: string) => void;
}

export const OMRSchoolsLanding: React.FC<SEOPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'How can school teachers use OMRWallah for classroom tests?',
      a: 'Teachers can generate 20 to 50 question unit test sheets with the school name, class/section fields, student admission numbers, and exam date, and print them on standard office printers in minutes.',
    },
    {
      q: 'Can teachers print 2 mini OMR sheets on one A4 paper?',
      a: 'Yes, our 2-sheets-per-page option is popular among schools for daily quizzes and chapter reviews because it cuts printing and paper costs in half.',
    },
    {
      q: 'Is OMRWallah suitable for CBSE and State Board mock exams?',
      a: 'Yes, you can format multiple-choice question sheets matching CBSE Class 10 and 12 term assessment structures as well as Olympiad formats.',
    },
    {
      q: 'Do teachers need special scanning machines to check these sheets?',
      a: 'No. Teachers can check sheets visually with an answer overlay or use our built-in camera scanner on a smartphone or tablet.',
    },
  ];

  const relatedTools = [
    {
      title: 'OMR Sheet Generator',
      desc: 'Build customized A4 answer sheets with school name, class, section, and subject tags.',
      route: 'omr-sheet-generator',
      path: 'omr-sheet-generator',
      tag: 'Custom Builder',
    },
    {
      title: 'Free OMR Sheet Templates',
      desc: 'Download standardized 20, 50, and 100 question templates ready for immediate classroom printing.',
      route: 'templates',
      path: 'templates',
      tag: 'Templates Library',
    },
    {
      title: 'Online OMR Practice',
      desc: 'Let students practice bubbling digitally with countdown timers and automated scorecards.',
      route: 'practice',
      path: 'practice',
      tag: 'Student Practice',
    },
    {
      title: 'OMR Sheet for Coaching',
      desc: 'Enterprise multi-section formats for test series and coaching academies.',
      route: 'omr-sheet-for-coaching',
      path: 'omr-sheet-for-coaching',
      tag: 'Coaching Hub',
    },
    {
      title: 'OMR Sheet PDF Download',
      desc: 'Export high-resolution blank A4 sheets compatible with school photocopy machines.',
      route: 'omr-sheet-pdf',
      path: 'omr-sheet-pdf',
      tag: 'Vector PDF',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
            <School className="w-3.5 h-3.5" />
            <span>FOR SCHOOLS &amp; EDUCATORS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            OMR Sheet for Schools &amp; Teachers
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Fast, print-ready OMR answer sheets designed for classroom quizzes, term examinations, and Olympiad mock tests using our{' '}
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-generator');
                }
              }}
              className="text-amber-800 font-bold hover:underline"
            >
              OMR Sheet Generator
            </a>
            . Simple for students, effortless for teachers.
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
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Design School OMR Sheet</span>
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
              Classroom Templates
            </a>
          </div>
        </div>

        {/* Benefits for Schools */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why Schools Choose OMRWallah
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Prepares Students Early</h3>
              <p className="text-xs text-slate-600">Train middle and high school students to bubble accurately before high-stakes board and entrance exams.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Save Grading Hours</h3>
              <p className="text-xs text-slate-600">Objective grading eliminates manual paper checking, freeing up valuable teacher preparation time.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Custom School Headers</h3>
              <p className="text-xs text-slate-600">Include School Name, Class, Section, Roll Number, and Subject on every student sheet.</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 pt-2 leading-relaxed">
            Teachers can also assign self-study drills through our{' '}
            <a
              href="https://omrwallah.in/practice"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('practice');
                }
              }}
              className="text-amber-800 font-bold hover:underline"
            >
              online OMR practice tool
            </a>{' '}
            to help students practice filling bubbles under timed constraints without wasting paper.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions for Schools
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

        {/* Related OMR Tools Section */}
        <RelatedToolsSection
          title="Related OMR Tools & Templates"
          subtitle="Generate classroom answer sheets, explore school templates, and simulate tests."
          links={relatedTools}
          onNavigate={onNavigate}
        />

        {/* CTA */}
        <div className="p-6 sm:p-8 bg-amber-600 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Empower Your School Assessments</h2>
          <p className="text-sm sm:text-base text-amber-100 max-w-xl mx-auto">
            Design, print, and administer standardized classroom evaluations with zero hassle.
          </p>
          <a
            href="https://omrwallah.in/creator"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                onNavigate('creator');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-amber-800 hover:bg-amber-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Create Free School OMR
          </a>
        </div>
      </div>
    </div>
  );
};

