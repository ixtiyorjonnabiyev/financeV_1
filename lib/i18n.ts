import { Language } from './types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  uz: {
    // Brand & Navigation
    title: "Moliya",
    tagline: "Kichik va o'rta biznes uchun IFRS moliyaviy hisobot tizimi",
    launchApp: "Tizimga kirish",
    viewDemo: "Jonli demo ko'rish",
    dashboard: "Boshqaruv paneli",
    backToHome: "Bosh sahifa",

    // Landing Page
    heroBadge: "IFRS / MHXS Xalqaro Standartlarida",
    heroTitle: "Biznesingiz moliyasini aniq, shaffof va oson boshqaring",
    heroSubtitle: "Excel jadvallari va murakkab buxgalteriya dasturlaridan charchadingizmi? Moliya daromad va xarajatlaringizdan avtomatik ravishda P&L, Balans hisoboti va Pul oqimlari (Cash Flow)ni shakllantiradi.",
    getStartedFree: "Hoziroq bepul boshlang",
    noCreditCard: "Kredit karta talab etilmaydi • 100% maxfiy va xavfsiz",
    
    // Statements feature section
    feature1Title: "3 ta Birlashgan Moliyaviy Hisobot",
    feature1Desc: "Har bir kiritilgan operatsiya avtomatik tarzda Foyda va zararlar (P&L), Balans hisoboti va Pul oqimiga (Cash Flow) taqsimlanadi.",
    feature2Title: "10 xil Biznes Yo'nalishlari",
    feature2Desc: "Do'kon, ishlab chiqarish, xizmat ko'rsatish, restoran, fermer xo'jaligi, qurilish va boshqa sohalar uchun tayyor shablonlar.",
    feature3Title: "Balans Qoidasi Kafolati",
    feature3Desc: "Aktivlar = Majburiyatlar + Kapital formulasi avtomatik tekshiriladi. Balansning buzilishi haqida tizim darhol ogohlantiradi.",
    feature4Title: "Aqlli AI Yordamchi",
    feature4Desc: "Oddiy matn yoki chek yozuvlarini nusxalab qo'ying — AI operatsiyalarni avtomatik taniydi va toifalarga ajratadi.",
    feature5Title: "Mobil Qurilmalarga Mos",
    feature5Desc: "Telefon, planshet va kompyuterda birdek qulay ishlaydigan zamonaviy, tezkor interfeys.",
    feature6Title: "Offlayn va Maxfiy Xotira",
    feature6Desc: "Ma'lumotlaringiz faqat sizning qurilmangizda saqlanadi. Istalgan vaqtda JSON nusxasini yuklab olishingiz mumkin.",

    // Industry section
    industryTitle: "Sizning sohangizga moslashtirilgan",
    industrySubtitle: "Biznes turini tanlang va unga moslangan hisobotlar bilan ishlang",

    // Comparison section
    compareTitle: "Nega aynan Moliya?",
    featureCol: "Imkoniyat",
    excelCol: "Excel / Google Sheets",
    erpCol: "Murakkab 1C / ERP",
    moliyaCol: "Moliya",
    compRow1: "3 ta moliyaviy hisobotni avtomatlashtirish",
    compRow2: "Mobil telefon orqali kiritish",
    compRow3: "O'rnatish va sozlash vaqti",
    compRow4: "AI orqali matndan operatsiyalarni ajratish",
    compRow5: "IFRS standartlariga to'liq moslik",
    compRow6: "Narxi",
    freeForever: "Doimiy bepul",

    // App Interface
    company: "Tashkilot",
    newCompany: "Yangi tashkilot",
    edit: "Tahrirlash",
    delete: "O'chirish",
    cancel: "Bekor qilish",
    save: "Saqlash",
    close: "Yopish",
    name: "Tashkilot nomi",
    orgType: "Faoliyat turi",
    opening: "Boshlang'ich qoldiqlar",
    openingCash: "Kassa va bank qoldig'i",
    openingFixedAssets: "Asosiy vositalar (uskunalar)",
    openingLoans: "Kredit va qarzlar majburiyati",
    openingEquity: "Boshlang'ich ustav kapitali",
    sharesValuation: "Ulushlar va aksiyalar",
    shareCount: "Aksiyalar soni (dona)",
    confirm: "Haqiqatan ham o'chirmoqchimisiz?",
    empty: "Operatsiyalar mavjud emas. Yangi operatsiya qo'shing.",
    noCompany: "Boshlash uchun tashkilot yarating.",

    // Dashboard KPIs
    balance: "Pul qoldig'i (Kassa/Bank)",
    income: "Kirim (Daromad)",
    expense: "Chiqim (Xarajat)",
    profit: "Sof foyda",
    equity: "Umumiy kapital",
    balanceCheck: "Balans tengligi",
    balanced: "Balans to'g'ri (A = M + K)",
    unbalanced: "Balans nomutanosib",

    // Add Transaction
    addTx: "Yangi operatsiya",
    date: "Sana",
    type: "Turi",
    category: "Toifasi",
    amount: "Summa",
    note: "Izoh",
    otherCat: "Boshqa toifa...",

    // Period filter
    filterPeriod: "Davr bo'yicha filter",
    fromMonth: "Boshlanish oyi",
    toMonth: "Tugash oyi",
    allTime: "Barcha davr",
    reset: "Tozalash",
    applyFilter: "Filterni qo'llash",

    // IFRS Statements
    ifrsReport: "IFRS / MHXS Moliyaviy Hisoboti",
    pl: "Foyda va zararlar to'g'risida hisobot (P&L)",
    bs: "Moliyaviy holat to'g'risida hisobot (Balans)",
    cfs: "Pul oqimlari to'g'risida hisobot (Cash Flow)",
    indicator: "Ko'rsatkich",
    totalPeriod: "Jami davr",
    clickToViewTx: "Operatsiyalar ro'yxatini ko'rish uchun bosing",
    print: "Chop etish / PDF",

    // P&L items
    revenue: "Mahsulot/xizmat sotishdan tushum",
    cogs: "Sotilgan mahsulot/xizmatlar tannarxi",
    grossProfit: "Yalpi foyda (Gross Profit)",
    opex: "Operatsion xarajatlar (OPEX)",
    operatingProfit: "Operatsion foyda (EBIT)",
    otherIncome: "Boshqa operatsion daromadlar",
    otherExpenseLine: "Boshqa operatsion xarajatlar",
    financeIncome: "Moliyaviy daromadlar (Foizlar)",
    financeCost: "Moliyaviy xarajatlar (Bank komissiyasi)",
    pbt: "Soliq to'langunga qadar foyda (EBT)",
    taxExpense: "Foyda solig'i xarajati",
    netProfit: "Sof foyda (Net Profit)",
    eps: "Bir aksiyaga to'g'ri keladigan sof foyda (EPS)",

    // Balance Sheet items
    assets: "AKTIVLAR",
    cashLine: "Pul mablag'lari va ularning ekvivalentlari",
    fixedAssets: "Asosiy vositalar va uskunalar",
    totalAssets: "Jami aktivlar",
    liabilities: "MAJBURIYATLAR",
    loansPayable: "Kredit va qarz majburiyatlari",
    totalLiabilities: "Jami majburiyatlar",
    initialCapital: "Boshlang'ich ustav kapitali",
    contributedCapital: "Qo'shimcha kiritilgan sarmoya",
    withdrawnCapital: "Egasi tomonidan yechib olingan mablag'",
    retainedEarnings: "Taqsimlanmagan foyda",
    totalEquity: "Jami xususiy kapital",
    totalLiabilitiesAndEquity: "JAMI MAJBURIYATLAR VA KAPITAL",
    bvps: "Bir aksiyaning balans qiymati (BVPS)",

    // Cash Flow items
    cfOpeningCash: "Davr boshiga pul qoldig'i",
    operatingActivities: "Operatsion faoliyatdan pul oqimi",
    investingActivities: "Investitsiya faoliyatidan pul oqimi",
    financingActivities: "Moliyaviy faoliyatdan pul oqimi",
    netCashFlow: "Sof pul oqimi",
    endingCash: "Davr oxiriga pul qoldig'i",

    // Transactions list
    transactions: "Operatsiyalar jurnali",
    search: "Qidiruv...",
    actions: "Amallar",

    // Drilldown modal
    accountTxDetail: "Hisob tafsiloti",

    // AI Assistant
    aiAssistant: "AI Yordamchi",
    aiSubtitle: "Matn, chek yoki hisobotni kiriting. Sun'iy intellekt avtomatik toifalab beradi.",
    aiInputPlaceholder: "Misol:\nBoshlang'ich kassa 5000$, uskunalar 3000$, kredit 1000$.\n2026-10-01 do'kondan 1200$ chakana savdo tushdi.\n2026-10-02 xodimlarga 600$ oylik maosh berildi.\n2026-10-03 ijara uchun 400$ to'landi.",
    aiAnalyze: "Tahlil qilish",
    aiAnalyzing: "Tahlil qilinmoqda...",
    aiDetectedBalances: "Aniqlangan boshlang'ich qoldiqlar:",
    aiDetectedTxs: "Aniqlangan operatsiyalar:",
    aiApply: "Tizimga qo'llash",
    aiAppliedSuccess: "Operatsiyalar muvaffaqiyatli saqlandi!",

    // Data export/import
    exportData: "Zaxira nusxa (Eksport)",
    importData: "Nusxadan tiklash (Import)",
    dataSafe: "Ma'lumotlar xavfsizligi"
  },

  ru: {
    // Brand & Navigation
    title: "Молия",
    tagline: "Система финансовой отчётности по МСФО для малого и среднего бизнеса",
    launchApp: "Войти в систему",
    viewDemo: "Смотреть демо",
    dashboard: "Панель управления",
    backToHome: "На главную",

    // Landing Page
    heroBadge: "По международным стандартам МСФО",
    heroTitle: "Финансы вашего бизнеса — прозрачно, точно и без лишней рутины",
    heroSubtitle: "Забудьте о запутанных таблицах Excel. Moliya автоматически строит отчёт о прибылях и убытках (P&L), баланс и отчёт о движении денежных средств (Cash Flow) на основе ваших ежедневных операций.",
    getStartedFree: "Начать бесплатно",
    noCreditCard: "Без привязки карты • 100% конфиденциально",

    // Statements feature section
    feature1Title: "3 Взаимосвязанных Отчёта",
    feature1Desc: "Каждая операция автоматически распределяется в P&L, Баланс и Отчёт о движении денежных средств.",
    feature2Title: "10 Готовых Отраслевых Шаблонов",
    feature2Desc: "Специальные категории для магазинов, производств, сервисных компаний, кафе, фермерских хозяйств и строительства.",
    feature3Title: "Контроль Балансового Равенства",
    feature3Desc: "Активы = Обязательства + Капитал. Система моментально предупреждает о любых расхождениях.",
    feature4Title: "Умный AI-Ассистент",
    feature4Desc: "Вставьте текст, чек или выписку — искусственный интеллект распознает начальные остатки и операции.",
    feature5Title: "Mobile-First Интерфейс",
    feature5Desc: "Удобно пользоваться со смартфона, планшета или компьютера с моментальной синхронизацией.",
    feature6Title: "Локальное и Безопасное Хранение",
    feature6Desc: "Ваши данные хранятся прямо в браузере. Вы можете экспортировать резервную копию в один клик.",

    // Industry section
    industryTitle: "Адаптировано под ваш бизнес",
    industrySubtitle: "Выберите тип организации и работайте с настроенным планом счетов",

    // Comparison section
    compareTitle: "Почему выбирают Moliya?",
    featureCol: "Возможности",
    excelCol: "Excel / Таблицы",
    erpCol: "Сложные ERP / 1С",
    moliyaCol: "Moliya",
    compRow1: "Автоматическая сшивка 3 отчётов",
    compRow2: "Удобный ввод с телефона",
    compRow3: "Время настройки и запуска",
    compRow4: "AI распознавание операций из текста",
    compRow5: "Соответствие принципам МСФО",
    compRow6: "Стоимость",
    freeForever: "Бесплатно",

    // App Interface
    company: "Организация",
    newCompany: "Новая организация",
    edit: "Изменить",
    delete: "Удалить",
    cancel: "Отмена",
    save: "Сохранить",
    close: "Закрыть",
    name: "Название организации",
    orgType: "Тип деятельности",
    opening: "Начальные остатки",
    openingCash: "Остаток в кассе и на счетах",
    openingFixedAssets: "Основные средства (оборудование)",
    openingLoans: "Задолженность по кредитам и займам",
    openingEquity: "Начальный уставный капитал",
    sharesValuation: "Акции и оценка",
    shareCount: "Количество акций (шт)",
    confirm: "Вы уверены, что хотите удалить?",
    empty: "Операций пока нет. Добавьте первую операцию.",
    noCompany: "Создайте организацию, чтобы начать.",

    // Dashboard KPIs
    balance: "Остаток денег (Касса/Банк)",
    income: "Доходы",
    expense: "Расходы",
    profit: "Чистая прибыль",
    equity: "Собственный капитал",
    balanceCheck: "Балансовое равенство",
    balanced: "Баланс сошёлся (А = О + К)",
    unbalanced: "Баланс не сходится",

    // Add Transaction
    addTx: "Новая операция",
    date: "Дата",
    type: "Тип",
    category: "Категория",
    amount: "Сумма",
    note: "Примечание",
    otherCat: "Другая категория...",

    // Period filter
    filterPeriod: "Фильтр периода",
    fromMonth: "С месяца",
    toMonth: "По месяц",
    allTime: "Все периоды",
    reset: "Сбросить",
    applyFilter: "Применить",

    // IFRS Statements
    ifrsReport: "Финансовая отчётность по МСФО",
    pl: "Отчёт о прибылях и убытках (P&L)",
    bs: "Отчёт о финансовом положении (Баланс)",
    cfs: "Отчёт о движении денежных средств (Cash Flow)",
    indicator: "Показатель",
    totalPeriod: "За весь период",
    clickToViewTx: "Нажмите, чтобы просмотреть операции строки",
    print: "Печать / PDF",

    // P&L items
    revenue: "Выручка от реализации",
    cogs: "Себестоимость продаж",
    grossProfit: "Валовая прибыль (Gross Profit)",
    opex: "Операционные расходы (OPEX)",
    operatingProfit: "Операционная прибыль (EBIT)",
    otherIncome: "Прочие операционные доходы",
    otherExpenseLine: "Прочие операционные расходы",
    financeIncome: "Финансовые доходы (Проценты)",
    financeCost: "Финансовые расходы (Банковские комиссии)",
    pbt: "Прибыль до налогообложения (EBT)",
    taxExpense: "Налог на прибыль",
    netProfit: "Чистая прибыль (Net Profit)",
    eps: "Прибыль на одну акцию (EPS)",

    // Balance Sheet items
    assets: "АКТИВЫ",
    cashLine: "Денежные средства и эквиваленты",
    fixedAssets: "Основные средства и оборудование",
    totalAssets: "ИТОГО АКТИВЫ",
    liabilities: "ОБЯЗАТЕЛЬСТВА",
    loansPayable: "Кредиты и займы к выплате",
    totalLiabilities: "ИТОГО ОБЯЗАТЕЛЬСТВА",
    initialCapital: "Первоначальный капитал",
    contributedCapital: "Дополнительные вложения",
    withdrawnCapital: "Изъятия владельца",
    retainedEarnings: "Нераспределённая прибыль",
    totalEquity: "ИТОГО СОБСТВЕННЫЙ КАПИТАЛ",
    totalLiabilitiesAndEquity: "ИТОГО ОБЯЗАТЕЛЬСТВА И КАПИТАЛ",
    bvps: "Балансовая стоимость акции (BVPS)",

    // Cash Flow items
    cfOpeningCash: "Денежные средства на начало периода",
    operatingActivities: "Денежный поток от операционной деятельности",
    investingActivities: "Денежный поток от инвестиционной деятельности",
    financingActivities: "Денежный поток от финансовой деятельности",
    netCashFlow: "Чистый денежный поток",
    endingCash: "Денежные средства на конец периода",

    // Transactions list
    transactions: "Журнал операций",
    search: "Поиск...",
    actions: "Действия",

    // Drilldown modal
    accountTxDetail: "Детализация счёта",

    // AI Assistant
    aiAssistant: "AI Ассистент",
    aiSubtitle: "Вставьте текст, чек или выписку. Искусственный интеллект определит категории и остатки.",
    aiInputPlaceholder: "Пример:\nНачальный остаток кассы 5000$, оборудование 3000$, долг 1000$.\n2026-10-01 продажа товаров на 1200$.\n2026-10-02 зарплата сотрудникам 600$.\n2026-10-03 оплата аренды 400$.",
    aiAnalyze: "Распознать операции",
    aiAnalyzing: "Анализ данных...",
    aiDetectedBalances: "Распознанные начальные остатки:",
    aiDetectedTxs: "Распознанные операции:",
    aiApply: "Применить в систему",
    aiAppliedSuccess: "Операции успешно добавлены!",

    // Data export/import
    exportData: "Экспорт резервной копии",
    importData: "Восстановление (Импорт)",
    dataSafe: "Безопасность данных"
  },

  en: {
    // Brand & Navigation
    title: "Moliya",
    tagline: "IFRS Financial Statement Platform for Growing Businesses",
    launchApp: "Launch App",
    viewDemo: "View Live Demo",
    dashboard: "Dashboard",
    backToHome: "Back to Home",

    // Landing Page
    heroBadge: "IFRS International Standard Compliant",
    heroTitle: "Master Your Business Finances with Clarity & Precision",
    heroSubtitle: "Move beyond messy spreadsheets. Moliya automatically builds your Statement of Profit or Loss (P&L), Balance Sheet, and Statement of Cash Flows directly from everyday transactions.",
    getStartedFree: "Get Started Free",
    noCreditCard: "No credit card required • 100% private & secure",

    // Statements feature section
    feature1Title: "3 Interconnected Financial Statements",
    feature1Desc: "Every transaction automatically reconciles across the Income Statement, Balance Sheet, and Cash Flow Statement simultaneously.",
    feature2Title: "10 Industry Templates",
    feature2Desc: "Pre-configured charts of accounts for Retail, Manufacturing, Services, Restaurants, Agriculture, Construction, and more.",
    feature3Title: "Guaranteed Accounting Equation",
    feature3Desc: "Assets = Liabilities + Equity is constantly monitored and validated in real time to catch discrepancies instantly.",
    feature4Title: "Smart AI Assistant",
    feature4Desc: "Simply paste receipts, bank text, or notes — our assistant extracts opening balances and categorizes transactions.",
    feature5Title: "Mobile-First Design",
    feature5Desc: "Crafted for speed on smartphones, tablets, and desktops with smooth horizontal navigation on financial tables.",
    feature6Title: "Private & Offline-Ready Storage",
    feature6Desc: "Your financial records stay private on your device with instant JSON backup export and import.",

    // Industry section
    industryTitle: "Tailored to Your Industry",
    industrySubtitle: "Select your company category to see specialized accounts and automated workflows",

    // Comparison section
    compareTitle: "Why Choose Moliya?",
    featureCol: "Capabilities",
    excelCol: "Excel / Spreadsheets",
    erpCol: "Complex ERPs",
    moliyaCol: "Moliya",
    compRow1: "Automated 3-Statement Linking",
    compRow2: "Frictionless Mobile Input",
    compRow3: "Setup & Learning Time",
    compRow4: "AI Natural Language Parsing",
    compRow5: "Strict IFRS Math & Balance Checks",
    compRow6: "Cost",
    freeForever: "Free Forever",

    // App Interface
    company: "Organization",
    newCompany: "New Organization",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    name: "Organization Name",
    orgType: "Business Type",
    opening: "Opening Balances",
    openingCash: "Cash and Bank Balance",
    openingFixedAssets: "Fixed Assets (Equipment)",
    openingLoans: "Loans & Borrowings Payable",
    openingEquity: "Initial Equity Capital",
    sharesValuation: "Shares & Valuation",
    shareCount: "Share Count",
    confirm: "Are you sure you want to delete this?",
    empty: "No transactions recorded yet. Add your first transaction above.",
    noCompany: "Create an organization to get started.",

    // Dashboard KPIs
    balance: "Cash Balance",
    income: "Revenue & Income",
    expense: "Operating Expenses",
    profit: "Net Profit",
    equity: "Total Equity",
    balanceCheck: "Balance Equation",
    balanced: "Balanced (A = L + E)",
    unbalanced: "Out of Balance",

    // Add Transaction
    addTx: "New Transaction",
    date: "Date",
    type: "Type",
    category: "Category",
    amount: "Amount",
    note: "Memo / Description",
    otherCat: "Custom Category...",

    // Period filter
    filterPeriod: "Period Filter",
    fromMonth: "From Month",
    toMonth: "To Month",
    allTime: "All Time",
    reset: "Reset",
    applyFilter: "Apply",

    // IFRS Statements
    ifrsReport: "IFRS Financial Statements",
    pl: "Statement of Profit or Loss (P&L)",
    bs: "Statement of Financial Position (Balance Sheet)",
    cfs: "Statement of Cash Flows",
    indicator: "Line Item",
    totalPeriod: "Period Total",
    clickToViewTx: "Click any row to drill down into transaction details",
    print: "Print / Export PDF",

    // P&L items
    revenue: "Revenue from Sales / Services",
    cogs: "Cost of Goods Sold (COGS)",
    grossProfit: "Gross Profit",
    opex: "Operating Expenses (OPEX)",
    operatingProfit: "Operating Profit (EBIT)",
    otherIncome: "Other Operating Income",
    otherExpenseLine: "Other Operating Expenses",
    financeIncome: "Finance Income (Interest)",
    financeCost: "Finance Costs (Bank Fees)",
    pbt: "Profit Before Tax (EBT)",
    taxExpense: "Tax Expense",
    netProfit: "Net Profit",
    eps: "Earnings Per Share (EPS)",

    // Balance Sheet items
    assets: "ASSETS",
    cashLine: "Cash and Cash Equivalents",
    fixedAssets: "Property, Plant & Equipment",
    totalAssets: "TOTAL ASSETS",
    liabilities: "LIABILITIES",
    loansPayable: "Loans Payable",
    totalLiabilities: "TOTAL LIABILITIES",
    initialCapital: "Initial Contributed Capital",
    contributedCapital: "Additional Capital Paid-In",
    withdrawnCapital: "Owner Drawings & Withdrawals",
    retainedEarnings: "Retained Earnings",
    totalEquity: "TOTAL EQUITY",
    totalLiabilitiesAndEquity: "TOTAL LIABILITIES & EQUITY",
    bvps: "Book Value Per Share (BVPS)",

    // Cash Flow items
    cfOpeningCash: "Cash at Beginning of Period",
    operatingActivities: "Cash Flows from Operating Activities",
    investingActivities: "Cash Flows from Investing Activities",
    financingActivities: "Cash Flows from Financing Activities",
    netCashFlow: "Net Change in Cash",
    endingCash: "Cash at End of Period",

    // Transactions list
    transactions: "Transactions Journal",
    search: "Search transactions...",
    actions: "Actions",

    // Drilldown modal
    accountTxDetail: "Account Drill-Down Details",

    // AI Assistant
    aiAssistant: "AI Assistant",
    aiSubtitle: "Paste notes, receipts, or bank statements. AI will extract balances and transactions automatically.",
    aiInputPlaceholder: "Example:\nStarted business with $5,000 cash, $3,000 equipment, $1,000 bank loan.\n2026-10-01 Retail sales of $1,200.\n2026-10-02 Paid employee salaries $600.\n2026-10-03 Paid office rent $400.",
    aiAnalyze: "Analyze Text",
    aiAnalyzing: "Analyzing...",
    aiDetectedBalances: "Detected Opening Balances:",
    aiDetectedTxs: "Detected Transactions:",
    aiApply: "Apply to System",
    aiAppliedSuccess: "Transactions applied successfully!",

    // Data export/import
    exportData: "Export JSON Backup",
    importData: "Import from Backup",
    dataSafe: "Data Privacy & Safety"
  }
};
