import React from 'react';
import {
  PenTool,
  Timer,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Zap,
  Target,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface SEOPageProps {
  onNavigate: (route: string) => void;
}

export const OMRPracticeLanding: React.FC<SEOPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'Why should I practice bubbling on an OMR sheet before the actual exam?',
      a: 'In exams like NEET, UPSC, and State PSCs, bubbling takes 25 to 35 minutes of your total exam time. Incomplete darkening, row misalignment errors, or slow motor speed often cost candidates 10 to 30 marks. Regular timed practice builds physical muscle memory.',
    },
    {
      q: 'Can I practice online or should I practice on physical paper?',
      a: 'Both! OMRWallah allows you to download printable A4 PDFs to practice with an actual ballpoint pen, or use our digital practice mode with countdown timers and automated negative marking calculations on your phone or laptop.',
    },
    {
      q: 'What is the "Solve 20, Bubble 20" batching strategy?',
      a: 'Instead of bubbling after every single question (which breaks solving flow) or saving all bubbling for the last 10 minutes (which causes panic and catastrophic row misalignment), top scorers solve a batch of 15-20 questions in their booklet and then bubble that entire batch methodically.',
    },
    {
      q: 'How does OMRWallah calculate negative marking during practice?',
      a: 'Our practice engine allows you to configure marking schemes (e.g. +4 for correct, -1 for incorrect, 0 for unattempted) and provides an itemized score breakdown instantly.',
    },
  ];

  const relatedPracticeTools = [
    {
      title: 'Online OMR Practice Simulator',
      desc: 'Interactive timed bubbling simulator with live countdown timer and instant evaluation.',
      route: 'practice',
      path: 'practice',
      tag: 'Interactive Test',
    },
    {
      title: 'Online OMR Sheet Guide',
      desc: 'Learn digital bubbling mechanics, keyboard shortcuts, and full-screen exam simulation.',
      route: 'online-omr-sheet',
      path: 'online-omr-sheet',
      tag: 'Guide & Tool',
    },
    {
      title: 'Competitive Exam OMR Sheets',
      desc: 'Practice guides and formats for NEET UG, JEE Main, SSC CGL, CTET, and CUET.',
      route: 'omr-exams',
      path: 'omr-exams',
      tag: 'Exam Hub',
    },
    {
      title: 'OMR Sheet Generator',
      desc: 'Create custom question count answer sheets with personalized coaching headers.',
      route: 'omr-sheet-generator',
      path: 'omr-sheet-generator',
      tag: 'Generator',
    },
    {
      title: 'Free OMR Sheet Templates',
      desc: 'Pre-calibrated 20Q to 200Q printable A4 answer sheet formats.',
      route: 'templates',
      path: 'templates',
      tag: 'Templates',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-extrabold">
            <Target className="w-3.5 h-3.5" />
            <span>EXAM SIMULATION &amp; SPEED TRAINING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            OMR Practice Online – Build Speed &amp; Accuracy
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Eliminate negative marking, avoid row mismatch errors, and master bubbling speed under timed mock conditions with OMRWallah's{' '}
            <a
              href="https://omrwallah.in/practice"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('practice');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              interactive practice platform
            </a>
            .
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="https://omrwallah.in/practice"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('practice');
                }
              }}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Start Interactive Practice</span>
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
              Print Practice Sheets
            </a>
          </div>
        </div>

        {/* The 3 Pillars of OMR Practice */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            The 3 Pillars of Effective OMR Practice
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Time Allocation Discipline</h3>
              <p className="text-xs text-slate-600">Train yourself to complete bubbling within 7-10 seconds per question without rushing or hesitating.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Row Drift Prevention</h3>
              <p className="text-xs text-slate-600">Develop the mental checkpoint habit: glance at booklet question number, then locate the exact row before darkening.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Negative Marking Control</h3>
              <p className="text-xs text-slate-600">Know when to skip doubtful questions rather than losing hard-earned marks to guessing penalties.</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 pt-2 leading-relaxed">
            Preparing for national competitive entrance tests? Check our dedicated{' '}
            <a
              href="https://omrwallah.in/omr-exams"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-exams');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              Competitive Exam OMR Sheets
            </a>{' '}
            guide for exam-specific question layouts, or learn digital mechanics with our{' '}
            <a
              href="https://omrwallah.in/online-omr-sheet"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('online-omr-sheet');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              online OMR sheet guide
            </a>
            .
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Frequently Asked Questions About OMR Practice
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
          title="Related OMR Tools & Exam Guides"
          subtitle="Explore our digital practice simulator, exam guides, and printable A4 templates."
          links={relatedPracticeTools}
          onNavigate={onNavigate}
        />

        {/* CTA */}
        <div className="p-6 sm:p-8 bg-blue-600 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Begin Your OMR Practice Session</h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Test your answering speed and accuracy with timed mock assessments.
          </p>
          <a
            href="https://omrwallah.in/practice"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                onNavigate('practice');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Launch Practice Mode Now
          </a>
        </div>
      </div>
    </div>
  );
};

