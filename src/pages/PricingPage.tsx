import React, { useState } from 'react';
import { Check, Sparkles, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { MOCK_FAQS } from '../data/mockData';

interface PricingPageProps {
  onUpgradePro: () => void;
  onNavigate: (route: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onUpgradePro,
  onNavigate,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      tagline: 'For students & casual practice',
      priceMonthly: '₹0',
      priceYearly: '₹0',
      period: 'forever',
      popular: false,
      features: [
        '5 OMR Sheets / month',
        'Standard Exam Templates',
        'High-Resolution PDF Download',
        'Direct A4 Printing',
        'Basic Scanner (5 scans/mo)',
        'Standard Question Types',
      ],
      buttonText: 'Get Started Free',
      buttonAction: () => onNavigate('creator'),
      buttonVariant: 'secondary',
    },
    {
      name: 'Pro',
      tagline: 'For serious aspirants & individual teachers',
      priceMonthly: '₹499',
      priceYearly: '₹399',
      period: 'per month',
      popular: true,
      features: [
        'Unlimited OMR Sheet Generations',
        'All Premium Exam Templates (NEET, JEE, UPSC)',
        'Full Custom Layout & Header Designer',
        'Unlimited Mobile Camera Scanning',
        'Instant Automated Evaluation & Scorecard',
        'Clean PDF Output (Watermark Free)',
        'Question Analysis & Weak Area Heatmaps',
        'Priority Email & Chat Support',
      ],
      buttonText: 'Upgrade to Pro',
      buttonAction: onUpgradePro,
      buttonVariant: 'primary',
    },
    {
      name: 'Coaching / Institute',
      tagline: 'For schools, academies & test series centers',
      priceMonthly: '₹1,999',
      priceYearly: '₹1,599',
      period: 'per month',
      popular: false,
      features: [
        'Everything in Pro Plan',
        'Multi-Teacher & Staff Accounts',
        'Custom Academy Logo & Watermark',
        'High-Speed Batch Scanning (100+ at once)',
        'Student Ranking & Leaderboard Portal',
        'Excel & CSV Result Export',
        'Candidate Roll Number Barcode Generator',
        'Dedicated Technical Account Manager',
      ],
      buttonText: 'Contact Sales / Subscribe',
      buttonAction: onUpgradePro,
      buttonVariant: 'secondary',
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-12 w-full max-w-full overflow-x-hidden">
      
      {/* Top Header (matching reference image #7) */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          AFFORDABLE & TRANSPARENT
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Choose the plan that fits your preparation or institute needs
        </p>

        {/* Billing Toggle (Monthly / Yearly) */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center text-xs font-bold">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <span>Yearly</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-1.5 py-0.5 rounded-md">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid (matching reference image #7) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => {
          const price = billingCycle === 'yearly' ? p.priceYearly : p.priceMonthly;
          return (
            <div
              key={p.name}
              className={`bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                p.popular
                  ? 'border-2 border-blue-600 shadow-xl shadow-blue-500/10 lg:-translate-y-2'
                  : 'border border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.tagline}</p>

                <div className="mt-5 pb-6 border-b border-slate-100 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    {price}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    /{p.period}
                  </span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-slate-700 font-medium">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={p.buttonAction}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    p.buttonVariant === 'primary'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{p.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-base text-slate-900">
              100% Risk-Free Guarantee
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Cancel anytime with a single click. No lock-in contracts or hidden charges.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('faq')}
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Frequently Asked Questions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
