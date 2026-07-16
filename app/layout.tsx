import type { Metadata } from 'next';
import ThemeRegistry from '../src/components/providers/ThemeRegistry';

export const metadata: Metadata = {
  title: 'GoFunds — Mutual Fund Investment Planner',
  description: 'AI-powered personalised mutual fund investment plans tailored to your goals, income, and risk appetite.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
