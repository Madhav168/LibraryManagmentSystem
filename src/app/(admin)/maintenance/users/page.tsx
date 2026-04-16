'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UserManagement() {
  const router = useRouter();
  const { logout } = useAuth();
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    isAdmin: false,
    id: '', // For identifying existing users
  });
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    if (res.ok) setUsers(data);
  };

  const menuItems = [
    { label: 'Membership', add: '/admin/maintenance/membership', update: '/admin/maintenance/membership' },
    { label: 'Books/Movies', add: '/admin/maintenance/assets', update: '/admin/maintenance/assets' },
    { label: 'User Management', add: () => setMode('new'), update: () => setMode('existing') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = mode === 'existing';
    
    const res = await fetch('/api/users', {
      method: isEditing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(isEditing ? { ...formData } : formData),
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
                        <button onClick={item.add as any} className={`text-left hover:underline ${mode === 'new' ? 'text-blue-600' : ''}`}>Add</button>
                        <button onClick={item.update as any} className={`text-left hover:underline ${mode === 'existing' ? 'text-blue-600' : ''}`}>Update</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="col-span-9 pl-8">
            <h1 className="text-center text-xl font-black mb-8">User Management</h1>
            
            {message && <div className="text-center font-bold text-blue-600 mb-4">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-8 max-w-lg mx-auto">
              {/* User Toggle Select */}
              <div className="flex justify-center space-x-12 mb-4 font-bold">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="userType" value="new" checked={mode === 'new'} onChange={() => setMode('new')} className="accent-blue-600 w-4 h-4" />
                  <span>New User - Radio Button</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="userType" value="existing" checked={mode === 'existing'} onChange={() => setMode('existing')} className="accent-blue-600 w-4 h-4" />
                  <span>Existing User - Radio Button</span>
                </label>
              </div>

              <div className="grid grid-cols-2 items-center gap-8">
                <label className="font-bold">Name -</label>
                <div className="relative">
                  <input 
                    list="user-list"
                    required 
                    className="w-full border border-black p-1 bg-gray-50" 
                    value={formData.name} 
                    onChange={e => {
                      const val = e.target.value;
                      const match = users.find(u => u.name === val);
                      if (match && mode === 'existing') {
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
                  {mode === 'existing' && (
                    <datalist id="user-list">
                      {users.map(u => <option key={u._id} value={u.name} />)}
                    </datalist>
                  )}
                </div>
                
                <label className="font-bold">Status</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                  <span className="font-bold">- Active</span>
                </div>
                
                <label className="font-bold">Admin</label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" checked={formData.isAdmin} onChange={e => setFormData({...formData, isAdmin: e.target.checked})} className="w-5 h-5 accent-blue-600" />
                  <span className="font-bold">- Admin</span>
                </div>
              </div>

              <div className="flex justify-center space-x-12 mt-12 pt-8">
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
