"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    router.push("/auth/signin");
  };

  const navLinks = [
    {
      icon: "grid_view",
      label: "Dashboard",
      href: "/users/system/dashboard",
    },
    {
      icon: "rocket_launch",
      label: "Jobs",
      href: "/users/system/jobs",
      subItems: [
        { label: "Create Job", href: "/users/system/jobs/create" },
        { label: "Active Jobs", href: "/users/system/jobs/active" },
        { label: "Closed Jobs", href: "/users/system/jobs/closed" },
        { label: "Job Templates", href: "/users/system/jobs/templates" },
        { label: "Hiring Team", href: "/users/system/jobs/team" },
      ],
    },
    {
      icon: "diversity_3",
      label: "Candidates",
      // href: "/users/system/candidates",
      subItems: [
        { label: "All Candidates", href: "/users/system/candidates" },
        { label: "Talent Pools", href: "/users/system/candidates/pools" },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex w-72 glass-panel border-r flex-shrink-0 flex-col z-50">
      <div className="flex flex-col items-center mt-4">
        <div className="flex gap-4">
          <div className="w-11 h-11 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 ring-1 ring-white/20">
            <span className="material-symbols-outlined text-4xl font-bold">
              blur_on
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tighter ">
            SKILL{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              SLIGHT
            </span>
          </h1>
        </div>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-500/10"></div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navLinks.map((link) => (
          <NavItem key={link.label} link={link} pathname={pathname} />
        ))}
      </nav>

      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-500/10"></div>
        </div>
      </div>

      <div className="p-4 mt-auto mb-6">
        <button
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-slate-500 hover:text-red-500 transition-all"
          onClick={() => {
            logout();
          }}
        >
          <span className="material-symbols-outlined text-[26px]">logout</span>
          <span className="font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ link, pathname }: any) {
  const hasSubItems = link.subItems && link.subItems.length > 0;

  // Check if current path matches main link or any sub-item
  const isMainActive = pathname === link.href;
  const isSubActive =
    hasSubItems && link.subItems.some((sub: any) => pathname === sub.href);
  const isActive = isMainActive || isSubActive;

  // Collapse state: open by default if a sub-item is active
  const [isOpen, setIsOpen] = useState(isSubActive);

  // Sync open state when navigating via URL/Breadcrumbs
  useEffect(() => {
    if (isSubActive) setIsOpen(true);
  }, [pathname, isSubActive]);

  return (
    <div className="flex flex-col">
      {/* Main Item */}
      {hasSubItems ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all cursor-pointer w-full ${
            isActive
              ? "active-tab-gradient text-white shadow-md"
              : "hover:bg-slate-500/10 text-slate-500"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <span className="material-symbols-outlined text-[26px]">
              {link.icon}
            </span>
            <span className="font-bold text-[16px]">{link.label}</span>
          </div>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="material-symbols-outlined text-sm"
          >
            expand_more
          </motion.span>
        </button>
      ) : (
        <Link
          href={link.href}
          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all cursor-pointer ${
            isActive
              ? "active-tab-gradient text-white shadow-md"
              : "hover:bg-slate-500/10 text-slate-500"
          }`}
        >
          <span className="material-symbols-outlined text-[26px]">
            {link.icon}
          </span>
          <span className="font-bold text-[16px]">{link.label}</span>
        </Link>
      )}

      {/* Collapsible Sub-Items */}
      <AnimatePresence>
        {hasSubItems && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col mt-1.5 space-y-1 ml-4 pl-8 border-l border-slate-500/20">
              {link.subItems.map((sub: any) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                    pathname === sub.href
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-slate-500 hover:text-[var(--text-main)] hover:bg-slate-500/5"
                  }`}
                >
                  {sub.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
