/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Footer } from '../components/layout/Footer';
import { Logo } from '../components/ui/Logo';

const T = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#E2E7F1',
  ink: '#1A1A1A',
  body: '#475569',
  muted: '#6B7280',
  accent: '#4D6BFE',
  accentSoft: '#EAEFEF',
  dark: '#0A0A23',
  hairline: 'rgba(148, 163, 184, 0.4)',
};

interface StaticPageLayoutProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}

export const StaticPageLayout: React.FC<StaticPageLayoutProps> = ({ eyebrow, title, subtitle, children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="min-h-screen antialiased flex flex-col"
      style={{
        backgroundColor: '#FFFFFF',
        backgroundImage: [
          'linear-gradient(180deg, #D6DBDC 0%, #FFFFFF 100%)',
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(77, 107, 254, 0.08) 0%, transparent 60%)',
        ].join(', '),
        backgroundAttachment: 'fixed',
        color: T.ink,
      }}
    >
      {/* Header — transparent at top, glassmorphic pill on scroll */}
      <header
        className="fixed top-0 inset-x-0 z-40 transition-[padding] duration-300 ease-out"
        style={{
          paddingTop: scrolled ? '10px' : '0',
          paddingBottom: scrolled ? '10px' : '0',
        }}
      >
        <div
          className="max-w-6xl mx-auto px-6 transition-all duration-300 ease-out"
          style={{
            borderRadius: '16px',
            backgroundColor: scrolled ? 'rgba(230, 225, 218, 0.55)' : 'transparent',
            backdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
            border: `1px solid ${scrolled ? 'rgba(255,255,255,0.40)' : 'transparent'}`,
            boxShadow: scrolled
              ? '0 4px 24px -6px rgba(74,59,50,0.12), 0 1px 0 rgba(255,255,255,0.55) inset'
              : 'none',
            height: '64px',
          }}
        >
          <div className="flex items-center justify-between h-full">
            <Link to="/" className="flex items-center gap-2.5 group">
              <Logo size={30} className="transition-transform duration-200 group-hover:scale-105" />
              <span className="font-semibold text-[15px] tracking-tight">
                LoneZen<span style={{ color: T.accent }}>.</span>
              </span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-opacity duration-150 hover:opacity-70"
              style={{ color: T.muted }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>
          </div>
        </div>
      </header>

      {/* Content — pt-24 clears the fixed header */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 pt-24 pb-16">
        {eyebrow && (
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-4" style={{ color: T.accent }}>
            {eyebrow}
          </p>
        )}
        <h1 className="text-[36px] sm:text-[44px] font-bold tracking-[-0.025em] leading-[1.1] mb-4">{title}</h1>
        {subtitle && (
          <p
            className="text-[15px] leading-relaxed mb-12 pb-8 border-b"
            style={{ color: T.body, borderColor: T.hairline }}
          >
            {subtitle}
          </p>
        )}
        <div className="static-page-content">{children}</div>
      </main>

      <Footer />
    </div>
  );
};
