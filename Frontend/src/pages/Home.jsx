import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import API from '../api/axios';
import { Sparkles, Star, Users, CheckCircle, ShieldCheck, ArrowRight, Zap, PlayCircle, Apple, Store, Layers } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [stats, setStats] = useState({ users: 1542, bookings: 1200, services: 0, rating: 4.8 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [srvRes, statRes, catRes] = await Promise.all([
                    API.get('/services'),
                    API.get('/admin/public-stats'),
                    API.get('/categories')
                ]);
                setServices(srvRes.data);
                setStats(statRes.data);
                setCategories(catRes.data);
            } catch (error) {
                console.error('Failed to fetch home data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const featuredServices = services.slice(0, 10);

    const sliderRef = useRef(null);
    const scroll = (dir) => {
        const scrollAmount = window.innerWidth > 768 ? 900 : 320;
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: dir === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const taglines = [
        'Trusted Professionals',
        'Quick & Reliable Services',
        'Doorstep Service Experts',
        'Verified & Affordable',
    ];

    const [taglineIndex, setTaglineIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTaglineIndex((prev) => (prev + 1) % taglines.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [taglines.length]);

    if (loading) return <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center font-black uppercase tracking-widest text-blue-600 animate-pulse">Syncing Services...</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
            {/* HERO SECTION */}
            <section className="relative min-h-[90vh] flex items-center px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-48 -mt-48" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -ml-40 -mb-40" />

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <Motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-blue-100 dark:border-blue-800">
                            <Sparkles size={14} className="animate-pulse" /> Your Home, Handled with Care
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-[0.9] mb-8">
                            Smart services <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for smart living.</span>
                        </h1>

                        <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-lg mb-12 leading-relaxed">
                            Instantly book top-rated professionals for beauty, cleaning, repairs and more. Everything you need, delivered at your doorstep.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link to="/services" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group">
                                Book Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/register" className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3">
                                <PlayCircle size={20} /> Join as Pro
                            </Link>
                        </div>

                        <div className="mt-16 flex items-center gap-8 border-t border-gray-100 dark:border-gray-800 pt-10">
                            <div>
                                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.users > 1000 ? `${(stats.users / 1000).toFixed(1)}k+` : stats.users}</p>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Users</p>
                            </div>
                            <div className="w-px h-10 bg-gray-100 dark:bg-gray-800" />
                            <div>
                                <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.rating || '4.8'}/5.0</p>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Average Rating</p>
                            </div>
                        </div>
                    </Motion.div>

                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative aspect-square bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[4rem] overflow-hidden flex items-center justify-center p-12">
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10" />
                            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
                                    <Motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4 }}
                                        className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8 border border-white/30"
                                    >
                                        <Zap size={48} className="text-white fill-white" />
                                    </Motion.div>
                                    <h3 className="text-4xl font-black tracking-tighter mb-4 italic">"{taglines[taglineIndex]}"</h3>
                                    <p className="text-white/70 font-bold uppercase tracking-widest text-xs">Quality Guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                </div>
            </section>

            {/* STATS STRIP */}
            <section className="bg-gray-50 dark:bg-gray-900 py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-12">
                    {[
                        { count: stats.users, label: 'Active Users', icon: <Users className="text-indigo-600" /> },
                        { count: categories.length, label: 'Service Domains', icon: <Zap className="text-amber-500" /> },
                        { count: stats.bookings, label: 'Jobs Completed', icon: <CheckCircle className="text-blue-600" /> },
                        { count: stats.providers, label: 'Verified Experts', icon: <ShieldCheck className="text-green-500" /> },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                            <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                                    {stat.count || 0}{stat.count > 1000 ? '+' : ''}
                                </h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TOP CATEGORIES */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-amber-100 dark:border-amber-800 font-mono">
                            <Sparkles size={12} /> Discovery Protocol
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 leading-none uppercase font-mono">
                            Browse <br /><span className="text-blue-600">Top Domains</span>
                        </h2>
                        <p className="text-gray-500 font-medium max-w-md">Synchronize with specialized expertise across standard domestic maintenance sectors.</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.slice(0, 8).map((cat) => (
                        <div
                            key={cat._id}
                            onClick={() => navigate(`/services?category=${cat._id}`)}
                            className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700 group hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -translate-y-12 translate-x-12 group-hover:bg-blue-600/10 transition-colors" />
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Layers size={24} />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">{cat.name}</h4>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                                Explore <ArrowRight size={12} />
                            </p>
                        </div>
                    ))}
                    <div
                        onClick={() => navigate('/services')}
                        className="bg-gray-900 p-8 rounded-[3rem] shadow-2xl text-white group hover:bg-black transition-all cursor-pointer flex flex-col justify-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-2 font-mono">Neural Hub</p>
                        <h4 className="text-2xl font-black tracking-tight mb-4 uppercase">View All Domains</h4>
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:translate-x-4 transition-transform">
                            <ArrowRight size={24} />
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED SERVICES */}
            <section className="bg-white dark:bg-gray-950 py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto relative">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">Editor's <span className="text-blue-600">Choices</span></h2>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Highest rated services this week</p>
                        </div>
                        <div className="hidden md:flex gap-4">
                            <button onClick={() => scroll('left')} className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <ArrowRight size={20} className="rotate-180" />
                            </button>
                            <button onClick={() => scroll('right')} className="p-4 rounded-3xl bg-gray-50 dark:bg-gray-900 text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={sliderRef}
                        className="flex gap-8 overflow-x-auto overflow-y-hidden scroll-smooth pb-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {featuredServices.map((service, idx) => (
                            <Motion.div
                                key={`${service._id}-${idx}`}
                                whileHover={{ y: -10 }}
                                className="min-w-[320px] md:min-w-[400px] bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col group"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-12">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                        <span className="text-6xl font-black text-white/20 group-hover:scale-125 transition-transform duration-700">{service.name.charAt(0)}</span>
                                    </div>
                                    <div className="absolute bottom-4 left-6 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                                        Popular Choice
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight line-clamp-1">{service.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium line-clamp-2 mb-6 leading-relaxed">
                                        {service.description}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price Start</p>
                                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">₹{service.price}</p>
                                        </div>
                                        <Link
                                            to={`/services/${service._id}`}
                                            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white transition-all active:scale-95"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </Motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY US? */}
            <section className="py-24 px-6 bg-gray-50 dark:bg-gray-900/30">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter text-center mb-16">
                        Why book with <span className="text-blue-600">us?</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                        {[
                            { title: 'Verified Pros', desc: 'Every professional undergoes a rigorous background check & skills test.', color: 'blue' },
                            { title: 'Standardized Pricing', desc: 'No hidden fees. Upfront pricing so you know exactly what you pay.', color: 'indigo' },
                            { title: 'Quality Work', desc: 'If something goes wrong, we will fix it. Our 24/7 support is there for you.', color: 'green' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 relative group overflow-hidden">
                                <div className={`absolute -right-12 -top-12 w-32 h-32 bg-${item.color}-500/10 rounded-full group-hover:scale-150 transition-transform duration-700`} />
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gray-950 z-0" />
                <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 text-center relative z-10 shadow-3xl text-white">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">
                        Let's get your <br /> service booked.
                    </h2>
                    <p className="text-xl text-white/80 font-medium max-w-xl mx-auto mb-12">
                        Join our million customers who trust us for their daily chores and home maintenance.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Link to="/services" className="w-full md:w-auto px-12 py-5 bg-white text-blue-600 rounded-[2rem] font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all">
                            Download App
                        </Link>
                        <div className="flex gap-4">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                                <Apple size={24} />
                            </div>
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer">
                                <Store size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
