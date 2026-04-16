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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, Save, XCircle } from 'lucide-react';
import MaintenanceSidebar from '@/components/MaintenanceSidebar';
import { CustomCombobox } from '@/components/Combobox';

function MembershipForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const [mode, setMode] = useState<'add' | 'update'>((searchParams.get('mode') as any) || 'add');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactName: '',
    contactAddress: '',
    aadhar: '',
    membershipType: '6 Months',
    membershipNumber: '',
    isRemoved: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [members, setMembers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'add' || qMode === 'update') {
      setMode(qMode);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (res.ok) setMembers(data);
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    const res = await fetch('/api/members', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { ...formData, id: formData.membershipNumber } : formData),
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
              <Users className="h-6 w-6 text-[#191716]" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">
                {mode === 'add' ? 'Add Membership' : 'Update Membership'}
              </CardTitle>
              <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">
                {mode === 'add' ? 'Add member details' : 'Update member details'}
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


          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mode === 'update' && (
                <div className="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Member Search & Selection</Label>
                  <CustomCombobox
                    items={members.map(m => ({
                      value: m.membershipNumber,
                      label: `${m.firstName} ${m.lastName}`,
                      subLabel: m.membershipNumber
                    }))}
                    value={formData.membershipNumber}
                    placeholder="Search member..."
                    onSelect={(val) => {
                      const match = members.find(m => m.membershipNumber === val);
                      if (match) {
                        setFormData({
                          ...formData,
                          membershipNumber: val,
                          firstName: match.firstName,
                          lastName: match.lastName,
                          startDate: new Date(match.startDate).toISOString().split('T')[0],
                          endDate: new Date(match.endDate || Date.now()).toISOString().split('T')[0],
                          membershipType: match.membershipType || '6 Months'
                        });
                      }
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">First Name</Label>
                <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Last Name</Label>
                <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Aadhar / Government ID</Label>
                <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Membership UID</Label>
                <Input 
                  required 
                  disabled={mode === 'update'}
                  className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e] disabled:opacity-50" 
                  value={formData.membershipNumber} 
                  onChange={e => setFormData({...formData, membershipNumber: e.target.value})} 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Physical Address</Label>
                <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.contactAddress} onChange={e => setFormData({...formData, contactAddress: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Start Date</Label>
                <Input type="date" required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">End Date</Label>
                <Input type="date" required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>

              <div className="md:col-span-2 space-y-4 pt-4 border-t border-[#191716]/5">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Membership Duration</Label>
                <RadioGroup 
                  value={formData.membershipType} 
                  onValueChange={(val) => setFormData({...formData, membershipType: val})}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6 Months" id="r1" className="h-5 w-5 border-2 border-[#191716]/20 text-[#e6af2e]" />
                    <Label htmlFor="r1" className="font-bold cursor-pointer">6 Months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1 Year" id="r2" className="h-5 w-5 border-2 border-[#191716]/20 text-[#e6af2e]" />
                    <Label htmlFor="r2" className="font-bold cursor-pointer">1 Year</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2 Years" id="r3" className="h-5 w-5 border-2 border-[#191716]/20 text-[#e6af2e]" />
                    <Label htmlFor="r3" className="font-bold cursor-pointer">2 Years</Label>
                  </div>
                </RadioGroup>
              </div>

              {mode === 'update' && (
                <div className="md:col-span-2 flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-100 mt-4">
                  <Checkbox 
                    id="remove" 
                    checked={formData.isRemoved} 
                    onCheckedChange={(val) => setFormData({...formData, isRemoved: val as boolean})}
                    className="h-5 w-5 border-red-400 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                  />
                  <Label htmlFor="remove" className="font-black uppercase tracking-widest text-[10px] text-red-600 cursor-pointer">Remove this member from active directory</Label>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-8 border-t border-[#191716]/5">
              <Button 
                type="submit" 
                className="flex-1 h-14 bg-[#191716] text-[#e6af2e] hover:bg-[#e6af2e] hover:text-[#191716] transition-all duration-300 font-black uppercase tracking-widest shadow-xl"
              >
                <Save className="mr-2 h-5 w-5" />
                {mode === 'add' ? 'Add' : 'Update'}
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="h-14 px-10 border-2 border-[#191716]/10 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300 font-bold uppercase tracking-widest"
              >
                <Link href="/status/cancelled">
                  <XCircle className="mr-2 h-5 w-5" />
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

export default function MembershipMaintenance() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center font-black uppercase tracking-widest text-xs animate-pulse">Initializing Interface...</div>}>
      <MembershipForm />
    </Suspense>
  );
}
