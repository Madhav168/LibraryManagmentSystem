'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
  CheckCircle2, 
  Home, 
  LogOut, 
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function SuccessContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const isTransaction = searchParams.get('type') === 'transaction';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700">
      <Card className="max-w-xl w-full border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden bg-white rounded-[40px]">
        
        {/* Cinematic Header */}
        <div className="bg-[#191716] p-12 flex flex-col items-center text-center">
          <div className="bg-[#e6af2e] p-5 rounded-[24px] mb-8 shadow-2xl shadow-[#e6af2e]/20 animate-bounce">
            <CheckCircle2 className="h-10 w-10 text-[#191716]" />
          </div>
          <Badge className="bg-[#e6af2e] text-[#191716] font-black uppercase tracking-[0.2em] text-[10px] py-1 px-4 mb-4 border-none">
            Operation Verified
          </Badge>
          <h1 className="text-3xl font-black text-[#e0e2db] uppercase tracking-tighter leading-none">
            {isTransaction ? 'Transaction Authorized' : 'Protocol Executed'}
          </h1>
          <p className="mt-4 text-[#e0e2db]/40 text-sm font-bold uppercase tracking-widest px-8">
            The database state has been successfully modified and validated by the primary control server.
          </p>
        </div>

        <CardContent className="p-12 space-y-8">
          <div className="flex flex-col gap-4">
            <Button 
              asChild
              className="h-16 bg-[#191716] text-[#e6af2e] hover:bg-[#e6af2e] hover:text-[#191716] rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all duration-300"
            >
              <Link href={user?.role === 'Admin' ? '/admin' : '/user'}>
                <Home className="mr-2 h-5 w-5" />
                Return to Dashboard
              </Link>
            </Button>
            
          </div>

          <div className="pt-8 border-t border-[#191716]/5 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#e6af2e]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#191716]/20">End-to-End Encrypted Handshake Complete</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TransactionSuccess() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-black uppercase tracking-widest text-xs animate-pulse">Confirming Verification...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
