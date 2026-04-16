'use client';

import { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowRight, ArrowLeft, History, DollarSign, Home as HomeIcon, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

type Tab = 'menu' | 'search' | 'issue' | 'return' | 'pay';

export default function TransactionSystem() {
  const { user, logout } = useAuth();
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

  useEffect(() => {
    fetchMembers();
    fetchActiveTransactions();
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
      alert('Book issued successfully!');
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

    if (selectedTransaction.fineAmount > 0 && !finePaid) {
      alert('Fine must be paid before returning.');
      return;
    }

    setIsLoading(true);
    const res = await fetch('/api/transactions/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: selectedTransaction._id }),
    });

    if (res.ok) {
      alert('Item returned successfully!');
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
            <li className="flex justify-between items-center">
              <button onClick={() => setActiveTab('pay')} className="hover:text-indigo-600 hover:underline">
                Pay Fine?
              </button>
              <button onClick={logout} className="text-gray-900 hover:underline">Log Out</button>
            </li>
          </ul>
        </div>
      )}

      {activeTab !== 'menu' && (
        <button 
          onClick={() => setActiveTab('menu')}
          className="mb-6 flex items-center text-sm text-indigo-600 font-medium hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Transaction Menu
        </button>
      )}

      {activeTab === 'search' && (
        <div className="max-w-xl mx-auto space-y-8 border-2 border-gray-800 p-8 rounded-lg animate-in fade-in">
          <h2 className="text-xl font-bold border-b pb-2 cursor-pointer" onClick={() => setActiveTab('menu')}>
            Book Availability
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold">Enter Book Name</label>
              <input
                type="text"
                className="flex-1 border-2 border-gray-800 p-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="w-40 font-bold">Enter Author</label>
              <input
                type="text"
                className="flex-1 border-2 border-gray-800 p-2"
                value={searchAuthor}
                onChange={(e) => setSearchAuthor(e.target.value)}
              />
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button 
                onClick={() => setActiveTab('menu')}
                className="flex-1 bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
              >
                Back
              </button>
              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          <div className="mt-8 border-2 border-gray-800 overflow-hidden text-gray-900">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-50 border-b-2 border-gray-800 font-bold">
                <tr className="divide-x divide-gray-800">
                  <th className="px-6 py-3 text-left text-sm uppercase">Book Name</th>
                  <th className="px-6 py-3 text-left text-sm uppercase">Author Name</th>
                  <th className="px-6 py-3 text-left text-sm uppercase">Serial Number</th>
                  <th className="px-6 py-3 text-left text-sm uppercase text-center">Available</th>
                  <th className="px-6 py-3 text-left text-sm uppercase">Select to issue the book</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 font-medium">
                {searchResults.map((asset) => (
                  <tr key={asset._id} className="divide-x divide-gray-800 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{asset.serialNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {asset.availableCopies > 0 ? 'Y' : 'N'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <input 
                        type="radio" 
                        name="asset-select"
                        checked={selectedAsset?._id === asset._id}
                        onChange={() => setSelectedAsset(asset)}
                        disabled={asset.availableCopies <= 0}
                        className="h-5 w-5 text-indigo-600 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center space-x-4 pt-8">
            <button 
              onClick={() => { setSearchResults([]); setSelectedAsset(null); }}
              className="w-48 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
            >
              Search
            </button>
            <button 
              onClick={() => { setActiveTab('menu'); setSearchResults([]); setSelectedAsset(null); }}
              className="w-48 bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
            >
              Cancel
            </button>
          </div>

          {selectedAsset && (
            <div className="flex justify-center mt-6">
              <button 
                onClick={() => setActiveTab('issue')} 
                className="bg-green-600 text-white px-12 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md transform hover:scale-105 transition-all"
              >
                Continue to Issue Book ({selectedAsset.title})
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'issue' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow border-2 border-gray-800 animate-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">
            Book Issue
          </h2>
          <form onSubmit={handleIssue} className="space-y-6">
            <div className="flex items-center space-x-4">
              <label className="w-32 font-bold text-sm">Enter Book Name</label>
              <input type="text" disabled className="flex-1 bg-gray-50 border-2 border-gray-800 p-2 font-bold" value={selectedAsset?.title || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-32 font-bold text-sm">Enter Author</label>
              <input type="text" disabled className="flex-1 bg-gray-50 border-2 border-gray-800 p-2" value={selectedAsset?.author || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-32 font-bold text-sm">Issue Date</label>
              <input type="date" required className="flex-1 border-2 border-gray-800 p-2" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-32 font-bold text-sm">Return Date</label>
              <input 
                type="date" 
                required 
                className="flex-1 border-2 border-gray-800 p-2" 
                defaultValue={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} 
                max={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              />
            </div>

            <div className="flex items-start space-x-4">
              <label className="w-32 font-bold text-sm mt-2">Remarks</label>
              <textarea 
                className="flex-1 border-2 border-gray-800 p-2 h-20" 
                placeholder="Optional notes..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button 
                type="button"
                onClick={() => setActiveTab('search')}
                className="flex-1 bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'return' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
          <h2 className="text-xl font-bold">Return Book/Movie</h2>
          <div className="border-2 border-gray-800 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-50">
                <tr className="divide-x divide-gray-800 font-bold">
                  <th className="px-6 py-3 text-left text-xs uppercase">Asset</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Member</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Serial No</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {activeTransactions.map((tx) => (
                  <tr key={tx._id} className="divide-x divide-gray-800 hover:bg-gray-50 font-medium">
                    <td className="px-6 py-4 text-sm">{tx.assetId?.title}</td>
                    <td className="px-6 py-4 text-sm">{tx.memberId?.firstName} {tx.memberId?.lastName}</td>
                    <td className="px-6 py-4 text-sm">{tx.serialNo}</td>
                    <td className="px-6 py-4 text-sm">{new Date(tx.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <button 
                        onClick={() => { setSelectedTransaction(tx); setActiveTab('pay'); }}
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Select to Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'pay' && selectedTransaction && (
        <div className="max-w-xl mx-auto bg-white p-8 border-2 border-gray-800 shadow-lg animate-in zoom-in-95 duration-200">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">
            Pay Fine
          </h2>
          <form onSubmit={handleReturn} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Enter Book Name</label>
              <input type="text" disabled className="flex-1 bg-gray-50 border-2 border-gray-800 p-2 font-bold" value={selectedTransaction.assetId?.title || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Enter Author</label>
              <input type="text" disabled className="flex-1 bg-gray-50 border-2 border-gray-800 p-2" value={selectedTransaction.assetId?.author || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Serial No</label>
              <input type="text" disabled className="flex-1 bg-gray-50 border-2 border-gray-800 p-2" value={selectedTransaction.serialNo || ''} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Issue Date</label>
              <input type="text" disabled className="flex-1 bg-gray-50 border-2 border-gray-800 p-2" value={new Date(selectedTransaction.issueDate).toLocaleDateString()} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Return Date</label>
              <input type="text" disabled className="flex-1 bg-gray-50 border-2 border-gray-800 p-2" value={new Date(selectedTransaction.dueDate).toLocaleDateString()} />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Actual Return Date</label>
              <input 
                type="date" 
                required 
                className="flex-1 border-2 border-gray-800 p-2" 
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Fine Calculated</label>
              <input 
                type="text" 
                disabled 
                className="flex-1 bg-gray-50 border-2 border-gray-800 p-2 font-extrabold text-indigo-600" 
                value={`₹${Math.max(0, Math.floor((Date.now() - new Date(selectedTransaction.dueDate).getTime()) / (1000 * 60 * 60 * 24))) * 10}`} 
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="w-44 font-bold text-sm">Fine Paid</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="h-5 w-5 border-gray-300 text-indigo-600"
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
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <button 
                type="button"
                onClick={() => setActiveTab('return')}
                className="flex-1 bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_4px_0_rgb(30,58,138)]"
              >
                {isLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
