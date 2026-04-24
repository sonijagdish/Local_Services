import { useState, useEffect } from 'react';
import API from "../../api/axios";
import toast from 'react-hot-toast';
import { ClipboardList, User, CreditCard, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings");
      setBookings(data);
    } catch (error) {
      toast.error("Failed to fetch booking registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/bookings/${id}/status`, { status: newStatus });
      toast.success('Booking status updated in global ledger');
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently purge this booking record?")) {
      try {
        await API.delete(`/bookings/${id}`);
        toast.error('Record purged from database');
        fetchBookings();
      } catch (error) {
        toast.error("Failed to execute purge protocol");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800';
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800';
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-100 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-2xl">
            <ClipboardList className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Booking Management</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Monitor and update all user service requests</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        {loading ? (
          <div className="py-20 text-center font-black animate-pulse text-green-600 tracking-widest uppercase">Synchronizing Global Bookings...</div>
        ) : (
          <table className="w-full text-left border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                  <tr>
                      <td colSpan="5" className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl opacity-50 font-medium">
                          No booking data detected in sector.
                      </td>
                  </tr>
              ) : bookings.map((booking) => (
                  <tr key={booking._id} className="group bg-gray-50 dark:bg-gray-900/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 rounded-3xl shadow-sm hover:shadow-lg">
                    <td className="px-4 py-4 rounded-l-2xl">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                              <CheckCircle2 size={18} className="text-green-500" />
                          </div>
                          <div>
                              <p className="font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors uppercase tracking-tight text-sm">{booking.service?.name || 'Protocol Unknown'}</p>
                              <p className="text-[9px] text-gray-400 font-mono font-black uppercase">ID: {booking._id.slice(-8)}</p>
                          </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                          <span className="flex items-center gap-2 text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">
                              <User size={12} className="text-blue-500" />
                              {booking.user?.name || 'Exited User'}
                          </span>
                          <span className="text-[9px] text-gray-400 font-mono pl-5">{booking.user?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                          <CreditCard size={14} />
                          {booking.paymentMode || 'COD'}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-full border outline-none cursor-pointer transition-all shadow-sm ${getStatusColor(booking.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-right rounded-r-2xl">
                      <button
                        onClick={() => handleDelete(booking._id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-red-100"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
