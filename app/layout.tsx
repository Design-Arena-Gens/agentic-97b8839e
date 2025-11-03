import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Routine Planner',
  description: 'Set and visualize your routines',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className + ' bg-gray-50 min-h-screen'}>
        <div className="container-max py-6">
          {children}
        </div>
      </body>
    </html>
  );
}
