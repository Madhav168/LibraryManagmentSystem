'use client';

import Link from 'next/link';
import { ArrowRightLeft, FileText, Search, BookOpen } from 'lucide-react';

export default function UserHome() {
  const modules = [
    { name: 'Transactions', description: 'Search, issue, and return books/movies', href: '/user/transactions', icon: ArrowRightLeft, color: 'bg-green-500' },
    { name: 'Reports', description: 'View your reports and library master lists', href: '/user/reports', icon: FileText, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
        <p className="text-gray-600">Welcome to the Library Management System.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {modules.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group relative flex flex-col items-center overflow-hidden rounded-lg bg-white p-8 shadow transition-all hover:shadow-lg"
          >
            <div className={`rounded-full p-4 text-white ${item.color} mb-4`}>
              <item.icon className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
            <p className="mt-2 text-center text-sm text-gray-500">{item.description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-gray-50 border border-gray-200 border-dashed p-10 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Need help?</h3>
        <p className="mt-1 text-sm text-gray-500">Contact the administrator for maintenance requests or user account issues.</p>
      </div>
    </div>
  );
}
