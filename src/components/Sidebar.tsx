'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Home, 
  Settings, 
  BookOpen, 
  FileText, 
  LogOut,
  Users,
  Database,
  Search,
  ArrowRightLeft,
  Wrench
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isAdmin = user.role === 'Admin';

  const menuItems = [
    { name: 'Home', href: isAdmin ? '/admin' : '/user', icon: Home },
    ...(isAdmin ? [
      { name: 'Maintenance', href: '/admin/maintenance', icon: Wrench, roles: ['Admin'] },
    ] : []),
    { name: 'Transactions', href: isAdmin ? '/admin/transactions' : '/user/transactions', icon: ArrowRightLeft },
    { name: 'Reports', href: isAdmin ? '/admin/reports' : '/user/reports', icon: FileText },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h2 className="text-xl font-bold">Library MS</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-600 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-gray-800 p-4">
        <div className="mb-4 text-xs text-gray-400">
          Logged in as: <span className="text-gray-200">{user.name} ({user.role})</span>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
