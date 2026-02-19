import React from 'react';
import {
   Truck, ShieldCheck, ArrowRight, Box, Building2, CheckCircle2,
   MapPin, Zap, HeartPulse, Anchor, Microscope, Search, Quote, Star, Award
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Section, SectionHeader } from '../components/ui/Section';
import { Link } from 'react-router-dom';
import { LEADERSHIP } from '../constants';
import { SEO } from '../components/SEO';

const Home: React.FC = () => {
   return (
      <>
         <SEO
            title="Home"
            description="Swift Sales Distributer - Ideally located in Rahim Yar Khan, serving as the premier distribution partner for pharmacies across Pakistan. Cold Chain Experts."
            keywords="Medicine Distributor, Rahim Yar Khan, Pharmacy Supply, Cold Chain Logistics, Swift Sales, Pakistan Distribution"
         />
         {/* --- 1. HERO SECTION: THE VITAL LINK --- */}
         <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
            {/* Background: City-Wide Logistics Network */}
            <div className="absolute inset-0 z-0">
               <img
                  src="/images/hero_pakistan_distributor.png"
                  alt="City Pharmaceutical Distribution Hub"
                  className="w-full h-full object-cover opacity-50 scale-105 animate-slow-pan"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-900/40"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10 pt-20">
               <div className="max-w-4xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
                     <MapPin size={14} /> Sole Distributer
                  </div>

                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                     Your Premier Partner in <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        Medicine Distribution.
                     </span>
                  </h1>

                  <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl animate-fade-in-up border-l-4 border-blue-600 pl-6" style={{ animationDelay: '0.2s' }}>
                     We bridge the gap between world class manufacturers and the patients who need them. Delivering essential medicines with precision, integrity, and speed to every district across the city.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                     <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30">
                        Collaborate With Us <ArrowRight size={20} />
                     </Link>
                     <Link to="/portfolio" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 backdrop-blur-sm transition-colors border border-white/10">
                        Explore Portfolio <Box size={20} />
                     </Link>
                  </div>
               </div>
            </div>
         </section>

         {/* --- 2. OUR MISSION: HIGH IMPACT (Enhanced & Prominent) --- */}
         <Section className="py-32 bg-white relative overflow-hidden">
            {/* Subtle background element */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
               <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-[128px]"></div>
               <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-600 rounded-full blur-[128px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
               <SectionHeader
                  title="Our Core Mission"
                  subtitle="Empowering distribution through precision, ensuring that every client, in every district, has access to essential products exactly when they need them."
               />

               <div className="flex flex-col lg:flex-row items-center gap-16">
                  {/* Left: Key Pillars */}
                  <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {[
                        {
                           label: 'Safe & Quality Care',
                           desc: 'We follow strict international safety rules to keep your medicine safe. Every product is checked carefully to make sure you get the right quality.',
                           icon: ShieldCheck, color: 'text-blue-600', hue: 'bg-blue-50'
                        },
                        {
                           label: 'Fast Delivery Always',
                           desc: 'We work day and night to reach every corner of the city. No matter where you are, we make sure your medicine arrives quickly and on time.',
                           icon: Truck, color: 'text-emerald-600', hue: 'bg-emerald-50'
                        },
                        {
                           label: 'Patients First',
                           desc: 'Everything we do is for the people who need help. We put patient safety above all else, making sure life saving medicine is always available.',
                           icon: HeartPulse, color: 'text-rose-600', hue: 'bg-rose-50'
                        },
                        {
                           label: 'Organized Stock',
                           desc: 'We use modern technology to manage every order from our warehouse to your door. This helps us avoid mistakes and keep our service running smooth.',
                           icon: Zap, color: 'text-amber-600', hue: 'bg-amber-50'
                        },
                     ].map((item, i) => (
                        <div key={i} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 group">
                           <div className={`w-14 h-14 ${item.hue} rounded-2xl flex items-center justify-center mb-6 border border-slate-100`}>
                              <item.icon size={32} className={`${item.color} group-hover:scale-110 transition-transform`} />
                           </div>
                           <h4 className="font-extrabold text-slate-900 text-xl mb-3">{item.label}</h4>
                           <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                        </div>
                     ))}
                  </div>

                  {/* Right: Visual */}
                  <div className="lg:w-1/2 relative">
                     <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                        <img
                           src="/images/wearhouse_person.jpg"
                           alt="Distribution Mission"
                           className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-10">
                           <div className="text-white">
                              <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-widest mb-4">Since Day One</div>
                              <div className="text-3xl font-black mb-2">Dedicated to Life.</div>
                              <p className="text-slate-300 text-lg font-medium leading-relaxed">Driven by an unyielding commitment to save lives through the seamless, timely availability of medicine.</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Section>


         {/* --- 3. OUR CORE VALUES (Kept as is, part of Mission flow normally, but user didn't ask to remove) --- */}
         <Section className="py-24 bg-slate-50 relative">
            <SectionHeader
               title="Our Core Values"
               subtitle="The fundamental principles that guide every shipment, every partnership, and every decision we make."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 px-4">
               {[
                  {
                     title: "Integrity",
                     desc: "We operate with absolute transparency. Genuine products, honest timelines, and ethical practices are non-negotiable. We believe trust is the currency of healthcare.",
                     icon: ShieldCheck,
                     color: "blue"
                  },
                  {
                     title: "Reliability",
                     desc: "Healthcare never sleeps, and neither do we. We fulfill our promises, ensuring consistency in a volatile market. When you need us, we are there.",
                     icon: Anchor,
                     color: "indigo"
                  },
                  {
                     title: "Innovation",
                     desc: "We embrace the future. Adopting AI and smart technologies to solve the oldest challenges in distribution better, faster, and smarter.",
                     icon: Microscope,
                     color: "purple"
                  },
                  {
                     title: "Empathy",
                     desc: "Behind every order is a patient. We work with the urgency and care that human life demands, treating every package as a life saved.",
                     icon: HeartPulse,
                     color: "rose"
                  }
               ].map((val, i) => (
                  <div key={i} className="group relative p-8 bg-white border border-slate-100 rounded-2xl hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                     <div className={`absolute top-0 left-0 w-full h-1 bg-${val.color}-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>

                     <div className="mb-6 relative">
                        <div className={`w-14 h-14 rounded-2xl bg-${val.color}-50 flex items-center justify-center text-${val.color}-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                           <val.icon size={28} />
                        </div>
                     </div>

                     <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">{val.title}</h3>
                     <p className="text-slate-600 text-sm leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                        {val.desc}
                     </p>
                  </div>
               ))}
            </div>
         </Section>

         {/* --- 4. OUR INNOVATIONS: CHATBOT FOCUS (Enhanced Description) --- */}
         <Section background="default" className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
               <div className="text-center mb-16">

                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Innovations</h2>
                  <div className="h-1.5 w-24 bg-blue-600 rounded-full mb-8 mx-auto"></div>
                  <p className="text-slate-600 text-lg max-w-5xl mx-auto leading-relaxed font-medium text-justify">
                     Redefining customer service with intelligent, always on support. To ensure our partners and clients have instant access to critical information, we have deployed a state of the art AI system. "SwiftBot" is not just a tool
                     it's a dedicated digital assistant capable of verifying order status, checking stock availability instantly, and guiding you through our extensive portfolio. Whether you are a pharmacy owner checking a delivery or a hospital administrator sourcing urgent vaccines, our intelligent support system eliminates wait times and delivers precision answers, 24/7.
                  </p>
               </div>

               <div className="flex flex-col lg:flex-row items-center gap-16">
                  <div className="lg:w-1/2">
                     <h3 className="text-3xl font-bold text-slate-900 mb-6">
                        Smart Support <br />
                        <span className="text-blue-600">Powered by SwiftBot.</span>
                     </h3>
                     <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        Navigate our products, check availability, and get support instantly with our advanced AI integration.
                     </p>

                     <div className="space-y-4">
                        {[
                           { label: 'Instant Answers', desc: 'Get immediate responses to your product queries 24/7.', icon: Zap },
                           { label: 'Product Discovery', desc: 'Ask SwiftBot to find medicines by name, category, or use.', icon: Search },
                           { label: 'Simplified Access', desc: 'Easily explore our extensive range of high-quality healthcare products.', icon: Box }
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
                              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                 <item.icon size={24} />
                              </div>
                              <div>
                                 <h4 className="text-slate-900 font-bold">{item.label}</h4>
                                 <p className="text-slate-500 text-sm">{item.desc}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="lg:w-1/2 relative">
                     <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-2xl">
                        {/* Bot Visualization Mockup */}
                        <div className="absolute top-4 right-4 animate-pulse">
                           <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
                        </div>

                        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                           <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=SwiftBot" alt="SwiftBot" className="w-12 h-12" />
                           </div>
                           <div>
                              <div className="text-slate-900 font-bold text-lg">SwiftBot AI</div>
                              <div className="text-blue-600 text-xs font-bold uppercase tracking-widest">System Online • Ready to Help</div>
                           </div>
                        </div>

                        <div className="space-y-4 font-mono text-sm">
                           <div className="flex justify-end">
                              <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                                 Do you have Panadol available?
                              </div>
                           </div>
                           <div className="flex justify-start">
                              <div className="bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[90%] border border-slate-200">
                                 <span className="font-bold text-blue-600 block mb-1">SwiftBot</span>
                                 Yes! We have Panadol in stock.<br />
                                 Would you like to see pricing or view alternatives?
                              </div>
                           </div>
                           <div className="flex justify-end">
                              <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                                 Show me pricing.
                              </div>
                           </div>
                           <div className="flex justify-start">
                              <div className="bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[90%] border border-slate-200">
                                 <div className="flex gap-2 items-center mb-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="font-bold text-slate-900">Retrieving Data...</span>
                                 </div>
                                 Listing current wholesale rates...
                              </div>
                           </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                           <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">AI Response Time: 0.2s</div>
                           <Link to="/contact" className="text-blue-600 text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                              Try SwiftBot <ArrowRight size={16} />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Section>


         {/* --- 7. CITY INFRASTRUCTURE & REACH --- */}
         <Section className="py-32 bg-slate-50">
            <SectionHeader
               title="Your Trusted Medicine Distributor"
               subtitle="Service grounded in trust, consistency, and a deep respect for the local distribution network."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
               <Card className="p-8 text-center hover:border-blue-400 transition-all border-2 border-transparent">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                     <Truck size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Always Available</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     We remain accessible to every pharmacy and clinic. Our goal is ensuring that quality medicine is available to everyone, everywhere in our region.
                  </p>
               </Card>
               <Card className="p-8 text-center hover:border-indigo-400 transition-all border-2 border-transparent">
                  <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6">
                     <Zap size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Rapid Fulfillment</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     Time is critical in healthcare. We prioritize swift processing and dispatch to ensure your pharmacy never runs out of essential stock.
                  </p>
               </Card>
               <Card className="p-8 text-center hover:border-teal-400 transition-all border-2 border-transparent">
                  <div className="w-16 h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-6">
                     <HeartPulse size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Your Trusted Partner</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                     We believe in long term relationships. We listen to your needs, resolve issues directly, and treat your business with the dignity it deserves.
                  </p>
               </Card>
            </div>

            {/* --- 7. SOLE DISTRIBUTOR SECTION --- */}
            <Section className="py-24 bg-slate-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

               <div className="container mx-auto px-6 relative z-10">
                  <SectionHeader
                     title="Sole Distributor Partnerships"
                     subtitle="We are honored to be the exclusive Sole Distributors for leading global pharmaceutical innovators."
                  />

                  <div className="mt-16 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-[size:30px_30px] opacity-20"></div>
                     </div>

                     <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <div className="lg:w-1/2">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest mb-6">
                              <Award size={14} /> Trusted Exclusivity
                           </div>
                           <h3 className="text-3xl font-bold text-slate-900 mb-6 font-serif italic">"Integrity is the Foundation of Exclusivity."</h3>
                           <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                              Being a sole distributor isn't just a contract; it's a pledge of integrity. We manage the entire lifecycle of these brands within the country, ensuring brand protection and market penetration.
                           </p>

                           <div className="flex items-center gap-6">
                              <div className="flex flex-col">
                                 <span className="text-5xl font-black text-blue-600 leading-none">34</span>
                                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Global Partners <br />Exclusively Managed</span>
                              </div>
                              <div className="h-12 w-px bg-slate-200"></div>
                              <Link to="/contact" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all">
                                 Partner With Us <ArrowRight size={18} />
                              </Link>
                           </div>
                        </div>

                        {/* Right Content - Partner Logos Grid */}
                        <div className="lg:w-1/2 bg-slate-50/50 rounded-3xl p-8 border border-slate-100 grid grid-cols-2 gap-4">
                           {[
                              'Shrooq Pharma', 'Avant Pharma', 'Swiss IQ', 'Star Labs', 'Ospheric', 'Pinnacle'
                           ].map((brand, i) => (
                              <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group hover:border-blue-300 transition-colors">
                                 <div className="text-center">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 opacity-50 group-hover:opacity-100">Exclusive Partner</div>
                                    <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600">{brand}</div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </Section>
         </Section>

         {/* --- 8. CEO MESSAGE: MODERN EDITORIAL SLIDER --- */}
         <Section className="py-32 relative overflow-hidden bg-white">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]"
               style={{ backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>



            <div className="container mx-auto px-6 relative z-10">
               <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                  {/* Image Side - Creative Layout */}
                  <div className="w-full md:w-5/12 relative group">
                     <div className="absolute top-4 -right-4 w-full h-full border-2 border-slate-900/10 rounded-3xl z-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"></div>
                     <div className={`absolute -bottom-4 -left-4 w-24 h-24 bg-blue-600/10 rounded-full z-0 transition-all duration-700 group-hover:scale-110`}></div>

                     <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-1000">
                        <img
                           src={LEADERSHIP[0].img}
                           alt={LEADERSHIP[0].name}
                           className="w-full h-[500px] object-cover object-top hover:scale-110 transition-transform duration-[2s]"
                        />

                        {/* Name Tag */}
                        <div className="absolute bottom-0 left-0 w-full bg-slate-900/90 backdrop-blur-md p-6 border-t border-slate-700">
                           <h4 className="text-white font-bold text-xl">{LEADERSHIP[0].name}</h4>
                           <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mt-1">{LEADERSHIP[0].role}</p>
                        </div>
                     </div>
                  </div>

                  {/* Text Side */}
                  <div className="w-full md:w-7/12">
                     <Quote size={64} className="text-blue-100 mb-6 animate-pulse" />

                     <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                        "{LEADERSHIP[0].quote}"
                     </h2>

                     <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-serif italic">
                        <p>
                           "{LEADERSHIP[0].bio}"
                        </p>
                        <p>
                           "{LEADERSHIP[0].bioExtended}"
                        </p>
                     </div>

                     <div className="mt-10 flex items-center gap-6">
                        {/* Signature (Simulated with cursive font) */}
                        <div className="font-handwriting text-4xl text-blue-900 opacity-80 rotate-[-5deg]">
                           {LEADERSHIP[0].signature}
                        </div>

                        <div className="h-px bg-slate-200 flex-1 max-w-[100px]"></div>

                        <div className="flex gap-4">
                           <Link to={`/about#${LEADERSHIP[0].id}`} className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest flex items-center gap-2">
                              Read Biography <ArrowRight size={14} />
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </Section>


         {/* --- 8. CLIENT TRUST: PROFESSIONAL REVIEWS --- */}
         <Section background="accent" className="py-24 relative overflow-hidden">
            {/* Background Medicine Imagery */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
               <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl"></div>
               <div className="absolute bottom-10 left-10 w-48 h-48 bg-emerald-600 rounded-full blur-3xl"></div>
            </div>

            <SectionHeader
               title="Trusted by Professionals"
               subtitle="Direct feedback from the industry leaders who rely on our city distribution network."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative z-10">
               {[
                  {
                     name: "Dr. Sarah Chen",
                     role: "Hospital Director",
                     text: "Swift Sales has revolutionized our clinical supply chain. Their cold chain reliability for biologics is simply unmatched in the city.",
                     image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=800&auto=format&fit=crop"
                  },
                  {
                     name: "Marcus Thorne, PharmD",
                     role: "Head of Pharmacy",
                     text: "The transition to their city-based express delivery has cut our routine restocking times by 60%. A truly professional distributor.",
                     image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                  },
                  {
                     name: "Elena Rodriguez",
                     role: "NGO Supply Coordinator",
                     text: "Professional, precise, and 100% focused on medicine integrity. They are the benchmark for technical distribution in the region.",
                     image: "https://images.unsplash.com/photo-1559839734-2b71f153673e?q=80&w=800&auto=format&fit=crop"
                  }
               ].map((review, i) => (
                  <Card key={i} className="p-8 hover:shadow-2xl transition-all duration-500 border-slate-100 group">
                     <div className="flex items-center gap-1 mb-6 text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                     </div>
                     <Quote className="text-blue-100 absolute top-8 right-8 rotate-180" size={48} />
                     <p className="text-slate-600 italic mb-8 relative z-10 font-medium leading-relaxed">
                        "{review.text}"
                     </p>
                     <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                        <img
                           src={review.image}
                           alt={review.name}
                           className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md transition-all duration-500"
                        />
                        <div>
                           <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                           <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">{review.role}</p>
                        </div>
                     </div>
                  </Card>
               ))}
            </div>

            {/* Medicine Visual Block */}
            <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80 transition-all duration-700">
               {[
                  "https://images.unsplash.com/photo-1587854680352-936b22b91030?q=80&w=1000&auto=format&fit=crop", // Pills
                  "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1000&auto=format&fit=crop", // Science
                  "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1000&auto=format&fit=crop", // Pharma
                  "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=1000&auto=format&fit=crop"  // Boxes
               ].map((img, i) => (
                  <div key={i} className="h-40 rounded-2xl overflow-hidden border border-slate-200">
                     <img src={img} alt="Medicine Integrity" className="w-full h-full object-cover" />
                  </div>
               ))}
            </div>
         </Section>

         {/* --- 9. CTA PARTNERSHIP --- */}
         <div className="py-32 bg-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3"></div>

            <div className="container mx-auto px-6 relative z-10 text-center">
               <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                  Let's Move Medicine. <br />
                  <span className="text-blue-500">Together.</span>
               </h2>
               <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                  Whether you are a manufacturer looking for market access or a pharmacy needing reliable supply, we are your strategic partner.
               </p>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/50 hover:-translate-y-1">
                     Become a Partner
                  </Link>
                  <Link to="/about" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-transparent border border-slate-600 text-white rounded-full font-bold text-lg hover:bg-white/5 transition-all">
                     Our Story
                  </Link>
               </div>
            </div>
         </div>
      </>
   );
};

export default Home;