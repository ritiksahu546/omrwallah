import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface RelatedLinkItem {
  title: string;
  desc: string;
  route: string;
  path: string;
  tag?: string;
}

interface RelatedToolsSectionProps {
  title?: string;
  subtitle?: string;
  links: RelatedLinkItem[];
  onNavigate: (route: string) => void;
  className?: string;
}

export const RelatedToolsSection: React.FC<RelatedToolsSectionProps> = ({
  title = 'Related OMR Tools',
  subtitle = 'Explore complementary sheet makers, practice simulators, and printable exam formats.',
  links,
  onNavigate,
  className = '',
}) => {
  return (
    <section className={`bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 ${className}`}>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-slate-600 mt-1">{subtitle}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((item) => {
          const canonicalHref = `https://omrwallah.in/${item.path === '/' ? '' : item.path.replace(/^\//, '')}`;
          return (
            <a
              key={item.route}
              href={canonicalHref}
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && e.button === 0) {
                  e.preventDefault();
                  onNavigate(item.route);
                }
              }}
              className="p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group flex flex-col justify-between text-left"
            >
              <div className="space-y-1.5">
                {item.tag && (
                  <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md">
                    {item.tag}
                  </span>
                )}
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>Open Tool</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export const ContextualLink: React.FC<{
  to: string;
  path: string;
  children: React.ReactNode;
  onNavigate: (route: string) => void;
  className?: string;
}> = ({ to, path, children, onNavigate, className = '' }) => {
  const cleanPath = path === '/' ? '' : path.replace(/^\//, '');
  return (
    <a
      href={`https://omrwallah.in/${cleanPath}`}
      onClick={(e) => {
        if (!e.ctrlKey && !e.metaKey && e.button === 0) {
          e.preventDefault();
          onNavigate(to);
        }
      }}
      className={`text-blue-600 hover:text-blue-800 font-semibold underline decoration-blue-300 hover:decoration-blue-600 underline-offset-2 transition-colors ${className}`}
    >
      {children}
    </a>
  );
};
