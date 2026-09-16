import React, { useState } from 'react';
import {
  Save,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Sliders,
  Type,
  Layout,
  FileText,
  HelpCircle,
  Settings,
  Eye,
  RotateCcw,
  Check,
  ArrowLeft,
} from 'lucide-react';
import { OMRConfig } from '../types/omr';
import { DEFAULT_OMR_CONFIG } from '../data/templates';
import { OMRSheetRenderer } from '../components/omr/OMRSheetRenderer';
import { OMREditorBasicTab } from '../components/omr/OMREditorBasicTab';
import { OMREditorHeaderTab } from '../components/omr/OMREditorHeaderTab';
import { OMREditorFieldsTab } from '../components/omr/OMREditorFieldsTab';
import { OMREditorDesignTab } from '../components/omr/OMREditorDesignTab';
import { OMREditorPageTab } from '../components/omr/OMREditorPageTab';
import { OMREditorInstructionsTab } from '../components/omr/OMREditorInstructionsTab';
import { OMREditorAdvancedTab } from '../components/omr/OMREditorAdvancedTab';
import { downloadOMRPdf, printOMRSheet } from '../utils/pdfGenerator';
import { ToastMessage } from '../components/common/Toast';

interface OMRCreatorPageProps {
  initialConfig?: OMRConfig;
  onSaveSheet: (config: OMRConfig) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigate: (route: string) => void;
}

export const OMRCreatorPage: React.FC<OMRCreatorPageProps> = ({
  initialConfig,
  onSaveSheet,
  showToast,
  onNavigate,
}) => {
  const [config, setConfig] = useState<OMRConfig>(initialConfig || DEFAULT_OMR_CONFIG);
  const [activeTab, setActiveTab] = useState<'basic' | 'fields' | 'design' | 'page' | 'header' | 'instructions' | 'advanced'>('basic');
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const handleConfigUpdate = (updates: Partial<OMRConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSave = () => {
    onSaveSheet(config);
    showToast('OMR sheet configuration saved to My Sheets!', 'success');
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    showToast('Preparing high-resolution A4 PDF...', 'info');

    const success = await downloadOMRPdf(
      'printable-omr-container',
      `${config.header.schoolName || 'OMR'}-${config.questionsCount}Q.pdf`
    );

    setIsDownloadingPdf(false);
    if (success) {
      showToast('PDF downloaded successfully!', 'success');
    } else {
      showToast('Could not generate PDF. Please try the Print option.', 'error');
    }
  };

  const handlePrint = () => {
    showToast('Opening print dialog...', 'info');
    printOMRSheet();
  };

  const handleReset = () => {
    if (window.confirm('Reset this OMR sheet to default settings?')) {
      setConfig(DEFAULT_OMR_CONFIG);
      showToast('Reset to default configuration', 'info');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'fields', label: 'Fields' },
    { id: 'design', label: 'Design' },
    { id: 'page', label: 'Page' },
    { id: 'header', label: 'Header' },
    { id: 'instructions', label: 'Instructions' },
    { id: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-100 overflow-hidden">
      
      {/* ================= TOP EDITOR ACTION BAR ================= */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                Create Your OMR Sheet
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Live Editor
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Customize every detail and see instant live preview
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none py-0.5">
          
          {/* Mobile Preview Toggle */}
          <button
            type="button"
            onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
            className="lg:hidden px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>{mobilePreviewOpen ? 'Editor' : 'Preview'}</span>
          </button>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleReset}
            title="Reset to default"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Save */}
          <button
            type="button"
            onClick={handleSave}
            title="Save Sheet"
            className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg shadow-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            disabled={isDownloadingPdf}
            onClick={handleDownloadPdf}
            className="px-3 sm:px-4 py-1.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm shadow-blue-500/25 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloadingPdf ? 'PDF...' : 'Download PDF'}</span>
          </button>

          {/* Print OMR */}
          <button
            type="button"
            onClick={handlePrint}
            title="Print OMR"
            className="p-1.5 sm:px-3.5 sm:py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN 2-PANE WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT CONTROLS PANEL */}
        <div
          className={`w-full lg:w-[420px] bg-white border-r border-slate-200 flex flex-col flex-shrink-0 z-10 ${
            mobilePreviewOpen ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Tabs Navigation Header */}
          <div className="flex items-center overflow-x-auto border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1 scrollbar-none overscroll-x-contain touch-pan-x">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80 font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Sub-tab Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 pb-28 lg:pb-6">
            {activeTab === 'basic' && (
              <OMREditorBasicTab config={config} onChange={handleConfigUpdate} />
            )}
            {activeTab === 'fields' && (
              <OMREditorFieldsTab config={config} onChange={handleConfigUpdate} />
            )}
            {activeTab === 'design' && (
              <OMREditorDesignTab config={config} onChange={handleConfigUpdate} />
            )}
            {activeTab === 'page' && (
              <OMREditorPageTab config={config} onChange={handleConfigUpdate} />
            )}
            {activeTab === 'header' && (
              <OMREditorHeaderTab config={config} onChange={handleConfigUpdate} />
            )}
            {activeTab === 'instructions' && (
              <OMREditorInstructionsTab config={config} onChange={handleConfigUpdate} />
            )}
            {activeTab === 'advanced' && (
              <OMREditorAdvancedTab config={config} onChange={handleConfigUpdate} />
            )}
          </div>
        </div>

        {/* CENTER LIVE A4 CANVAS PREVIEW (Heart of OMR Creator) */}
        <div
          className={`flex-1 flex flex-col bg-slate-200/80 overflow-hidden ${
            mobilePreviewOpen ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Canvas Top Bar: Zoom Controls */}
          <div className="bg-white/80 backdrop-blur-xs border-b border-slate-300 px-4 py-2 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Live Preview (A4 Size)</span>
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                • 210 × 297 mm
              </span>
            </div>

            {/* Zoom tool buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-1 border border-slate-300">
              <button
                type="button"
                onClick={() => setZoomLevel(Math.max(0.4, zoomLevel - 0.1))}
                className="p-1 hover:bg-white rounded text-slate-700 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <span className="px-2 font-mono font-bold text-[11px] min-w-[42px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
                className="p-1 hover:bg-white rounded text-slate-700 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setZoomLevel(0.85)}
                className="px-1.5 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-white rounded cursor-pointer"
                title="Reset zoom to 85%"
              >
                Fit
              </button>
            </div>
          </div>

          {/* Canvas Scroll Area */}
          <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center items-start">
            <div className="origin-top transition-transform duration-150">
              <OMRSheetRenderer config={config} scale={zoomLevel} />
            </div>
          </div>

          {/* Mobile Bottom Sticky Bar for easy action */}
          <div className="lg:hidden p-3 pb-20 bg-white border-t border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(false)}
              className="flex-1 py-2.5 bg-slate-100 text-slate-800 rounded-xl font-bold text-xs"
            >
              Back to Settings
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
