'use client';

import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Users, BookOpen, UserCog, ChevronRight } from 'lucide-react';

export default function MaintenancePage() {
  const menuItems = [
    { 
      label: 'Membership', 
      description: 'Add or update library member profiles and subscriptions.',
      slug: 'membership',
      id: 'membership',
      icon: Users,
    },
    { 
      label: 'Books/Movies', 
      description: 'Manage books, movies and digital resources in the catalog.',
      slug: 'assets',
      id: 'assets',
      icon: BookOpen,
    },
    { 
      label: 'User Management', 
      description: 'Administrative control over staff and system access levels.',
      slug: 'users',
      id: 'users',
      icon: UserCog,
    },
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-[#191716] uppercase tracking-tight">Maintenance</h1>
        <p className="text-[#191716]/60 font-medium">System maintenance and data management modules.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item, i) => (
          <Card key={i} id={item.id} className="group border-none shadow-xl bg-white overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col scale-100 hover:scale-[1.02] scroll-mt-32 pt-0">
            <div className="p-8 bg-[#191716] text-[#e0e2db]">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-[#e6af2e] p-3 rounded-2xl">
                  <item.icon className="h-6 w-6 text-[#191716]" />
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#e6af2e]">
                  0{i + 1}
                </div>
              </div>
              <CardTitle className="text-2xl font-black uppercase tracking-tight group-hover:text-[#e6af2e] transition-colors">{item.label}</CardTitle>
                <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">Data Protocol</CardDescription>
            </div>
            <CardContent className="p-8 flex-1 flex flex-col justify-end space-y-4">
              <Link 
                href={`/admin/maintenance/${item.slug}?mode=add`}
                className="flex items-center justify-between p-5 bg-[#e6af2e] text-[#191716] rounded-2xl hover:bg-white hover:text-black hover:border-black border border-transparent transition-all duration-300 font-black uppercase tracking-widest text-xs group/link shadow-lg shadow-[#e6af2e]/10"
              >
                <span>Add Record</span>
                <ChevronRight className="h-5 w-5 opacity-40 group-hover/link:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href={`/admin/maintenance/${item.slug}?mode=update`}
                className="flex items-center justify-between p-5 bg-[#191716] text-[#e0e2db] rounded-2xl hover:bg-[#191716]/90 transition-all duration-300 font-black uppercase tracking-widest text-xs group/link shadow-lg shadow-[#191716]/20"
              >
                <span>Update Existing</span>
                <ChevronRight className="h-5 w-5 opacity-40 group-hover/link:opacity-100 transition-opacity" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
