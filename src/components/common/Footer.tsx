import React from 'react';
import { FileText, Heart, Shield, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0b132b] text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                OMR<span className="text-blue-500">Wallah</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              India's premier OMR solution for students, educators, and coaching academies. Design, print, practice, and evaluate A4 OMR sheets effortlessly.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-850 border border-slate-700 text-xs text-blue-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apni OMR, Apne Rules.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => onNavigate('creator')} className="hover:text-white transition-colors cursor-pointer">
                  OMR Creator
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  Template Gallery
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('practice')} className="hover:text-white transition-colors cursor-pointer">
                  Practice Mode
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('scan')} className="hover:text-white transition-colors cursor-pointer">
                  OMR Scanner (Beta)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors cursor-pointer">
                  Pricing Plans
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => onNavigate('blog')} className="hover:text-white transition-colors cursor-pointer">
                  Exam & OMR Guides
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
                  Help Center & FAQs
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  NEET OMR Sheet
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('templates')} className="hover:text-white transition-colors cursor-pointer">
                  JEE OMR Sheet
                </button>
              </li>
            </ul>
          </div>

          {/* Target Audience */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Audiences</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-slate-400">For NEET & JEE Aspirants</li>
              <li className="text-slate-400">For Coaching Institutes</li>
              <li className="text-slate-400">For School Teachers</li>
              <li className="text-slate-400">For Self-Study Students</li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} OMRWallah. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Designed for Students & Teachers across India</span>
            <span className="text-slate-400 font-medium">Ab Har Exam Hoga Easy!</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
