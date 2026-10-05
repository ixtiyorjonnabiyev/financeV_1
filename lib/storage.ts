import { Company, Language, Transaction } from './types';

const STORAGE_KEYS = {
  COMPANIES: 'moliya_companies_v1',
  TRANSACTIONS: 'moliya_transactions_v1',
  SELECTED_CO: 'moliya_selected_co_v1',
  LANG: 'moliya_lang_v1'
};

const DEFAULT_DEMO_COMPANY: Company = {
  id: 'demo-co-1',
  name: "Silk Road Trading (Do'kon)",
  type: 'shop',
  opening_cash: 12000,
  opening_fixed_assets: 8500,
  opening_loans: 4000,
  opening_equity: 16500,
  share_count: 1000,
  created_at: new Date().toISOString()
};

function getRecentMonths(): { m1: string; m2: string; m3: string } {
  const d = new Date();
  const y = d.getFullYear();
  const m = d.getMonth() + 1;

  const fmt = (year: number, month: number) => {
    while (month < 1) { month += 12; year -= 1; }
    while (month > 12) { month -= 12; year += 1; }
    return `${year}-${month.toString().padStart(2, '0')}`;
  };

  return {
    m1: fmt(y, m - 2),
    m2: fmt(y, m - 1),
    m3: fmt(y, m)
  };
}

function generateDemoTransactions(coId: string): Transaction[] {
  const { m1, m2, m3 } = getRecentMonths();

  return [
    // Month 1
    { id: 'tx-1', company_id: coId, date: `${m1}-02`, type: 'expense', category: 'goods_purchase', amount: 4500, note: "Ommabop mahsulotlar xaridi" },
    { id: 'tx-2', company_id: coId, date: `${m1}-05`, type: 'income', category: 'retail_sales', amount: 3200, note: "Chakana savdo tushumi" },
    { id: 'tx-3', company_id: coId, date: `${m1}-12`, type: 'income', category: 'online_sales', amount: 1800, note: "Onlayn buyurtmalar tushumi" },
    { id: 'tx-4', company_id: coId, date: `${m1}-15`, type: 'expense', category: 'salaries', amount: 1400, note: "Xodimlar oylik maoshi" },
    { id: 'tx-5', company_id: coId, date: `${m1}-20`, type: 'expense', category: 'rent', amount: 800, note: "Do'kon binosi oylik ijarasi" },
    { id: 'tx-6', company_id: coId, date: `${m1}-25`, type: 'expense', category: 'utilities', amount: 250, note: "Kommunal xizmatlar to'lovi" },
    { id: 'tx-7', company_id: coId, date: `${m1}-28`, type: 'expense', category: 'loan_out', amount: 500, note: "Bank krediti so'ndirildi" },

    // Month 2
    { id: 'tx-8', company_id: coId, date: `${m2}-03`, type: 'expense', category: 'goods_purchase', amount: 5200, note: "Yangi tovarlar partiyasi" },
    { id: 'tx-9', company_id: coId, date: `${m2}-07`, type: 'income', category: 'retail_sales', amount: 4100, note: "Do'kondan chakana savdo" },
    { id: 'tx-10', company_id: coId, date: `${m2}-14`, type: 'income', category: 'wholesale_sales', amount: 3600, note: "Ulgurji savdo shartnomasi" },
    { id: 'tx-11', company_id: coId, date: `${m2}-15`, type: 'expense', category: 'salaries', amount: 1500, note: "Xodimlar oyligi va bonus" },
    { id: 'tx-12', company_id: coId, date: `${m2}-18`, type: 'expense', category: 'marketing', amount: 450, note: "Ijtimoiy tarmoqlarda reklama" },
    { id: 'tx-13', company_id: coId, date: `${m2}-22`, type: 'expense', category: 'equipment', amount: 1200, note: "Yangi kassa terminali va shtrix-skaner" },
    { id: 'tx-14', company_id: coId, date: `${m2}-25`, type: 'expense', category: 'rent', amount: 800, note: "Bino ijarasi" },
    { id: 'tx-15', company_id: coId, date: `${m2}-28`, type: 'expense', category: 'taxes', amount: 480, note: "Aylanmadan soliq to'lovi" },

    // Month 3
    { id: 'tx-16', company_id: coId, date: `${m3}-02`, type: 'income', category: 'retail_sales', amount: 4800, note: "Haftalik savdo tushumi" },
    { id: 'tx-17', company_id: coId, date: `${m3}-05`, type: 'expense', category: 'goods_purchase', amount: 3900, note: "Tovar zaxirasi to'ldirildi" },
    { id: 'tx-18', company_id: coId, date: `${m3}-08`, type: 'income', category: 'online_sales', amount: 2600, note: "Telegram bot orqali savdo" },
    { id: 'tx-19', company_id: coId, date: `${m3}-10`, type: 'income', category: 'loan_in', amount: 2000, note: "Qisqa muddatli mikroqarz olindi" },
    { id: 'tx-20', company_id: coId, date: `${m3}-15`, type: 'expense', category: 'salaries', amount: 1500, note: "Oylik maoshlar" },
    { id: 'tx-21', company_id: coId, date: `${m3}-18`, type: 'expense', category: 'transport', amount: 350, note: "Yetkazib berish xizmati xarajatlari" },
    { id: 'tx-22', company_id: coId, date: `${m3}-20`, type: 'expense', category: 'owner_withdrawal', amount: 1000, note: "Muassis dividend yechib oldi" }
  ];
}

export const Storage = {
  getCompanies(): Company[] {
    if (typeof window === 'undefined') return [DEFAULT_DEMO_COMPANY];
    const data = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    if (!data) {
      const initial = [DEFAULT_DEMO_COMPANY];
      localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(initial));
      const demoTxs = generateDemoTransactions(DEFAULT_DEMO_COMPANY.id);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTxs));
      return initial;
    }
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_DEMO_COMPANY];
    } catch {
      return [DEFAULT_DEMO_COMPANY];
    }
  },

  saveCompany(company: Company): void {
    if (typeof window === 'undefined') return;
    const cos = Storage.getCompanies();
    const idx = cos.findIndex(c => c.id === company.id);
    if (idx >= 0) {
      cos[idx] = company;
    } else {
      cos.push(company);
    }
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(cos));
  },

  deleteCompany(companyId: string): void {
    if (typeof window === 'undefined') return;
    const cos = Storage.getCompanies().filter(c => c.id !== companyId);
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(cos));

    // Also delete company transactions
    const txs = Storage.getTransactions().filter(t => t.company_id !== companyId);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
  },

  getTransactions(companyId?: string): Transaction[] {
    if (typeof window === 'undefined') {
      return companyId ? generateDemoTransactions(companyId) : [];
    }
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!data) {
      const demoTxs = generateDemoTransactions(DEFAULT_DEMO_COMPANY.id);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTxs));
      return companyId ? demoTxs.filter(t => t.company_id === companyId) : demoTxs;
    }
    try {
      const all: Transaction[] = JSON.parse(data) || [];
      return companyId ? all.filter(t => t.company_id === companyId) : all;
    } catch {
      return [];
    }
  },

  saveTransaction(tx: Transaction): void {
    if (typeof window === 'undefined') return;
    const all = Storage.getTransactions();
    const idx = all.findIndex(t => t.id === tx.id);
    if (idx >= 0) {
      all[idx] = tx;
    } else {
      all.push(tx);
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
  },

  deleteTransaction(txId: string): void {
    if (typeof window === 'undefined') return;
    const all = Storage.getTransactions().filter(t => t.id !== txId);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(all));
  },

  getSelectedCompanyId(): string {
    if (typeof window === 'undefined') return DEFAULT_DEMO_COMPANY.id;
    const id = localStorage.getItem(STORAGE_KEYS.SELECTED_CO);
    if (id) return id;
    const cos = Storage.getCompanies();
    return cos[0]?.id || DEFAULT_DEMO_COMPANY.id;
  },

  setSelectedCompanyId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SELECTED_CO, id);
  },

  getLanguage(): Language {
    if (typeof window === 'undefined') return 'uz';
    const l = localStorage.getItem(STORAGE_KEYS.LANG) as Language;
    if (l === 'uz' || l === 'ru' || l === 'en') return l;
    return 'uz';
  },

  setLanguage(lang: Language): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  },

  exportAllData(): string {
    const data = {
      version: '1.0',
      exported_at: new Date().toISOString(),
      companies: Storage.getCompanies(),
      transactions: Storage.getTransactions()
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (Array.isArray(data.companies) && Array.isArray(data.transactions)) {
        localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(data.companies));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
        if (data.companies.length > 0) {
          Storage.setSelectedCompanyId(data.companies[0].id);
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
};
