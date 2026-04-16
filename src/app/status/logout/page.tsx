'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LogoutSuccess() {
  const { completeLogout } = useAuth();

  useEffect(() => {
    // Clear user state only after we've successfully landed on this page
    completeLogout();
  }, [completeLogout]);
  return (
    <div className="min-h-screen bg-[#191716] flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="max-w-xl w-full">
        <div className="bg-white border-none shadow-2xl rounded-[40px] overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-[#191716] p-12 flex flex-col items-center text-center">
            <div className="bg-[#e6af2e] p-5 rounded-[24px] mb-8 shadow-2xl shadow-[#e6af2e]/20">
              <svg className="w-10 h-10 text-[#191716]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <div className="bg-[#e6af2e] text-[#191716] font-black uppercase tracking-[0.2em] text-[10px] py-1 px-4 mb-4 rounded-full">
              Session Closed
            </div>
            <h1 className="text-3xl font-black text-[#e0e2db] uppercase tracking-tighter leading-none">
              Logout Successful
            </h1>
            <p className="mt-4 text-[#e0e2db]/40 text-sm font-bold uppercase tracking-widest px-8 max-w-sm">
              Your security session has been safely terminated and local cache cleared.
            </p>
          </div>

          <div className="p-12 space-y-8">
            <Link 
              href="/" 
              className="flex items-center justify-center h-16 bg-[#191716] text-[#e6af2e] hover:bg-[#e6af2e] hover:text-[#191716] rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300"
            >
              Return to Login
            </Link>

            <div className="pt-8 border-t border-[#191716]/5 flex items-center justify-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
               <svg className="h-4 w-4 text-[#e6af2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
               <p className="text-[10px] font-black uppercase tracking-widest text-[#191716]">Encrypted Session Termination Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
