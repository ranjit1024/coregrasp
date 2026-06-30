import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, FileUp, Sparkles, Users, Send, Check, ArrowRight } from 'lucide-react';

const workflowSteps = [
  {
    id: 1,
    title: "Authenticate Account",
    description: "Securely log in to your administrator dashboard.",
    icon: Lock,
    actionText: "Login to Dashboard"
  },
  {
    id: 2,
    title: "Upload Policy Guide",
    description: "Submit organizational guidelines (PDF, DOCX) for analysis.",
    icon: FileUp,
    actionText: "Select Files"
  },
  {
    id: 3,
    title: "Generate Assessment",
    description: "System automatically creates test modules based on policy text.",
    icon: Sparkles,
    actionText: "Run Generator"
  },
  {
    id: 4,
    title: "Import Candidates",
    description: "Sync contact email lists via CSV, CRM, or direct input.",
    icon: Users,
    actionText: "Import List"
  },
  {
    id: 5,
    title: "Launch Campaign",
    description: "Dispatch generated tests to all imported candidate emails.",
    icon: Send,
    actionText: "Send Emails"
  }
];

const UserJourneyWorkflow = () => {
  // State to track the currently active step (0 to 4)
  const [activeStep, setActiveStep] = useState(2); // Defaulting to step 3 for visual demonstration

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2rem] border border-slate-200 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600">Campaign Setup</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Assessment Workflow
          </h2>
          <p className="text-sm text-slate-500">Complete the sequence below to launch your policy test.</p>
        </div>

        {/* Interactive Timeline */}
        <div className="relative pl-3">
          
          {/* Background Track */}
          <div className="absolute left-[31px] top-6 bottom-10 w-[2px] bg-slate-100 rounded-full" />
          
          {/* Animated Fill Track */}
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${(activeStep / (workflowSteps.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute left-[31px] top-6 w-[2px] bg-gradient-to-b from-orange-500 to-orange-400 rounded-full origin-top" 
          />

          {workflowSteps.map((step, index) => {
            const isComplete = index < activeStep;
            const isCurrent = index === activeStep;
            const isUpcoming = index > activeStep;
            const Icon = step.icon;

            return (
              <div 
                key={step.id} 
                onClick={() => setActiveStep(index)}
                className={`relative flex gap-6 pb-8 last:pb-0 cursor-pointer group ${isUpcoming ? 'opacity-60 hover:opacity-100' : ''} transition-opacity duration-300`}
              >
                
                {/* Node Icon */}
                <div className="relative z-10 flex flex-col items-center shrink-0 pt-1">
                  <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-all duration-500
                    ${isComplete ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : ''}
                    ${isCurrent ? 'bg-white text-orange-600 shadow-[0_0_0_2px_rgba(249,115,22,0.2)] ring-4 ring-orange-50' : ''}
                    ${isUpcoming ? 'bg-slate-50 border border-slate-200 text-slate-400 group-hover:border-orange-200 group-hover:text-orange-400' : ''}
                  `}>
                    {isComplete ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                        <Check size={20} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <Icon size={20} strokeWidth={isCurrent ? 2.5 : 2} />
                    )}
                  </div>
                </div>

                {/* Text Content & Action Button */}
                <div className="flex flex-col w-full">
                  <h4 className={`text-[16px] font-semibold mb-1 transition-colors duration-300
                    ${isCurrent ? 'text-slate-900' : 'text-slate-700'}
                  `}>
                    {step.title}
                  </h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed max-w-[280px]">
                    {step.description}
                  </p>
                  
                  {/* Expanding Action Area for Current Step */}
                  <AnimatePresence>
                    {isCurrent && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeStep < workflowSteps.length - 1) setActiveStep(prev => prev + 1);
                          }}
                          className="flex items-center justify-between w-full sm:w-auto gap-3 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                          {step.actionText}
                          <ArrowRight size={16} className="text-slate-400" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserJourneyWorkflow;