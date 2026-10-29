import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ToastContainer from '@/components/Toast';

export const metadata: Metadata = {
  title: 'SubSync | SaaS Subscription & Usage Management Platform',
  description: 'Production-ready SaaS subscription engine with Next.js, Node.js, PostgreSQL, Stripe payments, usage analytics, automated invoices, and RBAC admin portal.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white font-sans">
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
