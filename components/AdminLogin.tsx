
import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo password
    if (password === 'admin123') {
      onLogin(true);
    } else {
      setError('Invalid admin credentials. Hint: use admin123');
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-500 mt-1">Authorized personnel only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Enter Admin Password</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all"
              placeholder="••••••••"
            />
            {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Access Dashboard
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          Tip: This is a demo. Use <code className="bg-gray-100 px-1 py-0.5 rounded">admin123</code> to log in.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
