'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import { Language } from '@/lib/types';

interface CustomMonthFilterProps {
  fromMonth: string; // YYYY-MM
  toMonth: string;   // YYYY-MM
  onChange: (from: string, to: string) => void;
  onReset: () => void;
  availableMonths?: string[];
  lang?: Language;
}

const MONTH_NAMES_SHORT: Record<Language, string[]> = {
  uz: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'],
  ru: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

const FILTER_LABELS: Record<Language, {
  period: string;
  thisMonth: string;
  last3Months: string;
  ytd: string;
  all: string;
  from: string;
  to: string;
  start: string;
  end: string;
  select: string;
  reset: string;
}> = {
  uz: {
    period: 'Davr:',
    thisMonth: 'Bu oy',
    last3Months: 'Oxirgi 3 oy',
    ytd: 'Yil boshi',
    all: 'Barchasi',
    from: 'Boshlanish:',
    to: 'Tugash:',
    start: 'Boshi',
    end: 'Oxiri',
    select: 'Tanlang',
    reset: 'Tozalash'
  },
  ru: {
    period: 'Период:',
    thisMonth: 'Этот месяц',
    last3Months: 'Посл. 3 месяца',
    ytd: 'С начала года',
    all: 'Все',
    from: 'С месяца:',
    to: 'По месяц:',
    start: 'Начало',
    end: 'Конец',
    select: 'Выбрать',
    reset: 'Сбросить'
  },
  en: {
    period: 'Period:',
    thisMonth: 'This month',
    last3Months: 'Last 3 months',
    ytd: 'YTD',
    all: 'All',
    from: 'From:',
    to: 'To:',
    start: 'Start',
    end: 'End',
    select: 'Select',
    reset: 'Reset'
  }
};

export function CustomMonthFilter({
  fromMonth,
  toMonth,
  onChange,
  onReset,
  availableMonths = [],
  lang = 'uz'
}: CustomMonthFilterProps) {
  const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1;
  const currentYM = `${currentYear}-${currentMonthNum.toString().padStart(2, '0')}`;

  const [fromYear, setFromYear] = useState<number>(fromMonth ? parseInt(fromMonth.split('-')[0]) : currentYear);
  const [toYear, setToYear] = useState<number>(toMonth ? parseInt(toMonth.split('-')[0]) : currentYear);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePicker(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMonth = (type: 'from' | 'to', year: number, monthIdx: number) => {
    const ym = `${year}-${(monthIdx + 1).toString().padStart(2, '0')}`;
    if (type === 'from') {
      onChange(ym, toMonth);
    } else {
      onChange(fromMonth, ym);
    }
    setActivePicker(null);
  };

  const handlePreset = (preset: 'this_month' | 'last_month' | 'last_3_months' | 'ytd' | 'all') => {
    if (preset === 'all') {
      onReset();
      return;
    }

    if (preset === 'this_month') {
      onChange(currentYM, currentYM);
      return;
    }

    if (preset === 'last_month') {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevYM = `${prev.getFullYear()}-${(prev.getMonth() + 1).toString().padStart(2, '0')}`;
      onChange(prevYM, prevYM);
      return;
    }

    if (preset === 'last_3_months') {
      const prev3 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const prev3YM = `${prev3.getFullYear()}-${(prev3.getMonth() + 1).toString().padStart(2, '0')}`;
      onChange(prev3YM, currentYM);
      return;
    }

    if (preset === 'ytd') {
      const ytdStart = `${currentYear}-01`;
      onChange(ytdStart, currentYM);
      return;
    }
  };

  const labels = FILTER_LABELS[lang] || FILTER_LABELS.uz;
  const monthNames = MONTH_NAMES_SHORT[lang] || MONTH_NAMES_SHORT.uz;

  const formatMonthLabel = (ym: string) => {
    if (!ym) return labels.select;
    const [y, m] = ym.split('-');
    const mIdx = parseInt(m) - 1;
    return `${monthNames[mIdx] || m}, ${y}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-3 shadow-xs" ref={containerRef}>
      
      {/* Label and Quick presets */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
          <Calendar className="w-4 h-4 text-sky-500" />
          <span>{labels.period}</span>
        </div>

        {/* Preset Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => handlePreset('this_month')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              fromMonth === currentYM && toMonth === currentYM
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {labels.thisMonth}
          </button>
          <button
            type="button"
            onClick={() => handlePreset('last_3_months')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            {labels.last3Months}
          </button>
          <button
            type="button"
            onClick={() => handlePreset('ytd')}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            {labels.ytd}
          </button>
          <button
            type="button"
            onClick={() => handlePreset('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              !fromMonth && !toMonth
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {labels.all}
          </button>
        </div>
      </div>

      {/* Custom Month Selectors */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* From Month Picker */}
        <div className={`relative ${activePicker === 'from' ? 'z-30' : ''}`}>
          <button
            type="button"
            onClick={() => setActivePicker(activePicker === 'from' ? null : 'from')}
            className="h-8 px-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all"
          >
            <span className="text-slate-400 font-normal text-[11px]">{labels.from}</span>
            <span>{fromMonth ? formatMonthLabel(fromMonth) : labels.start}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activePicker === 'from' && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 w-64 animate-fade-in">
              <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setFromYear(fromYear - 1)}
                  className="px-2 py-0.5 rounded text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  &lt;
                </button>
                <span className="text-xs font-bold font-mono">{fromYear}</span>
                <button
                  type="button"
                  onClick={() => setFromYear(fromYear + 1)}
                  className="px-2 py-0.5 rounded text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                {monthNames.map((name, idx) => {
                  const ym = `${fromYear}-${(idx + 1).toString().padStart(2, '0')}`;
                  const isSelected = fromMonth === ym;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelectMonth('from', fromYear, idx)}
                      className={`py-1.5 text-xs rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* To Month Picker */}
        <div className={`relative ${activePicker === 'to' ? 'z-30' : ''}`}>
          <button
            type="button"
            onClick={() => setActivePicker(activePicker === 'to' ? null : 'to')}
            className="h-8 px-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2 transition-all"
          >
            <span className="text-slate-400 font-normal text-[11px]">{labels.to}</span>
            <span>{toMonth ? formatMonthLabel(toMonth) : labels.end}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {activePicker === 'to' && (
            <div className="absolute right-0 top-[calc(100%+4px)] z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 w-64 animate-fade-in">
              <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setToYear(toYear - 1)}
                  className="px-2 py-0.5 rounded text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  &lt;
                </button>
                <span className="text-xs font-bold font-mono">{toYear}</span>
                <button
                  type="button"
                  onClick={() => setToYear(toYear + 1)}
                  className="px-2 py-0.5 rounded text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  &gt;
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 text-center">
                {monthNames.map((name, idx) => {
                  const ym = `${toYear}-${(idx + 1).toString().padStart(2, '0')}`;
                  const isSelected = toMonth === ym;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelectMonth('to', toYear, idx)}
                      className={`py-1.5 text-xs rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reset button if active */}
        {(fromMonth || toMonth) && (
          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
            title={labels.reset}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

      </div>

    </div>
  );
}
