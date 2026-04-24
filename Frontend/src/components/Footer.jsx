import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MapPin, Mail, Phone, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react";
import categoryService from "../features/categories/categoryService";

const Footer = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setCategories(categoryService.getCategories());
    }, []);

  return (
    <footer className="bg-white dark:bg-gray-950 text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-32 pb-16 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 relative z-10">
        
        {/* BRAND COLUMN */}
        <div className="space-y-8">
          <Link to="/" className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase transition-transform active:scale-95 inline-block group">
            Local<span className="text-blue-600 font-black">Serve</span>
            <div className="h-0.5 w-0 group-hover:w-full bg-blue-600 transition-all duration-500 mt-0.5 rounded-full" />
          </Link>
          <p className="text-sm font-medium leading-relaxed max-w-sm text-gray-500 dark:text-gray-400">
            Revolutionizing how you access home services. Booking trusted local professionals in Ahmedabad has never been easier.
          </p>
          <div className="flex gap-4">
            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                <button key={i} className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-800 rounded-2xl transition-all shadow-sm border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30">
                    <Icon size={18} />
                </button>
            ))}
          </div>
        </div>

        {/* NAVIGATION COLUMN */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-black uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-2">
             <Globe size={12} className="text-blue-600" /> Navigation
          </h3>
          <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-blue-600 transition-colors">Our Services</Link></li>
            <li><Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-600 transition-colors">Join as Provider</Link></li>
          </ul>
        </div>

        {/* POPULAR CATEGORIES COLUMN */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-black uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-2">
             <Sparkles size={12} className="text-amber-500" /> Popular Categories
          </h3>
          <ul className="space-y-4 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {categories.slice(0, 4).map((cat) => (
              <li key={cat.id}>
                <Link to={`/services?category=${cat.name}`} className="hover:text-blue-600 transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
            {categories.length === 0 && <li className="text-gray-400 italic">No categories found</li>}
          </ul>
        </div>

        {/* GET IN TOUCH COLUMN */}
        <div>
          <h3 className="text-gray-900 dark:text-white font-black uppercase text-[10px] tracking-[0.3em] mb-8 flex items-center gap-2">
             <Zap size={12} className="text-blue-600 fill-current" /> Get in Touch
          </h3>
          <div className="space-y-6 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-gray-400 flex items-center gap-1.5"><MapPin size={10} /> Headquarters</span>
                <span className="text-gray-900 dark:text-white">Ahmedabad, Gujarat, India</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-gray-400 flex items-center gap-1.5"><Mail size={10} /> Support Email</span>
                <span className="text-blue-600">hello@localserve.in</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase text-gray-400 flex items-center gap-1.5"><Phone size={10} /> Call Us</span>
                <span className="text-gray-900 dark:text-white">+91 98765 43210</span>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="max-w-7xl mx-auto px-6">
          <div className="pt-12 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-[9px] font-black uppercase tracking-widest text-gray-400">
                <p>© {new Date().getFullYear()} LocalServe Management. Built with Excellence.</p>
                <div className="flex gap-4">
                    <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors underline decoration-gray-100 dark:decoration-gray-800 underline-offset-4">Privacy Policy</span>
                    <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors underline decoration-gray-100 dark:decoration-gray-800 underline-offset-4">Terms of Service</span>
                </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800">
                <ShieldCheck className="text-green-500" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">Secure Protocol Active</span>
            </div>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
