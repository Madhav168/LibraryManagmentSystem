'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

type ReportType = 'menu' | 'books' | 'movies' | 'members' | 'active_issues' | 'overdue' | 'pending';

export default function ReportSystem() {
  const { user, logout } = useAuth();
  const [activeReport, setActiveReport] = useState<ReportType>('menu');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReport = async (type: ReportType) => {
    if (type === 'menu') return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports?type=${type}`);
      const result = await res.json();
      if (res.ok) {
        setData(result);
        setActiveReport(type);
      } else {
        alert(result.error || 'Failed to fetch report');
      }
    } catch (err) {
      alert('An error occurred while fetching the report');
    }
    setIsLoading(false);
  };

  const renderTable = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return <div className="text-center py-20 text-gray-500 font-bold">No records found for this report.</div>;
    }

    switch (activeReport) {
      case 'books':
      case 'movies':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">
              {activeReport === 'books' ? 'Master List of Books' : 'Master List of Movies'}
            </h2>
            <table className="min-w-full divide-y divide-gray-800 border-2 border-gray-800">
              <thead className="bg-gray-50 font-bold">
                <tr className="divide-x divide-gray-800">
                  <th className="px-3 py-3 text-left text-xs uppercase">Serial No</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">{activeReport === 'books' ? 'Name of Book' : 'Name of Movie'}</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Author Name</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Category</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Status</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Cost</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Procurement Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-white text-[11px] font-bold">
                {data.map((item) => (
                  <tr key={item._id} className="divide-x divide-gray-800 hover:bg-gray-50">
                    <td className="px-3 py-4">{item.serialNo}</td>
                    <td className="px-3 py-4">{item.title}</td>
                    <td className="px-3 py-4">{item.author}</td>
                    <td className="px-3 py-4">{item.category}</td>
                    <td className="px-3 py-4">{item.availableCopies > 0 ? 'Available' : 'Issued'}</td>
                    <td className="px-3 py-4">₹{item.cost?.toLocaleString() || '0'}</td>
                    <td className="px-3 py-4">{new Date(item.procurementDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'members':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center underline">List of Active Memberships</h2>
            <table className="min-w-full divide-y divide-gray-800 border-2 border-gray-800">
              <thead className="bg-gray-50 font-bold">
                <tr className="divide-x divide-gray-800">
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Membership Id</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Name of Member</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Contact Number</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Contact Address</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Aadhar Card No</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Start Date of Membership</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">End Date of Membership</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Status (Active/Inactive)</th>
                  <th className="px-2 py-3 text-left text-[10px] uppercase">Amount Pending(Fine)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-white text-[10px] font-bold">
                {data.map((item) => (
                  <tr key={item._id} className="divide-x divide-gray-800 hover:bg-gray-50">
                    <td className="px-2 py-4">{item.membershipId || item._id.slice(-6).toUpperCase()}</td>
                    <td className="px-2 py-4">{item.firstName} {item.lastName}</td>
                    <td className="px-2 py-4">{item.contactNo}</td>
                    <td className="px-2 py-4">{item.address || 'N/A'}</td>
                    <td className="px-2 py-4">{item.aadhar}</td>
                    <td className="px-2 py-4">{new Date(item.startDate).toLocaleDateString()}</td>
                    <td className="px-2 py-4">{new Date(item.endDate).toLocaleDateString()}</td>
                    <td className="px-2 py-4">{new Date(item.endDate) > new Date() ? 'Active' : 'Inactive'}</td>
                    <td className="px-2 py-4 text-red-600 font-extrabold text-xs">₹{item.pendingFine || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'pending':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center underline">Issue Requests</h2>
            <table className="min-w-full divide-y divide-gray-800 border-2 border-gray-800">
              <thead className="bg-gray-50 font-bold">
                <tr className="divide-x divide-gray-800">
                  <th className="px-3 py-3 text-left text-xs uppercase">Membership Id</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Name of Book/Movie</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Requested Date</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Request Fulfilled Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-white text-[11px] font-bold">
                {data.map((tx) => (
                  <tr key={tx._id} className="divide-x divide-gray-800 hover:bg-gray-50">
                    <td className="px-3 py-4">{tx.memberId?.membershipId || tx.memberId?._id.slice(-6).toUpperCase()}</td>
                    <td className="px-3 py-4">{tx.assetId?.title}</td>
                    <td className="px-3 py-4">{new Date(tx.createdAt || tx.issueDate).toLocaleDateString()}</td>
                    <td className="px-3 py-4">{tx.issueDate ? new Date(tx.issueDate).toLocaleDateString() : 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'active_issues':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center underline">Active Issues</h2>
            <table className="min-w-full divide-y divide-gray-800 border-2 border-gray-800">
              <thead className="bg-gray-50 font-bold">
                <tr className="divide-x divide-gray-800">
                  <th className="px-3 py-3 text-left text-xs uppercase">Serial No Book/Movie</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Name of Book/Movie</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Membership Id</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Date of Issue</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Date of return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-white text-[11px] font-bold">
                {data.map((tx) => (
                  <tr key={tx._id} className="divide-x divide-gray-800 hover:bg-gray-50">
                    <td className="px-3 py-4">{tx.serialNo || tx.assetId?.serialNo}</td>
                    <td className="px-3 py-4">{tx.assetId?.title}</td>
                    <td className="px-3 py-4">{tx.memberId?.membershipId || tx.memberId?._id.slice(-6).toUpperCase()}</td>
                    <td className="px-3 py-4">{new Date(tx.issueDate).toLocaleDateString()}</td>
                    <td className="px-3 py-4">{new Date(tx.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'overdue':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center underline">Overdue Returns</h2>
            <table className="min-w-full divide-y divide-gray-800 border-2 border-gray-800">
              <thead className="bg-gray-50 font-bold">
                <tr className="divide-x divide-gray-800">
                  <th className="px-3 py-3 text-left text-xs uppercase">Serial No Book</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Name of Book</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Membership Id</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Date of Issue</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Date of return</th>
                  <th className="px-3 py-3 text-left text-xs uppercase">Fine Calculations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-white text-[11px] font-bold">
                {data.map((tx) => {
                  const fine = Math.max(0, Math.floor((Date.now() - new Date(tx.dueDate).getTime()) / (1000 * 60 * 60 * 24))) * 10;
                  return (
                    <tr key={tx._id} className="divide-x divide-gray-800 hover:bg-gray-50">
                      <td className="px-3 py-4">{tx.serialNo || tx.assetId?.serialNo}</td>
                      <td className="px-3 py-4">{tx.assetId?.title}</td>
                      <td className="px-3 py-4">{tx.memberId?.membershipId || tx.memberId?._id.slice(-6).toUpperCase()}</td>
                      <td className="px-3 py-4">{new Date(tx.issueDate).toLocaleDateString()}</td>
                      <td className="px-3 py-4 text-red-600 font-extrabold">{new Date(tx.dueDate).toLocaleDateString()}</td>
                      <td className="px-3 py-4 text-red-600">₹{fine}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-[500px] p-6 rounded-lg shadow-sm border border-gray-200">
      {/* Header Navigation from Excel */}
      <div className="flex justify-between items-center mb-8 text-sm font-bold text-gray-700 uppercase tracking-tight">
        <span className="cursor-pointer hover:underline">Chart</span>
        <span className="text-lg font-black underline decoration-2 decoration-gray-800 underline-offset-4">Reports</span>
        <Link href={user?.role === 'Admin' ? '/admin' : '/user'} className="hover:underline">Home</Link>
      </div>

      {activeReport === 'menu' ? (
        <div className="max-w-md mx-auto mt-12 border-2 border-gray-800 p-8 rounded-lg shadow-inner bg-gray-50/30">
          <h1 className="text-2xl font-black text-center border-b-2 border-gray-800 pb-2 mb-6">Available Reports</h1>
          <ul className="space-y-4 text-lg font-black text-gray-800">
            <li>
              <button onClick={() => fetchReport('books')} className="hover:text-indigo-600 hover:underline">
                Master List of Books
              </button>
            </li>
            <li>
              <button onClick={() => fetchReport('movies')} className="hover:text-indigo-600 hover:underline">
                Master List of Movies
              </button>
            </li>
            <li>
              <button onClick={() => fetchReport('members')} className="hover:text-indigo-600 hover:underline">
                Master List of Memberships
              </button>
            </li>
            <li>
              <button onClick={() => fetchReport('active_issues')} className="hover:text-indigo-600 hover:underline">
                Active Issues
              </button>
            </li>
            <li>
              <button onClick={() => fetchReport('overdue')} className="hover:text-indigo-600 hover:underline">
                Overdue returns
              </button>
            </li>
            <li className="flex justify-between items-center pt-4">
              <button onClick={() => fetchReport('pending')} className="hover:text-indigo-600 hover:underline">
                Issue Requests
              </button>
              <button onClick={logout} className="text-gray-900 font-bold hover:underline">Log Out</button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <div className="overflow-x-auto min-h-[300px]">
            {renderTable()}
          </div>
          
          {/* Footer from Excel */}
          <div className="flex justify-between items-center mt-12 border-t pt-4">
            <button 
              onClick={() => setActiveReport('menu')}
              className="bg-blue-500 text-white font-bold py-2 px-8 rounded-lg shadow-[0_4px_0_rgb(30,58,138)] hover:brightness-110 active:translate-y-[2px] active:shadow-none transition-all"
            >
              Back
            </button>
            <button onClick={logout} className="text-gray-900 font-bold hover:underline">Log Out</button>
          </div>
        </div>
      )}
    </div>
  );
}
