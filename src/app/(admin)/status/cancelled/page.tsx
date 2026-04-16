'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function TransactionCancelled() {
  const { logout } = useAuth();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-sans text-sm">
      <div className="border-2 border-black bg-white p-8 min-h-[400px] flex flex-col justify-between">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-start">
          <Link href="/admin/reports" className="font-bold underline">Chart</Link>
          <Link href="/admin" className="font-bold underline">Home</Link>
        </div>

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-black uppercase tracking-tight">
            Transaction cancelled
          </h1>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end">
          <button onClick={logout} className="font-bold underline uppercase text-xs">
            Log Out
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-1 text-xs font-bold text-gray-700">
        <p>Note: If logged in as Admin - home will take to Admin Home Page</p>
        <p>If logged in as user - home will take to User Home Page</p>
      </div>
    </div>
  );
}
