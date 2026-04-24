import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Search, Filter, SlidersHorizontal, ArrowUpDown, CheckCircle, Info, Sparkles, Megaphone, TrendingUp } from 'lucide-react';

const ServiceList = () => {
  const { search: urlSearch } = useLocation();
  const queryParams = new URLSearchParams(urlSearch);
  const initialCategory = queryParams.get("category") || "";
  const initialSearch = queryParams.get("search") || "";

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setSearch(initialSearch);
  }, [initialCategory, initialSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          API.get("/services"),
          API.get("/categories"),
        ]);
        setServices(servicesRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        toast.error("Failed to fetch data from server");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "" || service.category === selectedCategory || (service.category?._id === selectedCategory);
        const matchesMinPrice = minPrice === "" || service.price >= (parseFloat(minPrice) || 0);
        const matchesMaxPrice = maxPrice === "" || service.price <= (parseFloat(maxPrice) || Infinity);
        const matchesRating = minRating === "" || service.rating >= (parseFloat(minRating) || 0);
        
        // Use our new backend data
        const matchesAvailability = !availabilityOnly || service.availability === true;
        const matchesVerified = !verifiedOnly || service.provider?.isVerified === true;

        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesRating && matchesAvailability && matchesVerified;
      })
      .sort((a, b) => {
        if (sortOption === "priceLow") return a.price - b.price;
        if (sortOption === "priceHigh") return b.price - a.price;
        if (sortOption === "ratingHigh") return b.rating - a.rating;
        return 0;
      });
  }, [services, search, selectedCategory, minPrice, maxPrice, minRating, sortOption, availabilityOnly, verifiedOnly]);

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center text-blue-500 font-bold">Synchronizing Data Stream...</div>;
  }

  return (
    <div className="min-h-screen bg-transparent p-6 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
                Explore <span className="text-blue-600">Experts</span>
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-xl">Verified service nodes for your domestic and professional infrastructure.</p>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className="hidden md:flex flex-col items-end mr-6 text-right">
                    <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-1 flex items-center gap-1">
                        <TrendingUp size={12} /> Sponsored Stream
                    </p>
                    <p className="text-xs font-bold text-gray-400">Featured experts reach 10x more visibility</p>
                 </div>
                 <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-[1.5rem] border border-blue-100 dark:border-blue-800 flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest">{filteredServices.length} Results</span>
                </div>
            </div>
        </div>

        {/* Search & Main Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Scan service grid..."
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-5 pl-14 rounded-[2rem] shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-gray-900 dark:text-white font-black uppercase text-xs tracking-widest"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="relative">
                <Filter className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 p-5 pl-14 rounded-[2rem] shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none font-black text-[10px] uppercase tracking-widest text-gray-700 dark:text-gray-200"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
            </div>
        </div>

        {/* Detailed Filters Panel */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700/50 mb-12">
            <div className="flex items-center gap-2 mb-8 text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <SlidersHorizontal size={14} />
                Filter Protocol
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 px-1 uppercase">Budget Variance</label>
                    <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white appearance-none"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="text-gray-300">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white appearance-none"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 px-1 uppercase">Reputation Floor</label>
                    <select
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-900 dark:text-white"
                      value={minRating}
                      onChange={(e) => setMinRating(e.target.value)}
                    >
                      <option value="">Any Rating</option>
                      {[4,3,2,1].map(r => (
                          <option key={r} value={r}>⭐ {r}+ Threshold</option>
                      ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-gray-400 px-1 uppercase">Sorting Matrix</label>
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <select
                          className="w-full bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-800 p-3 pl-10 rounded-xl text-xs font-black focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-gray-900 dark:text-white"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                        >
                          <option value="">Default Sync</option>
                          <option value="priceLow">Cost: Ascending</option>
                          <option value="priceHigh">Cost: Descending</option>
                          <option value="ratingHigh">Elite Ratings First</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-end pb-1">
                    <label className="flex items-center gap-3 cursor-pointer group bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all w-full">
                      <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={availabilityOnly}
                            onChange={() => setAvailabilityOnly(!availabilityOnly)}
                        />
                        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Only</span>
                    </label>
                </div>

                <div className="flex items-end pb-1">
                    <label className="flex items-center gap-3 cursor-pointer group bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-transparent hover:border-blue-200 transition-all w-full">
                      <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={verifiedOnly}
                            onChange={() => setVerifiedOnly(!verifiedOnly)}
                        />
                        <div className="w-10 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Verified Pro</span>
                    </label>
                </div>
            </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => {
              const category = categories.find((cat) => cat._id === (service.category?._id || service.category));
              
              const showAd = (index + 1) % 5 === 0;

              return (
                <React.Fragment key={service._id}>
                  <div className="relative">
                    {service.isFeatured && (
                      <div className="absolute -top-3 left-8 z-10 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                        <Sparkles size={10} fill="currentColor" /> Featured Expert
                      </div>
                    )}
                    <ServiceCard
                      service={service}
                      categoryName={category?.name}
                    />
                  </div>
                  {showAd && (
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group border border-gray-700 h-full flex flex-col justify-center">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                      <Megaphone
                        className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:rotate-12 transition-transform duration-500"
                        size={120}
                      />
                      <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4 font-mono">
                          Sponsored Channel
                        </p>
                        <h4 className="text-2xl font-black tracking-tight mb-2 uppercase">
                          Upgrade Your Hub
                        </h4>
                        <p className="text-gray-400 text-sm font-medium mb-6 leading-relaxed">
                          Boost your merchant profile to the top layer. Deploy
                          your expertise where users search most.
                        </p>
                        <button className="bg-white text-gray-900 font-black px-8 py-3 rounded-xl uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                          Promote Now
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info size={40} className="text-red-500" />
            </div>
            <h3 className="text-3xl font-black mb-2 tracking-tight text-gray-900 dark:text-white">Null Results Detected</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto font-medium">We couldn't synchronize any services matching your filters. Adjust the matrix and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;