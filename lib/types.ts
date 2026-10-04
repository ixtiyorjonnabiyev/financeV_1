export type Language = 'uz' | 'ru' | 'en';

export type OrganizationType = 
  | 'shop' 
  | 'manufacturer' 
  | 'company' 
  | 'restaurant' 
  | 'farm' 
  | 'education' 
  | 'construction' 
  | 'nonprofit' 
  | 'individual' 
  | 'other';

export interface CategoryMeta {
  uz: string;
  ru: string;
  en: string;
  pl: 'revenue' | 'cogs' | 'opex' | 'other_income' | 'other_expense' | 'finance_income' | 'finance_cost' | 'tax' | null;
  cf: 'operating' | 'investing' | 'financing';
  bs: 'fixed_asset' | 'loan_in' | 'loan_out' | 'equity_contribution' | 'equity_withdrawal' | null;
}

export interface TypeDefinition {
  name: { uz: string; ru: string; en: string };
  income: string[];
  expense: string[];
}

export interface Company {
  id: string;
  name: string;
  type: OrganizationType;
  opening_cash: number;
  opening_fixed_assets: number;
  opening_loans: number;
  opening_equity: number;
  share_count: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  company_id: string;
  date: string; // YYYY-MM-DD
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note?: string;
}

export interface PnlStatement {
  revenue: number;
  cogs: number;
  gross_profit: number;
  opex: number;
  operating_profit: number;
  other_income: number;
  other_expense: number;
  finance_income: number;
  finance_cost: number;
  profit_before_tax: number;
  tax: number;
  net_profit: number;
  eps: number;
}

export interface BalanceSheet {
  assets: {
    cash: number;
    fixed_assets: number;
    total_assets: number;
  };
  liabilities: {
    loans: number;
    total_liabilities: number;
  };
  equity: {
    initial_capital: number;
    contributed_capital: number;
    withdrawn_capital: number;
    retained_earnings: number;
    total_equity: number;
  };
  total_liabilities_and_equity: number;
  is_balanced: boolean;
  bvps: number;
}

export interface CashFlowStatement {
  opening_cash: number;
  operating_cf: number;
  investing_cf: number;
  financing_cf: number;
  net_cash_flow: number;
  ending_cash: number;
}

export interface MonthlyBreakdown<T> {
  [monthOrTotal: string]: T;
}

export interface FinancialReport {
  opening: number;
  opening_fixed_assets: number;
  opening_loans: number;
  opening_equity: number;
  share_count: number;
  income: number;
  expense: number;
  profit: number;
  balance: number;
  categories: { type: 'income' | 'expense'; category: string; total: number }[];
  months: { month: string; income: number; expense: number }[];
  start_month: string;
  end_month: string;
  from_date: string;
  to_date: string;
  months_list: string[];
  pnl: PnlStatement;
  cash_flow: CashFlowStatement;
  balance_sheet: BalanceSheet;
  monthly_pnl: MonthlyBreakdown<PnlStatement>;
  monthly_cash_flow: MonthlyBreakdown<CashFlowStatement>;
  monthly_balance_sheet: MonthlyBreakdown<BalanceSheet>;
  valuation: {
    share_count: number;
    eps: number;
    bvps: number;
    net_profit: number;
    total_equity: number;
    opening_cash: number;
    opening_fixed_assets: number;
    opening_loans: number;
    opening_equity: number;
  };
}
