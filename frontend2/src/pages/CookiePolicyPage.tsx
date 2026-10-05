/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StaticPageLayout } from './StaticPageLayout';

export const CookiePolicyPage: React.FC = () => (
  <StaticPageLayout
    eyebrow="Legal"
    title="Cookie Policy"
    subtitle="Last updated: January 2025. We keep cookies minimal — only what's needed to keep you signed in and remember your preferences."
  >
    <section className="mb-10">
      <h2 className="text-[18px] font-semibold tracking-tight mb-3">What are cookies?</h2>
      <p className="text-[14px] leading-relaxed" style={{ color: '#6B7280' }}>
        Cookies are small text files stored by your browser. They allow websites to remember your
        actions and preferences over time.
      </p>
    </section>

    <section className="mb-10">
      <h2 className="text-[18px] font-semibold tracking-tight mb-3">Cookies we use</h2>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#E2E7F1', backgroundColor: '#FFFFFF' }}>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr style={{ backgroundColor: '#F9FBFF' }}>
              <th className="px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>Name</th>
              <th className="px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>Purpose</th>
              <th className="px-4 py-3 font-semibold" style={{ color: '#1A1A1A' }}>Duration</th>
            </tr>
          </thead>
          <tbody style={{ color: '#6B7280' }}>
            <tr className="border-t" style={{ borderColor: '#E2E7F1' }}>
              <td className="px-4 py-3 font-mono text-[12px]">lonezen_token</td>
              <td className="px-4 py-3">Keeps you signed in to your workspace</td>
              <td className="px-4 py-3">Until sign-out</td>
            </tr>
            <tr className="border-t" style={{ borderColor: '#E2E7F1' }}>
              <td className="px-4 py-3 font-mono text-[12px]">lonezen_user</td>
              <td className="px-4 py-3">Remembers your profile between visits</td>
              <td className="px-4 py-3">Until sign-out</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section className="mb-4">
      <h2 className="text-[18px] font-semibold tracking-tight mb-3">Managing cookies</h2>
      <p className="text-[14px] leading-relaxed" style={{ color: '#6B7280' }}>
        You can clear or block cookies in your browser settings. Note that blocking essential
        cookies will prevent you from staying signed in to LoneZen. No advertising or analytics
        trackers are used.
      </p>
    </section>
  </StaticPageLayout>
);