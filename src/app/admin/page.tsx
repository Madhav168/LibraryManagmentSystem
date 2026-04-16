'use client';

import Link from 'next/link';
import { Settings, ArrowRightLeft, FileText, Users, Database } from 'lucide-react';

export default function AdminHome() {
  const stats = [
    { name: 'Maintenance', description: 'Manage members, assets, and users', href: '/admin/maintenance', icon: Settings, color: 'bg-blue-500' },
    { name: 'Transactions', description: 'Issue and return books/movies', href: '/admin/transactions', icon: ArrowRightLeft, color: 'bg-green-500' },
    { name: 'Reports', description: 'View system reports and master lists', href: '/admin/reports', icon: FileText, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the Library Management System administration area.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group relative flex flex-col items-center overflow-hidden rounded-lg bg-white p-6 shadow transition-all hover:shadow-lg"
          >
            <div className={`rounded-full p-3 text-white ${item.color} mb-4`}>
              <item.icon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="mt-2 text-center text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/maintenance/members" className="flex items-center text-sm text-indigo-600 hover:text-indigo-500">
            <Users className="mr-1 h-4 w-4" /> Manage Members
          </Link>
          <Link href="/admin/maintenance/assets" className="flex items-center text-sm text-indigo-600 hover:text-indigo-500">
            <Database className="mr-1 h-4 w-4" /> Manage Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
