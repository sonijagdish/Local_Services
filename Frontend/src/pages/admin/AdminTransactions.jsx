import { useState, useEffect } from "react";
import API from "../../api/axios";
import { CreditCard, IndianRupee, PieChart, TrendingUp, User, Briefcase, Clock, ShieldCheck, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import toast from "react-hot-toast";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await API.get("/admin/transactions");
        setTransactions(data);
      } catch (error) {
        toast.error("Failed to load transaction ledger");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalVolume = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.platformCharge, 0);

  if (loading) return <div className="text-center py-10 animate-pulse text-blue-600 font-black uppercase tracking-[0.3em]">Syncing Revenue Ledger...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Revenue Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <TrendingUp className="absolute right-[-10px] bottom-[-10px] size-24 opacity-10 group-hover:scale-125 transition-transform" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Platform Gross</p>
              <h3 className="text-4xl font-black tracking-tighter italic">₹{totalVolume.toLocaleString()}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative group">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl w-fit mb-4">
                  <PieChart size={24} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Net Revenue (Platform Charge)</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mt-2">₹{totalCommission.toLocaleString()}</h3>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative group">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl w-fit mb-4">
                  <Clock size={24} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Transactions</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mt-2">{transactions.length} Nodes</h3>
          </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Transaction History</h3>
              <div className="px-4 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                  Live Buffer Active
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-900/50">
                          <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction / Date</th>
                          <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User / Customer</th>
                          <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider / Partner</th>
                          <th className="px-6 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Split Logic</th>
                          <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Amount</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                      {transactions.length > 0 ? transactions.map((t) => (
                          <tr key={t._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-900/30 transition-colors group">
                              <td className="px-10 py-8">
                                  <div className="flex items-center gap-4">
                                      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                          <CreditCard size={18} />
                                      </div>
                                      <div>
                                          <p className="text-xs font-black text-gray-900 dark:text-white font-mono tracking-tighter mb-1 uppercase">TXN_{t._id.slice(-8)}</p>
                                          <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(t.createdAt).toLocaleString()}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-8">
                                  <div className="flex items-center gap-3">
                                      <User size={14} className="text-gray-400" />
                                      <div>
                                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{t.user?.name}</p>
                                          <p className="text-[10px] font-bold text-gray-400 opacity-60">{t.user?.email}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-8">
                                  <div className="flex items-center gap-3">
                                      <Briefcase size={14} className="text-blue-500" />
                                      <div>
                                          <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{t.provider?.name}</p>
                                          <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Verified Pro</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-8">
                                  <div className="flex flex-col gap-2">
                                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                          <ArrowUpCircle size={10} /> Platform: ₹{t.platformCharge.toFixed(2)}
                                      </div>
                                      <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                          <ArrowDownCircle size={10} /> Provider: ₹{t.providerShare.toFixed(2)}
                                      </div>
                                  </div>
                              </td>
                              <td className="px-10 py-8 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                      <IndianRupee size={16} className="text-gray-400" />
                                      <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic">₹{t.totalAmount}</span>
                                  </div>
                                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Status: Captured</span>
                              </td>
                          </tr>
                      )) : (
                          <tr>
                              <td colSpan="5" className="px-10 py-24 text-center">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-40">Zero transaction nodes detected in the ledger.</p>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default AdminTransactions;
