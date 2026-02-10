import React from 'react';
import { Section, SectionHeader } from '../components/ui/Section';
import { SEO } from '../components/SEO';
import { FileText, ClipboardCheck, Scale, AlertCircle, ChevronRight } from 'lucide-react';

const Terms: React.FC = () => {
    return (
        <>
            <SEO
                title="Terms of Service"
                description="Terms and Conditions for partnering with Swift Sales Healthcare for medicine distribution."
            />

            <section className="relative pt-40 pb-20 bg-slate-50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-white border border-indigo-200 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                            Agreement
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                            Terms of <span className="text-indigo-600">Service.</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Please read these terms carefully. They define the standards of excellence we maintain in our distribution network.
                        </p>
                    </div>
                </div>
            </section>

            <Section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate lg:prose-lg mx-auto">
                        <div className="flex items-center gap-4 mb-12 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <Scale className="text-indigo-600 shrink-0" size={32} />
                            <p className="text-indigo-900 font-medium m-0">By accessing our services or interacting with SwiftBot, you agree to these professional standards and regulatory requirements.</p>
                        </div>

                        <div className="space-y-12">
                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">01</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">Authorized Use</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    Our platform and distribution services are exclusively for licensed healthcare providers, pharmacies, and medical institutions. You must provide valid licensing credentials to establish an account and place orders.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">02</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">Ordering & Fulfillment</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    While we strive for precision, stock availability is subject to manufacturer supply chains. Orders placed through SwiftBot or our sales representatives are confirmed only upon issuance of an official invoice.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">03</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">Integrity & Quality</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    Swift Sales guarantees the authenticity of all sourced medicines. We operate under strict GDP (Good Distribution Practice) guidelines. Damaged or incorrect items must be reported within 24 hours of delivery for safe handling and returns.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">04</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">Liability</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    We are responsible for the safe transit and storage of medicines until delivered. Swift Sales is not liable for outcomes resulting from the clinical use of products, which remains the responsibility of the manufacturer and the dispensing professional.
                                </p>
                            </div>

                            <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8 flex items-start gap-4 mt-16">
                                <AlertCircle className="text-amber-500 shrink-0 mt-1" size={24} />
                                <div className="text-sm text-slate-500 italic">
                                    Swift Sales reserves the right to terminate accounts that fail to maintain required healthcare licenses or violate ethical pharmaceutical practices.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default Terms;
