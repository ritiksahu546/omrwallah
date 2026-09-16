import React, { useState } from 'react';
import { OMRConfig } from '../../types/omr';
import { Plus, Trash2, RotateCcw, BookOpen, CheckCircle2 } from 'lucide-react';

interface OMREditorInstructionsTabProps {
  config: OMRConfig;
  onChange: (updates: Partial<OMRConfig>) => void;
}

export const OMREditorInstructionsTab: React.FC<OMREditorInstructionsTabProps> = ({
  config,
  onChange,
}) => {
  const [newInstruction, setNewInstruction] = useState('');

  const handleAdd = () => {
    if (!newInstruction.trim()) return;
    onChange({
      instructions: [...config.instructions, newInstruction.trim()],
    });
    setNewInstruction('');
  };

  const handleRemove = (index: number) => {
    const updated = config.instructions.filter((_, i) => i !== index);
    onChange({ instructions: updated });
  };

  const applyPreset = (presetKey: 'standard' | 'negative' | 'bilingual' | 'compact') => {
    if (presetKey === 'standard') {
      onChange({
        instructions: [
          'Use blue or black ball point pen only. Gel pens are strictly prohibited.',
          'Darken the bubble completely. Incomplete or faint darkening may not be evaluated.',
          'Do not make any stray marks, cross (✗) or tick (✓) marks on this sheet.',
          'Do not fold, tear, staple or wrinkle the OMR answer sheet.',
        ],
      });
    } else if (presetKey === 'negative') {
      onChange({
        instructions: [
          'Use black or blue ball point pen only. Rough work must not be done on this sheet.',
          'Each question has 4 options. Darken only one option per question.',
          'Negative Marking applies: 1/4th or 1/3rd marks will be deducted for each incorrect answer.',
          'Do not use whitener, eraser, blade or correction fluid under any circumstances.',
        ],
      });
    } else if (presetKey === 'bilingual') {
      onChange({
        instructions: [
          'Use Blue/Black ball point pen only (केवल नीले या काले बॉल पेन का प्रयोग करें).',
          'Darken the oval completely (गोले को पूरी तरह से गहरा काला/नीला करें).',
          'Multiple darkening will be treated as incorrect (एक से अधिक गोला भरने पर उत्तर गलत माना जाएगा).',
          'Ensure Roll Number is bubbled accurately (सुनिश्चित करें कि रोल नंबर सही भरा गया है).',
        ],
      });
    } else if (presetKey === 'compact') {
      onChange({
        instructions: [
          'Fill bubbles completely with Blue/Black ball pen.',
          'Only one bubble per question. Avoid stray marks or folding.',
        ],
      });
    }
  };

  return (
    <div className="space-y-4 text-sm">
      
      {/* Instructions toggle */}
      <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
            Instructions Box
          </span>
          <span className="text-[11px] text-slate-500">Show guidance notes at the top/bottom of the sheet</span>
        </div>
        <input
          type="checkbox"
          checked={config.enableInstructions !== false}
          onChange={(e) => onChange({ enableInstructions: e.target.checked })}
          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
        />
      </div>

      {config.enableInstructions !== false && (
        <>
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              Quick Templates
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'standard', label: 'Standard CBSE/School' },
                { id: 'negative', label: 'Competitive (Negative)' },
                { id: 'bilingual', label: 'Bilingual (Eng + Hin)' },
                { id: 'compact', label: 'Compact (2 Rules)' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p.id as any)}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-xs font-semibold text-slate-700 text-left transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700">
              Exam Rules List
            </label>
            <button
              type="button"
              onClick={() => applyPreset('standard')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Instructions list */}
          <div className="space-y-2">
            {config.instructions.map((ins, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg text-xs group"
              >
                <span className="font-bold text-slate-400 w-4">{idx + 1}.</span>
                <input
                  type="text"
                  value={ins}
                  onChange={(e) => {
                    const updated = [...config.instructions];
                    updated[idx] = e.target.value;
                    onChange({ instructions: updated });
                  }}
                  className="flex-1 text-slate-800 font-medium focus:outline-none focus:border-b focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Delete rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new rule */}
          <div className="flex gap-1.5 pt-1">
            <input
              type="text"
              value={newInstruction}
              onChange={(e) => setNewInstruction(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add custom rule..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </>
      )}

    </div>
  );
};

