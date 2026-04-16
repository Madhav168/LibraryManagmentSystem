'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserCog, Save, XCircle, ShieldCheck } from 'lucide-react';
import MaintenanceSidebar from '@/components/MaintenanceSidebar';
import { CustomCombobox } from '@/components/Combobox';

function UsersForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const [mode, setMode] = useState<'add' | 'update'>((searchParams.get('mode') as any) || 'add');
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    username: '',
    isAdmin: false,
    isActive: true,
    password: '',
  });
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'add' || qMode === 'update') setMode(qMode);
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    const payload = {
      id: isUpdate ? formData._id : undefined,
      name: formData.name,
      username: formData.username,
      password: formData.password || undefined,
      role: formData.isAdmin ? 'Admin' : 'User',
      isActive: formData.isActive
    };

    const res = await fetch('/api/users', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/status/success');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to save');
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <Card className="w-full border-none shadow-2xl bg-white overflow-hidden pt-0">
        <div className="p-8 bg-[#191716] text-[#e0e2db]">
          <div className="flex items-center gap-4">
            <div className="bg-[#e6af2e] p-2 rounded-xl">
              <UserCog className="h-6 w-6 text-[#191716]" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">
                User Management
              </CardTitle>
              <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">
                Administrative Identity Module
              </CardDescription>
            </div>
          </div>
        </div>
        
        <CardContent className="p-10">
          {message && (
            <Badge variant="destructive" className="w-full py-2 mb-6 justify-center font-bold">
              {message}
            </Badge>
          )}

          <div className="mb-10 p-6 bg-[#f0f2ef] rounded-2xl border border-[#191716]/5">
            <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 mb-4 block">Identity Protocol</Label>
            <RadioGroup 
              value={mode} 
              onValueChange={(val) => setMode(val as 'add' | 'update')}
              className="flex gap-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add" id="mode-add" className="h-5 w-5 border-2 border-[#191716]/20 text-[#e6af2e]" />
                <Label htmlFor="mode-add" className="font-bold cursor-pointer text-sm">New User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="update" id="mode-update" className="h-5 w-5 border-2 border-[#191716]/20 text-[#e6af2e]" />
                <Label htmlFor="mode-update" className="font-bold cursor-pointer text-sm">Existing User</Label>
              </div>
            </RadioGroup>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {mode === 'update' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Select User Account</Label>
                  <CustomCombobox
                    items={users.map(u => ({
                      value: u._id,
                      label: u.name,
                      subLabel: u.username
                    }))}
                    value={formData._id}
                    placeholder="Search by name..."
                    onSelect={(val) => {
                      const match = users.find(u => u._id === val);
                      if (match) {
                        setFormData({
                          ...formData,
                          _id: match._id,
                          username: match.username || '',
                          name: match.name,
                          isAdmin: match.role === 'Admin',
                          isActive: match.isActive !== false,
                          password: '', 
                        });
                      }
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">User Name</Label>
                <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>

              {mode === 'add' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                  <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">System ID / Username</Label>
                  <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="johndoe123" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-[#191716]/5">
                <div className="flex items-center space-x-3 p-4 bg-[#f0f2ef] rounded-2xl border border-[#191716]/5">
                  <Checkbox 
                    id="active-status"
                    checked={formData.isActive}
                    onCheckedChange={(val) => setFormData({...formData, isActive: val as boolean})}
                    className="h-6 w-6 border-2 border-[#191716]/20 data-[state=checked]:bg-[#e6af2e] data-[state=checked]:border-[#e6af2e]"
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="active-status" className="font-black uppercase tracking-widest text-[10px] text-[#191716] cursor-pointer">Active Status</Label>
                    <p className="text-[9px] font-bold text-[#191716]/40 uppercase tracking-tighter">Enable System Access</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-[#f0f2ef] rounded-2xl border border-[#191716]/5">
                  <Checkbox 
                    id="admin-status"
                    checked={formData.isAdmin}
                    onCheckedChange={(val) => setFormData({...formData, isAdmin: val as boolean})}
                    className="h-6 w-6 border-2 border-[#191716]/20 data-[state=checked]:bg-[#e6af2e] data-[state=checked]:border-[#e6af2e]"
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor="admin-status" className="font-black uppercase tracking-widest text-[10px] text-[#191716] cursor-pointer">Admin Rights</Label>
                    <p className="text-[9px] font-bold text-[#191716]/40 uppercase tracking-tighter">Grant Maintenance Power</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-[#191716]/5">
              <Button 
                type="submit" 
                className="flex-1 h-16 bg-[#191716] text-[#e6af2e] hover:bg-[#e6af2e] hover:text-[#191716] transition-all duration-300 font-black uppercase tracking-widest shadow-2xl"
              >
                <Save className="mr-2 h-6 w-6" />
                {mode === 'add' ? 'Add' : 'Update'}
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="h-16 px-10 border-2 border-[#191716]/10 hover:bg-black hover:text-white transition-all duration-300 font-bold uppercase tracking-widest"
              >
                <Link href="/status/cancelled">
                  <XCircle className="mr-2 h-6 w-6" />
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UsersMaintenance() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center font-black uppercase tracking-widest text-xs animate-pulse">Initializing Identity Module...</div>}>
      <UsersForm />
    </Suspense>
  );
}
