
export type PolicyStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";

export interface PolicyDocument {
    id: string;
    name: string;
    scope: string;
    createdAt: string;
    status: PolicyStatus;
    url: string;
    category:string;
}


export const statusConfig: Record<
    PolicyStatus,
    {
        label: string;
        name: string;
        desc: string;
        dotColor: string;
        glowColor: string;
        borderColor: string;
        badgeBg: string;
        badgeBorder: string;
        badgeText: string;
        iconBg: string;
        iconColor: string;
    }
> = {
    PENDING: {
        label: "Pending",
        name: "Awaiting Review",
        desc: "Queued for compliance legal sign-off",
        dotColor: "bg-amber-500",
        glowColor: "shadow-amber-500/30",
        borderColor: "border-amber-500/20",
        badgeBg: "bg-amber-500/10",
        badgeBorder: "border-amber-500/15",
        badgeText: "text-amber-400",
        iconBg: "bg-amber-500/[0.08]",
        iconColor: "text-amber-500",
    },
    PROCESSING: {
        label: "Processing",
        name: "Parsing & Syncing",
        desc: "Extracting clauses & legal vectors",
        dotColor: "bg-blue-500",
        glowColor: "shadow-blue-500/30",
        borderColor: "border-blue-500/20",
        badgeBg: "bg-blue-500/10",
        badgeBorder: "border-blue-500/15",
        badgeText: "text-blue-400",
        iconBg: "bg-blue-500/[0.08]",
        iconColor: "text-blue-500",
    },
    READY: {
        label: "Ready",
        name: "Active & Enforced",
        desc: "Deployed to employee feeds",
        dotColor: "bg-emerald-500",
        glowColor: "shadow-emerald-500/30",
        borderColor: "border-emerald-500/20",
        badgeBg: "bg-emerald-500/10",
        badgeBorder: "border-emerald-500/15",
        badgeText: "text-emerald-400",
        iconBg: "bg-emerald-500/[0.08]",
        iconColor: "text-emerald-500",
    },
    FAILED: {
        label: "Failed",
        name: "Validation Errors",
        desc: "Failed integrity or format checks",
        dotColor: "bg-red-500",
        glowColor: "shadow-red-500/30",
        borderColor: "border-red-500/20",
        badgeBg: "bg-red-500/10",
        badgeBorder: "border-red-500/15",
        badgeText: "text-red-400",
        iconBg: "bg-red-500/[0.08]",
        iconColor: "text-red-500",
    },
};