"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { ThemeToggle } from "../themeComponents/theme-toggle";

const navItems = [
  { label: "Dashboard", href: "/users/system/dashboard" },
  {
    label: "Jobs",
    href: "/users/system/jobs/active_jobs",
    activePattern: "/users/system/jobs",
  },
  { label: "Candidates", href: "/users/system/candidates" },
  { label: "Reports", href: "/users/system/reports" },
  { label: "Templates", href: "/users/system/templates" },
  { label: "Settings", href: "/users/system/settings" },
];

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <header className="h-16 border-b border-slate-500/10 bg-white/5 backdrop-blur-2xl flex items-center justify-between px-4 lg:px-10 sticky top-0 z-[70]">
      <div className="flex items-center gap-8">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        {/* Logo Section */}
        <div className="flex gap-4 items-center overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-xl ring-1 ring-white/20">
            <span className="material-symbols-outlined text-2xl font-bold">
              blur_on
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter whitespace-nowrap hidden xl:block text-[var(--text-main)]">
            SKILL{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              SLIGHT
            </span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-1 relative"
          onMouseLeave={() => setHoveredIndex(null)} // Ensures hover state clears correctly
        >
          {navItems.map((item, index) => {
            const isActive = item.activePattern
              ? pathname.startsWith(item.activePattern)
              : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-colors duration-300 ${
                  isActive
                    ? "text-primary"
                    : "text-slate-400 hover:text-[var(--text-main)]"
                }`}
              >
                {/* Background Sliding Hover */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="nav-hover-bg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                    />
                  )}
                </AnimatePresence>

                {/* Sliding Active Underline */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-line"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full z-10"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                    }}
                  />
                )}

                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right Side Items */}
      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex items-center gap-2">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
            <span className="material-symbols-outlined text-[24px]">
              notifications
            </span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--background)] animate-pulse"></span>
          </button>
          <ThemeToggle />
        </div>

        <div className="h-8 w-px bg-slate-500/20"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black leading-tight text-[var(--text-main)]">
              Alex Rivera
            </p>
            <p className="text-[10px] text-primary font-black uppercase tracking-tighter">
              Core Contributor
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-primary/20 overflow-hidden group-hover:border-primary transition-all">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--background)]"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
