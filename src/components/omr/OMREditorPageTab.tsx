import React from 'react';
import { OMRConfig, PageSize } from '../../types/omr';
import { FileText, Layout, Copy, Shield } from 'lucide-react';

interface OMREditorPageTabProps {
  config: OMRConfig;
  onChange: (updates: Partial<OMRConfig>) => void;
}

export const OMREditorPageTab: React.FC<OMREditorPageTabProps> = ({
  config,
  onChange,
}) => {
  const { page } = config;

  const updatePage = (fields: Partial<typeof page>) => {
    onChange({
      page: {
        ...page,
        ...fields,
      },
    });
  };

  return (
    <div className="space-y-5 text-sm">
      
      {/* Paper Size & Orientation */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Paper Size Standard
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['A4', 'A5', 'Letter'].map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => updatePage({ size: sz as PageSize })}
                className={`py-2 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                  page.size === sz
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
            Orientation
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'portrait', label: 'Portrait (Vertical)' },
              { id: 'landscape', label: 'Landscape (Horizontal)' },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => updatePage({ orientation: o.id as any })}
                className={`py-2 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                  (page.orientation || 'portrait') === o.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sheets per A4 Page (Paper Saving Mode) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
          Sheets Per Page (Paper Saving)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 1, label: '1 Sheet (Full A4)', desc: 'Standard exam format for 50-200 Qs' },
            { id: 2, label: '2 Sheets (2-Up A5)', desc: 'Cut paper costs by 50% for 20-50 Qs' },
          ].map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => onChange({ sheetsPerPage: sp.id as 1 | 2 })}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                (config.sheetsPerPage || 1) === sp.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{sp.label}</div>
              <div className={`text-[10px] mt-0.5 ${(config.sheetsPerPage || 1) === sp.id ? 'text-blue-100' : 'text-slate-500'}`}>
                {sp.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Margin Presets */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Print Margins
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'compact', label: 'Compact (6mm)', val: 6 },
            { id: 'normal', label: 'Standard (8mm)', val: 8 },
            { id: 'wide', label: 'Spacious (12mm)', val: 12 },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                updatePage({
                  marginTop: m.val,
                  marginBottom: m.val,
                  marginLeft: m.val,
                  marginRight: m.val,
                })
              }
              className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                page.marginTop === m.val
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Watermark security */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Security Watermark
          </span>
          <input
            type="checkbox"
            checked={Boolean(config.watermark?.enabled)}
            onChange={(e) =>
              onChange({
                watermark: {
                  enabled: e.target.checked,
                  text: config.watermark?.text || 'OFFICIAL OMR',
                  opacity: 0.08,
                },
              })
            }
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </div>

        {config.watermark?.enabled && (
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Watermark Text (Faint Diagonal)
            </label>
            <input
              type="text"
              value={config.watermark.text}
              onChange={(e) =>
                onChange({
                  watermark: {
                    ...config.watermark!,
                    text: e.target.value,
                  },
                })
              }
              placeholder="e.g. APEX ACADEMY • CONFIDENTIAL"
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        )}
      </div>

      {/* Footer Branding Line */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
          Bottom Footer Line
        </label>
        <input
          type="text"
          value={config.footerText || ''}
          onChange={(e) => onChange({ footerText: e.target.value })}
          placeholder="e.g. Generated by OMRWallah • For support contact test@institute.com"
          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
        />
      </div>

      {/* Printable Boundary Safe Note */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 leading-relaxed">
        <span className="font-bold block mb-1">🖨️ A4 Print Calibration Standard</span>
        Calculated to exact 210mm × 297mm dimensions. Content will not truncate or clip on any standard desktop laser or high-speed duplicator.
      </div>

    </div>
  );
};

