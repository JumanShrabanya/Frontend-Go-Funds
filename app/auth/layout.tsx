import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GoFunds — Sign In or Sign Up',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
