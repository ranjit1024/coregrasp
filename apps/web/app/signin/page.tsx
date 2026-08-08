"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { CoreGraspLogo } from "../components/ui/logo"

type AuthView = "login" | "signup" | "forgot"

export default function AuthPage() {
  const router = useRouter()
  const [view, setView] = useState<AuthView>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      if (view === "forgot") {
        const { error } = await authClient.requestPasswordReset({
          email: formData.email,
          redirectTo: "/reset-password",
        })

        if (error) {
          setError(error.message || "Failed to send reset email.")
        } else {
          setSuccessMessage("If an account exists, a password reset link has been sent to your email.")
        }
        setIsLoading(false)
        return
      }
      // 👆 END OF MISSING PART

      if (view === "login") {
        const { data, error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          setError(error.message || "Failed to sign in. Please check your credentials.")
          setIsLoading(false)
          return
        }
        
        // Successful login, redirect to dashboard
        router.push("/home/dashboard")
        
      } else if (view === "signup") {
        // Validation for sign up
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long.")
          setIsLoading(false)
          return
        }

        const { data, error } = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          callbackURL: "/home/dashboard",
        })

        if (error) {
          setError(error.message || "Failed to create account.")
          setIsLoading(false)
          return
        }

        setSuccessMessage("Account created successfully! Please check your email to verify your account before signing in.")
        setFormData({ name: "", email: "", password: "" })
        setIsLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await authClient.signIn.social({ 
      provider: "google", 
      callbackURL: "/home/dashboard" 
    })
  }

  const switchView = (newView: AuthView) => {
    setView(newView)
    setError(null)
    setSuccessMessage(null)
  }

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] focus:ring-1 focus:ring-white/10 transition-all duration-300 hover:border-white/[0.12]"

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#09090b] text-[#fafafa] selection:bg-emerald-500/30 selection:text-emerald-100">
          <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

        .font-display {
          font-family: 'Playfair Display', Georgia, serif;
        }
        .font-body {
          font-family: 'Inter', system-ui, sans-serif;
        }

        html { scroll-behavior: smooth; }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
      
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.04),transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] pointer-events-none" />

      {/* ── NAV ── */}
      <nav className="absolute top-0 w-full px-6 md:px-10 py-6 flex justify-between items-center z-20">
         <div className="flex font-display items-center gap-3 cursor-pointer group" >
            <CoreGraspLogo/>
          <span className="serif text-2xl font-mono tracking-wide text-white">
            Core<span className="text-emerald-400">Grasp</span>
          </span>
        </div>
        
        <div className="text-[12px] text-[#71717a]">
          {view === "forgot" ? (
            <>
              Remembered your password?{" "}
              <button onClick={() => switchView("login")} className="text-white/70 hover:text-emerald-400 transition-colors font-medium">
                Sign in
              </button>
            </>
          ) : (
            <>
              {view === "login" ? "New here?" : "Returning?"} {" "}
              <button 
                onClick={() => switchView(view === "login" ? "signup" : "login")}
                className="text-white/70 hover:text-emerald-400 transition-colors font-medium"
              >
                {view === "login" ? "Create account" : "Sign in"}
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ── CENTERED AUTH CARD ── */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-white/[0.02] rounded-full blur-[60px] pointer-events-none" />
            
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={view}
                initial={{ opacity: 0, x: view === "signup" ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: view === "signup" ? -10 : 10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Header */}
                <div className="mb-6">
                  <h1 className="serif text-[28px] md:text-[32px] text-white mb-2 tracking-tight leading-tight">
                    {view === "login" ? "Welcome back" : view === "signup" ? "Get started" : "Reset password"}
                  </h1>
                  <p className="text-[13px] text-[#71717a] leading-relaxed">
                    {view === "login" 
                      ? "Sign in to access your compliance dashboard." 
                      : view === "signup"
                      ? "Create your workspace and start verifying comprehension."
                      : "Enter your email address and we'll send you a link to reset your password."}
                  </p>
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="text-[12px] text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-xl"
                    >
                      {error}
                    </motion.div>
                  )}
                  {successMessage && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="text-[12px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-3 rounded-xl"
                    >
                      {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OAuth & Divider - Only show on Login / Signup */}
                {view !== "forgot" && (
                  <>
                    <div className="flex flex-col gap-2.5 mb-6">
                      <button 
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="flex hover:cursor-pointer items-center justify-center gap-3 w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] text-white text-[13px] font-medium py-2.5 rounded-xl transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-[1px] bg-white/[0.06]" />
                      <span className="text-[11px] text-[#52525b] uppercase tracking-[0.15em] font-medium">or</span>
                      <div className="flex-1 h-[1px] bg-white/[0.06]" />
                    </div>
                  </>
                )}

                {/* Form */}
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                  <AnimatePresence>
                    {view === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <label className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                        <input 
                          type="text" 
                          required={view === "signup"}
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          placeholder="Jane Doe"
                          className={inputClasses}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div>
                    <label className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-1.5 ml-1">Work Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="jane@company.com"
                      className={inputClasses}
                    />
                  </div>

                  {view !== "forgot" && (
                    <div className="relative">
                      <label className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          required={view !== "login"}
                          minLength={8}
                          value={formData.password}
                          onChange={e => setFormData({...formData, password: e.target.value})}
                          placeholder="••••••••"
                          className={`${inputClasses} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors text-[11px] font-mono uppercase tracking-wider"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Extras (Remember me / Privacy) */}
                  {view !== "forgot" && (
                    <div className="flex items-center justify-between text-[12px]">
                      {view === "login" ? (
                        <>
                          <label className="flex items-center gap-2 text-[#71717a] cursor-pointer group/check">
                            <div className="w-4 h-4 rounded border border-white/[0.12] bg-white/[0.03] flex items-center justify-center group-hover/check:border-white/20 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 opacity-0 group-hover/check:opacity-30" />
                            </div>
                            Remember me
                          </label>
                          <button 
                            type="button" 
                            onClick={() => switchView("forgot")}
                            className="text-white/50 hover:text-emerald-400 transition-colors"
                          >
                            Forgot password?
                          </button>
                        </>
                      ) : (
                        <label className="flex items-start gap-2 text-[#71717a] cursor-pointer group/check">
                          <div className="w-4 h-4 rounded border border-white/[0.12] bg-white/[0.03] flex items-center justify-center mt-0.5 group-hover/check:border-white/20 transition-colors shrink-0">
                            <div className="w-1.5 h-1.5 rounded-sm bg-emerald-400 opacity-0 group-hover/check:opacity-30" />
                          </div>
                          <span className="text-[11px] leading-relaxed">
                            I agree to the <a href="#" className="text-white/60 hover:text-white underline decoration-white/10 underline-offset-2">Terms</a> and <a href="#" className="text-white/60 hover:text-white underline decoration-white/10 underline-offset-2">Privacy Policy</a>
                          </span>
                        </label>
                      )}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full bg-white text-black font-semibold text-[13px] py-3 rounded-xl mt-1 flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.06)] hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:bg-gray-100 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        {view === "login" ? "Sign In" : view === "signup" ? "Create Account" : "Send Reset Link"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-6 text-center w-full px-6">
        <p className="text-[11px] text-[#52525b] leading-relaxed">
          Protected by industry-standard encryption. 
          <span className="mx-2 text-white/[0.08]">|</span>
          <a href="#" className="hover:text-white/60 transition-colors">Security</a>
        </p>
      </footer>
    </div>
  )
}