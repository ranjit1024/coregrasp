"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { authClient } from "@/lib/auth-client"
import { CoreGraspLogo } from "../components/ui/logo" // Adjust path if needed

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!token) {
      setError("Invalid or missing reset token. Please request a new password reset link.")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      // Using the new better-auth method
      const { error: resetError } = await authClient.resetPassword({
        newPassword: formData.password,
        token: token,
      })

      if (resetError) {
        setError(resetError.message || "Failed to reset password. The link might be expired.")
        setIsLoading(false)
        return
      }

      setSuccessMessage("Password reset successfully! Redirecting to login...")
      
      // Redirect to sign in page after a brief delay
      setTimeout(() => {
        router.push("/signin") // Adjust this to your auth page route
      }, 2000)

    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  const inputClasses = "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] focus:ring-1 focus:ring-white/10 transition-all duration-300 hover:border-white/[0.12]"

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="serif text-[28px] md:text-[32px] text-white mb-2 tracking-tight">Invalid Link</h1>
        <p className="text-[13px] text-[#71717a] mb-6">This password reset link is invalid or has expired.</p>
        <button 
          onClick={() => router.push("/signin")}
          className="text-emerald-400 hover:text-emerald-300 text-[13px] font-medium transition-colors"
        >
          Return to Sign In
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="serif text-[28px] md:text-[32px] text-white mb-2 tracking-tight leading-tight">
          Create new password
        </h1>
        <p className="text-[13px] text-[#71717a] leading-relaxed">
          Your new password must be unique and at least 8 characters long.
        </p>
      </div>

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

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="relative">
          <label className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              required
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

        <div>
          <label className="block text-[12px] font-medium text-white/50 uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
          <input 
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            value={formData.confirmPassword}
            onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
            placeholder="••••••••"
            className={inputClasses}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading || !!successMessage}
          className="w-full bg-white text-black font-semibold text-[13px] py-3 rounded-xl mt-2 flex justify-center items-center shadow-[0_0_20px_rgba(255,255,255,0.06)] hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] hover:bg-gray-100 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Reset Password
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </motion.button>
      </form>
    </>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#09090b] text-[#fafafa] selection:bg-emerald-500/30 selection:text-emerald-100">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .serif { font-family: 'Instrument Serif', serif; }
      `}</style>
      
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.04),transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/[0.02] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)] pointer-events-none" />

      {/* ── NAV ── */}
      <nav className="absolute top-0 w-full px-6 md:px-10 py-6 flex justify-between items-center z-20">
         <div className="flex font-mono items-center gap-3 cursor-pointer group">
            <CoreGraspLogo/>
          <span className="serif text-2xl font-mono tracking-wide text-white">
            Core<span className="text-emerald-400">Grasp</span>
          </span>
        </div>
      </nav>

      {/* ── CENTERED CARD ── */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] rounded-3xl p-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.5)] overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[100px] bg-white/[0.02] rounded-full blur-[60px] pointer-events-none" />
            
            {/* Suspense is required by Next.js when using useSearchParams in Client Components */}
            <Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /></div>}>
              <ResetPasswordForm />
            </Suspense>

          </div>
        </motion.div>
      </main>
    </div>
  )
}