"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddCandidate } from "@/context/AddCandidateContext";
import { CandidateSource } from "@/types/candidate_types";
import { motion, AnimatePresence } from "framer-motion";

export default function BasicInfoStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const { formData, updateStepData, syncToMaster } = useAddCandidate();
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isSourceOpen, setIsSourceOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editId) {
      setProfileImage("/images/avatar-img/avatar-1.jpg");
    }
  }, [editId]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string | undefined> = {};
    if (!formData.step1.firstName)
      newErrors.firstName = "First name is required";
    if (!formData.step1.lastName) newErrors.lastName = "Last name is required";
    if (!formData.step1.email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.step1.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.step1.country) newErrors.country = "Country is required";
    if (!formData.step1.source) newErrors.source = "Source is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      syncToMaster(); // Save progress to master if editing
      const nextPath =
        "/users/system/candidates/Add_candidate/current_role_availability";
      router.push(editId ? `${nextPath}?id=${editId}` : nextPath);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    updateStepData("step1", { [name]: val });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* ── Main Content Area (8/4 Grid) ─────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Form Panel (8 cols) ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-10"
          >
            {/* Page Header */}
            <div className="mb-10 pb-4 border-b border-[var(--border-subtle)]">
              <h1 className="text-2xl md:text-3xl font-bold text-(--text-main) mb-2 tracking-tight">
                Basic Information
              </h1>
              <p className="text-sm text-(--text-muted) font-medium">
                Establish the candidate's core identity and contact parameters
                for the recruitment pipeline.
              </p>
            </div>

            <div className="space-y-12">
              {/* Identity Section */}
              <section className="space-y-6">
                <div className="flex flex-col items-center justify-center mb-10">
                  <div className="relative group">
                    <div
                      onClick={handleImageClick}
                      className="w-32 h-32 rounded-full border-4 border-(--border-subtle) bg-(--surface) overflow-hidden cursor-pointer hover:border-primary/50 transition-all shadow-lg flex items-center justify-center relative"
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-(--text-muted) opacity-60">
                          <span className="material-symbols-outlined text-4xl">
                            add_a_photo
                          </span>
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="material-symbols-outlined text-white">
                          edit
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <div className="absolute -bottom-2 right-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-4 border-(--background)">
                      <span className="material-symbols-outlined text-lg">
                        camera_alt
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mt-4">
                    Candidate Portrait
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      First Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.step1.firstName}
                      onChange={handleChange}
                      className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.firstName ? "border-red-400/60 focus:border-red-400" : ""}`}
                      placeholder="e.g. John"
                    />
                    {errors.firstName && <FieldError msg={errors.firstName} />}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Last Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.step1.lastName}
                      onChange={handleChange}
                      className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.lastName ? "border-red-400/60 focus:border-red-400" : ""}`}
                      placeholder="e.g. Doe"
                    />
                    {errors.lastName && <FieldError msg={errors.lastName} />}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.step1.email}
                    onChange={handleChange}
                    className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.email ? "border-red-400/60 focus:border-red-400" : ""}`}
                    placeholder="e.g. john.doe@techneura.com"
                  />
                  {errors.email && <FieldError msg={errors.email} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.step1.phone || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.step1.whatsapp || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </section>

              {/* Location Section */}
              <section className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
                  Location Context
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Country <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.step1.country}
                      onChange={handleChange}
                      className={`premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30 ${errors.country ? "border-red-400/60 focus:border-red-400" : ""}`}
                      placeholder="e.g. United Kingdom"
                    />
                    {errors.country && <FieldError msg={errors.country} />}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.step1.city || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. London"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Timezone
                    </label>
                    <input
                      type="text"
                      name="timezone"
                      value={formData.step1.timezone || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-base font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. GMT+0"
                    />
                  </div>
                  <div className="pt-6">
                    <label className="flex items-center gap-4 p-5 rounded-2xl border border-(--border-subtle) bg-(--surface)/40 cursor-pointer hover:bg-primary/5 transition-all group">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.step1.willingToRelocate ? "bg-primary border-primary" : "border-(--border-subtle)"}`}
                      >
                        {formData.step1.willingToRelocate && (
                          <span className="material-symbols-outlined text-white text-sm">
                            check
                          </span>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        name="willingToRelocate"
                        checked={!!formData.step1.willingToRelocate}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-sm font-bold text-(--text-muted) group-hover:text-primary transition-colors">
                        Open to Relocation
                      </span>
                      <span className="material-symbols-outlined text-(--text-muted) opacity-40 ml-auto group-hover:text-primary group-hover:opacity-100 transition-colors">
                        travel_explore
                      </span>
                    </label>
                  </div>
                </div>
              </section>

              {/* Profile & Source Section */}
              <section className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[2px] text-primary/80 mb-2">
                  Profile & Origin
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      LinkedIn URL
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-(--text-muted) opacity-50 text-lg">
                        link
                      </span>
                      <input
                        type="url"
                        name="linkedInUrl"
                        value={formData.step1.linkedInUrl || ""}
                        onChange={handleChange}
                        className="premium-input rounded-2xl py-3.5 pl-12 pr-5 md:py-4 md:px-6 md:pl-14 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Portfolio / Personal Web
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-(--text-muted) opacity-50 text-lg">
                        public
                      </span>
                      <input
                        type="url"
                        name="portfolioUrl"
                        value={formData.step1.portfolioUrl || ""}
                        onChange={handleChange}
                        className="premium-input rounded-2xl py-3.5 pl-12 pr-5 md:py-4 md:px-6 md:pl-14 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                        placeholder="portfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Custom Source Dropdown */}
                  <div className="space-y-2 relative">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Candidate Source <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsSourceOpen((o) => !o)}
                      className={`w-full premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) flex items-center justify-between hover:border-primary/50 transition-all ${errors.source ? "border-red-400/60" : ""}`}
                    >
                      <span className="capitalize">
                        {formData.step1.source?.replace("_", " ")}
                      </span>
                      <motion.span
                        animate={{ rotate: isSourceOpen ? 180 : 0 }}
                        className="material-symbols-outlined text-primary"
                      >
                        expand_more
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isSourceOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 4 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="absolute w-full z-110 bg-(--surface) rounded-2xl border border-(--glass-border) shadow-2xl overflow-hidden p-1 max-h-64 overflow-y-auto"
                          >
                            {Object.values(CandidateSource).map((src) => (
                              <button
                                key={src}
                                type="button"
                                onClick={() => {
                                  updateStepData("step1", { source: src });
                                  setIsSourceOpen(false);
                                  setErrors(({ source, ...p }) => p);
                                }}
                                className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors rounded-xl capitalize ${formData.step1.source === src ? "text-primary bg-primary/10" : "text-(--text-main) hover:bg-primary/5"}`}
                              >
                                {src.replace("_", " ")}
                              </button>
                            ))}
                          </motion.div>
                          <div
                            className="fixed inset-0 z-100"
                            onClick={() => setIsSourceOpen(false)}
                          />
                        </>
                      )}
                    </AnimatePresence>
                    {errors.source && <FieldError msg={errors.source} />}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-(--text-muted) ml-1 flex items-center gap-1 uppercase tracking-wider">
                      Source Detail
                    </label>
                    <input
                      type="text"
                      name="sourceDetail"
                      value={formData.step1.sourceDetail || ""}
                      onChange={handleChange}
                      className="premium-input rounded-2xl py-3.5 px-5 md:py-4 md:px-6 text-sm font-bold text-(--text-main) transition-all placeholder:font-medium placeholder:opacity-30"
                      placeholder="e.g. LinkedIn Recruiter Campaign"
                    />
                  </div>
                </div>
              </section>
            </div>
          </motion.div>

          {/* ── Sidebar (4 cols) ───────────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 lg:sticky lg:top-10 space-y-6"
          >
            {/* AI Assistant Card (Matching Job Theme) */}
            <div className="glass-panel rounded-4xl p-8 shadow-glow relative overflow-hidden border-primary/10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-lg text-white">
                    <span className="material-symbols-outlined text-2xl">
                      psychology
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-(--text-main) uppercase tracking-wider text-xs">
                      AI Extraction
                    </h3>
                    <p className="text-[11px] text-primary font-bold animate-pulse tracking-tight">
                      Active Analysis
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-xs text-(--text-muted) italic leading-relaxed text-center font-medium">
                    {formData.step1.email
                      ? `Candidate "${formData.step1.firstName}" is being indexed into the Talent Pool.`
                      : "Start typing to see real-time candidate profiling insights."}
                  </p>
                </div>
              </div>
            </div>

            {/* Live Summary Card (Matching Job Theme) */}
            <div className="glass-panel rounded-4xl p-6 border-(--border-subtle) shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-4">
                Profile Preview
              </h4>
              <div className="space-y-4">
                <SummaryRow
                  label="Name"
                  value={
                    `${formData.step1.firstName || ""} ${formData.step1.lastName || ""}`.trim() ||
                    "—"
                  }
                />
                <SummaryRow label="Email" value={formData.step1.email || "—"} />
                <SummaryRow
                  label="Origin"
                  value={formData.step1.country || "—"}
                />
                <SummaryRow
                  label="Source"
                  value={formData.step1.source?.replace("_", " ") || "—"}
                />
                <SummaryRow
                  label="Relocating"
                  value={formData.step1.willingToRelocate ? "Yes" : "No"}
                />
              </div>
            </div>
          </motion.aside>
        </div>
      </main>

      {/* ── Sticky Footer (Matching Job Theme) ────────────────────────────── */}
      <footer className="mt-auto border-t border-(--border-subtle) bg-(--background)/80 backdrop-blur-md z-90 shadow-premium">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button
            disabled
            className="flex items-center gap-2 text-(--text-muted) font-bold text-sm cursor-not-allowed group opacity-30"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                router.push("/users/system/candidates/all_candidates")
              }
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-(--border-subtle) text-(--text-muted) font-bold text-sm hover:border-primary/30 hover:text-primary transition-all"
            >
              <span className="material-symbols-outlined text-base">close</span>
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="active-tab-gradient px-8 md:px-12 py-3 rounded-xl text-white font-bold text-sm flex items-center gap-3 hover:-translate-y-px transition-all shadow-premium"
            >
              Next: Current Role
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

// ── Sub-components (Internal) ─────────────────────────────────────────────

function FieldError({ msg }: { msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[11px] font-semibold text-red-500 ml-1 flex items-center gap-1"
    >
      <span className="material-symbols-outlined text-sm">error</span>
      {msg}
    </motion.p>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black uppercase tracking-widest text-(--text-muted)">
        {label}
      </span>
      <span className="text-xs font-bold text-(--text-main) text-right truncate max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
