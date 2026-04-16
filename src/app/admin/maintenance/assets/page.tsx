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
import { Badge } from "@/components/ui/badge";
import { BookOpen, Save, XCircle } from 'lucide-react';
import MaintenanceSidebar from '@/components/MaintenanceSidebar';
import { CustomCombobox } from '@/components/Combobox';

function AssetsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const [mode, setMode] = useState<'add' | 'update'>((searchParams.get('mode') as any) || 'add');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    serialNo: '',
    status: 'Available',
    type: 'Book',
    date: new Date().toISOString().split('T')[0],
  });
  const [assets, setAssets] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'add' || qMode === 'update') setMode(qMode);
  }, [searchParams]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch('/api/assets');
      const data = await res.json();
      if (res.ok) setAssets(data);
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    const res = await fetch('/api/assets', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { ...formData, id: formData.serialNo } : formData),
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
              <BookOpen className="h-6 w-6 text-[#191716]" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">
                {mode === 'add' ? 'Add Asset' : 'Update Asset'}
              </CardTitle>
              <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">
                {mode === 'add' ? 'Add a new book or movie' : 'Modify asset details'}
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
            <div className="p-6 bg-[#f0f2ef] rounded-2xl space-y-4">
              <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Asset Category</Label>
              <RadioGroup 
                value={formData.type} 
                onValueChange={(val) => setFormData({...formData, type: val as any})}
                className="flex gap-10"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Book" id="book" className="h-6 w-6 border-2 border-[#191716]/20 text-[#e6af2e]" />
                  <Label htmlFor="book" className="text-lg font-black tracking-tight cursor-pointer">Book</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Movie" id="movie" className="h-6 w-6 border-2 border-[#191716]/20 text-[#e6af2e]" />
                  <Label htmlFor="movie" className="text-lg font-black tracking-tight cursor-pointer">Movie</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mode === 'update' && (
                <div className="md:col-span-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Locate Asset in Catalog</Label>
                  <CustomCombobox
                    items={assets.map(a => ({
                      value: a.title,
                      label: a.title,
                      subLabel: a.author
                    }))}
                    value={formData.title}
                    placeholder="Search by title..."
                    onSelect={(val) => {
                      const match = assets.find(a => a.title === val);
                      if (match) {
                        setFormData({
                          ...formData,
                          title: val,
                          author: match.author,
                          serialNo: match.serialNo,
                          status: match.status || 'Available',
                          type: match.type || 'Book',
                          date: new Date(match.date || Date.now()).toISOString().split('T')[0]
                        });
                      }
                    }}
                  />
                </div>
              )}

              <div className="md:col-span-2 space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Resource Title</Label>
                <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-14 font-bold text-lg focus-visible:ring-[#e6af2e]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Inception" />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Primary Creator (Author/Director)</Label>
                <Input required className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e]" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Catalog Serial Number (UID)</Label>
                <Input 
                  required 
                  disabled={mode === 'update'}
                  className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e] disabled:opacity-50" 
                  value={formData.serialNo} 
                  onChange={e => setFormData({...formData, serialNo: e.target.value})} 
                  placeholder="SN-000000" 
                />
              </div>

              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Current Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val || 'Available'})}>
                  <SelectTrigger className="bg-[#e0e2db]/20 border-none h-12 font-bold focus:ring-[#e6af2e]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#191716]/10 font-bold">
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Unavailable">Unavailable</SelectItem>
                    <SelectItem value="Removed">Removed</SelectItem>
                    <SelectItem value="On Repair">On Repair</SelectItem>
                    <SelectItem value="To Replace">To Replace</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                    <SelectItem value="Damaged">Damaged</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Reference Date</Label>
                <Input type="date" required className="bg-[#e0e2db]/20 border-none h-12 font-bold" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
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

export default function AssetsMaintenance() {
  return (
    <Suspense fallback={<div className="flex h-96 items-center justify-center font-black uppercase tracking-widest text-xs animate-pulse">Synchronizing Catalog...</div>}>
      <AssetsForm />
    </Suspense>
  );
}
