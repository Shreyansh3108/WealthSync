'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the Dashboard so that localStorage, recharts, etc. work properly
const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr: false });

export default function HomePage() {
  return (
    <main className="p-6 font-sans bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to WealthSync 🚀</h1>
      <Dashboard />
    </main>
  );
}
