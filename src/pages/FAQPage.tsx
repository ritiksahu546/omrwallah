import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, HelpCircle } from 'lucide-react';
import { MOCK_FAQS } from '../data/mockData';

interface FAQPageProps {
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ showToast }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ 'General-0': true, 'Printing-0': true });
  const [supportMessage, setSupportMessage] = useState('');

  const categories = ['All', 'General', 'Creation', 'Printing', 'Scanning', 'Pricing'];

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    showToast('Your query has been submitted! Our support team will reply within 2 hours.', 'success');
    setSupportMessage('');
  };

  const allItems = MOCK_FAQS.flatMap((cat) =>
    cat.items.map((item, idx) => ({
      ...item,
      category: cat.category,
      key: `${cat.category}-${idx}`,
    }))
  );

  const filteredItems = allItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 w-full max-w-full overflow-x-hidden">
      
      {/* Top Header (matching reference image #9) */}
      <div className="text-center max-w-2xl mx-auto space-y-2 w-full">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          HELP CENTER
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600">
          Find answers to common questions about sheet creation, printing, and automated scanning
        </p>

        {/* Search */}
        <div className="pt-4 relative max-w-md mx-auto w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-6.5" />
          <input
            type="text"
            placeholder="Search questions (e.g. A4 size, camera scanning, printing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>
      </div>

      {/* Category Filter Pills (matching reference image #9) */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full max-w-full">
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

      {/* FAQ Accordion List (matching reference image #9) */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isOpen = Boolean(openItems[item.key]);
          return (
            <div
              key={item.key}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-colors hover:border-slate-300"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.key)}
                className="w-full p-4 sm:p-5 text-left font-extrabold text-sm text-slate-900 flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase">
                    {item.category}
                  </span>
                  <span>{item.q}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Can't find what you're looking for? Reach out to our exam technology specialists.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>support@omrwallah.com</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSendSupport} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your question or custom sheet requirement..."
            value={supportMessage}
            onChange={(e) => setSupportMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl cursor-pointer"
          >
            Submit Query
          </button>
        </form>
      </div>

    </div>
  );
};
