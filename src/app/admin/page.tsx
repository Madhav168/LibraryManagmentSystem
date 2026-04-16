'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AdminHomePage() {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white min-h-[500px] p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Top Navigation Links from Excel */}
      <div className="flex justify-between mb-8 text-sm font-medium text-gray-600">
        <span className="cursor-pointer hover:underline">Chart</span>
        <h1 className="text-xl font-bold text-gray-900">Admin Home Page</h1>
        <span className="cursor-pointer hover:underline">Back</span>
      </div>

      {/* Main Tab Links */}
      <div className="flex space-x-12 mb-8 text-lg font-bold border-b pb-4">
        <Link href="/admin/maintenance" className="hover:text-indigo-600 transition-colors">Maintenance</Link>
        <Link href="/admin/reports" className="hover:text-indigo-600 transition-colors">Reports</Link>
        <Link href="/admin/transactions" className="hover:text-indigo-600 transition-colors">Transactions</Link>
      </div>

      <div className="mt-8">
        <h2 className="text-center text-xl font-bold mb-4 uppercase">Product Details</h2>
        <div className="max-w-2xl mx-auto overflow-hidden border-2 border-gray-800">
          {loading ? (
            <div className="p-12 text-center font-bold text-gray-500 animate-pulse">Loading Index...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-50 text-gray-800">
                <tr className="divide-x divide-gray-800">
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Code No From</th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Code No To</th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">Category</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-800 text-gray-900 font-bold">
                {categories.map((item, idx) => (
                  <tr key={idx} className="divide-x divide-gray-800 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-sm">{item.codeFrom}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm">{item.codeTo}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <button 
          onClick={logout}
          className="text-lg font-bold text-gray-800 hover:underline flex items-center"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
