import { useState, useEffect } from 'react';
import API from "../../api/axios";
import { MessageSquare, Star, Reply, ThumbsUp, Filter, TrendingUp, Sparkles, User, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const ProviderFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const { data } = await API.get('/services/provider-reviews');
                setFeedbacks(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch feedbacks", error);
                toast.error("Cloud link disrupted. Could not fetch feedback node.");
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    const averageRating = feedbacks.length > 0
        ? (feedbacks.reduce((acc, item) => item.rating + acc, 0) / feedbacks.length).toFixed(1)
        : 0;

    const filteredFeedbacks = feedbacks.filter(f => {
        const matchesSearch = f.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             f.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'all') return matchesSearch;
        if (filter === 'high') return matchesSearch && f.rating >= 4;
        if (filter === 'low') return matchesSearch && f.rating <= 2;
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4 animate-pulse">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Syncing Feedback Matrix...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <TrendingUp size={120} className="text-blue-600" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Overall Quality</p>
                        <div className="flex items-center gap-3">
                            <h3 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{averageRating}</h3>
                            <div className="space-y-1">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < Math.floor(averageRating) ? 'currentColor' : 'none'} />
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{feedbacks.length} Protocol Samples</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 font-mono text-[11px]">
                    <div className="flex items-center justify-between mb-6">
                        <h4 className="font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                             <Filter size={14} /> Matrix Filtering
                        </h4>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex gap-2">
                                {['all', 'high', 'low'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] border transition-all ${
                                            filter === f 
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                                            : 'bg-transparent border-gray-100 dark:border-gray-700 text-gray-500 hover:border-blue-600'
                                        }`}
                                    >
                                        {f} Metrics
                                    </button>
                                ))}
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search feedback..." 
                                    className="bg-gray-50 dark:bg-gray-900 border border-transparent focus:border-blue-500/30 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold outline-none transition-all w-48 focus:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                        Analyzing core feedback packets to optimize service delivery. 
                        User satisfaction levels are currently within <span className="text-green-500 font-black">Optimal Range</span>.
                    </p>
                </div>
            </div>

            {/* Feedback Feed */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredFeedbacks.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <MessageSquare className="mx-auto text-gray-200 mb-4" size={48} />
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">No data packets in this node</p>
                    </div>
                ) : (
                    filteredFeedbacks.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-lg border border-gray-50 dark:border-gray-700 group hover:shadow-2xl hover:border-blue-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                        {item.user?.name ? item.user.name.charAt(0).toUpperCase() : <User size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{item.user?.name || 'Anonymous User'}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-amber-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} fill={i < item.rating ? 'currentColor' : 'none'} className="border-none" />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-mono text-gray-400 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full border border-gray-100 dark:border-gray-700 text-[9px] font-black uppercase tracking-widest text-gray-400 font-mono">
                                    NODE: {item.serviceId?.slice(-6)}
                                </div>
                            </div>

                            <div className="relative mb-6">
                                <Sparkles className="absolute -left-2 -top-2 text-blue-600 opacity-20" size={24} />
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic border-l-4 border-blue-600/30 pl-4 py-1">
                                    "{item.comment}"
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Service:</span>
                                    <span className="text-[10px] font-black uppercase text-gray-900 dark:text-white tracking-tight">{item.serviceName}</span>
                                </div>
                                <div className="flex gap-4">
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 p-1">
                                        <ThumbsUp size={14} /> <span className="text-[10px] font-black uppercase">Approve</span>
                                    </button>
                                    <button className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 p-1">
                                        <Reply size={14} /> <span className="text-[10px] font-black uppercase">Sync</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProviderFeedback;
