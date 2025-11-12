'use client';
import React, { useState } from 'react';

type Props = {
  onLogin: (u:string,p:string) => boolean;
  onSignup: (u:string,p:string) => boolean;
};

export default function AuthForm({onLogin,onSignup}:Props) {
  const [isSignup,setIsSignup] = useState(false);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');

  const submit = () => {
    if (isSignup) {
      const ok = onSignup(username,password);
      if (ok) { setIsSignup(false); setUsername(''); setPassword(''); }
    } else {
      onLogin(username,password);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 w-96 shadow-lg text-center">
      <h2 className="text-2xl font-bold text-purple-600 mb-3">WealthSync</h2>
      <p className="mb-4">{isSignup ? 'Create your account' : 'Login to continue'}</p>

      <input className="w-full mb-3 p-2 border rounded-lg" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" />
      <input className="w-full mb-4 p-2 border rounded-lg" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" />

      <button onClick={submit} className={`w-full py-2 rounded-lg text-white ${isSignup ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-600 hover:bg-purple-700'}`}>
        {isSignup ? 'Sign Up' : 'Login'}
      </button>

      <button onClick={() => { setIsSignup(!isSignup); setUsername(''); setPassword(''); }} className="mt-3 text-sm text-purple-600">
        {isSignup ? 'Already have an account? Login' : 'New user? Sign Up'}
      </button>
    </div>
  );
}
