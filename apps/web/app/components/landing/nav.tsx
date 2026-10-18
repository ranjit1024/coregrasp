"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { CoreGraspLogo } from "../ui/logo"

export default function LandingNav() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center justify-between px-5 lg:px-12 py-4 sticky top-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-[#050505]/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-b border-white/[0.04]"
            : "bg-transparent"
          }`}
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
          <CoreGraspLogo />
          <span className="font-mono text-[20px] md:text-[22px] tracking-tight text-white font-medium">
            Core<span className="text-emerald-400">Grasp</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] text-[#71717a] font-medium uppercase tracking-[0.15em]">
          {[
            { label: "How it works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="no-underline hover:text-white transition-colors duration-300 relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/signin")}
            className="hidden md:block text-[13px] font-semibold px-6 py-2.5 rounded-full bg-white/[0.04] text-white hover:bg-white hover:text-black transition-all duration-300 cursor-pointer backdrop-blur-md border border-white/[0.06] hover:border-white"
          >
            Request Access
          </motion.button>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer border-none bg-transparent"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[5px]" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0 translate-x-2" : ""}`} />
            <span className={`block w-5 h-[1.5px] bg-white transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden flex flex-col gap-5 px-6 py-6 bg-[#050505]/95 backdrop-blur-2xl overflow-hidden sticky top-[65px] z-40 border-b border-white/[0.04]"
          >
            {["How it works", "Features", "Pricing"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setMenuOpen(false)} className="text-[13px] font-medium text-[#71717a] uppercase tracking-widest no-underline hover:text-white transition-colors">
                {l}
              </a>
            ))}
            <button
              onClick={() => { setMenuOpen(false); router.push("/signin"); }}
              className="text-[14px] font-semibold px-4 py-3 mt-2 rounded-full bg-white text-black text-center cursor-pointer hover:bg-white/90 transition-all duration-300"
            >
              Request Access
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
