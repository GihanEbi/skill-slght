"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AddCandidateProvider } from "@/context/AddCandidateContext";
import { motion } from "framer-motion";

const steps = [
  {
    id: "1",
    label: "Details",
    icon: "description",
    path: "/users/system/candidates/Add_candidate/basic_info",
  },
  {
    id: "2",
    label: "Status",
    icon: "event_available",
    path: "/users/system/candidates/Add_candidate/current_role_availability",
  },
  {
    id: "3",
    label: "Skills",
    icon: "app_registration",
    path: "/users/system/candidates/Add_candidate/skills",
  },
  {
    id: "4",
    label: "Experience",
    icon: "work_history",
    path: "/users/system/candidates/Add_candidate/work_experience",
  },
  {
    id: "5",
    label: "Education",
    icon: "school",
    path: "/users/system/candidates/Add_candidate/education",
  },
  {
    id: "6",
    label: "Documents",
    icon: "upload_file",
    path: "/users/system/candidates/Add_candidate/document_resume",
  },
  {
    id: "7",
    label: "Review",
    icon: "visibility",
    path: "/users/system/candidates/Add_candidate/consent_tags",
  },
];

import { Suspense } from "react";

function AddCandidateLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const currentStepIndex = steps.findIndex((step) => step.path === pathname);

  const getStepPath = (path: string) => {
    return editId ? `${path}?id=${editId}` : path;
  };

  return (
    <AddCandidateProvider>
      <div className="min-h-screen flex flex-col mesh-gradient bg-[var(--background)] no-scrollbar">
        {/* ── Stepper Header (Matching Job Theme) ─────────────────────────── */}
        <header className="w-full px-4 pt-8 md:pt-12 border-b border-(--border-subtle)/30 pb-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between relative px-2">
            {steps.map((step, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const stepPath = getStepPath(step.path);

              return (
                <React.Fragment key={step.id}>
                  <div
                    onClick={() => router.push(stepPath)}
                    className="flex flex-col items-center gap-2 z-10 cursor-pointer group"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? "bg-primary text-white shadow-glow ring-4 ring-primary/10"
                          : isActive
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
                        {step.icon}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-black hidden sm:block tracking-widest uppercase ${
                        isCurrent
                          ? "text-primary"
                          : isActive
                            ? "text-[var(--text-main)] transition-colors"
                            : "text-[var(--text-muted)] opacity-60"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-px bg-[var(--border-subtle)] mx-2 translate-y-[-14px] sm:translate-y-[-16px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isActive ? "100%" : "0%" }}
                        className="h-full bg-primary/40"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </header>

        {/* ── Page Content ─────────────────────────────────────────────────── */}
        <div className="flex-1 max-w-7xl mx-auto w-full">{children}</div>
      </div>
    </AddCandidateProvider>
  );
}

export default function AddCandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-(--background)">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
          <p className="text-xs font-bold text-(--text-muted) uppercase tracking-widest animate-pulse">
            Initializing Pipeline...
          </p>
        </div>
      }
    >
      <AddCandidateLayoutContent>{children}</AddCandidateLayoutContent>
    </Suspense>
  );
}
