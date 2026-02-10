import React from 'react';
import { Section, SectionHeader } from '../components/ui/Section';
import { SEO } from '../components/SEO';
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react';

const Privacy: React.FC = () => {
    return (
        <>
            <SEO
                title="Privacy Policy"
                description="Privacy Policy for Swift Sales Healthcare. How we protect your data and ensure compliance."
            />

            <section className="relative pt-40 pb-20 bg-slate-50 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="inline-block py-1 px-3 rounded-full bg-white border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                            Legal
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                            Privacy <span className="text-blue-600">Policy.</span>
                        </h1>
                        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Your trust is our most valuable asset. Learn how we handle your information with the same care we handle life-saving medicines.
                        </p>
                    </div>
                </div>
            </section>

            <Section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="prose prose-slate lg:prose-lg mx-auto">
                        <div className="flex items-center gap-4 mb-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                            <Shield className="text-blue-600 shrink-0" size={32} />
                            <p className="text-blue-900 font-medium m-0">This policy was last updated on February 7, 2026. We regularly review our compliance to ensure your data remains protected.</p>
                        </div>

                        <div className="space-y-12">
                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">01</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">Information We Collect</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    To provide exceptional healthcare distribution services, we collect professional information including pharmacy names, license details, contact personnel, and delivery addresses. This data is essential for regulatory compliance and efficient logistics.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">02</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">How We Use Your Data</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    Your information is primarily used to fulfill orders, maintain account records, and communicate critical stock updates. We may also use data to improve our "SwiftBot" AI assistant to better serve your specific needs.
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                    {[
                                        "Order Processing & Delivery",
                                        "Regulatory Record Keeping",
                                        "Account Management",
                                        "Safety & Compliance Audits"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                            <ChevronRight size={16} className="text-blue-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">03</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">Data Security</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    We implement industry-standard encryption and security protocols. Just as our warehouse protects physical inventory, our servers protect your digital data from unauthorized access, loss, or misuse.
                                </p>
                            </div>

                            <div className="group">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">04</div>
                                    <h2 className="text-2xl font-bold text-slate-900 m-0">Compliance & Legal</h2>
                                </div>
                                <p className="text-slate-600 leading-relaxed">
                                    As a licensed distributor, we may be required by the Drug Regulatory Authority of Pakistan (DRAP) or other legal bodies to share specific records for audit and compliance purposes. We do not sell your data to third parties.
                                </p>
                            </div>

                            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden mt-16">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                                <h3 className="text-2xl font-bold mb-4">Have Questions?</h3>
                                <p className="text-slate-400 mb-8 max-w-lg">
                                    If you have concerns about how your professional information is handled, please contact our data compliance officer.
                                </p>
                                <a href="mailto:colab@qintellecttechnologies.com" className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-blue-600 pb-1 hover:text-blue-400 transition-colors">
                                    Send a Privacy Inquiry <ChevronRight size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
};

export default Privacy;
