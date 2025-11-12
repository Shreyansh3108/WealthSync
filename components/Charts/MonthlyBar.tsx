'use client';
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

function parseDMY(dStr:string) {
  const [dd,mm,yy] = dStr.split('/').map(Number);
  return new Date(yy, mm-1, dd);
}

export default function MonthlyBar({ transactions } : { transactions:any[] }) {
  const data = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const weeks = [{name:'W1',Income:0,Expense:0},{name:'W2',Income:0,Expense:0},{name:'W3',Income:0,Expense:0},{name:'W4',Income:0,Expense:0},{name:'W5',Income:0,Expense:0}];
    transactions.forEach((t:any) => {
      const d = parseDMY(t.date);
      if (d.getFullYear()===year && d.getMonth()===month) {
        const day = d.getDate();
        const idx = Math.min(4, Math.floor((day-1)/7));
        if (t.type==='Income') weeks[idx].Income += t.amount;
        else weeks[idx].Expense += t.amount;
      }
    });
    return weeks;
  }, [transactions]);

  return (
    <div style={{ width:'100%', height:300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v:number) => `₹${v.toLocaleString('en-IN')}`} />
          <Legend />
          <Bar dataKey="Income" fill="#22c55e" />
          <Bar dataKey="Expense" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
