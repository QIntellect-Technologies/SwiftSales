import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, NavLink } from 'react-router-dom';
import { Activity, Mail, Lock, Loader2, ArrowRight, User, Building2, ChevronRight, ShieldCheck, Check, BadgeCheck } from 'lucide-react';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        organization: '',
        email: '',
        password: '',
        role: 'Pharmacy Manager'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate registration process
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);

            // Redirect to login after showing success message
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center pt-32 pb-20 px-6">
            {/* Animated Background Elements - Subtler */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-blue-100/20 blur-[100px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-indigo-100/20 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="w-full max-w-7xl z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                {/* Left Side: Brand & Value */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:w-[35%] space-y-8"
                >
                    <div className="flex items-center gap-4 group">
                        <div className="bg-gradient-to-tr from-blue-700 to-indigo-700 text-white p-2.5 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition duration-300">
                            <Activity size={28} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">Swift Sales</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mt-1">Partner Network</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1]">
                            Join the Future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Medicine Distribution.</span>
                        </h1>
                        <p className="text-base text-slate-500 font-medium leading-relaxed max-w-md">
                            Request authorized access to the city's most reliable clinical hub. Manage orders and sync inventory in real-time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                        {[
                            '2000+ Essential Medicines',
                            'Real-Time Cold-Chain Logs',
                            '45-Min Priority Delivery',
                            'Full GDP & ISO Compliance'
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-slate-700 font-bold text-sm">
                                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Check size={12} strokeWidth={3} />
                                </div>
                                {text}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: Register Card - Extended Width */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:w-[65%] w-full max-w-[900px]"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 border border-white shadow-2xl shadow-blue-900/5 relative overflow-hidden">
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", damping: 12 }}
                                        className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <BadgeCheck size={48} />
                                    </motion.div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-3 text-center">Registration Success!</h2>
                                    <p className="text-slate-500 font-medium max-w-sm mx-auto">
                                        Your Partner ID has been generated and clinical credentials are now being verified. Redirecting to Secure Entrance...
                                    </p>
                                    <div className="mt-8 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest animate-pulse">
                                        <Loader2 size={16} className="animate-spin" />
                                        Syncing Authentication Node
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Partner Registration</h2>
                            <p className="text-slate-500 font-medium">Become an authorized distribution point.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                        placeholder="Full legal name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Organization</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Building2 size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                        placeholder="Pharmacy or Hospital name"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Professional Email</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                        placeholder="Enter work email address"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Security Credentials</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder:text-slate-400 shadow-sm"
                                        placeholder="Minimum 8 characters"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-blue-600/30 transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-70 group overflow-hidden relative active:scale-[0.98]"
                                >
                                    <AnimatePresence mode="wait">
                                        {isLoading ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-3"
                                            >
                                                <Loader2 size={20} className="animate-spin" />
                                                <span className="tracking-wide text-xs">VERIFYING HUB ID...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="idle"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="tracking-wide">Create Partner Account</span>
                                                <ChevronRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-slate-500 font-medium text-sm">
                                Already have an Access Key?{" "}
                                <NavLink to="/login" className="text-blue-600 font-bold hover:underline">Secure Entrance</NavLink>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
