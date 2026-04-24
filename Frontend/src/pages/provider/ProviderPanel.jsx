import { useState, useEffect } from 'react';
import ProviderAddService from "./ProviderAddService";
import ProviderServices from "./ProviderServices";
import ProviderBookings from "./ProviderBookings";
import ProviderEarnings from "./ProviderEarnings";
import ProviderFeedback from "./ProviderFeedback";
import ProviderMembership from "./ProviderMembership";
import ProviderCategories from "./ProviderCategories";
import { LayoutDashboard, Target, Layers, Wallet, MessageSquare, Crown, Settings, Sparkles, TrendingUp, ShieldCheck, Trophy, MessageSquareWarning, Plus } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

import { StatsSkeleton } from "../../components/Skeleton";

const ProviderPanel = () => {
    const { user, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [statsLoading, setStatsLoading] = useState(true);

    // Simulate stats loading for smooth 3G/4G transition
    useEffect(() => {
        const timer = setTimeout(() => setStatsLoading(false), 800);
        // Refresh user data to get latest wallet balance
        refreshUser();
        return () => clearTimeout(timer);
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Console', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', icon: Target },
        { id: 'categories', label: 'Categories', icon: Plus },
        { id: 'services', label: 'Services', icon: Layers },
        { id: 'revenue', label: 'Earnings', icon: Wallet },
        { id: 'feedback', label: 'Feedback', icon: MessageSquare },
        { id: 'disputes', label: 'Disputes', icon: MessageSquareWarning },
        { id: 'membership', label: 'Growth/Plans', icon: Crown, color: 'text-amber-500' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return (
                <div className="space-y-12">
                    {statsLoading ? (
                        <StatsSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                                <Target className="absolute right-6 top-6 text-blue-600 opacity-10 group-hover:scale-125 transition-transform" size={60} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1 leading-none">Target Achievement</p>
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">84%</h3>
                                <div className="w-full h-1.5 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                                    <div className="h-full w-[84%] bg-blue-600" />
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                                <Trophy className="absolute right-6 top-6 text-amber-500 opacity-10 group-hover:scale-125 transition-transform" size={60} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1 leading-none">Expert Rank</p>
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Elite Partner</h3>
                                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">Status: Trending in Region</p>
                            </div>
                        </div>
                    )}
                    <ProviderBookings />
                    <ProviderFeedback />
                </div>
            );
            case 'bookings': return <ProviderBookings />;
            case 'services': return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <ProviderServices />
                    </div>
                    <div className="lg:col-span-1">
                        <ProviderAddService />
                    </div>
                </div>
            );
            case 'revenue': return <ProviderEarnings />;
            case 'feedback': return <ProviderFeedback />;
            case 'disputes': return (
                <div className="bg-white dark:bg-gray-800 p-12 rounded-[3.5rem] shadow-xl border border-gray-100 dark:border-gray-700 text-center animate-in fade-in duration-700">
                    <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquareWarning size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-4">Conflict Resolution</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium">No active disputes detected. We recommend resolving client issues directly through chat before escalating to formal platform mediation.</p>
                    <button className="mt-8 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Contact Mediation Officer</button>
                </div>
            );
            case 'membership': return <ProviderMembership />;
            case 'categories': return <ProviderCategories />;
            default: return <ProviderBookings />;
        }
    };

    return (
        <div className="h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:bg-none overflow-hidden flex flex-col md:flex-row p-4 md:p-8 gap-4 md:gap-8">

            {/* Sidebar Navigation - Sticky on Desktop, Top-scrollable on Mobile */}
            <div className="w-full md:w-72 shrink-0 flex flex-col md:h-full gap-8">
                <div className="px-4 shrink-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-blue-100 dark:border-blue-800 font-mono">
                        <Sparkles size={12} /> Partner Hub
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">
                        Expert<span className="text-blue-600 font-black">Gate</span>
                    </h1>
                </div>

                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar pb-4 md:pb-0 scroll-smooth">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 min-w-max md:min-w-0 ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800'
                                }`}
                        >
                            <item.icon size={18} className={item.id === 'membership' && activeTab !== 'membership' ? 'text-amber-500' : ''} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="hidden md:block px-6">
                    <div className="p-6 bg-gradient-to-br from-indigo-700 to-blue-900 rounded-[2rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                        <Wallet className="absolute right-[-10px] bottom-[-10px] opacity-10 group-hover:scale-125 transition-transform duration-700 pointer-events-none" size={100} />
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 relative z-10">Available Funds</p>
                        <h3 className="text-3xl font-black tracking-tighter mb-4 leading-none relative z-10">₹{user?.wallet || 0}</h3>
                        <button
                            onClick={() => setActiveTab('revenue')}
                            className="w-full text-[9px] font-black uppercase border border-white/20 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 relative z-10"
                        >
                            Withdraw Pulse <TrendingUp size={12} />
                        </button>
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

export default ProviderPanel;