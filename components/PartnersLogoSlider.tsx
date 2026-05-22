import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const PARTNERS = [
  { name: 'Popular Chemical Works (PCW)', logo: 'pcw.png', color: 'from-blue-500 to-indigo-600', text: 'text-blue-600', bg: 'bg-blue-50/50' },
  { name: 'Glitz Pharma', logo: 'glitz.png', color: 'from-purple-500 to-fuchsia-600', text: 'text-purple-600', bg: 'bg-purple-50/50' },
  { name: 'Araf Pharma', logo: 'araf.png', color: 'from-indigo-500 to-blue-600', text: 'text-indigo-600', bg: 'bg-indigo-50/50' },
  { name: 'Trifa Pharmaceutical', logo: 'trifa.png', color: 'from-cyan-500 to-blue-600', text: 'text-cyan-600', bg: 'bg-cyan-50/50' },
  { name: 'Star Laboratories PVT Limited', logo: 'star.png', color: 'from-yellow-500 to-amber-600', text: 'text-yellow-600', bg: 'bg-yellow-50/50' },
  { name: 'Acumen Pharma', logo: 'acumen.png', color: 'from-green-500 to-emerald-600', text: 'text-green-600', bg: 'bg-green-50/50' },
  { name: 'Siza International PVT Limited', logo: 'siza.png', color: 'from-red-500 to-rose-600', text: 'text-red-600', bg: 'bg-red-50/50' },
  { name: 'Swiss Pharmaceuticals PVT Limited', logo: 'swiss.png', color: 'from-pink-500 to-rose-600', text: 'text-pink-600', bg: 'bg-pink-50/50' },
  { name: 'Rifa Life Sciences', logo: 'rifa.png', color: 'from-orange-500 to-amber-600', text: 'text-orange-600', bg: 'bg-orange-50/50' },
  { name: 'Quorum Pharma', logo: 'quorum.png', color: 'from-teal-500 to-emerald-600', text: 'text-teal-600', bg: 'bg-teal-50/50' },
  { name: 'Serving Health Pakistan', logo: 'serving.png', color: 'from-emerald-500 to-teal-600', text: 'text-emerald-600', bg: 'bg-emerald-50/50' },
  { name: 'Shrooq Pharmaceuticals PVT Limited', logo: 'shrooq.png', color: 'from-violet-500 to-purple-600', text: 'text-violet-600', bg: 'bg-violet-50/50' },
  { name: 'Avant Pharmaceuticals PVT Limited', logo: 'avant.png', color: 'from-fuchsia-500 to-pink-600', text: 'text-fuchsia-600', bg: 'bg-fuchsia-50/50' },
  { name: 'Goldsheff Nutraceuticals PVT Limited', logo: 'goldsheff.png', color: 'from-amber-500 to-orange-600', text: 'text-amber-600', bg: 'bg-amber-50/50' },
  { name: 'Curatech Pharma PVT Limited', logo: 'curatech.png', color: 'from-lime-500 to-green-600', text: 'text-lime-600', bg: 'bg-lime-50/50' },
  { name: 'Ospheric Pharma', logo: 'ospheric.png', color: 'from-sky-500 to-blue-600', text: 'text-sky-600', bg: 'bg-sky-50/50' },
  { name: 'Paul Brooks', logo: 'paul.png', color: 'from-rose-500 to-pink-600', text: 'text-rose-600', bg: 'bg-rose-50/50' },
  { name: 'Pinnacle Biotech', logo: 'pinnacle.png', color: 'from-slate-500 to-slate-700', text: 'text-slate-600', bg: 'bg-slate-50/50' },
  { name: 'Dermashine', logo: 'dermashine.png', color: 'from-zinc-500 to-slate-600', text: 'text-zinc-600', bg: 'bg-zinc-50/50' },
  { name: 'Green Crust', logo: 'green.png', color: 'from-stone-500 to-slate-600', text: 'text-stone-600', bg: 'bg-stone-50/50' }
];

export const PartnersLogoSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update visible items count based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(2); // Mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(3); // Tablet
      } else {
        setVisibleCount(6); // Desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = PARTNERS.length;
  const maxIndex = totalItems - visibleCount;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  // Auto-play effect
  useEffect(() => {
    if (isPlaying) {
      timeoutRef.current = setInterval(nextSlide, 4000);
    }
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [isPlaying, maxIndex, visibleCount]);

  // Render a beautiful logo fallback badge
  const renderLogoPlaceholder = (partner: typeof PARTNERS[0]) => {
    const initials = partner.name
      .replace('PVT Limited', '')
      .replace('(PCW)', '')
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${partner.color} text-white shadow-inner relative z-10`}>
        {/* Subtle geometric pattern in card */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:10px_10px]"></div>
        <span className="text-2xl font-black tracking-widest mb-1 drop-shadow-md">{initials}</span>
        <span className="text-[10px] font-black uppercase tracking-wider text-white/90 text-center line-clamp-1 max-w-full drop-shadow-sm px-1">
          {partner.name.replace(' PVT Limited', '')}
        </span>
      </div>
    );
  };

  return (
    <div className="mt-16 w-full relative group/slider">
      {/* Slider Controls Bar */}
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
          Our Distribution Partners
        </h4>
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
            aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-all shadow-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Slider Track Area */}
      <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/30 p-6 relative">
        {/* Decorative background blobs */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-48 h-48 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-48 h-48 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none"></div>

        <div 
          className="flex transition-transform duration-700 ease-out gap-4"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }}
        >
          {PARTNERS.map((partner) => {
            const itemWidthPercent = 100 / visibleCount;
            // State for checking if image loaded successfully
            return (
              <div
                key={partner.name}
                className="shrink-0 group relative"
                style={{ 
                  width: `calc(${itemWidthPercent}% - ${(visibleCount - 1) * 16 / visibleCount}px)`
                }}
              >
                <div className="h-28 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1">
                  {/* Real Image Render */}
                  <PartnerImage partner={partner} fallbackRenderer={renderLogoPlaceholder} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-1.5 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              setIsPlaying(false); // Stop autoplay when clicked
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx 
                ? 'w-6 bg-blue-600' 
                : 'w-2 bg-slate-200 hover:bg-slate-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Helper component to handle local image state
const PartnerImage: React.FC<{ 
  partner: typeof PARTNERS[0]; 
  fallbackRenderer: (p: typeof PARTNERS[0]) => React.ReactNode 
}> = ({ partner, fallbackRenderer }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <>{fallbackRenderer(partner)}</>;
  }

  return (
    <img
      src={`/partner-logos/${partner.logo}`}
      alt={partner.name}
      className="max-h-[70%] max-w-[80%] object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
      onError={() => setHasError(true)}
    />
  );
};

export default PartnersLogoSlider;
