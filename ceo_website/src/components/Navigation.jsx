import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const Navigation = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeHash, setActiveHash] = useState('');

    useEffect(() => {
        // Check initial scroll position immediately
        setIsScrolled(window.scrollY > 50);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);

            const sections = navItems.map(item => item.href.substring(1));
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 150 && rect.bottom >= 150;
                }
                return false;
            });
            if (current) setActiveHash(`#${current}`);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'Home', href: '#home' },
        { label: 'About', href: '#about' },
        { label: 'Journey', href: '#journey' },
        { label: 'Philosophy', href: '#philosophy' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-[999] flex justify-center pt-0 md:pt-4 pointer-events-none">
                <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        // When scrolled, shrink to auto width to hug content, but max out at 850px.
                        // When not scrolled, limit to 1100px so elements aren't too far apart on wide screens.
                        width: isScrolled ? 'auto' : '100%',
                        maxWidth: isScrolled ? 'fit-content' : '1100px',
                        marginTop: isScrolled ? '1rem' : '0rem',
                        borderRadius: isScrolled ? '100px' : '0'
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={`pointer-events-auto transition-all duration-300 ${isScrolled
                        ? 'glass shadow-2xl border border-white/40 bg-white/70 backdrop-blur-xl px-2'
                        : 'bg-transparent'
                        }`}
                >
                    <div className={`px-4 lg:px-6 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6'}`}>
                        <div className="flex items-center justify-between gap-8 md:gap-12">
                            {/* Logo */}
                            <motion.a
                                href="#home"
                                className="flex items-center gap-2 group shrink-0"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs transition-colors duration-300 ${isScrolled ? 'bg-blue-600' : 'bg-slate-900 group-hover:bg-blue-600'}`}>
                                    EM
                                </div>
                                <span className="text-lg font-black tracking-tight text-slate-900 whitespace-nowrap">
                                    Ejaz Malik
                                </span>
                            </motion.a>

                            {/* Desktop Navigation */}
                            <div className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md rounded-full p-1.5 border border-white/40 shadow-sm transition-all duration-300 hover:bg-white hover:shadow-md shrink-0">
                                {navItems.map((item, index) => (
                                    <a
                                        key={index}
                                        href={item.href}
                                        className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeHash === item.href
                                            ? 'text-white'
                                            : 'text-slate-600 hover:text-blue-600'
                                            }`}
                                        onClick={() => setActiveHash(item.href)}
                                    >
                                        {activeHash === item.href && (
                                            <motion.div
                                                layoutId="activePill"
                                                className="absolute inset-0 bg-slate-900 rounded-full shadow-lg"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <span className="relative z-10">{item.label}</span>
                                    </a>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <div className="hidden md:block shrink-0">
                                <motion.a
                                    href="#contact"
                                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${isScrolled
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
                                        : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/20'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Let's Talk <ChevronRight size={14} />
                                </motion.a>
                            </div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                className={`md:hidden p-2 rounded-full transition-colors ${isScrolled ? 'bg-slate-100 text-slate-900' : 'bg-white text-slate-900 shadow-lg'
                                    }`}
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </motion.button>
                        </div>
                    </div>
                </motion.nav>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-4 right-4 z-50 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {navItems.map((item, index) => (
                                <motion.a
                                    key={index}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    href={item.href}
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 text-slate-600 font-bold uppercase text-xs tracking-widest group transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-blue-600" />
                                </motion.a>
                            ))}
                            <motion.a
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                href="#contact"
                                className="mt-4 w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-xs tracking-widest text-center shadow-lg active:scale-95 transition-transform"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Start a Conversation
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navigation;
