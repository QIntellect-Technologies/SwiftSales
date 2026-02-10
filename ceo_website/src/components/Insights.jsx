import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Mic, Award, ArrowRight } from 'lucide-react';

const Insights = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const articles = [
        { category: 'Thinking', title: 'Why Pharmaceutical Distribution Needs Better Systems', excerpt: 'How process-driven excellence transforms logistics.', icon: BookOpen },
        { category: 'Future', title: 'The Future of Healthcare Logistics in Pakistan', excerpt: 'Deep dive into technology integration.', icon: Mic },
        { category: 'Trust', title: 'Building Trust in Medicine Supply Chains', excerpt: 'Establishing reliability through quality control.', icon: Award },
    ];

    return (
        <section id="insights" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6" ref={ref}>
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                        Thoughts
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Sharing <span className="text-blue-600">Knowledge</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {articles.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="group bg-white rounded-[2rem] border border-slate-100 p-8 shadow-lg hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <item.icon size={24} />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">
                                {item.category}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium flex-grow mb-6">
                                {item.excerpt}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:gap-3 transition-all">
                                Read Article <ArrowRight size={16} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Insights;
