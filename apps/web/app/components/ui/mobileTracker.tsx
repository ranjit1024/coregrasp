import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, FileUp, Sparkles, Users, Send, 
  CheckCircle2, UploadCloud, Database, Activity, ChevronDown 
} from 'lucide-react';

const steps = [
  {
    id: 0,
    title: "Secure Authentication",
    description: "Access your dashboard via SSO with enterprise-grade security.",
    icon: Lock,
  },
  {
    id: 1,
    title: "Upload Policy Guide",
    description: "Drop your PDF guidelines into the secure encrypted vault.",
    icon: FileUp,
  },
  {
    id: 2,
    title: "AI Test Generation",
    description: "Our engine parses the rules and drafts a custom assessment.",
    icon: Sparkles,
  },
  {
    id: 3,
    title: "Import Candidates",
    description: "Sync your team via CSV or one-click HRIS integration.",
    icon: Users,
  },
  {
    id: 4,
    title: "Launch & Monitor",
    description: "Dispatch tests instantly and track live completion scores.",
    icon: Activity,
  }
];

export const MobileLandingPageShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-16 px-2 bg-[#FAFAFA] font-sans text-slate-900 overflow-hidden">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-3">
            Simple Compliance Workflow
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Automate your workflow from document upload to team distribution.
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const Icon = step.icon;

            return (
              <div 
                key={step.id}
                className={`border transition-all duration-300 rounded-2xl overflow-hidden
                  ${isActive ? 'bg-white border-slate-200 shadow-sm' : 'bg-transparent border-transparent'}
                `}
              >
                {/* Accordion Header */}
                <button 
                  onClick={() => setActiveStep(index)}
                  className="w-full flex items-center gap-4 p-4 text-left outline-none"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all
                    ${isActive 
                      ? 'bg-[#FF6D24] text-white shadow-md shadow-[#FF6D24]/20' 
                      : 'bg-white text-slate-400 border border-slate-200'}
                  `}>
                    <Icon size={18} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {step.title}
                    </h3>
                  </div>

                  <ChevronDown 
                    size={16} 
                    className={`text-slate-400 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Accordion Content (The Preview Screen) */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-6">
                        <p className="text-xs text-slate-500 mb-6 px-1">
                          {step.description}
                        </p>
                        
                        {/* Inline Preview Window */}
                        <div className="relative w-full aspect-[4/3] bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center p-4">
                           <StepVisual stepIndex={index} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Extracted the visuals into a sub-component for clarity
const StepVisual = ({ stepIndex }: { stepIndex: number }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full h-full flex items-center justify-center"
    >
      {stepIndex === 0 && (
        <div className="w-full max-w-[200px] bg-white p-4 rounded-lg shadow-sm border border-slate-100 text-center">
          <Lock className="text-slate-400 mx-auto mb-3" size={16} />
          <div className="h-2 w-12 bg-slate-100 rounded-full mx-auto mb-4" />
          <div className="space-y-2 mb-4">
            <div className="h-6 w-full bg-slate-50 border border-slate-100 rounded" />
            <div className="h-6 w-full bg-slate-900 rounded" />
          </div>
        </div>
      )}

      {stepIndex === 1 && (
        <div className="w-full h-32 border-2 border-dashed border-slate-200 bg-white rounded-lg flex flex-col items-center justify-center text-center">
          <UploadCloud size={24} className="text-[#FF6D24] mb-2" />
          <span className="text-[10px] font-medium text-slate-400">Tap to upload</span>
        </div>
      )}

      {stepIndex === 2 && (
        <div className="w-full max-w-[180px] flex flex-col items-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="w-10 h-10 border-2 border-slate-100 border-t-[#FF6D24] rounded-full mb-3"
          />
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: "0%" }} animate={{ width: "70%" }} className="h-full bg-[#FF6D24]" />
          </div>
        </div>
      )}

      {stepIndex === 3 && (
        <div className="w-full bg-white border border-slate-100 rounded-lg p-3 space-y-2">
           {[1, 2].map(i => (
             <div key={i} className="flex items-center gap-2">
               <div className="w-5 h-5 rounded-full bg-slate-100" />
               <div className="h-2 w-16 bg-slate-100 rounded" />
             </div>
           ))}
        </div>
      )}

      {stepIndex === 4 && (
        <div className="text-center">
          <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-100">
            <Send size={16} className="text-emerald-600" />
          </div>
          <div className="px-4 py-2 bg-[#FF6D24] text-white rounded text-[10px] font-bold">
            Dispatch Now
          </div>
        </div>
      )}
    </motion.div>
  );
};

