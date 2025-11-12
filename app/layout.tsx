import './globals.css';
import React from 'react';

export const metadata = {
  title: 'WealthSync',
  description: 'Personal finance tracker',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
