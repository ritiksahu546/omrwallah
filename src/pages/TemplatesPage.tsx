import React, { useState } from 'react';
import { TEMPLATES_DATA } from '../data/templates';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { Search, Sparkles, Filter, Layers, ArrowRight, ArrowLeft } from 'lucide-react';

interface TemplatesPageProps {
  onSelectTemplate: (templateId: string) => void;
  onNavigate?: (route: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  onSelectTemplate,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'School', 'Coaching', 'Competitive', 'Practice', 'Blank'];

  const filteredTemplates = TEMPLATES_DATA.filter((tmpl) => {
    const matchesCat = selectedCategory === 'All' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full overflow-x-hidden">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline whitespace-nowrap">Dashboard</span>
            </button>
          )}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">
              Choose a Template
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Start with a ready-made template and customize it your way
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72 max-w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Filter Pills (matching reference image #3) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Sheet Scaled Preview */}
            <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex justify-center items-center h-64 overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors z-10 pointer-events-none" />
              
              {/* Scaled A4 Preview */}
              <div className="w-[180px] h-[254px] bg-white shadow-md rounded-sm overflow-hidden scale-[0.6] origin-center pointer-events-none border border-slate-300">
                <OMRSheetRenderer config={tmpl.config} interactive={false} />
              </div>

              {tmpl.badge && (
                <span className="absolute top-3 right-3 z-20 text-[10px] font-black uppercase tracking-wider bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full shadow-xs">
                  {tmpl.badge}
                </span>
              )}
            </div>

            {/* Template Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h3 className="font-extrabold text-base text-slate-900">
                    {tmpl.name}
                  </h3>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {tmpl.questions} Qs
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {tmpl.description}
                </p>
              </div>

              <a
                href="https://omrwallah.in/creator"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                    e.preventDefault();
                    onSelectTemplate(tmpl.id);
                  }
                }}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs rounded-xl border border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        ))}
      </div>

      {/* Crawlable Template Selection Guide & Exam Links */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 mt-8">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Print-Ready A4 OMR Sheet Templates for Every Examination
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every template in the OMRWallah library is formatted to exact A4 specifications (210mm × 297mm) with high-contrast bubbles and 4-corner optical registration markers. Select any pre-configured sheet above to open it in our{' '}
            <a
              href="https://omrwallah.in/creator"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                  e.preventDefault();
                  onNavigate('creator');
                }
              }}
              className="text-blue-600 font-bold hover:underline"
            >
              Custom OMR Sheet Creator
            </a>
            , where you can personalize institute headers, roll number digits, and instructions before exporting a clean PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Competitive Entrance Templates</h3>
            <p className="text-slate-600 leading-relaxed">
              Includes 180Q &amp; 200Q layouts for{' '}
              <a
                href="https://omrwallah.in/neet-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('neet-omr-sheet');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                NEET UG
              </a>
              , 75Q–90Q PCM sheets for{' '}
              <a
                href="https://omrwallah.in/jee-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('jee-omr-sheet');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                JEE Main
              </a>
              , 100Q 4-column sheets for{' '}
              <a
                href="https://omrwallah.in/ssc-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('ssc-omr-sheet');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                SSC &amp; State PSC
              </a>
              , 150Q formats for{' '}
              <a
                href="https://omrwallah.in/ctet-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('ctet-omr-sheet');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                CTET
              </a>
              , and 50Q sheets for{' '}
              <a
                href="https://omrwallah.in/cuet-omr-sheet"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('cuet-omr-sheet');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                CUET
              </a>
              .
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Schools &amp; Coaching Test Series</h3>
            <p className="text-slate-600 leading-relaxed">
              Explore specialized formats in our{' '}
              <a
                href="https://omrwallah.in/omr-sheet-for-schools"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('omr-sheet-for-schools');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                OMR for Schools
              </a>{' '}
              and{' '}
              <a
                href="https://omrwallah.in/omr-sheet-for-coaching"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('omr-sheet-for-coaching');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                OMR for Coaching Institutes
              </a>{' '}
              guides, including 2-sheets-per-page classroom quiz layouts.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm">Digital Practice &amp; PDF Printing</h3>
            <p className="text-slate-600 leading-relaxed">
              Review A4 printing guidelines on our{' '}
              <a
                href="https://omrwallah.in/omr-sheet-pdf"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('omr-sheet-pdf');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                OMR Sheet PDF Download
              </a>{' '}
              page or practice timed bubbling directly on screen in our{' '}
              <a
                href="https://omrwallah.in/practice"
                onClick={(e) => {
                  if (!e.ctrlKey && !e.metaKey && e.button === 0 && onNavigate) {
                    e.preventDefault();
                    onNavigate('practice');
                  }
                }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Online OMR Practice Portal
              </a>
              .
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
