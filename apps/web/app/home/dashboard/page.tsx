import { AttemptStatus } from "@/app/components/ui/dashborad/ attemptsStatus";
import { ScoreChart } from "@/app/components/ui/dashborad/ scoreChats";
import DashboardSkeleton from "@/app/components/ui/dashborad/dashboardloader";
import { PolicyBreakdown } from "@/app/components/ui/dashborad/policyBreakdown";
import { RecentCandidates } from "@/app/components/ui/dashborad/recentCandidate";
import { StatsCards } from "@/app/components/ui/dashborad/statsCards";
import { getDashboardData } from "@/lib/dashboard";
import { Suspense } from "react";




export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
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
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-red-800">
          {result.error === "Unauthorized" ? "Please sign in" : result.error}
        </h2>
      </div>
    );
  }

  const { data } = result;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {data.user.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-gray-500">
            {data.stats.totalPolicies} policies · {data.stats.totalCandidates} candidates
          </p>
        </div>
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