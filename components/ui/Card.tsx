import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  variant?: 'default' | 'glow' | 'glass' | 'bento' | 'outline';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = true,
  variant = 'default' 
}) => {
  const baseStyles = "relative overflow-hidden transition-all duration-500 ease-out";
  
  const variants = {
    default: "bg-white border border-slate-100 rounded-3xl shadow-sm",
    // Bento style: ultra clean, subtle border, intended for grids
    bento: "bg-white border border-slate-200/60 rounded-[2rem] shadow-[0_2px_10px_rgba(0,0,0,0.02)]",
    glow: "bg-white border border-slate-100 rounded-3xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.1)]",
    glass: "bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-blue-900/5",
    outline: "bg-transparent border border-slate-200 rounded-3xl"
  };

  const hoverStyles = hoverEffect 
    ? "hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:-translate-y-1 cursor-pointer group hover:border-blue-100" 
    : "";

  return (
    <div 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
    >
      {/* Advanced hover gradient for bento/default cards */}
      {hoverEffect && (variant === 'bento' || variant === 'default') && (
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/0 via-blue-50/0 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      
      {/* Content wrapper */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};