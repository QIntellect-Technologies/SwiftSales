import React, { useEffect, useRef, useState } from 'react';
import { Section, SectionHeader } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { MILESTONES, STATS, PARTNERS, SOLE_DISTRIBUTORS, LEADERSHIP } from '../constants';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  Activity, Target, Heart, TrendingUp, Users, ShieldCheck,
  Award, Briefcase, ChevronRight, Truck, Microscope, Building2, MapPin,
  Zap, Search, Package, Clock, CheckCircle2, Eye, Star, Thermometer, ArrowRight, Image as ImageIcon
} from 'lucide-react';

const GALLERY_IMAGES = [
  { url: '/company-images/1.jpeg', title: 'Operational Excellence' },
  { url: '/company-images/4.jpeg', title: 'Quality Control' },
  { url: '/company-images/5.jpeg', title: 'Distribution Hub' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.0.jpeg', title: 'Inventory Management' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.04.30 PM.jpeg', title: 'Supply Chain' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.04.31 PM.jpeg', title: 'Warehouse Operations' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.04.32 PM.jpeg', title: 'Safe Storage' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.04.32.jpeg', title: 'Logistics Network' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.04.33 PM.jpeg', title: 'Modern Facilities' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.04.34 PM.jpeg', title: 'Precision Handling' },
  { url: '/company-images/WhatsApp Image 2026-02-03 at 4.04.34 PM3.jpeg', title: 'Healthcare Logistics' }
];

// --- ANIMATED NUMBER COMPONENT ---
const AnimatedNumber: React.FC<{ value: string; label: string }> = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ''));
  const suffix = value.replace(/[0-9]/g, '');
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = Math.ceil(targetValue / (duration / 16));

          const timer = setInterval(() => {
            start += step;
            if (start >= targetValue) {
              setDisplayValue(targetValue);
              clearInterval(timer);
            } else {
              setDisplayValue(start);
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [targetValue]);

  return (
    <div ref={ref} className="text-center group">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
        {displayValue}{suffix}
      </div>
      <div className="text-xs md:text-sm text-slate-400 uppercase tracking-widest font-bold">
        {label}
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Swift Sales Healthcare's journey from Rahim Yar Khan to becoming Pakistan's most trusted medicine distributor. Our mission, leadership, and values."
        keywords="About Swift Sales, Healthcare Mission, Ejaz Malik, Rahim Yar Khan Distributor, Pharma History"
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
              Who We Are
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your Reliable <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Healthcare Partner.
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Swift Sales is dedicated to serving the local healthcare sector. We connect manufacturers to pharmacies and clinics, ensuring safe, consistent, and easy access to essential medicines.
            </p>
          </div>
        </div>
      </section>

      {/* --- 2. OUR STORY (Split Layout) --- */}
      <Section className="py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl rotate-3 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
            {/* Our Story Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/about_entrance.jpg"
                alt="Swift Sales Distribution Center"
                className="w-full h-[500px] object-cover border-8 border-white transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <div className="text-4xl font-bold mb-1">20+</div>
                <div className="text-sm font-black uppercase tracking-widest opacity-90">Years of Service</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Bridging the Gap Between Science and Community.</h2>
              <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6"></div>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">
              We started as a simple delivery service and grew into the city's most trusted partner for medicine. Today, we handle supplies for the biggest manufacturers, making sure life saving drugs reach every neighborhood.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              We believe that healthcare depends on safety and speed. That is why we focus on getting the right medicine to your local pharmacy, clinic, or hospital exactly when it is needed.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">City-Wide Network</h4>
                  <p className="text-sm text-slate-500 mt-1">Centralized hub in Rahim Yar Khan.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-1">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Zero Compromise</h4>
                  <p className="text-sm text-slate-500 mt-1">GDP & Local Health Certified.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --- 3. IMPACT STATS (Dark Mode) --- */}
      <Section background="dark" className="py-20 relative isolate">
        {/* Abstract Background Graphic */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 relative z-10">
          {STATS.map((stat, i) => (
            <AnimatedNumber key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </Section>


      {/* --- 3.2 EXCLUSIVE SOLE DISTRIBUTORS --- */}
      <Section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader
            title="Sole Distributor Partnerships"
            subtitle="We are honored to be the exclusive Sole Distributors for leading global pharmaceutical innovators."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Large Card */}
            <div className="lg:col-span-1 bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[400px] shadow-2xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
              <Award size={48} className="text-blue-200 mb-6" />
              <h3 className="text-3xl font-bold mb-4">Trusted Exclusivity</h3>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                Being a sole distributor isn't just a contract. It's a pledge of integrity. We manage the entire lifecycle of these brands within the country, ensuring brand protection and market penetration.
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="text-4xl font-black">34</div>
                <div className="text-sm font-bold uppercase tracking-widest text-blue-200">Global Partners <br /> Exclusively Managed</div>
              </div>
            </div>

            {/* Grid of Partners */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SOLE_DISTRIBUTORS.map((dist, i) => (
                <div key={i} className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-100 group-hover:border-blue-100">
                    <Building2 size={32} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">{dist.name}</h4>
                  <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                    Exclusive Partner
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* --- 3.5 HOW WE WORK (Technical Process) --- */}
      <Section className="py-24 bg-white border-b border-slate-100">
        <SectionHeader
          title="How We Work"
          subtitle="Our 4-step technical process ensures every medicine is handled with absolute precision."
        />

        <div className="relative mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {[
              {
                icon: Search,
                step: "Step 01",
                name: "Sourcing",
                desc: "We buy directly from verified manufacturers. We check every box to make sure it is 100% genuine. This way, you always get safe and effective medicine for your patients.",
                details: [
                  "Direct Deals",
                  "Verified Stock"
                ]
              },
              {
                icon: Building2,
                step: "Step 02",
                name: "Safe Storage",
                desc: "We keep medicine in temperature-controlled rooms. We have 24/7 power backup to keep vaccines and insulin cool. Our warehouse is clean and organized to prevent any damage.",
                details: [
                  "Cool Rooms",
                  "Always Monitored"
                ]
              },
              {
                icon: Truck,
                step: "Step 03",
                name: "Delivery Fleet",
                desc: "Our vans and bikes reach every corner of the city. Our suppliers are trained to handle medicine with care. We make sure every package arrives safely at your door.",
                details: [
                  "Temperature Controlled",
                  "Safe Handling"
                ]
              },
              {
                icon: Target,
                step: "Step 04",
                name: "Priority Delivery",
                desc: "We prioritize urgent needs. We know that patients cannot wait for medicine. Our team works hard to get essential orders to you as quickly as possible.",
                details: [
                  "Direct Delivery",
                  "Optimized Routes"
                ]
              }
            ].map((step, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-500 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-200 transition-colors"></div>

                <div className="flex flex-col md:flex-row gap-6 relative z-10 flex-grow">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl flex items-center justify-center text-white transform group-hover:rotate-6 transition-transform flex-shrink-0">
                    <step.icon size={32} />
                  </div>

                  <div className="flex-grow flex flex-col">
                    <div className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">{step.step}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{step.name}</h3>
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-grow">
                      {step.desc}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                          <CheckCircle2 size={14} className="text-blue-600" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- 4. THE INTELLIGENT CHATBOT WORKFLOW --- */}
      <Section background="default" className="py-24 relative overflow-hidden bg-slate-50">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold uppercase tracking-widest mb-4">
                    <Zap size={14} /> Simplified Ordering
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 mb-4">
                    Easy Communication. <br />
                    <span className="text-blue-600">Instant Access.</span>
                  </h2>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    We combine simplicity with smart technology. Clients interact with our friendly <strong>SwiftBot</strong> to easily place orders and discuss requirements, while our system handles the details.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: 'You Ask (SwiftBot)', desc: 'The interface handles natural language. Just type "Restock Amoxil" like you are texting a friend.', icon: Target },
                    { title: 'We Analyze (AI)', desc: 'Our system checks stock availability, verifies pricing, and prepares your order instantly.', icon: Activity },
                    { title: 'We Deliver', desc: 'The order is confirmed and prepared for dispatch immediately.', icon: CheckCircle2 }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-bold text-lg mb-1">{item.title}</h4>
                        <p className="text-slate-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              {/* VISUAL FLOW CHART MOCKUP */}
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Order Flow</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  {/* Step 1: User Request */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <Users size={18} className="text-slate-500" />
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 w-full">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Step 1: Client Request</div>
                      <div className="text-slate-900 font-medium text-sm">"Salam, please send 50 boxes of Panadol."</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight size={20} className="text-slate-300 rotate-90" />
                  </div>

                  {/* Step 2: AI Processing */}
                  <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 animate-pulse">
                      <Zap size={18} className="text-blue-600" />
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tr-none p-4 w-full">
                      <div className="text-[10px] font-bold text-blue-400 uppercase mb-1">Step 2: Processing</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-blue-900/70">
                          <span>Checking Stock...</span>
                          <span className="font-bold">Available</span>
                        </div>
                        <div className="h-1 bg-blue-200 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
                        </div>
                        <div className="text-xs font-medium text-blue-700">Order Confirmed. Preparing for dispatch.</div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight size={20} className="text-slate-300 rotate-90" />
                  </div>

                  {/* Step 3: Action */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl rounded-tl-none p-4 w-full">
                      <div className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Step 3: Confirmed</div>
                      <div className="text-emerald-900 font-medium text-sm">Order Dispatched. Invoice #4023 Created.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --- 4. CORE VALUES (Grid Layout) --- */}
      <Section background="default" className="py-24">
        <SectionHeader
          title="Our Operational DNA"
          subtitle="The core principles that guide every decision, every delivery, and every partnership we forge."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Card 1 */}
          <Card className="p-10 hover:border-blue-500 transition-all duration-500 group h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
              <Activity size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">On-Time & Safe</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              We know that every minute matters in healthcare. Our team finds the best way through city traffic, ensuring your medicines arrive in perfect condition, every time.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <Zap size={16} className="text-amber-500" /> Quick Dispatch
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <CheckCircle2 size={16} className="text-blue-500" /> Safe Transport
              </div>
            </div>
          </Card>

          {/* Card 2 */}
          <Card className="p-10 hover:border-indigo-500 transition-all duration-500 group h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Total Compliance</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              We never cut corners. Swift Sales strictly follows GDP and WHO standards. Every member of our team is trained to handle medicines with the professional care they deserve.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <Star size={16} className="text-indigo-500" /> Licensed Warehouse
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <ShieldCheck size={16} className="text-indigo-500" /> Regular Checks
              </div>
            </div>
          </Card>

          {/* Card 3 */}
          <Card className="p-10 hover:border-teal-500 transition-all duration-500 group h-full bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Patient-Focused</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Everything we do is for the person waiting at the other end. We work day and night to ensure local pharmacies and clinics are never out of stock of essential, life-saving drugs.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <Users size={16} className="text-teal-500" /> Community First
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-bold">
                <Activity size={16} className="text-teal-500" /> Life-Saving Focus
              </div>
            </div>
          </Card>
        </div>
      </Section>


      {/* --- 4. OFFICIAL LICENSING (FORM 11) --- */}
      <Section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader
            title="Authorized Distributor License"
            subtitle="Operating under strict government compliance and regulatory oversight."
          />

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white text-slate-900 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl border-4 border-double border-slate-200">
              {/* Watermark / Seal Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-[20px] border-slate-100 rounded-full opacity-50 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <ShieldCheck size={300} className="text-slate-50/80" />
              </div>

              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-2 border-slate-100 pb-6">
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Government of Punjab</div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 font-serif">FORM NO. 11</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">[See Rule 16] License to Sell Drugs as a Distributor</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <div className="inline-block px-4 py-2 bg-green-100 text-green-700 font-black text-xs uppercase tracking-widest rounded-lg border border-green-200">
                      Status: Valid
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-lg">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">License Number</div>
                    <div className="font-bold text-slate-900 font-mono text-xl">03-313-0156-025377D</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Valid Upto</div>
                    <div className="font-bold text-slate-900">30.12.2028</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Licensed Entity</div>
                    <div className="font-black text-2xl text-blue-700 uppercase tracking-tight">Swift Sales Medicine Distributor</div>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      Authorized agent to distribute registered products on behalf of licensed pharmaceutical manufacturers.
                    </p>
                  </div>
                  <div className="md:col-span-2 p-6 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-4">
                      <MapPin size={24} className="text-blue-600 mt-1 shrink-0" />
                      <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Premises</div>
                        <div className="font-bold text-slate-800 leading-relaxed">
                          C8GM+HFF, Sardar Colony,<br />
                          Rahim Yar Khan, Pakistan.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Proprietor</div>
                    <div className="font-bold text-slate-900">Ejaz Malik</div>
                    <div className="text-xs font-mono text-slate-500 mt-1">CNIC: 31303-5361272-9</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Qualified Person</div>
                    <div className="font-bold text-slate-900">Ghulam Yaseen</div>
                    <div className="text-xs font-mono text-slate-500 mt-1">Reg No: 566-A/85</div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t-2 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 opacity-70">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center md:text-left">
                    Subject to provisions of Drug Act 1976
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Digital Copy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>



      {/* --- 5. TIMELINE (Horizontal Scroll) --- */}
      < Section background="darker" className="py-24 overflow-hidden" >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Evolution of Excellence</h2>
              <div className="h-1.5 w-24 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-slate-500 max-w-md text-right">
              From one van to a full fleet covering every neighborhood in the city.
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-slate-200 -translate-y-1/2 z-0 hidden md:block rounded-full"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`flex flex-col ${i % 2 === 0 ? 'md:flex-col' : 'md:flex-col-reverse'} group`}>

                  {/* Timeline Node */}
                  <div className="hidden md:flex items-center justify-center h-12 my-8 relative">
                    <div className="w-6 h-6 rounded-full bg-white border-4 border-blue-500 z-10 group-hover:scale-125 transition-transform duration-300 shadow-lg"></div>
                  </div>

                  <Card className={`p-6 border-t-4 ${i % 2 === 0 ? 'border-t-blue-500' : 'border-t-indigo-500'} hover:-translate-y-2 transition-transform duration-500 h-full`}>
                    <span className="text-4xl font-bold text-slate-200 mb-4 block group-hover:text-blue-600 transition-colors">{m.year}</span>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{m.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">{m.description}</p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section >

      {/* --- 5.5 DISTRIBUTIVE EXCELLENCE HUB (GALLERY) --- */}
      <Section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="animate-fade-in-up">
              <span className="inline-block py-1 px-3 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
                Visual Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Distributive <br />
                <span className="text-blue-600">Excellence Hub</span>
              </h2>
            </div>
            <div className="max-w-md text-right md:pb-2">
              <p className="text-slate-500 font-medium leading-relaxed">
                A glimpse into our state-of-the-art facilities and the dedicated operations that drive Pakistan's healthcare supply chain.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className={`group relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer ${i === 0 || i === 7 ? 'md:col-span-2 md:row-span-2 h-[600px]' : 'h-[300px]'
                  }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[2s] ease-out grayscale group-hover:grayscale-0"
                />

                {/* Minimal Overlay */}
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                  {/* Sideways Accent Line */}
                  <div className="absolute bottom-10 left-0 w-24 h-[2px] bg-blue-500 -translate-x-full group-hover:translate-x-10 transition-transform duration-700"></div>

                  {/* Plus Icon instead of search/text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                      <Zap size={24} className="animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Constant Branding Accent */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                  Swift Sales
                </div>
              </div>
            ))}

            {/* VIDEO CARD - LOGO PENDULUM */}
            <div className="group relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer h-[300px]">
              <video
                src="/logo/logo_pendulum.mp4"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                autoPlay
                loop
                muted
                playsInline
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              {/* Title: Operational Excellence */}
              <div className="absolute bottom-6 left-6 z-20 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <h4 className="text-white font-bold text-lg tracking-tight">Operational Excellence</h4>
                <div className="h-1 w-12 bg-blue-500 rounded-full mt-2"></div>
              </div>

              {/* Tag: Swift Sales */}
              <div className="absolute top-6 right-6 z-20 transform -translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">
                  Swift Sales
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>


      {/* --- 6. LEADERSHIP TEAM --- */}
      <Section className="py-24" id="team">
        <SectionHeader
          title="Leadership Team"
          subtitle="Guided by local industry veterans with decades of experience."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {LEADERSHIP.map((leader, i) => (
            <div key={i} id={leader.id} className="group scroll-mt-32">
              <div className="relative overflow-hidden rounded-[2.5rem] mb-8 shadow-xl border-4 border-white transition-all duration-700 group-hover:shadow-blue-200/50">
                <img
                  src={leader.img}
                  alt={leader.name}
                  className="w-full h-[450px] object-cover object-top transform group-hover:scale-110 transition-transform duration-[1.5s] grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <div className="flex gap-3 justify-center">
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-blue-600 transition-all border border-white/20"><Briefcase size={18} /></button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-blue-600 transition-all border border-white/20"><MapPin size={18} /></button>
                  </div>
                </div>
              </div>

              <div className="text-center px-4">
                <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{leader.name}</h3>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-4 bg-blue-50 inline-block px-3 py-1 rounded-full">{leader.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed font-medium italic mb-6">
                  "{leader.quote}"
                </p>

                <div className="pt-6 border-t border-slate-100 text-slate-600 text-sm leading-relaxed">
                  <p className="mb-4">{leader.bio}</p>
                  <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-700">{leader.bioExtended}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section >

      {/* --- 7. CTA / NETWORK --- */}
      < section className="py-24 bg-blue-600 relative overflow-hidden" >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">


          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Ready to Join the Network?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-12 leading-relaxed">
            Partner with the experts who know city medicine distribution best. Let's work together for a healthier future.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact" className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold shadow-xl hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-2">
              Contact Sales Team <ChevronRight size={20} />
            </Link>
            <Link to="/portfolio" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section >
    </>
  );
};

export default About;