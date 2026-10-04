import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Moliya - IFRS Financial Management System',
  description: 'Manage small & medium business finances with automated IFRS P&L, Balance Sheet, and Cash Flow statements. Built for shops, manufacturers, cafes, farms, and modern enterprises.',
  keywords: ['moliya', 'finance', 'accounting', 'IFRS', 'buxgalteriya', 'P&L', 'balance sheet', 'cash flow', 'uzbekistan finance'],
  authors: [{ name: 'Moliya Team' }]
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0284c7'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
