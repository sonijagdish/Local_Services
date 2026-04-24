import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Edit2, Trash2, Power, Briefcase, IndianRupee, X, Check } from 'lucide-react';

const ReadMore = ({ text, maxLength = 80, className = "" }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  if (!text) return null;
  return (
    <div className={className}>
      {isReadMore ? text.slice(0, maxLength) + (text.length > maxLength ? "..." : "") : text}
      {text.length > maxLength && (
        <span 
          onClick={(e) => { e.stopPropagation(); setIsReadMore(!isReadMore); }} 
          className="text-blue-500 hover:text-blue-700 cursor-pointer ml-1 text-xs font-black underline lowercase"
        >
          {isReadMore ? "read more" : "show less"}
        </span>
      )}
    </div>
  );
};

const ProviderServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchMyServices = async () => {
      try {
        const { data } = await API.get("/services/my-services");
        setServices(data);
      } catch (error) {
        toast.error("Failed to load your services");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyServices();
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/services/${editingService._id}`, editingService);
      setServices((prev) =>
        prev.map((s) => (s._id === data._id ? data : s))
      );
      toast.success("Service updated on global grid.");
      setEditingService(null);
    } catch (error) {
      toast.error("Failed to synchronize changes");
    }
  };

  const handleToggle = async (service) => {
    try {
      const { data } = await API.put(`/services/${service._id}`, {
        availability: !service.availability,
      });
      setServices((prev) =>
        prev.map((s) => (s._id === data._id ? data : s))
      );
      toast.success(`Service is now ${data.availability ? 'ONLINE' : 'OFFLINE'}`);
    } catch (error) {
      toast.error("Failed to toggle signal status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Purge this service from memory? This cannot be undone.")) {
      try {
        await API.delete(`/services/${id}`);
        setServices((prev) => prev.filter((s) => s._id !== id));
        toast.error("Service purged successfully.");
      } catch (error) {
        toast.error("Failed to delete resource");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl">
                <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Active Services</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Manage your live listings and availability</p>
            </div>
        </div>
        {!user?.isVerified && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-bold border border-amber-100 dark:border-amber-800 animate-pulse">
                Pending Verification
            </div>
        )}
      </div>

      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <form
              onSubmit={handleUpdate}
              className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 w-full max-w-md relative"
            >
              <button 
                type="button"
                onClick={() => setEditingService(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                  <X size={20} />
              </button>
              
              <h4 className="text-xl font-black mb-6 text-gray-900 dark:text-white">Edit Service</h4>
              
              <div className="space-y-4">
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 px-1">Service Title</label>
                      <input 
                        type="text" 
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        value={editingService.name}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                      />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400 px-1">Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        value={editingService.price}
                        onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                      />
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 mt-4">
                    Save Changes
                  </button>
              </div>
            </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center font-black animate-pulse text-indigo-600 tracking-widest uppercase">
            Syncing Master Records...
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <p className="text-gray-400 font-bold text-lg">You haven't added any services yet.</p>
            <p className="text-sm text-gray-500 mt-2 font-mono uppercase tracking-widest">Awaiting merchant deployment</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service._id}
              className="group bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center font-black text-indigo-600 group-hover:scale-110 transition-transform">
                        {service.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 uppercase tracking-tight">{service.name}</h4>
                        <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                            <IndianRupee size={12} />
                            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{service.price}</span>
                        </div>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${service.availability ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {service.availability ? 'Online' : 'Offline'}
                </div>
              </div>

              <div className="flex-1 min-w-0 mb-6">
                 <ReadMore text={service.description} maxLength={80} className="text-xs text-gray-400 font-medium break-words" />
              </div>

              <div className="flex items-center gap-2 pt-6 border-t border-gray-50 dark:border-gray-800 mt-auto">
                <button 
                  onClick={() => handleToggle(service)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${service.availability ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'}`}
                >
                  <Power size={14} />
                  {service.availability ? "Disable" : "Activate"}
                </button>

                <button 
                  onClick={() => setEditingService(service)}
                  className="p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all border border-transparent hover:border-blue-100"
                >
                  <Edit2 size={16} />
                </button>

                <button 
                  onClick={() => handleDelete(service._id)}
                  className="p-2.5 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/40 transition-all border border-transparent hover:border-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProviderServices;