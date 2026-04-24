import { useState, useEffect } from 'react';
import API from "../../api/axios";
import toast from "react-hot-toast";
import { UserCheck, ShieldAlert, Award, Search, Info, ShieldX, MapPin, Briefcase, Phone, Trash2, CheckCircle } from 'lucide-react';

const AdminProviders = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data);
    } catch (error) {
      toast.error("Failed to synchronize with identity node");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (id) => {
    try {
      await API.put(`/users/${id}/verify`, { isVerified: true });
      toast.success("Merchant node verified successfully.");
      fetchUsers();
    } catch (error) {
      toast.error("Verification protocol failed");
    }
  };

  const handleUnverify = async (id) => {
    try {
      await API.put(`/users/${id}/verify`, { isVerified: false });
      toast.success("Verification revoked.");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to strip certification");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently remove this provider node from the platform?")) {
      try {
        await API.delete(`/users/${id}`);
        toast.success("Provider node terminated.");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to decommission node");
      }
    }
  };

  const providers = users.filter((u) => u.role === "provider");

  const filtered = providers.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">Merchant Governance</h2>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Identity Verification & Compliance Control</p>
        </div>
        
        <div className="relative group min-w-[300px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Scan merchant records..." 
                className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 pl-14 rounded-[2rem] text-sm font-bold shadow-sm focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
             <div className="col-span-full py-20 text-center font-black animate-pulse text-blue-600 tracking-widest uppercase">Fetching Merchant Registry...</div>
        ) : filtered.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700 opacity-50">
                 <Info className="mx-auto mb-4 text-gray-400 w-16 h-16" />
                 <p className="font-black text-gray-400 uppercase tracking-widest text-lg">Null Merchant Dataset</p>
             </div>
        ) : filtered.map((provider) => (
           <div
             key={provider._id}
             className={`group p-8 rounded-[3rem] border transition-all duration-500 relative overflow-hidden flex flex-col ${
                 provider.isVerified 
                 ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-xl' 
                 : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 shadow-2xl scale-105'
             }`}
           >
            {provider.isVerified && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full translate-x-16 -translate-y-16 pointer-events-none" />
            )}

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-xl uppercase group-hover:rotate-6 transition-transform">
                        {provider.name?.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{provider.name}</h4>
                        <p className="text-[10px] font-mono font-bold text-gray-400">{provider._id.toUpperCase()}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                     <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         provider.isVerified 
                         ? 'bg-green-50 text-green-600 border-green-100' 
                         : 'bg-amber-50 text-amber-600 border-amber-100'
                     }`}>
                        {provider.isVerified ? <Award size={10} /> : <ShieldAlert size={10} />}
                        {provider.isVerified ? "Verified Expert" : "Under Review"}
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Network Node</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                        <MapPin size={14} className="text-blue-500" /> {provider.location || 'GLOBAL'}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[9px] font-black uppercase text-gray-400 mb-2 tracking-widest">Expertise Vector</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-300">
                        <Briefcase size={14} className="text-indigo-500" /> {provider.specialization || 'General Pro'}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-10">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Performance Matrix</span>
                    <span className="text-blue-600">98% Satisfied</span>
                 </div>
                 <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                 </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleDelete(provider._id)}
                        className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                        title="Decommission Node"
                    >
                        <Trash2 size={18} />
                    </button>
                    {provider.isVerified && (
                         <button 
                            onClick={() => handleUnverify(provider._id)}
                            className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 hover:bg-amber-500 hover:text-white rounded-2xl transition-all"
                            title="Strip Certification"
                        >
                            <ShieldX size={18} />
                        </button>
                    )}
                </div>

                {!provider.isVerified ? (
                    <button
                        onClick={() => handleVerify(provider._id)}
                        className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                    >
                        <CheckCircle size={18} /> Authorize Node
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest px-4 font-mono opacity-50">
                        System Signature Validated
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProviders;