import { AttemptStatus } from "@/app/components/ui/dashborad/attemptsStatus";
import { ScoreChart } from "@/app/components/ui/dashborad/scoreChats";
import DashboardSkeleton from "@/app/components/ui/dashborad/dashboardloader";
import { PolicyBreakdown } from "@/app/components/ui/dashborad/policyBreakdown";
import { RecentCandidates } from "@/app/components/ui/dashborad/recentCandidate";
import { StatsCards } from "@/app/components/ui/dashborad/statsCards";
import { getDashboardData } from "@/lib/dashboard";
import { Suspense } from "react";



export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#000000] p-6 text-slate-200">
      <div className="mx-auto max-w-8xl space-y-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </div>
    </div>
  );
}

async function DashboardContent() {
  const result = await getDashboardData();

  if (!result.success) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold text-red-600">
          {result.error === "Unauthorized" ? "Please sign in" : result.error}
        </h2>
      </div>
    );
  }

  const { data } = result;

  return (
    <>
      {/* Subheader */}
      <div className="text-sm text-slate-400">
        {data.stats.totalPolicies} policies · {data.stats.totalCandidates} candidates
      </div>

      {/* Stats Grid */}
      <StatsCards stats={data.stats} />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          <ScoreChart distribution={data.scoreDistribution} />
          <RecentCandidates candidates={data.recentCandidates} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AttemptStatus
            attempted={data.stats.attemptedCount}
            notAttempted={data.stats.notAttemptedCount}
          />
          <PolicyBreakdown policies={data.candidatesByPolicy} />
        </div>
      </div>
    </>
  );
}