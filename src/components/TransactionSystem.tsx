'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  History, 
  DollarSign, 
  ChevronRight,
  Info,
  Library,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  Home
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { CustomCombobox } from '@/components/Combobox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Tab = 'menu' | 'search' | 'results' | 'issue' | 'return' | 'pay';

export default function TransactionSystem() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [activeTransactions, setActiveTransactions] = useState<any[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [finePaid, setFinePaid] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [suggestions, setSuggestions] = useState<{ titles: string[], authors: string[] }>({ titles: [], authors: [] });

  const resetState = () => {
    setActiveTab('menu');
    setSearchResults([]);
    setSelectedAsset(null);
    setSelectedMember('');
    setSearchQuery('');
    setSearchAuthor('');
    setRemarks('');
    setFinePaid(false);
    setSelectedTransaction(null);
  };

  useEffect(() => {
    fetchMembers();
    fetchActiveTransactions();
    fetchSuggestions();
  }, []);

  const fetchMembers = async () => {
    const res = await fetch('/api/members');
    const data = await res.json();
    if (res.ok) setMembers(data);
  };

  const fetchActiveTransactions = async () => {
    const res = await fetch('/api/reports?type=active');
    const data = await res.json();
    if (res.ok) setActiveTransactions(data);
  };

  const fetchSuggestions = async () => {
    try {
      const res = await fetch('/api/assets/search-suggestions');
      const data = await res.json();
      if (res.ok) setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setCurrentPage(1); 
    const params = new URLSearchParams();
    if (searchQuery) params.append('title', searchQuery);
    if (searchAuthor) params.append('author', searchAuthor);

    const res = await fetch(`/api/transactions/search?${params.toString()}`);
    const data = await res.json();
    setSearchResults(data);
    setIsLoading(false);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset || !selectedMember) return;
    
    setIsLoading(true);
    const res = await fetch('/api/transactions/issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        assetId: selectedAsset._id, 
        memberId: selectedMember,
        remarks 
      }),
    });

    if (res.ok) {
      router.push('/status/success?type=transaction');
    } else {
      const data = await res.json();
      alert(data.error || 'Issue failed');
    }
    setIsLoading(false);
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    const daysOverdue = Math.max(0, Math.floor((Date.now() - new Date(selectedTransaction.dueDate).getTime()) / (1000 * 60 * 60 * 24)));
    const currentFine = daysOverdue * 10;

    if (currentFine > 0 && !finePaid) {
      alert(`A fine of ₹${currentFine} must be paid before returning.`);
      return;
    }

    setIsLoading(true);
    const res = await fetch('/api/transactions/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        transactionId: selectedTransaction._id,
        isFinePaid: finePaid 
      }),
    });

    if (res.ok) {
      router.push('/status/success?type=transaction');
    }
    setIsLoading(false);
  };

  const MenuButton = ({ title, desc, icon: Icon, onClick, variant = 'dark' }: any) => (
    <button 
      onClick={onClick}
      className={`w-full text-left group flex items-center justify-between p-8 rounded-[32px] transition-all duration-500 border-2 ${
        variant === 'gold' 
          ? 'bg-[#e6af2e] border-[#e6af2e] text-[#191716] shadow-xl shadow-[#e6af2e]/20 hover:-translate-y-1' 
          : 'bg-[#191716] border-[#191716] text-[#e0e2db] shadow-2xl hover:-translate-y-1'
      }`}
    >
      <div className="flex items-center gap-6">
        <div className={`p-4 rounded-2xl ${variant === 'gold' ? 'bg-[#191716] text-[#e6af2e]' : 'bg-[#e6af2e] text-[#191716]'}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
          <p className={`text-xs font-bold uppercase tracking-widest ${variant === 'gold' ? 'text-[#191716]/60' : 'text-[#e0e2db]/60'}`}>
            {desc}
          </p>
        </div>
      </div>
      <ChevronRight className={`h-6 w-6 transition-transform duration-300 group-hover:translate-x-2 ${variant === 'gold' ? 'text-[#191716]' : 'text-[#e6af2e]'}`} />
    </button>
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowRightLeft className="h-4 w-4 text-[#e6af2e]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#191716]/40">System Core</span>
          </div>
          <h1 className="text-5xl font-black text-[#191716] uppercase tracking-tighter">
            Transactions
          </h1>
        </div>
        <Button 
          asChild
          variant="ghost"
          className="font-black uppercase tracking-widest text-[#191716] hover:bg-[#e6af2e]/10 px-6 h-14 rounded-2xl border-2 border-[#191716]/5 transition-all"
        >
          <Link href={user?.role === 'Admin' ? '/admin' : '/user'}>
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 space-y-4">
          {[
            { id: 'search', label: 'Is book available?', icon: Search },
            { id: 'issue', label: 'Issue book?', icon: ArrowRight },
            { id: 'return', label: 'Return book?', icon: ArrowLeft },
            { id: 'pay', label: 'Pay Fine?', icon: DollarSign },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { resetState(); setActiveTab(item.id as Tab); }}
              className={`w-full text-left p-6 rounded-2xl flex items-center justify-between transition-all duration-300 border-2 ${
                activeTab === item.id || (activeTab === 'results' && item.id === 'search')
                  ? 'bg-[#191716] border-[#191716] text-[#e6af2e] shadow-xl translate-x-2' 
                  : 'bg-white border-[#191716]/5 text-[#191716] hover:bg-[#e6af2e]/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className={`h-5 w-5 ${activeTab === item.id || (activeTab === 'results' && item.id === 'search') ? 'text-[#e6af2e]' : 'text-[#191716]/40'}`} />
                <span className="font-black uppercase tracking-tight text-sm">{item.label}</span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${activeTab === item.id || (activeTab === 'results' && item.id === 'search') ? 'opacity-100 rotate-90' : 'opacity-20'}`} />
            </button>
          ))}
          
          <div className="mt-10 p-6 bg-[#191716]/5 rounded-3xl space-y-4 border-2 border-dashed border-[#191716]/10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#191716]/40">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Active Session</span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9">
          {activeTab === 'menu' ? (
            <div className="h-full flex flex-col items-center justify-center p-20 bg-white rounded-[32px] border-2 border-[#191716]/5 border-dashed space-y-6">
              <div className="bg-[#e6af2e] p-8 rounded-[40px] shadow-2xl shadow-[#e6af2e]/20">
                <Library className="h-16 w-16 text-[#191716]" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-black text-[#191716] mb-2 uppercase tracking-tighter">Ready for Action</h3>
                <p className="text-[#191716]/40 font-bold uppercase tracking-widest text-xs">Select a transaction operation from the left to begin</p>
              </div>
            </div>
          ) : activeTab === 'search' ? (
            <Card className="border-none shadow-2xl overflow-hidden bg-white pt-0">
               <div className="bg-[#191716] text-[#e0e2db] p-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#e6af2e] p-3 rounded-xl">
                      <Search className="h-6 w-6 text-[#191716]" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black uppercase tracking-tight">Book Availability</CardTitle>
                      <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">Enter search details below</CardDescription>
                    </div>
                  </div>
              </div>
              <CardContent className="p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Enter Book Name</Label>
                    <CustomCombobox
                      items={suggestions.titles.map(t => ({ value: t, label: t }))}
                      value={searchQuery}
                      placeholder="Drop Down"
                      onSelect={(val) => setSearchQuery(val)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60">Enter Author</Label>
                    <CustomCombobox
                      items={suggestions.authors.map(a => ({ value: a, label: a }))}
                      value={searchAuthor}
                      placeholder="Drop Down"
                      onSelect={(val) => setSearchAuthor(val)}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-10">
                  <Button 
                    onClick={async () => {
                      await handleSearch();
                      setActiveTab('results');
                    }}
                    disabled={isLoading}
                    className="flex-1 h-16 bg-[#191716] text-[#e6af2e] hover:bg-[#e6af2e] hover:text-[#191716] rounded-2xl font-black uppercase tracking-widest text-lg shadow-xl"
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                  <Button 
                    onClick={() => { resetState(); setActiveTab('menu'); }}
                    variant="outline"
                    className="flex-1 h-16 px-10 border-2 border-[#191716]/10 rounded-2xl font-bold uppercase tracking-widest"
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : activeTab === 'results' ? (
            <Card className="border-none shadow-2xl overflow-hidden bg-white pt-0">
               <div className="bg-[#191716] text-[#e0e2db] p-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-[#e6af2e] p-3 rounded-xl">
                      <Search className="h-6 w-6 text-[#191716]" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black uppercase tracking-tight">Search Results</CardTitle>
                      <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">Asset availability overview</CardDescription>
                    </div>
                  </div>
              </div>
              <CardContent className="p-0">
                 {isLoading ? (
                   <div className="p-32 flex flex-col items-center justify-center gap-6">
                      <div className="w-16 h-16 border-4 border-[#e6af2e] border-t-transparent rounded-full animate-spin"></div>
                      <p className="font-black uppercase tracking-widest text-xs text-[#191716]/40">Gathering Intelligence...</p>
                   </div>
                 ) : (
                   <>
                    <Table>
                      <TableHeader className="bg-[#191716]/5">
                        <TableRow className="border-b-[#191716]/10">
                          <TableHead className="font-black uppercase tracking-widest text-[10px] pl-10 h-16">Book Name</TableHead>
                          <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Author Name</TableHead>
                          <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Serial Number</TableHead>
                          <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-center">Available</TableHead>
                          <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-right pr-10 whitespace-nowrap">Select to issue the book</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.length === 0 ? (
                           <TableRow>
                             <TableCell colSpan={5} className="h-40 text-center opacity-20 font-black uppercase tracking-widest text-xs">No records found</TableCell>
                           </TableRow>
                        ) : (
                          currentItems.map((asset) => (
                            <TableRow key={asset._id} className="hover:bg-[#e6af2e]/5 border-b-[#191716]/5">
                              <TableCell className="pl-10 h-20 font-black text-[#191716] uppercase tracking-tight">{asset.title}</TableCell>
                              <TableCell className="font-bold text-[#191716]/60 uppercase text-xs">{asset.author}</TableCell>
                              <TableCell className="font-mono text-[10px] font-bold text-[#191716]/40 uppercase tracking-widest">{asset.serialNo}</TableCell>
                              <TableCell className="text-center font-black text-sm">
                                 {asset.availableCopies > 0 ? <span className="text-green-600">Y</span> : <span className="text-red-600">N</span>}
                              </TableCell>
                              <TableCell className="text-right pr-10">
                                 {asset.availableCopies > 0 ? (
                                   <button 
                                     onClick={() => { setSelectedAsset(asset); setActiveTab('issue'); }}
                                     className="group/btn relative"
                                   >
                                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#191716]/40 group-hover/btn:text-[#191716] transition-colors">
                                        <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center p-0.5">
                                          <div className="w-full h-full rounded-full bg-transparent group-hover/btn:bg-[#e6af2e]" />
                                        </div>
                                        radio button
                                      </div>
                                   </button>
                                 ) : (
                                   <span className="text-[10px] font-black uppercase text-[#191716]/20">Unavailable</span>
                                 )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <div className="p-8 border-t border-[#191716]/5 flex items-center justify-between">
                       <Button variant="outline" onClick={() => setActiveTab('search')} className="rounded-xl font-black uppercase tracking-widest text-[10px] h-10 px-6">Back</Button>
                       <div className="flex gap-2">
                         <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} variant="outline" size="sm" className="rounded-xl">Prev</Button>
                         <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} variant="outline" size="sm" className="rounded-xl">Next</Button>
                       </div>
                    </div>
                   </>
                 )}
              </CardContent>
            </Card>
          ) : activeTab === 'issue' ? (
            <Card className="border-none shadow-2xl overflow-hidden bg-white pt-0">
               <div className="bg-[#e6af2e] text-[#191716] p-10">
                <div className="flex items-center gap-4">
                  <div className="bg-[#191716] p-3 rounded-xl">
                    <ArrowRight className="h-6 w-6 text-[#e6af2e]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Book Issue</CardTitle>
                    <CardDescription className="text-[#191716]/60 font-bold uppercase tracking-widest text-[10px]">Processing resource allocation</CardDescription>
                  </div>
                </div>
              </div>
              <CardContent className="p-10">
                <form onSubmit={handleIssue} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="font-black uppercase tracking-widest text-[10px]">Recipient</Label>
                      <CustomCombobox
                        items={members.map(m => ({ value: m._id, label: `${m.firstName} ${m.lastName}`, subLabel: m.aadhar }))}
                        value={selectedMember}
                        placeholder="Select Member..."
                        onSelect={(val) => setSelectedMember(val)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-black uppercase tracking-widest text-[10px]">Asset</Label>
                      <Input 
                        className="h-12 border-2 rounded-xl px-4 font-bold"
                        value={selectedAsset?.title || ''}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 h-16 bg-[#191716] text-[#e6af2e] font-black uppercase tracking-widest rounded-2xl">Confirm Issue</Button>
                    <Button type="button" onClick={() => setActiveTab('search')} variant="outline" className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest">Back</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : activeTab === 'return' ? (
            <Card className="border-none shadow-2xl overflow-hidden bg-white pt-0">
               <div className="bg-[#191716] text-[#e0e2db] p-10">
                <div className="flex items-center gap-4">
                  <div className="bg-[#e6af2e] p-3 rounded-xl">
                    <ArrowLeft className="h-6 w-6 text-[#191716]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Return Book</CardTitle>
                    <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">Reclamation protocols</CardDescription>
                  </div>
                </div>
              </div>
              <CardContent className="p-10">
                <div className="space-y-10">
                   <div className="space-y-4">
                    <Label className="font-black uppercase tracking-widest text-[10px] text-[#191716]/60 ml-1">Asset Serial Number</Label>
                    <CustomCombobox
                      items={activeTransactions.map(t => ({
                        value: t.assetId?._id || t._id,
                        label: `${t.assetId?.serialNo} - ${t.assetId?.title}`,
                        subLabel: t.memberId?.firstName
                      }))}
                      value={selectedTransaction?.assetId?._id || ''}
                      placeholder="SELECT SN..."
                      onSelect={(val) => {
                        const tx = activeTransactions.find(t => (t.assetId?._id || t._id) === val);
                        if (tx) setSelectedTransaction(tx);
                      }}
                    />
                  </div>
                  {selectedTransaction && (
                    <div className="space-y-8 animate-in slide-in-from-top-6">
                       <div className="flex items-center gap-4 p-8 bg-[#e6af2e]/5 rounded-3xl border-2 border-dashed border-[#e6af2e]/30">
                        <Checkbox 
                          id="fine-paid-side" 
                          checked={finePaid} 
                          onCheckedChange={(val) => setFinePaid(val as boolean)}
                          className="h-8 w-8 rounded-xl border-2 border-[#e6af2e] data-[state=checked]:bg-[#e6af2e] data-[state=checked]:text-[#191716]"
                        />
                        <div className="flex-1">
                          <Label htmlFor="fine-paid-side" className="text-lg font-black uppercase tracking-tight text-[#191716] block mb-1">Financial Settlement</Label>
                          <p className="text-xs font-bold text-[#191716]/50">Verify all dues are cleared</p>
                        </div>
                      </div>
                      <Button onClick={handleReturn} className="w-full h-16 bg-[#191716] text-[#e6af2e] rounded-2xl font-black uppercase tracking-widest">Confirm Return</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : activeTab === 'pay' ? (
            <Card className="border-none shadow-2xl overflow-hidden bg-white pt-0">
               <div className="bg-[#e6af2e] text-[#191716] p-10">
                <div className="flex items-center gap-4">
                  <div className="bg-[#191716] p-3 rounded-xl">
                    <DollarSign className="h-6 w-6 text-[#e6af2e]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">Financial Dues</CardTitle>
                    <CardDescription className="text-[#191716]/60 font-bold uppercase tracking-widest text-[10px]">Processing late fees</CardDescription>
                  </div>
                </div>
              </div>
              <CardContent className="p-10 text-center space-y-6">
                 <div className="bg-[#191716]/5 p-20 rounded-[32px] border-2 border-dashed border-[#191716]/10">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-[#191716]/30 mb-4">Module Integration</p>
                    <h4 className="text-xl font-black text-[#191716] uppercase mb-4">Payment Integrated with Return</h4>
                    <p className="max-w-md mx-auto text-xs font-bold leading-relaxed text-[#191716]/60">For the most efficient workflow, fine payments are now processed directly within the Book Return sequence.</p>
                    <Button onClick={() => setActiveTab('return')} className="mt-8 bg-[#191716] text-[#e6af2e] px-10 h-14 rounded-2xl font-black uppercase tracking-widest">Go to Return</Button>
                 </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
