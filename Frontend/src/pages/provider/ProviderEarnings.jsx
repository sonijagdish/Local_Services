import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import { TrendingUp, ArrowUpRight, CheckCircle, Clock, BarChart3, Wallet, CreditCard, Send, History, Info } from 'lucide-react';
import { BarChart, Bar, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from "react-hot-toast";

const PLATFORM_COMMISSION = 0.20; // 20% platform fee

const ProviderEarnings = () => {
  const { user, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payoutForm, setPayoutForm] = useState({ amount: "", method: "UPI", accountDetails: "" });
  const [showPayoutForm, setShowPayoutForm] = useState(false);

  const fetchData = async () => {
    try {
        const [{ data: bookings }, { data: payoutList }] = await Promise.all([
          API.get("/bookings/provider-bookings"),
          API.get("/users/payouts")
        ]);

        const myCompletedBookings = bookings
            .filter(b => b.status === 'completed' && b.isPaid)
            .sort((a,b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        
        setHistory(myCompletedBookings.slice(0, 5));
        setPayouts(payoutList);

        // Group by date for chart (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const plotData = last7Days.map(date => {
            const dayBookings = myCompletedBookings.filter(b => (b.updatedAt || b.createdAt).startsWith(date));
            const revenue = dayBookings.reduce((acc, b) => {
                const total = b.totalPrice || b.service?.price || 0;
                return acc + Math.round(total * (1 - PLATFORM_COMMISSION));
            }, 0);
            return { day: date.split('-').slice(2).join(''), amount: revenue };
        });
        setChartData(plotData);
    } catch (error) {
        console.error("Failed to fetch earnings", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
      refreshUser(); // Sync latest wallet balance
    }
  }, []);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (!payoutForm.amount || !payoutForm.accountDetails) {
        toast.error("Please fill all deployment parameters");
        return;
    }

    try {
      await API.post("/users/payout", payoutForm);
      toast.success("Payout Request Transmitted Successfully!");
      setShowPayoutForm(false);
      setPayoutForm({ amount: "", method: "UPI", accountDetails: "" });
      fetchData();
      refreshUser(); // Refresh wallet after payout deduction
    } catch (error) {
      toast.error(error.response?.data?.message || "Payout sequence failed");
    }
  };

  if (loading) return <div className="text-center py-10 animate-pulse text-blue-600 font-black uppercase tracking-widest">Financial Grid Syncing...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700 pb-12">
      {/* Wallet Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-white group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
              <Wallet className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none" size={120} />
              
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2 relative z-10">Available Balance</p>
              <h2 className="text-5xl font-black tracking-tighter mb-8 italic relative z-10">₹{user?.wallet?.toFixed(1) || '0.0'}</h2>
              
              <button 
                onClick={() => setShowPayoutForm(!showPayoutForm)}
                className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase text-xs tracking-widest relative z-10"
              >
                  {showPayoutForm ? 'Cancel Request' : 'Request Payout'} <Send size={16} />
              </button>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl">
                        <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                      <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Revenue Stream</h4>
                      <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mt-1">Last 7 Days activity node</p>
                  </div>
              </div>
              <div className="h-[150px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                          <Tooltip 
                            contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px' }}
                          />
                          <Bar dataKey="amount" radius={[8, 8, 8, 8]} barSize={40}>
                              {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#2563eb' : '#94a3b8'} opacity={index === chartData.length - 1 ? 1 : 0.3} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {showPayoutForm && (
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl border border-blue-100 dark:border-blue-900/20 animate-in zoom-in-95 duration-300">
             <div className="flex items-center gap-3 mb-8">
                 <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
                    <CreditCard size={24} />
                 </div>
                 <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Withdrawal Authorization</h3>
             </div>

             <form onSubmit={handleRequestPayout} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Amount (₹)</label>
                     <input 
                        type="number" 
                        max={user?.wallet}
                        className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl font-black text-sm focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 dark:text-white"
                        placeholder="Min. ₹500"
                        value={payoutForm.amount}
                        onChange={(e) => setPayoutForm({...payoutForm, amount: e.target.value})}
                     />
                 </div>
                 <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Transfer Protocol</label>
                     <select 
                        className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl font-black text-sm focus:ring-2 focus:ring-blue-600 outline-none appearance-none text-gray-900 dark:text-white"
                        value={payoutForm.method}
                        onChange={(e) => setPayoutForm({...payoutForm, method: e.target.value})}
                     >
                        <option value="UPI">UPI Sync</option>
                        <option value="Bank">Bank Wire</option>
                        <option value="Wallet">Digital Wallet</option>
                     </select>
                 </div>
                 <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Receiver ID / Details</label>
                     <input 
                        type="text" 
                        className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl font-black text-sm focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 dark:text-white"
                        placeholder="UPI ID or Account No."
                        value={payoutForm.accountDetails}
                        onChange={(e) => setPayoutForm({...payoutForm, accountDetails: e.target.value})}
                     />
                 </div>
                 <div className="md:col-span-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 uppercase text-xs tracking-widest">Execute Disbursement Sequence</button>
                 </div>
             </form>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Earnings */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Recent Profits</h3>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Info size={10} /> After 20% platform fee</span>
            </div>

            <div className="space-y-4">
                {history.length > 0 ? history.map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                                <CheckCircle size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1 uppercase tracking-tight">{booking.service?.name}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1 mt-1 opacity-60">
                                    <Clock size={10} /> {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <p className="text-lg font-black text-emerald-600 tracking-tighter italic">
                            +₹{Math.round((booking.totalPrice || booking.service?.price || 0) * (1 - PLATFORM_COMMISSION))}
                        </p>
                    </div>
                )) : (
                    <p className="text-center py-10 text-gray-400 font-black uppercase text-[10px] tracking-widest opacity-40">Zero profit nodes detected</p>
                )}
            </div>
          </div>

          {/* Payout Logs */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
                    <History className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Withdrawal Logs</h3>
            </div>

            <div className="space-y-4">
                {payouts.length > 0 ? payouts.map((p) => (
                    <div key={p._id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                p.status === 'completed' ? 'bg-green-100 text-green-600' : 
                                p.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                            }`}>
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-gray-900 dark:text-white tracking-tight uppercase">{p.method} • {p.accountDetails.slice(-4).padStart(8, '*')}</p>
                                <p className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1 mt-1 opacity-60">
                                    <Clock size={10} /> {new Date(p.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-gray-900 dark:text-white tracking-tighter italic">-₹{p.amount}</p>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${
                                p.status === 'completed' ? 'text-green-500' : 
                                p.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                            }`}>{p.status}</span>
                        </div>
                    </div>
                )) : (
                    <p className="text-center py-10 text-gray-400 font-black uppercase text-[10px] tracking-widest opacity-40">Zero withdrawal log found</p>
                )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default ProviderEarnings;
