import React from 'react';

export default function SignIn() {
  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Left Column - Authentication (Kept clean and functional) */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96 flex flex-col h-full">
          
          <div className="flex-shrink-0 pt-4">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              revisly
            </span>
          </div>

          <div className="mt-16 sm:mt-24 flex-1">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="mt-3 text-base text-slate-500 leading-relaxed">
              Access your dashboard via SSO with enterprise-grade security.
            </p>

            <div className="mt-10">
              <button
                type="button"
                className="group w-full flex items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 hover:ring-slate-400 hover:shadow-md transition-all duration-200"
              >
                <svg className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </button>
            </div>
            
            <div className="mt-8 border-t border-slate-100 pt-6">
               <p className="text-xs text-slate-400">
                 By continuing, you agree to our <a href="#" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">Terms of Service</a> and <a href="#" className="font-medium text-slate-600 hover:text-slate-900 transition-colors">Privacy Policy</a>.
               </p>
            </div>
          </div>

          <div className="mt-auto pt-8 flex items-center gap-4 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Help Center</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-slate-900 transition-colors">Return to Home</a>
          </div>
          
        </div>
      </div>

      {/* Right Column - Premium SaaS Showcase */}
      <div className="relative hidden w-0 flex-1 lg:flex flex-col bg-slate-950 overflow-hidden">
        
        {/* Modern Studio Lighting / Mesh Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex-1 flex flex-col justify-center px-16 xl:px-24 relative z-10">
          
          {/* Trust Badge */}
          <div className="mb-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-md">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            Trusted by 10 merchants
          </div>

          {/* Value Proposition */}
          <h2 className="text-4xl xl:text-5xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Measure real <br className="hidden xl:block" /> understanding.
          </h2>
          <p className="text-lg leading-relaxed text-slate-400 max-w-md mb-16">
            Stop tracking completion. Gain clear insight into who actually understands your policies and who doesn't.
          </p>

          {/* High-Fidelity UI Floating Card */}
          <div className="relative max-w-md w-full perspective-1000">
            {/* Decorative subtle glow behind the card */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl transform -rotate-2"></div>
            
            {/* The Glassmorphism Card */}
            <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 ease-out">
              
              <div className="flex items-start justify-between border-b border-white/10 pb-5 mb-5">
                <div>
                  <h3 className="text-white font-semibold text-lg tracking-tight">Policy Alignment Matrix</h3>
                  <p className="text-slate-400 text-sm mt-1">Comparing top candidates for organizational fit.</p>
                </div>
                <div className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2 py-1 rounded border border-indigo-500/30">
                  LIVE
                </div>
              </div>

              {/* Data Row pulling directly from your app's context */}
              <div className="flex items-center justify-between bg-white/[0.03] rounded-xl p-4 border border-white/[0.05] hover:bg-white/[0.05] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                    MC
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm flex items-center gap-2">
                      Marcus Chen
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-semibold tracking-wider">Selected Fit</span>
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">Systems Architect</p>
                  </div>
                </div>
                
                {/* Score Circular Indicator */}
                <div className="relative flex items-center justify-center h-12 w-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white/10"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="text-indigo-500"
                      strokeDasharray="97, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute text-white font-bold text-sm">97</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}