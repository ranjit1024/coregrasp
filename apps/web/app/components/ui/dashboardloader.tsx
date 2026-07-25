"use client"

export const DashboardSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#0A0C10] text-gray-400 p-8 space-y-6 animate-pulse font-sans">
      
      {/* 1. Top Stat Cards Grid (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Policies */}
        <div className="p-5 bg-[#12151C]/60 border border-gray-800/60 rounded-xl space-y-3">
          <div className="h-3 w-24 bg-gray-800 rounded-md" />
          <div className="flex justify-between items-end pt-1">
            <div className="h-8 w-10 bg-gray-800 rounded-md" />
            <div className="h-3 w-24 bg-gray-800/50 rounded-md" />
          </div>
        </div>

        {/* Card 2: Avg. Pass Rate */}
        <div className="p-5 bg-[#12151C]/60 border border-gray-800/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-gray-800 rounded-md" />
            <div className="h-5 w-12 bg-gray-800/60 rounded-md" />
          </div>
          <div className="h-8 w-16 bg-gray-800 rounded-md pt-1" />
        </div>

        {/* Card 3: Pending Quizzes */}
        <div className="p-5 bg-[#12151C]/60 border border-gray-800/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 w-28 bg-gray-800 rounded-md" />
            <div className="h-5 w-12 bg-gray-800/60 rounded-md" />
          </div>
          <div className="h-8 w-14 bg-gray-800 rounded-md pt-1" />
        </div>

        {/* Card 4: High-Risk Gaps */}
        <div className="p-5 bg-[#12151C]/60 border border-gray-800/60 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-3 w-28 bg-gray-800 rounded-md" />
            <div className="h-5 w-8 bg-gray-800/60 rounded-md" />
          </div>
          <div className="h-8 w-8 bg-gray-800 rounded-md pt-1" />
        </div>
      </div>

      {/* 2. Required Actions Section */}
      <div className="bg-[#12151C]/40 border border-gray-800/60 rounded-xl p-6 space-y-4">
        {/* Section Title */}
        <div className="h-4 w-32 bg-gray-800 rounded-md mb-2" />

        {/* Action Card 1 */}
        <div className="p-5 bg-[#161922]/60 border border-gray-800/50 rounded-lg space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-800 rounded-full" />
            <div className="h-4 w-36 bg-gray-800 rounded-md" />
          </div>
          <div className="h-3 w-3/4 bg-gray-800/50 rounded-md" />
          <div className="h-8 w-28 bg-gray-800/80 rounded-md mt-2" />
        </div>

        {/* Action Card 2 */}
        <div className="p-5 bg-[#161922]/60 border border-gray-800/50 rounded-lg space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 bg-gray-800 rounded-full" />
            <div className="h-4 w-32 bg-gray-800 rounded-md" />
          </div>
          <div className="h-3 w-2/3 bg-gray-800/50 rounded-md" />
          <div className="h-8 w-24 bg-gray-800/80 rounded-md mt-2" />
        </div>
      </div>

      {/* 3. Recent Completions Table Section */}
      <div className="bg-[#12151C]/40 border border-gray-800/60 rounded-xl p-6 space-y-4">
        {/* Section Header with Export Button Placeholder */}
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 w-40 bg-gray-800 rounded-md" />
          <div className="h-8 w-24 bg-gray-800/80 rounded-md" />
        </div>

        {/* Table Area */}
        <div className="w-full">
          {/* Column Headers */}
          <div className="flex justify-between items-center py-3 border-b border-gray-800/60 text-xs">
            <div className="h-3 w-20 bg-gray-800/80 rounded-md" />
            <div className="h-3 w-32 bg-gray-800/80 rounded-md" />
            <div className="h-3 w-12 bg-gray-800/80 rounded-md" />
            <div className="h-3 w-14 bg-gray-800/80 rounded-md" />
            <div className="h-3 w-14 bg-gray-800/80 rounded-md" />
          </div>

          {/* Row Item Skeletons */}
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-4 border-b border-gray-800/30 last:border-0"
            >
              {/* Candidate Info */}
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-800 rounded-full flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-44 bg-gray-800 rounded-md" />
                  <div className="h-2.5 w-12 bg-gray-800/50 rounded-md" />
                </div>
              </div>

              {/* Policy Assessed / Date */}
              <div className="h-3 w-56 bg-gray-800/60 rounded-md" />

              {/* Score */}
              <div className="h-4 w-8 bg-gray-800 rounded-md" />

              {/* Status Badge */}
              <div className="h-5 w-12 bg-gray-800/80 rounded-md" />

              {/* Action Link */}
              <div className="h-3 w-10 bg-gray-800/60 rounded-md" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardSkeleton;