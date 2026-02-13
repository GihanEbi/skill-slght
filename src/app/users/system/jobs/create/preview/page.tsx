"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const router = useRouter();

  // navigate to benefits page on next step
  const handleNext = () => {
    router.push("/users/system/dashboard");
  };
  return (
    <div className="min-h-screen flex flex-col mesh-gradient rounded-3xl overflow-hidden">
      {/* --- Progress Stepper --- */}
      <div className="max-w-7xl mx-auto w-full px-6 pt-8">
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-500/10 z-0" />
            <StepItem icon="check_circle" label="Details" completed />
            <StepItem icon="check_circle" label="Benefits" completed />
            <StepItem icon="check_circle" label="Comp" completed />
            <StepItem icon="visibility" label="Preview" active />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 items-start mb-24">
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-[2rem] p-8 shadow-2xl"
            >
              <div className="mb-6 border-b border-[var(--border-subtle)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[var(--text-main)] mb-2 uppercase tracking-tighter">
                    Review Job Posting
                  </h1>
                  <p className="text-[var(--text-muted)] font-medium">
                    Finalize how the job appears on your careers page.
                  </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-black/40 p-1 rounded-xl border border-primary/20 self-start">
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 uppercase tracking-wider transition-all ${viewMode === "desktop" ? "bg-primary/20 text-primary shadow-glow" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      desktop_windows
                    </span>{" "}
                    Desktop
                  </button>
                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black flex items-center gap-2 uppercase tracking-wider transition-all ${viewMode === "mobile" ? "bg-primary/20 text-primary shadow-glow" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      smartphone
                    </span>{" "}
                    Mobile
                  </button>
                </div>
              </div>

              {/* Mockup Container */}
              <motion.div
                animate={{ width: viewMode === "desktop" ? "100%" : "375px" }}
                className="mx-auto rounded-[1.5rem] overflow-hidden border border-white/5 bg-[#0f0f13] shadow-premium transition-all duration-500"
              >
                <div className="bg-white/5 px-6 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="mx-auto bg-white/5 px-3 py-1 rounded text-[9px] text-slate-500 font-mono truncate max-w-[70%]">
                    careers.skill-slight.com/jobs/senior-ux-designer
                  </div>
                </div>

                <div className="p-8 md:p-12 space-y-8 bg-gradient-to-b from-transparent to-black/40">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/20">
                        Full-Time
                      </span>
                      <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] font-black uppercase tracking-widest border border-accent/20">
                        Design
                      </span>
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight tracking-tighter">
                      Senior Product Designer, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                        User Experience
                      </span>
                    </h2>
                    <div className="flex flex-wrap gap-6 text-slate-400 text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">
                          location_on
                        </span>{" "}
                        San Francisco, CA (Hybrid)
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">
                          payments
                        </span>{" "}
                        $165k — $210k • Equity
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[var(--border-subtle)]"></div>

                  <div
                    className={`grid gap-8 ${viewMode === "desktop" ? "grid-cols-3" : "grid-cols-1"}`}
                  >
                    <div className="md:col-span-2 space-y-6 text-sm leading-relaxed text-slate-400">
                      <div>
                        <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">
                          About the Role
                        </h3>
                        <p>
                          We are looking for a visionary Senior Product
                          Designer. You will define the future of AI-driven
                          recruitment workflows, creating seamless interfaces
                          that empower recruiters.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight">
                          Key Qualifications
                        </h3>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>
                            5+ years of experience in product design for SaaS.
                          </li>
                          <li>Expertise in Figma and advanced prototyping.</li>
                          <li>
                            Ability to translate AI data into intuitive user
                            experiences.
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <SidebarStat
                        title="Core Skills"
                        items={[
                          "UX Research",
                          "Visual Design",
                          "Prototyping",
                          "Systems",
                        ]}
                      />
                      <div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
                          Perks & Benefits
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <BenefitBadge
                            icon="health_and_safety"
                            label="Health"
                          />
                          <BenefitBadge icon="flight_takeoff" label="PTO" />
                          <BenefitBadge icon="laptop_mac" label="Hardware" />
                          <BenefitBadge icon="savings" label="401(k)" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* AI Checklist Sidebar */}
          <div className="col-span-12 lg:col-span-4 sticky top-24">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel rounded-[2rem] p-6 shadow-glow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-white">
                      fact_check
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-[var(--text-main)] uppercase tracking-wider text-xs">
                      Publish Checklist
                    </h3>
                    <p className="text-[10px] text-accent font-black">
                      READY TO DEPLOY
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <CheckItem label="All fields completed" />
                  <CheckItem label="Competitive salary" />
                  <CheckItem label="Keywords optimized" />
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-6">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs">
                      auto_awesome
                    </span>{" "}
                    AI Recommendation
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] italic leading-relaxed">
                    "Everything looks solid! Expect high-quality matches within
                    24 hours of publishing."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    <span>Listing Visibility</span>
                    <span className="text-accent">Public</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-accent shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <footer className="bottom-0 mt-auto">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            className="flex items-center gap-2 text-[var(--text-muted)] font-black uppercase text-[10px] tracking-widest hover:text-[var(--text-main)] transition-all group"
            onClick={() => {
              router.push("/users/system/jobs/create/comp");
            }}
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back
          </button>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-xl border border-[var(--border-subtle)] text-[var(--text-muted)] font-black text-[10px] tracking-widest uppercase hover:bg-[var(--surface)] transition-all">
              Save Draft
            </button>
            <button
              className="active-tab-gradient px-10 py-3 rounded-xl text-white font-black text-[10px] tracking-[0.2em] uppercase flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
              onClick={() => {
                handleNext();
              }}
            >
              Next Step
              <span className="material-symbols-outlined text-sm">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Helper Components ---

function StepItem({ icon, label, active = false, completed = false }: any) {
  return (
    <div className="flex flex-col items-center gap-2 z-10">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${active ? "bg-primary text-white shadow-glow" : completed ? "bg-black/40 border border-primary/40 text-primary" : "bg-black/40 border border-[var(--border-subtle)] text-slate-500"}`}
      >
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <span
        className={`text-[9px] font-black uppercase tracking-widest ${active ? "text-primary" : "text-slate-500"}`}
      >
        {label}
      </span>
    </div>
  );
}

function SidebarStat({ title, items }: any) {
  return (
    <div>
      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
        {title}
      </h4>
      <div className="flex flex-wrap gap-2">
        {items.map((item: string) => (
          <span
            key={item}
            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function BenefitBadge({ icon, label }: any) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-sm">{icon}</span>
      </div>
      <span>{label}</span>
    </div>
  );
}

function CheckItem({ label }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-emerald-500/10">
      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
        <span className="material-symbols-outlined text-xs">check</span>
      </div>
      <span className="text-[11px] font-bold text-slate-200">{label}</span>
    </div>
  );
}
