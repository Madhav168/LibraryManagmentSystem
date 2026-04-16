'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function UsersForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  
  const [mode, setMode] = useState<'add' | 'update'>((searchParams.get('mode') as any) || 'add');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    password: '',
  });
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'add' || qMode === 'update') setMode(qMode);
  }, [searchParams]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isUpdate = mode === 'update';
    
    const res = await fetch('/api/users', {
      method: isUpdate ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isUpdate ? { ...formData, id: formData.email } : formData),
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

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
              {mode === 'add' ? (
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="font-bold">User Name</label>
                  <input required className="border border-black p-1 bg-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  
                  <label className="font-bold">Email/User ID</label>
                  <input required type="email" className="border border-black p-1 bg-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  
                  <label className="font-bold">Role</label>
                  <select className="border border-black p-1 bg-white font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option>User</option>
                    <option>Admin</option>
                  </select>
                  
                  <label className="font-bold">Password</label>
                  <input required type="password" className="border border-black p-1 bg-white" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              ) : (
                <div className="grid grid-cols-2 items-center gap-4">
                  <label className="font-bold">Email/User ID</label>
                  <div className="relative">
                    <input 
                      list="user-list"
                      required 
                      className="w-full border border-black p-1 bg-white font-bold" 
                      value={formData.email}
                      onChange={e => {
                        const val = e.target.value;
                        const match = users.find(u => u.email === val);
                        if (match) {
                          setFormData({
                            ...formData,
                            email: val,
                            name: match.name,
                            role: match.role || 'User',
                            password: '', // Keep password empty for security during update
                          });
                        } else {
                          setFormData({...formData, email: val});
                        }
                      }} 
                    />
                    <datalist id="user-list">
                      {users.map(u => <option key={u._id} value={u.email}>{u.name}</option>)}
                    </datalist>
                  </div>

                  <label className="font-bold">User Name</label>
                  <input readOnly className="border border-black p-1 bg-gray-200 cursor-not-allowed" value={formData.name || 'Search Email...'} />
                  
                  <label className="font-bold">Role</label>
                  <select className="border border-black p-1 bg-white font-bold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option>User</option>
                    <option>Admin</option>
                  </select>
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

export default function UsersMaintenance() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-bold">Loading...</div>}>
      <UsersForm />
    </Suspense>
  );
}
