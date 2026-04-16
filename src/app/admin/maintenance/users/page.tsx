'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UserMaintenance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const [mode, setMode] = useState<'add' | 'update'>((searchParams.get('mode') as any) || 'add');
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    isAdmin: false,
    id: '', // For identifying existing users
  });
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'add' || qMode === 'update') {
      setMode(qMode);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch(e) {}
  };

  const menuItems = [
    { label: 'Membership', add: '/admin/maintenance/membership?mode=add', update: '/admin/maintenance/membership?mode=update' },
    { label: 'Books/Movies', add: '/admin/maintenance/assets?mode=add', update: '/admin/maintenance/assets?mode=update' },
    { label: 'User Management', add: '/admin/maintenance/users?mode=add', update: '/admin/maintenance/users?mode=update' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    const res = await fetch('/api/users', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { ...formData } : formData),
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
          <div className="col-span-2 border-r-2 border-black pr-4 min-h-[400px]">
            <div className="flex flex-col space-y-4 font-bold text-sm">
              <Link href="/admin/maintenance/membership?mode=add" className="hover:underline">Add</Link>
              <Link href="/admin/maintenance/membership?mode=update" className="hover:underline">Update</Link>
              <Link href="/admin/maintenance/assets?mode=add" className="hover:underline">Add</Link>
              <Link href="/admin/maintenance/assets?mode=update" className="hover:underline">Update</Link>
              <Link href="/admin/maintenance/users?mode=add" className={`hover:underline ${mode === 'add' ? 'text-blue-600' : ''}`}>Add</Link>
              <Link href="/admin/maintenance/users?mode=update" className={`hover:underline ${mode === 'update' ? 'text-blue-600' : ''}`}>Update</Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="col-span-10 pl-8">
            <h1 className="text-center text-xl font-black mb-8 uppercase">
              {mode === 'add' ? 'Add User' : 'Update User'}
            </h1>
            
            {message && <div className="text-center font-bold text-red-600 mb-4">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
              <div className="flex justify-center space-x-12 mb-4 font-bold border-b border-gray-100 pb-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" value="add" checked={mode === 'add'} onChange={() => setMode('add')} className="accent-blue-600" />
                  <span>New User</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" value="update" checked={mode === 'update'} onChange={() => setMode('update')} className="accent-blue-600" />
                  <span>Existing User</span>
                </label>
              </div>

              <div className="grid grid-cols-2 items-center gap-8">
                <label className="font-bold">Name</label>
                <div className="relative">
                  <input 
                    list="user-list"
                    required 
                    className="w-full border border-black p-1 bg-white font-bold" 
                    value={formData.name} 
                    onChange={e => {
                      const val = e.target.value;
                      const match = users.find(u => u.name === val);
                      if (match && mode === 'update') {
                        setFormData({
                          name: val,
                          isActive: match.status === 'Active',
                          isAdmin: match.role === 'Admin',
                          id: match._id
                        });
                      } else {
                        setFormData({...formData, name: val});
                      }
                    }} 
                  />
                  {mode === 'update' && (
                    <datalist id="user-list">
                      {users.map(u => <option key={u._id} value={u.name} />)}
                    </datalist>
                  )}
                </div>
                
                <label className="font-bold text-blue-700">Active</label>
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                
                <label className="font-bold text-blue-700">Admin Privileges</label>
                <input type="checkbox" checked={formData.isAdmin} onChange={e => setFormData({...formData, isAdmin: e.target.checked})} className="w-5 h-5 accent-blue-600" />
              </div>

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
