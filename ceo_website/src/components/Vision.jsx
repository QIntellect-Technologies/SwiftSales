import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles } from 'lucide-react';

const Vision = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="vision" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-blue-300 text-xs font-black uppercase tracking-widest mb-8"
                    >
                        <Sparkles size={14} className="text-blue-400" />
                        Vision 2030
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight"
                    >
                        A Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Future</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-300 leading-relaxed font-medium space-y-6"
                    >
                        <p>
                            By 2030, Swift Sales Healthcare plans to use computers for everything. We are testing a new system to track every single medicine box from our warehouse to the patient. This means no mistakes and total safety.
                        </p>
                        <p>
                            We also plan to do more than just deliver. We want to start making our own medicines and repackaging them safely. We believe that good healthcare should not be just for a few people, but for everyone.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Vision;
