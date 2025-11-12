'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { LogOut } from 'lucide-react';
import AuthForm from './AuthForm';
import AddTransactionForm from './AddTransactionForm';
import TransactionsList from './TransactionsList';
import PieBreakdown from './Charts/PieBreakdown';
import WeeklyBar from './Charts/WeeklyBar';
import MonthlyBar from './Charts/MonthlyBar';
import YearlyBar from './Charts/YearlyBar';
import AreaGraph from './Charts/AreaGraph';

type Transaction = {
  id: number;
  username: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: number;
  date: string; // 'dd/mm/yyyy'
};

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState<{ username: string; password: string }[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toast, setToast] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'weekly' | 'monthly' | 'yearly' | 'graphs'>('overview');
  const [graphRange, setGraphRange] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('wealthsync_users') || '[]');
    const savedTransactions = JSON.parse(localStorage.getItem('wealthsync_transactions') || '[]');
    const logged = localStorage.getItem('wealthsync_loggedin') || '';
    setRegisteredUsers(savedUsers);
    setTransactions(savedTransactions);
    if (logged) {
      setUsername(logged);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wealthsync_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('wealthsync_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSignup = (u: string, p: string) => {
    if (registeredUsers.some((r) => r.username === u)) {
      showToast('⚠️ Username already exists');
      return false;
    }
    setRegisteredUsers((prev) => [...prev, { username: u, password: p }]);
    showToast('✅ Successfully Signed Up to WealthSync');
    return true;
  };

  const handleLogin = (u: string, p: string) => {
    const user = registeredUsers.find((r) => r.username === u && r.password === p);
    if (!user) {
      if (registeredUsers.some((r) => r.username === u)) {
        showToast('❌ Incorrect password.');
      } else showToast('🚫 You haven’t signed up yet. Kindly Register.');
      return false;
    }
    setIsLoggedIn(true);
    setUsername(u);
    localStorage.setItem('wealthsync_loggedin', u);
    showToast('✅ Successfully logged in to WealthSync');
    return true;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('wealthsync_loggedin');
    showToast('🚪 Successfully logged out from WealthSync');
  };

  const addTransaction = (t: Omit<Transaction, 'id' | 'username'> & { dateISO?: string }) => {
    let { date } = t as any;
    if ((t as any).dateISO) {
      const d = new Date((t as any).dateISO);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      date = `${dd}/${mm}/${yyyy}`;
    }
    if (!date) date = new Date().toLocaleDateString('en-GB');
    const parts = date.split('/').map(Number);
    const dt = new Date(parts[2], parts[1] - 1, parts[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dt.getTime() > today.getTime()) {
      showToast('🚫 Cannot add future date');
      return false;
    }

    const newT: Transaction = { id: Date.now(), username, type: t.type, category: t.category, amount: t.amount, date };
    setTransactions((prev) => [...prev, newT]);
    showToast('✅ Transaction added successfully!');
    return true;
  };

  const userTransactions = useMemo(() => transactions.filter((t) => t.username === username), [transactions, username]);

  const income = userTransactions.filter((t) => t.type === 'Income').reduce((s, a) => s + a.amount, 0);
  const expenses = userTransactions.filter((t) => t.type === 'Expense').reduce((s, a) => s + a.amount, 0);
  const balance = income - expenses;

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      {toast && (
        <div className="fixed z-50 bottom-8 left-1/2 -translate-x-1/2 bg-white text-purple-700 border border-purple-200 px-6 py-3 rounded-full shadow-lg animate-fade-up">
          {toast}
        </div>
      )}

      {!isLoggedIn ? (
        <div className="h-screen flex items-center justify-center">
          <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <button
              onClick={handleLogout}
              className="absolute right-0 top-0 bg-white px-4 py-2 rounded-2xl shadow border flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>

            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-3xl p-8 shadow mb-6">
              <h2 className="text-2xl font-bold">Hii, {username} 👋 Welcome to Finance Tracker</h2>
              <p className="mt-2 opacity-90">Manage your expenses and income easily with real-time charts.</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 text-gray-800 shadow">
                  <div className="text-sm font-semibold">Total Balance</div>
                  <div className="text-2xl font-bold mt-1">₹{balance.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-white rounded-2xl p-5 text-gray-800 shadow">
                  <div className="text-sm font-semibold text-green-600">Total Income</div>
                  <div className="text-2xl font-bold mt-1 text-green-600">₹{income.toLocaleString('en-IN')}</div>
                </div>
                <div className="bg-white rounded-2xl p-5 text-gray-800 shadow">
                  <div className="text-sm font-semibold text-red-600">Total Expenses</div>
                  <div className="text-2xl font-bold mt-1 text-red-600">₹{expenses.toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6">
              <div className="flex gap-3 border-b pb-3 mb-4">
                {['overview', 'weekly', 'monthly', 'yearly', 'graphs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 font-semibold ${
                      activeTab === tab
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-500 hover:text-purple-600'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Active content */}
              {activeTab === 'overview' && (
              <>
                <AddTransactionForm onAdd={addTransaction} />
                <div className="mt-4 bg-white rounded-xl p-4 shadow text-center text-gray-500 italic">
                  Expense chart visualization will be available in the full-stack version 🚀
                  </div>
                </>
            )}
              {activeTab === 'weekly' && (
                <div className="mt-4">
                  <WeeklyBar transactions={userTransactions} />
                  <p className="text-center text-gray-400 text-sm mt-2">X-axis: Days of Week | Y-axis: ₹ Amount</p>
                </div>
              )}

              {activeTab === 'monthly' && (
                <div className="mt-4">
                  <MonthlyBar transactions={userTransactions} />
                  <p className="text-center text-gray-400 text-sm mt-2">X-axis: Weeks | Y-axis: ₹ Amount</p>
                </div>
              )}

              {activeTab === 'yearly' && (
                <div className="mt-4">
                  <YearlyBar transactions={userTransactions} />
                  <p className="text-center text-gray-400 text-sm mt-2">X-axis: Months | Y-axis: ₹ Amount</p>
                </div>
              )}

              {activeTab === 'graphs' && (
                <div className="mt-4 bg-white rounded-xl p-4 shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Income vs Expense Graph</h4>
                    <div className="space-x-2">
                      <button
                        onClick={() => setGraphRange('week')}
                        className={`px-3 py-1 rounded ${
                          graphRange === 'week' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Week
                      </button>
                      <button
                        onClick={() => setGraphRange('month')}
                        className={`px-3 py-1 rounded ${
                          graphRange === 'month' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Month
                      </button>
                      <button
                        onClick={() => setGraphRange('year')}
                        className={`px-3 py-1 rounded ${
                          graphRange === 'year' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Year
                      </button>
                    </div>
                  </div>

                  <AreaGraph transactions={userTransactions} range={graphRange} />
                  <p className="text-center text-gray-400 text-sm mt-2">
                    X-axis: {graphRange === 'week' ? 'Days' : graphRange === 'month' ? 'Weeks' : 'Months'} | Y-axis: ₹
                    Amount
                  </p>
                </div>
              )}
            </div>

            <TransactionsList transactions={userTransactions} />
          </div>
        </div>
      )}
    </div>
  );
}
