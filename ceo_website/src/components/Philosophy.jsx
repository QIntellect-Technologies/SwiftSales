import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Zap, Shield, Globe } from 'lucide-react';

const Philosophy = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const values = [
        {
            id: "01",
            title: "TRUTH",
            text: "We do not lie. We build trust.",
            icon: Shield,
            color: "blue"
        },
        {
            id: "02",
            title: "SYSTEMS",
            text: "No guessing. Only systems.",
            icon: Target,
            color: "indigo"
        },
        {
            id: "03",
            title: "SPEED",
            text: "Medicine, delivered fast.",
            icon: Zap,
            color: "amber"
        },
        {
            id: "04",
            title: "IMPACT",
            text: "Serving the nation.",
            icon: Globe,
            color: "emerald"
        }
    ];

    return (
        <section id="philosophy" className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
            {/* Background elements to fill space */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                <div className="max-w-4xl mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        Our Core Values
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6"
                    >
                        THE <span className="text-blue-600">STANDARD</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 font-medium max-w-2xl"
                    >
                        Honesty. Speed. Precision. This is how we work every single day.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-2xl hover:border-blue-100 transition-all duration-500 group relative overflow-hidden min-h-[320px] flex flex-col justify-between"
                        >
                            {/* Large Background ID */}
                            <div className="absolute -right-4 -top-4 text-9xl font-black text-slate-100 group-hover:text-blue-50 transition-colors duration-500 select-none">
                                {item.id}
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 text-slate-400 group-hover:text-blue-600 group-hover:shadow-lg group-hover:border-blue-50 flex items-center justify-center mb-8 transition-all duration-300">
                                    <item.icon size={28} strokeWidth={1.5} />
                                </div>

                                <h3 className="text-xs font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-[0.2em] mb-4 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-2xl font-bold text-slate-800 leading-tight group-hover:translate-x-1 transition-transform duration-300">
                                    "{item.text}"
                                </p>
                            </div>

                            <div className="relative z-10 mt-8 flex justify-end">
                                <div className="w-8 h-1 bg-slate-200 rounded-full group-hover:w-16 group-hover:bg-blue-600 transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
