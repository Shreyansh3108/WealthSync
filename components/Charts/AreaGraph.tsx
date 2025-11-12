'use client';
import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

function parseDMY(dStr:string) {
  const [dd,mm,yy] = dStr.split('/').map(Number);
  return new Date(yy, mm-1, dd);
}

function buildWeek(transactions:any[]) {
  const today = new Date(); today.setHours(0,0,0,0);
  const res:any[] = [];
  for (let i=6;i>=0;i--) {
    const d = new Date(today); d.setDate(today.getDate()-i);
    const label = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
    const ds = d.toLocaleDateString('en-GB');
    let inc=0, exp=0;
    transactions.forEach((t:any)=> { if (t.date===ds) { if(t.type==='Income') inc+=t.amount; else exp+=t.amount; }});
    res.push({ name: label, Income: inc, Expense: exp });
  }
  return res;
}

function buildMonth(transactions:any[]) {
  const now = new Date();
  const year = now.getFullYear(), month = now.getMonth();
  const weeks = [{name:'W1',Income:0,Expense:0},{name:'W2',Income:0,Expense:0},{name:'W3',Income:0,Expense:0},{name:'W4',Income:0,Expense:0},{name:'W5',Income:0,Expense:0}];
  transactions.forEach((t:any) => {
    const d = parseDMY(t.date);
    if (d.getFullYear()===year && d.getMonth()===month) {
      const day = d.getDate();
      const idx = Math.min(4, Math.floor((day-1)/7));
      if (t.type==='Income') weeks[idx].Income+=t.amount; else weeks[idx].Expense+=t.amount;
    }
  });
  return weeks;
}

function buildYear(transactions:any[]) {
  const now = new Date(), year = now.getFullYear();
  const months = Array.from({length:12}, (_,i)=>({ name: new Date(0,i).toLocaleString('en-US',{month:'short'}), Income:0, Expense:0 }));
  transactions.forEach((t:any) => {
    const d = parseDMY(t.date);
    if (d.getFullYear()===year) {
      if (t.type==='Income') months[d.getMonth()].Income += t.amount;
      else months[d.getMonth()].Expense += t.amount;
    }
  });
  return months;
}

export default function AreaGraph({ transactions, range }: { transactions:any[], range:'week'|'month'|'year' }) {
  const data = useMemo(() => {
    if (range==='week') return buildWeek(transactions);
    if (range==='month') return buildMonth(transactions);
    return buildYear(transactions);
  }, [transactions, range]);

  return (
    <div style={{ width:'100%', height:300 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v:number) => `₹${v.toLocaleString('en-IN')}`} />
          <Legend />
          <Area type="monotone" dataKey="Income" stroke="#22c55e" fill="url(#g1)" />
          <Area type="monotone" dataKey="Expense" stroke="#ef4444" fill="url(#g2)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
