'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Bot, 
  Smartphone, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  TrendingUp, 
  Scale, 
  Wallet, 
  Globe2, 
  Sparkles, 
  ShoppingBag, 
  Factory, 
  Utensils, 
  Tractor, 
  HardHat, 
  GraduationCap
} from 'lucide-react';
import { Language, OrganizationType } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/i18n';
import { BUSINESS_TYPES, CATEGORIES_META } from '@/lib/categories';
import { Storage } from '@/lib/storage';

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('uz');
  const [selectedIndustry, setSelectedIndustry] = useState<OrganizationType>('shop');

  useEffect(() => {
    const saved = Storage.getLanguage();
    setLang(saved);
  }, []);

  const handleSelectLang = (l: Language) => {
    setLang(l);
    Storage.setLanguage(l);
  };

  const t = TRANSLATIONS[lang];

  const industryIcons: Record<string, React.ReactNode> = {
    shop: <ShoppingBag className="w-5 h-5" />,
    manufacturer: <Factory className="w-5 h-5" />,
    company: <Building2 className="w-5 h-5" />,
    restaurant: <Utensils className="w-5 h-5" />,
    farm: <Tractor className="w-5 h-5" />,
    education: <GraduationCap className="w-5 h-5" />,
    construction: <HardHat className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* 1. Header / Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold font-serif tracking-tight text-slate-900 dark:text-white">Moliya</span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              IFRS v2.0
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{t.navFeatures}</a>
          <a href="#industries" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{t.navIndustries}</a>
          <a href="#comparison" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{t.navComparison}</a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-xs font-semibold border border-slate-200 dark:border-slate-700">
            <Globe2 className="w-3.5 h-3.5 ml-1.5 mr-1 text-slate-400" />
            <button
              onClick={() => handleSelectLang('uz')}
              className={`px-2 py-1 rounded-md transition-all ${lang === 'uz' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              UZ
            </button>
            <button
              onClick={() => handleSelectLang('ru')}
              className={`px-2 py-1 rounded-md transition-all ${lang === 'ru' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              RU
            </button>
            <button
              onClick={() => handleSelectLang('en')}
              className={`px-2 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              EN
            </button>
          </div>

          {/* Launch App Button */}
          <Link
            href="/app"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-md shadow-sky-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t.launchApp}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs sm:text-sm font-semibold mb-6 animate-fade-in shadow-sm">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-serif tracking-tight max-w-4xl leading-[1.15] text-slate-900 dark:text-white mb-6">
          {t.heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.heroSubtitle}
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
          <Link
            href="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-base px-8 py-3.5 rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{t.getStartedFree}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-base px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm transition-all"
          >
            <BarChart3 className="w-5 h-5 text-sky-600" />
            <span>{t.viewDemo}</span>
          </a>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{t.noCreditCard}</span>
        </p>

        {/* Interactive Statement Preview Card */}
        <div id="demo" className="mt-14 w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden text-left">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 ml-2">Silk Road Trading • {t.bs}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.balanced}</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Assets */}
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>{t.assets}</span>
                <Wallet className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-3">
                $23,800.00
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between"><span>{t.cashLine}:</span> <b className="text-slate-800 dark:text-slate-200">$14,100</b></div>
                <div className="flex justify-between"><span>{t.fixedAssets}:</span> <b className="text-slate-800 dark:text-slate-200">$9,700</b></div>
              </div>
            </div>

            {/* Column 2: Liabilities */}
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>{t.liabilities}</span>
                <Scale className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-3">
                $5,500.00
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between"><span>{t.loansPayable}:</span> <b className="text-slate-800 dark:text-slate-200">$5,500</b></div>
                <div className="flex justify-between"><span>{t.totalLiabilities}:</span> <b className="text-slate-800 dark:text-slate-200">$5,500</b></div>
              </div>
            </div>

            {/* Column 3: Equity */}
            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <span>{t.equity}</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-3">
                $18,300.00
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between"><span>{t.initialCapital}:</span> <b className="text-slate-800 dark:text-slate-200">$16,500</b></div>
                <div className="flex justify-between"><span>{t.retainedEarnings}:</span> <b className="text-emerald-600 dark:text-emerald-400">+$2,800</b></div>
                <div className="flex justify-between"><span>{t.withdrawnCapital}:</span> <b className="text-rose-600 dark:text-rose-400">-$1,000</b></div>
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-sky-50 dark:bg-sky-950/30 border-t border-sky-100 dark:border-sky-900 text-xs text-sky-800 dark:text-sky-300 flex items-center justify-between">
            <span>{t.formulaLabel}: <b>{t.assets} ($23,800) = {t.liabilities} ($5,500) + {t.equity} ($18,300)</b></span>
            <Link href="/app" className="font-semibold underline hover:text-sky-600 flex items-center gap-1">
              <span>{t.launchApp}</span> <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Core Features Grid */}
      <section id="features" className="py-16 sm:py-24 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">{t.whyMoliyaBadge}</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-white mt-2">
              {t.featuresHeadline}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feature1Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.feature1Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feature2Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.feature2Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feature3Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.feature3Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feature4Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.feature4Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feature5Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.feature5Desc}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t.feature6Title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{t.feature6Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industry Templates Showcase */}
      <section id="industries" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">{t.industryTitle}</span>
          <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-white mt-2">
            {t.industrySubtitle}
          </h2>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {(Object.keys(BUSINESS_TYPES) as OrganizationType[]).slice(0, 7).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedIndustry(key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedIndustry === key
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-105'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {industryIcons[key] || <Building2 className="w-4 h-4" />}
              <span>{BUSINESS_TYPES[key].name[lang]}</span>
            </button>
          ))}
        </div>

        {/* Selected Industry Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600">
              {industryIcons[selectedIndustry] || <Building2 className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {BUSINESS_TYPES[selectedIndustry].name[lang]}
              </h3>
              <p className="text-xs text-slate-500">{t.industryBadge}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> {t.incomeCategories}
              </h4>
              <div className="flex flex-wrap gap-2">
                {BUSINESS_TYPES[selectedIndustry].income.map((catKey) => (
                  <span
                    key={catKey}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  >
                    {CATEGORIES_META[catKey]?.[lang] || catKey.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4" /> {t.expenseCategories}
              </h4>
              <div className="flex flex-wrap gap-2">
                {BUSINESS_TYPES[selectedIndustry].expense.map((catKey) => (
                  <span
                    key={catKey}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  >
                    {CATEGORIES_META[catKey]?.[lang] || catKey.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Comparison Table */}
      <section id="comparison" className="py-16 sm:py-24 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">{t.compareTitle}</span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-white mt-2">
              {t.compareSubtitle}
            </h2>
          </div>

          <div className="table-scroll-container">
            <table>
              <thead>
                <tr>
                  <th className="text-left font-bold">{t.featureCol}</th>
                  <th className="text-center">{t.excelCol}</th>
                  <th className="text-center">{t.erpCol}</th>
                  <th className="text-center font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50">{t.moliyaCol}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">{t.compRow1}</td>
                  <td className="text-center text-rose-500 font-bold"><XCircle className="w-5 h-5 mx-auto" /></td>
                  <td className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                  <td className="text-center text-emerald-500 font-bold bg-sky-50/50 dark:bg-sky-950/20"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="font-medium">{t.compRow2}</td>
                  <td className="text-center text-amber-500 font-semibold">{t.hardLabel}</td>
                  <td className="text-center text-rose-500"><XCircle className="w-5 h-5 mx-auto" /></td>
                  <td className="text-center text-emerald-500 font-bold bg-sky-50/50 dark:bg-sky-950/20"><CheckCircle2 className="w-5 h-5 mx-auto" /> {t.veryEasyLabel}</td>
                </tr>
                <tr>
                  <td className="font-medium">{t.compRow3}</td>
                  <td className="text-center text-slate-500">{t.hoursOfFormulas}</td>
                  <td className="text-center text-slate-500">{t.monthsOfLearning}</td>
                  <td className="text-center text-sky-600 font-bold bg-sky-50/50 dark:bg-sky-950/20">{t.thirtySeconds}</td>
                </tr>
                <tr>
                  <td className="font-medium">{t.compRow4}</td>
                  <td className="text-center text-rose-500"><XCircle className="w-5 h-5 mx-auto" /></td>
                  <td className="text-center text-rose-500"><XCircle className="w-5 h-5 mx-auto" /></td>
                  <td className="text-center text-emerald-500 font-bold bg-sky-50/50 dark:bg-sky-950/20"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="font-medium">{t.compRow5}</td>
                  <td className="text-center text-amber-500 font-semibold">{t.manualLabel}</td>
                  <td className="text-center text-emerald-500"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                  <td className="text-center text-emerald-500 font-bold bg-sky-50/50 dark:bg-sky-950/20"><CheckCircle2 className="w-5 h-5 mx-auto" /> {t.auto100}</td>
                </tr>
                <tr className="total-row">
                  <td className="font-bold">{t.compRow6}</td>
                  <td className="text-center">{t.excelPrice}</td>
                  <td className="text-center font-bold text-rose-600">$500 – $2,000+</td>
                  <td className="text-center font-bold text-emerald-600 bg-sky-50/50 dark:bg-sky-950/20">{t.freeForever}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-900 to-sky-950 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-serif mb-6 tracking-tight">
            {t.bottomCtaTitle}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            {t.bottomCtaDesc}
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-lg px-8 py-4 rounded-xl shadow-xl shadow-sky-500/20 transition-all hover:scale-105"
          >
            <span>{t.launchApp}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Moliya © {new Date().getFullYear()}</span>
            <span>• IFRS Financial Management</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/app" className="hover:text-sky-600">{t.dashboard}</Link>
            <a href="#features" className="hover:text-sky-600">{t.navFeatures}</a>
            <a href="#demo" className="hover:text-sky-600">{t.demo}</a>
          </div>
        </div>
      </footer>

      {/* Mobile-First Sticky Launch Bar on Phones */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl flex items-center justify-between">
        <div>
          <div className="font-bold text-sm text-slate-900 dark:text-white">Moliya App</div>
          <div className="text-[11px] text-slate-500">{t.tagline}</div>
        </div>
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 bg-sky-600 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-md"
        >
          <span>{t.launchApp}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
