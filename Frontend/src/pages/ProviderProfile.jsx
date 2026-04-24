import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { User, Phone, BookOpen, Star, Camera, CheckCircle, Save, Edit3, ShieldCheck, Clock, Award, Wallet, Briefcase } from 'lucide-react';

const ProviderProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
    profileImage: user?.profileImage || '',
    experience: user?.experience || '',
    certifications: user?.certifications || '',
    workingHoursStart: user?.workingHoursStart || '09:00',
    workingHoursEnd: user?.workingHoursEnd || '18:00',
    payoutMethod: user?.payoutMethod || 'upi',
    payoutId: user?.payoutId || '',
  });

  const handleSave = async () => {
    try {
      const { data } = await API.put("/users/profile", form);
      updateUser(data); // Update context and localStorage
      toast.success('Professional Profile Updated!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profileImage: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="relative bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Header Cover Piece */}
        <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10" />
        </div>

        <div className="px-8 pb-12">
            <div className="relative -mt-16 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col md:flex-row md:items-end gap-6">
                    <div className="relative group">
                        <img
                            src={form.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random&size=256`}
                            alt="profile"
                            className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] object-cover border-8 border-white dark:border-gray-800 shadow-xl"
                        />
                        {isEditing && (
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2.5rem] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={32} />
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        )}
                    </div>

                    <div className="flex-1 pb-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{form.name}</h1>
                            {user?.isVerified && (
                                <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 dark:border-green-800 font-mono">
                                    <ShieldCheck size={12} /> Verified Pro
                                </div>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Expert Service Provider • {form.experience || 0} Years Exp.</p>
                    </div>
                </div>

                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="mb-4 bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-200 px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2"
                    >
                        <Edit3 size={18} /> Edit Business Profile
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                    <div className="md:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Experience (Years)</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    value={form.experience}
                                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Working From</label>
                                <input
                                    type="time"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    value={form.workingHoursStart}
                                    onChange={(e) => setForm({ ...form, workingHoursStart: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Working To</label>
                                <input
                                    type="time"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                                    value={form.workingHoursEnd}
                                    onChange={(e) => setForm({ ...form, workingHoursEnd: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Certifications & Awards</label>
                            <textarea
                                placeholder="List your professional certifications (e.g. ISO Certified Plumber 2023)..."
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-4 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                                value={form.certifications}
                                onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Business Bio</label>
                            <textarea
                                placeholder="Describe your experience and work ethic..."
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-5 rounded-3xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[150px]"
                                value={form.bio}
                                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-50 dark:bg-gray-900/60 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Payout Configuration</h4>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 px-1">Method</label>
                                    <select 
                                        className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-600 font-bold"
                                        value={form.payoutMethod}
                                        onChange={(e) => setForm({ ...form, payoutMethod: e.target.value })}
                                    >
                                        <option value="upi">UPI ID</option>
                                        <option value="bank">Bank Transfer</option>
                                        <option value="paypal">PayPal</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase text-gray-400 px-1">Account ID / ID</label>
                                    <input
                                        type="text"
                                        placeholder="yourname@upi"
                                        className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl text-sm border-none focus:ring-2 focus:ring-blue-600 font-mono"
                                        value={form.payoutId}
                                        onChange={(e) => setForm({ ...form, payoutId: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <button
                                onClick={handleSave}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Save size={20} /> Deploy Changes
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="w-full text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors py-2"
                            >
                                Discard Unsaved Work
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
                    <div className="md:col-span-2 space-y-12">
                        <section>
                            <div className="flex items-center gap-2 mb-4 text-blue-600 font-black text-xs uppercase tracking-widest">
                                <Briefcase size={16} /> Mission Statement
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xl font-medium italic border-l-8 border-gray-100 dark:border-gray-700 pl-8">
                                {form.bio || "No professional business bio added yet. Tell your clients what makes you special!"}
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section>
                                <div className="flex items-center gap-2 mb-6 text-blue-600 font-black text-xs uppercase tracking-widest">
                                    <Award size={16} /> Certifications
                                </div>
                                <div className="space-y-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    {form.certifications ? (
                                        form.certifications.split('\n').map((cert, i) => (
                                            <div key={i} className="flex gap-2 items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                                {cert}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic">No certifications listed</p>
                                    )}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6 text-blue-600 font-black text-xs uppercase tracking-widest">
                                    <Clock size={16} /> Availability
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase mb-1">Weekly Working Hours</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">
                                        {form.workingHoursStart} — {form.workingHoursEnd}
                                    </p>
                                    <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mt-2 flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Available Now
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-gray-50 dark:bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                             <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Node Status</h4>
                             <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-blue-600">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Direct Line</p>
                                        <p className="font-black text-gray-900 dark:text-white font-mono">{form.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm text-indigo-600">
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Payout ID</p>
                                        <p className="font-black text-gray-900 dark:text-white font-mono uppercase truncate max-w-[120px]">
                                            {form.payoutId || 'Not Set'}
                                        </p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                             <Wallet className="absolute right-6 top-6 opacity-10 group-hover:scale-125 transition-transform" size={100} />
                             <h4 className="text-[10px] font-black uppercase tracking-widest mb-8 opacity-60">Payout Readiness</h4>
                             <div className="relative">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Confirmed Balance</p>
                                 <h3 className="text-5xl font-black tracking-tighter mb-8 leading-none">₹{user?.wallet || 0}</h3>
                                 <button className="w-full bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-400 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                                     Transfer to {form.payoutMethod.toUpperCase()}
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
