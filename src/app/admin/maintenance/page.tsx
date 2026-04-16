'use client';

import Link from 'next/link';
import { Users, Database, UserPlus } from 'lucide-react';

export default function MaintenanceHome() {
  const sections = [
    { name: 'Membership', href: '/admin/maintenance/membership', icon: Users, description: 'Add/Update library members' },
    { name: 'Books/Movies', href: '/admin/maintenance/assets', icon: Database, description: 'Manage library inventory' },
    { name: 'Users', href: '/admin/maintenance/users', icon: UserPlus, description: 'Manage software user accounts' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
        <p className="text-gray-600">Administrative tools for system management.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.name}
            href={section.href}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow transition-shadow hover:shadow-md border border-gray-200"
          >
            <section.icon className="h-10 w-10 text-indigo-600 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">{section.name}</h2>
            <p className="text-sm text-gray-500 text-center mt-2">{section.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
