'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface ComboboxProps {
  items: { value: string; label: string; subLabel?: string }[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomCombobox({ items, value, onSelect, placeholder, className }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredItems = items.filter((item) => {
    const s = search.toLowerCase();
    const l = (item.label || '').toLowerCase();
    const v = (item.value || '').toLowerCase();
    const sub = (item.subLabel || '').toLowerCase();
    return l.includes(s) || v.includes(s) || sub.includes(s);
  });

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
      <div className="relative group">
        <Input
          className="bg-[#e0e2db]/20 border border-[#191716]/10 h-12 font-bold focus-visible:ring-[#e6af2e] pr-10"
          placeholder={placeholder}
          value={open ? search : (items.find(i => i.value === value)?.label || value)}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setSearch('');
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#191716]/30">
          <ChevronsUpDown className="h-4 w-4" />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#191716]/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="max-h-[300px] overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold uppercase tracking-widest text-[#191716]/40">
                No results found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredItems.map((item, idx) => (
                  <button
                    key={`${item.value}-${idx}`}
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left",
                      value === item.value 
                        ? "bg-[#e6af2e] text-[#191716]" 
                        : "hover:bg-[#191716]/5 text-[#191716]"
                    )}
                    onClick={() => {
                      onSelect(item.value);
                      setOpen(false);
                      setSearch('');
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-black text-sm uppercase tracking-tight">{item.label}</span>
                      {item.subLabel && (
                        <span className={cn(
                          "text-[10px] font-bold uppercase tracking-widest opacity-60",
                          value === item.value ? "text-[#191716]" : "text-[#191716]"
                        )}>
                          {item.subLabel}
                        </span>
                      )}
                    </div>
                    {value === item.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
