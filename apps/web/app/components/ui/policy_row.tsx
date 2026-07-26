import { PolicyDocument, statusConfig } from "@/lib/types";
import { PolicyStatus } from "@revisly/db";

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


const FileIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
    </svg>
);
export function PolicyRow({ policy, onClick }: { policy: PolicyDocument; onClick: () => void }) {
    const cfg = statusConfig[policy.status];

    return (
        <div
            onClick={onClick}
            className="grid grid-cols-[1fr_140px_120px] items-center px-5 py-3.5 border-b border-[#16181d] last:border-b-0 cursor-pointer transition-all duration-150 hover:bg-[#16181d] group"
        >
            {/* Document info */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div className={`w-9 h-9 rounded-[10px] ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center flex-shrink-0`}>
                    <FileIcon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-200 tracking-tight truncate group-hover:text-white transition-colors">
                        {policy.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-medium text-zinc-500 bg-[#1c1e22] px-2 py-0.5 rounded border border-zinc-800">
                            {policy.category}
                        </span>
                       
                    </div>
                </div>
            </div>

            {/* Status */}
            <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${cfg.badgeBg} ${cfg.badgeBorder} ${cfg.badgeText}`}>
                    <span className={`w-[5px] h-[5px] rounded-full ${cfg.dotColor} ${status === "PROCESSING" ? "animate-pulse" : ""}`} />
                    {policy.status}
                </span>
            </div>

            {/* Date + Chevron */}
            <div className="flex items-center justify-end gap-2">
                <span className="text-xs text-zinc-600 font-medium">{formatDate(policy.createdAt)}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-700 group-hover:text-zinc-400 group-hover:bg-[#1c1e22] transition-all">
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                </div>
            </div>
        </div>
    );
}
