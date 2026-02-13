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
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Particles */}
      <BackgroundParticles />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 lg:mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4 ring-1 ring-white/20">
            <span className="material-symbols-outlined text-4xl font-bold">
              blur_on
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter text-white">
            SKILL{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              SLIGHT
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">
            Autonomous Recruitment Protocol
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card-login rounded-[2rem] p-6 lg:p-10">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-2">
              Initialize Session
            </h2>
            <p className="text-slate-400 text-sm">
              Access your intelligence dashboard
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">
                Identity Endpoint
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] group-focus-within:text-primary transition-colors">
                  alternate_email
                </span>
                <input
                  type="email"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all glow-input"
                  placeholder="name@enterprise.ai"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2 ml-1">
                Access Key
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-[20px] group-focus-within:text-primary transition-colors">
                  lock_open
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all glow-input"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/40 focus:ring-offset-0"
                />
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                  Persistent Node
                </span>
              </label>
              <a
                className="text-primary hover:text-accent transition-colors"
                href="#"
              >
                Reset Key?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigateDashboard();
              }}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-2xl text-white font-extrabold text-sm uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
            >
              <span>Sign In</span>
              <span className="material-symbols-outlined text-[18px]">
                bolt
              </span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-[#0b1021] px-4 text-slate-600">
                Secure Federation
              </span>
            </div>
          </div>

          {/* Social Logins */}
          {/* <div className="grid grid-cols-2 gap-4">
            <SocialButton label="Google" icon="/google.svg" isSvg />
            <SocialButton label="SSO" icon="hub" />
          </div> */}
          <button
            type="button"
            className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-white font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
          >
            <img
              className="w-5 h-5"
              src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
              alt="Google"
            />
            Sign in with Google
          </button>
        </div>

        <p className="text-center mt-10 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
          Protocol Version 2.0.4 // Encrypted by{" "}
          <span className="text-slate-400">QuantumGuard</span>
        </p>
      </motion.div>
    </div>
  );
}


function BackgroundParticles() {
  const particles = [
    { top: "10%", left: "20%", bg: "bg-primary/40", size: "w-1 h-1" },
    { top: "40%", left: "80%", bg: "bg-accent/30", size: "w-2 h-2" },
    { top: "70%", left: "15%", bg: "bg-secondary/40", size: "w-1.5 h-1.5" },
    { top: "85%", left: "60%", bg: "bg-white/20", size: "w-1 h-1" },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
          className={`absolute rounded-full blur-[1px] ${p.size} ${p.bg}`}
          style={{ top: p.top, left: p.left }}
        />
      ))}
    </>
  );
}
