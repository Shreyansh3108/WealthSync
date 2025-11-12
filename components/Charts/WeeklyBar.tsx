'use client';
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

function parseDMY(dStr:string) {
  const [dd,mm,yy] = dStr.split('/').map(Number);
  return new Date(yy, mm-1, dd);
}

export default function WeeklyBar({ transactions } : { transactions:any[] }) {
  const data = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const days = [];
    for (let i=6;i>=0;i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const label = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
      const ds = d.toLocaleDateString('en-GB');
      let inc=0, exp=0;
      transactions.forEach((t:any) => {
        if (t.date === ds) {
          if (t.type === 'Income') inc += t.amount;
          else exp += t.amount;
        }
      });
      days.push({ name: label, Income: inc, Expense: exp });
    }
    return days;
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
