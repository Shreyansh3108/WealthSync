'use client';

import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

type Transaction = {
  type: 'Income' | 'Expense' | string;
  category: string;
  amount: number;
};

export default function PieBreakdown({ transactions }: { transactions: Transaction[] }) {
  console.log("Transactions received in PieBreakdown:", transactions);

  const expenseData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const totals: Record<string, number> = {};
    for (const t of transactions) {
      if (t.type.toLowerCase() === 'expense' && t.amount > 0) {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      }
    }
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  console.log("Processed expenseData:", expenseData);

  if (!expenseData.length) {
    return (
      <div className="flex items-center justify-center h-52 text-gray-500 italic">
        No expense data yet. Add some expenses!
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];

  return (
    <div style={{ width: '100%', height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={expenseData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ name, value }) => `${name}: ₹${value}`}
          >
            {expenseData.map((_, i) => (
              <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `₹${v}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
