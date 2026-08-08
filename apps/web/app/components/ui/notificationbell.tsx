"use client";

import { useState, useRef, useEffect, JSX } from "react";
import { useNotifications } from "../hooks/notification";
import { getuserId } from "@/lib/userId";

export interface AppNotification {
  id: string;
  type: "QUIZ_COMPLETED" | "PDF_PROCESSED" | "INVITE_ACCEPTED" | string;
  createdAt: string;
  read: boolean;
}

const notificationConfig: Record<string, { label: string; icon: JSX.Element; colorClass: string }> = {
  QUIZ_COMPLETED: {
    label: "Quiz completed",
    colorClass: "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20",
    icon: <CheckCircleIcon className="h-4 w-4" />,
  },
  PDF_PROCESSED: {
    label: "Document processed",
    colorClass: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
    icon: <DocumentIcon className="h-4 w-4" />,
  },
  INVITE_ACCEPTED: {
    label: "Invite accepted",
    colorClass: "bg-purple-500/10 text-purple-500 ring-purple-500/20",
    icon: <UserPlusIcon className="h-4 w-4" />,
  },
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string>();
  
      useEffect(() => {
          async function loadEmail() {
              try {
                  const result = await getuserId();
                  if (result?.id) setUserId(result.id);
              } catch (error) {
                  console.error("Failed to fetch user ID:", error);
              }
          }
          loadEmail();
      }, []);

  const { notifications, unreadCount, markRead } = useNotifications(`wss://api.ranjitdas2048.workers.dev/notifications/ws?userId=${userId}`)

  // Mark all as read handler (mock implementation)
  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    notifications.forEach((n: AppNotification) => !n.read && markRead(n.id));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with press animation (active:scale-95) */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-white/10 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 active:scale-95"
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#09090B]">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div 
          className="absolute right-0 z-50 mt-2 w-[340px] origin-top-right overflow-hidden rounded-xl border border-zinc-800 bg-[#09090B]/95 shadow-[0_16px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/50 bg-zinc-900/20 px-4 py-3 pb-3 pt-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="flex h-5 items-center justify-center rounded-full bg-zinc-800 px-2 text-[10px] font-medium text-zinc-300">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List with Custom Dark Scrollbar */}
          <div className="max-h-[380px] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-800">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900/50 ring-1 ring-white/5">
                  <BellIcon className="h-6 w-6 text-zinc-600" />
                </div>
                <p className="text-sm font-medium text-zinc-200">You're all caught up</p>
                <p className="mt-1 text-xs text-zinc-500">No new notifications right now.</p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-800/50">
                {notifications.map((n: AppNotification) => {
                  const config = notificationConfig[n.type] || {
                    label: n.type,
                    colorClass: "bg-zinc-800 text-zinc-300 ring-zinc-700",
                    icon: <BellIcon className="h-4 w-4" />
                  };

                  return (
                    <li key={n.id}>
                      <button
                        onClick={() => markRead(n.id)}
                        className={`group relative flex w-full items-start gap-3 px-4 py-3.5 text-left transition-all hover:bg-white/[0.03] focus-visible:bg-white/[0.03] focus-visible:outline-none ${
                          !n.read ? "bg-white/[0.01]" : ""
                        }`}
                      >
                        {/* Unread Left Border Accent */}
                        {!n.read && (
                          <div className="absolute left-0 top-0 h-full w-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        )}

                        {/* Icon Container */}
                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ${config.colorClass}`}>
                          {config.icon}
                        </div>

                        {/* Content */}
                        <div className="flex w-full flex-col gap-1">
                          <div className="flex w-full items-start justify-between gap-2">
                            <span className={`text-sm ${!n.read ? "font-medium text-zinc-100" : "text-zinc-300"}`}>
                              {config.label}
                            </span>
                            <span className="shrink-0 text-[10px] font-medium text-zinc-500">
                              {timeAgo(n.createdAt)}
                            </span>
                          </div>
                          
                          {/* Optional context text could go here in the future */}
                          {!n.read && (
                            <span className="text-xs text-zinc-400">Click to view details</span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Icons
function BellIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function CheckCircleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DocumentIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function UserPlusIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );
}