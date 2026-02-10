import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Quote } from 'lucide-react';

const Testimonials = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const testimonials = [
        {
            text: "Swift Sales Healthcare has transformed our supply chain reliability. In an industry where a delay can mean the difference between life and death, their consistency is unmatched. They are not just vendors; they are strategic partners.",
            author: "Dr. Ahmed Bilal",
            role: "Medical Superintendent, DHQ Hospital",
            company: "District Health"
        },
        {
            text: "We have worked with dozens of distributors across Pakistan. The systems that Ejaz Malik has implemented are miles ahead of the competition. Their cold chain compliance data is impeccable and audit-ready at all times.",
            author: "Sarah Khan",
            role: "Regional Supply Chain Manager",
            company: "GSK Pakistan"
        },
        {
            text: "The responsiveness of their emergency unit is commendable. During the recent dengue outbreak, Swift Sales delivered critical IV fluids within 2 hours of our urgent requisition, helping us stabilize hundreds of patients.",
            author: "Prof. Dr. Irfan Javed",
            role: "CEO",
            company: "City Medical Complex"
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-white border-t border-slate-200">
            <div className="container mx-auto px-6" ref={ref}>
                <div className="text-center mb-12">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Trust & Credibility</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                        Partners in <span className="text-blue-600">Care</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={inView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="bg-slate-50 p-8 rounded-[1.5rem] relative group hover:shadow-xl hover:bg-white border border-slate-100 transition-all duration-300"
                        >
                            <div className="absolute top-8 right-8 text-blue-100 group-hover:text-blue-500 transition-colors duration-300">
                                <Quote size={40} fill="currentColor" strokeWidth={0} />
                            </div>

                            <div className="relative z-10 h-full flex flex-col">
                                <p className="text-slate-600 text-sm leading-relaxed font-medium italic mb-6 flex-grow">
                                    "{item.text}"
                                </p>
                                <div className="mt-auto pt-6 border-t border-slate-200">
                                    <div className="text-slate-900 font-bold text-lg">{item.author}</div>
                                    <div className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">{item.company}</div>
                                    <div className="text-slate-400 text-xs font-medium">{item.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
