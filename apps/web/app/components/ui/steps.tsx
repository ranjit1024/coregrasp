import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, FileEdit, Settings2, HardDriveDownload, ArrowRight, CheckCircle2 } from 'lucide-react';

const pipelineSteps = [
  { id: 0, title: "Import", desc: "Ingest raw data from multiple marketplaces.", icon: Database },
  { id: 1, title: "Write", desc: "Convert to your schema of understanding.", icon: FileEdit },
  { id: 2, title: "Build", desc: "Execute transformation pipeline logic.", icon: Settings2 },
  { id: 3, title: "Export", desc: "Push to Tally, SAP, or target systems.", icon: HardDriveDownload }
];

const PipelineFlow = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-6 bg-[#FAFAFA] font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">The Data Pipeline</h2>
            {pipelineSteps.map((step, index) => {
              const isActive = active === index;
              return (
                <div 
                  key={step.id}
                  onClick={() => setActive(index)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${isActive ? 'bg-white border-indigo-100 shadow-lg' : 'hover:bg-white/50 border-transparent'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>
                      <step.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{step.title}</h4>
                      <p className="text-xs text-slate-500">{step.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Visualizer */}
          <div className="lg:col-span-7 h-[420px] bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-300"/><div className="w-3 h-3 rounded-full bg-slate-300"/><div className="w-3 h-3 rounded-full bg-slate-300"/></div>
              <div className="ml-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline / {pipelineSteps[active].title.toLowerCase()}</div>
            </div>

            <div className="flex-1 flex items-center justify-center p-10 bg-slate-50/50">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  {/* Step Specific Visuals */}
                  {active === 0 && <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100">Multiple Marketplace Data Sources</div>}
                  {active === 1 && <div className="p-8 bg-indigo-50 text-indigo-700 rounded-2xl font-mono text-sm">JSON Parsing & Schema Mapping</div>}
                  {active === 2 && <div className="flex gap-4"><div className="w-16 h-16 bg-white rounded-xl shadow-sm" /><ArrowRight className="mt-6 text-slate-300" /><div className="w-16 h-16 bg-white rounded-xl shadow-sm" /></div>}
                  {active === 3 && <CheckCircle2 size={64} className="text-green-500 mx-auto" />}
                  
                  <h3 className="mt-8 font-bold text-lg text-slate-900">Step {active + 1}: {pipelineSteps[active].title}</h3>
                  <p className="text-slate-500 text-sm mt-2">{pipelineSteps[active].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PipelineFlow;