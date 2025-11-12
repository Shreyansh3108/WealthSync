'use client';
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

function parseDMY(dStr:string) {
  const [dd,mm,yy] = dStr.split('/').map(Number);
  return new Date(yy, mm-1, dd);
}

export default function YearlyBar({ transactions } : { transactions:any[] }) {
  const data = useMemo(() => {
    const now = new Date(); const year = now.getFullYear();
    const months = Array.from({length:12}, (_,i)=>({ name: new Date(0,i).toLocaleString('en-US',{month:'short'}), Income:0, Expense:0 }));
    transactions.forEach((t:any) => {
      const d = parseDMY(t.date);
      if (d.getFullYear() === year) {
        if (t.type === 'Income') months[d.getMonth()].Income += t.amount;
        else months[d.getMonth()].Expense += t.amount;
      }
    });
    return months;
  }, [transactions]);

  return (
    <div style={{ width:'100%', height:350 }}>
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
