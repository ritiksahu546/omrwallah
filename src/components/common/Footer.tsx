import React from 'react';
import { FileText, Heart, Shield, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0b132b] text-slate-400 border-t border-slate-800 text-sm w-full max-w-full overflow-hidden min-w-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 w-full min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          
          {/* Brand Col */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate('home');
                }
              }}
              aria-label="OMR Wallah Homepage"
              className="inline-flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="rounded-full p-[1.5px] bg-gradient-to-tr from-sky-400 via-blue-500 to-amber-400 shadow-md shadow-blue-500/20 shrink-0 transition-transform duration-200 group-hover:scale-105">
                <img
                  src="/images/omrwallah-logo.png"
                  alt="OMR Wallah logo"
                  width={42}
                  height={42}
                  loading="lazy"
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain rounded-full bg-[#0b132b] block"
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                OMR<span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Wallah</span>
              </span>
            </a>
            <p className="text-slate-400 text-xs leading-relaxed">
              India's dedicated OMR platform. Design, print, practice, and evaluate A4 OMR sheets effortlessly for schools, institutes, and competitive exam aspirants.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-amber-400/30 text-xs text-amber-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Apni OMR, Apne Rules.</span>
            </div>
          </div>

          {/* OMR Tools */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">OMR Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://omrwallah.in/omr-sheet-generator"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-sheet-generator');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  OMR Sheet Generator
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/omr-sheet-maker"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-sheet-maker');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  OMR Sheet Maker
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/omr-sheet-pdf"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-sheet-pdf');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  OMR Sheet PDF Download
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/online-omr-sheet"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('online-omr-sheet');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Online OMR Sheet
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/creator"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('creator');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Visual Sheet Designer
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/templates"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('templates');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Template Gallery
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions & Practice */}
          <div>
            <h4 className="text-white font-semibold text-xs mb-3">Practice &amp; Use Cases</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://omrwallah.in/practice"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('practice');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Online OMR Practice
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/omr-sheet-for-coaching"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-sheet-for-coaching');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  For Coaching Institutes
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/omr-sheet-for-schools"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-sheet-for-schools');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  For Schools &amp; Teachers
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/omr-practice"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-practice');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  OMR Practice Drills
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/pricing"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('pricing');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Exam Guides */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Exam Guides</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://omrwallah.in/omr-exams"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('omr-exams');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-blue-400 block"
                >
                  All Exam Guides Hub →
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/neet-omr-sheet"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('neet-omr-sheet');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  NEET OMR Sheet Guide
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/jee-omr-sheet"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('jee-omr-sheet');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  JEE OMR Sheet Guide
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/ssc-omr-sheet"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('ssc-omr-sheet');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  SSC 100Q OMR Guide
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/cuet-omr-sheet"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('cuet-omr-sheet');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  CUET 50Q OMR Guide
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/ctet-omr-sheet"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('ctet-omr-sheet');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  CTET 150Q OMR Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Articles */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Knowledge Base</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://omrwallah.in/blog"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('blog');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left font-semibold text-blue-400 block"
                >
                  OMR Knowledge Hub →
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/faq"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('faq');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  Help Center &amp; FAQs
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/blog"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('blog');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  How to Fill OMR Correctly
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/blog"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('blog');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  5 Golden Printing Rules
                </a>
              </li>
              <li>
                <a
                  href="https://omrwallah.in/blog"
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                      e.preventDefault();
                      onNavigate('blog');
                    }
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left block"
                >
                  How OMR Checking Works
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} OMRWallah. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-6">
            <span>Designed for Students &amp; Teachers across India</span>
            <span className="text-slate-400 font-medium">Ab Har Exam Hoga Easy!</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
