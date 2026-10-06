'use client';

import Link from 'next/link';
import { ArrowRight, Keyboard, Zap, Trophy, Users, CheckCircle2, Plus, Menu, X, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/* ── Design tokens (ANDIKA Forest Theme) ── */
const T = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceWarm: '#F4F0E7',
  border: '#D9D7CF',
  borderStrong: '#C4C0B8',
  hairline: 'rgba(65, 82, 57, 0.08)',
  ink: '#30302E',
  body: '#696A64',
  muted: '#8A8B85',
  accent: '#415239',
  accentSoft: '#4A7C42',
  accentLight: '#8FB877',
  dark: '#34442F',
};

const features = [
  {
    icon: <Sparkles className="w-[18px] h-[18px]" />,
    title: 'Multiple Typing Modes',
    desc: 'Practice with time-based, word-based, quote, and programming typing modes tailored to your goals.',
  },
  {
    icon: <Zap className="w-[18px] h-[18px]" />,
    title: 'Real-time Analytics',
    desc: 'Track WPM, accuracy, consistency, and identify weak keys with detailed performance insights.',
  },
  {
    icon: <Users className="w-[18px] h-[18px]" />,
    title: 'Global Leaderboards',
    desc: 'Compete with typists worldwide in real-time multiplayer typing battles and climb the rankings.',
  },
  {
    icon: <Trophy className="w-[18px] h-[18px]" />,
    title: 'Achievements & Streaks',
    desc: 'Unlock badges, maintain daily streaks, and celebrate your typing milestones.',
  },
  {
    icon: <Keyboard className="w-[18px] h-[18px]" />,
    title: 'Structured Learning',
    desc: 'Progress through courses and lessons designed to improve your typing technique systematically.',
  },
  {
    icon: <Zap className="w-[18px] h-[18px]" />,
    title: 'Programming Practice',
    desc: 'Type code snippets in multiple programming languages to improve developer typing skills.',
  },
];

const faqs = [
  {
    q: 'Is ANDIKA free to use?',
    a: 'Yes. ANDIKA is completely free with all features including typing modes, analytics, leaderboards, and competitions. No credit card required.',
  },
  {
    q: 'How does the WPM calculation work?',
    a: 'We calculate WPM (words per minute) based on 5-character words, accounting for accuracy. Only correctly typed characters count toward your speed.',
  },
  {
    q: 'Can I track my progress over time?',
    a: 'Absolutely. Your typing history, WPM trends, accuracy improvements, and weak key analysis are all tracked and visualized in your dashboard.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'You can practice without an account, but creating one lets you save your progress, compete on leaderboards, and unlock achievements.',
  },
  {
    q: 'What programming languages are supported?',
    a: 'We support typing practice for JavaScript, Python, Java, C++, TypeScript, Go, Rust, and many more popular languages.',
  },
];

/** Fades content up into view when scrolled into the viewport */
const Reveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}> = ({ children, className = '', stagger }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${stagger ? 'reveal-stagger' : 'reveal'} ${className}`}>
      {children}
    </div>
  );
};

/* ── Hero headline typewriter ── */
const HERO_TAGLINES = [
  'faster.',
  'smarter.',
  'with precision.',
];

/** Types each tagline, holds, deletes, then moves to the next. */
const HeroTypewriter: React.FC = () => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = HERO_TAGLINES[phraseIdx];
    let delay = deleting ? 14 : 34;
    if (!deleting && length === phrase.length) delay = 2600;
    else if (deleting && length === 0) delay = 420;

    const t = setTimeout(() => {
      if (!deleting) {
        if (length < phrase.length) setLength(length + 1);
        else setDeleting(true);
      } else if (length > 0) {
        setLength(length - 1);
      } else {
        setDeleting(false);
        setPhraseIdx((phraseIdx + 1) % HERO_TAGLINES.length);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [length, deleting, phraseIdx]);

  return (
    <>
      {HERO_TAGLINES[phraseIdx].slice(0, length)}
      <span className="type-caret" aria-hidden />
    </>
  );
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      className="min-h-screen antialiased relative"
      style={{
        backgroundColor: '#FAF8F5',
        backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(65, 82, 57, 0.08) 0%, transparent 60%)',
        backgroundAttachment: 'fixed',
        color: T.ink,
      }}
    >
      {/* ══ Navbar ── */}
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
            borderRadius: scrolled ? '12px' : '0',
            backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
            border: `1px solid ${scrolled ? 'rgba(65, 82, 57, 0.08)' : 'transparent'}`,
            boxShadow: scrolled ? '0 4px 20px -6px rgba(65, 82, 57, 0.1)' : 'none',
            height: '64px',
          }}
        >
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
              <img src="/logo.svg" alt="ANDIKA Logo" className="w-8 h-8 transition-transform duration-200 group-hover:scale-105" />
              <span className="font-semibold text-[16px] tracking-tight">
                ANDIKA
                <span style={{ color: T.accent }}>.</span>
              </span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium" style={{ color: T.body }}>
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'FAQs', href: '#faqs' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="nav-link relative py-1 transition-colors duration-150 hover:text-[#30302E]"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Auth */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="hidden lg:block h-4 w-px mr-1" style={{ backgroundColor: T.borderStrong }} />
              <Link href="/login" className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors" style={{ color: T.ink }}>
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white btn-andika-primary"
              >
                Get started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center border transition-colors duration-200"
              style={{
                borderColor: scrolled ? T.border : 'transparent',
                color: T.ink,
                backgroundColor: scrolled ? T.surfaceWarm : 'rgba(65, 82, 57, 0.04)',
              }}
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className="md:hidden overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: mobileMenuOpen ? 340 : 0,
            opacity: mobileMenuOpen ? 1 : 0,
            backgroundColor: '#FFFFFF',
            borderTop: `1px solid ${mobileMenuOpen ? T.border : 'transparent'}`,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <nav className="px-6 py-4 flex flex-col gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'FAQs', href: '#faqs' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg text-[14px] font-medium transition-colors duration-150 hover:bg-gray-50"
                style={{ color: T.body }}
              >
                {link.label}
              </a>
            ))}
            <div className="h-px my-2" style={{ backgroundColor: T.border }} />
            <div className="flex items-center gap-2 pt-1 pb-2">
              <Link href="/login" className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border hover:bg-gray-50 transition-colors text-center" style={{ borderColor: T.border, color: T.ink }}>
                Sign in
              </Link>
              <Link href="/signup" className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg text-white btn-andika-primary text-center">
                Get started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden min-h-[85svh] flex items-center justify-center px-6 max-w-7xl mx-auto pt-32 pb-12">
        {/* Subtle dot grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(65, 82, 57, 0.08) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(circle 600px at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle 600px at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        <div className="relative w-full grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center pt-24 lg:pt-0">
          {/* Left side - Text content */}
          <div className="flex flex-col items-center lg:items-start lg:pl-28 text-center lg:text-left">
            <div className="relative inline-flex items-center gap-2 mb-4 auth-fade-item">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: T.accent }} />
              <p className="text-[12px] font-semibold tracking-widest uppercase" style={{ color: T.accent }}>
                The ultimate typing practice platform.
              </p>
            </div>

            <h1
              className="relative text-[44px] sm:text-[60px] md:text-[72px] font-bold tracking-[-0.03em] leading-[1.05] mb-6 auth-fade-item"
              style={{
                animationDelay: '0.1s',
              }}
              aria-label={`Type ${HERO_TAGLINES[0]}`}
            >
              Type<br />
              <span
                className="relative inline-block"
                style={{ fontWeight: 300, color: T.accent }}
              >
                <span className="invisible" aria-hidden>
                  {HERO_TAGLINES.reduce((a, b) => (b.length > a.length ? b : a))}
                </span>
                <span className="absolute inset-x-0 top-0 whitespace-nowrap" aria-hidden>
                  <HeroTypewriter />
                </span>
              </span>
            </h1>

            <p
              className="relative text-[17px] sm:text-[19px] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6 auth-fade-item"
              style={{ color: T.body, fontWeight: 400, animationDelay: '0.2s' }}
            >
              Improve your typing speed and accuracy with structured lessons, real-time analytics, and multiplayer competitions.
            </p>

            <div className="relative flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 auth-fade-item" style={{ animationDelay: '0.3s' }}>
              <span
                className="relative inline-flex rounded-xl"
                style={{ boxShadow: '0 4px 20px -6px rgba(65, 82, 57, 0.3)' }}
              >
                <Link
                  href="/signup"
                  className="flex items-center gap-2 px-6 py-3 text-base font-semibold rounded-lg text-white btn-andika-primary"
                >
                  Start typing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </span>
            </div>
          </div>

          {/* Right side - Hero GIF (hidden on mobile) */}
          <div className="relative hidden lg:block lg:pr-14 auth-fade-item" style={{ animationDelay: '0.4s' }}>
            {/* Completely integrated GIF with no boundaries */}
            <div
              className="relative overflow-hidden"
              style={{
                /* Seamless gradient that blends with hero background */
                background: 'linear-gradient(135deg, rgba(65, 82, 57, 0.03) 0%, rgba(74, 124, 66, 0.06) 50%, rgba(143, 184, 119, 0.03) 100%)',
                /* No padding, no borders, no rounded corners - completely seamless */
                padding: '0',
                margin: '0',
                borderRadius: '0',
                boxShadow: 'none',
              }}
            >
              {/* Subtle ambient glow that fades into background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(65, 82, 57, 0.08) 0%, transparent 70%)',
                }}
              />
              <img
                src="/Typing.gif"
                alt="ANDIKA typing demonstration"
                className="relative w-full max-w-xl mx-auto"
                style={{
                  maxHeight: '520px',
                  objectFit: 'contain',
                  /* Minimal shadow that doesn't create hard edges */
                  filter: 'drop-shadow(0 2px 8px rgba(65, 82, 57, 0.08))',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══ Features ══ */}
      <section id="features" className="py-28 px-6 max-w-6xl mx-auto scroll-mt-14">
        <Reveal className="text-center mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-4" style={{ color: T.accent }}>Features</p>
          <h2 className="text-[36px] sm:text-[46px] font-bold tracking-[-0.025em] leading-[1.1] max-w-xl mx-auto">
            Everything you need<br />
            <span style={{ fontWeight: 300, color: T.accent }}>to type faster</span>
          </h2>
        </Reveal>

        <Reveal stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="pt-6 border-t" style={{ borderColor: T.hairline }}>
              <div className="flex items-center gap-3 mb-3" style={{ color: T.accent }}>
                {f.icon}
                <h3 className="font-semibold text-[15px] tracking-tight" style={{ color: T.ink }}>{f.title}</h3>
              </div>
              <p className="text-[13px] leading-relaxed font-medium" style={{ color: T.body }}>{f.desc}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ══ Pricing ══ */}
      <section id="pricing" className="py-28 px-6 max-w-4xl mx-auto scroll-mt-14">
        <Reveal className="text-center mb-16">
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-4" style={{ color: T.accent }}>Pricing</p>
          <h2 className="text-[36px] sm:text-[46px] font-bold tracking-[-0.025em] leading-[1.1]">
            Simple, honest pricing
          </h2>
          <p className="text-[15px] mt-4" style={{ color: T.body }}>No hidden fees. Cancel anytime.</p>
        </Reveal>

        <Reveal className="flex justify-center">
          {/* Single Free Plan Card */}
          <div
            className="pricing-card-light rounded-2xl border p-8 sm:p-10 flex flex-col relative overflow-hidden transition-colors duration-200 w-full max-w-lg"
            style={{ backgroundColor: '#F4F0E7', borderColor: T.border, boxShadow: '0 4px 24px rgba(65, 82, 57, 0.06)' }}
          >
            {/* Popular badge */}
            <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: T.accent, color: '#FFFFFF' }}>
              Most popular
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: T.accent }}>Free Plan</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-[52px] sm:text-[60px] font-bold tracking-tight leading-none">$0</span>
              <span className="text-[15px] font-semibold" style={{ color: T.muted }}>/month</span>
            </div>
            <p className="text-[13px] font-medium mb-1" style={{ color: T.body }}>Free forever — no credit card required.</p>
            <p className="text-[12px] font-medium mb-6" style={{ color: T.muted }}>
              Full access to all typing modes, analytics, and competitions.
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                'Unlimited typing practice',
                'All typing modes & languages',
                'Real-time WPM & accuracy tracking',
                'Global leaderboards',
                'Achievements & streaks',
                'Programming code practice',
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] font-medium" style={{ color: T.ink }}>
                  <CheckCircle2 className="w-4 h-4 mt-[1px] shrink-0" style={{ color: T.accent }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-lg text-white btn-andika-primary w-full"
            >
              Get started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ══ FAQs ── */}
      <section id="faqs" className="py-28 px-6 max-w-3xl mx-auto scroll-mt-14">
        <Reveal className="text-center mb-14">
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-4" style={{ color: T.accent }}>FAQs</p>
          <h2 className="text-[36px] sm:text-[46px] font-bold tracking-[-0.025em] leading-[1.1]">
            Questions,<br />
            <span style={{ fontWeight: 300, color: T.accent }}>answered.</span>
          </h2>
        </Reveal>

        <Reveal>
          <div>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="border-b first:border-t" style={{ borderColor: T.hairline }}>
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer group"
                    aria-expanded={open}
                  >
                    <span
                      className="font-semibold text-[15px] tracking-tight transition-colors duration-150 group-hover:text-[#415239]"
                      style={{ color: T.ink }}
                    >
                      {f.q}
                    </span>
                    <span
                      className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-transform duration-300"
                      style={{
                        borderColor: T.hairline,
                        color: T.accent,
                        transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{ maxHeight: open ? 220 : 0, opacity: open ? 1 : 0 }}
                  >
                    <p className="pb-6 pr-12 text-[14px] leading-relaxed font-medium" style={{ color: T.body }}>
                      {f.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ══ CTA Banner ── */}
      <section className="pb-28 px-6 max-w-6xl mx-auto">
        <Reveal>
          <div
            className="relative overflow-hidden rounded-2xl border px-10 py-16 text-center"
            style={{
              backgroundColor: '#F4F0E7',
              borderColor: T.border,
              boxShadow: '0 4px 24px rgba(65, 82, 57, 0.06)',
            }}
          >
            <div
              aria-hidden
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[360px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(ellipse, rgba(65, 82, 57, 0.08) 0%, transparent 70%)' }}
            />

            <div className="relative z-10">
              <h2 className="text-[34px] sm:text-[48px] font-bold tracking-[-0.03em] leading-[1.08] mb-5" style={{ color: T.ink }}>
                Ready to type<br />
                <span style={{ fontWeight: 300, color: T.accent }}>the smart way?</span>
              </h2>
              <p className="text-[15px] font-medium mb-10 max-w-md mx-auto" style={{ color: T.body }}>
                Join thousands of typists improving their speed and accuracy every day.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-lg text-white btn-andika-primary"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ Footer ═─ */}
      <footer className="container mx-auto px-4 py-8 border-t" style={{ borderColor: T.border }}>
        <div className="text-center" style={{ color: T.body }}>
          <p className="text-sm">&copy; 2026 ANDIKA. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
