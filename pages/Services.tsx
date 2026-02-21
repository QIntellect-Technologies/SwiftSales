import React from 'react';
import { Section, SectionHeader } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { LICENSES } from '../constants';
import {
   Truck, Globe, Thermometer, ShieldCheck, Box,
   Activity, BarChart3, Clock, Zap, FileCheck,
   Users, Layers, ArrowRight, Anchor, Plane,
   Stethoscope, Microscope, CheckCircle2, Snowflake,
   Award, Warehouse, Lock, Search, Download, FileText, BadgeCheck, AlertTriangle, RefreshCw, Syringe,
   Building2, MapPin, HelpCircle, ChevronDown, ChevronRight
} from 'lucide-react';

import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
   return (
      <div className="bg-white">
         <SEO
            title="Our Services"
            description="Comprehensive medicine supply chain services: Cold Chain Storage, City wide Delivery, and Pharmacy Restocking in Rahim Yar Khan and beyond."
            keywords="Cold Chain, Medicine Delivery, Pharmacy Restocking, Logistics, Rahim Yar Khan Services, Swift Sales"
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
                     Complete Medicine Supply
                  </span>
                  <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                     Reliable Delivery for <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        Better Healthcare.
                     </span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                     We handle the entire journey of your medicine. From buying directly from manufacturers to delivering safely to local pharmacies, we ensure everything arrives on time and in perfect condition.
                  </p>
               </div>
            </div>
         </section>

         {/* --- 2. OUR CORE PILLARS --- */}
         <Section background="white" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     { title: 'Super Fast Delivery', desc: 'We deliver really fast across the city so no patient has to wait for their medicine.', icon: Zap, color: 'blue' },
                     { title: 'Safe & Cool Storage', desc: 'Our warehouses are clean and kept at the perfect temperature 24/7 to keep medicine safe.', icon: Warehouse, color: 'emerald' },
                     { title: 'Dedicated Support', desc: 'Our team is always ready to help pharmacies and hospitals with any request, anytime.', icon: Users, color: 'indigo' }
                  ].map((pillar, i) => (
                     <div key={i} className="group p-12 rounded-[3.5rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 flex flex-col items-center text-center">
                        <div className={`w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-${pillar.color}-500 mb-8 transition-all duration-500 group-hover:scale-110 group-hover:bg-${pillar.color}-500 group-hover:text-white shadow-lg border border-slate-100`}>
                           <pillar.icon size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{pillar.title}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">
                           {pillar.desc}
                        </p>
                     </div>
                  ))}
               </div>
            </div>
         </Section>

         {/* --- 2.5 PROOF OF SCALE (STATS STRIP) --- */}
         <div className="relative -mt-16 mb-24 z-20">
            <div className="container mx-auto px-6">
               <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-blue-900/20 border border-slate-800 relative overflow-hidden">
                  {/* Decorative background glass */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                     {[
                        { val: '34', lbl: 'Corporate Partners', sub: 'Trust across the city', icon: Building2 },
                        { val: '2,429', lbl: 'Total Products', sub: 'Available in stock', icon: Box },
                        { val: '99.9%', lbl: 'Success Rate', sub: 'On-time delivery', icon: Zap },
                        { val: '24/7', lbl: 'Active Support', sub: 'Always here to help', icon: Activity },
                     ].map((stat, i) => (
                        <div key={i} className="text-center lg:text-left border-r last:border-0 border-slate-800/50 pr-8 last:pr-0">
                           <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 mb-4">
                              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                 <stat.icon size={20} />
                              </div>
                              <div>
                                 <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-1">
                                    {stat.val}
                                 </div>
                                 <div className="text-sm font-black text-blue-400 uppercase tracking-widest">
                                    {stat.lbl}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* --- 3. THE DISTRIBUTION ENGINE (CORE SERVICES) --- */}
         <Section background="default" className="py-24 border-t border-slate-100">
            <SectionHeader
               title="What We Do For You"
               subtitle="Simple and reliable ways we get essential medicines to the people who need them."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  {
                     title: 'Delivery Across The City',
                     icon: Truck,
                     desc: 'We deliver to every single corner of the city. Fast and safe shipping for all pharmacies, big or small.',
                     features: ['Covers Every Area', 'Reliable Fleet'],
                     color: 'blue'
                  },
                  {
                     title: 'Cold Storage System',
                     icon: Snowflake,
                     desc: 'Special trucks and boxes for medicines that must stay cold, like insulin and vaccines.',
                     features: ['Smart Cooling', 'Frozen & Chilled',],
                     color: 'cyan'
                  },
                  {
                     title: 'Pharmacy Supply',
                     icon: Warehouse,
                     desc: 'As the Sole Distributor, we keep hospitals and pharmacies fully stocked so they never run out of medicine.',
                     features: ['Full Stock', 'Always On Time'],
                     color: 'indigo'
                  },
                  {
                     title: 'Legal Paperwork',
                     icon: FileCheck,
                     desc: 'We handle all the documents and local rules so the medicine is always legal and safe to sell.',
                     features: ['License Help', 'Rule Experts'],
                     color: 'teal'
                  },
                  {
                     title: 'Secure Warehouses',
                     icon: Layers,
                     desc: 'Safe and clean storage in our modern facility with 24/7 security guards and cameras.',
                     features: ['Clean Zones', 'High Security',],
                     color: 'violet'
                  },
                  {
                     title: 'Urgent Emergency Help',
                     icon: Stethoscope,
                     desc: 'Quickly getting hard to find medicines to patients when it is an absolute emergency.',
                     features: ['Direct Shipping', 'Fast Support'],
                     color: 'rose'
                  }
               ].map((service, i) => (
                  <div key={i} className="group relative bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2 overflow-hidden">
                     {/* Glassmorphism Background Decoration */}
                     <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${service.color}-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                     <div className="relative z-10 flex flex-col h-full">
                        <div className={`w-16 h-16 rounded-2xl bg-${service.color}-50 flex items-center justify-center text-${service.color}-600 mb-8 group-hover:bg-${service.color}-600 group-hover:text-white transition-all duration-300 shadow-sm`}>
                           <service.icon size={32} />
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">{service.title}</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed font-medium flex-grow">
                           {service.desc}
                        </p>

                        <div className="pt-8 border-t border-slate-50">
                           <ul className="space-y-4">
                              {service.features.map((feat, idx) => (
                                 <li key={idx} className="flex items-center gap-3 text-sm font-black text-slate-700 uppercase tracking-tighter">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-${service.color}-500`}></div>
                                    {feat}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </Section>

         {/* --- 3.5 DISTRICT COVERAGE MAP --- */}
         <Section background="accent" className="py-24 border-y border-slate-100 relative overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>

            <div className="container mx-auto px-6 relative z-10">
               <div className="flex flex-col lg:flex-row gap-16 items-center">
                  <div className="lg:w-1/2">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 mb-6">
                        <MapPin size={12} /> Local Distribution
                     </div>
                     <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Covering Every District</h2>
                     <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10">
                        We are present everywhere. Our main centers are placed perfectly to make sure no pharmacy is more than 4 hours away.
                     </p>

                     <div className="space-y-6">
                        {[
                           { district: 'Sindh Region', hub: 'Hyderabad & Sukkur', time: '< 2 Hours', color: 'blue' },
                           { district: 'Punjab Region', hub: 'Multan & RYK', time: '< 3 Hours', color: 'indigo' },
                           { district: 'Nationwide', hub: 'KPK & District HQs', time: '< 4 Hours', color: 'cyan' },
                        ].map((item, i) => (
                           <div key={i} className="group p-6 bg-white rounded-3xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl hover:-translate-x-2">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500`}>
                                       <Building2 size={24} />
                                    </div>
                                    <div>
                                       <div className="text-sm font-black text-slate-900">{item.district}</div>
                                       <div className="text-xs text-slate-400 font-bold uppercase">{item.hub}</div>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-xs font-black text-blue-600 uppercase tracking-widest">{item.time}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase">Window</div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="lg:w-1/2 relative group">
                     {/* Clinical "Smart Hub" Visualization */}
                     <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl shadow-blue-900/10">
                        {/* Real Distribution Hub Image */}
                        <img
                           src="/images/about_story.png"
                           alt="Smart Distribution Hub"
                           className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />

                        {/* Clinical Glass Overlay */}
                        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-[2px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40"></div>

                        {/* Interactive Hub Data Overlays */}
                        {[
                           { x: '25%', y: '30%', name: 'North Hub', status: 'Active', color: 'blue' },
                           { x: '75%', y: '20%', name: 'East Hub', status: 'Loading', color: 'cyan' },
                           { x: '50%', y: '65%', name: 'Central Hub', status: 'Standby', color: 'emerald' },
                        ].map((hub, i) => (
                           <div
                              key={i}
                              className="absolute z-20 animate-pulse-soft"
                              style={{ left: hub.x, top: hub.y }}
                           >
                              <div className="relative group/hub cursor-pointer">
                                 {/* Medicine Pulse Marker (Glass Capsule) */}
                                 <div className={`w-10 h-16 rounded-full glass-card border-2 border-${hub.color}-400/50 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl group-hover/hub:scale-110 transition-all`}>
                                    <div className={`flex-1 bg-${hub.color}-500/40`}></div>
                                    <div className="flex-1 bg-white/20"></div>
                                 </div>

                                 {/* Radial Glow */}
                                 <div className={`absolute inset-0 -m-4 bg-${hub.color}-500/20 rounded-full blur-xl animate-ping opacity-60`}></div>

                                 {/* Expanded Data Tooltip */}
                                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 whitespace-nowrap opacity-0 group-hover/hub:opacity-100 transition-all translate-y-2 group-hover/hub:translate-y-0 z-30">
                                    <div className="bg-slate-900/90 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
                                       <div className="text-xs font-black text-white uppercase mb-1">{hub.name} Operations</div>
                                       <div className="flex items-center gap-2">
                                          <div className={`w-2 h-2 rounded-full bg-${hub.color}-400 animate-pulse`}></div>
                                          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{hub.status}</div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}

                        {/* Live Feed Badge */}
                        <div className="absolute top-8 left-8 flex items-center gap-3 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/20 rounded-full text-white z-20">
                           <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                           <span className="text-[10px] font-black uppercase tracking-widest">Hub Operations: Active</span>
                        </div>

                        {/* Center Visual (Dashboard Style) */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full px-12 z-20">
                           <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 text-center shadow-2xl">
                              <div className="text-4xl font-black text-white mb-1 tracking-tighter">99.8%</div>
                              <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Operational Precision</div>
                           </div>
                        </div>
                     </div>

                     {/* Floating Priority Badge */}
                     <div className="absolute -bottom-6 -right-6 bg-emerald-500 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/30 border-4 border-white z-30 transform group-hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3 mb-1">
                           <Truck size={24} />
                           <div className="text-2xl font-black uppercase italic tracking-tighter">Same-Day</div>
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">City-Wide Priority</div>
                     </div>
                  </div>
               </div>
            </div>
         </Section>

         {/* --- 4. FEATURE SPOTLIGHT: COLD CHAIN (CLINICAL REDESIGN) --- */}
         <Section background="default" className="py-32 relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.05),transparent)] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
               <div className="flex flex-col lg:flex-row items-center gap-20">
                  <div className="flex-1">
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-8 border border-blue-100 shadow-sm">
                        <Snowflake size={16} className="animate-pulse" /> safe cold-shipping protocol
                     </div>
                     <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 leading-none tracking-tight">
                        Perfect Cooling. <br />
                        <span className="text-blue-600">Always Safe.</span>
                     </h2>
                     <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium max-w-xl">
                        Keeping medicines cool is very important. We use special technology and smart boxes to make sure every dose is safe and works perfectly.
                     </p>

                     <div className="grid grid-cols-2 gap-4">
                        {[
                           { label: 'Frozen Zone', range: '-80°C to -20°C', icon: Snowflake },
                           { label: 'Fridge Zone', range: '2°C to 8°C', icon: Box },
                           { label: 'Room Temp', range: '15°C to 25°C', icon: Thermometer },
                           { label: 'Always Safe', range: '24/7 Monitoring', icon: ShieldCheck }
                        ].map((item, i) => (
                           <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex items-center gap-4 hover:border-blue-200 transition-all group">
                              <div className="p-3 bg-white rounded-xl text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-all">
                                 <item.icon size={24} />
                              </div>
                              <div>
                                 <div className="text-slate-900 font-black text-xs uppercase tracking-widest">{item.label}</div>
                                 <div className="text-blue-600 text-[10px] font-black">{item.range}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex-1 w-full">
                     <div className="relative p-1 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-[4rem] shadow-2xl shadow-blue-500/20">
                        <div className="bg-white rounded-[3.8rem] p-12 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32"></div>

                           <div className="relative z-10">
                              <div className="flex items-center justify-between mb-12">
                                 <h3 className="text-2xl font-black text-slate-900">Cold Chain Status</h3>
                                 <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div> System Active
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-10">
                                 {[
                                    { label: 'Perfect Temp', val: '99.98%', sub: 'Digital check' },
                                    { label: 'Fast Shipping', val: '100%', sub: 'City districts' },
                                    { label: 'Hub Status', val: '24/7', sub: 'Hub connection' },
                                    { label: 'Battery Life', val: '36H', sub: 'Box reserve' }
                                 ].map((metric, i) => (
                                    <div key={i} className="group">
                                       <div className="text-4xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors tracking-tighter">
                                          {metric.val}
                                       </div>
                                       <div className="text-[10px] text-slate-400 uppercase font-black tracking-[0.1em] mb-1">
                                          {metric.label}
                                       </div>
                                       <div className="text-[9px] text-blue-500/60 font-medium italic">
                                          {metric.sub}
                                       </div>
                                    </div>
                                 ))}
                              </div>

                              <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                                       <BarChart3 size={20} />
                                    </div>
                                    <div>
                                       <div className="text-xs font-black text-slate-900 uppercase">Performance</div>
                                       <div className="text-[10px] text-slate-400 font-bold">General Status</div>
                                    </div>
                                 </div>
                                 <Link to="/contact" className="p-4 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-all">
                                    <ArrowRight size={20} />
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Section>

         {/* --- 5. HOW WE WORK (4-STEP CLINICAL PROCESS) --- */}
         <Section background="accent" className="py-24 border-t border-slate-100">
            <SectionHeader
               title="How We Get It To You"
               subtitle="A simple 4-step process to make sure every medicine reaches you safely."
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                  { step: "01", title: "Order Check", desc: "We receive your order and check it thoroughly to make sure it is correct.", icon: FileText, color: "blue" },
                  { step: "02", title: "Safe Packing", desc: "Medicines are packed in safe clinical boxes with temperature monitors.", icon: Box, color: "indigo" },
                  { step: "03", title: "Smart Route", desc: "Our suppliers take the fastest and safest route across the city districts.", icon: Truck, color: "cyan" },
                  { step: "04", title: "Fast Delivery", desc: "You receive the medicine at your door, safe and sound.", icon: BadgeCheck, color: "emerald" }
               ].map((item, i) => (
                  <div key={i} className="group relative">
                     <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-400 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 relative z-10 h-full">
                        <div className="flex justify-between items-start mb-8">
                           <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 shadow-sm group-hover:bg-${item.color}-500 group-hover:text-white transition-all duration-300`}>
                              <item.icon size={28} />
                           </div>
                           <span className="text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors">{item.step}</span>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{item.title}</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
                           {item.desc}
                        </p>
                        <div className={`h-1 w-12 bg-${item.color}-500 rounded-full group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.3)]`}></div>
                     </div>
                     {i < 3 && (
                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center z-20 shadow-sm">
                           <ArrowRight size={14} className="text-slate-300" />
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </Section>

         {/* --- 6. THE SAFETY SHIELD (QUALITY & LICENSES) - NEW SPLIT LAYOUT --- */}
         <Section background="white" className="py-24 border-t border-slate-100">
            <div className="container mx-auto px-6">
               <div className="flex flex-col lg:flex-row items-center gap-16">

                  {/* LEFT: Pakistani Visual Service Image */}
                  <div className="lg:w-1/2 relative group">
                     <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] rotate-2 group-hover:rotate-4 transition-transform duration-500 opacity-20"></div>
                     <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                        <img
                           src="/company-images/Medicine_Checking.png"
                           alt="Professional Quality Check in Pakistan"
                           className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-blue-800 text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                           <ShieldCheck size={16} /> Verified Quality
                        </div>
                     </div>
                  </div>

                  {/* RIGHT: Text Content */}
                  <div className="lg:w-1/2">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 mb-6">
                        <Lock size={12} /> The Safety Shield
                     </div>
                     <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Strict Safety Rules
                     </h2>
                     <p className="text-slate-500 text-xl leading-relaxed font-medium mb-8">
                        We follow every health rule and check every box to make sure every product is 100% safe.
                     </p>

                     <div className="space-y-4">
                        {[
                           "Daily Quality Audits",
                           "Licensed Professionals",
                           "Hygienic Storage"
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                 <CheckCircle2 size={14} />
                              </div>
                              <span className="text-slate-700 font-bold">{item}</span>
                           </div>
                        ))}
                     </div>

                     <div className="mt-10">
                        <div className="inline-block p-6 bg-slate-50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-4">
                              <BadgeCheck size={32} className="text-blue-600" />
                              <div>
                                 <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Official License</div>
                                 <div className="text-slate-900 font-bold">Government Approved Distributor</div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>
         </Section>

         {/* --- 6.5 PROFESSIONAL FAQ SECTION --- */}
         <Section background="default" className="py-24 border-t border-slate-100">
            <div className="container mx-auto px-6 max-w-4xl">
               <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                     <HelpCircle size={12} /> Questions
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Your Questions, Answered</h2>
               </div>

               <div className="space-y-4">
                  {[
                     { q: 'How fast can you deliver in an emergency?', a: 'For urgent needs, we can deliver life saving medicines within 2-4 hours. Regular delivery is usually next day.' },
                     { q: 'Do you check the temperature?', a: 'Yes. Every shipment is tracked to sure the temperature is perfect from our door to yours.' },
                     { q: 'Are the correct documents included?', a: 'Yes. All necessary papers, certificates, and safety forms are included with every order.' },
                     { q: 'Is there a minimum order size?', a: 'We work with pharmacies of all sizes. Talk to us to find a schedule that fits your needs.' }
                  ].map((faq, i) => (
                     <div key={i} className="group overflow-hidden rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 transition-all">
                        <div className="w-full p-8 text-left flex items-center justify-between cursor-pointer">
                           <span className="text-lg font-black text-slate-900 pr-8">{faq.q}</span>
                           <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                              <ChevronDown size={20} />
                           </div>
                        </div>
                        <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed max-h-0 group-hover:max-h-[300px] transition-all duration-500 overflow-hidden">
                           <div className="pt-2 border-t border-slate-50">
                              {faq.a}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </Section>

         {/* --- 7. CTA --- */}
         <div className="py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>

            <div className="container mx-auto px-6 text-center relative z-10">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest mb-10">
                  partner with us
               </div>
               <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter">
                  Simple Handling. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Total Safety.</span>
               </h2>
               <p className="mb-12 text-slate-400 max-w-2xl mx-auto text-xl font-medium leading-relaxed">
                  Join hundreds of pharmacies across the city who trust us to deliver their life-saving medicines every single day.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link to="/contact" className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 hover:scale-105 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3">
                     Start Distributing <ArrowRight size={20} />
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Services;
