import { CoreGraspLogo } from "../ui/logo"

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.04] px-6 lg:px-8 py-12 md:py-16 bg-[#050505] relative z-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
                <CoreGraspLogo />
              </div>
              <span className="font-display text-lg md:text-xl tracking-tight text-white font-medium">
                Core<span className="text-emerald-400">Grasp</span>
              </span>
            </div>
            <p className="text-[11px] md:text-[12px] text-[#52525b] leading-relaxed font-mono pr-4">
              Systematic extraction and compliance verification protocol for distributed org charts.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-2 md:mb-3">Product</span>
            <a href="#how-it-works" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">How it Works</a>
            <a href="#features" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Features</a>
            <a href="#pricing" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Pricing</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-2 md:mb-3">Company</span>
            <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Changelog</a>
            <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Engineering Blog</a>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white mb-2 md:mb-3">Legal</span>
            <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Privacy</a>
            <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">Terms</a>
            <a href="#" className="text-[12px] md:text-[13px] text-[#52525b] hover:text-white transition-colors font-light">SOC 2 Report</a>
          </div>
        </div>
        <div className="pt-6 md:pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[10px] md:text-[11px] font-mono text-[#3f3f46]">
            &copy; {new Date().getFullYear()} COREGRASP INC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] md:text-[10px] font-mono text-[#52525b] uppercase">Systems Nominal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
