import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { PlusCircle, Info, Tag, IndianRupee, Layers, Sparkles } from 'lucide-react';

const ProviderAddService = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    isPromo: false,
    promoPrice: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          API.get("/categories"),
          API.get("/categories/my-categories")
        ]);
        
        // Merge without duplicates
        const merged = [...allRes.data];
        myRes.data.forEach(myCat => {
          if (!merged.find(c => c._id === myCat._id)) {
            merged.push(myCat);
          }
        });
        
        setCategories(merged);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();

    if (!serviceForm.name || !serviceForm.price || !serviceForm.category) {
      toast.error("Required fields: Name, Price, Category");
      return;
    }

    try {
      await API.post("/services", serviceForm);
      toast.success("Service deployed to global grid!");
      
      setServiceForm({
        name: "",
        description: "",
        price: "",
        category: "",
        isPromo: false,
        promoPrice: "",
      });

      // Refresh list if needed (since it's a sibling in ProviderPanel, 
      // ideally we use a context or lift state, but a small refresh works for now)
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish service");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl text-blue-600 dark:text-blue-400">
            <PlusCircle className="w-6 h-6" />
        </div>
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Add New Service</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Expand your offerings to reach more customers</p>
        </div>
      </div>

      <form
        onSubmit={handleAddService}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Service Title</label>
            <div className="relative group">
                <Info className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="e.g. Premium Bathroom Cleaning" 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 pl-12 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Category</label>
            <div className="relative group">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <select 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 pl-12 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name} {!cat.isApproved && '(Pending Approval)'}
                    </option>
                  ))}
                </select>
            </div>
        </div>

        <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Service Description</label>
            <textarea 
                placeholder="Describe what's included in this service..." 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
            />
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Base Price (₹)</label>
            <div className="relative group">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 pl-12 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono font-bold"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                />
            </div>
        </div>

        <div className="space-y-2 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/20">
            <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Sparkles size={12} /> Seasonal Offer
                </label>
                <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    checked={serviceForm.isPromo}
                    onChange={(e) => setServiceForm({ ...serviceForm, isPromo: e.target.checked })}
                />
            </div>
            {serviceForm.isPromo && (
                <div className="relative group animate-in zoom-in-95 duration-200">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={14} />
                    <input 
                        type="number" 
                        placeholder="Discounted Price" 
                        className="w-full bg-white dark:bg-gray-800 border-none p-2 pl-10 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-black text-indigo-600 dark:text-indigo-400"
                        value={serviceForm.promoPrice}
                        onChange={(e) => setServiceForm({ ...serviceForm, promoPrice: e.target.value })}
                    />
                </div>
            )}
        </div>

        <div className="md:col-span-2 pt-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
              <PlusCircle size={18} />
              Publish Service
            </button>
        </div>
      </form>
    </div>
  );
};

export default ProviderAddService;