import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, GraduationCap, Rocket, TrendingUp, Users, Building2, Globe, Sparkles } from 'lucide-react';

const Journey = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const milestones = [
        { year: '2003', title: 'Beginning the Journey', description: 'Started in herbal medicine sales; a 6-month foundational period.', icon: Briefcase },
        { year: '2005', title: 'Graduation & Growth', description: 'Completed 3 years as SPO while pursuing B.A. graduation.', icon: GraduationCap },
        { year: '2012', title: 'Swift Sales Launch', description: 'Started Swift Sales in Feb 2012 with an initial team of 5.', icon: Rocket },
        { year: '2015', title: 'Scaling Operations', description: 'Grew to 12 members and secured 6-7 partnerships.', icon: TrendingUp },
        { year: '2021', title: 'The Comeback', description: 'Regained momentum with a core team of 15-18 resources.', icon: Users },
        { year: '2024', title: 'Group Expansion', description: 'Evolved into a group of companies.', icon: Building2 },
        { year: '2026', title: 'Future Vision', description: 'Projected growth to 60+ skilled resources.', icon: Globe },
        { year: 'Beyond', title: 'Continuous Evolution', description: 'Committed to refining systems for decades to come.', icon: Sparkles },
    ];

    return (
        <section id="journey" className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6 shadow-sm">
                        My Journey
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Evolution of <span className="text-blue-600">Excellence</span>
                    </h2>
                </div>

                <div className="relative max-w-5xl mx-auto" ref={ref}>
                    {/* Vertical Line */}
                    <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-slate-200 lg:-translate-x-1/2" />

                    <div className="space-y-12">
                        {milestones.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.1 * index }}
                                className={`relative flex flex-col lg:flex-row gap-8 items-start lg:items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                            >
                                {/* Timeline Dot */}
                                <div className="absolute left-4 lg:left-1/2 w-4 h-4 bg-blue-600 border-4 border-white rounded-full shadow-md -translate-x-[7px] lg:-translate-x-2 z-10" />

                                {/* Content Card */}
                                <div className="w-full lg:w-[calc(50%-2rem)] pl-12 lg:pl-0">
                                    <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-lg hover:shadow-xl transition-shadow group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <item.icon size={20} />
                                            </div>
                                            <span className="text-2xl font-black text-slate-200 group-hover:text-blue-100 transition-colors">
                                                {item.year}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Spacer for alternating layout */}
                                <div className="hidden lg:block w-[calc(50%-2rem)]" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Journey;
