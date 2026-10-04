export interface ParsedAiResult {
  balances: {
    opening_cash?: number | null;
    opening_fixed_assets?: number | null;
    opening_loans?: number | null;
    opening_equity?: number | null;
    share_count?: number | null;
  };
  transactions: {
    date: string;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    note: string;
  }[];
  summary: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  salaries: ['salary', 'salaries', 'maosh', 'zarplata', 'payroll', 'xodim', 'sotrudnik'],
  rent: ['rent', 'ijara', 'arenda'],
  utilities: ['utilities', 'kommunal', 'electricity', 'elektr', 'kommunalka', 'water'],
  raw_materials: ['raw material', 'xom ashyo', 'syryo', 'materials'],
  goods_purchase: ['goods', 'inventory', 'tovar', 'zakupka', 'purchase goods', 'mahsulot xaridi'],
  retail_sales: ['retail', 'chakana', 'roznica', 'shop sales'],
  wholesale_sales: ['wholesale', 'ulgurji', 'optom'],
  service_fees: ['service', 'xizmat', 'uslugi', 'contract fee', 'freelance'],
  equipment: ['equipment', 'machinery', 'machine', 'uskuna', 'jihoz', 'oborudovanie', 'technika'],
  loan_in: ['borrowed', 'loan received', 'kredit olindi', 'qarz olindi', 'vzyali kredit', 'vzyal zaem'],
  loan_out: ['loan repaid', 'repaid loan', 'kredit to\'landi', 'qarz qaytarildi', 'pogasili kredit'],
  taxes: ['tax', 'taxes', 'soliq', 'nalog', 'nalogi'],
  marketing: ['marketing', 'ad', 'reklama', 'advertising']
};

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function inferCategory(line: string, defaultType: 'income' | 'expense'): string {
  const lower = line.toLowerCase();
  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (words.some(w => lower.includes(w))) {
      return cat;
    }
  }
  return defaultType === 'income' ? 'sales_products' : 'other_expense';
}

function extractNumbers(s: string): number[] {
  // First search for currency symbol matches ($1,000, 1000 so'm, etc.)
  const curTokens = s.match(/\$\s*\d+(?:[,\s_]\d{3})*(?:\.\d+)?/g);
  if (curTokens) {
    const res: number[] = [];
    for (const t of curTokens) {
      const clean = t.replace(/[^\d.]/g, '');
      const val = parseFloat(clean);
      if (val > 0) res.push(val);
    }
    if (res.length > 0) return res;
  }

  // Fallback: general tokens ignoring hashtags
  const cleanS = s.replace(/#\d+/g, '');
  const tokens = cleanS.match(/\d+(?:[,\s_]\d{3})*(?:\.\d+)?/g) || [];
  const res: number[] = [];
  for (const t of tokens) {
    const clean = t.replace(/[^\d.]/g, '');
    const val = parseFloat(clean);
    if (val > 0) res.push(val);
  }
  return res;
}

export function parseAiContent(text: string): ParsedAiResult {
  const detectedBalances: ParsedAiResult['balances'] = {
    opening_cash: null,
    opening_fixed_assets: null,
    opening_loans: null,
    opening_equity: null,
    share_count: null
  };

  const detectedTxs: ParsedAiResult['transactions'] = [];
  const now = new Date();
  const nowDate = now.toISOString().slice(0, 10);

  // 1. Parse startup sentences for opening balances
  const sentences = text.split(/[\n;.]/).map(s => s.trim()).filter(Boolean);
  for (const sentence of sentences) {
    const sLow = sentence.toLowerCase();
    const isStartup = containsAny(sLow, [
      'started', 'boshlang\'ich', 'nachalnyy', 'initial', 'open with', 
      'opening', 'starting', 'bank balance', 'equity', 'capital'
    ]);

    if (isStartup) {
      const clauses = sentence.split(/,\s+|\band\b|\bva\b|\bi\b|;/i).map(c => c.trim()).filter(Boolean);
      for (const clause of clauses) {
        const nums = extractNumbers(clause);
        if (!nums.length) continue;
        const amt = nums[0];
        const cLow = clause.toLowerCase();

        if (containsAny(cLow, ['equipment', 'asset', 'uskuna', 'jihoz', 'oborudovanie', 'property'])) {
          detectedBalances.opening_fixed_assets = amt;
        } else if (containsAny(cLow, ['debt', 'loan', 'kredit', 'qarz', 'dolg', 'zaem'])) {
          detectedBalances.opening_loans = amt;
        } else if (containsAny(cLow, ['capital', 'equity', 'ustavnyy'])) {
          detectedBalances.opening_equity = amt;
        } else if (containsAny(cLow, ['shares', 'stock', 'akciya', 'ulush'])) {
          detectedBalances.share_count = Math.floor(amt);
        } else if (containsAny(cLow, ['bank', 'cash', 'naqd', 'raschetnyy', 'started', 'money', 'pul', 'opening'])) {
          detectedBalances.opening_cash = amt;
        }
      }
    }
  }

  // 2. Tabular/CSV line parsing
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const lLow = line.toLowerCase();
    if (containsAny(lLow, ['started', 'opening', 'initial', 'equity'])) continue;

    if (line.includes(',') || line.includes('\t') || line.includes(';') || line.includes('|')) {
      const parts = line.split(/[,;\t|]/).map(p => p.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
      if (parts.length >= 3 && !containsAny(parts[0].toLowerCase(), ['date', 'type', 'category'])) {
        let dVal: string | null = null;
        let amtVal: number | null = null;
        let typeVal: 'income' | 'expense' | null = null;
        const noteParts: string[] = [];

        for (const p of parts) {
          if (/^\d{4}-\d{2}-\d{2}$/.test(p)) {
            dVal = p;
          } else if (containsAny(p, ['income', 'kirim', 'vyruchka', 'doxod', 'plus', '+'])) {
            typeVal = 'income';
          } else if (containsAny(p, ['expense', 'chiqim', 'rasxod', 'minus', '-'])) {
            typeVal = 'expense';
          } else {
            const nums = extractNumbers(p);
            if (nums.length && amtVal === null) {
              amtVal = nums[0];
            } else {
              noteParts.push(p);
            }
          }
        }

        if (amtVal && amtVal > 0) {
          if (!typeVal) {
            const noteStr = noteParts.join(' ').toLowerCase();
            typeVal = containsAny(noteStr, ['sale', 'sold', 'revenue', 'received', 'tushum']) ? 'income' : 'expense';
          }
          const cat = inferCategory(noteParts.join(' '), typeVal);
          detectedTxs.push({
            date: dVal || nowDate,
            type: typeVal,
            category: cat,
            amount: amtVal,
            note: noteParts.join(' ').slice(0, 80) || 'Imported Transaction'
          });
        }
      }
    }
  }

  // 3. Natural language sentences
  if (!detectedTxs.length || lines.length < 3) {
    for (const sentence of sentences) {
      const sLow = sentence.toLowerCase();
      if (containsAny(sLow, ['started', 'boshlang\'ich', 'nachalnyy', 'initial', 'open with', 'opening balance', 'starting balance'])) {
        continue;
      }

      const clauses = sentence.split(/,\s+|\band\b|\bva\b|\bi\b|;/i).map(c => c.trim()).filter(Boolean);
      for (const clause of clauses) {
        const nums = extractNumbers(clause);
        if (!nums.length) continue;
        const amt = nums[0];
        const cLow = clause.toLowerCase();

        const isIncome = containsAny(cLow, ['sold', 'revenue', 'income', 'received', 'earned', 'tushum', 'sotildi', 'kirim', 'vyruchka', 'doxod', 'popolnenie']);
        const isExpense = containsAny(cLow, ['paid', 'spent', 'bought', 'purchase', 'cost', 'expense', 'to\'landi', 'xarid', 'chiqim', 'rasxod', 'kupili', 'potratili', 'total']);

        if (isIncome || isExpense || nums.length > 0) {
          const txType: 'income' | 'expense' = (isIncome && !isExpense) ? 'income' : 'expense';
          const cat = inferCategory(clause, txType);
          const dateMatch = clause.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
          const txDate = dateMatch ? dateMatch[1] : nowDate;

          detectedTxs.push({
            date: txDate,
            type: txType,
            category: cat,
            amount: amt,
            note: clause.slice(0, 80)
          });
        }
      }
    }
  }

  // Auto calculate opening equity if cash was detected
  if (detectedBalances.opening_cash !== null && detectedBalances.opening_equity === null) {
    const c = detectedBalances.opening_cash || 0;
    const f = detectedBalances.opening_fixed_assets || 0;
    const l = detectedBalances.opening_loans || 0;
    detectedBalances.opening_equity = c + f - l;
  }

  return {
    balances: detectedBalances,
    transactions: detectedTxs,
    summary: `Found ${detectedTxs.length} transactions and opening balance values.`
  };
}
