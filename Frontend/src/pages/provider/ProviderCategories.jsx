import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Layers, Plus, ShieldCheck, Clock } from 'lucide-react';

const ReadMore = ({ text, maxLength = 30, className = "" }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  if (!text) return null;
  return (
    <div className={className}>
      {isReadMore ? text.slice(0, maxLength) + (text.length > maxLength ? "..." : "") : text}
      {text.length > maxLength && (
        <span 
          onClick={(e) => { e.stopPropagation(); setIsReadMore(!isReadMore); }} 
          className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer ml-1 text-[10px] font-black underline lowercase"
        >
          {isReadMore ? "read more" : "show less"}
        </span>
      )}
    </div>
  );
};

const ProviderCategories = () => {
  const [categories, setCategories] = useState([]);
  const [myCategories, setMyCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  const fetchData = async () => {
    try {
      const [allCatRes, myCatRes] = await Promise.all([
        API.get("/categories"),
        API.get("/categories/my-categories")
      ]);
      setCategories(allCatRes.data);
      setMyCategories(myCatRes.data);
    } catch (error) {
      toast.error("Failed to load category database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
        toast.error("Category name required");
        return;
    }

    try {
      await API.post("/categories", categoryForm);
      toast.success('Category suggestion submitted! Awaiting admin approval.');
      setCategoryForm({ name: '', description: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Suggestion failed");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 rounded-2xl">
            <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white thin-font">Suggest Category</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Request new sectors for the service grid</p>
        </div>
      </div>

      <form
        onSubmit={handleCategorySubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-indigo-50/30 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/20"
      >
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Proposed Name</label>
            <input
              type="text"
              placeholder="e.g. Pet Care"
              className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            />
        </div>

        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Reason / Description</label>
            <input
              type="text"
              placeholder="Why is this needed?"
              className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            />
        </div>

        <div className="flex items-end">
            <button className="w-full h-[46px] rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2">
              <Plus size={16} />
              Submit Suggestion
            </button>
        </div>
      </form>

      {/* Your Suggestions */}
      {myCategories.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
            <Clock size={18} className="text-indigo-500" /> Your Suggestions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-900 dark:text-white">
            {myCategories.map((cat) => (
              <div
                key={cat._id}
                className={`group p-4 rounded-2xl border ${cat.isApproved ? 'border-green-200 bg-green-50/30 dark:bg-green-900/10' : 'border-amber-200 bg-amber-50/30 dark:bg-amber-900/10'} transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${cat.isApproved ? 'text-green-600 bg-white dark:bg-gray-800' : 'text-amber-600 bg-white dark:bg-gray-800'} border border-gray-100 dark:border-gray-700`}>
                      {cat.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900 dark:text-white">
                        <ReadMore text={cat.name} maxLength={20} className="break-all inline-block" />
                      </div>
                      <div className={`flex items-center gap-1 text-[8px] font-black uppercase tracking-tighter mt-1 ${cat.isApproved ? 'text-green-500' : 'text-amber-500'}`}>
                          {cat.isApproved ? (
                            <><ShieldCheck size={8} /> Approved</>
                          ) : (
                            <><Clock size={8} /> Pending</>
                          )}
                      </div>
                      {cat.description && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <ReadMore text={cat.description} maxLength={35} className="break-words" />
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider">Verified Sectors</h3>
      
      {loading ? (
        <div className="text-center py-10 font-black animate-pulse text-indigo-600 uppercase tracking-widest">Scanning Grid...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-gray-900 dark:text-white">
          {categories.filter(c => !myCategories.some(mc => mc._id === c._id)).map((cat) => (
            <div
              key={cat._id}
              className="group bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-indigo-300 transition-all text-gray-900 dark:text-white"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs font-black text-indigo-600 border border-gray-100 dark:border-gray-700 shrink-0">
                    {cat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                        <ReadMore text={cat.name} maxLength={20} className="break-all inline-block" />
                    </div>
                    <div className="flex items-center gap-1 text-[8px] font-black uppercase text-green-500 tracking-tighter mt-1">
                        <ShieldCheck size={8} /> Verified Sector
                    </div>
                    {cat.description && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          <ReadMore text={cat.description} maxLength={35} className="break-words" />
                        </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderCategories;

