'use client';
import React, { useEffect, useState } from 'react';

type Props = {
  onAdd: (t: { type: 'Income'|'Expense', category:string, amount:number, dateISO?:string }) => boolean;
};

const expenseCategories = ['Grocery','TV & Mobile Bills','House Expense','Medicals','Transportation','Emergency Expense','Random Important Expense','Food','Taxes','EMI or Loans'];
const incomeCategories = ['Salary','Bonus','Stocks','Business Returns','Interest Returns','Others'];

export default function AddTransactionForm({ onAdd }: Props) {
  const [type, setType] = useState<'Expense'|'Income'>('Expense');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [dateISO, setDateISO] = useState('');

  useEffect(() => {
    setDateISO(new Date().toISOString().split('T')[0]); // default to today
  }, []);

  const submit = () => {
    if (!category || !amount || !dateISO) { alert('Fill all fields'); return; }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { alert('Enter valid amount'); return; }
    // prevent future dates
    const selected = new Date(dateISO);
    const today = new Date(); today.setHours(0,0,0,0);
    if (selected.getTime() > today.getTime()) { alert('Transaction date cannot be in the future'); return; }

    const ok = onAdd({ type, category, amount: amt, dateISO });
    if (ok) {
      setCategory('');
      setAmount('');
      setDateISO(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <select value={type} onChange={e => setType(e.target.value as any)} className="border p-2 rounded-lg">
        <option>Expense</option>
        <option>Income</option>
      </select>

      <select value={category} onChange={e=>setCategory(e.target.value)} className="border p-2 rounded-lg">
        <option value="">Select Category</option>
        {(type === 'Expense' ? expenseCategories : incomeCategories).map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <input className="border p-2 rounded-lg" type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />

      <input className="border p-2 rounded-lg" type="date" value={dateISO} onChange={e=>setDateISO(e.target.value)} max={new Date().toISOString().split('T')[0]} />

      <button onClick={submit} className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700">Add</button>
    </div>
  );
}
