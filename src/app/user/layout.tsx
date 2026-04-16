'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#e0e2db]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e6af2e] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black uppercase tracking-widest text-xs text-[#191716]/60">Connecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#e0e2db] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-24 bg-white/30 backdrop-blur-md border-b border-[#191716]/5 flex items-center justify-between px-10 shrink-0">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#191716]/30" />
            <Input 
              placeholder="Search assets, transactions..." 
              className="pl-10 bg-white/50 border-none shadow-inner focus-visible:ring-[#e6af2e] font-medium"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50">
              <Bell className="h-5 w-5 text-[#191716]/60" />
            </Button>
            <div className="h-8 w-[1px] bg-[#191716]/10 mx-2"></div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-[#191716] leading-none mb-1 uppercase tracking-tight">{user.name}</p>
              <p className="text-[10px] font-black text-[#e6af2e] uppercase tracking-widest leading-none">Standard User</p>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
