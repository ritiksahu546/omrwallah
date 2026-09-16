import React, { useState } from 'react';
import { OMRConfig } from '../types/omr';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { downloadOMRPdf, printOMRSheet } from '../utils/pdfGenerator';
import {
  FileText,
  Plus,
  Search,
  Download,
  Printer,
  Copy,
  Trash2,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface SavedSheetsPageProps {
  savedSheets: OMRConfig[];
  onSelectSheet: (config: OMRConfig) => void;
  onDeleteSheet: (id: string) => void;
  onDuplicateSheet: (config: OMRConfig) => void;
  onNavigate: (route: string) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SavedSheetsPage: React.FC<SavedSheetsPageProps> = ({
  savedSheets,
  onSelectSheet,
  onDeleteSheet,
  onDuplicateSheet,
  onNavigate,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSheets = savedSheets.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.header.schoolName.toLowerCase().includes(q) ||
      s.header.examName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Saved OMR Sheets
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, duplicate, and download your customized examination sheets ({savedSheets.length})
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 min-w-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search saved sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={() => onNavigate('creator')}
            className="px-3.5 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>
      </div>

      {/* Sheets Grid */}
      {filteredSheets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-lg text-slate-900">No Sheets Found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            You haven't saved any customized sheets yet or no sheet matches your search query.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('creator')}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Create First Sheet →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSheets.map((sheet) => (
            <div
              key={sheet.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Sheet Visual Preview */}
              <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex justify-center items-center h-52 overflow-hidden relative">
                <div className="w-[170px] h-[240px] bg-white shadow-md rounded-sm overflow-hidden scale-[0.55] origin-center pointer-events-none border border-slate-300">
                  <OMRSheetRenderer config={sheet} interactive={false} />
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/90 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md shadow-2xs">
                    {sheet.questionsCount} Questions
                  </span>
                </div>
              </div>

              {/* Sheet Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {sheet.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {sheet.header.schoolName || 'Generic Institute'}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mt-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated {new Date(sheet.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => onSelectSheet(sheet)}
                    className="flex-1 py-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Edit Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDuplicateSheet(sheet)}
                    title="Duplicate this template"
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${sheet.title}"?`)) {
                        onDeleteSheet(sheet.id);
                        showToast('Sheet deleted', 'info');
                      }
                    }}
                    title="Delete sheet"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
