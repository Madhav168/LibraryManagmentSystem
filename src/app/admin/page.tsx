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
import { Library, LayoutDashboard, Database, FileText, ArrowRightLeft } from 'lucide-react';

export default function AdminHomePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalAssets: '0',
    activeUsers: '0',
    dueToday: '0',
    totalIssues: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, statsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/admin/stats')
        ]);
        
        const catData = await catRes.json();
        const statsData = await statsRes.json();
        
        if (catRes.ok) setCategories(catData);
        if (statsRes.ok) setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statConfig = [
    { name: 'Total Assets', value: stats.totalAssets, icon: Database },
    { name: 'Active Users', value: stats.activeUsers, icon: LayoutDashboard },
    { name: 'Due Today', value: stats.dueToday, icon: FileText },
    { name: 'Total Issues', value: stats.totalIssues, icon: ArrowRightLeft },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#191716] uppercase tracking-tight">Admin Home Page</h1>
          <p className="text-[#191716]/60 font-medium">Welcome back, {user?.name}. Here is what's happening today.</p>
        </div>
        <Badge variant="outline" className="w-fit py-1 px-4 border-[#e6af2e] text-[#e6af2e] font-black uppercase tracking-widest text-xs">
          Live System Status
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statConfig.map((stat, i) => (
          <Card key={i} className="border-none shadow-xl bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#191716]/40 mb-1">{stat.name}</p>
                  <p className="text-3xl font-black text-[#191716] leading-none">
                    {loading ? "..." : stat.value}
                  </p>
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
      <Card className="border-none shadow-2xl overflow-hidden bg-white p-0">
        <CardHeader className="bg-[#191716] text-[#e0e2db] py-8 px-10 m-0 rounded-none">
          <div className="flex items-center gap-4">
            <div className="bg-[#e6af2e] p-2 rounded-lg">
              <Library className="h-6 w-6 text-[#191716]" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Product Details</CardTitle>
              <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">Asset classification and coding reference</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 space-y-4">
              <div className="h-12 w-full bg-[#191716]/5 rounded animate-pulse" />
              <div className="h-12 w-full bg-[#191716]/5 rounded animate-pulse" />
              <div className="h-12 w-full bg-[#191716]/5 rounded animate-pulse" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-[#191716]/5">
                <TableRow className="hover:bg-transparent border-b-[#191716]/10">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 pl-10 h-14">Code No From</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 h-14">Code No To</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 h-14 pr-10 text-right">Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-[#e6af2e]/5 transition-colors border-b-[#191716]/10 last:border-0 group">
                    <TableCell className="font-bold text-[#191716]/80 pl-10 h-16">{item.codeFrom}</TableCell>
                    <TableCell className="font-bold text-[#191716]/80 h-16">{item.codeTo}</TableCell>
                    <TableCell className="h-16 pr-10 text-right">
                      <Badge className="bg-[#191716] text-[#e6af2e] hover:bg-[#191716] px-4 py-1 rounded-full font-black text-[10px] uppercase">
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
