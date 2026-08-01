"use client";

import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const features = [

  {
    size: "default",
    gradient: "from-amber-500/[0.08] via-transparent to-transparent",
    icon: "📊",
    title: "Live Analytics",
    desc: "Real-time event streaming with 99.99% uptime SLA.",
    tags: ["Real-time"],
    visual: (
      <div className="h-20 flex items-end gap-1.5 px-1">
        {[45,72,38,89,56,94,67,82,45,78,62,88].map((h,i) => (
          <div key={i} className="flex-1 bg-gradient-to-t from-amber-500/20 to-amber-400/5 rounded-t-sm transition-all duration-700 group-hover:from-amber-500/30" style={{ height: `${h}%` }} />
        ))}
      </div>
    )
  },
  {
    size: "tall",
    gradient: "from-emerald-500/[0.08] via-transparent to-transparent",
    icon: "🔒",
    title: "Zero-Trust Vault",
    desc: "End-to-end encryption with hardware-backed key management. SOC2 Type II and GDPR compliant by default.",
    tags: ["Encrypted", "Compliant"],
    visual: (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-6">
        <div className="relative w-16 h-20">
          <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-xl transform rotate-6" />
          <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-xl transform -rotate-3 bg-emerald-500/5 backdrop-blur-sm flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400/60">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
        <div className="flex gap-1">
          {[0,1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-400/40" style={{ animationDelay: `${i*0.15}s` }} />)}
        </div>
      </div>
    )
  },
  {
    size: "wide",
    gradient: "from-rose-500/[0.08] via-transparent to-transparent",
    icon: "🌐",
    title: "Global Mesh Network",
    desc: "Intelligent traffic routing across 6 continents with automatic failover. Your data never travels more than 100ms from your users.",
    tags: ["CDN", "Edge", "Mesh"],
    visual: (
      <div className="relative h-24 w-full">
        <svg viewBox="0 0 400 100" className="w-full h-full" fill="none">
          <path d="M50,50 Q100,20 150,50 T250,50 T350,50" stroke="rgba(244,63,94,0.12)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
          <path d="M50,50 Q100,80 150,50 T250,50 T350,50" stroke="rgba(244,63,94,0.08)" strokeWidth="1" fill="none" strokeDasharray="3 3" />
          {[
            {x:50,y:50}, {x:150,y:50}, {x:250,y:50}, {x:350,y:50},
            {x:100,y:30}, {x:200,y:70}, {x:300,y:25}
          ].map((n,i) => (
            <g key={i}>
              <line x1="200" y1="50" x2={n.x} y2={n.y} stroke="rgba(244,63,94,0.08)" strokeWidth="0.5" />
              <circle cx={n.x} cy={n.y} r="3" fill="rgba(244,63,94,0.2)" />
              <circle cx={n.x} cy={n.y} r="6" stroke="rgba(244,63,94,0.1)" strokeWidth="1" fill="none" className="animate-ping" style={{ animationDuration: '3s', animationDelay: `${i*0.4}s` }} />
            </g>
          ))}
        </svg>
      </div>
    )
  },
  {
    size: "wide",
    gradient: "from-orange-500/[0.08] via-transparent to-transparent",
    icon: "🚀",
    title: "One-Click Deploy",
    desc: "From commit to production in under 90 seconds. Blue-green deployments with instant rollback and zero-downtime guarantees.",
    tags: ["CI/CD", "GitOps"],
    visual: (
      <div className="flex items-center gap-3 h-20 px-2">
        {[
          { label: "Build", done: true },
          { label: "Test", done: true },
          { label: "Stage", active: true },
          { label: "Prod", done: false }
        ].map((step,i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 relative">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-500 ${
              step.done ? 'bg-orange-500/20 border-orange-500/40 text-orange-300' :
              step.active ? 'bg-orange-500/30 border-orange-400 text-orange-200 shadow-[0_0_12px_rgba(251,146,60,0.2)]' :
              'bg-white/[0.03] border-white/[0.08] text-white/20'
            }`}>
              {step.done ? '✓' : i+1}
            </div>
            <span className={`text-[9px] uppercase tracking-wider font-medium ${step.done || step.active ? 'text-white/50' : 'text-white/20'}`}>{step.label}</span>
            {i < 3 && <div className="absolute top-4 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-orange-500/20 to-transparent" />}
          </div>
        ))}
      </div>
    )
  },
  {
    size: "default",
    gradient: "from-cyan-500/[0.08] via-transparent to-transparent",
    icon: "🔄",
    title: "Auto-Healing",
    desc: "Self-diagnosing infrastructure that repairs anomalies before they impact users.",
    tags: ["AI-Ops"],
    visual: (
      <div className="flex items-center justify-center h-20">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-2 border-2 border-dashed border-cyan-500/25 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400/60 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
          </div>
        </div>
      </div>
    )
  },
  {
    size: "large",
    gradient: "from-violet-500/[0.08] via-transparent to-transparent",
    icon: "🔮",
    title: "Predictive AI",
    desc: "Forecast demand spikes 24 hours in advance with 96.4% accuracy using our proprietary time-series models.",
    tags: ["ML", "Forecast"],
    visual: (
      <div className="h-24 w-full flex items-end px-2">
        <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="p1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0,70 C20,68 40,55 60,58 C80,61 100,35 120,38 C140,41 160,20 180,22 C190,23 195,15 200,12 L200,80 L0,80 Z" fill="url(#p1)" />
          <path d="M0,70 C20,68 40,55 60,58 C80,61 100,35 120,38 C140,41 160,20 180,22 C190,23 195,15 200,12" stroke="#8b5cf6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="200" cy="12" r="3" fill="#8b5cf6" className="animate-pulse" />
        </svg>
      </div>
    )
  },
  {
    size: "full",
    gradient: "from-indigo-500/[0.08] via-transparent to-transparent",
    icon: "🎯",
    title: "Unified Control Plane",
    desc: "A single dashboard to orchestrate compute, storage, networking, and security policies across hybrid and multi-cloud environments. RESTful APIs, Terraform providers, and CLI tooling for every workflow.",
    tags: ["Multi-cloud", "API-first", "IaC"],
    visual: (
      <div className="relative h-28 w-full">
        <svg viewBox="0 0 800 140" className="w-full h-full" fill="none">
          <circle cx="400" cy="70" r="18" fill="rgba(99,102,241,0.1)" stroke="rgba(99,102,241,0.3)" strokeWidth="1" />
          <circle cx="400" cy="70" r="6" fill="rgba(99,102,241,0.4)" />
          {[
            {x:120,y:30,l:"AWS"}, {x:680,y:30,l:"GCP"},
            {x:80,y:110,l:"Azure"}, {x:720,y:110,l:"On-Prem"},
            {x:400,y:15,l:"Edge"}, {x:400,y:125,l:"Bare Metal"}
          ].map((n,i) => (
            <g key={i}>
              <line x1="400" y1="70" x2={n.x} y2={n.y} stroke="rgba(99,102,241,0.12)" strokeWidth="1" />
              <circle cx={n.x} cy={n.y} r="10" fill="rgba(99,102,241,0.06)" stroke="rgba(99,102,241,0.15)" strokeWidth="1" />
              <text x={n.x} y={n.y+3} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontFamily="monospace">{n.l}</text>
            </g>
          ))}
          <ellipse cx="400" cy="70" rx="300" ry="45" stroke="rgba(99,102,241,0.06)" strokeWidth="0.5" fill="none" strokeDasharray="6 6" className="origin-center animate-[spin_30s_linear_infinite]" style={{ transformOrigin: '400px 70px' }} />
        </svg>
      </div>
    )
  }
];

export default function BentoFeatures() {
  return (
    <section id="features" className="relative z-10 pb-32 overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 
        w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-[800px] mx-auto w-full px-6 mb-20 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
          bg-white/[0.03] border border-white/[0.06] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#a1a1aa]">
            Capabilities
          </span>
        </div>
        <h2 className="serif font-normal text-[clamp(2.4rem,5vw,4.5rem)] tracking-[-0.03em] leading-[1.0] mb-6 text-white">
          System Specifications
        </h2>
        <p className="text-[#71717a] text-lg max-w-[500px] mx-auto leading-relaxed">
          Engineered for scale. Designed for precision. Built to adapt.
        </p>
      </motion.div>

      {/* BENTO GRID */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-[1100px] mx-auto w-full px-6 
          grid grid-cols-1 md:grid-cols-4 gap-5 
          auto-rows-[260px] grid-flow-dense"
      >
        {features.map((f, i) => {
          const gridClass = 
            f.size === "hero" ? "md:col-span-3 md:row-span-2" :
            f.size === "full" ? "md:col-span-4" :
            f.size === "large" ? "md:col-span-2 md:row-span-2" :
            f.size === "wide" ? "md:col-span-2" :
            f.size === "tall" ? "md:row-span-2" : 
            "md:col-span-1";

          return (
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              key={f.title}
              className={`relative bg-white/[0.01] backdrop-blur-2xl rounded-[28px] 
                p-7 lg:p-9 transition-all duration-700 overflow-hidden group 
                shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] 
                ring-1 ring-white/[0.04] hover:ring-white/[0.12] hover:bg-white/[0.025] 
                flex flex-col justify-between ${gridClass}`}
            >
              {/* Ambient gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} 
                opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none`} />
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl 
                from-white/[0.03] to-transparent rounded-bl-full opacity-0 
                group-hover:opacity-100 transition-opacity duration-700" />

              {/* Visual */}
              <div className="relative z-10 flex-1 w-full opacity-70 group-hover:opacity-100 
                transition-all duration-700 group-hover:scale-[1.02] origin-top-left">
                {f.visual}
              </div>

              {/* Content */}
              <div className="relative z-10 mt-auto pt-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg 
                    bg-white/[0.04] border border-white/[0.06] text-white/70 text-xs">
                    {f.icon}
                  </span>
                  <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">
                    {f.title}
                  </h3>
                </div>
                <p className="text-[13px] text-[#a1a1aa] leading-[1.7] font-light">
                  {f.desc}
                </p>
                
                {f.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {f.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-[10px] 
                        font-medium bg-white/[0.04] text-[#71717a] border border-white/[0.05] 
                        group-hover:border-white/[0.1] group-hover:text-[#a1a1aa] 
                        transition-colors duration-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}