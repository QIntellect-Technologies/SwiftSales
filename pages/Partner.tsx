import React, { useState } from 'react';
import { SEO } from '../components/SEO';
import { Section, SectionHeader } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import {
   Handshake, Globe, ShieldCheck, TrendingUp, Users,
   ArrowRight, CheckCircle2, Building2, Truck, Cpu,
   BarChart3, Network, Zap, HeartHandshake, Link as LinkIcon,
   FlaskConical, Syringe, Box, Lock, Search, Activity
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { DISTRIBUTORS } from '../constants'; // Import real distributors

// --- PARTNER DATA MAPPING ---
// We map the DISTRIBUTORS array to the PartnerProfile interface dynamically

const Partners: React.FC = () => {
   const [filter, setFilter] = useState('All');

   // Filter logic: In real app, we might distinguish types more, but for now we treat all Distributors as 'Manufacturer'
   // or use the 'role' field if we added it (we did!).
   // We also include the hardcoded ones if they are NOT distributors, but here we replace them with our real list.

   const realPartners = DISTRIBUTORS.map(d => ({
      id: d.id,
      name: d.name,
      type: (d.role || 'Manufacturer') as 'Manufacturer' | 'Logistics' | 'Technology' | 'Research',
      logo: d.products[0]?.image || '/images/p1.png', // Use first product image as fallback logo for now
      description: d.description || 'Verified pharmaceutical partner ensuring quality supply.',
      collaboration: d.collaboration || 'Strategic distribution alliance.',
      initiatives: d.initiatives || ['Quality Supply'],
      color: d.color || 'blue'
   }));

   const filteredPartners = realPartners.filter(p => filter === 'All' || p.type === filter);

   return (
      <>
         <SEO
            title="Our Partners"
            description="Collaborating with global pharmaceutical giants to bring quality medicines to Rahim Yar Khan. Our trusted manufacturing and logistics partners."
            keywords="Pharma Partners, Global Brands, Medicine Suppliers, Getz Pharma, Abbott, GSK, Rahim Yar Khan"
         />
         {/* --- 1. HERO SECTION --- */}
         <section className="relative pt-40 pb-20 bg-slate-50 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
               <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
               <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="max-w-4xl mx-auto text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm text-blue-700 font-bold text-xs uppercase tracking-widest mb-8 animate-fade-in-up">
                     <Handshake size={16} /> Local Alliances
                  </span>
                  <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                     Medicine Distributor <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Partners.
                     </span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                     We collaborate with the best manufacturers and tech leaders to keep our city's supply chain reliable. Every partner is chosen for their high standards in distribution and safety.
                  </p>
               </div>
            </div>
         </section>

         {/* --- 2. WHY CONNECT WITH SWIFT SALES? (EXPANDED) --- */}
         <Section className="py-24 bg-white relative overflow-visible">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/20 skew-x-12 transform origin-top-right -z-10"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               <div className="col-span-1 md:col-span-3 text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                     <TrendingUp size={12} /> Partner Value
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Why Connect with Swift Sales?</h2>
                  <p className="text-slate-500 font-medium max-w-2xl mx-auto mt-4">We simplify medicine distribution so you can focus on making it. Here is how we serve our partners every day.</p>
               </div>

               {[
                  { icon: Globe, title: 'Instant City Reach', desc: 'Connect to over 200+ pharmacies and every major hospital in the city the moment you partner with us.' },
                  { icon: ShieldCheck, title: 'No-Stress Compliance', desc: 'We take care of all local health rules, paperwork, and safety laws. You are always 100% legal with us.' },
                  { icon: Zap, title: '45-Minute Response', desc: 'Our "Pulse" delivery protocol means your medicine reaches critical patients faster than any other distributor.' },
                  { icon: Box, title: 'Cold-Chain Mastery', desc: 'Sensitive vaccines or biologics? We have sub-zero vans and hubs synced to your lab standards.' },
                  { icon: Network, title: 'Smart Hub Sync', desc: 'See your products move through our hubs. Our technical gateway gives you full visibility of the city supply.' },
                  { icon: Users, title: 'Local Trust Team', desc: 'We have built 10+ years of trust with city doctors and pharmacists. Your brand is in safe, professional hands.' }
               ].map((item, i) => (
                  <Card key={i} className="p-10 border-blue-50/50 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all duration-500 group bg-white rounded-[3rem] hover:-translate-y-2">
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 transition-all duration-500">
                        <item.icon size={36} />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{item.title}</h3>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </Card>
               ))}
            </div>
         </Section>

         {/* --- 3. THE SERVICE JOURNEY (NEW VISUAL WALKTHROUGH) --- */}
         <section className="relative py-32 bg-slate-900 overflow-hidden">
            <div className="absolute inset-0">
               <img src="/images/hero.png" alt="Operational Background" className="w-full h-full object-cover opacity-20" />
               <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-transparent to-slate-900"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="text-center mb-24">
                  <span className="inline-block py-1.5 px-4 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest mb-6">
                     Serving Together
                  </span>
                  <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Your Medicine's City Journey.</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto mt-6 text-lg font-medium">From the moment you hand us your products, we treat them with clinical precision until they reach the patient.</p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {[
                     {
                        title: 'Secure Receiving',
                        desc: 'Products enter our sanitized "Pharma-Vault" where every batch is verified by our clinical safety team.',
                        image: '/images/mission.png',
                        step: '01'
                     },
                     {
                        title: 'The Digital Sync',
                        desc: 'Your stock is live! Hubs and vans are synced through our technical gateway for instant deployment.',
                        image: '/images/about_story.png',
                        step: '02'
                     },
                     {
                        title: 'Patient Arrival',
                        desc: 'Swift delivery to the bedside or pharmacy shelf. We complete the circle of care in record time.',
                        image: '/images/immunology.png',
                        step: '03'
                     }
                  ].map((item, i) => (
                     <div key={i} className="group relative">
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 mb-8 shadow-2xl">
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                           <div className="absolute top-8 left-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-black text-xl border border-white/10">
                              {item.step}
                           </div>
                           <div className="absolute bottom-8 left-8 right-8">
                              <h3 className="text-3xl font-black text-white mb-3 tracking-tight">{item.title}</h3>
                              <p className="text-slate-300 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0 text-balance">
                                 {item.desc}
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- 3. PARTNER ECOSYSTEM GRID (LIGHT THEME) --- */}
         <Section background="accent" className="py-24 relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
               <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                     <Network size={14} /> The Ecosystem
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Trusted Network</h2>
                  <p className="text-slate-600 text-lg">
                     We categorize our partnerships into strategic pillars to ensure holistic coverage of the supply chain.
                  </p>
               </div>

               {/* Filters */}
               <div className="flex gap-2 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
                  {['All', 'Manufacturer', 'Logistics', 'Technology'].map((cat, i) => (
                     <button
                        key={i}
                        onClick={() => setFilter(cat === 'Manufacturer' ? 'Manufacturer' : cat === 'Logistics' ? 'Logistics' : cat === 'Technology' ? 'Technology' : 'All')}
                        className={`px - 5 py - 2 rounded - full text - sm font - bold transition - all duration - 300 ${filter === (cat === 'Manufacturer' ? 'Manufacturer' : cat === 'Logistics' ? 'Logistics' : cat === 'Technology' ? 'Technology' : 'All')
                           ? 'bg-blue-600 text-white shadow-md'
                           : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                           } `}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPartners.map((partner) => (
                  <div key={partner.id} className="group relative bg-white border border-blue-100/50 rounded-[2rem] p-8 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full overflow-hidden shadow-sm">
                     {/* Top Bar */}
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 p-4 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:bg-white group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                           <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                        </div>
                        <span className={`px - 3 py - 1 rounded - full text - [10px] font - black uppercase tracking - [0.2em] border border - blue - 50 bg - blue - 50 / 50 text - blue - 600`}>
                           {partner.type}
                        </span>
                     </div>

                     <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">{partner.name}</h3>
                     <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed line-clamp-3">
                        {partner.description}
                     </p>

                     <div className="mt-auto pt-6 border-t border-slate-100 bg-slate-50/30 -mx-8 -mb-8 p-8 transition-colors group-hover:bg-blue-50/20">
                        <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.25em] mb-3 flex items-center gap-1.5">
                           <Handshake size={12} className="text-blue-500" /> Collaboration Focus
                        </div>
                        <p className="text-slate-800 text-xs font-bold mb-4 leading-normal">
                           "{partner.collaboration}"
                        </p>

                        <div className="flex flex-wrap gap-2">
                           {partner.initiatives.map((tag, idx) => (
                              <span key={idx} className="flex items-center gap-1.5 text-[9px] bg-white text-slate-700 px-3 py-1.5 rounded-full border border-slate-200 font-black uppercase tracking-wider shadow-sm">
                                 <div className={`w - 1.5 h - 1.5 rounded - full bg - ${partner.color} -500 shadow - [0_0_8px_rgba(var(--tw - color - ${partner.color} -500), 0.5)]`}></div> {tag}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </Section>

         {/* --- 4. COLLABORATION MODEL --- */}
         <Section className="py-24 bg-white">
            <SectionHeader
               title="How We Collaborate"
               subtitle="Our partnership model is built on integration, transparency, and shared value for the community."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
               {/* Connecting Line */}
               <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100"></div>

               {[
                  {
                     step: '01',
                     title: 'Stock Synchronization',
                     desc: 'We first connect your warehouse data to our city-wide hub systems for automated inventory matching.',
                     icon: HeartHandshake,
                     color: 'blue'
                  },
                  {
                     step: '02',
                     title: 'Technical Gateway',
                     desc: 'Our API-Link goes live, allowing you to see exactly which city district is using your medicine right now.',
                     icon: LinkIcon,
                     color: 'indigo'
                  },
                  {
                     step: '03',
                     title: 'Live Deployment',
                     desc: 'Medicine is dispatched through our "Pulse" protocols, ensuring rapid arrival at clinics and hospitals.',
                     icon: TrendingUp,
                     color: 'teal'
                  }
               ].map((model, i) => (
                  <div key={i} className="relative z-10 bg-white p-10 rounded-[2.5rem] border border-blue-50 shadow-sm hover:shadow-2xl transition-all duration-500 group text-center hover:-translate-y-2">
                     <div className={`w - 24 h - 24 mx - auto bg - ${model.color} -50 rounded - 3xl flex items - center justify - center text - ${model.color} -600 mb - 8 border - 4 border - white shadow - xl group - hover: rotate - 6 transition - transform`}>
                        <model.icon size={40} />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{model.title}</h3>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed">{model.desc}</p>
                  </div>
               ))}
            </div>
         </Section>

         {/* --- 4.5 WHY PARTNERS CHOOSE OUR TECH --- */}
         <Section background="default" className="py-24 relative overflow-hidden bg-slate-50">
            <div className="absolute inset-0">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center mb-16">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6">
                  <Cpu size={14} className="animate-pulse" /> Tech Stack
               </div>
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                  Why Partners Choose Our Tech
               </h2>
               <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Partners integrate with us because our <strong>Chatbot</strong> creates an always-on communication channel, while our <strong>AI</strong> ensures their products are distributed efficiently without manual oversight.
               </p>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               {[
                  {
                     title: 'AI Intelligence',
                     desc: 'Our AI analyzes city-wide disease patterns to pre-order stock from your factory before outbreaks peak.',
                     icon: BarChart3,
                     color: 'emerald'
                  },
                  {
                     title: 'Chatbot Connection',
                     desc: 'A seamless, automated interface that lets you query sales data and stock levels instantly via chat.',
                     icon: LinkIcon,
                     color: 'blue'
                  },
                  {
                     title: 'Automated Compliance',
                     desc: 'Digital batch records are instantly verified and logged by our security bots upon receipt.',
                     icon: ShieldCheck,
                     color: 'violet'
                  }
               ].map((item, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] hover:border-blue-300 hover:shadow-xl transition-all duration-300 group text-left shadow-sm">
                     <div className={`w - 14 h - 14 rounded - 2xl bg - ${item.color} -50 flex items - center justify - center text - ${item.color} -600 mb - 6 group - hover: scale - 110 transition - transform`}>
                        <item.icon size={28} />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                     <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {item.desc}
                     </p>
                  </div>
               ))}
            </div>
         </Section>

         {/* --- STRATEGIC PARTNERSHIPS --- */}
         <section className="relative py-32 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
               <img
                  src="/images/about_story.png"
                  alt="Boardroom Meeting"
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-[2px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="flex flex-col lg:flex-row items-center gap-20">
                  {/* Left Content */}
                  <div className="lg:w-1/2 space-y-8">
                     <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                        Corporate Strategy
                     </span>

                     <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                        Powering <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">City Distribution.</span>
                     </h2>

                     <p className="text-slate-300 text-xl leading-relaxed font-light border-l-4 border-blue-500 pl-6">
                        We don't just supply medicine; we engineer the future of health distribution in our city. Through strategic alliances and precision logistics, we ensure treatments reach the patients who need them most.
                     </p>

                     <div className="grid grid-cols-2 gap-8 pt-6">
                        <div>
                           <div className="text-4xl font-bold text-white mb-1">200+</div>
                           <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pharmacies Served</div>
                        </div>
                        <div>
                           <div className="text-4xl font-bold text-white mb-1">24/7</div>
                           <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Support Operations</div>
                        </div>
                     </div>

                     <Link to="/about" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-colors mt-4">
                        Our Vision <ArrowRight size={18} />
                     </Link>
                  </div>

                  {/* Right Visual: floating 'Strategy' Card */}
                  <div className="lg:w-1/2 w-full perspective-1000">
                     <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>

                        <div className="flex items-start gap-6 mb-8">
                           <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
                              <Building2 size={32} />
                           </div>
                           <div>
                              <h3 className="text-2xl font-bold text-white mb-2">Local Alliance</h3>
                              <p className="text-slate-400 leading-relaxed">
                                 Partnering with top-tier pharmaceutical manufacturers to guarantee authenticity and supply chain integrity from lab to patient.
                              </p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           {[
                              { label: 'Verified Partners', status: '100% Vetted' },
                              { label: 'Regulatory Compliance', status: 'City Standards' },
                              { label: 'Supply Chain Transparency', status: 'Full Visibility' }
                           ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                 <span className="text-slate-300 font-medium">{item.label}</span>
                                 <div className="flex items-center gap-2">
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                    <span className="text-white font-bold text-sm">{item.status}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* --- 5. TECH & COMPLIANCE ALIGNMENT (LIGHT) --- */}
         <Section background="darker" className="py-32 border-t border-slate-100 relative">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/30 skew-x-12 transform origin-top-right"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                     <Lock size={12} /> The Standard of Trust
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">We maintain the city's <br /> highest safety protocols.</h2>

                  <p className="text-lg font-medium text-slate-500 mb-10 leading-relaxed">
                     Every partnership is built on a bedrock of clinical compliance. We don't just sign contracts; we sync our security and safety systems perfectly.
                  </p>

                  <div className="space-y-8">
                     {[
                        { title: 'Zero-Risk Security', desc: 'Secure data management for every medicine batch we handle.', icon: Lock },
                        { title: 'Pure Sourcing Only', desc: 'We only partner with manufacturers who pass our city vetting.', icon: Users },
                        { title: 'Live GDP Audits', desc: '24/7 internal auditing to ensure your medicine is always safe.', icon: Box }
                     ].map((feat, i) => (
                        <div key={i} className="flex gap-6 group">
                           <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-100 group-hover:scale-110">
                              <feat.icon size={24} />
                           </div>
                           <div>
                              <h4 className="font-black text-slate-900 text-lg mb-1">{feat.title}</h4>
                              <p className="text-sm font-medium text-slate-400 leading-snug">{feat.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="relative">
                  <div className="absolute inset-x-0 top-0 h-full bg-blue-600/5 rounded-[4rem] blur-3xl -z-10 translate-y-12"></div>

                  {/* --- REDESIGNED: CLINICAL TRUST TERMINAL --- */}
                  <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[3rem] p-1 shadow-[0_30px_100px_rgba(59,130,246,0.12)] overflow-hidden">
                     <div className="bg-slate-900 rounded-[2.8rem] p-10 text-white relative overflow-hidden">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '100% 4px' }}></div>

                        <div className="flex justify-between items-start mb-12 relative z-10">
                           <div>
                              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Live Trust Pulse</div>
                              <div className="text-2xl font-black tracking-tighter">City Distribution Index</div>
                           </div>
                           <Activity className="text-blue-500 animate-pulse" size={24} />
                        </div>

                        <div className="flex flex-col items-center text-center mb-12 relative z-10">
                           <div className="relative inline-block mb-4">
                              <svg className="w-48 h-48 transform -rotate-90">
                                 <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                                 <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="8" className="text-blue-500" strokeDasharray="552" strokeDashoffset="55" strokeLinecap="round" />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                 <span className="text-5xl font-black leading-none">100%</span>
                                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Authentic</span>
                              </div>
                           </div>
                           <p className="text-slate-400 text-xs font-medium max-w-[200px]">Verified against zero critical findings in city-wide health audits.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-slate-800/50 rounded-3xl overflow-hidden relative z-10">
                           {[
                              { label: 'Audit Response', value: '24h', icon: Zap, color: 'indigo' },
                              { label: 'ISO Standard', value: '9001', icon: ShieldCheck, color: 'teal' },
                              { label: 'Safety Record', value: 'PERFECT', icon: CheckCircle2, color: 'emerald' },
                              { label: 'Fleet Sync', value: 'LIVE', icon: Network, color: 'sky' }
                           ].map((stat, i) => (
                              <div key={i} className="bg-slate-900/40 p-6 flex flex-col items-center text-center">
                                 <stat.icon size={16} className={`text - ${stat.color} -400 mb - 2`} />
                                 <div className="text-xl font-black mb-0.5">{stat.value}</div>
                                 <div className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Section>

         {/* --- 6. CTA --- */}
         <div className="py-32 bg-slate-900 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[160px] -translate-x-1/3 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
               <span className="inline-block py-1.5 px-4 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-sm">
                  Strategic Onboarding
               </span>
               <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">Become a Strategic <br /> Distribution Partner.</h2>
               <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-xl font-medium leading-relaxed">
                  Join a high-performance network dedicated to redefining medicine logistics. Let's scale your city reach together.
               </p>
               <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl shadow-blue-600/40">
                     Partner Application <ArrowRight size={18} />
                  </Link>
                  <Link to="/about" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm">
                     View Our Vision
                  </Link>
               </div>
            </div>
         </div>
      </>
   );
};

export default Partners;