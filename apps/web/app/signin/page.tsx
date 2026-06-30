"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  } as const;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#09090b] text-[#fafafa] antialiased selection:bg-emerald-500/30"
      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
        .serif { font-family: 'Instrument Serif', serif; }
      `}</style>

      {/* ── BACKGROUND GLOWS ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── TOP NAV LOGO ── */}
      <div className="absolute top-0 w-full px-8 py-6 flex justify-center md:justify-start">
        <a href="/" className="serif text-2xl tracking-wide text-white no-underline">
          Core<span className="text-emerald-400">Grasp</span>
        </a>
      </div>

      {/* ── AUTH CARD ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] px-6 relative z-10"
      >
        <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/80">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col"
            >
              <div className="text-center mb-8">
                <h1 className="serif text-3xl text-white mb-2 tracking-tight">
                  {isLogin ? "Welcome back" : "Create an account"}
                </h1>
                <p className="text-[14px] text-[#a1a1aa]">
                  {isLogin 
                    ? "Enter your details to access your dashboard." 
                    : "Start verifying policy comprehension in minutes."}
                </p>
              </div>

              {/* OAuth Buttons */}
              <div className="flex hover:cursor-pointer flex-col gap-3 mb-6">
                <button className="flex items-center hover:cursor-pointer justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[14px] font-medium py-2.5 rounded-lg transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
                
                <button className="flex hover:cursor-pointer items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[14px] font-medium py-2.5 rounded-lg transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 21 21">
                    <path fill="currentColor" d="M10 0H0v10h10V0zM21 0H11v10h10V0zM10 11H0v10h10V11zM21 11H11v10h10V11z" />
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[12px] text-[#71717a] uppercase tracking-wider font-medium">Or continue with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Form Fields */}
              <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div>
                    <label className="text-[13px] font-medium text-[#a1a1aa] block mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Jane Doe"
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white placeholder-[#71717a] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-[13px] font-medium text-[#a1a1aa] block mb-1.5">Work Email</label>
                  <input 
                    type="email" 
                    placeholder="jane@acmecorp.com"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white placeholder-[#71717a] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <div>
               
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-2.5 text-[14px] text-white placeholder-[#71717a] focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black font-semibold text-[14px] py-3 rounded-lg mt-2 flex justify-center items-center shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-gray-200 transition-colors"
                >
                  {isLogin ? "Sign In" : "Create Account"}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Toggle */}
          <div className="mt-8 text-center text-[14px] text-[#a1a1aa]">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-white font-medium hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>

        </div>
      </motion.div>

      {/* ── FOOTER TEXT ── */}
      <div className="absolute bottom-6 text-center w-full px-6 text-[12px] text-[#71717a]">
        By clicking continue, you agree to our <a href="#" className="text-[#a1a1aa] hover:text-white underline decoration-white/20 underline-offset-2">Terms of Service</a> and <a href="#" className="text-[#a1a1aa] hover:text-white underline decoration-white/20 underline-offset-2">Privacy Policy</a>.
      </div>
    </div>
  )
}