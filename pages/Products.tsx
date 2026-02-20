import React, { useState, useRef } from 'react';
import { SEO } from '../components/SEO';
import { Section } from '../components/ui/Section';
import {
   Search, Filter, ArrowUpRight, Thermometer, Box,
   Activity, ShieldCheck, CheckCircle, AlertCircle,
   Droplet, Pill, FileText, Microscope, Clock, Snowflake,
   Award, BarChart3, ChevronRight, ChevronLeft, MapPin, Building2
} from 'lucide-react';
import { DISTRIBUTORS } from '../constants';
import { EssentialsTable } from '../components/EssentialsTable';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedDistributorId, setSelectedDistributorId] = useState(DISTRIBUTORS[0].id);
   const distributorsRef = useRef<HTMLDivElement>(null);

   const scrollDistributors = (direction: 'left' | 'right') => {
      if (distributorsRef.current) {
         const { scrollLeft, clientWidth } = distributorsRef.current;
         const scrollTo = direction === 'left'
            ? scrollLeft - clientWidth * 0.6
            : scrollLeft + clientWidth * 0.6;

         distributorsRef.current.scrollTo({
            left: scrollTo,
            behavior: 'smooth'
         });
      }
   };

   // Safely find the selected distributor or default to the first one
   const activeDistributor = DISTRIBUTORS.find(d => d.id === selectedDistributorId) || DISTRIBUTORS[0];

   // Filter products within the active distributor based on search
   const filteredProducts = activeDistributor.products.filter(product => {
      const lowerSearch = searchTerm.toLowerCase();
      // Ensure we access fields safely
      const pName = product.name?.toLowerCase() || '';
      const pGeneric = product.generic?.toLowerCase() || '';
      return pName.includes(lowerSearch) || pGeneric.includes(lowerSearch);
   });

   return (
      <>
         <SEO
            title="Our Products"
            description="Browse our extensive catalog of genuine medicines available for distribution in Rahim Yar Khan. Cardiology, Oncology, and more."
            keywords="Medicine Catalog, Rahim Yar Khan Pharma, Product Portfolio, Medicine Prices, Swift Sales Stock"
         />
         {/* --- 1. HERO SECTION --- */}
         <section className="relative pt-40 pb-20 bg-slate-50 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
               <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
               <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
               <div className="max-w-4xl mx-auto text-center">
                  <span className="inline-block py-1 px-3 rounded-full bg-white border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm animate-fade-in-up">
                     Product Portfolio
                  </span>
                  <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                     Pharmaceutical <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Excellence & Safety.
                     </span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                     A comprehensive, GDP-compliant catalog of high-quality medicines.
                     From essential generics to specialized biologics, we ensure integrity in every dose.
                  </p>

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                     {[
                        { label: 'Distributors', val: '34' },
                        { label: 'SKUs', val: '2,429' },
                        { label: 'Cold Chain', val: '100%' },
                        { label: 'Availability', val: 'City-Wide' }
                     ].map((stat, i) => (
                        <div key={i} className="bg-white border border-slate-100 shadow-xl shadow-blue-900/5 p-4 rounded-xl flex flex-col items-center justify-center">
                           <div className="text-2xl font-bold text-slate-900">{stat.val}</div>
                           <div className="text-xs text-slate-500 uppercase font-bold tracking-wide">{stat.label}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* --- 2. DISTRIBUTOR TABS & SEARCH BAR --- */}
         <div className="sticky top-20 z-40 py-4 bg-white/90 backdrop-blur-md border-y border-slate-200 shadow-sm transition-all">
            <div className="container mx-auto px-6">
               <div className="flex flex-col gap-6">

                  {/* Distributor Tabs (Scrollable) */}
                  <div className="relative group/tabs">
                     {/* Left Scroll Button */}
                     <button
                        onClick={() => scrollDistributors('left')}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:scale-110 transition-all opacity-0 group-hover/tabs:opacity-100 hidden md:flex"
                        aria-label="Scroll Left"
                     >
                        <ChevronLeft size={20} />
                     </button>

                     <div
                        ref={distributorsRef}
                        className="w-full overflow-x-auto no-scrollbar scroll-smooth"
                     >
                        <div className="flex items-center gap-3 pb-2 px-1">
                           <div className="flex items-center gap-2 text-slate-400 mr-2 text-sm font-bold uppercase tracking-wider shrink-0">
                              <Building2 size={14} /> Distributors:
                           </div>
                           {DISTRIBUTORS.map(dist => (
                              <button
                                 key={dist.id}
                                 onClick={() => setSelectedDistributorId(dist.id)}
                                 className={`px-5 py-2.5 rounded-full text-sm font-black uppercase tracking-wide whitespace-nowrap transition-all duration-300 border ${selectedDistributorId === dist.id
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                                    }`}
                              >
                                 {dist.name}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Right Scroll Button */}
                     <button
                        onClick={() => scrollDistributors('right')}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full flex items-center justify-center shadow-lg text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:scale-110 transition-all opacity-0 group-hover/tabs:opacity-100 hidden md:flex"
                        aria-label="Scroll Right"
                     >
                        <ChevronRight size={20} />
                     </button>
                  </div>

                  {/* Search Interaction */}
                  <div className="w-full max-w-md mx-auto relative">
                     <input
                        type="text"
                        placeholder={`Search in ${activeDistributor.name}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner transition-all"
                     />
                     <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
               </div>
            </div>
         </div>

         {/* --- 3. MAIN PRODUCT GRID --- */}
         <Section background="default" className="min-h-screen py-16">
            {filteredProducts.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProducts.map(product => (
                     <div key={product.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-4 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 hover:-translate-y-1 flex flex-col h-full">

                        {/* Image Container */}
                        <div className="relative h-64 rounded-[2rem] overflow-hidden bg-slate-50 mb-6 border border-slate-50">
                           <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-700 mix-blend-multiply"
                           />

                           {/* Badges */}
                           <div className="absolute top-4 left-4">
                              <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm backdrop-blur-md ${product.temp === 'Ambient' ? 'bg-white/80 text-slate-600 border-slate-200' : 'bg-blue-500/90 text-white border-blue-400'}`}>
                                 {product.temp}
                              </span>
                           </div>

                           {/* HOVER TOOLTIP OVERLAY */}
                           <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 text-center">
                              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center gap-4">
                                 <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-blue-600">
                                    <ArrowUpRight size={32} />
                                 </div>
                                 <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/50">
                                    <div className="text-[10px] text-blue-600 font-black uppercase tracking-widest mb-1">Product Status</div>
                                    <div className="text-sm font-bold text-slate-900 leading-tight">Authentic & Verified</div>
                                 </div>
                                 <Link to="/contact">
                                    <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-colors">
                                       Product Inquiry
                                    </button>
                                 </Link>
                              </div>
                           </div>
                        </div>

                        {/* Content */}
                        <div className="px-4 pb-4 flex flex-col flex-grow text-center">
                           <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors">
                              {product.name}
                           </h3>
                           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-4">
                              {product.generic}
                           </div>

                           <div className="mt-auto grid grid-cols-2 gap-3">
                              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Form</div>
                                 <div className="text-xs font-bold text-slate-700">{product.form}</div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                 <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Dosage</div>
                                 <div className="text-xs font-bold text-slate-700">{product.dosage}</div>
                              </div>
                           </div>
                           <p className="mt-4 text-slate-500 text-xs leading-relaxed font-medium line-clamp-2">
                              {product.desc}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                     <Search size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No Products Found</h3>
                  <button
                     onClick={() => setSearchTerm('')}
                     className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors"
                  >
                     Clear Search
                  </button>
               </div>
            )}
         </Section>

         {/* --- 4. TOP ESSENTIALS SUMMARY --- */}
         <Section background="accent" className="pb-32">
            <div className="container mx-auto px-6">
               <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">Quick Reference Summary</h2>
                  <div className="h-1.5 w-24 bg-blue-600 rounded-full mx-auto"></div>
               </div>
               <EssentialsTable />
            </div>
         </Section>
      </>
   );
};

export default Products;