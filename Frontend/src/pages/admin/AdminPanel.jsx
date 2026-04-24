import { useState } from 'react';
import AdminCategories from "./AdminCategories";
import AdminServices from "./AdminServices";
import AdminBookings from "./AdminBookings";
import AdminProviders from "./AdminProviders";
import AdminUsers from "./AdminUsers";
import AdminAnalytics from "../AdminAnalytics";
import AdminReviews from "./AdminReviews";
import AdminPromotions from "./AdminPromotions";
import AdminPayouts from "./AdminPayouts";
import AdminTransactions from "./AdminTransactions";
import { LayoutDashboard, Layers, Zap, Users, ShieldCheck, ShoppingCart, MessageSquare, Tag, Sparkles, BarChart3, Settings, CreditCard, DollarSign } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'categories', label: 'Categories', icon: Layers, color: 'text-blue-600 bg-blue-50' },
    { id: 'services', label: 'Services', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { id: 'providers', label: 'Providers', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-violet-600 bg-violet-50' },
    { id: 'bookings', label: 'Bookings', icon: ShoppingCart, color: 'text-rose-600 bg-rose-50' },
    { id: 'transactions', label: 'Transactions', icon: DollarSign, color: 'text-yellow-600 bg-yellow-50' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'payouts', label: 'Payouts', icon: CreditCard, color: 'text-teal-600 bg-teal-50' },
    { id: 'promotions', label: 'Promotions', icon: Sparkles, color: 'text-fuchsia-600 bg-fuchsia-50' },
  ];

  const renderContent = () => {
    switch (activeTab) {
        case 'analytics': return <AdminAnalytics />;
        case 'categories': return <AdminCategories />;
        case 'services': return <AdminServices />;
        case 'providers': return <AdminProviders />;
        case 'users': return <AdminUsers />;
        case 'bookings': return <AdminBookings />;
        case 'transactions': return <AdminTransactions />;
        case 'reviews': return <AdminReviews />;
        case 'payouts': return <AdminPayouts />;
        case 'promotions': return <AdminPromotions />;
        default: return <AdminAnalytics />;
    }
  };

  return (
    <div className="h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:bg-none overflow-hidden flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-8">
      {/* Sidebar Navigation - Sticky on Desktop, Top-scrollable on Mobile */}
      <div className="w-full md:w-72 shrink-0 flex flex-col md:h-full gap-8">
            <div className="px-4 shrink-0">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">
                    Admin<span className="text-blue-600">Core</span>
                </h1>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] mt-1">Platform Control Node</p>
            </div>

            <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar pb-4 md:pb-0 scroll-smooth">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 min-w-max md:min-w-0 ${
                            activeTab === item.id 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800'
                        }`}
                    >
                        <item.icon size={18} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="hidden md:block px-6">
                <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                     <Settings className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:rotate-90 transition-transform duration-700" size={100} />
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">System Health</p>
                     <div className="flex items-center gap-2 mb-4">
                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                         <span className="text-xs font-bold font-mono text-white">Operational 100%</span>
                     </div>
                </div>
            </div>
      </div>

      {/* Main Stage - Scrollable with hidden scrollbar */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-32 md:pb-0 scroll-smooth">
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">
             {renderContent()}
          </div>
      </div>
    </div>
  );
};

export default AdminPanel;