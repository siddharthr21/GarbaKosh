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
    <html lang="en">
      <body className="min-h-screen bg-cream-50/50 text-gray-900 selection:bg-blush-200">
        <AppProvider>
          {children}
          <EmergencyModal />
        </AppProvider>
      </body>
    </html>
  );
}
