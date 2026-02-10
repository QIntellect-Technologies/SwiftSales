import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Navigation, Share2, Activity, ShieldCheck, Globe } from 'lucide-react';

const Network = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const stats = [
        { label: "Active Districts", value: "100+", icon: MapPin, color: "blue" },
        { label: "Main Hub", value: "01", icon: Navigation, color: "indigo" },
        { label: "All Cities", value: "450+", icon: Globe, color: "emerald" },
        { label: "Our Team", value: "60+", icon: Activity, color: "rose" }
    ];

    return (
        <section id="network" className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6"
                        >
                            Our Reach
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                            Connected <br /><span className="text-blue-600 font-serif italic">Nationwide</span>
                        </h2>
                    </div>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="text-slate-500 font-medium max-w-sm lg:text-right"
                    >
                        We bridge the gap between medicine and patients, covering the hardest-to-reach corners of the country.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                    {/* Left Column: Stats & Information (Bento) */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={inView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.1 + idx * 0.1 }}
                                className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <stat.icon size={20} />
                                </div>
                                <div className="text-3xl font-black text-slate-900 leading-none mb-2">{stat.value}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5 }}
                            className="sm:col-span-2 bg-blue-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group"
                        >
                            <div className="absolute right-0 bottom-0 opacity-10 -mr-8 -mb-8 transform group-hover:scale-110 transition-transform duration-700">
                                <Activity size={200} />
                            </div>
                            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
                                <ShieldCheck size={24} />
                                Urban Delivery Network
                            </h3>
                            <p className="text-blue-100 font-medium leading-relaxed text-sm">
                                Crowded cities need smart solutions. Our specialized teams navigate through traffic to deliver medicine to clinics and shops with zero delay.
                            </p>
                            <div className="mt-8 flex gap-2">
                                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase">On Time</div>
                                <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase">Always Reliable</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: High-Density Map Visualization */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-7 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl min-h-[500px] lg:min-h-full"
                    >
                        {/* Complex Background Nodes */}
                        <div className="absolute inset-0">
                            {[...Array(24)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                                    className="absolute w-1 h-1 rounded-full bg-blue-400"
                                    style={{
                                        top: `${Math.random() * 80 + 10}%`,
                                        left: `${Math.random() * 80 + 10}%`,
                                    }}
                                />
                            ))}
                            {/* Animated SVG Connections */}
                            <svg className="absolute inset-0 w-full h-full opacity-30" style={{ stroke: 'rgba(96, 165, 250, 0.4)', strokeWidth: 1.5 }}>
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    d="M50,50 Q200,150 350,50 T600,150" fill="none"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                    d="M100,300 Q250,150 400,300 T700,100" fill="none"
                                />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                                    d="M150,450 Q300,200 450,400" fill="none"
                                />
                            </svg>
                        </div>

                        <div className="relative z-10 flex flex-col justify-between h-full text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-3xl font-black tracking-tighter mb-2">Rahim Yar Khan</h4>
                                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Our Main Hub</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-blue-500 font-serif italic uppercase">Primary</div>
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main Location</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                                <div>
                                    <div className="text-2xl font-black">12h</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">To Lahore</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black">8h</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">To Karachi</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black">4h</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">To Multan</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-black">2h</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">To Sukkur</div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Open Hub</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">Cold Storage</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Network;
