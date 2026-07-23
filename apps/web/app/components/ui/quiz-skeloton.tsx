import React from 'react';

export default function QuizReviewSkeleton() {
  // Array to render multiple skeleton cards (e.g., 2 cards)
  const skeletonCards = Array.from({ length: 2 });

  return (
    <div className="min-h-screen bg-[#09090b] p-8 font-sans antialiased">
      <div className="max-w-full  mx-auto">
        
        {/* --- Header Skeleton --- */}
        <div className="flex justify-between items-start mb-10 animate-pulse">
          <div className="space-y-3">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-28 bg-gray-800 rounded-md"></div>
              <div className="h-4 w-32 bg-gray-800 rounded-md"></div>
            </div>
            {/* Title skeleton */}
            <div className="h-8 w-72 bg-gray-800 rounded-md mt-2"></div>
          </div>
          {/* Button skeleton */}
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>

        {/* --- Cards Container --- */}
        <div className="space-y-6">
          {skeletonCards.map((_, index) => (
            <div 
              key={index} 
              className="bg-[#121214] border border-gray-800/80 rounded-xl p-6 shadow-md animate-pulse"
            >
              {/* Card Header Skeleton */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 w-full pr-8">
                  {/* "Q" Badge */}
                  <div className="h-7 w-7 bg-gray-800 rounded-md shrink-0"></div>
                  {/* Question Text (2 lines) */}
                  <div className="space-y-2 w-full mt-1">
                    <div className="h-5 w-3/4 bg-gray-800 rounded-md"></div>
                    <div className="h-5 w-1/2 bg-gray-800 rounded-md"></div>
                  </div>
                </div>
                {/* Large Number (01) */}
                <div className="h-12 w-16 bg-gray-800/40 rounded-md shrink-0"></div>
              </div>

              {/* Options Skeleton */}
              <div className="space-y-2 mb-6">
                {/* Simulating 4 options */}
                {Array.from({ length: 4 }).map((_, optIndex) => (
                  <div 
                    key={optIndex} 
                    className="w-full flex items-center px-4 h-12 rounded-lg bg-[#18181b] border border-gray-800/60"
                  >
                    {/* Option Letter Circle */}
                    <div className="h-6 w-6 bg-gray-800 rounded-full mr-4 shrink-0"></div>
                    {/* Option Text Line */}
                    <div className={`h-4 bg-gray-800 rounded-md ${optIndex % 2 === 0 ? 'w-1/2' : 'w-1/3'}`}></div>
                  </div>
                ))}
              </div>

              {/* Insight & Explanation Skeleton */}
              <div className="pt-5 border-t border-indigo-900/30 flex items-start gap-3 pl-1">
                {/* Icon */}
                <div className="h-5 w-5 bg-indigo-900/50 rounded-full shrink-0 mt-0.5"></div>
                <div className="space-y-3 w-full mt-1">
                  {/* Insight Title */}
                  <div className="h-3 w-40 bg-indigo-900/50 rounded-md"></div>
                  {/* Insight Description text block */}
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-full bg-gray-800 rounded-md"></div>
                    <div className="h-4 w-4/5 bg-gray-800 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}