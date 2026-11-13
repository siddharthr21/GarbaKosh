import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { EmergencyModal } from '@/components/modals/EmergencyModal';

export const metadata: Metadata = {
  title: 'GarbhSarthi · Your Companion Through Pregnancy',
  description: 'Every heartbeat, every milestone, every moment — together. An AI-powered maternal sanctuary and parenthood platform for expecting mothers, fathers, and couples.',
  icons: {
    icon: '/garbhsarthi-logo.jpg',
    apple: '/garbhsarthi-logo.jpg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('garbhsarthi_theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground selection:bg-blush-200 antialiased" suppressHydrationWarning>
        <AppProvider>
          {children}
          <EmergencyModal />
        </AppProvider>
      </body>
    </html>
  );
}
