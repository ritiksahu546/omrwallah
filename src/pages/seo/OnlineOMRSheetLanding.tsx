import React from 'react';
import {
  Smartphone,
  Zap,
  Timer,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { RelatedToolsSection } from '../../components/common/RelatedToolsSection';

interface SEOPageProps {
  onNavigate: (route: string) => void;
}

export const OnlineOMRSheetLanding: React.FC<SEOPageProps> = ({ onNavigate }) => {
  const faqs = [
    {
      q: 'Can I practice filling an OMR sheet directly on my mobile or laptop?',
      a: 'Yes, our interactive Online OMR Sheet allows you to tap or click bubbles with realistic darkening animations, a countdown timer, and negative marking tracking.',
    },
    {
      q: 'Does the online sheet calculate negative marking automatically?',
      a: 'Yes, it provides instant automated evaluation with +4 for correct and -1 for wrong answers (or custom marking schemes), along with accuracy percentages and subject breakdowns.',
    },
    {
      q: 'Can I upload a custom answer key to evaluate my test?',
      a: 'Yes! You can paste or input your official answer key, and the system compares your marked bubbles instantly upon completion.',
    },
    {
      q: 'Is my test progress saved if I accidentally close the tab?',
      a: 'Yes, ongoing practice responses are preserved in local state so you never lose your answers during an active session.',
    },
  ];

  const relatedTools = [
    {
      title: 'Online OMR Practice',
      desc: 'Interactive timed bubbling simulator with countdown timer and automated score report.',
      route: 'practice',
      path: 'practice',
      tag: 'Practice Tool',
    },
    {
      title: 'OMR Practice Speed Guide',
      desc: 'Master the "Solve 20, Bubble 20" strategy and prevent row drift in competitive exams.',
      route: 'omr-practice',
      path: 'omr-practice',
      tag: 'Speed Training',
    },
    {
      title: 'Competitive Exam OMR Sheets',
      desc: 'Dedicated exam-specific guides and bubble layouts for NEET, JEE, SSC, and CTET.',
      route: 'omr-exams',
      path: 'omr-exams',
      tag: 'Exam Guides',
    },
    {
      title: 'OMR Sheet Generator',
      desc: 'Generate customized A4 answer sheets with custom subjects and roll number grids.',
      route: 'omr-sheet-generator',
      path: 'omr-sheet-generator',
      tag: 'Generator',
    },
    {
      title: 'Free OMR Sheet Templates',
      desc: 'Browse and print standardized 20 to 200 questions blank OMR answer sheets.',
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>DIGITAL INTERACTIVE OMR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Online OMR Sheet – Practice &amp; Evaluate Digitally
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Experience realistic OMR bubbling directly on your phone, tablet, or desktop. Practice time management with countdown timers and instant automated scoring using our{' '}
            <a
              href="https://omrwallah.in/practice"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('practice');
                }
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              online OMR practice tool
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
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Start Online OMR Practice</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://omrwallah.in/omr-sheet-generator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('omr-sheet-generator');
                }
              }}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl border border-slate-300 shadow-xs transition"
            >
              Print Paper OMR Sheet
            </a>
          </div>
        </div>

        {/* Key Digital Features */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Why Practice with an Online OMR Sheet?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Timer className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">Exam Countdown Timer</h3>
              <p className="text-xs text-slate-600">Simulate real examination constraints with custom test durations and alert chimes.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <Zap className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">Instant Scoring &amp; Review</h3>
              <p className="text-xs text-slate-600">See correct vs wrong attempts, negative deductions, and net percentage immediately.</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Subject-wise Analytics</h3>
              <p className="text-xs text-slate-600">Break down your performance across Physics, Chemistry, Biology, or General Knowledge.</p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            How Online OMR Practice Works
          </h2>
          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              1. <strong>Select Your Question Count:</strong> Choose between quick 20-question speed drills, 50-question chapter mocks, or full 180-200 question simulations. If you need exam-specific guidelines, explore our{' '}
              <a
                href="https://omrwallah.in/omr-exams"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('omr-exams');
                  }
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                Competitive Exam OMR Sheets
              </a>{' '}
              hub.
            </p>
            <p>
              2. <strong>Tap to Darken Bubbles:</strong> As you solve questions from your practice test booklet or PDF, tap the corresponding circle (A, B, C, D) just as you would darken a physical paper sheet. Check our{' '}
              <a
                href="https://omrwallah.in/omr-practice"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('omr-practice');
                  }
                }}
                className="text-emerald-700 font-bold hover:underline"
              >
                OMR practice speed training guide
              </a>{' '}
              to optimize bubbling rhythm.
            </p>
            <p>
              3. <strong>Submit for Detailed Analysis:</strong> Click Complete Test to generate an instantaneous digital scorecard highlighting accuracy, time elapsed, and skipped items.
            </p>
          </div>
        </div>

        {/* FAQs */}
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

        {/* Related OMR Tools Section */}
        <RelatedToolsSection
          title="Related OMR Tools & Exam Guides"
          subtitle="Discover custom sheet generators, printable templates, and exam practice resources."
          links={relatedTools}
          onNavigate={onNavigate}
        />

        {/* CTA */}
        <div className="p-6 sm:p-8 bg-emerald-700 rounded-2xl text-white text-center space-y-4 shadow-md">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Practice Online?</h2>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            Improve your answering speed and accuracy with interactive digital OMR sheets.
          </p>
          <a
            href="https://omrwallah.in/practice"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                onNavigate('practice');
              }
            }}
            className="inline-block px-6 py-3 bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm rounded-xl transition shadow-xs"
          >
            Launch Online OMR Practice
          </a>
        </div>
      </div>
    </div>
  );
};

