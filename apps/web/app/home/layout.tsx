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
  ChevronUp,
  Menu,
  X
} from "lucide-react";

import { useSession } from "@/lib/auth-client"; // Adjust based on your auth client
import { useNotifications } from "../components/hooks/notification";
import { NotificationBell } from "../components/ui/notificationbell";
// import { authClient } from "@/lib/auth-client"; // If you need this for signout

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // User & Menu State
  const { data: session, isPending } = useSession();
  const { notifications, unreadCount } = useNotifications(
    `wss://api.ranjitdas2048.workers.dev/notifications/ws`
  );

  const user = session?.user;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile sidebar state
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      // await authClient.signOut();
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

      {/* ── MOBILE OVERLAY ── */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-100 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-100 w-[250px] flex-shrink-0 bg-[#09090B] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-[68px] px-5 flex items-center justify-between">
          <div
            onClick={() => router.push("/home/dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="transition-transform duration-300 ease-out group-hover:scale-105">
              <CoreGraspLogo />
            </div>
            <span className="text-[16px] font-bold tracking-tight text-white mt-0.5">
              CoreGrasp
            </span>
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto">
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
                  <button onClick={() => { setIsUserMenuOpen(false); router.push('/home/profile'); }} className="w-full text-left px-2 py-1.5 rounded-md text-[12px] font-medium text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-2.5">
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
              className={`w-full text-left p-3 border rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${isUserMenuOpen
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

      <div className="flex-1 w-full  h-full overflow-y-auto relative flex flex-col min-w-0 ">
        <AnimatePresence mode="wait">
          <motion.div className="flex flex-col min-h-full">
            <header className="h-[100px] w-full px-4 md:px-8 py-3 border-b border-white/[0.08] flex items-center justify-between bg-[#09090B]/90 backdrop-blur-md z-100 sticky top-0">

    
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden text-zinc-400 hover:text-white transition-colors p-1"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="text-[14px] font-medium text-zinc-400 capitalize truncate max-w-[120px] sm:max-w-none">
                  {pathname.split("/")[2] || "Home"}
                </div>
              </div>

              
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">


                <NotificationBell/>

            
                <button
                  onClick={() => router.push("/home/upload")}
                  className="bg-white text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 font-medium text-[13px] px-3 py-1.5 sm:px-4 rounded-md transition-all flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B] shrink-0"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="hidden sm:inline">New Policy</span>
                </button>

              </div>
            </header>

            <main className="flex-1">
              {children}
            </main>

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
