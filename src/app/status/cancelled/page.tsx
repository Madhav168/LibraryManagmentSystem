'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
  XCircle, 
  Home, 
  RotateCcw,
  AlertTriangle,
  History
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function CancelledContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isTransaction = searchParams.get('type') === 'transaction';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700">
      <Card className="max-w-xl w-full border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden bg-white rounded-[40px]">
        
        {/* Cinematic Header */}
        <div className="bg-red-50 p-12 flex flex-col items-center text-center border-b border-red-100">
          <div className="bg-white p-5 rounded-[24px] mb-8 shadow-xl shadow-red-200">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <Badge className="bg-red-500 text-white font-black uppercase tracking-[0.2em] text-[10px] py-1 px-4 mb-4 border-none">
            Operation Aborted
          </Badge>
          <h1 className="text-3xl font-black text-[#191716] uppercase tracking-tighter leading-none">
            {isTransaction ? 'Transaction Voided' : 'Protocol Terminated'}
          </h1>
          <p className="mt-4 text-[#191716]/40 text-sm font-bold uppercase tracking-widest px-8">
            The requested operation was cancelled by the user. No changes have been committed to the master database.
          </p>
        </div>

        <CardContent className="p-12 space-y-8">
          <div className="flex flex-col gap-4">
            <Button 
              asChild
              className="h-16 bg-[#191716] text-[#e0e2db] hover:bg-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300"
            >
              <Link href={user?.role === 'Admin' ? '/admin' : '/user'}>
                <Home className="mr-2 h-5 w-5" />
                Return to Dashboard
              </Link>
            </Button>
            
          </div>

          <div className="pt-8 border-t border-[#191716]/5 flex items-center justify-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#191716]/20">Rollback successful: system remains in stable state</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TransactionCancelled() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-black uppercase tracking-widest text-xs animate-pulse">Aborting Process...</div>}>
      <CancelledContent />
    </Suspense>
  );
}
