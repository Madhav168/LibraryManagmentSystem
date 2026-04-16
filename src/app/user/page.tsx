'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Library, BookOpenIcon, History, Search } from 'lucide-react';

export default function UserHomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok) setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const quickStats = [
    { name: 'Books Issued', value: '3', icon: BookOpenIcon },
    { name: 'Due Soon', value: '1', icon: History },
    { name: 'Available Catalog', value: '150+', icon: Search },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#191716] uppercase tracking-tight">User Dashboard</h1>
          <p className="text-[#191716]/60 font-medium">Hello, {user?.name}. Browse the collection or manage your borrowings.</p>
        </div>
        <Badge variant="outline" className="w-fit py-1 px-4 border-[#e6af2e] text-[#e6af2e] font-black uppercase tracking-widest text-xs">
          Member Status: Active
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickStats.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#191716]/40 mb-1">{stat.name}</p>
                  <p className="text-3xl font-black text-[#191716] leading-none">{stat.value}</p>
                </div>
                <div className="bg-[#e6af2e]/10 p-3 rounded-2xl group-hover:bg-[#e6af2e] transition-colors duration-300">
                  <stat.icon className="h-6 w-6 text-[#191716]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Details Table */}
      <Card className="border-none shadow-2xl overflow-hidden bg-white">
        <CardHeader className="bg-[#191716] text-[#e0e2db] py-8 px-10">
          <div className="flex items-center gap-4">
            <div className="bg-[#e6af2e] p-2 rounded-lg">
              <Library className="h-6 w-6 text-[#191716]" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Browse Catalog Index</CardTitle>
              <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">Reference codes for different library categories</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 space-y-4">
              <Skeleton className="h-12 w-full bg-[#191716]/5" />
              <Skeleton className="h-12 w-full bg-[#191716]/5" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#191716]/5">
                <TableRow className="hover:bg-transparent border-b-[#191716]/10">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 pl-10 h-14">Serial Range Start</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 h-14">Serial Range End</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 h-14 pr-10 text-right">Genre / Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-[#e6af2e]/5 transition-colors border-b-[#191716]/10 last:border-0">
                    <TableCell className="font-bold text-[#191716]/80 pl-10 h-16">{item.codeFrom}</TableCell>
                    <TableCell className="font-bold text-[#191716]/80 h-16">{item.codeTo}</TableCell>
                    <TableCell className="h-16 pr-10 text-right">
                      <Badge className="bg-[#e6af2e] text-[#191716] hover:bg-[#191716] px-4 py-1 rounded-full font-black text-[10px] uppercase">
                        {item.name}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
