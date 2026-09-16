import React, { useState } from 'react';
import { Search, Clock, Calendar, ArrowRight, BookOpen, Share2 } from 'lucide-react';
import { MOCK_BLOG_ARTICLES } from '../data/mockData';
import { BlogArticle } from '../types/omr';

interface BlogPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ showToast }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  const categories = ['All', 'Exam Prep', 'Tips', 'Teachers', 'Technology'];

  const filteredArticles = MOCK_BLOG_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header (matching reference image #8) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            KNOWLEDGE BASE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            OMR Tips & Resources
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Articles, guides and strategies to help you practice, design and excel
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Category Pills */}
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

      {/* Articles Grid (matching reference image #8) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white px-2.5 py-1 rounded-md shadow-xs">
                  {art.category}
                </span>
              </div>

              {/* Meta & Excerpt */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{art.date}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                  {art.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                type="button"
                onClick={() => setActiveArticle(art)}
                className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Article Full Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                {activeArticle.category}
              </span>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {activeArticle.title}
            </h2>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
              <span>{activeArticle.date}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="h-56 rounded-2xl overflow-hidden">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-sm text-slate-700 leading-relaxed space-y-3 font-medium">
              <p>{activeArticle.excerpt}</p>
              <p>
                When taking competitive examinations like NEET, JEE, UPSC, or State PSCs, bubbling mechanics account for a significant percentage of avoidable errors. Candidates who simulate physical bubbling under strict time limits develop muscle memory and reduce anxiety.
              </p>
              <h4 className="font-extrabold text-slate-900 text-base pt-2">Key Best Practices:</h4>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                <li>Always use 0.7mm or 0.8mm medium tip ballpoint pens for faster bubble filling.</li>
                <li>Never fill bubbles after every individual question; batch your bubbling section-by-section.</li>
                <li>Keep the registration marks clean and avoid resting sweaty palms on the answer sheet borders.</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Article link copied to clipboard!', 'info');
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Back to Articles
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
