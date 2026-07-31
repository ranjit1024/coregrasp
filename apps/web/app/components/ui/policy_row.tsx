"use client";

import { PolicyDocument, statusConfig } from "@/lib/types";
import { FileText, ChevronRight, Users } from "lucide-react";
import { useState } from "react";

const formatDate = (dateString: string) => {
    try {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(new Date(dateString));
    } catch {
        return dateString;
    }
};

interface PolicyRowProps {
    policy: PolicyDocument;
    candidateCount?: number;
    onClick?: () => void;   
    showHeader?: boolean;
}

export function PolicyRow({ policy, candidateCount, onClick, showHeader }: PolicyRowProps) {
    const [isPressed, setIsPressed] = useState(false);
    const cfg = statusConfig[policy.status];
    const isClickable = !!onClick;

    if (showHeader) {
        return (
            <div className="hidden sm:grid grid-cols-[1fr_128px_100px_120px_48px] items-center px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.01]">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest pl-14">Policy</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center">Status</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-center">Candidates</span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest text-right pr-4">Created</span>
                <span />
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            onMouseDown={() => isClickable && setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            role={isClickable ? "button" : "listitem"}
            tabIndex={isClickable ? 0 : -1}
            onKeyDown={(e) => {
                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            className={`
                group relative grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_128px_100px_120px_48px] 
                items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3.5 
                border-b border-white/[0.03] last:border-b-0
                transition-all duration-300 ease-out
                ${isClickable 
                    ? "cursor-pointer hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/10 focus-visible:bg-white/[0.02]" 
                    : ""
                }
                ${isPressed ? "scale-[0.995] bg-white/[0.03]" : "scale-100"}
            `}
        >
            {/* Hover edge glow */}
            {isClickable && (
                <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            {/* Document info */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div 
                    className={`
                        relative w-10 h-10 rounded-xl ${cfg.iconBg} 
                        border border-white/[0.06] flex items-center justify-center flex-shrink-0
                        shadow-[0_1px_2px_rgba(0,0,0,0.2)] 
                        group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)]
                        group-hover:border-white/[0.1]
                        transition-all duration-300 ease-out
                        ${isPressed ? "scale-95" : "scale-100"}
                    `}
                >
                    <FileText 
                        className={`w-[18px] h-[18px] ${cfg.iconColor} transition-transform duration-300 group-hover:scale-105`} 
                        strokeWidth={1.5} 
                    />
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                        {policy.status === "PROCESSING" && (
                            <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.dotColor} opacity-40 animate-ping`} />
                        )}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 border-2 border-zinc-950 ${cfg.dotColor}`} />
                    </span>
                </div>
                
                <div className="min-w-0 flex flex-col justify-center gap-1">
                    <h4 className="text-[13px] font-medium text-zinc-300 tracking-tight truncate group-hover:text-zinc-100 transition-colors duration-200">
                        {policy.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-zinc-500 bg-white/[0.03] px-2 py-[3px] rounded-md border border-white/[0.05] uppercase tracking-widest w-fit">
                        {policy.category}
                    </span>
                </div>
            </div>

            {/* Status Badge */}
            <div className="hidden sm:flex items-center justify-center">
                <span 
                    className={`
                        inline-flex items-center gap-2 px-3 py-[5px] rounded-lg 
                        text-[10px] font-bold uppercase tracking-widest 
                        border ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}
                        shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.03)]
                        transition-all duration-300
                        group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]
                    `}
                >
                    <span className="relative flex h-[5px] w-[5px]">
                        {policy.status === "PROCESSING" && (
                            <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.dotColor} opacity-60 animate-ping`} />
                        )}
                        <span className={`relative inline-flex rounded-full h-[5px] w-[5px] ${cfg.dotColor}`} />
                    </span>
                    {policy.status}
                </span>
            </div>

            {/* Candidate Count */}
            <div className="hidden sm:flex items-center justify-center">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <Users className="w-3.5 h-3.5" />
                    <span className="tabular-nums">{candidateCount ?? 0}</span>
                </div>
            </div>

            {/* Date */}
            <div className="hidden sm:flex items-center justify-end">
                <span className="text-[11px] text-zinc-600 font-medium tabular-nums group-hover:text-zinc-500 transition-colors duration-200 pr-4">
                    {formatDate(policy.createdAt)}
                </span>
            </div>

            {/* Chevron */}
            <div className="flex items-center justify-end">
                {isClickable && (
                    <div 
                        className={`
                            w-7 h-7 rounded-lg flex items-center justify-center 
                            text-zinc-700 border border-transparent
                            group-hover:text-zinc-300 group-hover:bg-white/[0.06] group-hover:border-white/[0.08]
                            transition-all duration-200 ease-out
                            ${isPressed ? "scale-90 bg-white/[0.08]" : "scale-100"}
                        `}
                    >
                        <ChevronRight 
                            className="w-4 h-4 transition-transform duration-200 ease-out group-hover:translate-x-[2px]" 
                            strokeWidth={2}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}