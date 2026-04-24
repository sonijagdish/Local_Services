import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { PlusCircle, Edit, Trash2, Tag, ShieldCheck, IndianRupee, Star, Sparkles, Power, CheckCircle } from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    isFeatured: false,
  });

  const fetchData = async () => {
    try {
      const [{ data: srvRes }, { data: catRes }] = await Promise.all([
        API.get("/services/admin"),
        API.get("/categories/admin")
      ]);
      setServices(srvRes);
      setCategories(catRes);
    } catch (error) {
      toast.error("Failed to synchronize with service grid");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/services/${id}/approve`);
      toast.success("Service approved and live!");
      fetchData();
    } catch (error) {
      toast.error("Approval sequence failed");
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.category) {
        toast.error("Required fields: Name, Category");
        return;
    }

    try {
      if (editingId) {
        await API.put(`/services/${editingId}`, serviceForm);
        toast.success('Node state updated successfully.');
        setEditingId(null);
        setServiceForm({
          name: '',
          description: '',
          category: '',
          price: '',
          isFeatured: false,
        });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently purge this service node?")) {
      try {
        await API.delete(`/services/${id}`);
        toast.error('Node purged');
        fetchData();
      } catch (error) {
        toast.error("Resource deletion failed");
      }
    }
  };

  const toggleFeatured = async (srv) => {
    try {
      await API.put(`/services/${srv._id}`, { isFeatured: !srv.isFeatured });
      toast.success(srv.isFeatured ? 'Feature lock disabled' : 'Global feature layer enabled');
      fetchData();
    } catch (error) {
      toast.error("Failed to toggle feature state");
    }
  };

  const toggleAvailability = async (srv) => {
    try {
      await API.put(`/services/${srv._id}`, { availability: !srv.availability });
      toast.success(srv.availability ? 'Node transmission disabled' : 'Service node live');
      fetchData();
    } catch (error) {
      toast.error("Failed to toggle availability state");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-500 min-h-screen">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Global Service Control</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mt-1">Configure service nodes & visibility layers</p>
        </div>
      </div>

      {editingId && (
        <form
          onSubmit={handleServiceSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12 bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="lg:col-span-1 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Node Title</label>
              <input
                type="text"
                placeholder="e.g. Master Plumber"
                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-600 outline-none shadow-sm text-gray-900 dark:text-white"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
              />
          </div>

          <div className="lg:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Protocol Brief</label>
              <input
                type="text"
                placeholder="Primary service objectives..."
                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none shadow-sm text-gray-900 dark:text-white"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              />
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Network Layer</label>
              <select
                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-600 outline-none appearance-none shadow-sm text-gray-900 dark:text-white"
                value={serviceForm.category}
                onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
              >
                <option value="">Select Plane</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
          </div>

          <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Base Cost (₹)</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full bg-white dark:bg-gray-800 border-none rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-blue-600 outline-none font-mono shadow-sm text-gray-900 dark:text-white"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
              />
          </div>

          <div className="flex items-end gap-2">
              <button className="w-full h-[54px] rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 shadow-amber-500/30 text-white">
                <Edit size={16} />
                Update Node
              </button>
              <button 
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setServiceForm({
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    isFeatured: false,
                  });
                }}
                className="h-[54px] px-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
             <div className="col-span-full py-20 text-center font-black animate-pulse text-blue-600 tracking-widest uppercase">Fetching Global Grid...</div>
        ) : services.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-700 opacity-40">
                <p className="text-xl font-black text-gray-400 uppercase tracking-widest">Null Dataset</p>
            </div>
        ) : services.map((srv) => {
          const category = categories.find((cat) => cat._id === (srv.category?._id || srv.category));

          return (
            <div
              key={srv._id}
              className={`group bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl transition-all duration-500 relative overflow-hidden flex flex-col h-full border ${
                  !srv.isApproved
                  ? 'border-amber-200 dark:border-amber-900/50 ring-2 ring-amber-50 dark:ring-amber-900/10 opacity-90'
                  : srv.isFeatured 
                  ? 'border-amber-200 dark:border-amber-900/50 ring-2 ring-amber-100 dark:ring-amber-900/20' 
                  : 'border-gray-100 dark:border-gray-700/50'
              }`}
            >
              {!srv.isApproved && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl z-20">
                      Awaiting Approval
                  </div>
              )}
              {srv.isFeatured && (
                  <div className="absolute top-4 right-4 text-amber-500 opacity-20 group-hover:rotate-12 transition-transform">
                      <Sparkles size={80} />
                  </div>
              )}

              <div className="absolute top-6 right-6 flex gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all z-20">
                {!srv.isApproved && (
                    <button
                      onClick={() => handleApprove(srv._id)}
                      className="p-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg grayscale hover:grayscale-0"
                      title="Approve Service"
                    >
                      <CheckCircle size={18} />
                    </button>
                )}
                <button
                  onClick={() => toggleAvailability(srv)}
                  className={`p-3 rounded-2xl transition-all shadow-lg ${srv.availability ? 'bg-green-500 text-white' : 'bg-white dark:bg-gray-900 text-gray-400 hover:text-green-500'}`}
                  title={srv.availability ? "Disable Node" : "Activate Node"}
                >
                  <Power size={18} />
                </button>
                <button
                  onClick={() => toggleFeatured(srv)}
                  className={`p-3 rounded-2xl transition-all shadow-lg ${srv.isFeatured ? 'bg-amber-500 text-white' : 'bg-white dark:bg-gray-900 text-gray-400 hover:text-amber-500'}`}
                  title={srv.isFeatured ? "Unfeature" : "Feature on Homepage"}
                >
                  <Star size={18} fill={srv.isFeatured ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => {
                    setEditingId(srv._id);
                    setServiceForm({
                      name: srv.name,
                      description: srv.description,
                      category: srv.category?._id || srv.category,
                      price: srv.price,
                      isFeatured: srv.isFeatured,
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3 bg-white dark:bg-gray-900 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(srv._id)}
                  className="p-3 bg-white dark:bg-gray-900 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-lg"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex flex-col h-full">
                <div className="mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-full text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest border border-gray-100 dark:border-gray-700">
                        {category?.name || 'General Node'}
                    </span>
                    <h4 className="font-black text-2xl text-gray-900 dark:text-white mt-4 line-clamp-1 tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                      {srv.name}
                    </h4>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 h-10 italic leading-snug">
                        "{srv.description}"
                    </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1 leading-none">Market Price</span>
                        <div className="flex items-center gap-1">
                            <IndianRupee size={16} className="text-blue-600" />
                            <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {srv.price}
                            </span>
                        </div>
                    </div>
                    {srv.isFeatured && (
                        <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100 dark:border-amber-900/30">
                            Featured Node
                        </div>
                    )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminServices;
