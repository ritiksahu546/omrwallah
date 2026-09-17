import React, { useState } from 'react';
import { Search, Clock, Calendar, ArrowRight, BookOpen, Share2, Sparkles, ChevronLeft } from 'lucide-react';
import { BLOG_ARTICLES } from '../data/blogArticles';
import { BlogArticle } from '../types/omr';

interface BlogPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigate?: (route: string) => void;
  initialArticleSlug?: string;
}

export const BlogPage: React.FC<BlogPageProps> = ({ showToast, onNavigate, initialArticleSlug }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(() => {
    if (initialArticleSlug) {
      return BLOG_ARTICLES.find((a) => a.slug === initialArticleSlug || a.id === initialArticleSlug) || null;
    }
    return null;
  });

  const categories = ['All', 'Guides', 'Tutorials', 'Exam Tips', 'Technology', 'Printing', 'Coaching', 'Analysis'];

  const filteredArticles = BLOG_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // If viewing a full article directly
  if (activeArticle) {
    return (
      <div className="bg-slate-50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button */}
          <div>
            <button
              type="button"
              onClick={() => setActiveArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </button>
          </div>

          <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[10px]">
                {activeArticle.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeArticle.date}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{activeArticle.readTime}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
              {activeArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
              {activeArticle.excerpt}
            </p>

            <div className="h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={activeArticle.imageUrl}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Body */}
            <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 pt-2">
              {activeArticle.content ? (
                <div className="whitespace-pre-line space-y-4">
                  {activeArticle.content.trim()}
                </div>
              ) : (
                <p>{activeArticle.excerpt}</p>
              )}
            </div>

            {/* Quick Links inside Article */}
            <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Try Related OMR Tools on OMRWallah</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {onNavigate && (
                  <>
                    <button
                      type="button"
                      onClick={() => onNavigate('creator')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      OMR Sheet Generator
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('templates')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Template Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('practice')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      Online OMR Practice
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Footer actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast('Article link copied to clipboard!', 'info');
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>Share This Guide</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer transition"
              >
                Back to All Articles
              </button>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            KNOWLEDGE BASE &amp; GUIDES
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
            OMR Guides, Tips &amp; Tutorials
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Articles, guides and strategies to help you practice, design and evaluate OMR answer sheets
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72 max-w-full">
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
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
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

      {/* Articles Grid */}
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

                <h2 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {art.title}
                </h2>

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
    </div>
  );
};
