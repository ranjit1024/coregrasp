import { AttemptStatus } from "@/app/components/ui/dashborad/attemptsStatus";
import { ScoreChart } from "@/app/components/ui/dashborad/scoreChats";
import DashboardSkeleton from "@/app/components/ui/dashborad/dashboardloader";
import { PolicyBreakdown } from "@/app/components/ui/dashborad/policyBreakdown";
import { RecentCandidates } from "@/app/components/ui/dashborad/recentCandidate";
import { StatsCards } from "@/app/components/ui/dashborad/statsCards";
import { getDashboardData } from "@/lib/dashboard";
import { Suspense } from "react";
import Link from "next/link";
import { Plus, LayoutDashboard, AlertCircle, Sparkles } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-300 font-sans selection:bg-white/20 pb-20 relative">
      {/* Ambient lighting effects */}
      <div className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent z-50 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-8xl mx-auto p-6 md:p-10 w-full flex flex-col gap-8 relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-zinc-400 mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[13px] font-medium tracking-wide uppercase">Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
            Overview
          </h1>
          <p className="text-[14px] text-zinc-500 max-w-2xl leading-relaxed">
            High-level metrics and performance analytics across all your active policy assessments.
          </p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}

async function DashboardContent() {
  const result = await getDashboardData();

  // ─── ERROR STATE ──────────────────────────────────────────────────────────
  if (!result.success) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[60vh] w-full px-6 rounded-2xl border border-rose-500/10 bg-rose-500/[0.02] text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-rose-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
        
        <div className="bg-rose-500/10 p-4 rounded-full mb-5 ring-1 ring-rose-500/20">
          <AlertCircle className="w-8 h-8 text-rose-400" />
        </div>
        <h2 className="text-xl font-semibold text-rose-200 mb-2">
          {result.error === "Unauthorized" ? "Authentication Required" : "Failed to load dashboard"}
        </h2>
        <p className="text-[14px] text-rose-400/70 max-w-md leading-relaxed">
          {result.error === "Unauthorized" 
            ? "Please sign in to your workspace to view analytics and candidate performance." 
            : result.error}
        </p>
      </div>
    );
  }

  const { data } = result;

  // ─── FULL PAGE EMPTY STATE ────────────────────────────────────────────────
  if (data.stats.totalPolicies === 0) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-[65vh] w-full px-4 text-center rounded-2xl border border-white/[0.04] bg-[#121214]/40 overflow-hidden backdrop-blur-sm">
        {/* Subtle center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-b from-white/[0.08] to-transparent border border-white/[0.08] rounded-2xl mb-6 shadow-2xl">
            <Sparkles className="w-7 h-7 text-zinc-300" strokeWidth={1.5} />
          </div>
          
          <h3 className="text-2xl font-semibold text-zinc-100 mb-3 tracking-tight">
            Welcome to your Dashboard
          </h3>
          <p className="text-[14px] text-zinc-500 max-w-[420px] mb-8 leading-relaxed">
            Your workspace is ready. Get started by creating your first policy assessment. Once deployed, candidate engagement and scores will appear here.
          </p>
          
          <Link
            href="/home/policies/new"
            className="group relative flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-white text-zinc-900 text-[14px] font-semibold rounded-xl transition-all shadow-[0_0_40px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_12px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            Create First Assessment
          </Link>
        </div>
      </div>
    );
  }

  // ─── MAIN DASHBOARD CONTENT ───────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
      
      {/* Stats Grid */}
      <StatsCards stats={data.stats} />

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Wider for Charts) */}
        <div className="space-y-6 lg:col-span-2">
          <ScoreChart distribution={data.scoreDistribution} />
          <RecentCandidates candidates={data.recentCandidates} />
        </div>

        {/* Right Column (Narrower for Breakdowns) */}
        <div className="space-y-6">
          <AttemptStatus
            attempted={data.stats.attemptedCount}
            notAttempted={data.stats.notAttemptedCount}
          />
          <PolicyBreakdown policies={data.candidatesByPolicy} />
        </div>
      </div>
    </div>
  );
}