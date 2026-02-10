import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building2, Package, MapPin, TrendingUp } from 'lucide-react';

const AnimatedCounter = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView({ triggerOnce: true });

    useEffect(() => {
        if (!inView) return;
        const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
        const increment = numericValue / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                setCount(numericValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value]);

    return <span ref={ref}>{count}{value.replace(/[0-9]/g, '')}</span>;
};

const Achievements = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const achievements = [
        { icon: Building2, value: '34', label: 'Corporate Partners', sub: 'Exclusive Partnerships' },
        { icon: Package, value: '2,429', label: 'Products', sub: 'Comprehensive Portfolio' },
        { icon: MapPin, value: '100+', label: 'Districts', sub: 'Extensive Network' },
        { icon: TrendingUp, value: '1,500+', label: 'Daily Deliveries', sub: 'Consistent Service' },
    ];

    return (
        <section id="achievements" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-blue-200 text-[10px] font-black uppercase tracking-widest mb-6">
                        Impact
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        Scale of <span className="text-blue-500">Operations</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {achievements.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors duration-300 text-center backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-6">
                                <item.icon size={24} />
                            </div>
                            <div className="text-4xl font-black mb-2">
                                <AnimatedCounter value={item.value} />
                            </div>
                            <div className="text-sm font-bold text-white mb-1">{item.label}</div>
                            <div className="text-xs font-medium text-slate-400">{item.sub}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Achievements;
