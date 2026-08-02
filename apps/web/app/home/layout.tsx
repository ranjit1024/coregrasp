"use client"

import Link from "next/link";
import { CoreGraspLogo } from "../components/ui/logo";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, usePathname } from "next/navigation";
import { 
  BarChart3, 
  LayoutDashboard, 
  ShieldCheck, 
  Users,
  LogOut,
  Settings,
  User as UserIcon,
  ChevronUp
} from "lucide-react";

import { useSession } from "@/lib/auth-client"; // Adjust based on your auth client
// import { authClient } from "@/lib/auth-client"; // If you need this for signout

export default function RootLayout({children}:{children:React.ReactNode}){
  const router = useRouter();
  const pathname = usePathname();
  
  // User & Menu State
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      // Replace with your actual sign out method from Better Auth
      // await authClient.signOut();
      
      // Redirect to sign in page
      router.push("/signin");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  const workspaceItems = [
    { name: "Overview", href: "/home/dashboard", icon: LayoutDashboard },
    { name: "Policies & Quizzes", href: "/home/policies", icon: ShieldCheck },
    { name: "Candidates", href: "/home/candidates", icon: Users },
    { name: "Analytics", href: "/home/analytics", icon: BarChart3, disabled: true, badge: "Soon" },
  ];
  
  const settingsItems = [
    { name: "Integrations", href: "/home/settings/integrations" },
    { name: "Organization", href: "/home/settings/organization" },
    { name: "Billing", href: "/home/settings/billing" },
  ];

  // Helper function to get user initials
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      className="flex h-screen w-full bg-[#09090B] text-[#FAFAFA] antialiased selection:bg-emerald-500/30 overflow-hidden font-sans"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>

      {/* ── SIDEBAR (static, no re-render on route change) ── */}
      <aside className="w-[250px] flex-shrink-0 bg-[#09090B] border-r border-white/[0.08] hidden md:flex flex-col z-20 relative">
        <div
          onClick={() => router.push("/home/dashboard")}
          className="h-[68px] px-5 flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="transition-transform duration-300 ease-out group-hover:scale-105">
            <CoreGraspLogo />
          </div>
          <span className="text-[16px] font-bold tracking-tight text-white mt-0.5">
            CoreGrasp
          </span>
        </div>

        <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
          <div className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mb-2 px-2">
            Workspace
          </div>

          {workspaceItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.disabled ? "#" : item.href}
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? "bg-zinc-800/50 text-zinc-100" 
                    : item.disabled
                      ? "text-zinc-600 cursor-not-allowed" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 active:scale-[0.98]" 
                  }
                `}
                onClick={(e) => item.disabled && e.preventDefault()}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className={`w-4 h-4 ${isActive ? "text-zinc-100" : item.disabled ? "text-zinc-700" : "text-zinc-500"}`} 
                    strokeWidth={isActive ? 2.5 : 2} 
                  />
                  {item.name}
                </div>

                {item.badge && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-zinc-800/80 text-zinc-500 px-1.5 py-0.5 rounded">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="text-[11px] font-semibold text-[#71717A] uppercase tracking-wider mt-8 mb-2 px-2">
            Settings
          </div>
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors duration-200 relative group text-left ${
                  isActive
                    ? "text-white bg-[#18181B]"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-0.5 h-4 bg-emerald-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                {item.name}
              </button>
            )
          })}
        </nav>

        {/* ── ACTUAL USER PROFILE SECTION WITH POPUP ── */}
        <div className="relative mx-3 mb-3" ref={userMenuRef}>
          
          {/* Popup Menu */}
          <AnimatePresence>
            {isUserMenuOpen && !isPending && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-[#18181B] border border-white/[0.08] rounded-xl shadow-xl overflow-hidden py-1.5 z-50 origin-bottom"
              >
                {/* User Info Header in Menu */}
                <div className="px-3 py-2 border-b border-white/[0.04] mb-1">
                  <div className="text-[12px] font-medium text-white truncate">
                    {user?.name || "Unknown User"}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {user?.email || "No email available"}
                  </div>
                </div>

                <div className="px-1.5 flex flex-col gap-0.5">
                  <button onClick={()=>router.push('/home/profile')} className="w-full text-left px-2 py-1.5 rounded-md text-[12px] font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-2.5">
                    <UserIcon className="w-3.5 h-3.5 text-zinc-400" /> 
                    Profile
                  </button>
                  <button 
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push("/home/settings/organization");
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-md text-[12px] font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-2.5"
                  >
                    <Settings className="w-3.5 h-3.5 text-zinc-400" /> 
                    Settings
                  </button>
                </div>
                
                <div className="mt-1 px-1.5 pt-1 border-t border-white/[0.04]">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-2 py-1.5 rounded-md text-[12px] font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors flex items-center gap-2.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> 
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Button */}
          {isPending ? (
            // Loading Skeleton
            <div className="p-3 border border-white/[0.04] rounded-lg bg-[#0E0E11] flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded bg-white/[0.05] shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="h-3 w-2/3 bg-white/[0.05] rounded" />
                <div className="h-2.5 w-1/2 bg-white/[0.05] rounded" />
              </div>
            </div>
          ) : (
            // Loaded User Profile Trigger
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`w-full text-left p-3 border rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
                isUserMenuOpen 
                  ? "bg-[#18181B] border-white/[0.14]" 
                  : "bg-[#0E0E11] border-white/[0.08] hover:bg-[#18181B] hover:border-white/[0.14]"
              }`}
            >
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || "User avatar"} 
                  className="w-8 h-8 rounded object-cover shadow-sm shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-[12px] font-semibold shadow-sm shadow-emerald-900/40 shrink-0">
                  {getInitials(user?.name)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-white truncate leading-tight">
                  {user?.name || "Unknown User"}
                </div>
                <div className="text-[11px] text-[#71717A] truncate mt-0.5">
                  {user?.email || "No email available"}
                </div>
              </div>
              
              <ChevronUp 
                className={`w-4 h-4 text-[#71717A] shrink-0 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} 
              />
            </button>
          )}
        </div>
      </aside>

      <div className="w-full h-full overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div>
            <header className="h-[68px] w-full px-8 border-b border-white/[0.08] flex items-center justify-between bg-[#09090B]/90 backdrop-blur-md z-10 sticky top-0">
              
              {/* Left side - Breadcrumb/Title */}
              <div className="text-[14px] font-medium text-zinc-400 capitalize">
                {pathname.split("/")[2] || "Home"}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                
                {/* Notification Bell */}
                <button 
                  aria-label="Notifications"
                  className="relative w-8 h-8 rounded-md flex items-center justify-center text-[#A1A1AA] hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-all"
                >
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-[#09090B]" />
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>

                {/* Primary Action Button */}
                <button
                  onClick={() => router.push("/home/upload")}
                  className="bg-white text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 font-medium text-[13px] px-4 py-1.5 rounded-md transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Policy
                </button>

              </div>
            </header>
            
            {children}
            
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}