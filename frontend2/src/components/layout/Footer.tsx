/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Logo } from '../ui/Logo';

const T = {
  dark: '#1E3A8A',
  darkCard: '#1E40AF',
  darkBorder: 'rgba(255, 255, 255, 0.12)',
  accentSoft: '#FFFFFF',
  accentLight: '#DBEAFE',
};

interface FooterProps {
  onLogin?: () => void;
  onRegister?: () => void;
}

const productLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQs', href: '/#faqs' },
];

const legalLinks = [
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Cookie Policy', to: '/cookies' },
];

const resourceLinks = [
  { label: 'Sign in', to: '/login' },
  { label: 'Create account', to: '/register' },
];

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: T.dark }}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.15) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-8">
        {/* ── Top: brand + link columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b" style={{ borderColor: T.darkBorder }}>
          {/* Brand */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <Logo size={28} rounded="rounded-lg" className="transition-transform duration-200 group-hover:scale-105" />
              <span className="font-semibold text-[15px] tracking-tight text-white">LoneZen</span>
            </Link>
            <p className="text-[13px] leading-relaxed font-medium text-white/80 max-w-xs mb-6">
              The all-in-one workspace for independent professionals — clients, projects,
              invoices, and AI proposals in one beautifully crafted place.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2">
              {[
                { icon: <Twitter className="w-3.5 h-3.5" />, label: 'Twitter', href: 'https://x.com/alphamnzr' },
                { icon: <Github className="w-3.5 h-3.5" />, label: 'GitHub', href: 'https://github.com/Alpha-Dev001' },
                { icon: <Linkedin className="w-3.5 h-3.5" />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/munezero-alpha-735a9839b/' },
                { icon: <Mail className="w-3.5 h-3.5" />, label: 'Email', href: 'mailto:alphamnzr@gmail.com' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.label !== 'Email' ? '_blank' : undefined}
                  rel={s.label !== 'Email' ? 'noopener noreferrer' : undefined}
                  aria-label={s.label}
                  title={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/15 transition-all duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-white">
                Product
              </h4>
              <ul className="space-y-2.5">
                {productLinks.map(l => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-150"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-4 text-white">
                Legal & Account
              </h4>
              <ul className="space-y-2.5">
                {legalLinks.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                {resourceLinks.map(l => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[13px] font-medium text-white/90 hover:text-white transition-colors duration-150"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/35 order-2 sm:order-1">
            © {new Date().getFullYear()} LoneZen, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5 order-1 sm:order-2">
            <Link to="/terms" className="text-[12px] text-white/40 hover:text-white/80 transition-colors">Terms</Link>
            <Link to="/privacy" className="text-[12px] text-white/40 hover:text-white/80 transition-colors">Privacy</Link>
            <Link to="/cookies" className="text-[12px] text-white/40 hover:text-white/80 transition-colors">Cookies</Link>
            <span className="text-white/20">·</span>
            <span className="text-[12px] text-white/30">Made for freelancers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};