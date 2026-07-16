import type { Metadata } from 'next';
import ThemeRegistry from '../src/components/providers/ThemeRegistry';
import { AuthProvider } from '../src/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'GoFunds — Mutual Fund Investment Planner',
  description: 'AI-powered personalised mutual fund investment plans tailored to your goals, income, and risk appetite.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
