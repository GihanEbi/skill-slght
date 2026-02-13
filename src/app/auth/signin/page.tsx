"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const navigateDashboard = () => {
    router.push("/users/system/dashboard");
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4 relative overflow-hidden no-scrollbar bg-[var(--background)]">
      {/* Animated Particles */}
      <BackgroundParticles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 lg:mb-10 text-center">
          <div className="w-16 h-16 active-tab-gradient rounded-2xl flex items-center justify-center text-white shadow-premium mb-4 ring-1 ring-white/20">
            <span className="material-symbols-outlined text-4xl font-bold">
              blur_on
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-[var(--text-main)]">
            SKILL <span className="text-primary italic">SLIGHT</span>
          </h1>
          <p className="text-[var(--text-muted)] text-[10px] uppercase font-black tracking-[0.3em] mt-1 opacity-70">
            Autonomous Recruitment Protocol
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-[2.5rem] p-8 md:p-10 shadow-premium border-[var(--border-subtle)]">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-black text-[var(--text-main)] uppercase tracking-tighter mb-1">
              Initialize Session
            </h2>
            <p className="text-[var(--text-muted)] text-xs font-medium">
              Access your recruitment intelligence dashboard
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                Identity Endpoint
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[20px] group-focus-within:text-primary transition-colors">
                  alternate_email
                </span>
                <input
                  type="email"
                  className="premium-input rounded-2xl py-4 pl-12 pr-4 text-sm text-[var(--text-main)] placeholder:text-slate-500/40"
                  placeholder="name@enterprise.ai"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">
                Access Key
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-[20px] group-focus-within:text-primary transition-colors">
                  lock_open
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="premium-input rounded-2xl py-4 pl-12 pr-12 text-sm text-[var(--text-main)] placeholder:text-slate-500/40"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--border-subtle)] bg-[var(--input-bg)] text-primary focus:ring-primary/40 focus:ring-offset-0"
                />
                <span className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                  Keep Active
                </span>
              </label>
              <a
                className="text-primary hover:text-emerald-400 transition-colors"
                href="#"
              >
                Reset Key?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={navigateDashboard}
              className="w-full py-4 active-tab-gradient rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-premium hover:shadow-glow transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Authorize Login</span>
              <span className="material-symbols-outlined text-[18px]">
                bolt
              </span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-subtle)]"></div>
            </div>
            <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em]">
              <span className="bg-[var(--background)] px-4 text-[var(--text-muted)]">
                Secure Federation
              </span>
            </div>
          </div>

          <button
            type="button"
            className="w-full h-14 rounded-2xl border border-[var(--border-subtle)] bg-[var(--input-bg)] text-[var(--text-main)] font-black text-[10px] uppercase tracking-widest hover:bg-[var(--surface)] transition-all flex items-center justify-center gap-3 shadow-sm"
          >
            <img
              className="w-5 h-5"
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              alt="Google"
            />
            Signin with Google
          </button>
        </div>

        <div className="text-center mt-10">
          <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] opacity-60">
            System Version 2.0.4 // Encrypted by{" "}
            <span className="text-primary">QuantumGuard</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function BackgroundParticles() {
  const particles = [
    { top: "15%", left: "10%", bg: "bg-primary/20", size: "w-2 h-2" },
    { top: "60%", left: "85%", bg: "bg-primary/30", size: "w-3 h-3" },
    { top: "80%", left: "20%", bg: "bg-primary/20", size: "w-4 h-4" },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity }}
          className={`absolute rounded-full blur-2xl ${p.size} ${p.bg}`}
          style={{ top: p.top, left: p.left }}
        />
      ))}
    </>
  );
}
