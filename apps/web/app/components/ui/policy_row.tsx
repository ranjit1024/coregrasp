import { PolicyDocument, statusConfig } from "@/lib/types";
import { FileText, ChevronRight } from "lucide-react";

// Formatting utility kept clean and safe
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
    policy: PolicyDocument; // Changed from PolicyWithCandidates for better reusability
    onClick?: () => void;   // Made optional so it doesn't crash if the parent handles the click
}

export function PolicyRow({ policy, onClick }: PolicyRowProps) {
    const cfg = statusConfig[policy.status];

    return (
        <div
            onClick={onClick}
            role={onClick ? "button" : "listitem"}
            tabIndex={onClick ? 0 : -1}
            className={`
                grid grid-cols-[1fr_auto_auto] sm:grid-cols-[1fr_140px_120px] items-center px-5 py-3.5 
                border-b border-white/5 last:border-b-0 group transition-all duration-200
                ${onClick ? "cursor-pointer hover:bg-zinc-900/40 active:bg-zinc-900/60" : ""}
            `}
        >
            {/* Document info */}
            <div className="flex items-center gap-3.5 min-w-0 pr-4">
                <div className={`w-9 h-9 rounded-xl ${cfg.iconBg} border border-white/5 flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <FileText className={`w-4 h-4 ${cfg.iconColor}`} strokeWidth={2} />
                </div>
                
                <div className="min-w-0 flex flex-col justify-center">
                    <h4 className="text-sm font-medium text-zinc-300 tracking-tight truncate group-hover:text-zinc-100 transition-colors">
                        {policy.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">
                            {policy.category}
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Badge */}
            <div className="hidden sm:flex items-center">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText} shadow-sm`}>
                    <span className={`relative flex h-1.5 w-1.5`}>
                        {policy.status === "PROCESSING" && (
                            <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.dotColor} opacity-50 animate-ping`} />
                        )}
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dotColor}`} />
                    </span>
                    {policy.status}
                </span>
            </div>

            {/* Date + Action Chevron */}
            <div className="flex items-center justify-end gap-3">
                <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">
                    {formatDate(policy.createdAt)}
                </span>
                
                {/* Only show the chevron if the row is actually clickable */}
                {onClick && (
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 group-hover:text-zinc-300 group-hover:bg-zinc-800/50 transition-all duration-200">
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                )}
            </div>
        </div>
    );
}