"use client"

import RadialFeatures from "./components/ui/feture"
import HowItWorks from "./components/ui/steps"
import LandingNav from "./components/landing/nav"
import LandingHero from "./components/landing/hero"
import DashboardMockup from "./components/landing/dashboard-mockup"
import SampleQuestion from "./components/landing/sample-question"
import LandingCta from "./components/landing/cta"
import LandingFooter from "./components/landing/footer"
import AmbientBackground from "./components/landing/ambient-background"

export default function Home() {
  return (
    <div
      className="flex flex-col min-h-screen overflow-x-hidden bg-[#050505] text-[#fafafa] antialiased selection:bg-emerald-500/30 selection:text-emerald-50"
      style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", fontSize: 16, lineHeight: 1.6 }}
    >
      {/* ── Global Styles & Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        .font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }
      `}</style>

      <AmbientBackground />
      <LandingNav />
      <LandingHero />

      {/* ═══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 py-16 md:py-24 lg:py-32">
        <HowItWorks />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          DASHBOARD MOCKUP
          ═══════════════════════════════════════════════════════════════════════ */}
      <DashboardMockup />

      {/* ═══════════════════════════════════════════════════════════════════════
          BENTO GRID FEATURES
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative z-10 py-16 md:py-24 lg:py-32">
        <RadialFeatures />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SAMPLE QUESTION
          ═══════════════════════════════════════════════════════════════════════ */}
      <SampleQuestion />

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════════════════════════ */}
      <LandingCta />

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
      <LandingFooter />
    </div>
  )
}
