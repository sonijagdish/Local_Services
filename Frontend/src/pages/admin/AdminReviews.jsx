import { useState, useEffect } from "react";
import API from "../../api/axios";
import { MessageSquare, Star, Trash2, ShieldCheck, ShieldAlert, Flag, Filter, Search } from 'lucide-react';
import toast from "react-hot-toast";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState('all');

  const fetchReviews = async () => {
    try {
      const { data } = await API.get("/services/reviews");
      setReviews(data);
    } catch (error) {
      toast.error("Failed to synchronize with review sensor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDeleteReview = async (serviceId, reviewId) => {
    if (window.confirm("Are you sure you want to remove this review for community safety?")) {
      try {
        await API.delete(`/services/${serviceId}/reviews/${reviewId}`);
        toast.success("Review flagged and removed.");
        fetchReviews();
      } catch (error) {
        toast.error("Failed to execute censor protocol");
      }
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         r.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'high') return matchesSearch && r.rating >= 4;
    if (filter === 'low') return matchesSearch && r.rating <= 2;
    return matchesSearch;
  });

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 bg-white dark:bg-gray-800 p-8 rounded-[3.5rem] shadow-xl border border-gray-100 dark:border-gray-700/50">
        <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">Content Oversight</h2>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Platform Wide Reputation Monitoring</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800">
                {['all', 'high', 'low'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all ${
                            filter === f 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800'
                        }`}
                    >
                        {f} metrics
                    </button>
                ))}
            </div>
            <div className="relative group min-w-[300px]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Scan comments or nodes..."
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 pl-14 rounded-2xl text-[11px] font-bold shadow-sm focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
             <div className="col-span-full py-20 text-center font-black animate-pulse text-blue-600 tracking-widest uppercase">Scanning Feedback Network...</div>
        ) : filtered.map((review) => (
          <div key={review._id} className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-gray-900/50 rounded-full -translate-y-16 translate-x-16 opacity-30 pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-all uppercase">
                        {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-black text-gray-900 dark:text-white tracking-tight leading-tight uppercase text-sm">{review.user?.name || 'Anonymous Entity'}</p>
                        <div className="flex items-center gap-0.5 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'} />
                            ))}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => handleDeleteReview(review.serviceId, review._id)}
                    className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl transition-all shadow-lg active:scale-90 border border-transparent hover:border-red-100"
                    title="Censor Node"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <Flag size={10} /> Impact Node: <span className="text-blue-600">{review.serviceName}</span>
                </p>
                <blockquote className="text-gray-700 dark:text-gray-300 font-medium italic text-sm leading-relaxed">
                   "{review.comment}"
                </blockquote>
            </div>

            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-[8.5px] font-black uppercase tracking-[0.2em] border border-green-100 dark:border-green-800">
                    <ShieldCheck size={12} /> Authenticity Verified
                 </div>
                 <span className="text-[8.5px] font-black text-gray-400 uppercase tracking-widest font-mono opacity-40">NODE ID: {review._id.slice(-6)}</span>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && filtered.length === 0 && (
          <div className="p-20 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
              <MessageSquare className="mx-auto text-gray-200 dark:text-gray-800 w-16 h-16 mb-6" />
              <p className="text-lg font-black text-gray-400 uppercase tracking-widest opacity-40">Zero Feedback Packets Found</p>
          </div>
      )}
    </div>
  );
};

export default AdminReviews;
