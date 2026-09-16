import React from 'react';
import { OMRConfig } from '../../types/omr';
import { Sparkles, Sliders, Check } from 'lucide-react';

interface OMREditorBasicTabProps {
  config: OMRConfig;
  onChange: (updates: Partial<OMRConfig>) => void;
}

export const OMREditorBasicTab: React.FC<OMREditorBasicTabProps> = ({
  config,
  onChange,
}) => {
  const presetQuestions = [20, 30, 50, 75, 100, 150, 180, 200];
  const optionPresets = [2, 3, 4, 5, 6];

  const handleCustomQuestionChange = (val: number) => {
    const validVal = Math.min(Math.max(val || 1, 1), 200);
    onChange({ questionsCount: validVal });
  };

  const handleOptionCountChange = (count: number) => {
    let labels = config.optionLabels;
    if (count !== config.optionsCount) {
      const defaultAlpha = ['A', 'B', 'C', 'D', 'E', 'F'];
      labels = defaultAlpha.slice(0, count);
    }
    onChange({
      optionsCount: count,
      optionLabels: labels,
    });
  };

  const setLabelPreset = (type: 'alpha' | 'numeric') => {
    if (type === 'alpha') {
      const alpha = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, config.optionsCount);
      onChange({ optionLabels: alpha });
    } else {
      const num = ['1', '2', '3', '4', '5', '6'].slice(0, config.optionsCount);
      onChange({ optionLabels: num });
    }
  };

  const applyExamPreset = (name: 'neet' | 'jee' | 'upsc' | 'cbse') => {
    if (name === 'neet') {
      onChange({
        questionsCount: 180,
        optionsCount: 4,
        layoutColumns: '4',
        gridDensity: 'compact',
        enableRollNumber: true,
        rollNumberDigits: 7,
        rollNumberStyle: 'both',
        enableSections: true,
        sections: [
          { id: '1', name: 'Physics', startQ: 1, endQ: 45 },
          { id: '2', name: 'Chemistry', startQ: 46, endQ: 90 },
          { id: '3', name: 'Botany', startQ: 91, endQ: 135 },
          { id: '4', name: 'Zoology', startQ: 136, endQ: 180 },
        ],
      });
    } else if (name === 'jee') {
      onChange({
        questionsCount: 75,
        optionsCount: 4,
        layoutColumns: '3',
        gridDensity: 'standard',
        enableRollNumber: true,
        rollNumberDigits: 8,
        rollNumberStyle: 'both',
        enableSections: true,
        sections: [
          { id: '1', name: 'Section I - Physics', startQ: 1, endQ: 25 },
          { id: '2', name: 'Section II - Chemistry', startQ: 26, endQ: 50 },
          { id: '3', name: 'Section III - Mathematics', startQ: 51, endQ: 75 },
        ],
      });
    } else if (name === 'upsc') {
      onChange({
        questionsCount: 100,
        optionsCount: 4,
        layoutColumns: '3',
        gridDensity: 'compact',
        enableRollNumber: true,
        rollNumberDigits: 7,
        rollNumberStyle: 'both',
        enableSections: false,
      });
    } else if (name === 'cbse') {
      onChange({
        questionsCount: 50,
        optionsCount: 4,
        layoutColumns: '2',
        gridDensity: 'standard',
        enableRollNumber: true,
        rollNumberDigits: 8,
        rollNumberStyle: 'both',
        enableCandidateName: true,
      });
    }
  };

  return (
    <div className="space-y-5 text-sm">
      
      {/* 0. Exam Quick Presets */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Quick Exam Presets
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {[
            { id: 'neet', label: 'NEET (180 Qs)' },
            { id: 'jee', label: 'JEE Main (75 Qs)' },
            { id: 'upsc', label: 'UPSC / PCS (100)' },
            { id: 'cbse', label: 'CBSE / Board (50)' },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyExamPreset(preset.id as any)}
              className="px-2 py-1.5 bg-white border border-blue-200 hover:border-blue-400 text-blue-800 rounded-lg text-xs font-bold transition-all shadow-2xs hover:bg-blue-50 text-center cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Number of Questions */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Total Number of Questions
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {presetQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onChange({ questionsCount: q })}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                config.questionsCount === q
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {q}
            </button>
          ))}

          {/* Custom count input */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-600">
            <span className="text-xs text-slate-500 font-semibold">Custom:</span>
            <input
              type="number"
              min="1"
              max="200"
              value={config.questionsCount}
              onChange={(e) => handleCustomQuestionChange(parseInt(e.target.value, 10))}
              className="w-12 text-xs font-bold text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Starting Question Number */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Starting Q. No.
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={config.startingQuestionNumber || 1}
            onChange={(e) => onChange({ startingQuestionNumber: Math.max(1, parseInt(e.target.value, 10) || 1) })}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <p className="text-[10px] text-slate-500 mt-1">Useful for Paper-II or Multi-part booklets</p>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Grid Density
          </label>
          <select
            value={config.gridDensity || 'standard'}
            onChange={(e) => onChange({ gridDensity: e.target.value as any })}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
          >
            <option value="compact">Compact (Recommended for &gt;100 Qs)</option>
            <option value="standard">Standard (Balanced fit)</option>
            <option value="spacious">Spacious (Large bubbles for &lt;60 Qs)</option>
          </select>
          <p className="text-[10px] text-slate-500 mt-1">Optimizes single A4 sheet fit</p>
        </div>
      </div>

      {/* 2. Number of Options */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Number of Options per Question
        </label>
        <div className="flex items-center gap-2">
          {optionPresets.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleOptionCountChange(opt)}
              className={`w-11 h-8 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                config.optionsCount === opt
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Option Labels */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700">
            Option Labels
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLabelPreset('alpha')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              A, B, C...
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setLabelPreset('numeric')}
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              1, 2, 3...
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: config.optionsCount }).map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={2}
              value={config.optionLabels[i] || ''}
              onChange={(e) => {
                const updated = [...config.optionLabels];
                updated[i] = e.target.value.toUpperCase();
                onChange({ optionLabels: updated });
              }}
              className="w-10 h-8 text-center text-xs font-bold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          ))}
        </div>
      </div>

      {/* 4. Question Layout Columns */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Question Layout (Columns on Page)
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { id: '1', label: '1 Col' },
            { id: '2', label: '2 Col' },
            { id: '3', label: '3 Col' },
            { id: '4', label: '4 Col' },
            { id: 'auto', label: 'Auto' },
          ].map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => onChange({ layoutColumns: col.id as any })}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                config.layoutColumns === col.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {col.label}
            </button>
          ))}
        </div>
      </div>

      {/* Numbering Style */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Question Numbering Style
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'numbers', label: '1, 2, 3' },
            { id: 'leading-zeros', label: '01, 02' },
            { id: 'q-prefix', label: 'Q1, Q2' },
            { id: 'q-dot', label: 'Q.1, Q.2' },
          ].map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onChange({ numberingStyle: style.id as any })}
              className={`py-1.5 px-1 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer ${
                config.numberingStyle === style.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Fast Feature Toggles */}
      <div className="pt-3 border-t border-slate-200">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-3">
          Quick Sheet Elements
        </label>

        <div className="space-y-2">
          {[
            { key: 'enableRollNumber', label: 'Roll Number Grid (0-9 Digits)' },
            { key: 'enableCandidateName', label: 'Candidate Name Field' },
            { key: 'enableFatherName', label: "Father's Name Field" },
            { key: 'enableSubjectExam', label: 'Subject / Exam Name Bar' },
            { key: 'enableSetSeries', label: 'Set / Series Box (A, B, C, D)' },
            { key: 'enableDateField', label: 'Exam Date Field' },
            { key: 'enableClassBatch', label: 'Class / Batch Field' },
            { key: 'enableCornerMarks', label: 'Scanner Timing Corner Marks' },
            { key: 'enableInstructions', label: 'Candidate Instructions Box' },
            { key: 'enableSignatureBox', label: 'Candidate Signature Box' },
            { key: 'enableInvigilatorSign', label: 'Invigilator Signature Box' },
            { key: 'enableBarcode', label: 'Machine Barcode & ID' },
          ].map((item) => {
            const isEnabled = Boolean((config as any)[item.key]);
            return (
              <div
                key={item.key}
                className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <span className="text-xs font-semibold text-slate-700">
                  {item.label}
                </span>

                <button
                  type="button"
                  onClick={() => onChange({ [item.key]: !isEnabled } as any)}
                  className={`w-10 h-5.5 rounded-full transition-colors relative cursor-pointer ${
                    isEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full transition-transform shadow-xs ${
                      isEnabled ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

