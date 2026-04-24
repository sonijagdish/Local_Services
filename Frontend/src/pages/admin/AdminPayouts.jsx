import { useState, useEffect } from "react";
import API from "../../api/axios";
import { CreditCard, CheckCircle, XCircle, Clock, User, Mail, Wallet, Filter, Search } from 'lucide-react';
import toast from "react-hot-toast";

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchPayouts = async () => {
    try {
      const { data } = await API.get("/admin/payouts");
      setPayouts(data);
    } catch (error) {
      toast.error("Failed to sync with financial ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/admin/payouts/${id}`, { status });
      toast.success(`Payout ${status === 'completed' ? 'Approved' : 'Rejected'} Successfully`);
      fetchPayouts();
    } catch (error) {
      toast.error("Failed to update transaction state");
    }
  };

  const filtered = payouts.filter(p => filter === "all" ? true : p.status === filter);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">Disbursement HUB</h2>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Financial Settlement Monitoring</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             {["all", "pending", "completed", "rejected"].map((f) => (
                 <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      filter === f 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                 >
                     {f}
                 </button>
             ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
             <div className="py-20 text-center font-black animate-pulse text-blue-600 tracking-widest uppercase">Syncing Financial Nodes...</div>
        ) : filtered.map((payout) => (
          <div key={payout._id} className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 opacity-10 pointer-events-none ${
                payout.status === 'completed' ? 'bg-green-500' : payout.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
            }`} />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900/50 rounded-[1.5rem] flex items-center justify-center font-black text-blue-600 border border-gray-100 dark:border-gray-800 shadow-sm relative">
                        <User size={24} />
                        {payout.user?.role === 'provider' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
                        )}
                    </div>
                    <div>
                        <p className="font-black text-xl text-gray-900 dark:text-white tracking-tight leading-tight uppercase">{payout.user?.name}</p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1"><Mail size={12} /> {payout.user?.email}</span>
                            <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1"><Wallet size={12} /> Wallet: ₹{payout.user?.wallet?.toFixed(1)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 lg:text-right">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Transfer Details</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{payout.method} • <span className="font-mono">{payout.accountDetails}</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Request Amount</p>
                        <p className="text-2xl font-black text-blue-600 tracking-tighter italic">₹{payout.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {payout.status === 'pending' ? (
                            <>
                                <button 
                                    onClick={() => handleUpdateStatus(payout._id, 'completed')}
                                    className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 hover:bg-green-600 hover:text-white rounded-2xl transition-all shadow-lg active:scale-95 border border-transparent"
                                    title="Approve Disbursement"
                                >
                                    <CheckCircle size={20} />
                                </button>
                                <button 
                                    onClick={() => handleUpdateStatus(payout._id, 'rejected')}
                                    className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-lg active:scale-95 border border-transparent"
                                    title="Reject & Refund"
                                >
                                    <XCircle size={20} />
                                </button>
                            </>
                        ) : (
                            <div className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                                payout.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                {payout.status === 'completed' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                {payout.status}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-700/50 flex flex-col md:flex-row items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Clock size={12} /> Requested: {new Date(payout.createdAt).toLocaleString()}</span>
                    <span>TID: {payout._id}</span>
                </div>
                <div className="mt-4 md:mt-0 opacity-40">Financial Integrity Verified • Bank-Grade Encryption Active</div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
          <div className="p-20 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
              <CreditCard className="mx-auto text-gray-100 dark:text-gray-800 w-24 h-24 mb-6 animate-bounce" />
              <p className="text-xl font-black text-gray-400 uppercase tracking-[0.3em] opacity-40">Zero Transaction Packets Found</p>
          </div>
      )}
    </div>
  );
};

export default AdminPayouts;
