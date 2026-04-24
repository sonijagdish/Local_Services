import { Link } from "react-router-dom";
import { Star, IndianRupee, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const ServiceCard = ({ service, categoryName }) => {
  return (
    <Motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 flex flex-col h-full overflow-hidden"
    >
      {/* Promo Badge */}
      {service.isPromo && (
          <div className="absolute top-8 left-[-2rem] bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest px-10 py-1 -rotate-45 shadow-lg z-10 flex items-center gap-1.5 border border-indigo-400">
              <Sparkles size={10} /> Promo
          </div>
      )}

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
      
      {/* Icon/Category Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <Zap size={24} />
        </div>
        <div className="px-3 py-1 bg-gray-50 dark:bg-gray-900 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 dark:border-gray-800">
            {categoryName || 'General'}
        </div>
      </div>

      <div className="flex-grow">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed line-clamp-2 h-10 italic">
            "{service.description}"
          </p>
      </div>

      <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span>{service.rating} ({service.numReviews} reviews)</span>
              </div>
              {service.provider?.isVerified && (
                  <div className="flex items-center gap-1.5 text-green-500">
                      <ShieldCheck size={12} />
                      <span>Verified Pro</span>
                  </div>
              )}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-700">
              <div className="flex items-baseline gap-1">
                  <IndianRupee size={16} className="text-gray-400 font-black" />
                  <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                      {service.price}
                  </span>
              </div>
              <Link
                to={`/services/${service._id}`}
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-4 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white group/btn"
              >
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
          </div>
      </div>
    </Motion.div>
  );
};

export default ServiceCard;