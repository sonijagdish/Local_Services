import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Calendar, Tag, CheckCircle, Clock, XCircle, ChevronRight, FileText, LifeBuoy, Star, Trash2, ArrowRightCircle, Sparkles, AlertTriangle, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { DashboardSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';
import { addNotification } from '../utils/notification';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const CACHE_KEY = `dashboard_bookings_${user?._id}`;

  const fetchBookings = async () => {
    try {
      const { data } = await API.get("/bookings/my-bookings");
      setBookings(data);
      // Cache the result for offline use
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
      // Fallback to cache if request fails (due to 3G/Offline)
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        setBookings(JSON.parse(cachedData));
        toast("Loaded from local node (offline cache)", { icon: '📦' });
      } else {
        toast.error("Failed to fetch bookings");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    const bookingToCancel = bookings.find(b => b._id === id);
    try {
      await API.put(`/bookings/${id}/status`, { status: "cancelled" });
      if (bookingToCancel) {
         await addNotification(bookingToCancel.provider?._id || bookingToCancel.provider, "Booking Cancelled", `The customer has cancelled the booking for ${bookingToCancel.service?.name || "your service"}.`);
      }
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to remove this booking from your history?")) {
        try {
          await API.put(`/bookings/${id}/hide`);
          toast.success("Booking record archived");
          setBookings(bookings.filter(b => b._id !== id));
        } catch (error) {
          toast.error("Failed to archive booking record");
        }
    }
  };

  const handleReportDispute = (id) => {
      if (window.confirm("Open a dispute ticket for this service? Our safety team will review the logs within 24h.")) {
          toast.success("Dispute Protocol Initiated. Ticket #" + id.slice(0, 8).toUpperCase());
      }
  };

  const [processingPayment, setProcessingPayment] = useState(null);

  const handlePayNow = async (bookingId, method) => {
    setProcessingPayment(bookingId);
    try {
      if (method === 'online') {
        // Essential: Check if SDK is available
        if (!window.Razorpay) {
          toast.error("FinTech Gateway Offline. Resetting interface...");
          window.location.reload();
          return;
        }

        // Create Order
        const { data: orderData } = await API.post("/payment/create-order", { bookingId });
        
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Local Service Hub",
          description: "Settlement for requested services",
          order_id: orderData.id,
          handler: async (response) => {
            try {
              const verifyRes = await API.post("/payment/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: orderData.bookingId,
              });
              
              if (verifyRes.data.success) {
                toast.success("Securely Verified! Receipt generated.");
                fetchBookings();
              }
            } catch (err) {
              console.error("Verification error:", err);
              toast.error(err.response?.data?.message || "Signature Validation Failed. Manual Review Required.");
            }
          },
          prefill: {
            name: user?.name || "Customer",
            email: user?.email || "customer@example.com",
            contact: "9" + Math.floor(100000000 + Math.random() * 900000000).toString(), // Generates valid-looking random Indian contact
          },
          theme: {
            color: "#3b82f6",
          },
          modal: {
            ondismiss: function() {
              setProcessingPayment(null);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
                const errorDesc = response?.error?.description || "Gateway Error";
                toast.error(`Transaction Declined: ${errorDesc}`);
                console.error("Payment failed reason:", JSON.stringify(response?.error || response, null, 2));
        });
        rzp.open();
      } else {
        // Cash payment
        await API.put(`/bookings/${bookingId}/pay`, { paymentMode: 'cash' });
        toast.success("Cash Order Logged! Expert notified.");
        fetchBookings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment Transmission Interrupted");
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'cancelled':
        return { 
          bg: 'bg-red-50 dark:bg-red-900/10', 
          text: 'text-red-600 dark:text-red-400',
          icon: <XCircle className="w-4 h-4" />
        };
      case 'completed':
        return { 
          bg: 'bg-green-50 dark:bg-green-900/10', 
          text: 'text-green-600 dark:text-green-400',
          icon: <CheckCircle className="w-4 h-4" />
        };
      case 'confirmed':
        return { 
          bg: 'bg-blue-50 dark:bg-blue-900/10', 
          text: 'text-blue-600 dark:text-blue-400',
          icon: <CheckCircle className="w-4 h-4" />
        };
      default:
        return { 
          bg: 'bg-amber-50 dark:bg-amber-900/10', 
          text: 'text-amber-600 dark:text-amber-400',
          icon: <Clock className="w-4 h-4" />
        };
    }
  };


  return (
    <div className="h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 dark:bg-none overflow-hidden flex flex-col p-4 md:p-12">
      {/* Header - Fixed/Sticky */}
      <div className="shrink-0 mb-8 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tighter">My <span className="text-blue-600">Grid</span></h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-black uppercase text-[10px] tracking-[0.3em]">Lifecycle Management for Service Requests</p>
          </div>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 md:pb-0">
               <Link to="/support" className="shrink-0 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-all">
                  <ShieldCheck size={16} className="text-blue-500" /> Trust Center
               </Link>
               <div className="shrink-0 bg-white dark:bg-gray-800 px-6 py-3 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-xl flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest whitespace-nowrap">
                  {bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length} Active Trace
                </span>
              </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable with hidden scrollbar */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-20 scroll-smooth">
        {loading ? (
          <DashboardSkeleton />
        ) : bookings.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800 rounded-[3rem] p-16 md:p-24 text-center shadow-2xl border border-blue-50 dark:border-gray-700 max-w-4xl mx-auto">
            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Calendar className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-3xl font-black mb-4 tracking-tight">Zero Activity Detected</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto font-medium">Your service history is currently empty. Synchronize with our expert network to begin.</p>
            <Link to="/services" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl transition shadow-xl shadow-blue-500/30 uppercase text-xs tracking-[0.2em] transform active:scale-95">
              Discover Experts <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 max-w-7xl mx-auto">
            {bookings.map((booking) => {
              const service = booking.service;
              const status = getStatusStyles(booking.status);

              return (
                <div
                  key={booking._id}
                  className="group bg-white/70 backdrop-blur-sm dark:bg-gray-800 rounded-[3rem] p-8 md:p-10 shadow-xl hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.15)] transition-all duration-500 border border-blue-50/50 dark:border-gray-700/50 flex flex-col relative overflow-hidden h-full"
                >
                  {booking.status === 'completed' && (
                      <div className="absolute top-4 right-4 text-green-500/5 group-hover:rotate-12 transition-transform pointer-events-none">
                          <CheckCircle size={100} />
                      </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-8 gap-4">
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 border ${status.bg} ${status.text} border-transparent shadow-sm whitespace-nowrap`}>
                      {status.icon}
                      {booking.status}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        <p className="hidden xs:block text-[9px] text-gray-300 font-black font-mono tracking-widest uppercase">NODE#{booking._id.slice(-8)}</p>
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                            <button 
                              onClick={() => handleDeleteBooking(booking._id)}
                              className="p-2 text-gray-300 hover:text-red-500 transition-colors bg-gray-50 dark:bg-gray-900 rounded-xl"
                              title="Purge from memory"
                            >
                              <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors tracking-tighter uppercase">
                      {service?.name || 'Unknown Interface'}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-8">
                      <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                        <Calendar size={16} className="text-blue-500" />
                        <span>{new Date(booking.bookingDate || booking.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                         <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Protocol: {booking.paymentMode?.toUpperCase() || 'CASH'}</span>
                      </div>
                    </div>

                    {booking.status === 'confirmed' && (
                        <div className="mt-8 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/20 flex items-center gap-5">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                                 <MapPin size={24} />
                            </div>
                            <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">Live Tracking Node</p>
                                 <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">Expert is navigating to your perimeter.</p>
                            </div>
                        </div>
                    )}
                  </div>

                  <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-800 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-none">Settlement Price</span>
                          <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                              ₹{service?.price || 0}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {booking.status === 'completed' && !booking.isPaid && (
                              <div className="flex flex-col gap-2 w-full">
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center mb-2">Service Completed - Select Payment</p>
                                  <div className="grid grid-cols-2 gap-3">
                                      <button
                                          onClick={(e) => { e.stopPropagation(); handlePayNow(booking._id, 'cash'); }}
                                          disabled={processingPayment === booking._id}
                                          className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                      >
                                          <CreditCard size={14} /> Pay Cash
                                      </button>
                                      <button
                                          onClick={(e) => { e.stopPropagation(); handlePayNow(booking._id, 'online'); }}
                                          disabled={processingPayment === booking._id}
                                          className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                                      >
                                          <Sparkles size={14} /> Pay online
                                      </button>
                                  </div>
                              </div>
                          )}

                          {booking.status === 'completed' && booking.isPaid && (
                              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                  <button
                                      onClick={() => handleReportDispute(booking._id)}
                                      className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-red-600 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all shadow-sm"
                                      title="Dispute Protocol"
                                  >
                                      <AlertTriangle size={18} />
                                  </button>
                                  <Link
                                      to={`/invoice/${booking._id}`}
                                      className="p-3 bg-white dark:bg-gray-900 text-gray-600 hover:text-blue-600 rounded-2xl border border-gray-100 dark:border-gray-800 transition-all shadow-xl"
                                      title="Download Ledger"
                                  >
                                      <FileText size={18} />
                                  </Link>
                                  <button
                                      onClick={() => navigate(`/services/${booking.service?._id}`)}
                                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/40 transition-all active:scale-95 flex items-center gap-2"
                                  >
                                      <Star size={14} fill="currentColor" /> Feedback Loop
                                  </button>
                              </div>
                          )}
                          
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                              <button
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="px-6 py-3.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-red-100 transition-all active:scale-95 shadow-xl shadow-red-500/5 whitespace-nowrap"
                              >
                                  Terminate Session
                              </button>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;