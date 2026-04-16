'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowRight, ArrowLeft, History, DollarSign, Home as HomeIcon, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Tab = 'menu' | 'search' | 'issue' | 'return' | 'pay';

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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery && !searchAuthor) {
      alert('Please enter either a Book Name or an Author to search.');
      return;
    }

    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append('title', searchQuery);
    if (searchAuthor) params.append('author', searchAuthor);

    const res = await fetch(`/api/transactions/search?${params.toString()}`);
    const data = await res.json();
    setSearchResults(data);
    setIsLoading(false);
  };

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
      setActiveTab('menu');
      setSelectedAsset(null);
      setSelectedMember('');
      fetchActiveTransactions();
    } else {
      const data = await res.json();
      alert(data.error || 'Issue failed');
    }
    setIsLoading(false);
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransaction) return;

    // Calculate fine on the fly for validation
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
      setActiveTab('menu');
      setSelectedTransaction(null);
      setFinePaid(false);
      fetchActiveTransactions();
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white min-h-[500px] p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Top Navigation Links from Excel */}
      <div className="flex justify-between mb-8 text-sm font-medium text-gray-600">
        <span className="cursor-pointer hover:underline">Chart</span>
        <h1 className="text-xl font-bold text-gray-900 border-b pb-1">Transactions</h1>
        <Link href={user?.role === 'Admin' ? '/admin' : '/user'} className="hover:underline">Home</Link>
      </div>

      {activeTab === 'menu' && (
        <div className="max-w-md mx-auto mt-12 border-2 border-gray-800 p-8 rounded-lg">
          <ul className="space-y-6 text-xl font-bold text-gray-800">
            <li>
              <button onClick={() => setActiveTab('search')} className="hover:text-indigo-600 hover:underline">
                Is book available?
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('issue')} className="hover:text-indigo-600 hover:underline">
                Issue book?
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('return')} className="hover:text-indigo-600 hover:underline">
                Return book?
              </button>
            </li>
            <li className="flex justify-end pt-4">
              <button onClick={logout} className="text-gray-900 border-2 border-black px-4 py-1 hover:bg-gray-100 uppercase text-sm">Log Out</button>
            </li>
          </ul>
        </div>
      )}

      {activeTab !== 'menu' && (
        <button 
          onClick={resetState}
          className="mb-6 flex items-center text-sm text-indigo-600 font-medium hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Transaction Menu
        </button>
      )}

      {activeTab === 'search' && searchResults.length === 0 && (
        <div className="max-w-xl mx-auto space-y-8 border-2 border-gray-800 p-8 rounded-lg animate-in fade-in bg-white shadow-xl">
          <h2 className="text-xl font-bold border-b-2 border-black pb-2">
            Book Availability Search
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Enter Book Name</label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  list="book-titles"
                  className="w-full border-2 border-gray-800 p-2 font-bold"
                  placeholder="Drop Down"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <datalist id="book-titles">
                  {suggestions.titles.map((title, i) => (
                    <option key={i} value={title} />
                  ))}
                </datalist>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Enter Author</label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  list="author-names"
                  className="w-full border-2 border-gray-800 p-2 font-bold"
                  placeholder="Drop Down"
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                />
                <datalist id="author-names">
                  {suggestions.authors.map((author, i) => (
                    <option key={i} value={author} />
                  ))}
                </datalist>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8">
            <button 
              onClick={resetState}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'search' && searchResults.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow border-2 border-gray-800 animate-in fade-in duration-500">
          
          {/* Main Transaction Header (Excel Style) */}
          <div className="flex justify-between items-center mb-0 relative">
            <div className="flex-1 text-center">
              <h1 className="text-xl font-bold uppercase underline">Transactions</h1>
            </div>
            <Link href={user?.role === 'Admin' ? '/admin' : '/user'} className="font-bold underline text-sm absolute right-0">Home</Link>
          </div>

          <div className="mt-8 border-2 border-black p-0 bg-white min-h-[400px] flex flex-col">
            <h2 className="text-md font-bold bg-gray-50 border-b-2 border-black p-2">Book Availability</h2>
            
            <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-black text-left text-xs bg-gray-50 uppercase font-bold">
                    <th className="p-3 border-r-2 border-black">Book Name</th>
                    <th className="p-3 border-r-2 border-black">Author Name</th>
                    <th className="p-3 border-r-2 border-black">Serial Number</th>
                    <th className="p-3 border-r-2 border-black">Available</th>
                    <th className="p-3">Select to issue the book</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-200">
                  {searchResults.map((asset) => (
                    <tr key={asset._id} className="text-sm font-medium hover:bg-gray-50">
                      <td className="p-3 border-r-2 border-black">{asset.title}</td>
                      <td className="p-3 border-r-2 border-black">{asset.author}</td>
                      <td className="p-3 border-r-2 border-black font-mono">{asset.serialNo}</td>
                      <td className="p-3 border-r-2 border-black text-center font-bold">
                        {asset.availableCopies > 0 ? 'Y' : 'N'}
                      </td>
                      <td className="p-3 text-center">
                        {asset.availableCopies > 0 && (
                          <input 
                            type="radio" 
                            name="asset-select"
                            className="w-5 h-5 cursor-pointer accent-blue-600"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setActiveTab('issue');
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 flex justify-between items-end">
              <div className="space-x-4 flex">
                <button 
                  onClick={() => setSearchResults([])}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-10 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all uppercase"
                >
                  Search
                </button>
                <button 
                  onClick={resetState}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-10 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all uppercase"
                >
                  Cancel
                </button>
              </div>
              <button onClick={logout} className="font-bold underline text-sm mb-2">Log Out</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'issue' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow border-2 border-gray-800 animate-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">
            Book Issue
          </h2>
          <form onSubmit={handleIssue} className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Membership ID</label>
              <div className="flex-1 relative">
                <select 
                  required
                  className="w-full border-2 border-gray-800 p-2 font-bold"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">Select Member</option>
                  {members.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.firstName} {m.lastName} ({m.membershipId || m.aadhar})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Enter Book Name</label>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  list="issue-book-titles"
                  placeholder="Drop Down"
                  className="w-full border-2 border-gray-800 p-2 font-bold" 
                  value={selectedAsset?.title || ''} 
                  onChange={async (e) => {
                    const title = e.target.value;
                    // If manually typing or selecting, try to find the asset info
                    const res = await fetch(`/api/transactions/search?title=${encodeURIComponent(title)}`);
                    if (res.ok) {
                      const matches = await res.json();
                      if (matches.length > 0) {
                        setSelectedAsset(matches[0]);
                      } else {
                        setSelectedAsset({ title }); // Keep title but clear others if no match
                      }
                    }
                  }}
                />
                <datalist id="issue-book-titles">
                  {suggestions.titles.map((title, i) => (
                    <option key={i} value={title} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Enter Author</label>
              <div className="flex-1">
                <input 
                  type="text" 
                  readOnly 
                  placeholder="Text box"
                  className="w-full bg-gray-100 border-2 border-gray-800 p-2 text-gray-600 cursor-not-allowed" 
                  value={selectedAsset?.author || ''} 
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">Automatically populated and is non-editable.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Issue Date</label>
              <input 
                id="issue-date"
                type="date" 
                required 
                className="flex-1 border-2 border-gray-800 p-2" 
                defaultValue={new Date().toISOString().split('T')[0]} 
                onChange={(e) => {
                  const returnInput = document.getElementById('return-date') as HTMLInputElement;
                  if (returnInput) {
                    returnInput.min = e.target.value;
                    const maxDate = new Date(e.target.value);
                    maxDate.setDate(maxDate.getDate() + 15);
                    returnInput.max = maxDate.toISOString().split('T')[0];
                  }
                }}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Return Date</label>
              <input 
                id="return-date"
                type="date" 
                required 
                className="flex-1 border-2 border-gray-800 p-2" 
                defaultValue={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} 
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>

            <div className="flex items-start space-x-4">
              <label className="w-40 font-bold text-sm mt-2">Remarks</label>
              <div className="flex-1">
                <textarea 
                  className="w-full border-2 border-gray-800 p-2 h-20" 
                  placeholder="Text area/Text Non Mandatory"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <button 
                type="button"
                onClick={resetState}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all"
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'return' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow border-2 border-gray-800 animate-in fade-in">
          <div className="flex justify-between items-center mb-8 text-sm font-medium text-gray-600">
            <span className="font-bold underline">Chart</span>
            <h1 className="text-xl font-bold text-gray-900 uppercase">Transactions</h1>
            <Link href={user?.role === 'Admin' ? '/admin' : '/user'} className="font-bold underline">Home</Link>
          </div>

          <h2 className="text-md font-bold mb-4 bg-gray-50 border-b-2 border-black p-2">Return Book</h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Enter Book Name</label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full border-2 border-gray-800 p-2 font-bold bg-white"
                  placeholder="Drop Down"
                  list="return-book-titles"
                />
                <datalist id="return-book-titles">
                  {activeTransactions.map(t => <option key={t._id} value={t.assetId?.title} />)}
                </datalist>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Enter Author</label>
              <input 
                type="text" 
                readOnly 
                className="flex-1 border-2 border-gray-800 p-2 bg-gray-50 font-bold"
                value={selectedTransaction?.assetId?.author || 'Automatically populated'} 
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Serial No</label>
              <div className="flex-1 relative">
                <select 
                  onChange={(e) => {
                    const tx = activeTransactions.find(t => t.assetId?._id === e.target.value);
                    if (tx) setSelectedTransaction(tx);
                  }}
                  className="w-full border-2 border-gray-800 p-2 text-black font-bold"
                >
                  <option value="">Drop Down (Mandatory)</option>
                  {activeTransactions.map(t => (
                    <option key={t._id} value={t.assetId?._id}>
                      {t.assetId?.serialNo} - {t.assetId?.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Issue Date</label>
              <input 
                type="text" 
                readOnly 
                className="flex-1 border-2 border-gray-800 p-2 bg-gray-50 font-bold"
                value={selectedTransaction ? new Date(selectedTransaction.issueDate).toLocaleDateString() : 'Automatically populated'} 
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold text-sm">Return Date</label>
              <input 
                type="text" 
                readOnly 
                className="flex-1 border-2 border-gray-800 p-2 bg-gray-50 font-bold"
                value={selectedTransaction ? new Date(selectedTransaction.dueDate).toLocaleDateString() : 'Automatically populated'} 
              />
            </div>
            
            <div className="flex items-start space-x-4">
              <label className="w-40 font-bold text-sm mt-2">Remarks</label>
              <textarea 
                className="flex-1 border-2 border-gray-800 p-2 h-16"
                placeholder="Non Mandatory"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 px-4">
            <button 
              onClick={resetState}
              className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                if (!selectedTransaction) alert('Please select a book/serial to return.');
                else setActiveTab('pay');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all uppercase"
            >
              Confirm
            </button>
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={logout} className="font-bold underline text-sm">Log Out</button>
          </div>
        </div>
      )}

      {activeTab === 'pay' && selectedTransaction && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow border-2 border-gray-800 animate-in fade-in">
          <div className="flex justify-between items-center mb-8 text-sm font-medium text-gray-600">
            <span className="font-bold underline">Chart</span>
            <h1 className="text-xl font-bold text-gray-900 uppercase">Transactions</h1>
            <Link href={user?.role === 'Admin' ? '/admin' : '/user'} className="font-bold underline">Home</Link>
          </div>

          <h2 className="text-md font-bold mb-4 bg-gray-50 border-b-2 border-black p-2">Pay Fine</h2>
          
          <form onSubmit={handleReturn} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Enter Book Name</label>
              <input type="text" readOnly className="flex-1 bg-white border-2 border-gray-800 p-2 font-bold" value={selectedTransaction.assetId?.title || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Enter Author</label>
              <input type="text" readOnly className="flex-1 bg-white border-2 border-gray-800 p-2" value={selectedTransaction.assetId?.author || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Serial No</label>
              <input type="text" readOnly className="flex-1 bg-white border-2 border-gray-800 p-2" value={selectedTransaction.assetId?.serialNo || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Issue Date</label>
              <input type="text" readOnly className="flex-1 bg-white border-2 border-gray-800 p-1 font-bold" value={new Date(selectedTransaction.issueDate).toLocaleDateString()} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Return Date</label>
              <input type="text" readOnly className="flex-1 bg-white border-2 border-gray-800 p-1 font-bold" value={new Date(selectedTransaction.dueDate).toLocaleDateString()} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Actual Return Date</label>
              <input 
                type="text" 
                readOnly 
                className="flex-1 bg-white border-2 border-gray-800 p-1" 
                value={new Date().toLocaleDateString()}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Fine Calculated</label>
              <input 
                type="text" 
                readOnly 
                className="flex-1 bg-white border-2 border-gray-800 p-2 font-extrabold text-blue-800" 
                value={`₹${Math.max(0, Math.floor((Date.now() - new Date(selectedTransaction.dueDate).getTime()) / (1000 * 60 * 60 * 24))) * 10}`} 
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Fine Paid</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="h-5 w-5 accent-blue-600"
                  checked={finePaid}
                  onChange={(e) => setFinePaid(e.target.checked)}
                />
                <span className="text-xs text-gray-500">(by default unchecked)</span>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <label className="w-44 font-bold text-sm mt-2">Remarks</label>
              <textarea 
                className="flex-1 border-2 border-gray-800 p-2 h-16" 
                placeholder="Non Mandatory"
                value={remarks}
                readOnly
              />
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 px-4">
              <button 
                type="button"
                onClick={() => router.push('/status/cancelled?type=transaction')}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] transform active:translate-y-1 active:shadow-none transition-all uppercase"
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
            <div className="flex justify-end pt-4">
              <button onClick={logout} className="font-bold underline text-sm">Log Out</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
