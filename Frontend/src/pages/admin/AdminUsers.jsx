import { useState, useEffect } from "react";
import API from "../../api/axios";
import { User, Mail, Calendar, Trash2, ShieldX, CheckCircle, Search, LayoutList } from 'lucide-react';
import toast from "react-hot-toast";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data.filter(u => u.role === 'user'));
    } catch (error) {
      toast.error("Failed to synchronize with identity network");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Permanently revoke user access and purge node data?")) {
      try {
        await API.delete(`/users/${id}`);
        toast.success("User access revoked permanently.");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to decommission node");
      }
    }
  };

  const filtered = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">User Control</h2>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Directory Management & Compliance</p>
        </div>
        <div className="relative group w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Search database..."
                className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 pl-12 rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-600 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
             <div className="p-20 text-center font-black animate-pulse text-blue-600 tracking-widest uppercase">Fetching Identity Records...</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Identification</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Node</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Activity Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Node Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((user) => (
                <tr key={user._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-3xl bg-blue-600/10 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center font-black shadow-sm uppercase">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white text-lg tracking-tight uppercase">{user.name}</p>
                        <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-tighter">UID: {user._id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                          <Mail size={14} className="text-gray-400" /> {user.email}
                      </div>
                  </td>
                  <td className="p-6">
                      <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">Active Node</span>
                      </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                      <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-red-100"
                          title="Revoke Permission"
                      >
                        <ShieldX size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
            <div className="p-20 text-center">
                <p className="text-lg font-black text-gray-400 uppercase tracking-widest italic opacity-40">Null Records Detected</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
