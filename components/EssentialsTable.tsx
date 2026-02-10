import React from 'react';
import { Pill, Droplets, FlaskConical, ShieldCheck } from 'lucide-react';

const ESSENTIALS = [
    { id: 'sq1', name: 'SAFE-ONE', generic: 'Omeprazole', form: 'Capsule', category: 'Gastroenterology', dosage: '20mg', distributor: 'Shrooq Pharma' },
    { id: 'av1', name: 'AVECIP', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', dosage: '500mg', distributor: 'Avant Pharma' },
    { id: 'tri1', name: 'TRICEF', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', dosage: '1g', distributor: 'Triafa Pharmaceuticals' },
    { id: 'st1', name: 'ROCETREX', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', dosage: '1g', distributor: 'Star Laboratories' },
    { id: 'os1', name: 'CIPROZAT', generic: 'Ciprofloxacin', form: 'Tablet', category: 'Antibiotic', dosage: '500mg', distributor: 'Ospheric Pharma' },
    { id: 'pb1', name: 'LIKZONE', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', dosage: '1g', distributor: 'Pinnacle Biotec' },
    { id: 'si1', name: 'ULCENIL', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', dosage: '40mg', distributor: 'Siza International' },
    { id: 'gp1', name: 'GLIXIM', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', dosage: '400mg', distributor: 'Glitz Pharma' },
    { id: 'ap1', name: 'BACTOWIN', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', dosage: '1g', distributor: 'Acumen Pharmaceuticals' },
    { id: 'sh2', name: 'FUSICARE', generic: 'Fusidic Acid', form: 'Cream', category: 'Dermatology', dosage: '15g', distributor: 'Serving Health Pakistan' },
    { id: 'sp1', name: 'STRACEF', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', dosage: '1g', distributor: 'Swiss Pharmaceuticals' },
    { id: 'cp1', name: 'CURAXONE', generic: 'Ceftriaxone', form: 'Injection', category: 'Antibiotic', dosage: '1g', distributor: 'Curatech Pharma' },
    { id: 'ar1', name: 'ZALTER', generic: 'Olanzapine', form: 'Tablet', category: 'Neurology', dosage: '10mg', distributor: 'Araf Pharma' },
    { id: 'qp1', name: 'XEEBON', generic: 'Multivitamin', form: 'Tablet', category: 'Supplement', dosage: 'Daily', distributor: 'Qurrum Pharma' },
    { id: 'pb2', name: 'MONEPRA', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', dosage: '40mg', distributor: 'Pinnacle Biotec' },
    { id: 'av4', name: 'NAVIS', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', dosage: '40mg', distributor: 'Avant Pharma' },
    { id: 'ap2', name: 'NAVIX', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', dosage: '40mg', distributor: 'Acumen Pharmaceuticals' },
    { id: 'sp4', name: 'SWICEF', generic: 'Cefixime', form: 'Capsule', category: 'Antibiotic', dosage: '400mg', distributor: 'Swiss Pharmaceuticals' },
    { id: 'qp4', name: 'MAXISURE', generic: 'Nutrition', form: 'Powder', category: 'Supplement', dosage: '400g', distributor: 'Qurrum Pharma' },
    { id: 'sq2', name: 'MAXLUM', generic: 'Esomeprazole', form: 'Capsule', category: 'Gastroenterology', dosage: '40mg', distributor: 'Shrooq Pharma' },
];

const getFormIcon = (form: string) => {
    switch (form.toLowerCase()) {
        case 'injection': return <Droplets size={16} className="text-blue-500" />;
        case 'syrup': return <Droplets size={16} className="text-teal-500" />;
        case 'cream': case 'gel': return <FlaskConical size={16} className="text-sky-500" />;
        case 'capsule': case 'tablet': return <Pill size={16} className="text-indigo-500" />;
        default: return <Pill size={16} className="text-slate-400" />;
    }
};

export const EssentialsTable: React.FC = () => {
    return (
        <div className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            {/* Table Header Wrapper */}
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-50 to-white">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Top 20 Essential Medicines</h3>
                    <p className="text-slate-500 text-sm font-medium">Quick reference for our high-demand pharmaceutical portfolio.</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Product Name</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Generic / Formula</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Therapy Area</th>
                            <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Form / Dose</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">Distributor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ESSENTIALS.map((item, i) => (
                            <tr
                                key={item.id}
                                className="group hover:bg-blue-50/30 transition-colors duration-200"
                            >
                                <td className="px-8 py-4 border-b border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] group-hover:scale-110 transition-transform">
                                            {item.name[0]}
                                        </div>
                                        <span className="font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 border-b border-slate-50 text-sm font-bold text-slate-500 italic">
                                    {item.generic}
                                </td>
                                <td className="px-6 py-4 border-b border-slate-50">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-tight group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 border-b border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                                            {getFormIcon(item.form)}
                                        </div>
                                        <div className="text-xs">
                                            <div className="font-bold text-slate-700">{item.form}</div>
                                            <div className="text-slate-400 font-medium">{item.dosage}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-4 border-b border-slate-50">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-blue-400" />
                                        <span className="text-xs font-bold text-slate-600">{item.distributor}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer Wrapper */}
            <div className="p-6 bg-slate-50/50 flex items-center justify-center border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-4">
                    <span className="w-8 h-px bg-slate-200"></span>
                    Guaranteed Supply & Genuine Products Only
                    <span className="w-8 h-px bg-slate-200"></span>
                </p>
            </div>
        </div>
    );
};
