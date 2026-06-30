import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, BookOpen, MonitorSmartphone, HeartPulse, Award, ChevronRight } from 'lucide-react';

const candidates = [
  {
    id: 1,
    name: "Elena Rostova",
    role: "Senior Backend Engineer",
    overall: 88,
    metrics: { privacy: 92, conduct: 85, it: 80, safety: 95 }
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Systems Architect",
    overall: 97, 
    metrics: { privacy: 98, conduct: 99, it: 94, safety: 97 }
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "DevOps Lead",
    overall: 91,
    metrics: { privacy: 95, conduct: 88, it: 92, safety: 89 }
  }
];

const DashboardWidgetLight = () => {
  const [selectedId, setSelectedId] = useState(2); 
  
  const selectedCandidate = candidates.find(c => c.id === selectedId);
  const otherCandidates = candidates.filter(c => c.id !== selectedId);

  // Viewport animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="w-full h-full bg-white rounded-xl border border-slate-200 p-5 flex flex-col font-sans text-slate-900 shadow-sm"
    >
      
      {/* Widget Header */}
      <motion.div variants={itemVariants} className="mb-5 flex justify-between items-end">
        <div>
          <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 mb-0.5">
            Policy Alignment Matrix
          </h2>
          <p className="text-xs text-slate-500">Comparing top candidates for organizational fit.</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4 flex-1">
        
        {/* Featured / Selected Candidate Panel */}
        <motion.div variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedCandidate?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-linear-330 to-[FF6D24] from-orange-50 rounded-xl border border-orange-200/40 p-4 md:p-5 flex flex-col md:flex-row gap-5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[50px] rounded-full pointer-events-none" />

              {/* Left: Score & Identity */}
              <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-3 md:w-36 shrink-0 z-10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mb-1.5 flex items-center gap-1">
                    <Award size={12} /> Selected Fit
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedCandidate?.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedCandidate?.role}</p>
                </div>

                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-orange-200 bg-orange-50 flex flex-col items-center justify-center">
                  <span className="text-3xl md:text-4xl font-bold tracking-tighter text-orange-600">
                    {selectedCandidate?.overall}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">Score</span>
                </div>
              </div>

              {/* Right: Detailed Metrics Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 z-10">
                <DetailedMetric icon={<ShieldCheck size={16}/>} label="Data Privacy" value={selectedCandidate?.metrics.privacy} />
                <DetailedMetric icon={<BookOpen size={16}/>} label="Conduct" value={selectedCandidate?.metrics.conduct} />
                <DetailedMetric icon={<MonitorSmartphone size={16}/>} label="IT Policy" value={selectedCandidate?.metrics.it} />
                <DetailedMetric icon={<HeartPulse size={16}/>} label="Safety" value={selectedCandidate?.metrics.safety} />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Runner-Ups Selection Row */}
        <motion.div variants={itemVariants} className="mt-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
            Compare other candidates
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherCandidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setSelectedId(candidate.id)}
                className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-left shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 group-hover:border-orange-300 group-hover:bg-orange-50 transition-colors">
                    <span className="font-bold text-sm text-slate-700 group-hover:text-orange-600">{candidate.overall}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">{candidate.name}</h4>
                    <p className="text-[11px] text-slate-500">{candidate.role}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

const DetailedMetric = ({ icon, label, value }: any) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <span className="text-orange-500">{icon}</span>
          {label}
        </div>
        <span className="text-slate-900 font-bold">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
        />
      </div>
    </div>
  );
};

export default DashboardWidgetLight;