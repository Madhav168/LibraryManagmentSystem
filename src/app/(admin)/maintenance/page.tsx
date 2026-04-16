'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Housekeeping() {
  const { logout } = useAuth();

  const menuItems = [
    { label: 'Membership', add: '/admin/maintenance/membership', update: '/admin/maintenance/membership' },
    { label: 'Books/Movies', add: '/admin/maintenance/assets', update: '/admin/maintenance/assets' },
    { label: 'User Management', add: '/admin/maintenance/users', update: '/admin/maintenance/users' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <div className="border-4 border-gray-900 bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] p-8">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8 font-bold text-lg">
          <span className="hover:underline cursor-pointer">Chart</span>
          <Link href="/admin" className="hover:underline">Home</Link>
        </div>

        {/* Centered Heading */}
        <h1 className="text-3xl font-black text-center mb-10 decoration-4 underline underline-offset-8">
          Housekeeping
        </h1>

        {/* Menu Grid */}
        <div className="space-y-6">
          {menuItems.map((item) => (
            <div key={item.label} className="grid grid-cols-2 items-center border-b-2 border-gray-100 pb-4">
              <span className="text-xl font-bold text-gray-800">{item.label}</span>
              <div className="flex space-x-8 text-lg font-bold">
                <Link href={item.add} className="text-gray-900 hover:text-blue-600 hover:underline">
                  Add
                </Link>
                <Link href={item.update} className="text-gray-900 hover:text-blue-600 hover:underline">
                  Update
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-end mt-12">
          <button 
            onClick={logout}
            className="text-lg font-bold text-gray-900 hover:underline"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
