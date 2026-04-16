'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Users, 
  BookOpen, 
  UserCog,
  PlusCircle,
  PencilLine
} from 'lucide-react';

interface SidebarItemProps {
  label: string;
  slug: string;
  currentSlug: string;
  currentMode: string;
}

const SidebarItem = ({ label, slug, currentSlug, currentMode }: SidebarItemProps) => {
  const isCurrent = slug === currentSlug;
  const Icon = slug === 'membership' ? Users : slug === 'assets' ? BookOpen : UserCog;

  return (
    <div className="space-y-1">
      <div className={cn(
        "flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
        isCurrent ? "text-[#e6af2e]" : "text-[#191716]/40"
      )}>
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="pl-4 space-y-1">
        <Link
          href={`/admin/maintenance/${slug}?mode=add`}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all",
            isCurrent && currentMode === 'add'
              ? "bg-[#e6af2e] text-[#191716] shadow-lg shadow-[#e6af2e]/20"
              : "text-[#191716]/60 hover:bg-[#191716]/5 hover:text-[#191716]"
          )}
        >
          <PlusCircle className="h-3 w-3" />
          Add New
        </Link>
        <Link
          href={`/admin/maintenance/${slug}?mode=update`}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all",
            isCurrent && currentMode === 'update'
              ? "bg-[#e6af2e] text-[#191716] shadow-lg shadow-[#e6af2e]/20"
              : "text-[#191716]/60 hover:bg-[#191716]/5 hover:text-[#191716]"
          )}
        >
          <PencilLine className="h-3 w-3" />
          Update Existing
        </Link>
      </div>
    </div>
  );
};

export default function MaintenanceSidebar({ currentSlug }: { currentSlug: string }) {
  const searchParams = useSearchParams();
  const currentMode = searchParams.get('mode') || 'add';

  return (
    <div className="w-64 bg-white/50 backdrop-blur-sm rounded-3xl p-6 h-fit sticky top-10 border border-[#191716]/5 space-y-8 shadow-xl">
      <div className="px-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#191716]/40 mb-1">Navigation</p>
        <h3 className="text-sm font-black uppercase tracking-tight text-[#191716]">Module Selection</h3>
      </div>
      
      <div className="space-y-6">
        <SidebarItem label="Membership" slug="membership" currentSlug={currentSlug} currentMode={currentMode} />
        <SidebarItem label="Assets" slug="assets" currentSlug={currentSlug} currentMode={currentMode} />
        <SidebarItem label="Users" slug="users" currentSlug={currentSlug} currentMode={currentMode} />
      </div>
    </div>
  );
}
