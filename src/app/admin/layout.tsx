'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Search, Settings, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'Admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading || !user || user.role !== 'Admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#e0e2db]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e6af2e] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-widest text-xs text-[#191716]/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f0f2ef] font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-[#191716]/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-[101] lg:relative lg:block transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Navbar */}
        <header className="h-20 lg:h-24 bg-white/50 backdrop-blur-md border-b border-[#191716]/5 flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden rounded-full hover:bg-white/50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-[#191716]" />
            </Button>
            
            <div className="relative w-40 sm:w-64 lg:w-96 group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#191716]/30 group-focus-within:text-[#e6af2e] transition-colors" />
              <Input 
                placeholder="Search..." 
                className="pl-10 bg-white/50 border-none shadow-inner focus-visible:ring-[#e6af2e] font-medium h-10 lg:h-12"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50 h-10 w-10">
                <Bell className="h-5 w-5 text-[#191716]/60" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50 h-10 w-10">
                <Settings className="h-5 w-5 text-[#191716]/60" />
              </Button>
              <div className="h-8 w-[1px] bg-[#191716]/10 mx-2"></div>
            </div>
            
            <div className="text-right">
              <p className="text-[12px] lg:text-sm font-black text-[#191716] leading-none mb-1 uppercase tracking-tight truncate max-w-[100px]">{user.name}</p>
              <p className="text-[9px] lg:text-[10px] font-black text-[#e6af2e] uppercase tracking-widest leading-none">Admin</p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
