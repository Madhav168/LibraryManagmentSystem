'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowRight, User, Book, Calendar, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export default function TransactionSystem() {
  const [activeTab, setActiveTab] = useState<'search' | 'issue' | 'return'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [activeTransactions, setActiveTransactions] = useState<any[]>([]);
  
  // Form states
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState('');
  const [remarks, setRemarks] = useState('');
  
  // Return state
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isFinePaid, setIsFinePaid] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'search') handleSearch();
    if (activeTab === 'issue') fetchMembers();
    if (activeTab === 'return') fetchActiveTransactions();
  }, [activeTab]);

  const handleSearch = async () => {
    const res = await fetch(`/api/transactions/search?q=${searchQuery}`);
    const data = await res.json();
    if (res.ok) setAssets(data);
  };

  const fetchMembers = async () => {
    const res = await fetch('/api/members');
    const data = await res.json();
    if (res.ok) setMembers(data);
  };

  const fetchActiveTransactions = async () => {
    const res = await fetch('/api/reports?type=active_issues');
    const data = await res.json();
    if (res.ok) setActiveTransactions(data);
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/transactions/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: selectedAsset._id, memberId: selectedMember, remarks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: 'success', text: 'Issued successfully!' });
      setSelectedAsset(null);
      setSelectedMember('');
      setRemarks('');
      setActiveTab('search');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/transactions/return', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: selectedTransaction._id, isFinePaid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage({ type: 'success', text: 'Returned successfully!' });
      setSelectedTransaction(null);
      setIsFinePaid(false);
      fetchActiveTransactions();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b">
        <button 
          onClick={() => setActiveTab('search')}
          className={`pb-2 px-4 text-sm font-medium ${activeTab === 'search' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Is Asset Available?
        </button>
        <button 
          onClick={() => setActiveTab('issue')}
          className={`pb-2 px-4 text-sm font-medium ${activeTab === 'issue' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Issue Asset
        </button>
        <button 
          onClick={() => setActiveTab('return')}
          className={`pb-2 px-4 text-sm font-medium ${activeTab === 'return' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Return Asset
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button onClick={handleSearch} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Search
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assets.map((asset) => (
                  <tr key={asset._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${asset.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {asset.availableCopies > 0 ? `${asset.availableCopies} Available` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => { setSelectedAsset(asset); setActiveTab('issue'); }}
                        disabled={asset.availableCopies <= 0}
                        className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
                      >
                        Issue
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'issue' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <ArrowRight className="mr-2 h-5 w-5 text-indigo-600" /> Issue Book/Movie
          </h2>
          <form onSubmit={handleIssue} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Selected Asset</label>
              <div className="mt-1 p-3 bg-gray-50 border rounded-md flex items-center justify-between">
                {selectedAsset ? (
                  <>
                    <div>
                      <div className="font-semibold">{selectedAsset.title}</div>
                      <div className="text-xs text-gray-500">By {selectedAsset.author}</div>
                    </div>
                    <button type="button" onClick={() => setSelectedAsset(null)} className="text-xs text-red-600">Change</button>
                  </>
                ) : (
                  <span className="text-gray-400 text-sm">Please select from search tab</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Member</label>
              <select 
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option value="">Select a member</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>{m.firstName} {m.lastName} ({m.aadhar})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Return Date</label>
              <input 
                type="text" 
                disabled 
                className="mt-1 block w-full bg-gray-50 rounded-md border-gray-300 sm:text-sm border p-2"
                value={new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              />
              <p className="mt-1 text-xs text-gray-500">Fixed at 15 days from today as per policy.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedAsset || !selectedMember}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
            >
              Confirm Issue
            </button>
          </form>
        </div>
      )}

      {activeTab === 'return' && (
        <div className="space-y-6">
          {!selectedTransaction ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
               <h3 className="p-4 font-semibold bg-gray-50 border-b">Select Active Issue to Return</h3>
               <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeTransactions.map((tx) => (
                    <tr key={tx._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.assetId?.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.memberId?.firstName} {tx.memberId?.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(tx.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => setSelectedTransaction(tx)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Return Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow border">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-indigo-600" /> Pay Fine & Return
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Book Title:</span>
                    <div className="font-semibold">{selectedTransaction.assetId?.title}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Member:</span>
                    <div className="font-semibold">{selectedTransaction.memberId?.firstName} {selectedTransaction.memberId?.lastName}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Issue Date:</span>
                    <div className="font-semibold">{new Date(selectedTransaction.issueDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Due Date:</span>
                    <div className="font-semibold">{new Date(selectedTransaction.dueDate).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Fine Calculation logic reproduced in UI for visibility */}
                {(() => {
                  const today = new Date();
                  const dueDate = new Date(selectedTransaction.dueDate);
                  const isLate = today > dueDate;
                  const diffDays = isLate ? Math.ceil(Math.abs(today.getTime() - dueDate.getTime()) / (1000 * 3600 * 24)) : 0;
                  const fine = diffDays * 10;
                  
                  return (
                    <div className={`p-4 rounded-md border ${isLate ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Calculated Fine:</span>
                        <span className={`text-xl font-bold ${isLate ? 'text-red-700' : 'text-green-700'}`}>
                          ₹{fine}
                        </span>
                      </div>
                      {isLate && <div className="text-xs text-red-600 mt-1">Late by {diffDays} days (₹10/day)</div>}
                    </div>
                  );
                })()}

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="finePaid" 
                    checked={isFinePaid}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    onChange={(e) => setIsFinePaid(e.target.checked)}
                  />
                  <label htmlFor="finePaid" className="text-sm font-medium text-gray-700">
                    Confirm Fine Paid (Mandatory to check for completion)
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedTransaction(null)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReturn}
                    disabled={isLoading || !isFinePaid}
                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
                  >
                    Confirm Return
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
