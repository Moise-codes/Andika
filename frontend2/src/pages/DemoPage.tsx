import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Button } from '../components/ui/Button';
import { Footer } from '../components/layout/Footer';

const VIDEO_ID = 'qRyfPNTYx14';
const VIDEO_BASE = `https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1&loop=1&playlist=${VIDEO_ID}&playsinline=1&showinfo=0&iv_load_policy=3&disablekb=1&cc_load_policy=0&autoplay=1`;

const T = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#E2E7F1',
  ink: '#1A1A1A',
  body: '#475569',
  muted: '#6B7280',
  accent: '#4D6BFE',
  accentSoft: '#EAEFEF',
  accentLight: '#F3F5FE',
  dark: '#0A0A23',
  hairline: 'rgba(148, 163, 184, 0.4)',
};

export const DemoPage: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
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
      {/* Navbar — transparent at top, glassmorphic pill on scroll */}
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

      {/* Main content — pt-24 to clear the fixed header */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 pt-24 pb-16">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: T.accent }}>
            Product Tour
          </p>
          <h1 className="text-[34px] sm:text-[46px] font-bold tracking-[-0.025em] leading-[1.1] mb-4">
            See LoneZen<br />
            <span style={{ fontWeight: 300, color: T.accent }}>in action</span>
          </h1>
          <p className="text-[15px] max-w-md mx-auto leading-relaxed" style={{ color: T.body }}>
            Watch how freelancers manage clients, generate proposals, and send invoices — all from one workspace.
          </p>
        </div>

        {/* Video player */}
        <div
          className="rounded-2xl overflow-hidden border relative"
          style={{ borderColor: T.hairline, boxShadow: '0 24px 64px rgba(77, 107, 254, 0.18)' }}
        >
          <div className="relative w-full" style={{ backgroundColor: T.dark, paddingBottom: '56.25%' }}>
            <iframe
              key={isMuted ? 'muted' : 'unmuted'}
              className="absolute inset-0 w-full h-full"
              src={`${VIDEO_BASE}&mute=${isMuted ? 1 : 0}&controls=1`}
              title="LoneZen Product Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {/* Mute toggle */}
            <div className="absolute bottom-3.5 right-3.5 z-20">
              <Button
                onClick={() => setIsMuted(m => !m)}
                variant="secondary"
                size="xs"
                icon={isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </div>
          </div>
        </div>

        {/* CTA below video */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/register">
            <Button variant="primary" size="lg" iconRight={<ArrowRight className="w-4 h-4" />}>
              Start for free
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
