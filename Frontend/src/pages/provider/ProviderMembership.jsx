import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Check, Sparkles, Rocket, Crown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import toast from "react-hot-toast";

const ProviderMembership = () => {
  const { user, setUser } = useAuth();
  const currentPlan = user?.membershipPlan || 'Basic';

  const plans = [
    {
      name: "Basic",
      price: "0",
      features: ["Standard Listing", "Basic Analytics", "Community Support"],
      icon: <Sparkles className="text-gray-400" />,
      color: "bg-gray-100",
      textColor: "text-gray-600"
    },
    {
      name: "Premium",
      price: "1999",
      features: ["Priority Listing", "Verified Badge", "Detailed Revenue Insights", "24/7 Support"],
      icon: <Rocket className="text-blue-500" />,
      color: "bg-blue-600 shadow-blue-500/30",
      textColor: "text-white",
      highlight: true
    },
    {
      name: "Elite",
      price: "4999",
      features: ["Featured Search Position", "Zero Commission (Limited)", "Account Manager", "Direct Lead Access"],
      icon: <Crown className="text-amber-500" />,
      color: "bg-gray-900 shadow-gray-900/40",
      textColor: "text-white"
    }
  ];

  const handleUpgrade = (planName, price) => {
    if (planName === currentPlan) {
        toast.error("You are already on this plan.");
        return;
    }

    if (window.confirm(`Upgrade to ${planName} for ₹${price}/month?`)) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users[index].membershipPlan = planName;
            users[index].isVerified = planName !== 'Basic' ? true : users[index].isVerified;
            localStorage.setItem('users', JSON.stringify(users));
            setUser({...user, membershipPlan: planName, isVerified: users[index].isVerified});
            
            // Log Subscription Revenue
            const platformRevenueLog = JSON.parse(localStorage.getItem('platform_revenue_log')) || [];
            platformRevenueLog.push({
                type: 'subscription',
                amount: Number(price),
                plan: planName,
                date: new Date().toISOString(),
                providerId: user.id
            });
            localStorage.setItem('platform_revenue_log', JSON.stringify(platformRevenueLog));
            
            toast.success(`Welcome to the ${planName} tier! Your profile is now boosted.`);
        }
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase font-mono mb-4">Grow Your <span className="text-blue-600">Influence</span></h2>
        <p className="text-gray-500 font-medium italic">"The right tools amplify the best experts. Unlock premium visibility and direct lead vectors by upgrading your terminal."</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div key={i} className={`relative p-10 rounded-[3rem] border transition-all duration-500 flex flex-col h-full group ${
              plan.highlight 
              ? 'bg-blue-600 text-white border-blue-400 shadow-2xl scale-105 z-10' 
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-100 dark:border-gray-700 hover:shadow-xl'
          }`}>
            {plan.highlight && (
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-500 text-white text-[10px] font-black uppercase px-6 py-2 rounded-full shadow-lg tracking-widest animate-bounce">
                    Most Popular Node
                </div>
            )}
            
            <div className={`p-4 rounded-3xl w-fit mb-8 ${plan.highlight ? 'bg-white/10 border border-white/20' : 'bg-gray-50 dark:bg-gray-900'} group-hover:scale-110 transition-transform`}>
                {plan.icon}
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 font-mono">{plan.name} Plan</h3>
            <div className="flex items-baseline gap-2 mb-10">
                 <span className="text-5xl font-black tracking-tighter">₹{plan.price}</span>
                 <span className={`text-xs font-black uppercase tracking-widest opacity-60`}>/Cycle</span>
            </div>

            <div className="flex-grow space-y-4 mb-12">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${plan.highlight ? 'text-blue-200' : 'text-gray-400'}`}>Protocol Perks:</p>
                {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                         <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'bg-white' : 'bg-blue-600'}`}>
                             <Check size={10} className={plan.highlight ? 'text-blue-600' : 'text-white'} />
                         </div>
                         <span className={`text-sm font-bold ${plan.highlight ? 'text-blue-50' : 'text-gray-500 dark:text-gray-400'} tracking-tight leading-tight`}>{feature}</span>
                    </div>
                ))}
            </div>

            <button 
                onClick={() => handleUpgrade(plan.name, plan.price)}
                className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${
                    plan.name === currentPlan 
                    ? 'bg-green-500 text-white opacity-50 cursor-default' 
                    : plan.highlight 
                        ? 'bg-white text-blue-600 hover:bg-blue-50' 
                        : 'bg-gray-900 dark:bg-blue-600 text-white hover:bg-black dark:hover:bg-blue-700 shadow-gray-200/50 dark:shadow-blue-900/30'
                }`}
            >
                {plan.name === currentPlan ? <ShieldCheck size={18} /> : <Zap size={18} fill="currentColor" />}
                {plan.name === currentPlan ? 'Active Protocol' : 'Sync Interface'}
                {plan.name !== currentPlan && <ArrowRight size={16} />}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-10 rounded-[3rem] border border-amber-100 dark:border-amber-900/30 flex flex-col md:flex-row items-center gap-10">
           <div className="p-5 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl text-amber-500 border border-amber-100 dark:border-amber-900/20">
                <Crown size={60} />
           </div>
           <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 font-mono">Platform Recommendation</p>
                <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">Featured Listing Add-on</h4>
                <p className="text-gray-500 dark:text-gray-400 font-medium">Boost your individual services to the top of the search stack for only ₹499 per deployment. Reach 10x more customers instantly.</p>
           </div>
           <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black px-8 py-4 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Buy Ad Space</button>
      </div>
    </div>
  );
};

export default ProviderMembership;
