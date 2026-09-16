import React, { useState } from 'react';
import { TEMPLATES_DATA } from '../data/templates';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { Search, Sparkles, Filter, Layers, ArrowRight } from 'lucide-react';

interface TemplatesPageProps {
  onSelectTemplate: (templateId: string) => void;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({
  onSelectTemplate,
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Choose a Template
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Start with a ready-made template and customize it your way
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Category Filter Pills (matching reference image #3) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <button
                type="button"
                onClick={() => onSelectTemplate(tmpl.id)}
                className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs rounded-xl border border-blue-200 hover:border-blue-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
