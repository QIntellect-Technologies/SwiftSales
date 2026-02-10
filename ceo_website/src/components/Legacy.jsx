import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Legacy = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    return (
        <section id="legacy" className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6 relative z-10" ref={ref}>
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Our History</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                        20 Years of <span className="text-blue-600">Hard Work</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto leading-relaxed text-slate-700 font-medium text-lg text-justify">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.1 }}
                    >
                        <p className="mb-6 first-letter:text-5xl first-letter:font-black first-letter:text-blue-600 first-letter:mr-3 first-letter:float-left">
                            In 2003, medicine distribution in our area was not good. There were no systems and no temperature control. Patients had to wait days for simple medicines. I saw this as a big problem that needed to be fixed.
                        </p>
                        <p>
                            We started with just one small van and three people. The early days were very hard. Roads were bad and people did not want to change. But we had one rule: <strong>"If we say we will deliver, we deliver."</strong>
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        <p className="mb-6">
                            By 2012, that one van became many. Swift Sales Healthcare became a proper company. We were the first to use computers to track our stock. We did not just follow others; we set new standards.
                        </p>
                        <p>
                            Today, after 20 years, our biggest success is not money. It is the trust of a doctor in a small village who knows that when he writes a prescription, Swift Sales has already delivered the medicine. That trust is our real story.
                        </p>
                    </motion.div>
                </div>

                {/* Abstract 'Flow' Animation */}
                <div className="mt-24 relative h-32 w-full overflow-hidden max-w-5xl mx-auto rounded-3xl bg-blue-50/50 flex items-center justify-center">

                    {/* Moving Wave 1 */}
                    <motion.div
                        animate={{ x: ["-100%", "0%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[200%] h-full flex opacity-30"
                    >
                        <svg className="w-1/2 h-full text-blue-300" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
                            <path d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                        <svg className="w-1/2 h-full text-blue-300" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
                            <path d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </motion.div>

                    {/* Moving Wave 2 (Slower, Darker) */}
                    <motion.div
                        animate={{ x: ["-100%", "0%"] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-[200%] h-full flex opacity-20"
                    >
                        <svg className="w-1/2 h-full text-blue-600" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
                            <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                        <svg className="w-1/2 h-full text-blue-600" viewBox="0 0 1440 320" preserveAspectRatio="none" fill="currentColor">
                            <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </motion.div>

                    <div className="relative z-10 text-center">
                        <div className="text-xl font-serif italic text-blue-900/40 font-bold">"Excellence in Motion"</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Legacy;

