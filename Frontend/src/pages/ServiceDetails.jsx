import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Star, Clock, ShieldCheck, IndianRupee, MessageSquare, ArrowLeft, Send, CheckCircle, Phone, Calendar, Share2, Mail, ExternalLink, CreditCard, MapPin, X } from 'lucide-react';
import { addNotification } from "../utils/notification";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState("10:00");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await API.get(`/services/${id}`);
        setService(data);
        setReviews(data.reviews || []);
      } catch (error) {
        toast.error("Service not found");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  if (loading) return (
      <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
  );

  if (!service) return (
      <div className="p-12 text-center animate-in fade-in duration-500">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Service Not Found</h2>
          <button onClick={() => navigate('/services')} className="text-blue-600 font-bold hover:underline">Back to Services</button>
      </div>
  );

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a service");
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    const loadingToast = toast.loading("Reserving your slot in the grid...");
    try {
        const payload = {
            serviceId: service._id,
            bookingDate,
            bookingTime,
            address,
            paymentMode: 'cash' // Defaulting to cash for initial state, can be changed later
        };

        await API.post("/bookings", payload);
        toast.success("Task Synchronized! Expert will be notified.", { id: loadingToast });
        await addNotification(service.provider?._id || service.provider, "New Service Deployment", `New mission request for ${service.name} mapping to ${bookingDate}.`);
        navigate("/dashboard");
    } catch (error) {
        toast.error(error.response?.data?.message || "Protocol link failed", { id: loadingToast });
    } finally {
        setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      navigate("/login");
      return;
    }

    if (!comment.trim()) {
        toast.error("Review comment cannot be empty");
        return;
    }

    try {
      await API.post(`/services/${id}/reviews`, {
        rating: Number(rating),
        comment,
      });
      toast.success("Review Submitted!");
      // Refresh service data
      const { data } = await API.get(`/services/${id}`);
      setService(data);
      setReviews(data.reviews || []);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Review failed");
    }
  };

  const shareService = (platform) => {
      const url = window.location.href;
      const text = `Check out this service: ${service.name}`;
      if (platform === 'whatsapp') {
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
      } else if (platform === 'email') {
          window.location.href = `mailto:?subject=${encodeURIComponent(service.title)}&body=${encodeURIComponent(text + '\n' + url)}`;
      }
      toast.success(`Opening ${platform}...`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Provider Modal Overlay */}
      {isProviderModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsProviderModalOpen(false)}
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="flex flex-col md:flex-row h-full">
              {/* Left Side: Photo & Quick Status */}
              <div className="w-full md:w-1/3 bg-blue-600 p-8 flex flex-col items-center justify-center text-center text-white relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white/30 flex items-center justify-center text-3xl font-black mb-4 mx-auto overflow-hidden">
                    {service.provider?.profileImage && service.provider.profileImage !== 'https://via.placeholder.com/150' ? (
                      <img src={service.provider.profileImage} alt={service.provider.name} className="w-full h-full object-cover" />
                    ) : (
                      service.provider?.name?.charAt(0) || 'P'
                    )}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2 uppercase">{service.provider?.name || 'Partner Pro'}</h3>
                  <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                    Verified Expert
                  </div>
                </div>
              </div>
              
              {/* Right Side: Details */}
              <div className="w-full md:w-2/3 p-8 md:p-10 space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Professional Summary</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed italic">
                    "{service.provider?.bio || 'Highly skilled professional dedicated to providing exceptional home services with a focus on quality and customer satisfaction.'}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[9px] font-black tracking-widest uppercase text-gray-400 mb-1 leading-none">Experience</p>
                    <p className="text-sm font-black text-gray-900 dark:text-white">{service.provider?.experience || 0} Years</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <p className="text-[9px] font-black tracking-widest uppercase text-gray-400 mb-1 leading-none">Status</p>
                    <p className="text-sm font-black text-blue-600 flex items-center gap-1.5 uppercase">
                      <ShieldCheck size={14} /> Verified
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Service Arsenal (Skills)</h4>
                  <div className="flex flex-wrap gap-2 text-white">
                    {(service.provider?.skills || service.category?.name || 'General').split(',').map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-900 dark:bg-white dark:text-gray-900 text-[10px] font-black rounded-lg uppercase tracking-tight">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                {service.provider?.certifications && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Credentials</h4>
                    <p className="text-xs text-gray-500 font-bold">{service.provider.certifications}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase">{service.provider?.workingHoursStart || '09:00'} - {service.provider?.workingHoursEnd || '18:00'}</p>
                  </div>
                  <button 
                    onClick={() => setIsProviderModalOpen(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Close Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors font-bold text-sm uppercase tracking-widest"
            >
                <ArrowLeft size={16} /> Back
            </button>
            <div className="flex items-center gap-4">
                <button onClick={() => shareService('whatsapp')} className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                    <Share2 size={18} />
                </button>
                <button onClick={() => shareService('email')} className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full hover:bg-green-600 hover:text-white transition-all">
                    <Mail size={18} />
                </button>
            </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Info */}
        <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-[21/9] rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-800 overflow-hidden shadow-2xl flex items-center justify-center group p-12">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
                 <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-xl group-hover:scale-110 transition-transform duration-500">
                        <CheckCircle size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase font-mono">{service.name}</h1>
                 </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-4 mb-8 text-white">
                    <span className="px-4 py-1.5 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {service.category?.name || 'General'}
                    </span>
                    <div className="flex items-center gap-1.5 text-amber-500 font-black px-4 py-1.5 bg-amber-50 dark:bg-amber-900/10 rounded-full text-[10px] uppercase tracking-widest border border-amber-100 dark:border-amber-900/20">
                        <Star size={14} fill="currentColor" />
                        {service.rating} ({service.numReviews} reviews)
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Service Description</h4>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic text-lg">
                            "{service.description}"
                        </p>
                    </div>
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Merchant Info</h4>
                        <div 
                          onClick={() => setIsProviderModalOpen(true)}
                          className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
                        >
                              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black uppercase group-hover:scale-110 transition-transform">
                                {service.provider?.name?.charAt(0) || 'P'}
                              </div>
                              <div>
                                 <p className="font-black text-gray-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                   {service.provider?.name || 'Pro Partner'}
                                   <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </p>
                                 <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{service.provider?.experience || 0} Years Experience</p>
                              </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-blue-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service Window</p>
                            <p className="font-black text-gray-900 dark:text-white uppercase">{service.provider?.workingHoursStart || '09:00'} - {service.provider?.workingHoursEnd || '18:00'}</p>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm text-green-500">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trust Status</p>
                            <p className="font-black text-gray-900 dark:text-white uppercase">{service.provider?.isVerified ? 'Verified Pro' : 'Community Partner'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <MessageSquare className="text-blue-600" />
                        Reviews
                    </h3>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-tighter">
                        Rating: {service.rating}/5.0
                    </div>
                </div>

                <form onSubmit={handleReviewSubmit} className="mb-12 bg-gray-50 dark:bg-gray-900/30 p-8 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-[10px] font-black text-gray-900 dark:text-white mb-6 uppercase tracking-[0.3em]">Rate your experience</p>
                    <div className="flex items-center gap-3 mb-6">
                        {[1,2,3,4,5].map(star => (
                            <Star 
                                key={star} 
                                size={32} 
                                className={`cursor-pointer transition-all ${rating >= star ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <textarea
                        placeholder="Share your detailed feedback with the community..."
                        className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-4 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-900 dark:text-white text-sm min-h-[120px]"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="mt-6 flex justify-end">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-3 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2">
                             Publish Review <Send size={16} />
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 opacity-40">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No field feedback yet</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="p-6 bg-gray-50 dark:bg-gray-900/30 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center font-bold text-blue-600 shadow-sm">
                                    {review.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{review.name || 'Verified User'}</p>
                                    <div className="flex items-center gap-0.5 mt-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className={i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight opacity-50">Verified Check</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium">
                            {review.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
            </div>
        </div>

        {/* Right Side: Booking Card */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl border border-blue-50 dark:border-blue-900/50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                    
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-widest">Reserve Slot</h3>
                    
                    <div className="space-y-6 mb-10">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] leading-none">Investment</span>
                            <div className="flex flex-col items-end">
                                {service.isPromo && (
                                    <span className="text-xs font-bold text-gray-400 line-through">₹{service.price}</span>
                                )}
                                <div className="flex items-center gap-1">
                                    <IndianRupee size={18} className="text-gray-400" />
                                    <span className="text-4xl font-black text-gray-900 dark:text-white leading-none tracking-tighter">
                                        {service.isPromo ? service.promoPrice : service.price}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Visit Date</label>
                                <div className="relative">
                                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="date"
                                        className="w-full bg-gray-50 dark:bg-gray-900 p-3 pl-10 rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-blue-600 appearance-none text-gray-900 dark:text-white"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Visit Time</label>
                                <div className="relative">
                                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="time"
                                        className="w-full bg-gray-50 dark:bg-gray-900 p-3 pl-10 rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-blue-600 appearance-none text-gray-900 dark:text-white"
                                        value={bookingTime}
                                        onChange={(e) => setBookingTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                              <label className="text-[10px] font-black uppercase text-gray-400 px-1 tracking-widest">Visit Address</label>
                              <div className="relative">
                                 <MapPin size={16} className="absolute left-4 top-5 text-gray-400" />
                                 <textarea 
                                     placeholder="Enter your complete visit address..."
                                     className="w-full bg-gray-50 dark:bg-gray-900 p-4 pl-12 rounded-xl text-xs font-bold border-none focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white min-h-[80px]"
                                     value={address}
                                     onChange={(e) => setAddress(e.target.value)}
                                 />
                              </div>
                        </div>

                    </div>

                    <button
                      disabled={service.availability === false || bookingLoading}
                      onClick={handleBooking}
                      className={`w-full py-5 rounded-[1.5rem] text-white font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 ${
                        service.availability !== false
                          ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/40"
                          : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50 shadow-none text-gray-500"
                      }`}
                    >
                      {service.availability !== false ? "Initiate Booking" : "Service Inactive"}
                    </button>
                    
                    <p className="text-center text-[9px] font-black text-gray-400 uppercase mt-6 tracking-widest opacity-60 italic">Request transmission protocol active</p>
                </div>

                {/* Direct Contact Card */}
                <div className="p-8 bg-gray-900 rounded-[2.5rem] shadow-xl text-white">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 font-mono">Channel Integration</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <a 
                          href={service.provider?.phone ? `tel:${service.provider.phone}` : '#'} 
                          className={`flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 ${service.provider?.phone ? 'active:scale-95 cursor-pointer' : 'opacity-50 cursor-not-allowed'} group`}
                        >
                             <Phone size={20} className="text-green-400 group-hover:scale-125 transition-transform" />
                             <span className="text-[10px] font-black uppercase tracking-tight">{service.provider?.phone ? 'Call Pro' : 'No Phone'}</span>
                             {service.provider?.phone && (
                                <span className="text-[10px] text-gray-400 font-bold">{service.provider.phone}</span>
                             )}
                        </a>
                        <a 
                          href={service.provider?.email ? `mailto:${service.provider.email}` : '#'} 
                          className={`flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 ${service.provider?.email ? 'active:scale-95 cursor-pointer' : 'opacity-50 cursor-not-allowed'} group`}
                        >
                             <ExternalLink size={20} className="text-blue-400 group-hover:scale-125 transition-transform" />
                             <span className="text-[10px] font-black uppercase tracking-tight">Email</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;