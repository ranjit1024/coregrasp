import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const WideEvaluationDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        // Small delay so it doesn't pop the instant a single pixel enters view
        delayChildren: 0.2 
      },
    }
  } as const

  const fadeSlide = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  } as const

  const popIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: "backOut" } 
    }
  } as const

  return (
    <div className="flex items-center justify-center font-sans text-neutral-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        // once: true ensures it doesn't re-animate every time you scroll up/down
        // amount: 0.2 means trigger when 20% of the component is visible
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-[1500px] max-md:p-2 w-full bg-neutral-100 rounded-[2rem] max-md:rounded-lg  p-8 md:p-12 border border-neutral-700/50 overflow-hidden"
      >

        {/* Top Text Content - Full Width */}
        <motion.div variants={fadeSlide} className="mb-12 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-gray-900 mb-4">
            Per Candidate Score Evaluation
          </h2>
          <p className="text-base text-neutral-400 leading-relaxed">
            Provides a comprehensive breakdown of candidate scores over time. Analyze trends across general and operational guidelines, and pinpoint specific areas for growth.
          </p>
        </motion.div>

        {/* Horizontal Data Flow Section */}
        <div className="relative flex flex-col xl:flex-row items-center justify-between gap-8 xl:gap-12 w-full z-10">

          {/* Horizontal Connecting Line (Desktop Only) */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] hidden xl:block bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-y-1/2 z-0 pointer-events-none" />

          {/* Chart 1: Candidate Performance */}
          <motion.div variants={fadeSlide} className="flex-1 w-full bg-neutral-950/50 rounded-3xl p-6 border border-neutral-800 z-10 backdrop-blur-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-sm font-semibold text-neutral-200 mb-1">Candidate Performance - General</h4>
                <p className="text-xs text-neutral-200 max-w-[220px]">Understanding core guidelines like personal conduct and data privacy.</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-medium text-neutral-400">
                <Calendar size={12} />
                May '24 - Dec '24
              </div>
            </div>
            <div className="flex-1 mt-auto">
              <DarkAreaChart
                data="M 0 40 Q 50 45 100 42 T 200 35 T 300 45 T 400 40 L 400 100 L 0 100 Z"
                line="M 0 40 Q 50 45 100 42 T 200 35 T 300 45 T 400 40"
                score="97"
                dotX={250} dotY={38}
              />
            </div>
          </motion.div>

          {/* Center Hub */}
          <motion.div variants={popIn} className="w-56 h-56 shrink-0 bg-neutral-900 rounded-full border border-neutral-700/50 flex flex-col items-center justify-center z-10 relative">
            <div className="absolute inset-2 rounded-full border border-dashed border-neutral-600/30 animate-[spin_60s_linear_infinite]" />
            <span className="text-[4.5rem] leading-none font-bold text-white tracking-tighter mb-1">94</span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Overall Score</span>
            <span className="text-[10px] text-neutral-500 mt-2">Updated: Oct 12, 2026</span>
          </motion.div>

          {/* Chart 2: Operational Performance */}
          <motion.div variants={fadeSlide} className="flex-1 w-full bg-neutral-950/50 rounded-3xl p-6 border border-neutral-800 z-10 backdrop-blur-sm flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h4 className="text-sm font-semibold text-neutral-200 mb-1">Operational Performance</h4>
                <p className="text-xs text-neutral-50 max-w-[220px]">Evaluation for IT usage protocols and workplace safety standards.</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 w-fit bg-neutral-900 border border-neutral-800 rounded-lg text-[10px] font-medium text-neutral-400">
                <Calendar size={12} />
                May '24 - Dec '24
              </div>
            </div>
            <div className="flex-1 mt-auto">
              <DarkAreaChart
                data="M 0 80 Q 80 75 120 60 T 200 40 T 300 30 T 400 15 L 400 100 L 0 100 Z"
                line="M 0 80 Q 80 75 120 60 T 200 40 T 300 30 T 400 15"
                score="92"
                dotX={180} dotY={44}
              />
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};

// Dark Mode SVG Chart Component remains the same as provided
const DarkAreaChart = ({ data, line, score, dotX, dotY }: any) => (
  <div className="relative w-full h-36">
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
      <div className="border-t border-neutral-700 w-full h-0" />
      <div className="border-t border-neutral-700 w-full h-0" />
      <div className="border-t border-neutral-700 w-full h-0" />
      <div className="border-t border-neutral-700 w-full h-0" />
    </div>

    <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="orangeDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <path d={data} fill="url(#orangeDark)" />
      <path d={line} fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      <g transform={`translate(${dotX}, ${dotY})`}>
        <circle cx="0" cy="0" r="4.5" fill="#171717" stroke="#ea580c" strokeWidth="2.5" />
        <rect x="-40" y="-32" width="80" height="22" rx="6" fill="#171717" stroke="#262626" />
        <text x="0" y="-17" fontSize="10" fontWeight="600" fill="#e5e5e5" textAnchor="middle">
          Score: {score}
        </text>
      </g>
    </svg>

    <div className="absolute -bottom-7 left-0 right-0 flex justify-between text-[10px] font-medium text-neutral-500 px-1">
      <span>Jan</span>
      <span>Mar</span>
      <span>May</span>
      <span>Sep</span>
      <span>Dec</span>
    </div>
  </div>
);

export default WideEvaluationDashboard;