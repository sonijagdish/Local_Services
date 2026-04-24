import { useState, useEffect } from "react";
import API from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { TrendingUp, Users, Briefcase, ClipboardList, Wallet, PieChart as PieIcon, BarChart3, Settings, Percent } from 'lucide-react';
import toast from "react-hot-toast";

const AdminAnalytics = () => {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commissionRate, setCommissionRate] = useState(() => Number(localStorage.getItem('commission_rate')) || 10);
  const [isEditingRate, setIsEditingRate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: bkRes }, { data: svRes }, { data: usRes }] = await Promise.all([
          API.get("/bookings"),
          API.get("/services"),
          API.get("/users")
        ]);
        setBookings(bkRes);
        setServices(svRes);
        setUsers(usRes);
      } catch (error) {
        toast.error("Failed to compile analytics matrix");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSaveRate = () => {
      localStorage.setItem('commission_rate', commissionRate);
      setIsEditingRate(false);
      toast.success(`Platform commission updated to ${commissionRate}%`);
  };

  const totalUsers = users.length;
  const totalServices = services.length;
  const totalBookings = bookings.length;

  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const completedCount = completedBookings.length;

  const totalRevenue = completedBookings.reduce((acc, booking) => {
    return acc + Number(booking.totalPrice || 0);
  }, 0);

  const platformCommission = completedBookings.reduce((acc, booking) => {
    // 100% if admin, percentage if other provider
    const rate = commissionRate / 100;
    const comm = booking.provider?.role === 'admin' ? booking.totalPrice : (booking.totalPrice * rate);
    return acc + Number(comm || 0);
  }, 0);

  const providerEarnings = Number((totalRevenue - platformCommission).toFixed(2));

  const bookingData = [
    { name: 'Total Requests', value: totalBookings },
    { name: 'Completed', value: completedCount },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length },
  ];

  const revenueData = [
    { name: `Platform (${commissionRate}%)`, value: platformCommission },
    { name: `Providers (${100 - commissionRate}%)`, value: providerEarnings },
  ];

  const COLORS = ['#6366F1', '#10B981', '#F43F5E'];
  const REVENUE_COLORS = ['#6366F1', '#8B5CF6'];

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-blue-600 uppercase tracking-[0.5em] text-sm">Synchronizing Intelligence Grid...</div>;

    const handleResetSystem = async () => {
        if (window.confirm("CRITICAL ACTION: Purge all bookings, services, and categories? This cannot be undone and will clear the global grid.")) {
            try {
                await API.post("/admin/reset");
                toast.success("System Reset: Global Grid Cleared");
                window.location.reload();
            } catch (error) {
                toast.error("Failed to execute reset protocol");
            }
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-4 md:p-8 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">
                            System <span className="text-blue-600">Analytics</span>
                        </h2>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Business Intelligence & Revenue Insights</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleResetSystem}
                            className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-6 py-4 rounded-3xl border border-red-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-red-500/5 group"
                        >
                            <Settings size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Industrial Reset
                        </button>
                <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl flex items-center gap-4">
                     <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                        <Percent size={18} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Platform Fee</p>
                        {isEditingRate ? (
                            <div className="flex items-center gap-2 mt-1">
                                <input 
                                    type="number" 
                                    className="w-16 bg-gray-50 dark:bg-gray-900 p-1 text-xs font-black rounded border-none focus:ring-1 focus:ring-blue-600 text-gray-900 dark:text-white"
                                    value={commissionRate}
                                    onChange={(e) => setCommissionRate(e.target.value)}
                                />
                                <button onClick={handleSaveRate} className="text-[10px] font-black uppercase text-blue-600">Save</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-black text-gray-900 dark:text-white">{commissionRate}%</span>
                                <button onClick={() => setIsEditingRate(true)} className="p-1 text-gray-300 hover:text-blue-600 transition-colors">
                                    <Settings size={12} />
                                </button>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Network Users', val: totalUsers, icon: <Users />, color: 'blue' },
            { label: 'Active Services', val: totalServices, icon: <Briefcase />, color: 'indigo' },
            { label: 'Total Volume', val: totalBookings, icon: <ClipboardList />, color: 'purple' },
            { label: 'Total Revenue', val: `₹${totalRevenue.toLocaleString()}`, icon: <Wallet />, color: 'emerald' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110 shadow-sm">
                    {stat.icon}
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.val}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-gray-800 p-10 rounded-[3.5rem] shadow-2xl border border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl">
                    <BarChart3 size={20} />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight font-mono uppercase">Booking Dynamics</h4>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bookingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9CA3AF', fontWeight: 'bold', fontSize: 10 }}
                        dy={10}
                    />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontWeight: 'bold', fontSize: 10 }} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 30px -10px rgb(0 0 0 / 0.1)', fontWeight: 'black', background: 'white', padding: '15px' }}
                    />
                    <Bar dataKey="value" radius={[15, 15, 15, 15]} barSize={45}>
                        {bookingData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-10 rounded-[3.5rem] shadow-2xl border border-gray-50 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl">
                    <PieIcon size={20} />
                </div>
                <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight font-mono uppercase">Profit Matrix</h4>
            </div>

            <div className="h-[350px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="40%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={REVENUE_COLORS[index % REVENUE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                         contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 30px -10px rgb(0 0 0 / 0.1)', fontWeight: 'black', padding: '15px' }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        formatter={(value) => <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="absolute inset-x-0 top-[30%] flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Platform Net</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">₹{Math.round(platformCommission).toLocaleString()}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
