"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// --- Types ---
type PoolType =
  | "Role Based"
  | "Pipeline Based"
  | "Source Based"
  | "Status Based"
  | "Custom"
  | "Smart Pool";

interface TalentPool {
  id: string;
  name: string;
  description: string;
  type: PoolType;
  accentColor: string;
  icon: string;
  candidateCount: number;
  lastUpdated: string;
  isSmart: boolean;
  candidates: string[];
}

// --- Page Implementation ---
export default function ViewPoolPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pool, setPool] = useState<TalentPool | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulated data fetch - in real app, fetch from local storage or API
    const mockPools: TalentPool[] = [
      {
        id: "1",
        name: "Silver Medalists",
        description:
          "Finalists who weren't selected but showed strong potential for future roles.",
        type: "Pipeline Based",
        accentColor: "bg-purple-500",
        icon: "🥈",
        candidateCount: 48,
        lastUpdated: "1 day ago",
        isSmart: true,
        candidates: [
          "/images/avatar-img/avatar-1.jpg",
          "/images/avatar-img/avatar-2.jpg",
          "/images/avatar-img/alkesh.png",
          "/images/avatar-img/avatar-4.jpg",
        ],
      },
      // ... additive mock data can be here
    ];

    const found = mockPools.find((p) => p.id === id) || mockPools[0];
    setPool(found);
    setLoading(false);
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen mesh-gradient flex items-center justify-center">
        <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  if (!pool) return <div className="p-20 text-center">Pool not found</div>;

  return (
    <div className="min-h-screen mesh-gradient space-y-8 animate-in fade-in duration-700">
      {/* Header & Navigation */}
      <div className="flex flex-col gap-6">
        <nav className="flex items-center gap-4">
          <button
            onClick={() => router.push("/users/system/candidates/talent_pool")}
            className="w-10 h-10 rounded-xl bg-(--surface) border border-(--border-subtle) flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex text-xs font-semibold items-center gap-2">
            <span className="text-(--text-muted) opacity-60">Talent Pools</span>
            <span className="text-(--text-muted) opacity-40">/</span>
            <span className="text-primary font-bold">{pool.name}</span>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            <div
              className={`w-20 h-20 rounded-4xl ${pool.accentColor}/10 flex items-center justify-center text-4xl shadow-sm border border-${pool.accentColor}/10 bg-(--surface)`}
            >
              {pool.icon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-black text-(--text-main) tracking-tight">
                  {pool.name}
                </h1>
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${pool.isSmart ? "bg-primary/10 text-primary border-primary/20" : "bg-(--background) text-(--text-muted) border-(--border-subtle)"}`}
                >
                  {pool.isSmart ? "Smart Pool" : "Manual Pool"}
                </div>
              </div>
              <p className="text-(--text-muted) text-sm font-medium mt-2 max-w-2xl leading-relaxed">
                {pool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-(--border-subtle) text-(--text-main) font-bold text-sm hover:border-primary/30 hover:bg-primary/5 transition-all bg-(--surface)">
              <span className="material-symbols-outlined text-xl">
                settings
              </span>
              Settings
            </button>
            <button className="active-tab-gradient px-8 py-3 rounded-2xl text-white font-bold text-sm flex items-center gap-2 shadow-premium hover:-translate-y-px transition-all">
              <span className="material-symbols-outlined text-xl">
                person_add
              </span>
              Add Candidates
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Candidates"
          value={pool.candidateCount.toString()}
          icon="groups"
          trend="+4 this week"
        />
        <StatsCard
          label="Source Diversity"
          value="85%"
          icon="hub"
          trend="High"
        />
        <StatsCard
          label="Hiring Velocity"
          value="12 days"
          icon="speed"
          trend="-2 days"
        />
        <StatsCard
          label="Last Synced"
          value={pool.lastUpdated}
          icon="sync"
          trend="Active"
        />
      </div>

      {/* Toolbar */}
      <div className="relative z-50 glass-panel p-2 rounded-2xl border-(--border-subtle) bg-(--surface)/50 flex flex-col md:flex-row items-center gap-2 shadow-sm">
        <div className="relative flex-1 group w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-(--text-muted) opacity-50 group-focus-within:text-primary transition-colors text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search candidates in this pool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-3 pl-12 pr-4 text-xs font-bold text-(--text-main) outline-none placeholder:font-medium placeholder:opacity-40"
          />
        </div>
        <div className="h-8 w-px bg-(--border-subtle) hidden md:block" />
        <div className="flex items-center gap-2 p-1">
          <div className="px-4 py-2 rounded-xl text-xs font-bold text-(--text-muted) flex items-center gap-2 hover:bg-primary/5 cursor-pointer">
            <span className="material-symbols-outlined text-lg">
              filter_list
            </span>
            Status
          </div>
          <div className="px-4 py-2 rounded-xl text-xs font-bold text-(--text-muted) flex items-center gap-2 hover:bg-primary/5 cursor-pointer">
            <span className="material-symbols-outlined text-lg">sort</span>
            Sort
          </div>
        </div>
      </div>

      {/* Candidates Grid/Table */}
      <div className="glass-panel rounded-4xl border-(--border-subtle) shadow-sm bg-(--surface)/30 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-(--background)/50 border-b border-(--border-subtle)">
                <th className="px-8 py-5 text-[10px] font-black text-(--text-muted) uppercase tracking-widest">
                  Candidate
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-(--text-muted) uppercase tracking-widest">
                  Role/Title
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-(--text-muted) uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-(--text-muted) uppercase tracking-widest text-center">
                  Score
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-(--text-muted) uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)/30">
              {[1, 2, 3, 4].map((i) => (
                <tr
                  key={i}
                  className="hover:bg-primary/5 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="size-11 rounded-2xl p-0.5 bg-(--surface) border border-(--border-subtle) shadow-sm overflow-hidden">
                        <img
                          src={`/images/avatar-img/avatar-${i}.jpg`}
                          alt="Avatar"
                          className="w-full h-full rounded-xl object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-(--text-main) group-hover:text-primary transition-colors">
                          Candidate Name {i}
                        </p>
                        <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wider">
                          #CAND-923{i}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-bold text-(--text-main)">
                      Senior Product Designer
                    </p>
                    <p className="text-[10px] text-(--text-muted) font-medium italic">
                      London, UK
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-(--text-main)">
                        94
                      </span>
                      <div className="w-12 h-1 bg-(--border-subtle) rounded-full mt-1 overflow-hidden">
                        <div className="w-[94%] h-full bg-primary" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2">
                      <button className="w-9 h-9 rounded-xl hover:bg-primary/10 flex items-center justify-center text-(--text-muted) hover:text-primary transition-all border border-transparent hover:border-primary/20">
                        <span className="material-symbols-outlined text-lg">
                          visibility
                        </span>
                      </button>
                      <button className="w-9 h-9 rounded-xl hover:bg-red-500/10 flex items-center justify-center text-(--text-muted) hover:text-red-500 transition-all border border-transparent hover:border-red-500/20">
                        <span className="material-symbols-outlined text-lg">
                          person_remove
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-(--border-subtle) bg-(--background)/10 flex items-center justify-between">
          <p className="text-xs text-(--text-muted) font-medium">
            Showing top candidates matching your pool criteria.
          </p>
          <button className="text-xs font-bold text-primary hover:underline">
            View All Candidates
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string;
  icon: string;
  trend: string;
}) {
  return (
    <div className="glass-panel p-6 rounded-4xl border-(--border-subtle) bg-(--surface)/50 shadow-sm flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div>
        <span className="text-2xl font-black text-(--text-main) block leading-tight">
          {value}
        </span>
        <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-widest mt-1 block">
          {label}
        </span>
        <span className="text-[10px] font-black text-emerald-500 mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">trending_up</span>
          {trend}
        </span>
      </div>
    </div>
  );
}
