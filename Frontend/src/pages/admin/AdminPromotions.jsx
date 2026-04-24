import { useState, useEffect } from "react";
import API from "../../api/axios";
import { Sparkles, Tag, Gift, Trash2, Edit3, Send, Plus, CheckCircle, IndianRupee, Zap, ShieldCheck } from 'lucide-react';
import toast from "react-hot-toast";

const AdminPromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    type: "percentage",
    description: "",
  });

  const fetchPromos = async () => {
    try {
      const { data } = await API.get("/promotions");
      setPromotions(data);
    } catch (error) {
      toast.error("Failed to synchronize marketing nodes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount) {
        toast.error("Please provide at least a code and value.");
        return;
    }

    try {
      await API.post("/promotions", form);
      toast.success("Marketing Campaign Activated!");
      setForm({ code: "", discount: "", type: "percentage", description: "" });
      fetchPromos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Protocol deployment failed");
    }
  };

  const handleDeletePromo = async (id) => {
    if (window.confirm("Permanently terminate this marketing campaign?")) {
      try {
        await API.delete(`/promotions/${id}`);
        toast.success("Campaign Terminated.");
        fetchPromos();
      } catch (error) {
        toast.error("Failed to execute termination sequence");
      }
    }
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">Market Intel</h2>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Campaign Management & User Acquisition</p>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 dark:bg-amber-900/10 px-6 py-3 rounded-2xl border border-amber-100 dark:border-amber-900/20 text-amber-600 dark:text-amber-400 font-black text-xs uppercase tracking-widest">
             <Zap size={16} fill="currentColor" /> Activation Cycle: +12% Engagement
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Creation Form */}
        <div className="lg:col-span-1">
             <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl">
                        <Gift size={24} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Deploy Voucher</h3>
                </div>

                <form onSubmit={handleAddPromo} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Campaign Code</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-600 border-none appearance-none tracking-widest uppercase text-gray-900 dark:text-white"
                            placeholder="SUMMER20"
                            value={form.code}
                            onChange={(e) => setForm({...form, code: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Node Discount</label>
                            <input 
                                type="number" 
                                className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-600 border-none appearance-none text-gray-900 dark:text-white"
                                placeholder="20"
                                value={form.discount}
                                onChange={(e) => setForm({...form, discount: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Value Matrix</label>
                            <select 
                                className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-sm font-black focus:ring-2 focus:ring-indigo-600 border-none appearance-none text-gray-900 dark:text-white"
                                value={form.type}
                                onChange={(e) => setForm({...form, type: e.target.value})}
                            >
                                <option value="percentage">% Percent</option>
                                <option value="flat">₹ Flat</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Protocol Brief</label>
                        <textarea 
                            className="w-full bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-600 border-none appearance-none min-h-[100px] text-gray-900 dark:text-white"
                            placeholder="Valid for cleaning services above ₹500..."
                            value={form.description}
                            onChange={(e) => setForm({...form, description: e.target.value})}
                        />
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                        <Plus size={20} /> Deploy Protocol
                    </button>
                </form>
             </div>
        </div>

        {/* Existing Promotions */}
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 px-4">Active Deployments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center font-black animate-pulse text-indigo-600 tracking-widest uppercase">Fetching Market Intel...</div>
                ) : promotions.map((promo) => (
                    <div key={promo._id} className="p-8 bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700/50 hover:shadow-2xl transition-all group relative overflow-hidden border-indigo-100 dark:border-indigo-900/30">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/10 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className="bg-indigo-600 text-white font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/30 font-mono">
                                COMPONENT: {promo.code}
                            </div>
                            <button 
                                onClick={() => handleDeletePromo(promo._id)}
                                className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-baseline gap-2 mb-4">
                             <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {promo.type === 'flat' ? '₹' : ''}{promo.discount}{promo.type === 'percentage' ? '%' : ''}
                             </span>
                             <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Efficiency</span>
                        </div>

                        <p className="text-xs font-medium text-gray-500 leading-relaxed mb-6 italic">
                            "{promo.description || 'Global Platform Promotion'}"
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
                             <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Active Campaign</span>
                             </div>
                             <span className="text-[9px] font-black uppercase text-gray-400 opacity-40">CRC8: VALID</span>
                        </div>
                    </div>
                ))}
            </div>
            {!loading && promotions.length === 0 && (
                <div className="p-20 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700">
                    <Sparkles className="mx-auto text-gray-200 dark:text-gray-800 w-16 h-16 mb-4" />
                    <p className="text-lg font-black text-gray-400 uppercase tracking-widest opacity-30 italic font-mono">Zero Market Pulse Detected</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminPromotions;
