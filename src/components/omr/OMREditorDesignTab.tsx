import React from 'react';
import { OMRConfig, BubbleShape, NumberingStyle } from '../../types/omr';
import { Circle, Square, Printer, Type } from 'lucide-react';

interface OMREditorDesignTabProps {
  config: OMRConfig;
  onChange: (updates: Partial<OMRConfig>) => void;
}

export const OMREditorDesignTab: React.FC<OMREditorDesignTabProps> = ({
  config,
  onChange,
}) => {
  const { bubble } = config;

  const updateBubble = (fields: Partial<typeof bubble>) => {
    onChange({
      bubble: {
        ...bubble,
        ...fields,
      },
    });
  };

  return (
    <div className="space-y-5 text-sm">
      
      {/* 1. Print Mode */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
          <Printer className="w-3.5 h-3.5 text-blue-600" />
          Print Color & Ink Mode
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'monochrome', label: '100% Pure Black', desc: 'Best for Xerox, Photocopy & Risograph' },
            { id: 'navy', label: 'Dark Navy Slate', desc: 'Crisp for high-end laser printing' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChange({ printMode: mode.id as any })}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                (config.printMode || 'monochrome') === mode.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold">{mode.label}</div>
              <div className={`text-[10px] mt-0.5 ${(config.printMode || 'monochrome') === mode.id ? 'text-blue-100' : 'text-slate-500'}`}>
                {mode.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Font Family */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Typography / Font Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'sans', label: 'Clean Sans', font: 'font-sans' },
            { id: 'serif', label: 'Formal Serif', font: 'font-serif' },
            { id: 'mono', label: 'Technical Mono', font: 'font-mono' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() =>
                onChange({
                  page: {
                    ...config.page,
                    fontFamily: f.id as any,
                  },
                })
              }
              className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${f.font} ${
                config.page.fontFamily === f.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bubble Shape & Size */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Bubble Shape
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'circle', label: 'Circle', icon: Circle },
            { id: 'rounded', label: 'Rounded Box', icon: Square },
            { id: 'square', label: 'Square', icon: Square },
          ].map((sh) => {
            const Icon = sh.icon;
            return (
              <button
                key={sh.id}
                type="button"
                onClick={() => updateBubble({ shape: sh.id as BubbleShape })}
                className={`py-2 px-1 text-xs font-bold rounded-lg border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                  bubble.shape === sh.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                }`}
              >
                <Icon className={`w-4 h-4 ${sh.id === 'circle' ? 'rounded-full' : sh.id === 'rounded' ? 'rounded-xs' : ''}`} />
                <span>{sh.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bubble Diameter / Size */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Bubble Size & Diameter
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'small', label: 'Small (14px)', desc: '150-200 Qs' },
            { id: 'medium', label: 'Medium (17px)', desc: '75-100 Qs' },
            { id: 'large', label: 'Large (20px)', desc: '20-50 Qs' },
          ].map((sz) => (
            <button
              key={sz.id}
              type="button"
              onClick={() => updateBubble({ size: sz.id as any })}
              className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                (bubble.size || 'medium') === sz.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              <div className="text-xs font-bold">{sz.label}</div>
              <div className={`text-[10px] mt-0.5 ${(bubble.size || 'medium') === sz.id ? 'text-blue-100' : 'text-slate-500'}`}>
                {sz.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Bubble Border Thickness */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
          Bubble Border Thickness
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'thin', label: 'Thin (0.75px)' },
            { id: 'normal', label: 'Standard (1px)' },
            { id: 'thick', label: 'Thick (2px)' },
          ].map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => updateBubble({ borderThickness: th.id as any })}
              className={`py-2 px-1 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                bubble.borderThickness === th.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {th.label}
            </button>
          ))}
        </div>
      </div>

      {/* Auto-Fit Page Optimizer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
        <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
          ⚡ 1-Click Single A4 Auto-Fit
        </span>
        <p className="text-[11px] text-slate-500 leading-tight">
          Automatically scales bubble dimensions, margins and column divides to fit all {config.questionsCount} questions on 1 single A4 sheet.
        </p>
        <button
          type="button"
          onClick={() => {
            const count = config.questionsCount;
            if (count <= 50) {
              onChange({
                layoutColumns: '2',
                gridDensity: 'spacious',
                bubble: { ...bubble, size: 'large', spacing: 'spacious' },
              });
            } else if (count <= 100) {
              onChange({
                layoutColumns: '3',
                gridDensity: 'standard',
                bubble: { ...bubble, size: 'medium', spacing: 'normal' },
              });
            } else {
              onChange({
                layoutColumns: '4',
                gridDensity: 'compact',
                bubble: { ...bubble, size: 'small', spacing: 'compact' },
              });
            }
          }}
          className="w-full mt-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs text-center"
        >
          Optimize Layout for {config.questionsCount} Questions
        </button>
      </div>

      {/* 5. Scanner Calibration Corners */}
      <div className="pt-2 border-t border-slate-200">
        <label className="flex items-center justify-between py-1.5 cursor-pointer">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Scanner Registration Timing Marks</span>
            <span className="text-[11px] text-slate-500">4 corner calibration blocks + side timing ticks for OpenCV & OMR scanners</span>
          </div>
          <input
            type="checkbox"
            checked={config.enableCornerMarks ?? true}
            onChange={(e) => onChange({ enableCornerMarks: e.target.checked })}
            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
          />
        </label>
      </div>

    </div>
  );
};

