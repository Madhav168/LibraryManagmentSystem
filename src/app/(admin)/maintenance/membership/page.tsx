'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AddMembership() {
  const router = useRouter();
  const { logout } = useAuth();
  const [mode, setMode] = useState<'add' | 'update'>('add');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    contactName: '',
    contactAddress: '',
    aadhar: '',
    membershipType: '6 Months',
    membershipNumber: '',
    isRemoved: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [message, setMessage] = useState('');

  const menuItems = [
    { label: 'Membership', add: () => setMode('add'), update: () => setMode('update') },
    { label: 'Books/Movies', add: '/admin/maintenance/assets', update: '/admin/maintenance/assets' },
    { label: 'User Management', add: '/admin/maintenance/users', update: '/admin/maintenance/users' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    // In a real app, 'update' would use Membership Number to find the ID
    const res = await fetch('/api/members', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { ...formData, id: formData.membershipNumber } : formData),
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
            <span className="text-xl font-bold mt-2 ml-16 underline underline-offset-4">Reports</span>
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
              {mode === 'add' ? 'Add Membership' : 'Update Membership'}
            </h1>
            
            {message && <div className="text-center font-bold text-blue-600 mb-4">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              {mode === 'add' ? (
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="font-bold">First Name</label>
                  <input required className="border border-black p-1 bg-gray-50" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  
                  <label className="font-bold">Last Name</label>
                  <input required className="border border-black p-1 bg-gray-50" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  
                  <label className="font-bold">Contact Name</label>
                  <input required className="border border-black p-1 bg-gray-50" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                  
                  <label className="font-bold">Contact Address</label>
                  <input required className="border border-black p-1 bg-gray-50" value={formData.contactAddress} onChange={e => setFormData({...formData, contactAddress: e.target.value})} />
                  
                  <label className="font-bold">Adadhar Card No</label>
                  <input required className="border border-black p-1 bg-gray-50" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} />
                  
                  <label className="font-bold">Start Date</label>
                  <input type="date" required className="border border-black p-1 bg-white" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  
                  <label className="font-bold">End Date</label>
                  <input type="date" required className="border border-black p-1 bg-white" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              ) : (
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="font-bold">Membership Number</label>
                  <input required className="border border-black p-1 bg-gray-50" value={formData.membershipNumber} onChange={e => setFormData({...formData, membershipNumber: e.target.value})} />
                  
                  <label className="font-bold">Start Date</label>
                  <input type="date" required className="border border-black p-1 bg-white" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  
                  <label className="font-bold">End Date</label>
                  <input type="date" required className="border border-black p-1 bg-white" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  
                  <label className="font-bold py-2">Membership Extn:</label>
                  <div className="space-y-1 font-bold">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="membershipExtn" value="6 Months" checked={formData.membershipType === '6 Months'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>six months</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="membershipExtn" value="1 Year" checked={formData.membershipType === '1 Year'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>One Year</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="membershipExtn" value="2 Years" checked={formData.membershipType === '2 Years'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>Two Years</span>
                    </label>
                  </div>

                  <label className="font-bold">Membership Remove</label>
                  <input type="radio" checked={formData.isRemoved} onClick={() => setFormData({...formData, isRemoved: !formData.isRemoved})} className="w-5 h-5 accent-red-600" />
                </div>
              )}

              {mode === 'add' && (
                <div className="grid grid-cols-2 items-center gap-4 mt-4">
                  <label className="font-bold">Membership</label>
                  <div className="space-y-1 font-bold">
                    <label className="flex items-center space-x-2">
                      <input type="radio" name="membershipType" value="6 Months" checked={formData.membershipType === '6 Months'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>six months</span>
                    </label>
                    {/* ... other radios ... */}
                  </div>
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
