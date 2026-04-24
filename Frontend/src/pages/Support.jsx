import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, MessageSquare, Phone, LifeBuoy, Send, ArrowLeft, ShieldCheck, Headphones } from 'lucide-react';
import toast from 'react-hot-toast';

const Support = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    subject: '',
    category: 'support',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Your report has been submitted. Support ticket #LS-' + Math.floor(Math.random() * 90000 + 10000));
    navigate('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Help Center Sidebar */}
        <div className="md:w-1/3 space-y-8">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={16} /> Back
            </button>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Help Center</h3>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                            <Headphones size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Call Support</p>
                            <p className="text-xs text-gray-500">24/7 Priority Line</p>
                            <p className="text-sm font-black text-blue-600 mt-1">1800-419-0112</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                            <MessageSquare size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Live Chat</p>
                            <p className="text-xs text-gray-500">Wait time: ~2 mins</p>
                            <button className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-600 mt-1">Start Chat</button>
                        </div>
                    </div>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                         <ShieldCheck className="text-green-500 mb-3" size={24} />
                         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Protection Program</p>
                         <p className="text-xs font-medium text-gray-600 leading-relaxed">Every booking is covered by our Service Satisfaction Guarantee.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Contact Form */}
        <div className="md:w-2/3 bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl">
                    <LifeBuoy className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono">Report an Issue</h2>
                   <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Dispute Resolution & Complaints</p>
                </div>
             </div>

             <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Nature of Complaint</label>
                    <select 
                        className="w-full bg-gray-50 dark:bg-gray-900 border-none p-4 rounded-2xl text-sm font-black focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white appearance-none"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        <option value="support">General Support</option>
                        <option value="payment">Payment/Refund Inquiry</option>
                        <option value="quality">Service Quality Issue</option>
                        <option value="professionalism">Merchant Behavior</option>
                        <option value="technical">Technical Glitch</option>
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Subject</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Refund requested for incomplete cleaning"
                        className="w-full bg-gray-50 dark:bg-gray-900 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Detailed Message</label>
                    <textarea 
                        placeholder="Please provide order ID and specific details of your concern..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border-none p-5 rounded-[2rem] text-sm font-medium focus:ring-2 focus:ring-blue-600 text-gray-900 dark:text-white min-h-[200px]"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                </div>

                <button className="w-full bg-gray-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white font-black py-5 rounded-[2.5rem] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3">
                    <Send size={20} /> Submit Formal Report
                </button>
                <p className="text-center text-[10px] font-bold text-gray-400 tracking-widest opacity-50 uppercase mt-4 italic">Response within 24 working hours guaranteed</p>
             </form>
        </div>
      </div>
    </div>
  );
};

export default Support;
