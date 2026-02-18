"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MaintenancePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen mesh-gradient bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel max-w-lg w-full rounded-[2.5rem] p-10 md:p-16 border border-[var(--border-subtle)] text-center relative z-10 shadow-2xl"
      >
        {/* Animated Icon Container */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
          className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20 shadow-glow"
        >
          <span className="material-symbols-outlined text-5xl font-bold">
            engineering
          </span>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[var(--text-main)] mb-4">
          WORK IN <span className="text-primary">PROGRESS</span>
        </h1>

        <p className="text-[var(--text-muted)] font-medium leading-relaxed mb-10">
          This module is currently under maintenance and not yet ready for
          deployment. Our engineers are synchronizing the protocol nodes.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/users/system/dashboard")}
            className="w-full active-tab-gradient text-[var(--background)] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-premium hover:scale-[1.02] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-xl">dashboard</span>
            Return to Dashboard
          </button>

        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30">
        <span className="material-symbols-outlined text-primary text-xl">
          blur_on
        </span>
        <span className="text-[var(--text-main)] font-black tracking-tighter text-sm">
          SKILL SIGHT
        </span>
      </div>
    </div>
  );
}
