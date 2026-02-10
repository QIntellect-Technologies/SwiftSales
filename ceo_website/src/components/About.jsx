import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, TrendingUp, Heart } from 'lucide-react';

const About = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const stats = [
        { icon: Award, value: '34', label: 'Partner Companies' },
        { icon: Users, value: '60+', label: 'Team Members' },
        { icon: TrendingUp, value: '2,429', label: 'Products Managed' },
        { icon: Heart, value: '100+', label: 'Districts Served' },
    ];

    return (
        <section id="about" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left Content: Narrative */}
                    <motion.div
                        ref={ref}
                        initial={{ opacity: 0, x: -30 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest mb-6"
                        >
                            My Story
                        </motion.div>

                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight leading-tight">
                            A Journey of <br />
                            <span className="text-blue-600">Trust & Service</span>
                        </h2>

                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                            <p>
                                My journey started in 2003 when I began working in pharmaceutical sales. I traveled to many cities and saw how medicines were being sold and delivered. I realized that delivering medicine safely was a big challenge in our country, and there were many gaps in the system.
                            </p>
                            <p>
                                <strong>I wanted to fix this problem.</strong> So, I founded Swift Sales Healthcare. My goal was simple: to create a medicine distribution company that everyone can trust. We are not just a delivery service; we are a proper system. We make sure that medicines are stored at the right temperature and handled with care.
                            </p>
                            <p>
                                Today, I lead a team of over 60 hardworking professionals. We work day and night to supply medicines to thousands of pharmacies and hospitals. Whether it is a small village or a big city, we ensure that clean, safe, and effective medicine reaches the patient on time. This is my life's work.
                            </p>
                        </div>

                        <div className="mt-10 pt-10 border-t border-slate-100">
                            <div className="text-xl font-serif italic text-slate-800">"Honesty and timely delivery are the two pillars of my business."</div>
                            <div className="mt-4 font-bold text-slate-900">– Ejaz Malik</div>
                        </div>
                    </motion.div>

                    {/* Right Content: Stats & Mission Card */}
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 group text-center"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <stat.icon size={24} />
                                    </div>
                                    <div className="text-3xl font-black text-slate-900 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mission Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden text-center shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900 pointer-events-none" />
                            <div className="relative z-10">
                                <p className="text-xl font-medium text-blue-100 leading-relaxed mb-6">
                                    "We supply medicines to heal the nation. Quality and speed are our promise."
                                </p>
                                <button className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors">
                                    Partner With Us
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
