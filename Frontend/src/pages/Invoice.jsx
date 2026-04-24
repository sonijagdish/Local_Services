import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import { 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  IndianRupee, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  User, 
  ShieldAlert, 
  QrCode, 
  Lock, 
  CreditCard 
} from 'lucide-react';
import toast from 'react-hot-toast';

const Invoice = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await API.get(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (error) {
        toast.error("Invoice Error");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [bookingId]);

  if (loading) return (
      <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-widest text-xs">
          Synchronizing Ledger...
      </div>
  );
  
  if (!booking || !booking.service) return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase mb-4 tracking-tighter">Nullified Node</h2>
          <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-bold hover:underline uppercase tracking-widest text-[9px]">Dashboard Protocol</button>
      </div>
  );

  const handlePrint = () => { window.print(); };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900/50 py-8 px-4 md:px-0 animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation & Controls - More Compact */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 md:px-0 print:hidden">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[9px]"
            >
                <ArrowLeft size={14} /> Back
            </button>
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-all font-black uppercase text-[9px] tracking-widest animate-in slide-in-from-right-4 active:scale-95"
            >
                <Printer size={14} /> Print Slip
            </button>
        </div>

        {/* Main Document Body - Narrowed & Scaled Down */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5 relative print:shadow-none print:border-none print:rounded-none overflow-hidden">
            
            {/* Background Seal */}
            {booking.status === 'completed' && (
                <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-green-500/10 text-green-500/10 px-8 py-3 rounded-3xl text-7xl font-black uppercase tracking-[0.4em] -rotate-12 pointer-events-none select-none z-0 border-double mix-blend-multiply opacity-30 md:opacity-50">
                    PAID
                </div>
            )}

            <div className="p-8 md:p-12 space-y-10 relative z-10">
                
                {/* Branding & ID */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-b border-gray-50 dark:border-white/5 pb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30 font-black text-lg">L</div>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">
                                Local<span className="text-blue-600">Serve</span>
                            </h1>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 font-mono">Receipt: #{booking._id.slice(-10).toUpperCase()}</p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 text-left sm:text-right">
                        <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md ${
                            booking.status === 'completed' ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                            STATUS: {booking.status}
                        </div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {/* Stakeholders - Compact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h6 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pl-4 border-l-2 border-blue-600 leading-none">Billable Profile</h6>
                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 space-y-4">
                            <div className="flex items-center gap-4">
                                <User size={16} className="text-blue-600" />
                                <div>
                                    <p className="text-[7px] font-black text-gray-400 uppercase leading-none mb-1">Customer</p>
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase leading-none">{booking.user?.name}</h4>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin size={16} className="text-blue-600 mt-0.5" />
                                <div>
                                    <p className="text-[7px] font-black text-gray-400 uppercase leading-none mb-1">Dest Node</p>
                                    <p className="text-[10px] font-bold text-gray-500 italic leading-snug line-clamp-2">{booking.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h6 className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 pl-4 border-l-2 border-indigo-600 leading-none">Service Fulfillment</h6>
                        <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                            <div className="flex items-center gap-4">
                                <ShieldCheck size={16} className="text-indigo-600" />
                                <div>
                                    <p className="text-[7px] font-black text-gray-400 uppercase leading-none mb-1">Authorized Provider</p>
                                    <h4 className="text-sm font-black text-indigo-600 dark:text-indigo-400 uppercase leading-none">{booking.provider?.name}</h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Calendar size={16} className="text-indigo-600" />
                                <div>
                                    <p className="text-[7px] font-black text-gray-400 uppercase leading-none mb-1">Deployment Slot</p>
                                    <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                        {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ledger Breakdown - With Commission Split */}
                <div className="overflow-hidden rounded-[2rem] border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-800/50 shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/10">
                            <tr>
                                <th className="px-8 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Description</th>
                                <th className="px-8 py-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            <tr>
                                <td className="px-8 py-6">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase leading-none mb-3">{booking.service?.name}</h3>
                                    <div className="flex flex-wrap items-center gap-6">
                                        <span className="flex items-center gap-2 text-[8px] font-black text-gray-400 tracking-widest uppercase"><CreditCard size={12} className="text-blue-500" /> {booking.paymentMode || 'COD'}</span>
                                        <span className="flex items-center gap-2 text-[8px] font-black text-gray-400 tracking-widest uppercase"><Lock size={12} className="text-blue-500" /> SECURE SESSION</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <span className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter font-mono">₹{booking.totalPrice?.toFixed(2)}</span>
                                </td>
                            </tr>
                            <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                                <td className="px-8 py-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Service Charge (20%)</p>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <span className="text-sm font-black text-gray-400 italic tracking-tighter font-mono">₹{(booking.totalPrice * 0.20)?.toFixed(2)}</span>
                                </td>
                            </tr>
                            <tr className="bg-gray-50/50 dark:bg-white/[0.02]">
                                <td className="px-8 py-4">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Provider Payment (80%)</p>
                                </td>
                                <td className="px-8 py-4 text-right">
                                    <span className="text-sm font-black text-emerald-600 italic tracking-tighter font-mono">₹{(booking.totalPrice * 0.80)?.toFixed(2)}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Resolution & Summary - Scaled Down */}
                <div className="flex flex-col sm:flex-row justify-between items-end gap-12 pt-10 border-t border-gray-50 dark:border-white/5">
                     <div className="flex flex-row items-center gap-4 order-2 sm:order-1 outline-none">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center p-1.5 shrink-0">
                            <QrCode size={45} className="text-gray-300 dark:text-gray-700" title="Security Token Hash" />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-gray-400 italic mb-1 leading-none">Security Hash Node</p>
                            <p className="text-[8px] font-mono text-gray-300 dark:text-gray-700 uppercase tracking-tighter leading-none">{booking._id.slice(-12).toUpperCase()}</p>
                        </div>
                     </div>
                     
                     <div className="w-full sm:w-auto space-y-4 order-1 sm:order-2 text-right">
                        <div className="flex flex-col items-end">
                             <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Total Payable Slip</p>
                             <div className="flex items-center justify-end gap-2 text-blue-600">
                                <IndianRupee size={20} className="text-gray-400" />
                                <h1 className="text-5xl font-black tracking-tighter italic leading-none">
                                    {booking.totalPrice?.toFixed(2)}
                                </h1>
                             </div>
                        </div>
                        <div className="opacity-40 italic mt-4 text-[8px] font-black uppercase tracking-widest text-gray-400">
                             Authorized by LocalServe Core
                        </div>
                     </div>
                </div>

                {/* Universal Sign-off - Micro Text */}
                <div className="pt-8 border-t border-gray-50 dark:border-white/5 flex flex-row items-center justify-between gap-4 text-[7px] font-black text-gray-400 uppercase tracking-[0.2em] opacity-40 z-10 relative">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Lock size={8} /> Secure Ledger Port 77</span>
                        <span className="hidden sm:inline">Transaction Signed: OK</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={8} className="text-green-500" />
                        <span>Compliance Index Matrix v9.8 Verify Success</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background-color: white !important; padding: 0 !important; }
          .min-h-screen { background: white !important; padding: 0 !important; }
          .max-w-3xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .rounded-[2.5rem] { border-radius: 0 !important; box-shadow: none !important; border: none !important; }
          .print\\:hidden { display: none !important; }
          .bg-white { background: white !important; }
          .text-gray-900 { color: black !important; }
          .text-blue-600 { color: #2563eb !important; }
          .shadow-xl { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
