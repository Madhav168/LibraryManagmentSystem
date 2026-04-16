'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MembershipMaintenance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const [mode, setMode] = useState<'add' | 'update'>((searchParams.get('mode') as any) || 'add');
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
  const [members, setMembers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'add' || qMode === 'update') {
      setMode(qMode);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (res.ok) setMembers(data);
    } catch (e) {}
  };

  const menuItems = [
    { label: 'Membership', add: '/admin/maintenance/membership?mode=add', update: '/admin/maintenance/membership?mode=update' },
    { label: 'Books/Movies', add: '/admin/maintenance/assets?mode=add', update: '/admin/maintenance/assets?mode=update' },
    { label: 'User Management', add: '/admin/maintenance/users?mode=add', update: '/admin/maintenance/users?mode=update' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    const res = await fetch('/api/members', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { ...formData, id: formData.membershipNumber } : formData),
    });

    if (res.ok) {
      router.push('/status/success');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Failed to save');
    }
  };

  const buttonStyle = "px-8 py-2 bg-blue-600 text-white font-bold rounded shadow-[0_4px_0_rgb(30,58,138)] hover:brightness-110 active:translate-y-1 active:shadow-none transition-all uppercase";

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
          <div className="col-span-1 border-r-2 border-black pr-4 min-h-[400px]">
            <div className="flex flex-col space-y-4 font-bold text-sm">
              <Link href="/admin/maintenance/membership?mode=add" className={`hover:underline ${mode === 'add' ? 'text-blue-600' : ''}`}>Add</Link>
              <Link href="/admin/maintenance/membership?mode=update" className={`hover:underline ${mode === 'update' ? 'text-blue-600' : ''}`}>Update</Link>
              <Link href="/admin/maintenance/assets?mode=add" className="hover:underline">Add</Link>
              <Link href="/admin/maintenance/assets?mode=update" className="hover:underline">Update</Link>
              <Link href="/admin/maintenance/users?mode=add" className="hover:underline">Add</Link>
              <Link href="/admin/maintenance/users?mode=update" className="hover:underline">Update</Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="col-span-9 pl-8">
            <h1 className="text-center text-xl font-black mb-8 uppercase">
              {mode === 'add' ? 'Add Membership' : 'Update Membership'}
            </h1>
            
            {message && <div className="text-center font-bold text-red-600 mb-4">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              {mode === 'add' ? (
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="font-bold">First Name</label>
                  <input required className="border border-black p-1 bg-white" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  
                  <label className="font-bold">Last Name</label>
                  <input required className="border border-black p-1 bg-white" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  
                  <label className="font-bold">Contact Name</label>
                  <input required className="border border-black p-1 bg-white" value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                  
                  <label className="font-bold">Contact Address</label>
                  <textarea required className="border border-black p-1 bg-white h-20" value={formData.contactAddress} onChange={e => setFormData({...formData, contactAddress: e.target.value})} />
                  
                  <label className="font-bold">Adadhar Card No</label>
                  <input required className="border border-black p-1 bg-white" value={formData.aadhar} onChange={e => setFormData({...formData, aadhar: e.target.value})} />
                  
                  <label className="font-bold">Start Date</label>
                  <input type="date" required className="border border-black p-1 bg-white font-bold" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  
                  <label className="font-bold">End Date</label>
                  <input type="date" required className="border border-black p-1 bg-white font-bold" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />

                  <label className="font-bold">Membership</label>
                  <div className="space-y-1 font-bold">
                    <label className="flex items-center space-x-2 font-bold italic">
                      <input type="radio" name="membershipType" value="6 Months" checked={formData.membershipType === '6 Months'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>six months</span>
                    </label>
                    <label className="flex items-center space-x-2 font-bold italic">
                      <input type="radio" name="membershipType" value="1 Year" checked={formData.membershipType === '1 Year'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>One Year</span>
                    </label>
                    <label className="flex items-center space-x-2 font-bold italic">
                      <input type="radio" name="membershipType" value="2 Years" checked={formData.membershipType === '2 Years'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>Two Years</span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="font-bold">Membership Number</label>
                  <div className="relative">
                    <input 
                      list="member-list"
                      required 
                      className="w-full border border-black p-1 bg-white font-bold" 
                      value={formData.membershipNumber} 
                      onChange={e => {
                        const val = e.target.value;
                        const match = members.find(m => m.membershipNumber === val);
                        if (match) {
                          setFormData({
                            ...formData,
                            membershipNumber: val,
                            firstName: match.firstName,
                            lastName: match.lastName,
                            startDate: new Date(match.startDate).toISOString().split('T')[0],
                            endDate: new Date(match.endDate || Date.now()).toISOString().split('T')[0],
                            membershipType: match.membershipType || '6 Months'
                          });
                        } else {
                          setFormData({...formData, membershipNumber: val});
                        }
                      }} 
                    />
                    <datalist id="member-list">
                      {members.map(m => <option key={m._id} value={m.membershipNumber}>{m.firstName} {m.lastName}</option>)}
                    </datalist>
                  </div>
                  
                  <label className="font-bold">Start Date</label>
                  <input type="date" required className="border border-black p-1 bg-white font-bold" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                  
                  <label className="font-bold">End Date</label>
                  <input type="date" required className="border border-black p-1 bg-white font-bold" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                  
                  <label className="font-bold py-2">Membership Extn:</label>
                  <div className="space-y-1 font-bold">
                    <label className="flex items-center space-x-2 font-bold italic">
                      <input type="radio" name="membershipExtn" value="6 Months" checked={formData.membershipType === '6 Months'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>six months</span>
                    </label>
                    <label className="flex items-center space-x-2 font-bold italic">
                      <input type="radio" name="membershipExtn" value="1 Year" checked={formData.membershipType === '1 Year'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>One Year</span>
                    </label>
                    <label className="flex items-center space-x-2 font-bold italic">
                      <input type="radio" name="membershipExtn" value="2 Years" checked={formData.membershipType === '2 Years'} onChange={e => setFormData({...formData, membershipType: e.target.value})} className="accent-blue-600" />
                      <span>Two Years</span>
                    </label>
                  </div>

                  <label className="font-bold">Membership Remove</label>
                  <input type="checkbox" checked={formData.isRemoved} onChange={() => setFormData({...formData, isRemoved: !formData.isRemoved})} className="w-5 h-5 accent-red-600" />
                </div>
              )}

              <div className="flex justify-center space-x-12 mt-12 pb-8">
                <Link href="/status/cancelled" className={buttonStyle}>Cancel</Link>
                <button type="submit" className={buttonStyle}>
                  {mode === 'add' ? 'Confirm' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button onClick={logout} className="font-black text-black hover:underline uppercase text-sm border-b-2 border-black">Log Out</button>
        </div>
      </div>
    </div>
  );
}
