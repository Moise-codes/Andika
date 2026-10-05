import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../ui/Logo';

interface AuthLayoutProps {
  /** 'login' | 'register' — controls copy in the brand panel */
  variant: 'login' | 'register';
  onNavigateLanding: () => void;
  children: React.ReactNode;
}

const highlights = [
  'AI proposals that win clients',
  'Invoicing on autopilot',
  'Every client in one calm place',
];

/**
 * Professional split-screen auth layout:
 * ┌─────────────────────┬──────────────────┐
 * │  Brand showcase     │   Form panel     │
 * │  (dark, editorial)  │   (light, clean) │
 * └─────────────────────┴──────────────────┘
 * Collapses to a single centered column on mobile.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  variant,
  onNavigateLanding,
  children,
}) => {
  return (
    <div className="h-screen flex relative selection:bg-[#EAEFEF] selection:text-[#1A1A1A]" style={{ background: '#FFFFFF' }}>
      {/* ══ Left — Brand Showcase Panel (hidden below lg) ══ */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[44%] h-full relative overflow-hidden bg-[#F9FAFB] text-gray-900 flex-col p-12 xl:p-16">
        {/* Ambient glows */}
        <div
          aria-hidden
          className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(66, 133, 244, 0.08) 0%, transparent 70%)' }}
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(66, 133, 244, 0.06) 0%, transparent 70%)' }}
        />

        {/* Centered content — Logo + Headline + highlights */}
        <div className="relative z-10 max-w-md flex-1 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5 auth-fade-item mb-8" style={{ animationDelay: '0.05s' }}>
            <button
              onClick={onNavigateLanding}
              className="flex items-center gap-2.5 cursor-pointer group"
              aria-label="Back to LoneZen home"
            >
              <Logo size={36} className="transition-transform duration-200 group-hover:scale-105" />
              <span className="font-semibold text-lg tracking-tight">LoneZen</span>
            </button>
          </div>

          {/* Headline + highlights */}
          <p
            className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-5 auth-fade-item"
            style={{ animationDelay: '0.15s' }}
          >
            {variant === 'login' ? 'Welcome back to your workspace' : 'Start your free workspace'}
          </p>

          <h2
            className="text-[34px] xl:text-[40px] font-bold leading-[1.12] tracking-[-0.025em] mb-8 auth-fade-item"
            style={{ animationDelay: '0.22s' }}
          >
            Run your freelance business{' '}
            <span className="font-light" style={{ color: '#4285F4' }}>efficiently.</span>
          </h2>

          <ul className="space-y-4">
            {highlights.map((h, i) => (
              <li
                key={h}
                className="flex items-center gap-3 auth-fade-item"
                style={{ animationDelay: `${0.34 + i * 0.1}s` }}
              >
                <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#4285F4' }} />
                <span className="text-sm font-medium text-gray-700">{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ══ Right — Form Panel ══ */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Dot grid backdrop - dots at square vertices only */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(66, 133, 244, 0.06) 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(circle 600px at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(circle 600px at 50% 50%, black 40%, transparent 100%)',
          }}
        />

        {/* Mobile top bar */}
        <header className="lg:hidden px-6 py-5 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Logo size={28} rounded="rounded-lg" />
            <span className="font-bold text-base tracking-tight text-gray-900">LoneZen</span>
          </div>
          <button
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
        </header>

        {/* Desktop back link */}
        <div className="hidden lg:flex px-10 xl:px-14 pt-8">
          <button
            onClick={onNavigateLanding}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to LoneZen</span>
          </button>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 sm:py-12 relative z-10">
          <div className="w-full max-w-[420px] auth-panel-form">{children}</div>
        </div>

        {/* Footer */}
        <footer className="pb-7 pt-2 flex items-center justify-center text-[11px] text-gray-500">
          <span>LoneZen Workspace · Your data is securely encrypted</span>
        </footer>
      </main>
    </div>
  );
};