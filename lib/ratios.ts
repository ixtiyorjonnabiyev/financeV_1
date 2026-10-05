import { FinancialReport } from './types';

export type RatioStatus = 'optimal' | 'good' | 'warning' | 'critical';

export interface RatioItem {
  key: string;
  nameKey: string;
  category: 'liquidity' | 'profitability' | 'solvency' | 'investor';
  value: number;
  unit: '' | '%' | '$';
  formula: string;
  benchmark: string;
  status: RatioStatus;
  description: string;
}

export interface MonthlyTrendPoint {
  month: string;
  revenue: number;
  grossProfit: number;
  netProfit: number;
  grossMargin: number;
  netMargin: number;
  cash: number;
  assets: number;
  liabilities: number;
  equity: number;
}

export interface RatioAnalysisResult {
  ratios: RatioItem[];
  overallHealthScore: number; // 0 - 100
  monthlyTrends: MonthlyTrendPoint[];
}

export function calculateIFRSRatios(report: FinancialReport): RatioAnalysisResult {
  const { pnl, balance_sheet, months_list, monthly_pnl, monthly_balance_sheet } = report;

  const rev = pnl.revenue || 0;
  const gp = pnl.gross_profit || 0;
  const op = pnl.operating_profit || 0;
  const np = pnl.net_profit || 0;

  const cash = balance_sheet.assets.cash || 0;
  const fa = balance_sheet.assets.fixed_assets || 0;
  const totalAssets = balance_sheet.assets.total_assets || (cash + fa);
  const totalLiab = balance_sheet.liabilities.total_liabilities || 0;
  const totalEquity = balance_sheet.equity.total_equity || 0;

  const ratios: RatioItem[] = [];

  // 1. Current Ratio
  // In our SMB IFRS structure, Cash = Current Assets, Loans = Current Liabilities
  const currentRatio = totalLiab > 0 ? cash / totalLiab : (cash > 0 ? 99 : 0);
  let crStatus: RatioStatus = 'good';
  if (currentRatio >= 1.5) crStatus = 'optimal';
  else if (currentRatio >= 1.0) crStatus = 'good';
  else if (currentRatio >= 0.7) crStatus = 'warning';
  else crStatus = 'critical';

  ratios.push({
    key: 'current_ratio',
    nameKey: 'currentRatio',
    category: 'liquidity',
    value: Number(currentRatio.toFixed(2)),
    unit: '',
    formula: 'Aktivlar (Kassa) / Qisqa majburiyatlar',
    benchmark: '≥ 1.50',
    status: crStatus,
    description: 'Kompaniyaning qisqa muddatli majburiyatlarni to\'lash qobiliyati'
  });

  // 2. Cash Ratio
  const cashRatio = totalLiab > 0 ? cash / totalLiab : (cash > 0 ? 99 : 0);
  let cashRatioStatus: RatioStatus = 'good';
  if (cashRatio >= 0.5) cashRatioStatus = 'optimal';
  else if (cashRatio >= 0.2) cashRatioStatus = 'good';
  else cashRatioStatus = 'warning';

  ratios.push({
    key: 'cash_ratio',
    nameKey: 'cashRatio',
    category: 'liquidity',
    value: Number(cashRatio.toFixed(2)),
    unit: '',
    formula: 'Pul mablag\'lari / Jami majburiyatlar',
    benchmark: '≥ 0.50',
    status: cashRatioStatus,
    description: 'Kompaniyaning eng likvid pul qoldig\'i bilan qarzlarini tezkor yopish imkoniyati'
  });

  // 3. Net Working Capital
  const nwc = cash - totalLiab;
  ratios.push({
    key: 'working_capital',
    nameKey: 'workingCapital',
    category: 'liquidity',
    value: Number(nwc.toFixed(2)),
    unit: '$',
    formula: 'Joriy aktivlar - Qisqa majburiyatlar',
    benchmark: '> 0',
    status: nwc >= 0 ? 'optimal' : 'critical',
    description: 'Biznesning kundalik faoliyatini uzluksiz ta\'minlovchi erkin pul qoldig\'i'
  });

  // 4. Gross Profit Margin
  const grossMargin = rev > 0 ? (gp / rev) * 100 : 0;
  let gmStatus: RatioStatus = 'good';
  if (grossMargin >= 35) gmStatus = 'optimal';
  else if (grossMargin >= 18) gmStatus = 'good';
  else if (grossMargin >= 5) gmStatus = 'warning';
  else gmStatus = 'critical';

  ratios.push({
    key: 'gross_margin',
    nameKey: 'grossMargin',
    category: 'profitability',
    value: Number(grossMargin.toFixed(1)),
    unit: '%',
    formula: '(Yalpi foyda / Tushum) × 100%',
    benchmark: '≥ 30.0%',
    status: gmStatus,
    description: 'Mahsulot yoki xizmat tannarxidan keyingi toza ustama marjasi'
  });

  // 5. Operating Margin (EBIT Margin)
  const operMargin = rev > 0 ? (op / rev) * 100 : 0;
  let omStatus: RatioStatus = 'good';
  if (operMargin >= 18) omStatus = 'optimal';
  else if (operMargin >= 8) omStatus = 'good';
  else if (operMargin >= 0) omStatus = 'warning';
  else omStatus = 'critical';

  ratios.push({
    key: 'operating_margin',
    nameKey: 'operatingMargin',
    category: 'profitability',
    value: Number(operMargin.toFixed(1)),
    unit: '%',
    formula: '(Operatsion foyda / Tushum) × 100%',
    benchmark: '≥ 15.0%',
    status: omStatus,
    description: 'Asosiy biznes operatsiyalari samaradorligi'
  });

  // 6. Net Profit Margin (ROS)
  const netMargin = rev > 0 ? (np / rev) * 100 : 0;
  let nmStatus: RatioStatus = 'good';
  if (netMargin >= 15) nmStatus = 'optimal';
  else if (netMargin >= 5) nmStatus = 'good';
  else if (netMargin >= 0) nmStatus = 'warning';
  else nmStatus = 'critical';

  ratios.push({
    key: 'net_margin',
    nameKey: 'netMargin',
    category: 'profitability',
    value: Number(netMargin.toFixed(1)),
    unit: '%',
    formula: '(Sof foyda / Tushum) × 100%',
    benchmark: '≥ 10.0%',
    status: nmStatus,
    description: 'Har 1 dollarlik savdodan biznes egasiga qoladigan sof daromad ulushi'
  });

  // 7. ROE (Return on Equity)
  const roe = totalEquity > 0 ? (np / totalEquity) * 100 : 0;
  let roeStatus: RatioStatus = 'good';
  if (roe >= 20) roeStatus = 'optimal';
  else if (roe >= 10) roeStatus = 'good';
  else if (roe >= 0) roeStatus = 'warning';
  else roeStatus = 'critical';

  ratios.push({
    key: 'roe',
    nameKey: 'roe',
    category: 'profitability',
    value: Number(roe.toFixed(1)),
    unit: '%',
    formula: '(Sof foyda / Jami kapital) × 100%',
    benchmark: '≥ 15.0%',
    status: roeStatus,
    description: 'Muassislarning kiritgan sarmoyasi qanchalik tez o\'zini oqlashi'
  });

  // 8. ROA (Return on Assets)
  const roa = totalAssets > 0 ? (np / totalAssets) * 100 : 0;
  let roaStatus: RatioStatus = 'good';
  if (roa >= 10) roaStatus = 'optimal';
  else if (roa >= 4) roaStatus = 'good';
  else if (roa >= 0) roaStatus = 'warning';
  else roaStatus = 'critical';

  ratios.push({
    key: 'roa',
    nameKey: 'roa',
    category: 'profitability',
    value: Number(roa.toFixed(1)),
    unit: '%',
    formula: '(Sof foyda / Jami aktivlar) × 100%',
    benchmark: '≥ 8.0%',
    status: roaStatus,
    description: 'Barcha moddiy va pul aktivlarining foyda keltirish qobiliyati'
  });

  // 9. Debt-to-Equity (D/E)
  const de = totalEquity > 0 ? totalLiab / totalEquity : 0;
  let deStatus: RatioStatus = 'good';
  if (de <= 0.6) deStatus = 'optimal';
  else if (de <= 1.2) deStatus = 'good';
  else if (de <= 2.0) deStatus = 'warning';
  else deStatus = 'critical';

  ratios.push({
    key: 'debt_to_equity',
    nameKey: 'debtToEquity',
    category: 'solvency',
    value: Number(de.toFixed(2)),
    unit: '',
    formula: 'Qarzlar / Xususiy kapital',
    benchmark: '≤ 1.00',
    status: deStatus,
    description: 'Kompaniyaning qarz mablag\'lariga qanchalik qaramligi'
  });

  // 10. Debt-to-Assets (Debt Ratio)
  const debtRatio = totalAssets > 0 ? (totalLiab / totalAssets) * 100 : 0;
  let drStatus: RatioStatus = 'good';
  if (debtRatio <= 35) drStatus = 'optimal';
  else if (debtRatio <= 50) drStatus = 'good';
  else if (debtRatio <= 70) drStatus = 'warning';
  else drStatus = 'critical';

  ratios.push({
    key: 'debt_to_assets',
    nameKey: 'debtToAssets',
    category: 'solvency',
    value: Number(debtRatio.toFixed(1)),
    unit: '%',
    formula: '(Qarzlar / Jami aktivlar) × 100%',
    benchmark: '≤ 40.0%',
    status: drStatus,
    description: 'Aktivlarning qancha qismi qarz hisobidan moliyalashtirilgani'
  });

  // 11. Equity Ratio (Avtonomiya)
  const equityRatio = totalAssets > 0 ? (totalEquity / totalAssets) * 100 : 0;
  let erStatus: RatioStatus = 'good';
  if (equityRatio >= 60) erStatus = 'optimal';
  else if (equityRatio >= 40) erStatus = 'good';
  else if (equityRatio >= 25) erStatus = 'warning';
  else erStatus = 'critical';

  ratios.push({
    key: 'equity_ratio',
    nameKey: 'equityRatio',
    category: 'solvency',
    value: Number(equityRatio.toFixed(1)),
    unit: '%',
    formula: '(Xususiy kapital / Jami aktivlar) × 100%',
    benchmark: '≥ 50.0%',
    status: erStatus,
    description: 'Kompaniya mustaqilligi va xususiy kapital ulushi'
  });

  // 12. EPS & BVPS
  ratios.push({
    key: 'eps',
    nameKey: 'eps',
    category: 'investor',
    value: Number(pnl.eps.toFixed(2)),
    unit: '$',
    formula: 'Sof foyda / Aksiyalar soni',
    benchmark: '> 0',
    status: pnl.eps > 0 ? 'optimal' : 'critical',
    description: 'Har bir oddiy aksiyaga to\'g\'ri keladigan davr sof foydasi'
  });

  ratios.push({
    key: 'bvps',
    nameKey: 'bvps',
    category: 'investor',
    value: Number(balance_sheet.bvps.toFixed(2)),
    unit: '$',
    formula: 'Xususiy kapital / Aksiyalar soni',
    benchmark: '> 0',
    status: balance_sheet.bvps > 0 ? 'optimal' : 'critical',
    description: 'Har bir aksiyaning buxgalteriya balans qiymati'
  });

  // Calculate overall health score (0 - 100)
  const scoreMap: Record<RatioStatus, number> = {
    optimal: 100,
    good: 75,
    warning: 40,
    critical: 10
  };
  const sumScores = ratios.reduce((acc, r) => acc + scoreMap[r.status], 0);
  const overallHealthScore = Math.round(sumScores / ratios.length);

  // Build monthly trend points
  const monthlyTrends: MonthlyTrendPoint[] = months_list.map((m) => {
    const mp = monthly_pnl[m] || { revenue: 0, gross_profit: 0, net_profit: 0 };
    const mb = monthly_balance_sheet[m] || {
      assets: { cash: 0, fixed_assets: 0, total_assets: 0 },
      liabilities: { loans: 0, total_liabilities: 0 },
      equity: { total_equity: 0 }
    };

    const mRev = mp.revenue || 0;
    const mGross = mp.gross_profit || 0;
    const mNet = mp.net_profit || 0;

    return {
      month: m,
      revenue: mRev,
      grossProfit: mGross,
      netProfit: mNet,
      grossMargin: mRev > 0 ? Number(((mGross / mRev) * 100).toFixed(1)) : 0,
      netMargin: mRev > 0 ? Number(((mNet / mRev) * 100).toFixed(1)) : 0,
      cash: mb.assets.cash || 0,
      assets: mb.assets.total_assets || 0,
      liabilities: mb.liabilities.total_liabilities || 0,
      equity: mb.equity.total_equity || 0
    };
  });

  return {
    ratios,
    overallHealthScore,
    monthlyTrends
  };
}
