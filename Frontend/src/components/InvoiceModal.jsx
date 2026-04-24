import { Printer, X, Download, ShieldCheck, CreditCard, User, Calendar, MapPin, IndianRupee, QrCode, Lock, CheckCircle2, MoreHorizontal } from 'lucide-react';

const InvoiceModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 w-full max-w-2xl min-h-screen md:min-h-0 md:rounded-[2.5rem] shadow-2xl overflow-hidden relative border-none md:border md:border-white/10 print:shadow-none print:border-none print:rounded-none">
        
        {/* Mobile Close Button */}
        <button 
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 z-50 p-2 bg-black/20 backdrop-blur-lg rounded-full text-white"
        >
            <X size={18} />
        </button>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

        {/* Header Controls (Hidden on Print) */}
        <div className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 print:hidden">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <IndianRupee size={12} />
                </div>
                <div>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-900 dark:text-white leading-none">Financial Ledger</h4>
                    <p className="text-[8px] font-bold text-gray-400 mt-0.5 uppercase tracking-tighter">Ref: {booking._id.slice(-8)}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:scale-105 transition-all text-[9px] font-black uppercase tracking-widest shadow-lg shadow-black/10">
                    <Printer size={12} /> Print
                </button>
                <button onClick={onClose} className="hidden md:flex p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6 md:p-10 space-y-8 md:space-y-10 print:p-8 relative">
            
            {/* Stamp Effect (Visual Only) - Scaled Down */}
            {booking.status === 'completed' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-green-500/20 text-green-500/20 px-6 py-2 rounded-2xl text-4xl font-black uppercase tracking-[0.4em] -rotate-12 pointer-events-none select-none z-0 border-double opacity-30 md:opacity-40">
                    PAID
                </div>
            )}

            {/* Branding & Status */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 z-10 relative">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono leading-none">
                        Local<span className="text-blue-600">Serve</span>
                    </h1>
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 font-mono mt-1">Transaction Receipt</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-1.5">
                    <div className={`px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-md ${
                        booking.status === 'completed' 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                        : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                    }`}>
                        Status: {booking.status}
                    </div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>

            {/* Entities Information - Scaled padding/size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 z-10 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-3 bg-blue-600 rounded-full" />
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Customer</h6>
                    </div>
                    <div className="space-y-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700">
                                <User size={14} />
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Bill To</p>
                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase leading-none">{booking.user?.name}</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-7 h-7 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                                <MapPin size={14} />
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Location</p>
                                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 italic leading-tight line-clamp-2">{booking.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-3 bg-indigo-600 rounded-full" />
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Provider</h6>
                    </div>
                    <div className="space-y-3 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100 dark:border-gray-700">
                                <ShieldCheck size={14} />
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Partner</p>
                                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase leading-none">{booking.provider?.name || 'Verified Pro'}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                                <Lock size={14} />
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-0.5">Provider ID</p>
                                <span className="text-[8px] font-mono text-gray-500 font-bold uppercase tracking-tight truncate w-32">{booking.provider?._id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Breakdown - Compacted */}
            <div className="z-10 relative">
                <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-800/50">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 dark:bg-white/5">
                                <th className="px-5 py-3 text-[8px] font-black uppercase tracking-widest text-gray-400">Description</th>
                                <th className="px-5 py-3 text-[8px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            <tr>
                                <td className="px-5 py-5">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none">
                                        {booking.service?.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-[8px] font-black text-gray-400 uppercase">
                                            <Calendar size={10} className="text-blue-500" /> {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-[8px] font-black text-gray-400 uppercase">
                                            <CreditCard size={10} className="text-blue-500" /> {booking.paymentMode || 'CASH'}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-5 text-right whitespace-nowrap">
                                    <span className="text-lg font-black text-gray-900 dark:text-white italic tracking-tighter">₹{booking.totalPrice?.toFixed(2)}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Totals & QR - Compacted */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-6 border-t border-gray-100 dark:border-white/5 z-10 relative">
                <div className="flex flex-row items-center gap-4 order-2 md:order-1 outline-none">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center p-1.5 shrink-0">
                        <QrCode size={40} className="text-gray-300 dark:text-gray-700" title="Verification QR" />
                    </div>
                     <div className="hidden md:block">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 italic mb-0.5 leading-none">Platform Seal</p>
                        <p className="text-[7px] font-mono text-gray-300 dark:text-gray-700 uppercase tracking-tighter">SECURE.TRANSACTION.OK</p>
                    </div>
                </div>
                
                <div className="w-full md:w-auto space-y-4 order-1 md:order-2 text-right">
                    <div className="flex flex-col items-end">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Total Settlement</p>
                        <h2 className="text-4xl font-black text-blue-600 tracking-tighter italic leading-none">₹{booking.totalPrice?.toFixed(2)}</h2>
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 text-right italic leading-none opacity-60">
                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 leading-none">Signatory: SYSTEM_ADMIN</p>
                    </div>
                </div>
            </div>

            {/* Micro-Footer - Tiny text */}
            <div className="pt-6 border-t border-gray-50 dark:border-white/5 flex flex-row items-center justify-between gap-4 text-[7px] font-black text-gray-400 uppercase tracking-widest opacity-40 z-10 relative">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Lock size={8} /> Secure Pulse</span>
                    <span className="hidden sm:inline">ID: {booking._id.slice(-6)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={8} className="text-green-500" />
                    <span>Verified Ledger</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
