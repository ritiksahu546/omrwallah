import React from 'react';
import {
  Check,
  Sparkles,
  Building2,
  GraduationCap,
  HelpCircle,
  Clock,
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: string) => void;
  onUpgradeClick: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onNavigate,
  onUpgradeClick,
}) => {
  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Core OMR Creator, PDF & Scanner Features Are Free</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Transparent Plans for Students & Coaching Institutes
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Start creating up to 200-question printable A4 OMR sheets, taking timed practice exams, and scanning OMR sheets for free. Multi-sheet batch ZIP grading and institute cloud portals are launching soon.
        </p>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Plan 1: Free Forever (Unlocked Now) */}
        <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg relative">
          <div className="absolute -top-3.5 left-6 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
            Active & Unlocked
          </div>

          <div className="space-y-5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Student & Educator Free
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Everything you need to create, print, practice, and evaluate OMR sheets
              </p>
            </div>

            <div className="flex items-baseline gap-1 pt-2">
              <span className="text-4xl font-black text-slate-900">₹0</span>
              <span className="text-xs text-slate-500 font-semibold">/ forever</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Custom OMR Sheet Creator (5 to 200 Questions)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>High-Resolution A4 PDF Export & Direct Print</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Unlimited Timed Online OMR Practice & Presets</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Optical Pixel OMR Scanner (Camera & Image Upload)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Cloud Sync for Saved Sheets & Test Scorecards</span>
              </li>
            </ul>
          </div>

          <a
            href="https://omrwallah.in/creator"
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                e.preventDefault();
                onNavigate('creator');
              }
            }}
            className="block text-center w-full mt-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Open OMR Creator (Free)
          </a>
        </div>

        {/* Plan 2: Educator Pro (Coming Soon) */}
        <div className="bg-slate-900 text-white border-2 border-blue-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative">
          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Coming Soon</span>
          </div>

          <div className="space-y-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Educator Pro</h3>
              <p className="text-xs text-slate-300 mt-1">
                Planned batch automation for independent teachers & test series creators
              </p>
            </div>

            <div className="flex items-baseline gap-1 pt-2">
              <span className="text-4xl font-black text-white">₹299</span>
              <span className="text-xs text-slate-400 font-semibold">
                / month (Planned)
              </span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-200">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Everything in Free Forever Plan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Bulk ZIP / Multi-Page PDF Batch Scanner (Coming Soon)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Class Rank List Excel & CSV Export (Coming Soon)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Automated Student WhatsApp/Email Scorecards (Coming Soon)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full mt-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            View Early Access Details
          </button>
        </div>

        {/* Plan 3: Coaching Institute (Coming Soon) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xs relative">
          <div className="absolute -top-3.5 right-6 bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
            Coming Soon
          </div>

          <div className="space-y-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                Institute Enterprise
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Planned multi-branch suite for schools, colleges & coaching centers
              </p>
            </div>

            <div className="flex items-baseline gap-1 pt-2">
              <span className="text-4xl font-black text-slate-900">₹1,499</span>
              <span className="text-xs text-slate-500 font-semibold">
                / month (Planned)
              </span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs text-slate-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Custom Institute Logo, Header & Watermark (Available Free Now)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Multi-Teacher Faculty Accounts (Coming Soon)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>High-Speed Flatbed Scanner Integration (Coming Soon)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>White-Label Student Parent Portal (Coming Soon)</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Join Institute Waitlist
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h2 className="font-extrabold text-lg text-slate-900">
            Frequently Asked Questions About Free &amp; Institutional Plans
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              Do I need a paid subscription to create 180 or 200 question NEET OMR PDFs?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              No! High-density 180Q and 200Q A4 OMR sheet creation, custom institute branding, and high-resolution PDF exports are 100% free and unlocked right now in our{' '}
              <a
                href="https://omrwallah.in/creator"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('creator');
                  }
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                OMR Sheet Creator
              </a>
              .
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              Can I print OMR sheets on regular A4 printer paper?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Yes! Every OMR sheet includes 4-corner optical registration marks and monochrome contrast modes optimized for standard 75–80 GSM A4 laser or inkjet paper. Read our{' '}
              <a
                href="https://omrwallah.in/omr-sheet-pdf"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('omr-sheet-pdf');
                  }
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                OMR Sheet PDF Printing Guide
              </a>{' '}
              for best results.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              Are school and coaching institute headers free to customize?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Yes, teachers and coaching faculties can add custom academy names, branch codes, exam titles, and watermarks at zero cost. Explore our{' '}
              <a
                href="https://omrwallah.in/omr-sheet-for-schools"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('omr-sheet-for-schools');
                  }
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                OMR for Schools
              </a>{' '}
              and{' '}
              <a
                href="https://omrwallah.in/omr-sheet-for-coaching"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('omr-sheet-for-coaching');
                  }
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                OMR for Coaching Institutes
              </a>{' '}
              pages for workflow details.
            </p>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">
              Is online timed OMR practice free for students?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Yes, students preparing for{' '}
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
                NEET
              </a>
              ,{' '}
              <a
                href="https://omrwallah.in/jee-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('jee-omr-sheet');
                  }
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                JEE
              </a>
              ,{' '}
              <a
                href="https://omrwallah.in/ssc-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('ssc-omr-sheet');
                  }
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                SSC
              </a>
              ,{' '}
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
                CUET
              </a>
              , and{' '}
              <a
                href="https://omrwallah.in/ctet-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate('ctet-omr-sheet');
                  }
                }}
                className="text-blue-600 font-bold hover:underline"
              >
                CTET
              </a>{' '}
              get unlimited access to the{' '}
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
                Online OMR Practice Simulator
              </a>{' '}
              and{' '}
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
                Free OMR Templates
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
