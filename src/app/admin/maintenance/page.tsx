'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Housekeeping() {
  const { logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const menuItems = [
    { label: 'Membership', slug: 'membership' },
    { label: 'Books/Movies', slug: 'assets' },
    { label: 'User Management', slug: 'users' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="border-2 border-black bg-white p-4 min-h-[450px] relative">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-0 px-2 font-bold select-none text-sm">
          <span className="hover:underline cursor-pointer">Chart</span>
          <span className="text-xl px-24 invisible">Housekeeping</span>
          <Link href="/admin" className="hover:underline">Home</Link>
        </div>

        {/* Header Label */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black inline-block border-2 border-t-0 border-black px-16 py-2 uppercase">
            Housekeeping
          </h1>
        </div>

        {/* Selection Table */}
        <div className="mt-8">
          <table className="w-full border-collapse">
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.label} className="h-16">
                  {/* Category Label */}
                  <td className="w-1/2 p-2 align-top">
                    <button 
                      onClick={() => setSelectedCategory(selectedCategory === item.label ? null : item.label)}
                      className={`text-xl font-bold hover:underline ${selectedCategory === item.label ? 'text-blue-700' : 'text-black'}`}
                    >
                      {item.label}
                    </button>
                  </td>
                  
                  {/* Selection Options (Only shown after click) */}
                  <td className="w-1/2 p-2 align-top border-l border-black">
                    {selectedCategory === item.label && (
                      <div className="flex flex-col space-y-1 font-bold text-lg">
                        <Link 
                          href={`/admin/maintenance/${item.slug}?mode=add`}
                          className="hover:underline text-black hover:text-blue-600"
                        >
                          Add
                        </Link>
                        <Link 
                          href={`/admin/maintenance/${item.slug}?mode=update`}
                          className="hover:underline text-black hover:text-blue-600"
                        >
                          Update
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Navigation */}
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={logout}
            className="text-xl font-bold text-black border-b-2 border-black hover:text-blue-700"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
