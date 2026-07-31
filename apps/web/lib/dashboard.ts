"use server";

import prisma from "@/lib/prisma";
import { auth } from "./auth";
import { headers } from "next/headers";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";

// ─── Types matching YOUR schema ───────────────────────
export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
  stats: {
    totalPolicies: number;
    totalCandidates: number;
    attemptedCount: number;
    notAttemptedCount: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
  };
  recentCandidates: RecentCandidate[];
  policies: PolicySummary[];
  candidatesByPolicy: CandidatesByPolicy[];
  scoreDistribution: ScoreDistribution[];
}

interface RecentCandidate {
  id: string;
  email: string;
  score: number;
  attempted: boolean;
  policyName: string;
  policyCategory: string | null;
}

interface PolicySummary {
  id: string;
  name: string;
  status: string;
  category: string | null;
  candidateCount: number;
  avgScore: number;
  url: string | null;
}

interface CandidatesByPolicy {
  policyId: string;
  policyName: string;
  total: number;
  attempted: number;
  notAttempted: number;
  avgScore: number;
}

interface ScoreDistribution {
  range: string;
  count: number;
}

// ─── Auth Helper ───────────────────────────────────────
async function getAuthedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    throw new Error("UNAUTHORIZED");
  }

  return session.user as { id: string; name: string; email: string; image?: string | null };
}

// ─── Cached Data Fetcher ───────────────────────────────
const getUserWithData = unstable_cache(
  async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: {
        policies: {
          include: {
            candidates: true, // Include candidates per policy
          },
          orderBy: { createdAt: "desc" },
        },
        candidate: {
          // YOUR schema uses singular 'candidate' here
          orderBy: { score: "desc" },
          include: {
            policy: {
              select: {
                id: true,
                name: true,
                category: true,
              },
            },
          },
        },
      },
    });
  },
  ["dashboard-data"],
  { revalidate: 60, tags: ["dashboard"] }
);

// ─── Main Dashboard Action ─────────────────────────────
export async function getDashboardData(): Promise<
  { success: true; data: DashboardData } | { success: false; error: string }
> {
  try {
    const sessionUser = await getAuthedUser();
    const user = await getUserWithData(sessionUser.email);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // ── Aggregate Stats ───────────────────────────────
    const allCandidates = user.candidate || []; // YOUR field name is 'candidate'
    const allPolicies = user.policies || [];

    const attempted = allCandidates.filter((c) => c.attempt);
    const notAttempted = allCandidates.filter((c) => !c.attempt);

    const scores = allCandidates.map((c) => c.score);
    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    // ── Policy Summaries ──────────────────────────────
    const policySummaries: PolicySummary[] = allPolicies.map((policy) => {
      const cands = policy.candidates || [];
      const cScores = cands.map((c) => c.score);
      const cAvg = cScores.length > 0
        ? Math.round(cScores.reduce((a, b) => a + b, 0) / cScores.length)
        : 0;

      return {
        id: policy.id,
        name: policy.name,
        status: policy.status,
        category: policy.category,
        candidateCount: cands.length,
        avgScore: cAvg,
        url: policy.url,
      };
    });

    // ── Candidates by Policy ──────────────────────────
    const candidatesByPolicy: CandidatesByPolicy[] = allPolicies.map((policy) => {
      const cands = policy.candidates || [];
      return {
        policyId: policy.id,
        policyName: policy.name,
        total: cands.length,
        attempted: cands.filter((c) => c.attempt).length,
        notAttempted: cands.filter((c) => !c.attempt).length,
        avgScore: cands.length > 0
          ? Math.round(cands.reduce((acc, c) => acc + c.score, 0) / cands.length)
          : 0,
      };
    });

    // ── Score Distribution ────────────────────────────
    const distribution: ScoreDistribution[] = [
      { range: "90-100", count: allCandidates.filter((c) => c.score >= 90).length },
      { range: "80-89", count: allCandidates.filter((c) => c.score >= 80 && c.score < 90).length },
      { range: "70-79", count: allCandidates.filter((c) => c.score >= 70 && c.score < 80).length },
      { range: "60-69", count: allCandidates.filter((c) => c.score >= 60 && c.score < 70).length },
      { range: "50-59", count: allCandidates.filter((c) => c.score >= 50 && c.score < 60).length },
      { range: "0-49", count: allCandidates.filter((c) => c.score < 50).length },
    ];

    // ── Recent Candidates (top 10 by score) ───────────
    const recentCandidates: RecentCandidate[] = allCandidates.slice(0, 10).map((c) => ({
      id: c.id,
      email: c.email,
      score: c.score,
      attempted: c.attempt,
      policyName: c.policy?.name || "Unknown",
      policyCategory: c.policy?.category || null,
    }));

    const data: DashboardData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
      },
      stats: {
        totalPolicies: allPolicies.length,
        totalCandidates: allCandidates.length,
        attemptedCount: attempted.length,
        notAttemptedCount: notAttempted.length,
        averageScore: avgScore,
        highestScore,
        lowestScore,
      },
      recentCandidates,
      policies: policySummaries,
      candidatesByPolicy,
      scoreDistribution: distribution,
    };

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Unauthorized" };
    }
    console.error("Dashboard error:", error);
    return { success: false, error: "Failed to load dashboard" };
  }
}
