'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AddAsset() {
  const router = useRouter();
  const { logout } = useAuth();
  const [mode, setMode] = useState<'add' | 'update'>('add');
  const [formData, setFormData] = useState({
    title: '',
    type: 'Book',
    procurementDate: new Date().toISOString().split('T')[0],
    quantity: 1,
    serialNo: '',
  });
  const [assets, setAssets] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    const res = await fetch('/api/assets');
    const data = await res.json();
    if (res.ok) setAssets(data);
  };

  const menuItems = [
    { label: 'Membership', add: '/admin/maintenance/membership', update: '/admin/maintenance/membership' },
    { label: 'Books/Movies', add: () => setMode('add'), update: () => setMode('update') },
    { label: 'User Management', add: '/admin/maintenance/users', update: '/admin/maintenance/users' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    const res = await fetch('/api/assets', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { ...formData, id: formData.serialNo } : formData),
    });

    if (res.ok) {
      router.push('/admin/status/success');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to save');
    }
  };

  const buttonStyle = "px-8 py-2 bg-blue-600 text-white font-bold rounded shadow-[0_4px_0_rgb(30,58,138)] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all";

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 font-sans text-sm">
      <div className="border-2 border-black bg-white p-4">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-start mb-2 px-2">
          <div className="flex flex-col">
            <span className="font-bold underline cursor-pointer">Chart</span>
            <span className="text-xl font-bold mt-2 ml-16 underline underline-offset-4 invisible">Reports</span>
          </div>
          <Link href="/admin" className="font-bold underline">Home</Link>
        </div>

        <div className="grid grid-cols-12 gap-0 border-t-2 border-black pt-4">
          
          {/* Side Menu (Housekeeping) */}
          <div className="col-span-3 border-r-2 border-black pr-4 min-h-[400px]">
            <h2 className="text-xl font-black mb-4">Housekeeping</h2>
            <div className="space-y-4">
              {menuItems.map((item) => (
                <div key={item.label} className="grid grid-cols-2 text-xs font-bold">
                  <span className="text-sm">{item.label}</span>
                  <div className="flex flex-col space-y-1">
                    {'add' in item && typeof item.add === 'string' ? (
                      <>
                        <Link href={item.add as string} className="hover:underline">Add</Link>
                        <Link href={item.update as string} className="hover:underline">Update</Link>
                      </>
                    ) : (
                      <>
                        <button onClick={item.add as any} className={`text-left hover:underline ${mode === 'add' ? 'text-blue-600' : ''}`}>Add</button>
                        <button onClick={item.update as any} className={`text-left hover:underline ${mode === 'update' ? 'text-blue-600' : ''}`}>Update</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="col-span-9 pl-8">
            <h1 className="text-center text-xl font-black mb-8">
              {mode === 'add' ? 'Add Book/Movie' : 'Update Book/Movie'}
            </h1>
            
            {message && <div className="text-center font-bold text-blue-600 mb-4">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
              {/* Asset Type Select */}
              <div className="flex justify-center space-x-12 mb-4 font-bold">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="assetType" value="Book" checked={formData.type === 'Book'} onChange={e => setFormData({...formData, type: e.target.value})} className="accent-blue-600 w-4 h-4" />
                  <span>Radio Button - Book</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="assetType" value="Movie" checked={formData.type === 'Movie'} onChange={e => setFormData({...formData, type: e.target.value})} className="accent-blue-600 w-4 h-4" />
                  <span>Radio Button - Movie</span>
                </label>
              </div>

              {mode === 'add' ? (
                <div className="grid grid-cols-2 items-center gap-6">
                  <label className="font-bold">Book/Movie Name</label>
                  <input required className="border border-black p-1 bg-gray-50" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  
                  <label className="font-bold">Date of Procurement</label>
                  <input type="date" required className="border border-black p-1 bg-white" value={formData.procurementDate} onChange={e => setFormData({...formData, procurementDate: e.target.value})} />
                  
                  <label className="font-bold">Quantity/Copies</label>
                  <input type="number" min="1" required className="border border-black p-1 bg-gray-50" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} />
                </div>
              ) : (
                <div className="grid grid-cols-2 items-center gap-6">
                  <label className="font-bold">Book/Movie Name</label>
                  <div className="flex space-x-2">
                    <input 
                      list="asset-list" 
                      required 
                      className="flex-1 border border-black p-1 bg-gray-50" 
                      value={formData.title} 
                      onChange={e => {
                        const val = e.target.value;
                        const match = assets.find(a => a.title === val);
                        if (match) {
                          setFormData({
                            ...formData,
                            title: val,
                            serialNo: match.serialNo,
                            procurementDate: new Date(match.procurementDate).toISOString().split('T')[0],
                            quantity: match.quantity,
                            status: match.status || 'Available'
                          } as any);
                        } else {
                          setFormData({...formData, title: val});
                        }
                      }} 
                      placeholder="Type to search..." 
                    />
                    <datalist id="asset-list">
                      {assets.map(a => <option key={a._id} value={a.title} />)}
                    </datalist>
                  </div>

                  <label className="font-bold">Serial No</label>
                  <input readOnly placeholder="Auto-populated" className="border border-black p-1 bg-gray-200 cursor-not-allowed" value={formData.serialNo} />

                  <label className="font-bold">Status</label>
                  <select className="border border-black p-1 bg-white font-bold" value={(formData as any).status || 'Available'} onChange={e => setFormData({...formData, status: e.target.value} as any)}>
                    <option>Available</option>
                    <option>Unavailable</option>
                    <option>Removed</option>
                    <option>On Repair</option>
                    <option>To Replace</option>
                  </select>

                  <label className="font-bold">Date</label>
                  <input type="date" required className="border border-black p-1 bg-white" value={formData.procurementDate} onChange={e => setFormData({...formData, procurementDate: e.target.value})} />
                </div>
              )}

              <div className="flex justify-center space-x-12 mt-12">
                <Link href="/admin/status/cancelled" className={buttonStyle}>Cancel</Link>
                <button type="submit" className={buttonStyle}>Confirm</button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button onClick={logout} className="font-bold underline uppercase text-xs">Log Out</button>
        </div>
      </div>
    </div>
  );
}
