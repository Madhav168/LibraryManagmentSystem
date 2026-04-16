'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogIn, XCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    if (!success) {
      setError('Invalid User ID or Password');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation Links from Excel */}
      <div className="flex justify-between p-4 text-sm font-medium text-gray-600">
        <span className="cursor-pointer hover:underline">Chart</span>
        <span className="cursor-pointer hover:underline">Back</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg border-2 border-gray-800 p-8">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-800 pb-2 inline-block">
              Library Management System
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center space-x-4">
              <label className="w-24 text-lg font-bold text-gray-800">User ID</label>
              <input
                type="text"
                required
                className="flex-1 border-2 border-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-24 text-lg font-bold text-gray-800">Password</label>
              <input
                type="password"
                required
                className="flex-1 border-2 border-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-2 text-sm rounded border border-red-200 text-center">
                {error}
              </div>
            )}

            <div className="flex justify-center space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center"
              >
                {loading ? 'Processing...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
