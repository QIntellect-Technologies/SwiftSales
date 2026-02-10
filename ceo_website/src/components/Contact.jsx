import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Phone, MapPin, Send, Linkedin } from 'lucide-react';

const Contact = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

    const contactInfo = [
        { icon: Mail, label: 'Email', value: 'customercare.swiftsales@gmail.com' },
        { icon: Phone, label: 'Phone', value: '0301 8670511' },
        { icon: MapPin, label: 'Location', value: 'C8GM+HFF, Sardar Colony, Rahim Yar Khan' },
    ];

    return (
        <section id="contact" className="py-24 bg-white">
            <div className="container mx-auto px-6" ref={ref}>
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
                        Get in Touch
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Let's <span className="text-blue-600">Connect</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <p className="text-lg text-slate-600 font-medium leading-relaxed">
                            I'm always open to discussing healthcare logistics, systematic excellence, and opportunities for collaboration.
                        </p>
                        <div className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 transition-colors group">
                                    <div className="w-12 h-12 rounded-xl bg-white text-slate-400 flex items-center justify-center shadow-sm group-hover:text-blue-600 transition-colors">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{item.label}</div>
                                        <div className="text-base font-bold text-slate-900 break-all">{item.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 }}
                    >
                        <form className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Name</label>
                                    <input type="text" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900" placeholder="Enter Your Name" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                                    <input type="tel" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900" placeholder="e.g. 0301 8670511" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                                <input type="email" required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900" placeholder="Enter Your Email" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                                <textarea rows={4} required className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-slate-900 resize-none" placeholder="How can we help you?" />
                            </div>
                            <button className="w-full px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                                Send Message <Send size={16} />
                            </button>
                        </form>
                    </motion.div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm font-medium">
                    © {new Date().getFullYear()} Swift Sales Healthcare. All rights reserved. | Developed by QIntellect Technologies | customercare.swiftsales@gmail.com | 2206 ok
                </div>
            </div>
        </section>
    );
};

export default Contact;
