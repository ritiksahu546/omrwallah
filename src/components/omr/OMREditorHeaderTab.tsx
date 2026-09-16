import React, { useRef } from 'react';
import { OMRConfig } from '../../types/omr';
import { AlignLeft, AlignCenter, AlignRight, Upload, X, Image as ImageIcon } from 'lucide-react';

interface OMREditorHeaderTabProps {
  config: OMRConfig;
  onChange: (updates: Partial<OMRConfig>) => void;
}

export const OMREditorHeaderTab: React.FC<OMREditorHeaderTabProps> = ({
  config,
  onChange,
}) => {
  const { header } = config;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateHeader = (fields: Partial<typeof header>) => {
    onChange({
      header: {
        ...header,
        ...fields,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Logo image should be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        updateHeader({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 text-sm">
      
      {/* Logo Upload & Position */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Institute Logo
        </label>

        <div className="flex items-center gap-3">
          {header.logoUrl ? (
            <div className="relative w-14 h-14 border border-slate-300 rounded-lg overflow-hidden bg-white p-1 flex items-center justify-center group">
              <img
                src={header.logoUrl}
                alt="Uploaded Logo"
                className="w-full h-full object-contain"
              />
              <button
                type="button"
                onClick={() => updateHeader({ logoUrl: undefined })}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Remove logo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-14 h-14 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 bg-white cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 mb-0.5" />
              <span className="text-[9px] font-bold">Logo</span>
            </div>
          )}

          <div className="flex-1 space-y-1.5">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
            >
              {header.logoUrl ? 'Change Logo Image' : 'Upload Institute Logo'}
            </button>
            <p className="text-[10px] text-slate-500">PNG, JPG, or SVG (max 2MB)</p>
          </div>
        </div>

        {/* Logo Position */}
        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">Logo Position:</span>
          <div className="flex gap-1">
            {(['left', 'right'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => updateHeader({ logoPosition: pos })}
                className={`px-2 py-1 rounded text-xs font-bold capitalize border cursor-pointer ${
                  header.logoPosition === pos
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* School / Institute Name */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
          School / Coaching / Institute Name
        </label>
        <input
          type="text"
          value={header.schoolName}
          onChange={(e) => updateHeader({ schoolName: e.target.value })}
          placeholder="e.g. APEX ACADEMY OF EXCELLENCE"
          className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>

      {/* Tagline / Subtitle */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
          Tagline / Subtitle
        </label>
        <input
          type="text"
          value={header.tagline}
          onChange={(e) => updateHeader({ tagline: e.target.value })}
          placeholder="e.g. Premier Institute for JEE & NEET Preparation"
          className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>

      {/* Contact & Session in 2-cols */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
            Session Year
          </label>
          <input
            type="text"
            value={header.sessionYear || ''}
            onChange={(e) => updateHeader({ sessionYear: e.target.value })}
            placeholder="e.g. 2025-26"
            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
            Header Title Size
          </label>
          <select
            value={header.headerFontSize || 'medium'}
            onChange={(e) => updateHeader({ headerFontSize: e.target.value as any })}
            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
          >
            <option value="small">Small (Compact)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="large">Large (Prominent)</option>
          </select>
        </div>
      </div>

      {/* Address / Contact Info */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
          Branch / Contact Info
        </label>
        <input
          type="text"
          value={header.contactInfo || ''}
          onChange={(e) => updateHeader({ contactInfo: e.target.value })}
          placeholder="e.g. Main Campus, Knowledge Park, New Delhi • Helpline: 1800-123-456"
          className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>

      {/* Exam Name */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
          Exam Title
        </label>
        <input
          type="text"
          value={header.examName}
          onChange={(e) => updateHeader({ examName: e.target.value })}
          placeholder="e.g. All India Scholarship Test / Unit Assessment"
          className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>

      {/* Subject & Set Series in a 2-col row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
            Subject Name
          </label>
          <input
            type="text"
            value={header.subjectName}
            onChange={(e) => updateHeader({ subjectName: e.target.value })}
            placeholder="e.g. Science & Mathematics"
            className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
            Set / Series
          </label>
          <div className="flex gap-1">
            {['A', 'B', 'C', 'D'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateHeader({ setSeries: s })}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  header.setSeries === s
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Header Text Alignment
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'left', label: 'Left', icon: AlignLeft },
            { id: 'center', label: 'Center', icon: AlignCenter },
            { id: 'right', label: 'Right', icon: AlignRight },
          ].map((align) => {
            const Icon = align.icon;
            return (
              <button
                key={align.id}
                type="button"
                onClick={() => updateHeader({ textAlignment: align.id as any })}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  header.textAlignment === align.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{align.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dividers & Borders */}
      <div className="pt-2 border-t border-slate-200 space-y-2">
        <label className="flex items-center justify-between py-1 cursor-pointer">
          <span className="text-xs font-semibold text-slate-700">Show Header Divider Line</span>
          <input
            type="checkbox"
            checked={header.showDivider}
            onChange={(e) => updateHeader({ showDivider: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between py-1 cursor-pointer">
          <span className="text-xs font-semibold text-slate-700">Show A4 Outer Frame Border</span>
          <input
            type="checkbox"
            checked={header.showBorder}
            onChange={(e) => updateHeader({ showBorder: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
};
