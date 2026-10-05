'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Scale, 
  Wallet, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  BarChart3, 
  PieChart, 
  Percent,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { FinancialReport, Language } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/i18n';
import { calculateIFRSRatios, RatioItem, RatioStatus } from '@/lib/ratios';

interface RatioAnalysisSectionProps {
  report: FinancialReport;
  lang: Language;
}

export function RatioAnalysisSection({ report, lang }: RatioAnalysisSectionProps) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.uz;
  const analysis = calculateIFRSRatios(report);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'liquidity' | 'profitability' | 'solvency' | 'investor'>('all');

  const filteredRatios = selectedCategory === 'all' 
    ? analysis.ratios 
    : analysis.ratios.filter(r => r.category === selectedCategory);

  const getStatusBadge = (status: RatioStatus) => {
    switch (status) {
      case 'optimal':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
          label: t.statusOptimal || 'Optimal'
        };
      case 'good':
        return {
          bg: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800',
          icon: <CheckCircle className="w-3.5 h-3.5 text-sky-600" />,
          label: t.statusGood || 'Yaxshi'
        };
      case 'warning':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          label: t.statusWarning || 'Diqqat'
        };
      case 'critical':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
          label: t.statusCritical || 'Kritik'
        };
    }
  };

  // Max value for revenue trend chart scaling
  const maxRevenue = Math.max(...analysis.monthlyTrends.map(m => Math.max(m.revenue, m.netProfit, 100)), 1000);
  const totalAssets = report.balance_sheet.assets.total_assets || 1;
  const cashPct = Math.min(100, Math.max(0, Math.round(((report.balance_sheet.assets.cash || 0) / totalAssets) * 100)));
  const faPct = Math.min(100, Math.max(0, 100 - cashPct));
  const debtPct = Math.min(100, Math.max(0, Math.round(((report.balance_sheet.liabilities.total_liabilities || 0) / totalAssets) * 100)));
  const eqPct = Math.min(100, Math.max(0, 100 - debtPct));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Overall Health Score Card */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>IFRS / MHXS Moliyaviy Tahlili</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
              {t.ratioAnalysis || "Moliyaviy koeffitsiyentlar tahlili"}
            </h2>
            <p className="text-sky-200/80 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              {t.ratioAnalysisSubtitle || "IFRS standartlari bo'yicha likvidlik, rentabellik va moliyaviy barqarorlik ko'rsatkichlari"}
            </p>
          </div>

          {/* Health Gauge */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={analysis.overallHealthScore >= 70 ? "text-emerald-400" : analysis.overallHealthScore >= 50 ? "text-amber-400" : "text-rose-400"}
                  strokeDasharray={`${analysis.overallHealthScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold font-serif text-lg text-white">
                {analysis.overallHealthScore}
              </div>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-sky-200 block font-semibold">Moliyaviy Salomatlik</span>
              <span className="text-base font-bold text-white block">
                {analysis.overallHealthScore >= 75 ? "Barqaror va Daromadli" : analysis.overallHealthScore >= 50 ? "O'rtacha holat" : "Xavfli / Isloh kerak"}
              </span>
              <span className="text-[10px] text-sky-300/70">100 balli IFRS shkalasida</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart A: Monthly Revenue & Net Profit Trend */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-600" />
                <span>{t.revenueVsProfit || "Daromad va Sof foyda oqimi"}</span>
              </h3>
              <span className="text-xs text-slate-500">Oylik tushum va sof foyda dinamikasi</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-sky-600">
                <span className="w-3 h-3 rounded-sm bg-sky-500 inline-block" /> Tushum
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Sof foyda
              </span>
            </div>
          </div>

          {/* SVG Visual Bars */}
          <div className="h-56 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
            {analysis.monthlyTrends.length === 0 ? (
              <div className="w-full text-center text-xs text-slate-400 py-16">Ma'lumotlar mavjud emas</div>
            ) : (
              analysis.monthlyTrends.map((pt) => {
                const revHeight = Math.max(12, Math.round((pt.revenue / maxRevenue) * 160));
                const profitHeight = Math.max(8, Math.round((Math.abs(pt.netProfit) / maxRevenue) * 160));
                const isProfitNegative = pt.netProfit < 0;

                return (
                  <div key={pt.month} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] py-1 px-2.5 rounded-lg pointer-events-none shadow-xl whitespace-nowrap">
                      <div>Tushum: ${pt.revenue.toLocaleString()}</div>
                      <div>Sof foyda: ${pt.netProfit.toLocaleString()}</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                      {/* Revenue Bar */}
                      <div 
                        style={{ height: `${revHeight}px` }} 
                        className="w-1/2 max-w-[28px] bg-gradient-to-t from-sky-600 to-sky-400 rounded-t-md transition-all group-hover:brightness-110 shadow-xs"
                      />
                      {/* Profit Bar */}
                      <div 
                        style={{ height: `${profitHeight}px` }} 
                        className={`w-1/2 max-w-[28px] rounded-t-md transition-all group-hover:brightness-110 shadow-xs ${
                          isProfitNegative ? 'bg-gradient-to-t from-rose-600 to-rose-400' : 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        }`}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 mt-2 truncate w-full text-center">{pt.month}</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
            <span>IFRS 15 bo'yicha tan olingan tushum</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Jami davr tushumi: ${report.pnl.revenue.toLocaleString()}</span>
          </div>
        </div>

        {/* Chart B: Capital & Asset Structure Donut / Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>{t.capitalBreakdown || "Kapital va aktivlar tarkibi"}</span>
            </h3>
            <span className="text-xs text-slate-500">Balans strukturasi (A = M + K)</span>
          </div>

          {/* Visual Bars */}
          <div className="space-y-4 my-6">
            {/* Assets Stack */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Aktivlar tarkibi:</span>
                <span className="font-mono text-slate-900 dark:text-white">${report.balance_sheet.assets.total_assets.toLocaleString()}</span>
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${cashPct}%` }} className="bg-sky-500 h-full transition-all" title={`Kassa: ${cashPct}%`} />
                <div style={{ width: `${faPct}%` }} className="bg-indigo-500 h-full transition-all" title={`Asosiy vositalar: ${faPct}%`} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" /> Kassa/Bank ({cashPct}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Uskunalar ({faPct}%)</span>
              </div>
            </div>

            {/* Liabilities & Equity Stack */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Moliyalashtirish manbalari:</span>
                <span className="font-mono text-slate-900 dark:text-white">${report.balance_sheet.total_liabilities_and_equity.toLocaleString()}</span>
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${debtPct}%` }} className="bg-rose-500 h-full transition-all" title={`Qarzlar: ${debtPct}%`} />
                <div style={{ width: `${eqPct}%` }} className="bg-emerald-500 h-full transition-all" title={`Xususiy kapital: ${eqPct}%`} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Qarzlar ({debtPct}%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Xususiy kapital ({eqPct}%)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>Balans holati:</span>
            <span className={`font-bold ${report.balance_sheet.is_balanced ? 'text-emerald-600' : 'text-rose-600'}`}>
              {report.balance_sheet.is_balanced ? "Mukammal balanslangan (100%)" : "Xatolik mavjud"}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'all' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Barchasi ({analysis.ratios.length})
          </button>
          <button
            onClick={() => setSelectedCategory('liquidity')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'liquidity' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t.liquidityGroup || "Likvidlik"}
          </button>
          <button
            onClick={() => setSelectedCategory('profitability')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'profitability' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t.profitabilityGroup || "Rentabellik"}
          </button>
          <button
            onClick={() => setSelectedCategory('solvency')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'solvency' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t.solvencyGroup || "Qarz yuki"}
          </button>
          <button
            onClick={() => setSelectedCategory('investor')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'investor' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {t.investorGroup || "Aksiyadorlik"}
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>IFRS xalqaro standartlari asosidagi formulalar</span>
        </div>
      </div>

      {/* 4. Ratio Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRatios.map((item) => {
          const badge = getStatusBadge(item.status);
          const localizedName = t[item.nameKey] || item.key;

          return (
            <div 
              key={item.key} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-sky-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {localizedName}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${badge.bg}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                </div>

                <div className="flex items-baseline gap-1 my-2">
                  <span className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white">
                    {item.unit === '$' && '$'}
                    {item.value.toLocaleString()}
                  </span>
                  {item.unit && item.unit !== '$' && (
                    <span className="text-base font-bold text-slate-500">{item.unit}</span>
                  )}
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t.formulaText || "Formula"}:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 text-right">{item.formula}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{t.benchmarkText || "Xalqaro me'yor"}:</span>
                  <span className="font-semibold text-sky-600 dark:text-sky-400">{item.benchmark}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
