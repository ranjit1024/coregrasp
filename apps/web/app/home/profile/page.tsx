"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Trash2, 
  Camera, 
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Upload,
  User,
  Save,
  RotateCcw,
  Shield
} from "lucide-react";

interface Toast {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [originalData, setOriginalData] = useState({ name: "", email: "" });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const hasChanges = formData.name !== originalData.name;
  const isValid = formData.name.trim().length >= 2;

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      const data = { name: user.name || "", email: user.email || "" };
      setFormData(data);
      setOriginalData(data);
      if (user.image) setImagePreview(user.image);
    }
  }, [user]);

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && hasChanges && isValid) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasChanges, isValid, formData]);

  // Toast helper
  const addToast = useCallback((type: Toast["type"], message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Handle Save
  const handleSave = async () => {
    if (!isValid) {
      addToast("error", "Name must be at least 2 characters");
      return;
    }
    
    setIsSaving(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name }),
      });
      
      if (!response.ok) throw new Error("Failed to update profile");
      
      setOriginalData({ ...formData });
      setLastSaved(new Date());
      addToast("success", "Profile updated successfully");
    } catch (error) {
      addToast("error", "Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Reset
  const handleReset = () => {
    setFormData({ ...originalData });
    addToast("info", "Changes discarded");
  };

  // Handle Image Upload
  const handleImageClick = () => fileInputRef.current?.click();
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (file.size > 2 * 1024 * 1024) {
      addToast("error", "Image must be less than 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      addToast("error", "Please upload a valid image");
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      addToast("success", "Profile picture updated");
    } catch (error) {
      addToast("error", "Failed to upload image");
      // Revert preview on error
      setImagePreview(user?.image || null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    
    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/account", { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete account");
      
      addToast("success", "Account deleted. Redirecting...");
      setTimeout(() => window.location.href = "/", 2000);
    } catch (error) {
      addToast("error", "Failed to delete account");
      setIsDeleting(false);
    }
  };

  // Helper for initials
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.25, 0.46, 0.45, 0.94], duration: 0.5 } },
  } as const;

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-68px)] items-center justify-center">
        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-68px)] p-6 md:p-10 relative bg-[#09090B]">
      {/* Ambient lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-teal-500/[0.02] blur-[120px] rounded-full pointer-events-none" />

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border text-[13px] font-medium min-w-[300px] ${
                toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                toast.type === "error" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                "bg-zinc-800 border-zinc-700 text-zinc-300"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="w-4 h-4" />}
              {toast.type === "error" && <AlertTriangle className="w-4 h-4" />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#121214] border border-rose-500/20 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100">Delete Account</h3>
                  <p className="text-[13px] text-zinc-500">This action is permanent and irreversible.</p>
                </div>
              </div>
              
              <div className="bg-rose-500/5 border border-rose-500/10 rounded-lg p-3 mb-4">
                <p className="text-[12px] text-rose-300/80 leading-relaxed">
                  All your data, including projects, settings, and personal information will be permanently removed. 
                  Type <span className="font-mono font-semibold text-rose-400">DELETE</span> to confirm.
                </p>
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full bg-[#09090B] border border-rose-500/20 rounded-lg px-4 py-2.5 text-[14px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all mb-4"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/30 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto space-y-8 relative z-10"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-zinc-100 tracking-tight">
              Account Profile
            </h1>
            <p className="text-[14px] text-zinc-500 leading-relaxed mt-1">
              Manage your personal information, profile picture, and account security.
            </p>
          </div>
          {lastSaved && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[12px] text-zinc-600 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/60" />
              Last saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.p>
          )}
        </motion.div>

        <div className="space-y-6">
          
          {/* --- Profile Picture Section --- */}
          <motion.div variants={itemVariants} className="bg-[#121214] border border-white/[0.06] rounded-xl p-6 shadow-sm hover:border-white/[0.08] transition-colors">
            <h2 className="text-[15px] font-semibold text-zinc-100 mb-4">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div 
                className="relative group cursor-pointer shrink-0"
                onClick={handleImageClick}
              >
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-white/[0.08] group-hover:border-emerald-500/30 transition-colors"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
                    {getInitials(user?.name)}
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200 backdrop-blur-[2px]">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-[#121214] rounded-full flex items-center justify-center">
                  <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#121214]" />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button
                    onClick={handleImageClick}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-900 text-[13px] font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? "Uploading..." : "Upload New"}
                  </button>
                  {imagePreview && (
                    <button
                      onClick={() => { setImagePreview(null); addToast("info", "Image removed"); }}
                      className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 text-[13px] font-medium rounded-lg transition-all border border-white/[0.06]"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-[12px] text-zinc-500">
                  Recommended: 256x256px or larger. Max 2MB. JPG, PNG, or GIF.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </motion.div>

          {/* --- Personal Information Section --- */}
          <motion.div variants={itemVariants} className="bg-[#121214] border border-white/[0.06] rounded-xl shadow-sm overflow-hidden hover:border-white/[0.08] transition-colors">
            <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-100 mb-1">Personal Information</h2>
                <p className="text-[13px] text-zinc-500">Update your primary details and public name.</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-500" />
              </div>
            </div>
            
            <div className="p-6 space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-zinc-300 flex items-center justify-between">
                  Full Name
                  {formData.name && !isValid && (
                    <span className="text-rose-400 text-[11px] font-normal">Min 2 characters</span>
                  )}
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-[#09090B] border rounded-lg px-4 py-2.5 text-[14px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all shadow-sm ${
                    formData.name && !isValid 
                      ? "border-rose-500/30 focus:border-rose-500/50 focus:ring-rose-500/50" 
                      : "border-white/[0.08] focus:border-emerald-500/50 focus:ring-emerald-500/50"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-zinc-300">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="w-full bg-white/[0.02] border border-white/[0.04] rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-zinc-400 cursor-not-allowed shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                    <Shield className="w-3 h-3" /> Verified
                  </div>
                </div>
                <p className="text-[12px] text-zinc-500 mt-1.5 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Managed by your authentication provider. Cannot be changed here.
                </p>
              </div>
            </div>

            {/* Save Footer */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-emerald-500/[0.02] border-t border-emerald-500/10 flex items-center justify-between">
                    <p className="text-[12px] text-emerald-400/70 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Unsaved changes
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 text-[13px] font-medium rounded-lg transition-all border border-white/[0.06]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reset
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isSaving || !isValid}
                        className="flex items-center gap-1.5 min-w-[120px] bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/30 disabled:cursor-not-allowed text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-emerald-900/20"
                      >
                        {isSaving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* --- Security Section --- */}
          <motion.div variants={itemVariants} className="bg-[#121214] border border-white/[0.06] rounded-xl p-6 shadow-sm hover:border-white/[0.08] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-zinc-100 mb-1">Password & Security</h2>
                <p className="text-[13px] text-zinc-500">Update your password and security preferences.</p>
              </div>
              <Shield className="w-5 h-5 text-zinc-600" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-zinc-100 text-[13px] font-medium rounded-lg transition-all border border-white/[0.06]">
                Change Password
              </button>
              <button className="px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-zinc-100 text-[13px] font-medium rounded-lg transition-all border border-white/[0.06]">
                Enable 2FA
              </button>
            </div>
          </motion.div>

          {/* --- Danger Zone --- */}
          <motion.div variants={itemVariants} className="bg-rose-500/[0.02] border border-rose-500/20 rounded-xl p-6 shadow-sm relative overflow-hidden group hover:border-rose-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500/50 group-hover:bg-rose-500 transition-colors" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex sm:items-center flex-col sm:flex-row justify-between gap-4 relative">
              <div>
                <h2 className="text-[15px] font-semibold text-rose-200 mb-1 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Delete Account
                </h2>
                <p className="text-[13px] text-rose-400/70 max-w-sm">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="shrink-0 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[13px] font-semibold rounded-lg transition-colors border border-rose-500/20 flex items-center justify-center gap-2 hover:border-rose-500/40"
              >
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </div>
          </motion.div>

        </div>

        {/* Keyboard hint */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-[11px] text-zinc-600 pt-4"
        >
          Pro tip: Press <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-zinc-500 font-mono text-[10px] border border-white/[0.08]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white/[0.06] rounded text-zinc-500 font-mono text-[10px] border border-white/[0.08]">S</kbd> to save changes
        </motion.p>
      </motion.div>
    </div>
  );
}