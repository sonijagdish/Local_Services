import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Layers, Plus, Edit2, Trash2, ShieldCheck } from 'lucide-react';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const { data } = await API.get("/categories/admin");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load category database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleApprove = async (id) => {
    try {
      await API.put(`/categories/${id}/approve`);
      toast.success("Category approved!");
      fetchCategories();
    } catch (error) {
      toast.error("Approval failed");
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
        toast.error("Label identification required");
        return;
    }

    try {
      if (editingId) {
        await API.put(`/categories/${editingId}`, categoryForm);
        toast.success('Category protocol updated!');
        setEditingId(null);
        setCategoryForm({ name: '', description: '' });
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Purge this category? Associated services may lose linkage.")) {
      try {
        await API.delete(`/categories/${id}`);
        toast.error('Sector purged');
        fetchCategories();
      } catch (error) {
        toast.error("Failed to execute purge protocol");
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-2xl">
            <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Category Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Organize your services into logical groups</p>
        </div>
      </div>

      {editingId && (
        <form
          onSubmit={handleCategorySubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4 duration-300"
        >
          <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Category Name</label>
              <input
                type="text"
                placeholder="e.g. Cleaning"
                className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              />
          </div>

          <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Description</label>
              <input
                type="text"
                placeholder="Brief description..."
                className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              />
          </div>

          <div className="flex items-end gap-2">
              <button className="w-full h-[46px] rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 shadow-orange-500/20 text-white">
                <Edit2 size={16} />
                Update Category
              </button>
              <button 
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setCategoryForm({ name: '', description: '' });
                }}
                className="h-[46px] px-4 rounded-xl font-bold text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-20 font-black animate-pulse text-purple-600 tracking-widest uppercase">Initializing Category Matrix...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl text-gray-400 font-medium">
            No categories detected in primary database. Pending suggestions from providers will appear here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className={`group bg-white dark:bg-gray-800 p-6 rounded-3xl border ${cat.isApproved ? 'border-gray-100 dark:border-gray-700' : 'border-amber-200 dark:border-amber-900/40 ring-2 ring-amber-50 dark:ring-amber-900/10'} shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
            >
              {!cat.isApproved && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest rounded-bl-xl z-10">
                      Pending Approval
                  </div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 ${cat.isApproved ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'} rounded-xl flex items-center justify-center font-black`}>
                    {cat.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-2">
                    {!cat.isApproved && (
                        <button
                          onClick={() => handleApprove(cat._id)}
                          className="p-2 text-amber-600 hover:text-green-500 transition-colors"
                          title="Approve"
                        >
                          <ShieldCheck size={16} />
                        </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(cat._id);
                        setCategoryForm({
                          name: cat.name,
                          description: cat.description,
                        });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                </div>
              </div>

              <div>
                <h4 className={`font-bold text-lg ${cat.isApproved ? 'text-gray-900 dark:text-white' : 'text-amber-700 dark:text-amber-400'} group-hover:text-purple-600 transition-colors`}>{cat.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 h-10">{cat.description || 'No sectoral description found.'}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center text-[9px] font-black text-gray-400 uppercase tracking-widest font-mono">
                <span>Created: {new Date(cat.createdAt).toLocaleDateString() || 'N/A'}</span>
                {cat.isApproved ? (
                    <span className="text-green-500">Live</span>
                ) : (
                    <span className="text-amber-500">Awaiting Auth</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
