'use client';

import Link from 'next/link';

export default function LogoutSuccess() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-sans text-sm">
      <div className="border-2 border-black bg-white p-8 min-h-[400px] flex flex-col justify-between">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-start">
          <Link href="/reports" className="font-bold underline">Chart</Link>
          <Link href="/login" className="font-bold underline text-blue-600 hover:text-blue-800 uppercase trackers-wide">
            Login
          </Link>
        </div>

        {/* Centered Content */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-black uppercase tracking-tight text-center">
            You have successfully logged out.
          </h1>
        </div>

        {/* Footer Area (Empty as per slide) */}
        <div className="h-4"></div>
      </div>
    </div>
  );
}
