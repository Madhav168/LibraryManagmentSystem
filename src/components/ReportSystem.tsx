'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Loader2, 
  Book, 
  Film, 
  Users, 
  Clock, 
  AlertTriangle, 
  ClipboardList,
  ChevronRight,
  Download,
  Filter,
  FileText,
  Home
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ReportType = 'menu' | 'books' | 'movies' | 'members' | 'active_issues' | 'overdue' | 'pending';

export default function ReportSystem() {
  const { user } = useAuth();
  const [activeReport, setActiveReport] = useState<ReportType>('menu');
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const reports = [
    { type: 'books', label: 'Master List of Books', desc: 'Comprehensive asset catalog: Volumes', icon: Book },
    { type: 'movies', label: 'Master List of Movies', desc: 'Comprehensive asset catalog: Media', icon: Film },
    { type: 'members', label: 'Master List of Memberships', desc: 'Active directory of registered personnel', icon: Users },
    { type: 'active_issues', label: 'Active Issues', desc: 'Real-time allocation status audit', icon: Clock },
    { type: 'overdue', label: 'Overdue returns', desc: 'Flagged contractual breaches', icon: AlertTriangle },
    { type: 'pending', label: 'Pending Issue Requests', desc: 'Queued allocation authorizations', icon: ClipboardList },
  ];

  const fetchReport = async (type: ReportType) => {
    if (type === 'menu') return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/reports?type=${type}`);
      const result = await res.json();
      if (res.ok) {
        setData(result);
        setActiveReport(type);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const getReportHeader = () => {
    const report = reports.find(r => r.type === activeReport);
    return report ? { label: report.label, desc: report.desc, Icon: report.icon } : { label: 'Data Output', desc: 'Generated system report', Icon: FileText };
  };

  const { label, desc, Icon } = getReportHeader();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-[#e6af2e]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#191716]/40">System Overview</span>
          </div>
          <h1 className="text-5xl font-black text-[#191716] uppercase tracking-tighter">
            Reports
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {activeReport !== 'menu' && (
            <Button 
              variant="outline"
              onClick={() => setActiveReport('menu')}
              className="font-black uppercase tracking-widest text-[#191716] hover:bg-[#191716] hover:text-[#e6af2e] px-6 h-14 rounded-2xl border-2 border-[#191716]/10 transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Reports
            </Button>
          )}
          <Button 
            asChild
            variant="ghost"
            className="font-black uppercase tracking-widest text-[#191716] hover:bg-[#e6af2e]/10 px-6 h-14 rounded-2xl border-2 border-[#191716]/5"
          >
            <Link href={user?.role === 'Admin' ? '/admin' : '/user'}>
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {activeReport === 'menu' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
          {reports.map((report) => (
            <Card 
              key={report.type}
              className="group border-none shadow-xl bg-white overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={() => fetchReport(report.type as ReportType)}
            >
              <CardHeader className="p-8 bg-[#191716] text-[#e0e2db]">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#e6af2e] p-3 rounded-2xl">
                    <report.icon className="h-6 w-6 text-[#191716]" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#e6af2e] opacity-40 group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight group-hover:text-[#e6af2e] transition-colors">
                  {report.label}
                </CardTitle>
                <CardDescription className="text-[#e0e2db]/60 font-bold text-xs uppercase tracking-wider line-clamp-2 mt-1">
                  {report.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="w-full h-1 bg-[#191716]/5 rounded-full overflow-hidden">
                  <div className="w-0 group-hover:w-full h-full bg-[#e6af2e] transition-all duration-700"></div>
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#191716]/40">Execute Generation</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="animate-in zoom-in-95 duration-500">
           <Card className="border-none shadow-2xl overflow-hidden bg-white pt-0">
            <div className="bg-[#191716] text-[#e0e2db] p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-[#e6af2e] p-3 rounded-xl">
                    <Icon className="h-6 w-6 text-[#191716]" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tight">{label}</CardTitle>
                    <CardDescription className="text-[#e0e2db]/60 font-bold uppercase tracking-widest text-[10px]">{desc}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/10 text-[#e6af2e]">
                    <Filter className="h-5 w-5" />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-[#e0e2db]/40">Real-time Indexed</p>
                </div>
              </div>
            </div>
            <CardContent className="p-0">
               {isLoading ? (
                 <div className="p-32 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#e6af2e] border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black uppercase tracking-widest text-xs text-[#191716]/40">Compiling Report Data...</p>
                 </div>
               ) : data.length === 0 ? (
                 <div className="p-32 flex flex-col items-center justify-center gap-4 opacity-30">
                    <ClipboardList className="h-16 w-16" />
                    <p className="font-black uppercase tracking-widest text-xs">No entries found for this query.</p>
                 </div>
               ) : (
                 <>
                   <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-[#191716]/5 sticky top-0 z-10">
                        <TableRow className="border-b-[#191716]/10">
                           {activeReport === 'members' ? (
                             <>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] pl-10 h-16">Membership Id</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Name of Member</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Contact Number</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Contact Address</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Aadhar Card No</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Start Date</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">End Date</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Status</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-right pr-10">Amount Pending(Fine)</TableHead>
                             </>
                           ) : activeReport === 'books' || activeReport === 'movies' ? (
                             <>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] pl-10 h-16">Serial No</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-left">Name of {activeReport === 'books' ? 'Book' : 'Movie'}</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-left">Author Name</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-left">Category</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-center">Status</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-left">Cost</TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-right pr-10">Procurement Date</TableHead>
                             </>
                           ) : (
                             <>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] pl-10 h-16">
                                 {activeReport === 'pending' ? 'Membership Id' : 'Serial No Book/Movie'}
                               </TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">
                                 {activeReport === 'pending' ? 'Name of Book/Movie' : 'Name of Book/Movie'}
                               </TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">
                                 {activeReport === 'pending' ? 'Requested Date' : 'Membership Id'}
                               </TableHead>
                               <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">
                                 {activeReport === 'pending' ? 'Request Fulfilled Date' : 'Date of Issue'}
                               </TableHead>
                               {activeReport !== 'pending' && (
                                 <TableHead className="font-black uppercase tracking-widest text-[10px] h-16">Date of return</TableHead>
                               )}
                               {activeReport === 'overdue' && (
                                 <TableHead className="font-black uppercase tracking-widest text-[10px] h-16 text-right pr-10">Fine Calculations</TableHead>
                               )}
                             </>
                           )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((item, idx) => (
                           <TableRow key={idx} className="hover:bg-[#e6af2e]/5 border-b-[#191716]/5">
                              {activeReport === 'members' ? (
                                <>
                                  <TableCell className="pl-10 h-20 font-mono text-[10px] font-bold text-[#191716]/60">{item.membershipNumber || item.membershipId || item._id.slice(-6).toUpperCase()}</TableCell>
                                  <TableCell className="font-black text-[#191716] uppercase tracking-tight">{item.firstName} {item.lastName}</TableCell>
                                  <TableCell className="text-xs font-bold text-[#191716]/60 font-mono">{item.contactNo || '8811002233'}</TableCell>
                                  <TableCell className="text-xs font-bold text-[#191716]/60 uppercase max-w-[200px] truncate">{item.contactAddress || 'Global Suburb'}</TableCell>
                                  <TableCell className="text-xs font-bold text-[#191716]/60 font-mono">{item.aadhar}</TableCell>
                                  <TableCell className="text-[10px] font-bold text-[#191716]/60">{new Date(item.startDate || Date.now()).toLocaleDateString()}</TableCell>
                                  <TableCell className="text-[10px] font-bold text-[#191716]/60">{new Date(item.endDate || Date.now()).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    <Badge className={`${new Date(item.endDate) > new Date() ? 'bg-green-600' : 'bg-red-600'} text-white rounded-full px-4 text-[9px] font-black uppercase tracking-widest border-none`}>
                                      {new Date(item.endDate) > new Date() ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-right pr-10">
                                    <p className={`font-black uppercase tracking-widest ${item.pendingFine > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                      ₹{item.pendingFine || 0}
                                    </p>
                                  </TableCell>
                                </>
                              ) : activeReport === 'books' || activeReport === 'movies' ? (
                                <>
                                  <TableCell className="pl-10 h-20 font-mono text-[10px] font-bold text-[#191716]/60">{item.serialNo}</TableCell>
                                  <TableCell className="font-black text-[#191716] uppercase tracking-tight">{item.title}</TableCell>
                                  <TableCell className="text-xs font-bold text-[#191716]/60 uppercase">{item.author}</TableCell>
                                  <TableCell className="text-xs font-bold text-[#191716]/60 uppercase">{item.type || (activeReport === 'books' ? 'Book' : 'Movie')}</TableCell>
                                  <TableCell className="text-center">
                                     <Badge variant="outline" className={`rounded-full px-4 text-[9px] font-black uppercase tracking-widest ${item.availableCopies > 0 ? 'border-green-200 text-green-700' : 'border-amber-200 text-amber-700'}`}>
                                      {item.status || (item.availableCopies > 0 ? 'Available' : 'Issued')}
                                     </Badge>
                                  </TableCell>
                                  <TableCell className="font-black text-[#191716]">₹{item.cost || 0}</TableCell>
                                  <TableCell className="text-right pr-10 font-bold text-[#191716]/60 text-[10px]">
                                    {new Date(item.date || Date.now()).toLocaleDateString()}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className="pl-10 h-20 font-mono text-[10px] font-bold text-[#191716]/60">
                                    {activeReport === 'pending' ? (item.memberId?.membershipNumber || 'MID-1234') : (item.assetId?.serialNo || item.serialNo)}
                                  </TableCell>
                                  <TableCell className="font-black text-[#191716] uppercase tracking-tight">
                                    {item.assetId?.title}
                                  </TableCell>
                                  <TableCell className="text-xs font-bold text-[#191716]/60 font-mono uppercase">
                                    {activeReport === 'pending' ? new Date(item.issueDate).toLocaleDateString() : (item.memberId?.membershipNumber || 'MID-1234')}
                                  </TableCell>
                                  <TableCell className="text-xs font-bold text-[#191716]/60 font-mono uppercase">
                                    {activeReport === 'pending' ? (item.actualReturnDate ? new Date(item.actualReturnDate).toLocaleDateString() : 'PENDING') : new Date(item.issueDate).toLocaleDateString()}
                                  </TableCell>
                                  {activeReport !== 'pending' && (
                                    <TableCell className="text-[10px] font-bold text-[#191716]/60">
                                      {new Date(item.dueDate).toLocaleDateString()}
                                    </TableCell>
                                  )}
                                  {activeReport === 'overdue' && (
                                    <TableCell className="text-right pr-10">
                                      <p className="font-black text-red-600 uppercase tracking-widest text-xs">
                                        ₹{Math.max(0, Math.floor((Date.now() - new Date(item.dueDate).getTime()) / (1000 * 60 * 60 * 24))) * 10}
                                      </p>
                                    </TableCell>
                                  )}
                                </>
                              )}
                           </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
                 <div className="p-8 border-t border-[#191716]/5 flex items-center justify-between bg-[#191716]/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#191716]/40">
                      View Range: {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, data.length)} / Total {data.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveReport('menu')}
                        className="rounded-xl border-2 border-[#191716]/5 font-black uppercase tracking-widest text-[9px] px-6 h-10 mr-4 hover:bg-[#191716] hover:text-[#e6af2e]"
                      >
                        <ArrowLeft className="mr-1 h-3 w-3" />
                        Back
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="rounded-xl border-2 border-[#191716]/5 font-black uppercase tracking-widest text-[9px] px-6 h-10"
                      >
                        Prev
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-xl border-2 border-[#191716]/5 font-black uppercase tracking-widest text-[9px] px-6 h-10"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
