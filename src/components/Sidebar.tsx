'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { 
  Home, 
  FileText, 
  LogOut,
  ArrowRightLeft,
  Wrench,
  Library,
  ChevronDown,
  Users,
  BookOpen,
  UserCog
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false);

  useEffect(() => {
    if (pathname.startsWith('/admin/maintenance')) {
      setIsMaintenanceOpen(true);
    }
  }, [pathname]);

  if (!user) return null;

  const isAdmin = user.role === 'Admin';

  return (
    <div className="flex h-full w-72 flex-col bg-[#191716] text-[#e0e2db] shadow-2xl border-r border-[#e6af2e]/20 shrink-0">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3">
          <div className="bg-[#e6af2e] p-2 rounded-lg">
            <Library className="h-6 w-6 text-[#191716]" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest text-[#e6af2e]">Library</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">Management System</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-black uppercase tracking-widest text-[#e6af2e]/60 mb-4">Main Menu</p>
          
          <Link
            href={isAdmin ? '/admin' : '/user'}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 mb-1",
              pathname === (isAdmin ? '/admin' : '/user')
                ? "bg-[#e6af2e] text-[#191716]" 
                : "text-[#e0e2db]/70 hover:bg-[#e0e2db]/10 hover:text-[#e0e2db]"
            )}
          >
            <Home className={cn("h-5 w-5", pathname === (isAdmin ? '/admin' : '/user') ? "text-[#191716]" : "text-[#e6af2e]")} />
            Home
          </Link>

          {isAdmin && (
            <Collapsible
              open={isMaintenanceOpen}
              onOpenChange={setIsMaintenanceOpen}
              className="space-y-1"
            >
              <CollapsibleTrigger asChild>
                <div className={cn(
                  "group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 cursor-pointer",
                  pathname === '/admin/maintenance'
                    ? "bg-[#e6af2e] text-[#191716]" 
                    : "text-[#e0e2db]/70 hover:bg-[#e0e2db]/10 hover:text-[#e0e2db]"
                )}>
                  <Link href="/admin/maintenance" className="flex items-center gap-3 flex-1">
                    <Wrench className={cn("h-5 w-5", pathname === '/admin/maintenance' ? "text-[#191716]" : "text-[#e6af2e]")} />
                    Maintenance
                  </Link>
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isMaintenanceOpen ? "rotate-180" : "")} />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 px-2 pt-1 animate-in slide-in-from-top-2 duration-300">
                <Link
                  href="/admin/maintenance#membership"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-8 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all",
                    (pathname === '/admin/maintenance/membership' || (pathname === '/admin/maintenance' && typeof window !== 'undefined' && window.location.hash === '#membership')) ? "text-[#e6af2e]" : "text-[#e0e2db]/40 hover:text-[#e0e2db]/80"
                  )}
                >
                  <Users className="h-4 w-4" />
                  Membership
                </Link>
                <Link
                  href="/admin/maintenance#assets"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-8 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all",
                    (pathname === '/admin/maintenance/assets' || (pathname === '/admin/maintenance' && typeof window !== 'undefined' && window.location.hash === '#assets')) ? "text-[#e6af2e]" : "text-[#e0e2db]/40 hover:text-[#e0e2db]/80"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  Books/Movies
                </Link>
                <Link
                  href="/admin/maintenance#users"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-8 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all",
                    (pathname === '/admin/maintenance/users' || (pathname === '/admin/maintenance' && typeof window !== 'undefined' && window.location.hash === '#users')) ? "text-[#e6af2e]" : "text-[#e0e2db]/40 hover:text-[#e0e2db]/80"
                  )}
                >
                  <UserCog className="h-4 w-4" />
                  User Management
                </Link>
              </CollapsibleContent>
            </Collapsible>
          )}

          <Link
            href={isAdmin ? '/admin/reports' : '/user/reports'}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
              pathname.startsWith(isAdmin ? '/admin/reports' : '/user/reports')
                ? "bg-[#e6af2e] text-[#191716]" 
                : "text-[#e0e2db]/70 hover:bg-[#e0e2db]/10 hover:text-[#e0e2db]"
            )}
          >
            <FileText className={cn("h-5 w-5", pathname.includes('reports') ? "text-[#191716]" : "text-[#e6af2e]")} />
            Reports
          </Link>

          <Link
            href={isAdmin ? '/admin/transactions' : '/user/transactions'}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300",
              pathname.startsWith(isAdmin ? '/admin/transactions' : '/user/transactions')
                ? "bg-[#e6af2e] text-[#191716]" 
                : "text-[#e0e2db]/70 hover:bg-[#e0e2db]/10 hover:text-[#e0e2db]"
            )}
          >
            <ArrowRightLeft className={cn("h-5 w-5", pathname.includes('transactions') ? "text-[#191716]" : "text-[#e6af2e]")} />
            Transactions
          </Link>
        </nav>
      </div>

      <div className="p-6 bg-[#121110] border-t border-[#e6af2e]/10">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="h-10 w-10 rounded-full bg-[#e6af2e]/10 border border-[#e6af2e]/30 flex items-center justify-center font-black text-[#e6af2e]">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-[10px] uppercase tracking-wider text-[#e6af2e] font-black">{user.role}</p>
          </div>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold">Log Out</span>
        </Button>
      </div>
    </div>
  );
}
