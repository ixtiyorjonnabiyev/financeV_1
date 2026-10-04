# Moliya - IFRS Financial Management Platform

Professional financial accounting and statement generation platform built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed for small & medium businesses, startups, shops, manufacturers, cafes, farms, and modern enterprises.

---

## ✨ Features

- **3 Interconnected IFRS Statements**:
  - **Statement of Profit or Loss (P&L)**: Revenue, COGS, Gross Profit, OPEX, Operating Profit, Finance/Tax, Net Profit, EPS.
  - **Statement of Financial Position (Balance Sheet)**: Assets (Cash, Fixed Assets), Liabilities (Loans), Equity (Initial, Contributed, Withdrawn, Retained Earnings), Real-time Balance Equation Check ($Assets = Liabilities + Equity$).
  - **Statement of Cash Flows**: Operating, Investing, and Financing Cash Flows, Opening Cash, Ending Cash.
- **High-Converting Landing Page (`/`)**:
  - Explains Moliya with interactive previews and comparison tables.
- **Mobile-First Responsive Dashboard (`/app`)**:
  - Sticky table headers, horizontal swipeable financial statements, touch-friendly transaction inputs.
- **10 Industry Templates**: Pre-configured charts of accounts for Shop, Manufacturer, Services, Restaurant, Farm, Construction, Education, Non-profit, Sole Proprietor, and Other.
- **Drill-Down Modals**: Click on any financial statement row to view the underlying journal transactions.
- **AI Assistant**: Natural language and receipt parsing to automatically detect opening balances and categorize transactions.
- **Multi-Language (i18n)**: Uzbek (`uz`), Russian (`ru`), and English (`en`).
- **Offline-First & Private Storage**: Runs 100% in the client browser (LocalStorage) with full JSON backup export & restore. Zero external database configuration required.

---

## 🚀 1-Click Vercel Deployment

1. Push this repository to GitHub:
   ```bash
   git add .
   git commit -m "Migrate to Next.js with Landing Page and IFRS engine"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com) and click **Add New...** $\rightarrow$ **Project**.
3. Select your repository (`Finance`).
4. Click **Deploy**.
   - **Framework Preset**: Next.js (automatically detected)
   - **Build Command**: `next build` (automatically detected)
   - **Zero Environment Variables required**!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open in browser
http://localhost:3000
```
