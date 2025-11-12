'use client';
import React from 'react';

type T = { id:number, username:string, type:'Income'|'Expense', category:string, amount:number, date:string };

export default function TransactionsList({ transactions } : { transactions: T[] }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Transactions</h3>
      </div>
      <ul className="space-y-3">
        {transactions.map(t => (
          <li key={t.id} className={`flex justify-between items-center p-3 rounded-xl shadow-sm ${t.type === 'Income' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div>
              <div className="font-semibold">{t.category}</div>
              <div className="text-xs text-gray-500">{t.date}</div>
            </div>
            <div className={`font-bold ${t.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
              {t.type === 'Income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
