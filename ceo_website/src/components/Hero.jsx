import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { ChevronDown, Linkedin, Mail, Phone, Shield, Target, Award } from 'lucide-react';

const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Mouse Parallax Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        mouseX.set((clientX - left) / width - 0.5);
        mouseY.set((clientY - top) / height - 0.5);
    }

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]));
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]));

    return (
        <section
            ref={ref}
            id="home"
            className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-slate-50 perspective-1000"
            onMouseMove={handleMouseMove}
        >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
                    className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-blue-100/40 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-100/40 rounded-full blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-blue-500/10"
                        style={{
                            width: Math.random() * 20 + 5,
                            height: Math.random() * 20 + 5,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, Math.random() * -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 pt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        style={{ opacity }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-center lg:text-left relative z-20"
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "auto" }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm mb-8 overflow-hidden whitespace-nowrap"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            CEO & Founder, Swift Sales Healthcare
                        </motion.div>

                        <motion.h1
                            className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight whitespace-nowrap"
                        >
                            Ejaz <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 inline-block"
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                style={{ backgroundSize: "200% automobile" }}
                            >
                                Malik
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl text-slate-500 mb-8 font-serif italic"
                        >
                            "Delivering Health, Delivering Hope."
                        </motion.p>

                        <div className="space-y-6 mb-12 text-lg text-slate-600 leading-relaxed font-medium">
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                I am Ejaz Malik, the CEO of <strong>Swift Sales Healthcare</strong>. We are a professional medicine distribution company. My mission is to ensure that high-quality medicines reach every hospital, pharmacy, and patient on time.
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                We have built a strong system that doctors and patients can trust completely. We are not just moving boxes; we are saving lives by delivering medicine properly and safely.
                            </motion.p>
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
                        >
                            <motion.a
                                href="#contact"
                                className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 overflow-hidden flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Mail size={16} /> Get in Touch
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.a>
                            <motion.a
                                href="#about"
                                className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-full font-black text-xs uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Read My Story
                            </motion.a>
                        </motion.div>
                    </motion.div>

                    {/* Right: Advanced Animated Image Composition */}
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d"
                        }}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
                        className="relative h-[650px] w-full flex items-center justify-center lg:justify-end perspective-1000"
                    >
                        {/* Background Shape */}
                        <motion.div
                            className="absolute right-0 top-10 w-[80%] h-[90%] bg-blue-600 rounded-[3rem] rotate-3 opacity-10"
                            animate={{ rotate: [3, 6, 3] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="absolute right-4 top-14 w-[80%] h-[90%] bg-indigo-600 rounded-[3rem] -rotate-2 opacity-10"
                            animate={{ rotate: [-2, -5, -2] }}
                            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Main Image Container */}
                        <div className="relative w-[90%] h-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-white group hover:shadow-blue-200/50 transition-shadow duration-500">
                            <motion.img
                                src="./images/ChatGPT Image Feb 2, 2026, 05_47_17 PM.png"
                                alt="Ejaz Malik"
                                className="w-full h-full object-cover object-top scale-100 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent opacity-60" />

                            {/* Overlay Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex gap-4 mb-4">
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
                                    >
                                        <Target size={20} />
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: -10 }}
                                        className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white"
                                    >
                                        <Shield size={20} />
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements (Orbiting) */}
                        <motion.div
                            className="absolute -left-8 top-1/4 glass p-4 rounded-2xl shadow-xl border border-white/40"
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            style={{ transform: "translateZ(50px)" }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Award size={20} /></div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase text-slate-400">Industry Leader</div>
                                    <div className="text-sm font-bold text-slate-800">Top 1%</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="absolute -right-4 bottom-1/4 glass p-4 rounded-2xl shadow-xl border border-white/40"
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            style={{ transform: "translateZ(30px)" }}
                        >
                            <div className="text-center">
                                <div className="text-3xl font-black text-blue-600">20+</div>
                                <div className="text-[10px] font-bold uppercase text-slate-500">Years Experience</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
