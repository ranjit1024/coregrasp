"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate auth delay
    await new Promise(r => setTimeout(r, 1500))
    setIsLoading(false)
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({ name: "", email: "", password: "" }) // Reset form on toggle
  }

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300 hover:border-white/[0.15]"

  return (
    // Removed flex-col to allow perfect vertical & horizontal centering of the only child in the document flow
    <div className="min-h-screen  flex items-center justify-center relative overflow-hidden bg-[#09090b] text-[#fafafa] selection:bg-emerald-500/30 selection:text-emerald-100 font-sans">
      
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/[0.04] rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] pointer-events-none" />

      {/* ── NAV (Absolutely positioned to top) ── */}
      <nav className="absolute top-0 left-0 w-full px-6 md:px-10 py-6 flex justify-between items-center z-20">
        <a href="/" className="font-serif text-xl tracking-wide text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm">
          Core<span className="text-emerald-400">Grasp</span>
        </a>
        <div className="text-[13px] text-[#a1a1aa] flex items-center gap-2">
          <span className="hidden sm:inline">{isLogin ? "New here?" : "Returning?"}</span>
          <button 
            type="button"
            onClick={toggleMode}
            className="text-white hover:text-emerald-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm px-1 py-0.5"
          >
            {isLogin ? "Create account" : "Sign in"}
          </button>
        </div>
      </nav>

      {/* ── AUTH CARD (Perfectly Centered) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[500px] px-6 relative z-10"
      >
        <div className="relative bg-[#09090b]/40 backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Inner top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-white/[0.03] rounded-full blur-[50px] pointer-events-none" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: isLogin ? -15 : 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isLogin ? 15 : -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-serif text-[28px] md:text-[32px] text-white mb-2 tracking-tight leading-tight">
                  {isLogin ? "Welcome back" : "Get started"}
                </h1>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed">
                  {isLogin 
                    ? "Sign in to access your compliance dashboard." 
                    : "Create your workspace and start verifying comprehension."}
                </p>
              </div>

              {/* OAuth */}
              <div className="flex flex-col gap-3 mb-6">
                <button 
                  type="button"
                  onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/home/dashboard" })}
                  className="flex items-center justify-center gap-3 w-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-white text-[13px] font-medium py-3 rounded-xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
                
                <button 
                  type="button"
                  className="flex items-center justify-center gap-3 w-full bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/[0.15] text-white text-[13px] font-medium py-3 rounded-xl transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <svg className="w-4 h-4" viewBox="0 0 21 21">
                    <path fill="currentColor" d="M0 0h10v10H0z" className="text-white/80" />
                    <path fill="currentColor" d="M11 0h10v10H11z" className="text-white/50" />
                    <path fill="currentColor" d="M0 11h10v10H0z" className="text-white/50" />
                    <path fill="currentColor" d="M11 11h10v10H11z" className="text-white/80" />
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/[0.08]" />
                <span className="text-[11px] text-[#52525b] uppercase tracking-[0.2em] font-medium">or</span>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/[0.08]" />
              </div>

              {/* Form */}
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <AnimatePresence initial={false}>
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 4 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <label htmlFor="name" className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                      <input 
                        id="name"
                        type="text" 
                        required={!isLogin}
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="Jane Doe"
                        className={inputClasses}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <label htmlFor="email" className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">Work Email</label>
                  <input 
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="jane@company.com"
                    className={inputClasses}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-2 ml-1">Password</label>
                  <div className="relative">
                    <input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      className={`${inputClasses} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors text-[11px] font-mono uppercase tracking-wider focus-visible:outline-none focus-visible:text-emerald-400"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Extras */}
                <div className="flex items-center justify-between text-[12px] mt-1">
                  {isLogin ? (
                    <>
                      <label className="flex items-center gap-2.5 text-[#a1a1aa] cursor-pointer group select-none">
                        <div className="relative flex items-center justify-center">
                          <input 
                            type="checkbox" 
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="peer sr-only" 
                          />
                          <div className="w-4 h-4 rounded border border-white/10 bg-white/[0.02] peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/50 group-hover:border-white/20 transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                            <motion.svg 
                              initial={false}
                              animate={{ opacity: rememberMe ? 1 : 0, scale: rememberMe ? 1 : 0.5 }}
                              className="w-3 h-3 text-white" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor" 
                              strokeWidth="3"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </motion.svg>
                          </div>
                        </div>
                        <span className="group-hover:text-white/90 transition-colors">Remember me</span>
                      </label>
                      <button type="button" className="text-white/50 hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:underline">
                        Forgot password?
                      </button>
                    </>
                  ) : (
                    <label className="flex items-start gap-2.5 text-[#a1a1aa] cursor-pointer group select-none">
                      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          required
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="peer sr-only" 
                        />
                        <div className="w-4 h-4 rounded border border-white/10 bg-white/[0.02] peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/50 group-hover:border-white/20 transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                          <motion.svg 
                            initial={false}
                            animate={{ opacity: agreeTerms ? 1 : 0, scale: agreeTerms ? 1 : 0.5 }}
                            className="w-3 h-3 text-white" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            strokeWidth="3"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </motion.svg>
                        </div>
                      </div>
                      <span className="text-[12px] leading-relaxed group-hover:text-white/90 transition-colors">
                        I agree to the <a href="#" className="text-white hover:text-emerald-400 underline decoration-white/20 underline-offset-2 transition-colors">Terms</a> and <a href="#" className="text-white hover:text-emerald-400 underline decoration-white/20 underline-offset-2 transition-colors">Privacy Policy</a>
                      </span>
                    </label>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full bg-white text-black font-semibold text-[14px] py-3 rounded-xl mt-4 flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-gray-100 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      {isLogin ? "Sign In" : "Create Account"}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── FOOTER (Absolutely positioned to bottom) ── */}
      <footer className="absolute bottom-0 left-0 z-10 py-8 text-center w-full px-6">
        <p className="text-[12px] text-[#71717a] leading-relaxed flex items-center justify-center gap-3">
          <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Protected by industry-standard encryption
          <span className="text-white/[0.08]">|</span>
          <a href="#" className="hover:text-emerald-400 transition-colors focus-visible:outline-none focus-visible:underline">Security</a>
        </p>
      </footer>
    </div>
  )
}