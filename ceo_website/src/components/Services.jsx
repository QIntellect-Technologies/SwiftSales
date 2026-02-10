import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Thermometer, Truck, Warehouse, BarChart3, Clock, ShieldCheck } from 'lucide-react';

const Services = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const services = [
        {
            icon: Thermometer,
            title: "Staying Cool",
            text: "Medicines need to be kept cold. We make sure they stay between 2°C and 8°C. Our trucks have special sensors to check the temperature all the time. This keeps safe medicines like insulin and vaccines ready for patients."
        },
        {
            icon: Warehouse,
            title: "Safe Storage",
            text: "Our warehouse is huge and clean. We store medicines safely. We have a smart system that makes sure the oldest medicines go out first. This way, nothing expires and goes to waste."
        },
        {
            icon: Truck,
            title: "Fast Delivery",
            text: "We have over 20 delivery vans. We use GPS to find the fastest roads. This helps us deliver medicines 30% faster than others. In our main cities, we deliver in 24 hours."
        },
        {
            icon: BarChart3,
            title: "Smart Planning",
            text: "We plan ahead. We know what medicines people need before they run out. We help pharmacies stock up so no patient has to go home empty-handed."
        },
        {
            icon: ShieldCheck,
            title: "Checking Quality",
            text: "We check every box that comes in. We look at the dates and seals. We only work with real, honest suppliers. Fake medicine is not allowed in our system."
        },
        {
            icon: Clock,
            title: "Always Ready",
            text: "Sickness does not sleep, and neither do we. We have a team ready 24/7. If a hospital needs urgent medicine, we can send it in less than 60 minutes."
        }
    ];

    return (
        <section id="services" className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6" ref={ref}>
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">What We Do</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                            We Deliver <span className="text-blue-600">Care</span>
                        </h2>
                        <p className="mt-4 text-slate-600 text-lg leading-relaxed font-medium">
                            We handle every step with care. From keeping medicines cold to delivering them fast, we do it all to save lives.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <service.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed font-medium text-sm">
                                {service.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
