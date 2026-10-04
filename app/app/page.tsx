'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Globe2, 
  Home, 
  Download, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Scale, 
  TrendingUp, 
  PieChart, 
  Search, 
  X,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import { Company, FinancialReport, Language, OrganizationType, Transaction } from '@/lib/types';
import { Storage } from '@/lib/storage';
import { generateFullReport } from '@/lib/finance';
import { TRANSLATIONS } from '@/lib/i18n';
import { BUSINESS_TYPES, CATEGORIES_META, getCategoryMeta } from '@/lib/categories';
import { parseAiContent, ParsedAiResult } from '@/lib/aiParser';
import { CustomSelect, SelectOption } from '@/components/ui/CustomSelect';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { CustomMonthFilter } from '@/components/ui/CustomMonthFilter';

export default function FinanceAppPage() {
  const [lang, setLang] = useState<Language>('uz');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCoId, setSelectedCoId] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Filter state
  const [fromMonth, setFromMonth] = useState<string>('');
  const [toMonth, setToMonth] = useState<string>('');

  // Transaction form state
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txCategory, setTxCategory] = useState<string>('');
  const [txAmount, setTxAmount] = useState<string>('');
  const [txNote, setTxNote] = useState<string>('');
  const [editingTxId, setEditingTxId] = useState<string | null>(null);

  // Dialogs
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [modalCoType, setModalCoType] = useState<OrganizationType>('shop');

  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [aiInputText, setAiInputText] = useState<string>('');
  const [aiResult, setAiResult] = useState<ParsedAiResult | null>(null);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  const [drillDownAccount, setDrillDownAccount] = useState<{ key: string; label: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const t = TRANSLATIONS[lang];

  // Initialize data on mount
  useEffect(() => {
    const cos = Storage.getCompanies();
    setCompanies(cos);
    const currCoId = Storage.getSelectedCompanyId();
    setSelectedCoId(currCoId);
    setTransactions(Storage.getTransactions(currCoId));
  }, []);

  const currentCompany = useMemo(() => {
    return companies.find(c => c.id === selectedCoId) || companies[0] || null;
  }, [companies, selectedCoId]);

  // Update category dropdown when type or company changes
  useEffect(() => {
    if (currentCompany) {
      const typeDef = BUSINESS_TYPES[currentCompany.type] || BUSINESS_TYPES.other;
      const cats = txType === 'income' ? typeDef.income : typeDef.expense;
      if (!cats.includes(txCategory)) {
        setTxCategory(cats[0] || 'sales_products');
      }
    }
  }, [currentCompany, txType, txCategory]);

  const report: FinancialReport | null = useMemo(() => {
    if (!currentCompany) return null;
    return generateFullReport(currentCompany, transactions, fromMonth, toMonth);
  }, [currentCompany, transactions, fromMonth, toMonth]);

  const categoryOptions: SelectOption[] = useMemo(() => {
    if (!currentCompany) return [];
    const typeDef = BUSINESS_TYPES[currentCompany.type] || BUSINESS_TYPES.other;
    const cats = txType === 'income' ? typeDef.income : typeDef.expense;
    return cats.map(catKey => {
      const meta = CATEGORIES_META[catKey];
      const isPl = !!meta?.pl;
      return {
        value: catKey,
        label: meta?.[lang] || catKey.replace(/_/g, ' '),
        badge: isPl ? 'P&L' : 'Balans',
        badgeColor: isPl 
          ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' 
          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
      };
    });
  }, [currentCompany, txType, lang]);

  const txTypeOptions: SelectOption[] = useMemo(() => [
    {
      value: 'income',
      label: `${t.income} (+)`,
      badge: '+',
      badgeColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
    },
    {
      value: 'expense',
      label: `${t.expense} (-)`,
      badge: '-',
      badgeColor: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
    }
  ], [t.income, t.expense]);

  const companyOptions: SelectOption[] = useMemo(() => {
    return companies.map(c => ({
      value: c.id,
      label: `${c.name} (${BUSINESS_TYPES[c.type]?.name[lang] || c.type})`
    }));
  }, [companies, lang]);

  const handleSelectCompany = (id: string) => {
    setSelectedCoId(id);
    Storage.setSelectedCompanyId(id);
    setTransactions(Storage.getTransactions(id));
    setEditingTxId(null);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;
    const amt = parseFloat(txAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newTx: Transaction = {
      id: editingTxId || `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      company_id: currentCompany.id,
      date: txDate,
      type: txType,
      category: txCategory,
      amount: amt,
      note: txNote.trim()
    };

    Storage.saveTransaction(newTx);
    setTransactions(Storage.getTransactions(currentCompany.id));
    setTxAmount('');
    setTxNote('');
    setEditingTxId(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (!currentCompany || !confirm(t.confirm)) return;
    Storage.deleteTransaction(id);
    setTransactions(Storage.getTransactions(currentCompany.id));
  };

  const handleStartEditTx = (tx: Transaction) => {
    setEditingTxId(tx.id);
    setTxDate(tx.date);
    setTxType(tx.type);
    setTxCategory(tx.category);
    setTxAmount(tx.amount.toString());
    setTxNote(tx.note || '');
    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleSaveCompany = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim() || 'New Company';
    const type = (formData.get('type') as OrganizationType) || 'shop';
    const openingCash = parseFloat(formData.get('opening_cash') as string) || 0;
    const openingFa = parseFloat(formData.get('opening_fixed_assets') as string) || 0;
    const openingLoans = parseFloat(formData.get('opening_loans') as string) || 0;
    const calcEq = openingCash + openingFa - openingLoans;
    const openingEquity = parseFloat(formData.get('opening_equity') as string) || calcEq;
    const shareCount = parseInt(formData.get('share_count') as string, 10) || 1000;

    const companyToSave: Company = {
      id: editingCompany ? editingCompany.id : `co-${Date.now()}`,
      name,
      type,
      opening_cash: openingCash,
      opening_fixed_assets: openingFa,
      opening_loans: openingLoans,
      opening_equity: openingEquity,
      share_count: shareCount,
      created_at: editingCompany ? editingCompany.created_at : new Date().toISOString()
    };

    Storage.saveCompany(companyToSave);
    const updated = Storage.getCompanies();
    setCompanies(updated);
    setSelectedCoId(companyToSave.id);
    Storage.setSelectedCompanyId(companyToSave.id);
    setTransactions(Storage.getTransactions(companyToSave.id));
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
  };

  const handleDeleteCompany = (id: string) => {
    if (!confirm(t.confirm)) return;
    Storage.deleteCompany(id);
    const updated = Storage.getCompanies();
    setCompanies(updated);
    if (updated.length > 0) {
      handleSelectCompany(updated[0].id);
    } else {
      setSelectedCoId('');
      setTransactions([]);
    }
    setIsCompanyModalOpen(false);
    setEditingCompany(null);
  };

  const handleAiAnalyze = () => {
    if (!aiInputText.trim()) return;
    setIsAiAnalyzing(true);
    setTimeout(() => {
      const res = parseAiContent(aiInputText);
      setAiResult(res);
      setIsAiAnalyzing(false);
    }, 350);
  };

  const handleApplyAi = () => {
    if (!aiResult || !currentCompany) return;

    if (aiResult.balances.opening_cash !== null || aiResult.balances.opening_fixed_assets !== null) {
      const updatedCo: Company = {
        ...currentCompany,
        opening_cash: aiResult.balances.opening_cash ?? currentCompany.opening_cash,
        opening_fixed_assets: aiResult.balances.opening_fixed_assets ?? currentCompany.opening_fixed_assets,
        opening_loans: aiResult.balances.opening_loans ?? currentCompany.opening_loans,
        opening_equity: aiResult.balances.opening_equity ?? currentCompany.opening_equity,
        share_count: aiResult.balances.share_count ?? currentCompany.share_count
      };
      Storage.saveCompany(updatedCo);
    }

    for (const item of aiResult.transactions) {
      const newTx: Transaction = {
        id: `tx-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        company_id: currentCompany.id,
        date: item.date,
        type: item.type,
        category: item.category,
        amount: item.amount,
        note: item.note
      };
      Storage.saveTransaction(newTx);
    }

    setCompanies(Storage.getCompanies());
    setTransactions(Storage.getTransactions(currentCompany.id));
    setIsAiModalOpen(false);
    setAiResult(null);
    setAiInputText('');
  };

  const formatNumber = (val: number | undefined | null) => {
    const n = Number(val || 0);
    return new Intl.NumberFormat(lang === 'en' ? 'en-US' : lang === 'ru' ? 'ru-RU' : 'uz-UZ', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0
    }).format(n);
  };

  // Filtered transactions for drill-down modal
  const drillDownTransactions = useMemo(() => {
    if (!drillDownAccount) return [];
    const acc = drillDownAccount.key;
    return transactions.filter(t => {
      const meta = getCategoryMeta(t.category, t.type);
      if (acc === 'all') return true;
      if (acc === t.category) return true;
      if (acc === meta.pl) return true;
      if (acc === meta.cf) return true;
      if (acc === meta.bs) return true;
      if (acc === 'cash' || acc === 'cashLine') return true;
      if (acc === 'loans' && ['loan_in', 'loan_out'].includes(t.category)) return true;
      if (acc === 'fixed_assets' && (meta.bs === 'fixed_asset' || t.category === 'equipment')) return true;
      if (acc === 'contributed_capital' && (meta.bs === 'equity_contribution' || t.category === 'investment')) return true;
      if (acc === 'withdrawn_capital' && (meta.bs === 'equity_withdrawal' || t.category === 'owner_withdrawal')) return true;
      return false;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [drillDownAccount, transactions]);

  const filteredHistoryTxs = useMemo(() => {
    if (!searchTerm.trim()) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter(t => 
      t.note?.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      t.date.includes(term) ||
      t.amount.toString().includes(term)
    );
  }, [transactions, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-16">
      
      {/* 1. App Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-serif text-slate-900 dark:text-white">Moliya</span>
          </Link>

          {/* Company Selector */}
          <div className="w-48 sm:w-64">
            <CustomSelect
              options={companyOptions}
              value={selectedCoId}
              onChange={handleSelectCompany}
              placeholder="Kompaniya tanlang"
            />
          </div>

          <button
            onClick={() => {
              setEditingCompany(null);
              setModalCoType('shop');
              setIsCompanyModalOpen(true);
            }}
            className="h-[42px] px-3 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 hover:bg-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            title={t.newCompany}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.newCompany}</span>
          </button>

          {currentCompany && (
            <button
              onClick={() => {
                setEditingCompany(currentCompany);
                setModalCoType(currentCompany.type);
                setIsCompanyModalOpen(true);
              }}
              className="h-[42px] px-3 rounded-xl border border-slate-300 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title={t.edit}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.edit}</span>
            </button>
          )}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs px-3 py-1.5 rounded-xl shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.aiAssistant}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold border border-slate-200 dark:border-slate-700">
            {(['uz', 'ru', 'en'] as Language[]).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded-md uppercase transition-all ${lang === l ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href="/"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            title={t.backToHome}
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-8 pt-6 space-y-6">

        {/* 2. Top KPI Cards */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Balance */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t.balance}</span>
              <span className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white block mt-1">
                ${formatNumber(report.balance)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Kassa va bank hisobi</span>
            </div>

            {/* Income */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">{t.income}</span>
              <span className="text-lg sm:text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400 block mt-1">
                +${formatNumber(report.income)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Jami tushumlar</span>
            </div>

            {/* Expense */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">{t.expense}</span>
              <span className="text-lg sm:text-xl font-bold font-serif text-rose-600 dark:text-rose-400 block mt-1">
                -${formatNumber(report.expense)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Jami chiqimlar</span>
            </div>

            {/* Net Profit */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t.profit}</span>
              <span className={`text-lg sm:text-xl font-bold font-serif block mt-1 ${report.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ${formatNumber(report.profit)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Davr sof foydasi</span>
            </div>

            {/* Equity */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">{t.equity}</span>
              <span className="text-lg sm:text-xl font-bold font-serif text-slate-900 dark:text-white block mt-1">
                ${formatNumber(report.balance_sheet.equity.total_equity)}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Sof xususiy kapital</span>
            </div>

            {/* Balance Check Badge */}
            <div className={`border rounded-xl p-3.5 flex flex-col justify-between shadow-xs ${report.balance_sheet.is_balanced ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{t.balanceCheck}</span>
              <div className="flex items-center gap-1.5 mt-1">
                {report.balance_sheet.is_balanced ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">A = M + K</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300">Xatolik</span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-slate-500 block">
                {report.balance_sheet.is_balanced ? t.balanced : t.unbalanced}
              </span>
            </div>
          </div>
        )}

        {/* 3. Add Transaction Form Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" />
              <span>{editingTxId ? "Operatsiyani tahrirlash" : t.addTx}</span>
            </h2>
            {editingTxId && (
              <button
                type="button"
                onClick={() => {
                  setEditingTxId(null);
                  setTxAmount('');
                  setTxNote('');
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                {t.cancel}
              </button>
            )}
          </div>

          <form onSubmit={handleSaveTransaction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Date */}
            <div>
              <CustomDatePicker
                value={txDate}
                onChange={setTxDate}
                label={t.date}
              />
            </div>

            {/* Type */}
            <div>
              <CustomSelect
                options={txTypeOptions}
                value={txType}
                onChange={(v) => setTxType(v as 'income' | 'expense')}
                label={t.type}
              />
            </div>

            {/* Category */}
            <div>
              <CustomSelect
                options={categoryOptions}
                value={txCategory}
                onChange={setTxCategory}
                label={t.category}
                placeholder="Kategoriya tanlang"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                {t.amount} ($)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-semibold text-slate-400 select-none">$</span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full h-[42px] pl-7 pr-3 text-sm font-semibold bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-slate-900 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-xs"
                />
              </div>
            </div>

            {/* Note & Submit */}
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                  {t.note}
                </label>
                <input
                  type="text"
                  placeholder="Izoh..."
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="w-full h-[42px] px-3 text-sm bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all text-slate-900 dark:text-slate-100 shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="h-[42px] px-5 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
              >
                {editingTxId ? t.save : t.save}
              </button>
            </div>
          </form>
        </div>

        {/* 4. Period Filter Bar */}
        <CustomMonthFilter
          fromMonth={fromMonth}
          toMonth={toMonth}
          onChange={(from, to) => {
            setFromMonth(from);
            setToMonth(to);
          }}
          onReset={() => {
            setFromMonth('');
            setToMonth('');
          }}
          availableMonths={report?.months_list || []}
        />

        {/* 5. Three Core IFRS Financial Statements */}
        {report && (
          <div className="space-y-6">

            {/* Statement 1: P&L */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-sky-600" />
                    <span>{t.pl}</span>
                  </h3>
                  <span className="text-xs text-slate-500">{t.clickToViewTx}</span>
                </div>
              </div>

              <div className="table-scroll-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t.indicator}</th>
                      {report.months_list.map(m => (
                        <th key={m} className="num-col">{m}</th>
                      ))}
                      <th className="num-col font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">{t.totalPeriod}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'revenue', label: t.revenue })}>
                      <td>{t.revenue}</td>
                      {report.months_list.map(m => <td key={m} className="num-col text-emerald-600">${formatNumber(report.monthly_pnl[m]?.revenue)}</td>)}
                      <td className="num-col font-semibold text-emerald-600 bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.pnl.revenue)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'cogs', label: t.cogs })}>
                      <td>{t.cogs}</td>
                      {report.months_list.map(m => <td key={m} className="num-col text-rose-600">-${formatNumber(report.monthly_pnl[m]?.cogs)}</td>)}
                      <td className="num-col font-semibold text-rose-600 bg-sky-50/50 dark:bg-sky-950/20">-${formatNumber(report.pnl.cogs)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>{t.grossProfit}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_pnl[m]?.gross_profit)}</td>)}
                      <td className="num-col bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.pnl.gross_profit)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'opex', label: t.opex })}>
                      <td>{t.opex}</td>
                      {report.months_list.map(m => <td key={m} className="num-col text-rose-600">-${formatNumber(report.monthly_pnl[m]?.opex)}</td>)}
                      <td className="num-col font-semibold text-rose-600 bg-sky-50/50 dark:bg-sky-950/20">-${formatNumber(report.pnl.opex)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>{t.operatingProfit}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_pnl[m]?.operating_profit)}</td>)}
                      <td className="num-col bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.pnl.operating_profit)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'other_income', label: t.otherIncome })}>
                      <td>{t.otherIncome}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_pnl[m]?.other_income)}</td>)}
                      <td className="num-col bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.pnl.other_income)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'finance_cost', label: t.financeCost })}>
                      <td>{t.financeCost}</td>
                      {report.months_list.map(m => <td key={m} className="num-col text-rose-600">-${formatNumber(report.monthly_pnl[m]?.finance_cost)}</td>)}
                      <td className="num-col bg-sky-50/50 dark:bg-sky-950/20">-${formatNumber(report.pnl.finance_cost)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'tax', label: t.taxExpense })}>
                      <td>{t.taxExpense}</td>
                      {report.months_list.map(m => <td key={m} className="num-col text-rose-600">-${formatNumber(report.monthly_pnl[m]?.tax)}</td>)}
                      <td className="num-col bg-sky-50/50 dark:bg-sky-950/20">-${formatNumber(report.pnl.tax)}</td>
                    </tr>
                    <tr className="grand-total-row">
                      <td>{t.netProfit}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_pnl[m]?.net_profit)}</td>)}
                      <td className="num-col text-sky-700 dark:text-sky-300 font-extrabold">${formatNumber(report.pnl.net_profit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statement 2: Balance Sheet */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-sky-600" />
                    <span>{t.bs}</span>
                  </h3>
                  <span className="text-xs text-slate-500">{t.clickToViewTx}</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${report.balance_sheet.is_balanced ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800'}`}>
                  {report.balance_sheet.is_balanced ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{report.balance_sheet.is_balanced ? t.balanced : t.unbalanced}</span>
                </div>
              </div>

              <div className="table-scroll-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t.indicator}</th>
                      {report.months_list.map(m => (
                        <th key={m} className="num-col">{m}</th>
                      ))}
                      <th className="num-col font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">{t.totalPeriod}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-slate-100 dark:bg-slate-800/60 font-bold text-xs"><td colSpan={report.months_list.length + 2}>{t.assets}</td></tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'cash', label: t.cashLine })}>
                      <td>{t.cashLine}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.assets.cash)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.assets.cash)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'fixed_assets', label: t.fixedAssets })}>
                      <td>{t.fixedAssets}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.assets.fixed_assets)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.assets.fixed_assets)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>{t.totalAssets}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.assets.total_assets)}</td>)}
                      <td className="num-col font-bold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.assets.total_assets)}</td>
                    </tr>

                    <tr className="bg-slate-100 dark:bg-slate-800/60 font-bold text-xs"><td colSpan={report.months_list.length + 2}>{t.liabilities}</td></tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'loans', label: t.loansPayable })}>
                      <td>{t.loansPayable}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.liabilities.loans)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.liabilities.loans)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>{t.totalLiabilities}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.liabilities.total_liabilities)}</td>)}
                      <td className="num-col font-bold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.liabilities.total_liabilities)}</td>
                    </tr>

                    <tr className="bg-slate-100 dark:bg-slate-800/60 font-bold text-xs"><td colSpan={report.months_list.length + 2}>{t.equity}</td></tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'contributed_capital', label: t.contributedCapital })}>
                      <td>{t.initialCapital}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.equity.initial_capital)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.equity.initial_capital)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'retained_earnings', label: t.retainedEarnings })}>
                      <td>{t.retainedEarnings}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.equity.retained_earnings)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.equity.retained_earnings)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'withdrawn_capital', label: t.withdrawnCapital })}>
                      <td>{t.withdrawnCapital}</td>
                      {report.months_list.map(m => <td key={m} className="num-col text-rose-600">-${formatNumber(report.monthly_balance_sheet[m]?.equity.withdrawn_capital)}</td>)}
                      <td className="num-col font-semibold text-rose-600 bg-sky-50/50 dark:bg-sky-950/20">-${formatNumber(report.balance_sheet.equity.withdrawn_capital)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>{t.totalEquity}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.equity.total_equity)}</td>)}
                      <td className="num-col font-bold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.balance_sheet.equity.total_equity)}</td>
                    </tr>

                    <tr className="grand-total-row">
                      <td>{t.totalLiabilitiesAndEquity}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_balance_sheet[m]?.total_liabilities_and_equity)}</td>)}
                      <td className="num-col text-sky-700 dark:text-sky-300 font-extrabold">${formatNumber(report.balance_sheet.total_liabilities_and_equity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statement 3: Cash Flow Statement */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-sky-600" />
                    <span>{t.cfs}</span>
                  </h3>
                  <span className="text-xs text-slate-500">{t.clickToViewTx}</span>
                </div>
              </div>

              <div className="table-scroll-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t.indicator}</th>
                      {report.months_list.map(m => (
                        <th key={m} className="num-col">{m}</th>
                      ))}
                      <th className="num-col font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">{t.totalPeriod}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{t.cfOpeningCash}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_cash_flow[m]?.opening_cash)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.cash_flow.opening_cash)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'operating', label: t.operatingActivities })}>
                      <td>{t.operatingActivities}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_cash_flow[m]?.operating_cf)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.cash_flow.operating_cf)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'investing', label: t.investingActivities })}>
                      <td>{t.investingActivities}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_cash_flow[m]?.investing_cf)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.cash_flow.investing_cf)}</td>
                    </tr>
                    <tr className="clickable-row" onClick={() => setDrillDownAccount({ key: 'financing', label: t.financingActivities })}>
                      <td>{t.financingActivities}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_cash_flow[m]?.financing_cf)}</td>)}
                      <td className="num-col font-semibold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.cash_flow.financing_cf)}</td>
                    </tr>
                    <tr className="total-row">
                      <td>{t.netCashFlow}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_cash_flow[m]?.net_cash_flow)}</td>)}
                      <td className="num-col font-bold bg-sky-50/50 dark:bg-sky-950/20">${formatNumber(report.cash_flow.net_cash_flow)}</td>
                    </tr>
                    <tr className="grand-total-row">
                      <td>{t.endingCash}</td>
                      {report.months_list.map(m => <td key={m} className="num-col">${formatNumber(report.monthly_cash_flow[m]?.ending_cash)}</td>)}
                      <td className="num-col text-sky-700 dark:text-sky-300 font-extrabold">${formatNumber(report.cash_flow.ending_cash)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 6. Transactions Journal Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-sky-600" />
              <span>{t.transactions} ({filteredHistoryTxs.length})</span>
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[38px] text-xs bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-9 pr-8 py-2 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="table-scroll-container">
            <table>
              <thead>
                <tr>
                  <th>{t.date}</th>
                  <th>{t.type}</th>
                  <th>{t.category}</th>
                  <th>{t.note}</th>
                  <th className="num-col">{t.amount}</th>
                  <th className="text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistoryTxs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      {t.empty}
                    </td>
                  </tr>
                ) : (
                  filteredHistoryTxs.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="text-xs font-mono">{tx.date}</td>
                      <td>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'}`}>
                          {tx.type === 'income' ? t.income : t.expense}
                        </span>
                      </td>
                      <td className="text-xs font-medium">
                        {CATEGORIES_META[tx.category]?.[lang] || tx.category.replace(/_/g, ' ')}
                      </td>
                      <td className="text-xs text-slate-600 dark:text-slate-400">{tx.note || '—'}</td>
                      <td className={`num-col text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}${formatNumber(tx.amount)}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleStartEditTx(tx)}
                            className="p-1 rounded-md text-slate-500 hover:text-sky-600"
                            title={t.edit}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(tx.id)}
                            className="p-1 rounded-md text-slate-500 hover:text-rose-600"
                            title={t.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* 7. Drill-Down Detail Modal */}
      {drillDownAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-fade-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs text-slate-500 block uppercase font-bold">{t.accountTxDetail}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{drillDownAccount.label}</h3>
              </div>
              <button
                onClick={() => setDrillDownAccount(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="table-scroll-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t.date}</th>
                      <th>{t.category}</th>
                      <th>{t.note}</th>
                      <th className="num-col">{t.amount}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drillDownTransactions.length === 0 ? (
                      <tr><td colSpan={4} className="text-center py-6 text-slate-400">{t.empty}</td></tr>
                    ) : (
                      drillDownTransactions.map(tx => (
                        <tr key={tx.id}>
                          <td className="text-xs font-mono">{tx.date}</td>
                          <td className="text-xs">{CATEGORIES_META[tx.category]?.[lang] || tx.category}</td>
                          <td className="text-xs text-slate-500">{tx.note || '—'}</td>
                          <td className={`num-col text-xs font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {tx.type === 'income' ? '+' : '-'}${formatNumber(tx.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setDrillDownAccount(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Company Add/Edit Modal */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingCompany ? t.edit : t.newCompany}
              </h3>
              <button
                onClick={() => {
                  setIsCompanyModalOpen(false);
                  setEditingCompany(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">{t.name}</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Kompaniya nomi..."
                  defaultValue={editingCompany?.name || ''}
                  className="w-full h-[42px] text-sm bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3.5 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs transition-all"
                />
              </div>

              <div>
                <CustomSelect
                  options={(Object.keys(BUSINESS_TYPES) as OrganizationType[]).map(k => ({
                    value: k,
                    label: BUSINESS_TYPES[k].name[lang]
                  }))}
                  value={modalCoType}
                  onChange={(val) => setModalCoType(val as OrganizationType)}
                  label={t.orgType}
                />
                <input type="hidden" name="type" value={modalCoType} />
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t.opening}</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">{t.openingCash} ($)</label>
                    <input
                      type="number"
                      name="opening_cash"
                      step="any"
                      defaultValue={editingCompany?.opening_cash || 0}
                      className="w-full h-[38px] text-xs font-semibold bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">{t.openingFixedAssets} ($)</label>
                    <input
                      type="number"
                      name="opening_fixed_assets"
                      step="any"
                      defaultValue={editingCompany?.opening_fixed_assets || 0}
                      className="w-full h-[38px] text-xs font-semibold bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">{t.openingLoans} ($)</label>
                    <input
                      type="number"
                      name="opening_loans"
                      step="any"
                      defaultValue={editingCompany?.opening_loans || 0}
                      className="w-full h-[38px] text-xs font-semibold bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">{t.openingEquity} ($)</label>
                    <input
                      type="number"
                      name="opening_equity"
                      step="any"
                      defaultValue={editingCompany?.opening_equity || 0}
                      className="w-full h-[38px] text-xs font-semibold bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">{t.shareCount}</label>
                <input
                  type="number"
                  name="share_count"
                  defaultValue={editingCompany?.share_count || 1000}
                  className="w-full h-[38px] text-xs font-semibold bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 rounded-xl px-3 outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-slate-900 dark:text-slate-100 shadow-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                {editingCompany && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCompany(editingCompany.id)}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    {t.delete}
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompanyModalOpen(false);
                      setEditingCompany(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm"
                  >
                    {t.save}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. AI Assistant Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-fade-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.aiAssistant}</h3>
              </div>
              <button
                onClick={() => {
                  setIsAiModalOpen(false);
                  setAiResult(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-3">{t.aiSubtitle}</p>

            <textarea
              rows={5}
              placeholder={t.aiInputPlaceholder}
              value={aiInputText}
              onChange={(e) => setAiInputText(e.target.value)}
              className="w-full text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500 mb-3 resize-none"
            />

            <div className="flex justify-between items-center mb-4">
              <button
                type="button"
                onClick={() => setAiInputText("Started business with 6000$ cash and 2500$ equipment, loan 1000$.\n2026-10-01 sold products 1400$\n2026-10-02 paid salaries 500$\n2026-10-03 paid rent 350$")}
                className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline"
              >
                Namuna matnni kiritish
              </button>
              <button
                type="button"
                onClick={handleAiAnalyze}
                disabled={isAiAnalyzing || !aiInputText.trim()}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                {isAiAnalyzing ? t.aiAnalyzing : t.aiAnalyze}
              </button>
            </div>

            {/* AI Preview Result */}
            {aiResult && (
              <div className="flex-1 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div className="font-bold text-slate-700 dark:text-slate-300">{aiResult.summary}</div>

                {/* Balances */}
                {(aiResult.balances.opening_cash !== null || aiResult.balances.opening_fixed_assets !== null) && (
                  <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                    <span className="font-bold block mb-1 text-purple-800 dark:text-purple-300">{t.aiDetectedBalances}</span>
                    <div className="flex flex-wrap gap-3 text-slate-700 dark:text-slate-300">
                      {aiResult.balances.opening_cash !== null && <span>Kassa: <b>${formatNumber(aiResult.balances.opening_cash)}</b></span>}
                      {aiResult.balances.opening_fixed_assets !== null && <span>Uskunalar: <b>${formatNumber(aiResult.balances.opening_fixed_assets)}</b></span>}
                      {aiResult.balances.opening_loans !== null && <span>Kredit: <b>${formatNumber(aiResult.balances.opening_loans)}</b></span>}
                      {aiResult.balances.opening_equity !== null && <span>Kapital: <b>${formatNumber(aiResult.balances.opening_equity)}</b></span>}
                    </div>
                  </div>
                )}

                {/* Transactions Table */}
                <div>
                  <span className="font-bold block mb-1.5">{t.aiDetectedTxs} ({aiResult.transactions.length})</span>
                  <div className="table-scroll-container max-h-48 overflow-y-auto">
                    <table>
                      <thead>
                        <tr>
                          <th>{t.date}</th>
                          <th>{t.type}</th>
                          <th>{t.category}</th>
                          <th className="num-col">{t.amount}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aiResult.transactions.map((tx, idx) => (
                          <tr key={idx}>
                            <td className="text-xs font-mono">{tx.date}</td>
                            <td>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="text-xs">{CATEGORIES_META[tx.category]?.[lang] || tx.category}</td>
                            <td className={`num-col font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              ${formatNumber(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 mt-auto">
              <button
                type="button"
                onClick={() => {
                  setIsAiModalOpen(false);
                  setAiResult(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                {t.close}
              </button>
              {aiResult && (
                <button
                  type="button"
                  onClick={handleApplyAi}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
                >
                  {t.aiApply}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
