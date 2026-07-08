"use client"
import { CoreGraspLogo } from "../components/ui/logo";
import React from "react";
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation";

export default function RootLayout({children}:{children:React.ReactNode}){
  const router = useRouter();
  const pathname = usePathname(); // Tracks current route dynamically

  // 1. Define your navigation configurations with matching URL segments
  const workspaceItems = [
    { name: "Overview", href: "/home/dashboard" },
    { name: "Policies & Quizzes", href: "/home/policies" },
    { name: "Directory & Teams", href: "/home/directory" },
    { name: "Analytics", href: "/home/analytics" },
  ];

  const settingsItems = [
    { name: "Integrations", href: "/home/settings/integrations" },
    { name: "Organization", href: "/home/settings/organization" },
    { name: "Billing", href: "/home/settings/billing" },
  ];

  return (
    <div 
      className="flex h-screen w-full bg-[#09090B] text-[#FAFAFA] antialiased selection:bg-emerald-500/30 overflow-hidden font-sans"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght=400;500;600;700&display=swap');
        /* Refined minimalist scrollbar */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="w-[250px] flex-shrink-0 bg-[#09090B] border-r border-white/[0.08] hidden md:flex flex-col z-20">
        
        {/* Logo Area */}
        <div onClick={() => router.push("/home/dashboard")} className="h-[68px] px-5 flex items-center gap-2.5 cursor-pointer">
          <CoreGraspLogo />
          <span className="text-[16px] font-bold tracking-tight text-white mt-0.5">
            CoreGrasp
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
          <div className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2 px-2">Workspace</div>
          
          {workspaceItems.map((item) => {
            // Evaluates active state directly using the browser pathname
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors relative group ${
                  isActive ? "text-white bg-[#18181B]" : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-0.5 h-4 bg-emerald-500 rounded-r-full" />
                )}
                {item.name}
              </button>
            )
          })}

          <div className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mt-8 mb-2 px-2">Settings</div>
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors text-left ${
                  isActive ? "text-white bg-[#18181B]" : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {item.name}
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 mb-2 mx-3 border border-white/[0.08] rounded-lg bg-[#0E0E11] hover:bg-[#18181B] transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-[12px] font-semibold">
              SJ
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-medium text-white truncate leading-tight">Sarah Jenkins</div>
              <div className="text-[11px] text-[#71717A] truncate mt-0.5">Acme Corp</div>
            </div>
            <svg className="w-4 h-4 text-[#71717A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA (Includes scrolling fix) ── */}
      <div className="w-full h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}