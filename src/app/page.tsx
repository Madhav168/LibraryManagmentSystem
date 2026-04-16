'use client';

import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Library, LogIn, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);
    if (!success) {
      setError('Invalid User ID or Password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen lg:h-screen w-screen flex flex-col lg:flex-row font-sans bg-[#f0f2ef] lg:overflow-hidden relative">
      
      {/* Signature */}
      <div className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 z-50 pointer-events-none">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#191716]/30">made by Pampana Sai Madhav</p>
      </div>

      {/* Left Part: Branding Section */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full bg-[#191716] p-8 lg:p-16 flex flex-col justify-between text-[#e0e2db] relative overflow-hidden shrink-0">
        {/* Background Decor */}
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-[#e6af2e]/5 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 mb-8 lg:mb-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#e6af2e] p-2.5 rounded-xl">
              <Library className="h-6 w-6 text-[#191716]" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-[#e6af2e]">Library</h2>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">Management System</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-12 lg:my-auto">
          <h1 className="text-4xl lg:text-6xl font-black leading-[0.9] uppercase tracking-tighter">
            Library <br />
            <span className="text-[#e6af2e]">Management</span> <br />
            System.
          </h1>
          <p className="text-[#e0e2db]/60 font-medium text-lg max-w-sm leading-relaxed">
            A comprehensive solution to manage library resources, members, and transactions efficiently.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-[#e0e2db]/10 text-[#e0e2db] border-none font-bold uppercase tracking-widest text-[9px] py-1.5 px-4 rounded-full">Standard</Badge>
            <Badge className="bg-[#e0e2db]/10 text-[#e0e2db] border-none font-bold uppercase tracking-widest text-[9px] py-1.5 px-4 rounded-full">Secure</Badge>
            <Badge className="bg-[#e6af2e] text-[#191716] border-none font-bold uppercase tracking-widest text-[9px] py-1.5 px-4 rounded-full">Production</Badge>
          </div>
        </div>

        <div className="relative z-10 text-[10px] font-black uppercase tracking-widest text-[#e0e2db]/30 mt-8 lg:mt-0">
          Library Management System &copy; 2026
        </div>
      </div>

      {/* Right Part: Login Card Content Area */}
      <div className="w-full lg:w-1/2 min-h-[60vh] lg:h-full flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-white/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e0e2db]/30 to-[#f0f2ef]"></div>
        
        <Card className="w-full max-w-sm border-none shadow-[0_32px_64px_-16px_rgba(25,23,22,0.1)] bg-white/90 backdrop-blur-xl rounded-[40px] overflow-hidden relative z-10">
          <CardContent className="p-8 lg:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-[#191716] uppercase tracking-tight mb-2">Login</h2>
              <p className="text-[#191716]/50 font-medium text-xs">Enter your credentials to access the system.</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-6 border border-red-100">
                <ShieldAlert className="h-5 w-5" />
                <p className="font-bold text-[10px] uppercase tracking-widest leading-none">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[9px] text-[#191716]/60 ml-2">User ID</Label>
                <Input
                  type="text"
                  required
                  className="h-14 bg-[#191716]/5 border-none rounded-2xl px-5 font-bold text-[#191716] placeholder:text-[#191716]/30 focus-visible:ring-[#e6af2e] text-base"
                  placeholder="Enter User ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[9px] text-[#191716]/60 ml-2">Password</Label>
                <Input
                  type="password"
                  required
                  className="h-14 bg-[#191716]/5 border-none rounded-2xl px-5 font-bold text-[#191716] placeholder:text-[#191716]/30 focus-visible:ring-[#e6af2e] text-base"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button
                  type="button"
                  onClick={() => {
                    setUsername('');
                    setPassword('');
                    setError('');
                  }}
                  variant="outline"
                  className="flex-1 h-16 border-2 border-[#191716]/10 rounded-[24px] font-black uppercase tracking-widest text-base hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-[1.5] h-16 bg-[#191716] text-[#e6af2e] hover:bg-[#e6af2e] hover:text-[#191716] transition-all duration-300 rounded-[24px] font-black uppercase tracking-widest text-base shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#e6af2e] border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    <span>Login</span>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-12 flex items-center gap-4 opacity-10">
              <div className="flex-1 h-[2px] bg-[#191716]"></div>
              <p className="text-[9px] font-black uppercase tracking-widest">Secure</p>
              <div className="flex-1 h-[2px] bg-[#191716]"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
