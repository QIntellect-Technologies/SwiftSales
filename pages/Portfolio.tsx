import React, { useState } from 'react';
import { Section } from '../components/ui/Section';
import {
  MapPin, ArrowUpRight, Snowflake,
  Globe, Server, Heart, Truck, Filter, CheckCircle2,
  Zap, ShieldCheck, Activity, Award, Microscope,
  CloudLightning, Landmark, Trees, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SOLE_DISTRIBUTORS } from '../constants';
import { motion } from 'framer-motion';
import { SEO } from '../components/SEO';

// --- DATA STRUCTURES ---
type Category = 'All' | 'Emergency' | 'Supply Chain' | 'Specialized' | 'Cold Chain';

interface PortfolioItem {
  id: string;
  title: string;
  category: Category;
  location: string;
  image: string;
  description: string;
  metric: string;
  metricLabel: string;
  partner?: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Hospital Daily Supply',
    category: 'Supply Chain',
    location: 'City Center',
    partner: 'Avant Pharma',
    image: '/images/warehouse_1.jpg',
    description: 'We deliver medicines every day to the city’s largest hospital, making sure they never run out of vital supplies.',
    metric: '12k',
    metricLabel: 'Units/Day'
  },
  {
    id: '2',
    title: 'Fast Vaccine Delivery',
    category: 'Cold Chain',
    location: 'Metro Area',
    partner: 'Swiss IQ Bioceutics',
    image: '/images/warehouse_2.jpg',
    description: 'We sent out thousands of vaccines to 50 clinics in just 2 days, keeping them at the perfect cool temperature.',
    metric: '100%',
    metricLabel: 'Ice-Cold'
  },
  {
    id: '3',
    title: 'Urgent Heart Medicine',
    category: 'Emergency',
    location: 'North Zone',
    partner: 'Ospheric Pharma',
    image: '/images/warehouse_3.jpg',
    description: 'When doctors need heart surgery tools fast, our bike riders bypass traffic to deliver within minutes.',
    metric: '45min',
    metricLabel: 'Avg Time'
  },
  {
    id: '4',
    title: 'Supporting 100+ Clinics',
    category: 'Supply Chain',
    location: 'Local Districts',
    partner: 'Shrooq Pharma',
    image: '/images/warehouse_4.jpg',
    description: 'We help small neighborhood pharmacies get the same fast supply as big hospitals, every single day.',
    metric: '200+',
    metricLabel: 'Local Shops'
  },
  {
    id: '5',
    title: 'Direct Patient Support',
    category: 'Specialized',
    location: 'City-Wide',
    partner: 'Star Laboratories',
    image: '/images/warehouse_6.jpg',
    description: 'We deliver sensitive brain health medicines directly to patients at home with extra care and privacy.',
    metric: 'Zero',
    metricLabel: 'Issues'
  },
  {
    id: '6',
    title: 'Night Oncology Shift',
    category: 'Emergency',
    location: 'Cancer Center',
    partner: 'Pinnacle Biotec',
    image: '/images/warehouse_7.jpg',
    description: 'Our team works all night to make sure cancer treatments are ready for patients early the next morning.',
    metric: '24/7',
    metricLabel: 'Anytime'
  },
  {
    id: '7',
    title: 'Skin Care Clinics',
    category: 'Specialized',
    location: 'Retail Area',
    partner: 'Serving Health Pakistan',
    image: '/images/warehouse_8.jpg',
    description: 'We supply 50+ skin specialists with advanced creams and treatments, delivered in climate-controlled vans.',
    metric: '50+',
    metricLabel: 'Specialists'
  },
  {
    id: '8',
    title: 'Heavy Medical Tools',
    category: 'Supply Chain',
    location: 'South District',
    partner: 'Triafa Pharmaceutical',
    image: '/images/warehouse_9.jpg',
    description: 'We use specialized lift trucks to deliver heavy surgical tools and implants to trauma centers.',
    metric: '1000+',
    metricLabel: 'Surgical Kits'
  },
  {
    id: '9',
    title: 'City Health Alert Drive',
    category: 'Emergency',
    location: 'Main Hub',
    partner: 'Swiss Pharmaceuticals',
    image: '/images/warehouse_10.jpg',
    description: 'During health alerts, we rapidly move testing kits and gear across the entire city in under 2 hours.',
    metric: '2hr',
    metricLabel: 'Full Response'
  },
  {
    id: '10',
    title: 'Medical Trial Support',
    category: 'Specialized',
    location: 'Research Park',
    partner: 'Glitz Pharma',
    image: '/images/warehouse_team.jpg',
    description: 'We handle delicate samples for new medical research, using smart tracking to ensure they are safe and steady.',
    metric: '99.9%',
    metricLabel: 'Perfect Samples'
  }
];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState<Category>('All');

  const filteredItems = PORTFOLIO_ITEMS.filter(
    item => filter === 'All' || item.category === filter
  );

  return (
    <>
      <SEO
        title="Our Portfolio"
        description="See how Swift Sales delivers healthcare across the region. Real work, real impact, and proven supply success."
      />

      {/* --- 1. HERO SECTION (SEC-01) --- Matches Products/Services Style */}
      <section className="relative pt-40 pb-20 bg-slate-50 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-white border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm animate-fade-in-up">
              Operational Showcase
            </span>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Your Health. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Our Priority.
              </span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              We don't just move boxes; we deliver care. See the numbers behind our city-wide success.
            </p>

            {/* Quick Stats Row (Integrated Metrics) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {[
                { label: 'Orders Filled', val: '1,200+', icon: CheckCircle2, color: 'blue' },
                { label: 'Stock Sync', val: '99.9%', icon: Activity, color: 'indigo' },
                { label: 'Districts', val: '100+', icon: MapPin, color: 'teal' },
                { label: 'Response', val: '< 45m', icon: Zap, color: 'rose' }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-slate-100 shadow-xl shadow-blue-900/5 p-5 rounded-2xl flex flex-col items-center justify-center">
                  <stat.icon size={18} className={`text-${stat.color}-500 mb-2`} />
                  <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-black tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. CORE PROMISES (SEC-02) --- Value Focus instead of Logos */}
      <div className="py-20 bg-white border-b border-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: '100% Genuine', icon: ShieldCheck, desc: 'Every batch verified authentic.', color: 'blue' },
              { title: 'Safe Cooling', icon: Snowflake, desc: 'Constant temperature control.', color: 'indigo' },
              { title: 'Pro Handling', icon: Activity, desc: 'Meticulous warehouse care.', color: 'teal' },
              { title: 'Reliable Supply', icon: CheckCircle2, desc: 'Never out of essential stock.', color: 'rose' }
            ].map((promise, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-${promise.color}-50 flex items-center justify-center text-${promise.color}-500 group-hover:scale-110 transition-transform`}>
                  <promise.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{promise.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">{promise.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 2b. OPERATIONAL HIGHLIGHT 1 --- Text Left / Image Right */}
      <Section background="default" className="py-20 border-b border-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <span className="text-blue-600 text-xs font-black uppercase tracking-widest mb-4 block">Our Reach</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Supplying the Whole City, Every Single Day.</h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                Our supply network is designed to be the backbone of local healthcare. From the earliest hours of the morning, our dedicated fleet is on the move, delivering essential medicines to major city hospitals and the smallest neighborhood pharmacies alike. We understand that a delay can affect a patient’s recovery, which is why we treat every delivery with the utmost urgency, ensuring no clinic is ever left without the supplies they need to save lives.
              </p>
              <ul className="space-y-4">
                {['Direct warehouse-to-door dispatch', 'Scheduled daily delivery routes in all districts', 'Support for 100+ local neighborhood clinics'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <img src="/images/warehouse_1.jpg" alt="Warehouse Reach" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </Section>

      {/* --- 3. WORK SHOWCASE (SEC-03) --- Smaller, Clearer Cards */}
      <Section background="default" className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-left">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Success Stories</h2>
              <p className="text-slate-500 font-medium">Clear examples of our work in the city.</p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              {(['All', 'Emergency', 'Supply Chain', 'Specialized', 'Cold Chain'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-500 hover:text-slate-900'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white shadow-lg border border-blue-400">
                    Trusted Supply
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-blue-500 text-[9px] font-black uppercase tracking-widest mb-3">
                    {item.category === 'Cold Chain' && <Snowflake size={12} />}
                    {item.category} • {item.location}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900">{item.metric}</div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">{item.metricLabel}</div>
                    </div>
                    <Link to="/contact">
                      <button className="p-2.5 rounded-full bg-slate-50 text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                        <ArrowUpRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- 3b. OPERATIONAL HIGHLIGHT 2 --- Text Left / Image Right */}
      <Section background="default" className="py-24 border-y border-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <span className="text-teal-600 text-xs font-black uppercase tracking-widest mb-4 block">Genuine Quality</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Real Medicine You Can Trust, Without Compromise.</h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                Quality is the foundation of everything we do at Swift Sales. Every product that enters our RYK hub goes through a multi-stage verification process to ensure authenticity and safety. We maintain strict temperature controls and professional storage environments, so that when a medicine reaches a patient, it is exactly as the manufacturer intended—effective, safe, and 100% genuine. We don't just deliver products; we deliver peace of mind to doctors and families across the region.
              </p>
              <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 italic text-teal-800 font-medium">
                "Our commitment to quality is absolute. We meticulously inspect every batch because we know that behind every box is a patient counting on us for their recovery."
              </div>
            </div>
            <div className="h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <img src="/images/warehouse_6.jpg" alt="Quality Check" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </Section>

      {/* --- 4. FLEET Grid (SEC-04) --- Clear Text Focus */}
      <Section background="accent" className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="h-[500px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-white">
                <img src="/images/hero_real_distributor.png" alt="Fleet" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Our Resources</h2>
              <h3 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Professional Medicine Delivery Network.</h3>
              <p className="text-slate-600 font-medium mb-12 text-lg leading-relaxed">We own and operate every vehicle in our fleet, ensuring your medicines are handled with total care from our hub to your door.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Cooling Vans', icon: Snowflake, val: '12 Active' },
                  { label: 'Heavy Lifts', icon: Landmark, val: 'Large Orders' },
                  { label: 'Swift Bikes', icon: Zap, val: 'City Rush' },
                  { label: 'Central Hub', icon: Building2, val: 'RYK Station' }
                ].map((inv, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <inv.icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{inv.label}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">{inv.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --- 5. TECHNOLOGY Grid (SEC-05) --- Clear Feature Grid */}
      <Section background="default" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">Smart Updates</h2>
            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">Stay Connected With Your Orders.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Status Updates', desc: 'Get clear updates on where your order is at any time.', icon: CloudLightning },
              { title: 'Stock Manager', desc: 'Our systems stay in sync to make sure we always have what you need.', icon: Server },
              { title: 'Predictive Care', desc: 'We help you stay ahead of shortages so your patients are always covered.', icon: Microscope }
            ].map((tech, i) => (
              <div key={i} className="p-10 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-xl transition-all group">
                <tech.icon className="text-indigo-600 mb-6 group-hover:scale-110 transition-transform" size={28} />
                <h4 className="text-lg font-bold text-slate-900 mb-3">{tech.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* --- 5b. OPERATIONAL HIGHLIGHT 3 --- Text Left / Image Right */}
      <Section background="default" className="py-24 border-t border-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <span className="text-indigo-600 text-xs font-black uppercase tracking-widest mb-4 block">Fast Response</span>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Always Ready to Move, Whenever You Need Us.</h2>
              <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8">
                When a medical emergency strikes or a clinic runs low on vital stock, time is of the essence. Our dispatch center in RYK is operational and ready to move at a moment’s notice. With a versatile fleet of temperature-controlled vans and highly agile bike riders, we can navigate through the busiest city traffic to ensure your orders arrive on time. We take pride in our rapid response, because in the world of healthcare, we know that every minute counts.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                  ))}
                </div>
                <div className="text-sm font-bold text-slate-900">Over 100+ Professional Team Members Ready 24/7</div>
              </div>
            </div>
            <div className="h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <img src="/images/warehouse_team.jpg" alt="Quick Dispatch" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </Section>

      {/* --- 6. COMPLIANCE (SEC-06) --- Single Official Certification */}
      <div className="bg-slate-900 py-24 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-12">Authorized To Serve</h2>

          <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group border-4 border-double border-slate-100">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
              <ShieldCheck size={400} />
            </div>

            <div className="relative z-10">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block">Government of Punjab</span>
              <h3 className="text-3xl font-black text-slate-900 mb-2">FORM NO. 11</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 border-b border-slate-100 pb-8">License to Sell Drugs as a Distributor</p>

              <div className="grid grid-cols-2 gap-8 text-left mb-8">
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">License No.</div>
                  <div className="text-sm font-bold text-slate-900 font-mono">03-313-0156-025377D</div>
                </div>
                <div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Valid Until</div>
                  <div className="text-sm font-bold text-slate-900">30.12.2028</div>
                </div>
              </div>

              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 mb-8">
                <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Authorized Entity</div>
                <div className="text-lg font-black text-slate-900">Swift Sales Medicine Distributor</div>
              </div>

              <Link to="/about">
                <button className="px-8 py-3 bg-slate-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 mx-auto">
                  View All Credentials <ArrowUpRight size={14} />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- 7. GEOGRAPHIC Hub (SEC-07) --- Simplified Visualization */}
      <Section background="default" className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-blue-600 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">We Cover the Region.</h2>
                <p className="text-blue-100 font-medium text-lg leading-relaxed mb-10">Starting from our main dispatch center, we have expanded to reach over 100+ districts, ensuring no clinic is left without medicine.</p>
                <div className="flex items-center gap-6">
                  <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <div className="text-4xl font-black text-white leading-none mb-1">100+</div>
                    <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Active Districts</div>
                  </div>
                  <div className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                    <div className="text-4xl font-black text-white leading-none mb-1">01</div>
                    <div className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Large Hub (RYK)</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-10 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <MapPin size={64} className="text-blue-400 mb-4 mx-auto animate-bounce-slow" />
                  <div className="text-white font-bold text-xl uppercase tracking-widest">Active Service Net</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* --- 8. CSR / SOCIAL (SEC-08) --- Clear Text Block */}
      <Section background="default" className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Trees className="text-emerald-500 mx-auto mb-8" size={40} />
          <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight">Service Excellence: Beyond Business.</h2>
          <p className="text-slate-500 font-medium leading-relaxed text-lg">We believe medicine is a right for everyone. We support rural health camps and provide emergency supplies during outbreaks, fulfilling our duty to the people of Pakistan.</p>
        </div>
      </Section>

      {/* --- 9. PARTNER TRUST (SEC-09) --- Text-Focused Reach */}
      <div className="pb-24">
        <div className="container mx-auto px-6">
          <div className="bg-slate-50 rounded-[3rem] p-12 lg:p-16 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="max-w-2xl">
              <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">34+ Strategic Partners.</h3>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                We work with the most reliable manufacturers to ensure the people of Pakistan have 24/7 access to life-saving medicine. Our network is built on real trust and proven results, not just logos.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100">
              <div className="text-center">
                <div className="text-5xl font-black text-blue-600 mb-2">34+</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Verified Market Chains</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 10. FINAL CTA (SEC-10) --- Clear & Concise */}
      <div className="container mx-auto px-6 mb-24">
        <div className="bg-slate-900 rounded-[3rem] p-16 lg:p-24 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Grow With Us.</h2>
            <p className="text-slate-400 group-hover:text-white transition-colors text-lg font-medium mb-12 max-w-xl mx-auto">Build a stronger medicine supply chain. Connect with Pakistan's healthcare vital link today.</p>
            <Link to="/contact">
              <button className="px-10 py-5 bg-white text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                Become a Partner
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
