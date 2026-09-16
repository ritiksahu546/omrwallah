import React, { useState } from 'react';
import { OMRConfig, RollNumberStyle, OMRCustomField } from '../../types/omr';
import { Plus, Trash2, Sliders, Hash } from 'lucide-react';

interface OMREditorFieldsTabProps {
  config: OMRConfig;
  onChange: (updates: Partial<OMRConfig>) => void;
}

export const OMREditorFieldsTab: React.FC<OMREditorFieldsTabProps> = ({
  config,
  onChange,
}) => {
  const digitOptions = [4, 5, 6, 7, 8, 9, 10];
  const [newFieldLabel, setNewFieldLabel] = useState('');

  const addCustomField = () => {
    if (!newFieldLabel.trim()) return;
    const newField: OMRCustomField = {
      id: `cf_${Date.now()}`,
      label: newFieldLabel.trim(),
      type: 'text',
    };
    onChange({
      customFields: [...(config.customFields || []), newField],
    });
    setNewFieldLabel('');
  };

  const removeCustomField = (id: string) => {
    onChange({
      customFields: (config.customFields || []).filter((f) => f.id !== id),
    });
  };

  return (
    <div className="space-y-5 text-sm">
      
      {/* 1. Roll Number Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Roll Number Grid
            </span>
            <span className="text-[11px] text-slate-500">Bubble columns (0-9) for automated scanner capture</span>
          </div>
          <input
            type="checkbox"
            checked={config.enableRollNumber}
            onChange={(e) => onChange({ enableRollNumber: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {config.enableRollNumber && (
          <>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Number of Digits
              </label>
              <div className="flex flex-wrap gap-1">
                {digitOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChange({ rollNumberDigits: d })}
                    className={`w-8 h-7 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      (config.rollNumberDigits || 7) === d
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Grid Style
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'both', label: 'Box + Bubbles' },
                  { id: 'bubbles', label: 'Bubbles Only' },
                  { id: 'boxes', label: 'Boxes Only' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onChange({ rollNumberStyle: st.id as RollNumberStyle })}
                    className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                      config.rollNumberStyle === st.id
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2. Registration / Application Number Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Registration / Application No.
            </span>
            <span className="text-[11px] text-slate-500">Secondary student identification grid</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.enableRegistrationNumber)}
            onChange={(e) => onChange({ enableRegistrationNumber: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {config.enableRegistrationNumber && (
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Number of Digits
            </label>
            <div className="flex flex-wrap gap-1">
              {[6, 7, 8, 9, 10].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ registrationNumberDigits: d })}
                  className={`w-8 h-7 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    (config.registrationNumberDigits || 8) === d
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Center Code Grid */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Examination Centre Code
            </span>
            <span className="text-[11px] text-slate-500">For multi-center or franchise examinations</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(config.enableCenterCode)}
            onChange={(e) => onChange({ enableCenterCode: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {config.enableCenterCode && (
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
              Number of Digits
            </label>
            <div className="flex flex-wrap gap-1">
              {[3, 4, 5, 6].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ centerCodeDigits: d })}
                  className={`w-8 h-7 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    (config.centerCodeDigits || 5) === d
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Student Meta Fields */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Candidate & Exam Metadata Fields
        </label>
        
        <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
          {[
            { key: 'enableCandidateName', label: 'Candidate Name' },
            { key: 'enableFatherName', label: "Father's Name" },
            { key: 'enableSubjectExam', label: 'Exam & Subject Name' },
            { key: 'enableClassBatch', label: 'Class / Batch Code' },
            { key: 'enableDateField', label: 'Date of Examination' },
          ].map((item) => {
            const isChecked = Boolean((config as any)[item.key]);
            return (
              <label
                key={item.key}
                className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => onChange({ [item.key]: e.target.checked } as any)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Fields Creator */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Custom Fields (e.g. Room No., Branch)
        </label>
        
        <div className="flex items-center gap-1.5 mb-2">
          <input
            type="text"
            placeholder="Field Label (e.g. Room No.)"
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomField();
              }
            }}
            className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
          <button
            type="button"
            onClick={addCustomField}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {config.customFields && config.customFields.length > 0 && (
          <div className="space-y-1.5">
            {config.customFields.map((cf) => (
              <div
                key={cf.id}
                className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                <span>{cf.label}</span>
                <button
                  type="button"
                  onClick={() => removeCustomField(cf.id)}
                  className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Signature Boxes */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Signatures & Machine Codes
        </label>
        
        <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
          <label className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
            <span className="text-xs font-semibold text-slate-700">Candidate Signature Box</span>
            <input
              type="checkbox"
              checked={config.enableSignatureBox}
              onChange={(e) => onChange({ enableSignatureBox: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
            <span className="text-xs font-semibold text-slate-700">Invigilator Signature Box</span>
            <input
              type="checkbox"
              checked={config.enableInvigilatorSign}
              onChange={(e) => onChange({ enableInvigilatorSign: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
            <span className="text-xs font-semibold text-slate-700">Barcode Identifier</span>
            <input
              type="checkbox"
              checked={config.enableBarcode}
              onChange={(e) => onChange({ enableBarcode: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between py-1 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
            <span className="text-xs font-semibold text-slate-700">QR Code Security Seal</span>
            <input
              type="checkbox"
              checked={config.enableQrCode}
              onChange={(e) => onChange({ enableQrCode: e.target.checked })}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>
      </div>

    </div>
  );
};

