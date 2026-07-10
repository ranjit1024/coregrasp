"use client"
import { ConsoleIcon } from "@hugeicons/core-free-icons";
import { useSession } from "../../../lib/auth-client";
import React, { useEffect, useState } from 'react';

type PolicyStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

interface PolicyDocument {
  id: string;
  name: string;
  scope: string;
  createdAt: string;
  status: PolicyStatus;
}

// Helper to format dates professionally
const formatDate = (dateString: string) => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
};

export default function PolicyStatusPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPolicies() {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://api.ranjitdas2048.workers.dev/result?userId=${session.user.id}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch policies (Status: ${res.status})`);
        }

        const data = await res.json();
        
        if (isMounted) {
          // Assuming the API returns the array inside 'userName' based on original code
          setPolicies(data.userName || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    if (!isSessionPending) {
      fetchPolicies();
    }

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted components
    };
  }, [session?.user?.id, isSessionPending]);

  // Aggregate policy statuses
  const statusCounts = policies.reduce(
    (acc, policy) => {
      acc[policy.status] = (acc[policy.status] || 0) + 1;
      return acc;
    },
    { PENDING: 0, PROCESSING: 0, READY: 0, FAILED: 0 } as Record<PolicyStatus, number>
  );

  const totalPolicies = policies.length;

  const metricCards = [
    {
      id: 'PENDING',
      label: 'Awaiting Review',
      count: statusCounts.PENDING,
      accentColor: 'text-amber-400',
      glowBg: 'bg-amber-400/5',
      borderColor: 'border-amber-500/20',
      desc: 'Queued for compliance legal sign-off',
    },
    {
      id: 'PROCESSING',
      label: 'Parsing & Syncing',
      count: statusCounts.PROCESSING,
      accentColor: 'text-blue-400',
      glowBg: 'bg-blue-400/5',
      borderColor: 'border-blue-500/20',
      desc: 'Extracting clauses & active legal vectors',
      isProcessing: true,
    },
    {
      id: 'READY',
      label: 'Active & Enforced',
      count: statusCounts.READY,
      accentColor: 'text-[#00E680]', // CoreGrasp Mint Green
      glowBg: 'bg-[#00E680]/5',
      borderColor: 'border-[#00E680]/20',
      desc: 'Successfully deployed to employee feeds',
    },
    {
      id: 'FAILED',
      label: 'Validation Errors',
      count: statusCounts.FAILED,
      accentColor: 'text-rose-500',
      glowBg: 'bg-rose-500/5',
      borderColor: 'border-rose-500/20',
      desc: 'Failed legal integrity or format checks',
    },
  ];

  const getBadgeStyles = (status: PolicyStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'PROCESSING': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'READY': return 'bg-[#00E680]/10 text-[#00E680] border-[#00E680]/20';
      case 'FAILED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  if (isSessionPending) {
    return (
      <div className="min-h-screen bg-[#090A0C] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#00E680] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0C] text-neutral-200 antialiased font-sans p-6 md:p-12">
      <div className="w-full max-w-8xl mx-auto">
        
        {/* Breadcrumb Context */}
        <nav aria-label="Breadcrumb" className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase mb-2">
          Workspace / Policies & Quizzes
        </nav>
        
        {/* Header Block */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Policy Compliance Registry</h1>
            <p className="text-xs md:text-sm text-neutral-400 mt-1">
              Live tracking status of company documentation, compliance frameworks, and active updates.
            </p>
          </div>
          
          <div className="bg-[#121316] border border-[#22252A] rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-400' : 'bg-[#00E680] animate-pulse'}`} />
            <span className="text-xs text-neutral-400 font-medium">Total Tracked Policies:</span>
            <span className="text-sm font-bold text-white">{totalPolicies}</span>
          </div>
        </header>

        {/* Top Summary Metrics Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metricCards.map((item) => (
            <div 
              key={item.id} 
              className={`bg-[#121316] border ${item.borderColor} rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:border-neutral-600 shadow-sm`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    {item.id}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full ${item.glowBg} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.accentColor.split(' ')[0]} ${item.isProcessing ? 'animate-pulse' : ''}`} />
                  </div>
                </div>
                <div className="text-4xl font-bold tracking-tight text-white mb-1">
                  {item.count}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1C1E22]">
                <h3 className="text-xs font-semibold text-neutral-300">{item.label}</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm">
            <strong>Error loading policies:</strong> {error}
          </div>
        )}

        {/* Policy Document Feed Stack */}
        <section className="space-y-4">
          <header className="px-1">
            <h2 className="text-sm font-bold text-white">Document Processing Logs</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Granular breakdown of structural compliance checking sequences.</p>
          </header>

          <div className="space-y-2.5">
            {isLoading ? (
               <div className="text-center py-10 border border-dashed border-[#22252A] rounded-xl text-neutral-500 text-sm">
                 Syncing secure documents...
               </div>
            ) : policies.length === 0 && !error ? (
               <div className="text-center py-10 border border-dashed border-[#22252A] rounded-xl text-neutral-500 text-sm">
                 No policies found in the registry.
               </div>
            ) : (
              policies.map((policy) => (
                <article 
                  key={policy.id} 
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#121316] border border-[#1B1D22] hover:border-[#2C3039] rounded-xl gap-4 transition-all duration-200"
                >
                  {/* Left Block: Icon Indicator + Core Description */}
                  <div className="flex items-start gap-4">
                    
                    {/* Compliance Status Ring Icon */}
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                      policy.status === 'READY' ? 'border-[#00E680]/20 bg-[#00E680]/5' :
                      policy.status === 'PROCESSING' ? 'border-blue-500/20 bg-blue-500/5' :
                      policy.status === 'PENDING' ? 'border-amber-500/20 bg-amber-500/5' :
                      'border-rose-500/20 bg-rose-500/5'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        policy.status === 'READY' ? 'bg-[#00E680]' :
                        policy.status === 'PROCESSING' ? 'bg-blue-400 animate-pulse' :
                        policy.status === 'PENDING' ? 'bg-amber-400' :
                        'bg-rose-500'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-[#00E680] transition-colors">
                          {policy.name}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-500 bg-[#16181D] px-1.5 py-0.5 rounded border border-[#22252A]">
                          {policy.id}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{policy.scope}</p>
                    </div>
                  </div>

                  {/* Right Block: Status Pillar Indicators */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 border-[#1B1D22] pt-3 sm:pt-0">
                    <div className="flex flex-col sm:items-end text-left sm:text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wide ${getBadgeStyles(policy.status)}`}>
                        {policy.status}
                      </span>
                      <span className="text-[11px] text-neutral-500 mt-1.5">
                        Created {formatDate(policy.createdAt)}
                      </span>
                    </div>

                    {/* Standard Interactive Chevron Button */}
                    <button 
                      aria-label="View Details"
                      className="p-2 bg-[#16181D] group-hover:bg-[#1E2127] border border-[#22252A] rounded-lg text-neutral-500 group-hover:text-white transition-colors hidden sm:block focus:outline-none focus:ring-2 focus:ring-[#00E680]/50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}