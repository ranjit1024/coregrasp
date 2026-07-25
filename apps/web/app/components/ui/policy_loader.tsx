import React from "react";

export const Skleton_policy_Loader = () => {
  return (
    <div className="w-full min-h-screen bg-[#0A0C10] text-gray-400 p-8 space-y-8 animate-pulse font-sans">
      
      {/* 1. Header Section Skeleton */}
      <div className="space-y-3">
        {/* Breadcrumb */}
        <div className="h-3 w-32 bg-gray-800 rounded-md" />
        {/* Main Title */}
        <div className="h-8 w-80 bg-gray-800 rounded-md" />
        {/* Subtitle */}
        <div className="h-4 w-1/3 bg-gray-800/60 rounded-md" />
      </div>

      {/* 2. Metrics Cards Grid (4 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 bg-[#12151C]/60 border border-gray-800/60 rounded-xl space-y-4"
          >
            {/* Top row: Label & Status Dot Indicator */}
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-gray-800 rounded-md" />
              <div className="h-2.5 w-2.5 bg-gray-800 rounded-full" />
            </div>

            {/* Big Stat Number */}
            <div className="h-9 w-12 bg-gray-800 rounded-lg" />

            {/* Label & Description */}
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-28 bg-gray-800 rounded-md" />
              <div className="h-3 w-40 bg-gray-800/50 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Document Processing Logs Section */}
      <div className="space-y-4 pt-4">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="h-5 w-56 bg-gray-800 rounded-md" />
          <div className="h-3.5 w-80 bg-gray-800/50 rounded-md" />
        </div>

        {/* Table Container */}
        <div className="bg-[#12151C]/40 border border-gray-800/60 rounded-xl overflow-hidden divide-y divide-gray-800/40">
          
          {/* Table Column Headers */}
          <div className="flex justify-between items-center px-6 py-3 bg-[#12151C]/80">
            <div className="h-3 w-24 bg-gray-800/80 rounded-md" />
            <div className="flex space-x-20">
              <div className="h-3 w-16 bg-gray-800/80 rounded-md" />
              <div className="h-3 w-20 bg-gray-800/80 rounded-md" />
            </div>
          </div>

          {/* Table Rows */}
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center px-6 py-4"
            >
              {/* Left Column: Icon + File Name + Tag */}
              <div className="flex items-center space-x-4">
                {/* File Icon Box */}
                <div className="h-10 w-10 bg-gray-800/80 rounded-lg flex-shrink-0" />
                <div className="space-y-2">
                  {/* File Name */}
                  <div className="h-4 w-36 bg-gray-800 rounded-md" />
                  {/* Category Tag (Shown on some rows) */}
                  {index >= 2 && (
                    <div className="h-4 w-20 bg-gray-800/50 rounded-md" />
                  )}
                </div>
              </div>

              {/* Right Columns: Status Pill & Date */}
              <div className="flex items-center space-x-12">
                {/* Status Badge */}
                <div className="h-6 w-20 bg-gray-800 rounded-full" />
                {/* Date & Chevron */}
                <div className="flex items-center space-x-3">
                  <div className="h-3.5 w-24 bg-gray-800/70 rounded-md" />
                  <div className="h-4 w-2 bg-gray-800/50 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Skleton_policy_Loader;