import React from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Legacy from './components/Legacy';
import Philosophy from './components/Philosophy';
import Services from './components/Services';
import Journey from './components/Journey';
import Network from './components/Network';
import Achievements from './components/Achievements';
import Testimonials from './components/Testimonials';
import Vision from './components/Vision';
import Insights from './components/Insights';
import Contact from './components/Contact';
import Navigation from './components/Navigation';

// Wrapper for the Stacking Effect
const StickySection = ({ children, className = "" }) => {
    return (
        <div className={`sticky top-0 h-screen overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col justify-center shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] ${className}`}>
            {children}
        </div>
    );
};

function App() {
    return (
        <div className="relative bg-white">
            <Navigation />

            {/* Hero - Normal Flow */}
            <div className="relative z-10 bg-white">
                <Hero />
            </div>

            {/* Chapter 1: Legacy Stays, About+Philosophy cover it */}
            <StickySection className="bg-slate-50 z-20">
                <Legacy />
            </StickySection>

            <div className="relative z-30 bg-white">
                <About />
                <div className="bg-slate-50">
                    <Philosophy />
                </div>
            </div>

            {/* Chapter 2: Services Stays, Network+Journey cover it */}
            <StickySection className="bg-white z-40">
                <Services />
            </StickySection>

            <div className="relative z-50 bg-slate-50">
                <Network />
                <div className="bg-white">
                    <Journey />
                </div>
            </div>

            {/* Chapter 3: Achievements Stays, Testimonials+Vision cover it */}
            <StickySection className="bg-slate-900 z-[60]">
                <Achievements />
            </StickySection>

            <div className="relative z-[70] bg-white">
                <Testimonials />
                <div className="bg-slate-900">
                    <Vision />
                </div>
            </div>

            {/* Final Chapters - Normal Scroll */}
            <div className="relative z-[80] bg-slate-50">
                <Insights />
                <div className="bg-slate-900">
                    <Contact />
                </div>
            </div>
        </div>
    );
}

export default App;
