import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { ClipboardList, User, Calendar, CreditCard, ChevronRight, CheckCircle2, Clock, MapPin, ReceiptText, X, Mail, Phone, ShieldCheck } from 'lucide-react';
import { addNotification } from "../../utils/notification";
import InvoiceModal from "../../components/InvoiceModal";
import Skeleton from "../../components/Skeleton";

const ProviderBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const CACHE_KEY = `provider_bookings_${user?._id}`;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get("/bookings/provider-bookings");
        setBookings(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch (error) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            setBookings(JSON.parse(cached));
            toast("Viewing Local Task Mirror (Offline)", { icon: '🤖' });
        } else {
            toast.error("Failed to synchronize task queue");
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleStatusChange = async (bookingId, newStatus) => {
    const booking = bookings.find(b => b._id === bookingId);
    try {
      await API.put(`/bookings/${bookingId}/status`, { status: newStatus });
      if (booking) {
         await addNotification(booking.user?._id || booking.user, "Booking Status Update", `Your booking for ${booking.service?.name || "your requested service"} has been moved to ${newStatus.toUpperCase()}.`);
      }
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      toast.success(`Protocol state changed to ${newStatus.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to commit status change to ledger");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border-red-200';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-2xl">
            <ClipboardList className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Customer Requests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-tight">Review and update status of your service bookings</p>
        </div>
      </div>

      {/* Customer Info Modal Overlay */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="p-8 md:p-10 text-center">
              <div className="w-24 h-24 rounded-full bg-blue-600 border-4 border-blue-100 dark:border-blue-900 mx-auto mb-6 flex items-center justify-center text-3xl font-black text-white shadow-xl overflow-hidden">
                {selectedCustomer.profileImage && selectedCustomer.profileImage !== 'https://via.placeholder.com/150' ? (
                  <img src={selectedCustomer.profileImage} alt={selectedCustomer.name} className="w-full h-full object-cover" />
                ) : (
                  selectedCustomer.name?.charAt(0) || 'C'
                )}
              </div>
              
              <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-2">{selectedCustomer.name}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-10">Verified Client</p>
              
              <div className="space-y-4 text-left">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-xl text-blue-600 shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email Terminal</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedCustomer.email}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-xl text-green-500 shadow-sm">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Comm Channel</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedCustomer.phone || "No direct link active"}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-gray-800 rounded-xl text-amber-500 shadow-sm">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Client Status</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Approved for Service Deployment</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full py-4 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
                >
                  Close Data Sheet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
                <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl animate-pulse flex justify-between items-center">
                    <div className="flex gap-4">
                        <Skeleton className="w-14 h-14 rounded-2xl" />
                        <div className="space-y-2">
                            <Skeleton className="w-48 h-6 rounded-lg" />
                            <Skeleton className="w-32 h-4 rounded-lg" />
                        </div>
                    </div>
                    <Skeleton className="w-24 h-10 rounded-xl" />
                </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 dark:bg-gray-900/30 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-gray-800 opacity-50">
            <p className="font-bold text-lg text-gray-400">Task stack is empty. Stand by for deployment.</p>
          </div>
        ) : (
          bookings.map((booking) => {
            const service = booking.service;
            return (
              <div key={booking._id}
                className="group bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-gray-800 group-hover:scale-110 transition-transform">
                            {booking.status === 'completed' ? <CheckCircle2 className="text-green-500" /> : <Clock className="text-amber-500" />}
                        </div>
                        <div>
                            <h4 className="font-black text-gray-900 dark:text-white text-lg tracking-tight line-clamp-1 uppercase">{service?.name || 'Unknown Hub'}</h4>
                            <div className="flex flex-wrap items-center gap-4 mt-1">
                                <span 
                                  onClick={() => setSelectedCustomer(booking.user)}
                                  className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest cursor-pointer hover:text-blue-600 transition-colors"
                                >
                                    <User size={12} className="text-blue-500" /> {booking.user?.name || 'Anonymous User'}
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                                    <Calendar size={12} className="text-blue-500" /> {new Date(booking.bookingDate || booking.createdAt).toLocaleDateString()} @ {booking.bookingTime || 'TBD'}
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                                    <MapPin size={12} className="text-blue-500" /> {booking.address || 'Remote Deployment'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {booking.status === 'completed' && (
                            <button 
                                onClick={() => setSelectedInvoice(booking)}
                                className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-600 rounded-xl transition-all border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-2 font-black text-[9px] uppercase tracking-widest"
                            >
                                <ReceiptText size={14} /> Slip
                            </button>
                        )}
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Action Status</span>
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                              className={`text-[10px] font-black px-4 py-2 rounded-xl border outline-none cursor-pointer transition-all shadow-sm uppercase tracking-widest ${getStatusStyle(booking.status)}`}
                            >
                              <option value="pending">Mark Pending</option>
                              <option value="confirmed">Confirm Service</option>
                              <option value="completed">Mark Completed</option>
                              <option value="cancelled">Cancel Request</option>
                            </select>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight size={18} className="text-gray-300" />
                        </div>
                    </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {selectedInvoice && (
        <InvoiceModal 
          booking={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
};

export default ProviderBookings;