import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'darker' | 'accent' | 'blue' | 'dark';
  overflowVisible?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  id,
  background = 'default',
  overflowVisible = false
}) => {
  const bgColors = {
    default: 'bg-white',
    darker: 'bg-slate-50',
    accent: 'bg-sky-50/50',
    blue: 'bg-slate-900 text-white',
    dark: 'bg-slate-950 text-white'
  };

  return (
    <section
      id={id}
      className={`py-24 relative ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} ${bgColors[background]} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        {children}
      </div>
    </section>
  );
};

export const SectionHeader: React.FC<{ title: string; subtitle?: string; align?: 'left' | 'center'; dark?: boolean }> = ({
  title,
  subtitle,
  align = 'center',
  dark = false
}) => (
  <div className={`mb-20 max-w-4xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    <h2 className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
      {title}
    </h2>
    {subtitle && (
      <div className={`h-1.5 w-24 bg-blue-600 rounded-full mb-8 ${align === 'center' ? 'mx-auto' : ''}`}></div>
    )}
    {subtitle && (
      <p className={`text-lg md:text-xl leading-relaxed font-normal ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
        {subtitle}
      </p>
    )}
  </div>
);