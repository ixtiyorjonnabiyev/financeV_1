import { 
  BalanceSheet, 
  CashFlowStatement, 
  Company, 
  FinancialReport, 
  MonthlyBreakdown, 
  PnlStatement, 
  Transaction 
} from './types';
import { getCategoryMeta } from './categories';

function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getMonthsInRange(startYM: string, endYM: string): string[] {
  try {
    let [sy, sm] = startYM.split('-').map(Number);
    let [ey, em] = endYM.split('-').map(Number);
    if (!sy || !sm || !ey || !em) throw new Error();

    if (ey < sy || (ey === sy && em < sm)) {
      [sy, sm, ey, em] = [ey, em, sy, sm];
    }

    const res: string[] = [];
    let cy = sy;
    let cm = sm;

    while (cy < ey || (cy === ey && cm <= em)) {
      res.push(`${cy.toString().padStart(4, '0')}-${cm.toString().padStart(2, '0')}`);
      cm++;
      if (cm > 12) {
        cm = 1;
        cy++;
      }
    }
    return res;
  } catch {
    const now = new Date();
    return [`${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`];
  }
}

export function calculatePnl(transactions: Transaction[], shareCount: number = 1000): PnlStatement {
  const pnl: PnlStatement = {
    revenue: 0,
    cogs: 0,
    gross_profit: 0,
    opex: 0,
    operating_profit: 0,
    other_income: 0,
    other_expense: 0,
    finance_income: 0,
    finance_cost: 0,
    profit_before_tax: 0,
    tax: 0,
    net_profit: 0,
    eps: 0
  };

  for (const t of transactions) {
    const meta = getCategoryMeta(t.category, t.type);
    if (meta.pl && meta.pl in pnl) {
      pnl[meta.pl] += t.amount;
    }
  }

  pnl.gross_profit = pnl.revenue - pnl.cogs;
  pnl.operating_profit = pnl.gross_profit - pnl.opex;
  pnl.profit_before_tax = (
    pnl.operating_profit +
    pnl.other_income - pnl.other_expense +
    pnl.finance_income - pnl.finance_cost
  );
  pnl.net_profit = pnl.profit_before_tax - pnl.tax;
  pnl.eps = shareCount > 0 ? pnl.net_profit / shareCount : 0;

  return pnl;
}

export function calculateBalanceSheet(
  allTransactions: Transaction[],
  targetDate: string,
  openingCash: number,
  openingFa: number,
  openingLoans: number,
  openingEquity: number,
  shareCount: number = 1000
): BalanceSheet {
  const txsUpTo = allTransactions.filter(t => t.date <= targetDate);

  const cash = openingCash + txsUpTo.reduce((acc, t) => {
    return acc + (t.type === 'income' ? t.amount : -t.amount);
  }, 0);

  const fixedAssets = openingFa + txsUpTo.reduce((acc, t) => {
    const meta = getCategoryMeta(t.category, t.type);
    if (meta.bs === 'fixed_asset') {
      return acc + (t.type === 'expense' ? t.amount : -t.amount);
    }
    return acc;
  }, 0);

  const totalAssets = cash + fixedAssets;

  const loans = openingLoans + txsUpTo.reduce((acc, t) => {
    const meta = getCategoryMeta(t.category, t.type);
    if (t.type === 'income' && meta.bs === 'loan_in') {
      return acc + t.amount;
    }
    if (t.type === 'expense' && meta.bs === 'loan_out') {
      return acc - t.amount;
    }
    return acc;
  }, 0);

  const totalLiabilities = loans;

  const initialCapital = openingEquity;

  const contributedCapital = txsUpTo.reduce((acc, t) => {
    const meta = getCategoryMeta(t.category, t.type);
    if (t.type === 'income' && meta.bs === 'equity_contribution') {
      return acc + t.amount;
    }
    return acc;
  }, 0);

  const withdrawnCapital = txsUpTo.reduce((acc, t) => {
    const meta = getCategoryMeta(t.category, t.type);
    if (t.type === 'expense' && meta.bs === 'equity_withdrawal') {
      return acc + t.amount;
    }
    return acc;
  }, 0);

  let retainedEarnings = 0;
  for (const t of txsUpTo) {
    const meta = getCategoryMeta(t.category, t.type);
    if (meta.pl) {
      if (['revenue', 'other_income', 'finance_income'].includes(meta.pl)) {
        retainedEarnings += t.amount;
      } else if (['cogs', 'opex', 'other_expense', 'finance_cost', 'tax'].includes(meta.pl)) {
        retainedEarnings -= t.amount;
      }
    }
  }

  const totalEquity = initialCapital + contributedCapital - withdrawnCapital + retainedEarnings;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  const isBalanced = Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.01;
  const bvps = shareCount > 0 ? totalEquity / shareCount : 0;

  return {
    assets: {
      cash,
      fixed_assets: fixedAssets,
      total_assets: totalAssets
    },
    liabilities: {
      loans,
      total_liabilities: totalLiabilities
    },
    equity: {
      initial_capital: initialCapital,
      contributed_capital: contributedCapital,
      withdrawn_capital: withdrawnCapital,
      retained_earnings: retainedEarnings,
      total_equity: totalEquity
    },
    total_liabilities_and_equity: totalLiabilitiesAndEquity,
    is_balanced: isBalanced,
    bvps
  };
}

export function calculateCashFlow(
  allTransactions: Transaction[],
  openingCash: number,
  startDate: string,
  endDate: string
): CashFlowStatement {
  const txsBefore = allTransactions.filter(t => t.date < startDate);
  const txsIn = allTransactions.filter(t => t.date >= startDate && t.date <= endDate);

  const startCash = openingCash + txsBefore.reduce((acc, t) => {
    return acc + (t.type === 'income' ? t.amount : -t.amount);
  }, 0);

  let opCf = 0;
  let invCf = 0;
  let finCf = 0;

  for (const t of txsIn) {
    const meta = getCategoryMeta(t.category, t.type);
    const signedAmt = t.type === 'income' ? t.amount : -t.amount;
    if (meta.cf === 'investing') {
      invCf += signedAmt;
    } else if (meta.cf === 'financing') {
      finCf += signedAmt;
    } else {
      opCf += signedAmt;
    }
  }

  const netCf = opCf + invCf + finCf;
  const endingCash = startCash + netCf;

  return {
    opening_cash: startCash,
    operating_cf: opCf,
    investing_cf: invCf,
    financing_cf: finCf,
    net_cash_flow: netCf,
    ending_cash: endingCash
  };
}

export function generateFullReport(
  company: Company,
  transactions: Transaction[],
  filterFromMonth?: string,
  filterToMonth?: string
): FinancialReport {
  const sortedTxs = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const now = new Date();
  const currentYM = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

  const minYM = sortedTxs.length > 0 ? sortedTxs[0].date.slice(0, 7) : currentYM;
  const maxYM = sortedTxs.length > 0 ? sortedTxs[sortedTxs.length - 1].date.slice(0, 7) : currentYM;

  const startYM = filterFromMonth || minYM;
  const endYM = filterToMonth || (maxYM > currentYM ? maxYM : currentYM);

  const monthsList = getMonthsInRange(startYM, endYM);

  const [sy, sm] = monthsList[0].split('-').map(Number);
  const [ey, em] = monthsList[monthsList.length - 1].split('-').map(Number);
  const fromDate = `${sy.toString().padStart(4, '0')}-${sm.toString().padStart(2, '0')}-01`;
  const toDate = `${ey.toString().padStart(4, '0')}-${em.toString().padStart(2, '0')}-${getLastDayOfMonth(ey, em).toString().padStart(2, '0')}`;

  const openingCash = company.opening_cash || 0;
  const openingFa = company.opening_fixed_assets || 0;
  const openingLoans = company.opening_loans || 0;
  const openingEquity = company.opening_equity || (openingCash + openingFa - openingLoans);
  const shareCount = company.share_count || 1000;

  const monthlyPnl: MonthlyBreakdown<PnlStatement> = {};
  const monthlyCashFlow: MonthlyBreakdown<CashFlowStatement> = {};
  const monthlyBalanceSheet: MonthlyBreakdown<BalanceSheet> = {};

  for (const m of monthsList) {
    const [my, mm] = m.split('-').map(Number);
    const mStart = `${m}-01`;
    const mEnd = `${m}-${getLastDayOfMonth(my, mm).toString().padStart(2, '0')}`;

    const txsM = sortedTxs.filter(t => t.date >= mStart && t.date <= mEnd);
    monthlyPnl[m] = calculatePnl(txsM, shareCount);
    monthlyCashFlow[m] = calculateCashFlow(sortedTxs, openingCash, mStart, mEnd);
    monthlyBalanceSheet[m] = calculateBalanceSheet(sortedTxs, mEnd, openingCash, openingFa, openingLoans, openingEquity, shareCount);
  }

  const periodTxs = sortedTxs.filter(t => t.date >= fromDate && t.date <= toDate);
  const totalPnl = calculatePnl(periodTxs, shareCount);
  const totalCashFlow = calculateCashFlow(sortedTxs, openingCash, fromDate, toDate);
  const latestBalanceSheet = calculateBalanceSheet(sortedTxs, toDate, openingCash, openingFa, openingLoans, openingEquity, shareCount);

  monthlyPnl['total'] = totalPnl;
  monthlyCashFlow['total'] = totalCashFlow;
  monthlyBalanceSheet['total'] = latestBalanceSheet;

  const totalInc = sortedTxs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExp = sortedTxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  const catMap = new Map<string, { type: 'income' | 'expense'; category: string; total: number }>();
  for (const t of sortedTxs) {
    const key = `${t.type}_${t.category}`;
    const curr = catMap.get(key) || { type: t.type, category: t.category, total: 0 };
    curr.total += t.amount;
    catMap.set(key, curr);
  }
  const categories = Array.from(catMap.values()).sort((a, b) => b.total - a.total);

  const monthSummaryMap = new Map<string, { month: string; income: number; expense: number }>();
  for (const t of sortedTxs) {
    const m = t.date.slice(0, 7);
    const curr = monthSummaryMap.get(m) || { month: m, income: 0, expense: 0 };
    if (t.type === 'income') curr.income += t.amount;
    else curr.expense += t.amount;
    monthSummaryMap.set(m, curr);
  }
  const months = Array.from(monthSummaryMap.values()).sort((a, b) => a.month.localeCompare(b.month));

  return {
    opening: openingCash,
    opening_fixed_assets: openingFa,
    opening_loans: openingLoans,
    opening_equity: openingEquity,
    share_count: shareCount,
    income: totalInc,
    expense: totalExp,
    profit: totalInc - totalExp,
    balance: openingCash + totalInc - totalExp,
    categories,
    months,
    start_month: monthsList[0],
    end_month: monthsList[monthsList.length - 1],
    from_date: fromDate,
    to_date: toDate,
    months_list: monthsList,
    pnl: totalPnl,
    cash_flow: totalCashFlow,
    balance_sheet: latestBalanceSheet,
    monthly_pnl: monthlyPnl,
    monthly_cash_flow: monthlyCashFlow,
    monthly_balance_sheet: monthlyBalanceSheet,
    valuation: {
      share_count: shareCount,
      eps: totalPnl.eps,
      bvps: latestBalanceSheet.bvps,
      net_profit: totalPnl.net_profit,
      total_equity: latestBalanceSheet.equity.total_equity,
      opening_cash: openingCash,
      opening_fixed_assets: openingFa,
      opening_loans: openingLoans,
      opening_equity: openingEquity
    }
  };
}
