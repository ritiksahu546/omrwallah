import React, { useState } from 'react';
import { OMRConfig, OMRSectionConfig } from '../../types/omr';
import { QrCode, Barcode, ShieldAlert, Layers, Plus, Trash2 } from 'lucide-react';

interface OMREditorAdvancedTabProps {
  config: OMRConfig;
  onChange: (updates: Partial<OMRConfig>) => void;
}

export const OMREditorAdvancedTab: React.FC<OMREditorAdvancedTabProps> = ({
  config,
  onChange,
}) => {
  const [sectionName, setSectionName] = useState('');
  const [startQ, setStartQ] = useState(1);
  const [endQ, setEndQ] = useState(30);

  const addSection = () => {
    if (!sectionName.trim()) return;
    const newSec: OMRSectionConfig = {
      id: `sec_${Date.now()}`,
      name: sectionName.trim(),
      startQ: Number(startQ),
      endQ: Number(endQ),
      startQuestion: Number(startQ),
      endQuestion: Number(endQ),
    };
    onChange({
      sections: [...(config.sections || []), newSec],
    });
    setSectionName('');
    setStartQ(Number(endQ) + 1);
    setEndQ(Math.min(config.questionsCount, Number(endQ) + 30));
  };

  const removeSection = (id: string) => {
    onChange({
      sections: (config.sections || []).filter((s) => s.id !== id),
    });
  };

  const quickSetupNeetSections = () => {
    onChange({
      questionsCount: 200,
      sections: [
        { id: 'sec_phy_a', name: 'Physics - Section A', startQ: 1, endQ: 35, startQuestion: 1, endQuestion: 35 },
        { id: 'sec_phy_b', name: 'Physics - Section B (Optional)', startQ: 36, endQ: 50, startQuestion: 36, endQuestion: 50 },
        { id: 'sec_chem_a', name: 'Chemistry - Section A', startQ: 51, endQ: 85, startQuestion: 51, endQuestion: 85 },
        { id: 'sec_chem_b', name: 'Chemistry - Section B (Optional)', startQ: 86, endQ: 100, startQuestion: 86, endQuestion: 100 },
        { id: 'sec_bot_a', name: 'Botany - Section A', startQ: 101, endQ: 135, startQuestion: 101, endQuestion: 135 },
        { id: 'sec_bot_b', name: 'Botany - Section B (Optional)', startQ: 136, endQ: 150, startQuestion: 136, endQuestion: 150 },
        { id: 'sec_zoo_a', name: 'Zoology - Section A', startQ: 151, endQ: 185, startQuestion: 151, endQuestion: 185 },
        { id: 'sec_zoo_b', name: 'Zoology - Section B (Optional)', startQ: 186, endQ: 200, startQuestion: 186, endQuestion: 200 },
      ],
    });
  };

  return (
    <div className="space-y-5 text-sm">
      
      {/* 1. Exam Sections Split (NEET / JEE / Subject-wise) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Exam Subject Sections
            </span>
            <span className="text-[11px] text-slate-500">Group questions into labelled subjects/parts</span>
          </div>
          {(config.sections?.length ?? 0) > 0 && (
            <button
              type="button"
              onClick={() => onChange({ sections: [] })}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Setup NEET */}
        <button
          type="button"
          onClick={quickSetupNeetSections}
          className="w-full py-1.5 px-2.5 bg-blue-50 border border-blue-200 hover:bg-blue-100/70 text-blue-700 rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
        >
          ⚡ Quick 4-Subject Split (NEET Pattern 200 Qs)
        </button>

        {/* Current sections list */}
        {config.sections && config.sections.length > 0 && (
          <div className="space-y-1.5">
            {config.sections.map((sec) => (
              <div
                key={sec.id}
                className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800">{sec.name}</span>
                  <span className="text-[11px] text-slate-500 ml-2">
                    (Q.{sec.startQuestion} to Q.{sec.endQuestion})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(sec.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add custom section */}
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <input
            type="text"
            placeholder="Section Name (e.g. Physics Section A)"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">From Q:</span>
              <input
                type="number"
                min="1"
                max={config.questionsCount}
                value={startQ}
                onChange={(e) => setStartQ(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg text-center"
              />
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">To Q:</span>
              <input
                type="number"
                min="1"
                max={config.questionsCount}
                value={endQ}
                onChange={(e) => setEndQ(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs bg-white border border-slate-300 rounded-lg text-center"
              />
            </div>
            <button
              type="button"
              onClick={addSection}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* 2. Custom Footer Text */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
          Custom Sheet Footer Text
        </label>
        <input
          type="text"
          value={config.footerText}
          onChange={(e) => onChange({ footerText: e.target.value })}
          placeholder="e.g. OMRWallah • Verified Scanner Compatible Sheet"
          className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>

      {/* 3. Machine Readable Codes */}
      <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
        <span className="block text-xs font-bold text-slate-800 mb-1">
          Machine Readable Codes
        </span>

        <label className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
          <div className="flex items-center gap-2">
            <Barcode className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">OMR Barcode Identifier</span>
          </div>
          <input
            type="checkbox"
            checked={config.enableBarcode}
            onChange={(e) => onChange({ enableBarcode: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-slate-600" />
            <span className="text-xs font-semibold text-slate-700">Verification QR Security Seal</span>
          </div>
          <input
            type="checkbox"
            checked={config.enableQrCode}
            onChange={(e) => onChange({ enableQrCode: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

      {/* 4. Scanner Notice */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
        <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Evaluation Compatibility</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          These sheets follow universal optical mark standards and are compatible with both manual grading, ADF document scanners, flatbed scanners, and mobile smartphone camera scanning in OMRWallah.
        </p>
      </div>

    </div>
  );
};

