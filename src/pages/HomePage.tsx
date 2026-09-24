import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ScanLine,
  Layers,
  GraduationCap,
  School,
  TrendingUp,
  Play,
  Star,
  ChevronRight,
  ShieldCheck,
  Zap,
  Smartphone,
} from 'lucide-react';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { DEFAULT_OMR_CONFIG, TEMPLATES_DATA } from '../data/templates';
import { MOCK_FAQS, MOCK_BLOG_ARTICLES } from '../data/mockData';
import { PWAInstallButton } from '../components/common/PWAInstallButton';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onSelectTemplate: (templateId: string) => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectTemplate,
  onOpenAuth,
}) => {
  const [activeAudience, setActiveAudience] = useState<'students' | 'teachers' | 'coaching' | 'schools'>('students');
  const [faqCategory, setFaqCategory] = useState('General');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'OMR Sheets Generated', value: '1M+' },
    { label: 'Coaching Institutes', value: '500+' },
    { label: 'User Rating', value: '4.9 ★' },
  ];

  const features = [
    {
      title: 'Fully Customizable',
      desc: 'Customize question counts (10 to 200), options, roll number grids, school logos and subject headers in seconds.',
      icon: Sparkles,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'A4 Print Ready',
      desc: 'Accurately formatted for standard A4 paper with exact margins and registration timing markers for laser and inkjet printers.',
      icon: Printer,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: 'Instant PDF Download',
      desc: 'One-click high-resolution PDF download or direct print without watermarks or alignment shifts.',
      icon: Download,
      color: 'bg-cyan-50 text-cyan-600',
    },
    {
      title: 'Mobile Phone Scanner',
      desc: 'Smart camera alignment reticle automatically detects corners and validates filled bubbles instantly.',
      icon: ScanLine,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'Automated Evaluation',
      desc: 'Calculate scores, negative markings, attempt rates, and accuracy percentages right on the spot.',
      icon: Zap,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Built For India',
      desc: 'Tailored specifically for CBSE, NEET, JEE, SSC, UPSC, and state board competitive exam patterns.',
      icon: ShieldCheck,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  const steps = [
    { num: '01', title: 'Create', desc: 'Select questions count (25, 50, 100, 180 or custom) and column layout.' },
    { num: '02', title: 'Customize', desc: 'Add institute name, exam details, roll number bubble grid and instructions.' },
    { num: '03', title: 'Print', desc: 'Download A4 PDF or print directly on any standard printer.' },
    { num: '04', title: 'Fill & Practice', desc: 'Fill bubbles with ball pen or practice interactively online.' },
    { num: '05', title: 'Scan', desc: 'Use your phone camera or scanner to read answers in seconds.' },
    { num: '06', title: 'Analyze', desc: 'View instant scorecards, subject breakdowns, and weak area analysis.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* ================= HERO SECTION (matching reference image #1) ================= */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200 bg-gradient-to-b from-blue-50/40 via-white to-slate-50">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700 text-xs font-extrabold tracking-wide">
                <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-black">
                  NEW
                </span>
                <span>India's Most Advanced OMR Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Create OMR Sheets Online <br />
                <span className="text-blue-600">Design, Print &amp; Practice</span>
              </h1>

              {/* Subheading with contextual internal links */}
              <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                India's intuitive online{' '}
                <a
                  href="https://omrwallah.in/omr-sheet-generator"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-sheet-generator');
                    }
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  OMR sheet generator
                </a>{' '}
                and maker. Design custom answer sheets, download{' '}
                <a
                  href="https://omrwallah.in/templates"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('templates');
                    }
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  free OMR sheet templates
                </a>
                , start{' '}
                <a
                  href="https://omrwallah.in/practice"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('practice');
                    }
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  online OMR practice
                </a>
                , and access{' '}
                <a
                  href="https://omrwallah.in/omr-exams"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-exams');
                    }
                  }}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  competitive exam guides
                </a>
                .
              </p>

              {/* Features Quick Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 pb-1">
                {[
                  { label: 'Fully Customizable', icon: Sparkles },
                  { label: 'A4 Print Ready', icon: Printer },
                  { label: 'Instant PDF Download', icon: Download },
                  { label: 'Used by Coaching', icon: Users },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 p-2 bg-white/80 backdrop-blur-xs border border-slate-200/80 rounded-xl text-[11px] font-bold text-slate-700 shadow-xs"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('creator')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:translate-y-[-2px] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Create OMR Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('templates')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base rounded-xl border border-slate-300 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-blue-600 fill-current" />
                  <span>Explore Templates</span>
                </button>
              </div>

            </div>

            {/* Right Realistic A4 OMR Floating Card (from reference image #1) */}
            <div className="lg:col-span-5 flex justify-center relative">
              
              {/* Decorative Tilt Sheet Wrapper */}
              <div className="relative group max-w-sm w-full">
                
                {/* Background Shadow Effect */}
                <div className="absolute inset-0 bg-blue-600/10 rounded-2xl filter blur-xl transform rotate-2 scale-105" />
                
                {/* Floating Stamp / Tag */}
                <div className="absolute -bottom-4 -right-4 z-20 bg-amber-400 text-slate-900 px-4 py-2 rounded-2xl shadow-xl border-2 border-slate-900 font-black text-xs transform rotate-3 flex items-center gap-1.5 animate-bounce">
                  <span>Ab Har Exam Hoga Easy! ✨</span>
                </div>

                {/* Scaled-down realistic preview container */}
                <div className="relative bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 p-2">
                  <div className="h-[460px] overflow-hidden rounded-lg border border-slate-200 bg-white scale-[0.58] origin-top-left w-[172%]">
                    <OMRSheetRenderer
                      config={{
                        ...DEFAULT_OMR_CONFIG,
                        questionsCount: 40,
                        layoutColumns: '2',
                        header: {
                          ...DEFAULT_OMR_CONFIG.header,
                          schoolName: 'ARC COACHING INSTITUTE',
                          tagline: 'The Return One Quality',
                          examName: 'OMR ANSWER SHEET',
                        },
                      }}
                      interactive={false}
                    />
                  </div>

                  {/* Card bottom bar */}
                  <div className="pt-2 px-2 flex items-center justify-between text-xs font-bold text-slate-600 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Print Ready A4 Format</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('creator')}
                      className="text-blue-600 hover:underline text-xs font-extrabold cursor-pointer"
                    >
                      Open in Editor →
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ================= STATS BAR ================= */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-slate-500">
                  {st.label}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              SIMPLE WORKFLOW
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
              From Custom Design to Instant Evaluation
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Everything you need to create, conduct, and analyze paper-based OMR examinations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-300 transition-colors"
              >
                <div>
                  <span className="text-2xl font-black text-blue-600 font-mono block mb-2">
                    {st.num}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-base mb-1">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES GRID ================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
              Why 500+ Institutes Trust OMRWallah
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Built with precision for students preparing for real offline exams and teachers managing classroom assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= AUDIENCE SPOTLIGHT ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Tailored For Every Learning Environment
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Select your role to see how OMRWallah streamlines your preparation and assessments.
            </p>

            {/* Audience Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { id: 'students', label: 'For Students', icon: GraduationCap },
                { id: 'teachers', label: 'For Teachers', icon: Users },
                { id: 'coaching', label: 'For Coaching Institutes', icon: TrendingUp },
                { id: 'schools', label: 'For Schools', icon: School },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeAudience === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveAudience(tab.id as any)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Audience Card */}
          <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10">
            {activeAudience === 'students' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                    STUDENT ADVANTAGE
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Master Physical Bubbling Before The Real Exam Day
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Online mocks don't prepare you for ballpoint pen bubbling pressure. Practice with authentic 180-Q NEET or 90-Q JEE sheets, test your timer speeds, and scan your answers to identify weak areas.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Eliminate double-bubbling and bubbling mistakes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Instant self-check via phone camera scanner</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Track improvement trends across all subjects</span>
                    </li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => onNavigate('practice')}
                    className="mt-2 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Start Practice Test →
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="text-xs font-black uppercase text-slate-400 mb-2">Student Mock Snapshot</div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-800 text-sm">NEET Biology Mock #04</span>
                    <span className="font-black text-emerald-600 text-sm">72 / 100</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Botany Speed:</span>
                      <span className="font-bold text-slate-900">22 mins (84% accuracy)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Zoology Speed:</span>
                      <span className="font-bold text-slate-900">26 mins (78% accuracy)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Attempt Rate:</span>
                      <span className="font-bold text-blue-600">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeAudience === 'teachers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                    TEACHER WORKFLOW
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Conduct Quizzes & Assessments in Minutes
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Stop manually checking piles of papers. Generate customized 25 or 50 question OMR sheets with your class details, print them out, and grade them via phone camera in minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('creator')}
                    className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Design Class OMR →
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="text-xs font-black uppercase text-slate-400 mb-2">Evaluation Speed</div>
                  <div className="text-2xl font-black text-slate-900 mb-1">50 Sheets in 4 Mins</div>
                  <p className="text-xs text-slate-600">Automated evaluation with student-level accuracy summaries.</p>
                </div>
              </div>
            )}

            {(activeAudience === 'coaching' || activeAudience === 'schools') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                    INSTITUTE SCALE
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Branded Mock Tests for 1000+ Students
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Embed your academy logo, watermark, and set series codes. Print high-volume sheets on standard copier paper with 100% scanning reliability.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('pricing')}
                    className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    View Institute Plans →
                  </button>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="text-xs font-bold text-slate-800">Apex Medical Academy</div>
                  <div className="text-xs text-slate-500">Weekly Grand Mock Series (180 Qs)</div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-600">✓ 840 Sheets Evaluated</span>
                    <span className="text-blue-600">Ranks Generated</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* ================= TEMPLATES PREVIEW SHOWCASE ================= */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                TEMPLATES
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                Exam Ready OMR Templates
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Choose a pre-built layout and customize questions, options, and branding.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              <span>View All 12+ Templates</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES_DATA.slice(0, 3).map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      {tmpl.category}
                    </span>
                    {tmpl.badge && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-lg text-slate-900 mb-1">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {tmpl.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center text-xs font-bold text-slate-700 mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Questions</span>
                      <span>{tmpl.questions}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Options</span>
                      <span>{tmpl.options}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Columns</span>
                      <span>{tmpl.columns}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTemplate(tmpl.id)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  Use Template →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MOBILE APP SECTION ================= */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-blue-50/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background glowing circles */}
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                  <Smartphone className="w-3.5 h-3.5" />
                  MOBILE FRIENDLY APP (PWA)
                </span>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
                  OMRWallah on Your Smartphone — Apne Mobile Me Install Karein!
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
                  Bina Play Store download kiye seedha apne phone ki home screen par add karein. Real exam simulation, camera scanner, aur offline practice ab aapki pocket me.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-xl text-left">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mb-1" />
                    <h3 className="font-bold text-xs text-white">Camera Scanner</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">Phone camera se sheet scan karein</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-xl text-left">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mb-1" />
                    <h3 className="font-bold text-xs text-white">Works Offline</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">Bina internet practice test dein</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-xs border border-white/10 p-3 rounded-xl text-left">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 mb-1" />
                    <h3 className="font-bold text-xs text-white">Fast & Light</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5">Under 1MB, zero storage burden</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <PWAInstallButton variant="nav" className="w-full sm:w-auto px-5 py-3 text-sm bg-blue-600 hover:bg-blue-500 text-white border-none shadow-lg" />
                  <button
                    type="button"
                    onClick={() => onNavigate('scan')}
                    className="w-full sm:w-auto px-5 py-3 text-sm font-bold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition cursor-pointer text-center"
                  >
                    Open Camera Scanner
                  </button>
                </div>
              </div>

              {/* Mobile device mockup visual */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-56 sm:w-64 bg-slate-900 p-3 rounded-[36px] shadow-2xl border-4 border-slate-700/60 relative">
                  {/* Phone notch */}
                  <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2" />
                  
                  {/* Phone screen */}
                  <div className="bg-slate-950 rounded-[24px] p-3 text-white space-y-2.5 overflow-hidden border border-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-black">OW</div>
                        <span className="text-[11px] font-bold">OMRWallah</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">Ready</span>
                    </div>

                    <div className="bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-300">Live Camera OMR</p>
                      <div className="h-20 bg-slate-800/80 rounded-lg flex items-center justify-center border border-dashed border-cyan-500/40 relative overflow-hidden">
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                        <span className="text-[10px] text-cyan-300 font-mono">Scanning 180 Qs...</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-center">
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <p className="text-[9px] text-slate-400">Score</p>
                        <p className="text-xs font-black text-emerald-400">680 / 720</p>
                      </div>
                      <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <p className="text-[9px] text-slate-400">Speed</p>
                        <p className="text-xs font-black text-blue-400">0.8 sec</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
              Got Questions? We've Got Answers.
            </h2>
          </div>

          <div className="space-y-3">
            {MOCK_FAQS[0].items.concat(MOCK_FAQS[1].items).slice(0, 5).map((item, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/50"
                  >
                    <span>{item.q}</span>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/50">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => onNavigate('faq')}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Browse Complete Help Center →
            </button>
          </div>
        </div>
      </section>

      {/* ================= SEO HUBS & GUIDES NAVIGATION ================= */}
      <section className="py-12 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Popular OMR Tools, Formats &amp; Exam Guides
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Quick access to dedicated online tools, printable formats, and competitive exam guidelines.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'OMR Sheet Generator', route: 'omr-sheet-generator', path: 'omr-sheet-generator', desc: 'Custom question & column builder' },
              { label: 'Free OMR Sheet Templates', route: 'templates', path: 'templates', desc: 'Pre-calibrated test layouts & formats' },
              { label: 'Online OMR Practice', route: 'practice', path: 'practice', desc: 'Timed mock bubbling simulator' },
              { label: 'Competitive Exam Hub', route: 'omr-exams', path: 'omr-exams', desc: 'NEET, JEE, SSC, CUET guides' },
              { label: 'OMR Sheet Maker', route: 'omr-sheet-maker', path: 'omr-sheet-maker', desc: 'Design bubble grids & roll codes' },
              { label: 'OMR Sheet PDF Download', route: 'omr-sheet-pdf', path: 'omr-sheet-pdf', desc: 'Print-ready A4 vector downloads' },
              { label: 'OMR for Coaching', route: 'omr-sheet-for-coaching', path: 'omr-sheet-for-coaching', desc: 'Branded test series formats' },
              { label: 'OMR for Schools', route: 'omr-sheet-for-schools', path: 'omr-sheet-for-schools', desc: 'Classroom & term exam sheets' },
            ].map((item, idx) => (
              <a
                key={idx}
                href={`https://omrwallah.in/${item.path}`}
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onNavigate(item.route);
                  }
                }}
                className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-xs text-left transition group block"
              >
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors block">
                  {item.label} →
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  {item.desc}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM CTA BANNER ================= */}
      <section className="py-16 bg-gradient-to-br from-[#0b132b] via-[#101b3b] to-blue-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join 50,000+ Students & Teachers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Ready to Build Your Custom OMR Sheet?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            No design software required. Design in seconds, print standard A4 sheets, practice physical bubbling, and evaluate with zero hassle.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('creator')}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-blue-500/30 transition-all cursor-pointer"
            >
              Start Creating Free →
            </button>
            <button
              type="button"
              onClick={() => onNavigate('templates')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Browse Templates
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
