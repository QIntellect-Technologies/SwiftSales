import React, { useState } from 'react';
import { Section } from '../components/ui/Section';
import { SEO } from '../components/SEO';
import {
   MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2,
   MessageSquare, ArrowRight, Navigation, Linkedin, Twitter, Facebook
} from 'lucide-react';

// --- REAL MAP COMPONENT (GOOGLE MAPS IFRAME) ---
const RealMap: React.FC = () => {
   return (
      <div className="w-full h-[500px] bg-slate-100 rounded-[2.5rem] relative overflow-hidden border border-slate-200 shadow-inner group">
         <iframe
            src="https://www.google.com/maps?q=C8GM+HFF,+Sardar+Colony,+Rahim+Yar+Khan,+Pakistan&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
         ></iframe>
         <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/50 shadow-sm text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
            <MapPin size={12} className="text-blue-500" /> Authorized Hub Location
         </div>
      </div>
   );
};

const Contact: React.FC = () => {
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'Supply Inquiry',
      message: ''
   });

   const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setFormStatus('submitting');

      try {
         const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
         });

         const result = await response.json();

         if (result.success) {
            setFormStatus('success');
            setTimeout(() => setFormStatus('idle'), 5000);
            setFormData({
               firstName: '',
               lastName: '',
               email: '',
               phone: '',
               subject: 'Supply Inquiry',
               message: ''
            });
         } else {
            alert('Failed to establish sync. Please check connection.');
            setFormStatus('idle');
         }
      } catch (error) {
         console.error('Frontend Sync Error:', error);
         alert('Network error. Please ensure the backend console is active.');
         setFormStatus('idle');
      }
   };

   return (
      <div className="bg-white">
         <SEO
            title="Contact Us"
            description="Get in touch with Swift Sales Healthcare in Rahim Yar Khan. Phone: 0301 8670511, Email: customercare.swiftsales@gmail.com. Visit our HQ."
            keywords="Contact Swift Sales, Medicine Distributor Phone, Rahim Yar Khan Pharma Contact, Supply Inquiry"
         />
         {/* --- 1. HERO SECTION --- */}
         <section className="relative pt-40 pb-20 bg-slate-50 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
               <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] animate-blob"></div>
               <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
               <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
               <div className="max-w-4xl mx-auto text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
                     <MessageSquare size={14} /> Contact Our Team
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-8">
                     Let's Start a <br />
                     <span className="text-blue-600">Conversation.</span>
                  </h1>
                  <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                     Whether you need logistics support, product information, or want to discuss a partnership, our distribution specialists are here to help.
                  </p>
               </div>
            </div>
         </section>

         {/* --- 2. MAIN CONTENT GRID --- */}
         <Section className="py-24">
            <div className="flex flex-col lg:flex-row gap-16">

               {/* LEFT SIDE: INFO & MAP */}
               <div className="lg:w-1/2 space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {[
                        { icon: Phone, title: 'Call Us', detail: '03008607811', sub: 'Mon-Sat, 9am - 9pm' },
                        { icon: Mail, title: 'Email Us', detail: 'customercare.swiftsales@gmail.com', sub: 'Responding within 24hrs' }
                     ].map((item, i) => (
                        <div key={i} className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:border-blue-100">
                           <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                              <item.icon size={26} />
                           </div>
                           <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                           <p className="text-blue-600 font-semibold mb-1 break-all">{item.detail}</p>
                           <p className="text-sm text-slate-400 font-medium">{item.sub}</p>
                        </div>
                     ))}
                  </div>

                  {/* Simple Social Trace */}
                  <div className="flex flex-wrap items-center gap-8 px-4 py-4 border-l-2 border-slate-100">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global Connect:</span>
                     <div className="flex gap-6">
                        {[
                           { icon: Linkedin, label: 'LinkedIn' },
                           { icon: Twitter, label: 'Twitter' },
                           { icon: Facebook, label: 'Facebook' }
                        ].map((social, i) => (
                           <button key={i} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors group">
                              <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-bold">{social.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="flex items-center gap-3 px-2">
                        <MapPin className="text-blue-500" size={20} />
                        <h3 className="text-xl font-bold text-slate-900">Visit Our Headquarters</h3>
                     </div>
                     <RealMap />
                     <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                           <p className="text-slate-500 font-medium">C8GM+HFF, Sardar Colony</p>
                           <p className="text-slate-400 text-sm">Rahim Yar Khan, Pakistan</p>
                        </div>
                        <a
                           href="https://www.google.com/maps?q=C8GM+HFF,+Sardar+Colony,+Rahim+Yar+Khan,+Pakistan"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="px-8 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all text-center"
                        >
                           Get Directions
                        </a>
                     </div>
                  </div>
               </div>

               {/* RIGHT SIDE: PROFESSIONAL FORM */}
               <div className="lg:w-1/2">
                  <div className="bg-white rounded-[2.5rem] p-10 md:p-14 border border-slate-100 shadow-2xl shadow-blue-900/5 h-full">
                     <div className="mb-12">
                        <h3 className="text-3xl font-bold text-slate-900 mb-4">Send a Message</h3>
                        <p className="text-slate-500 font-medium">Complete the form below and we'll get back to you shortly.</p>
                     </div>

                     {formStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
                           <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-100">
                              <CheckCircle2 size={48} />
                           </div>
                           <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Received!</h3>
                           <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">
                              Thank you for reaching out. A specialist will review your inquiry and respond within 24 hours.
                           </p>
                           <button
                              onClick={() => setFormStatus('idle')}
                              className="px-10 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 transition-all"
                           >
                              Send Another
                           </button>
                        </div>
                     ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                                 <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-medium focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="Enter First Name"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                                 <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-medium focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="Enter Last Name"
                                 />
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-slate-700 ml-1">Business Email</label>
                                 <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-medium focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="Enter Business Email"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                 <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-medium focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="e.g. 0301 8670511"
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 ml-1">How can we help?</label>
                              <div className="relative">
                                 <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-medium focus:border-blue-500 focus:bg-white outline-none transition-all appearance-none cursor-pointer"
                                 >
                                    <option>Supply Inquiry</option>
                                    <option>Partnership Proposal</option>
                                    <option>Quality & Compliance</option>
                                    <option>Logistics Support</option>
                                    <option>General Question</option>
                                 </select>
                                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <ArrowRight size={18} className="rotate-90" />
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <label className="text-sm font-bold text-slate-700 ml-1">Message Details</label>
                              <textarea
                                 rows={6}
                                 name="message"
                                 required
                                 value={formData.message}
                                 onChange={handleChange}
                                 className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl text-slate-900 font-medium focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 resize-none"
                                 placeholder="How can we help? Describe your requirements here..."
                              ></textarea>
                           </div>

                           <button
                              type="submit"
                              disabled={formStatus === 'submitting'}
                              className="w-full py-5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 shadow-xl hover:shadow-blue-600/20 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 group"
                           >
                              {formStatus === 'submitting' ? (
                                 <>
                                    <Loader2 size={20} className="animate-spin" /> SENDING...
                                 </>
                              ) : (
                                 <>
                                    Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                 </>
                              )}
                           </button>
                        </form>
                     )}
                  </div>
               </div>
            </div>
         </Section>

         {/* --- 3. PROFESSIONAL FAQ --- */}
         <section className="py-32 bg-slate-50">
            <div className="container mx-auto px-6">
               <div className="text-center mb-20">
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Common Questions</h2>
                  <p className="text-slate-500 font-medium">Everything you need to know about our partnership process.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {[
                     {
                        title: 'Operational Response',
                        q: 'How fast do you respond?',
                        a: 'General inquiries are handled within 24 hours. Emergency support is available 24/7 for existing partners.',
                        icon: Clock
                     },
                     {
                        title: 'Delivery Coverage',
                        q: 'Where do you distribute?',
                        a: 'We provide 100% city-wide coverage with specialized hubs strategically located for 45-minute response times.',
                        icon: Navigation
                     },
                     {
                        title: 'Compliance Standards',
                        q: 'Are you fully licensed?',
                        a: 'Yes, we maintain full GDP/GMP certification and are regularly audited by health authorities.',
                        icon: CheckCircle2
                     }
                  ].map((item, i) => (
                     <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                           <item.icon size={24} />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4">{item.q}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
   );
};

export default Contact;