"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

export default function JobsSideBar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const transitionSettings = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
  };

  const navLinks = [
    {
      icon: "rocket_launch",
      label: "Active Jobs",
      href: "/users/system/jobs/active_jobs",
      activePattern: "/users/system/jobs/active_jobs",
    },
    {
      icon: "add_circle",
      label: "Create Job",
      href: "/users/system/jobs/create/details",
      // Custom pattern to keep this active for any route under /create/
      activePattern: "/users/system/jobs/create",
    },
    {
      icon: "archive",
      label: "Closed Jobs",
      href: "/users/system/jobs/closed_jobs",
    },
    {
      icon: "content_copy",
      label: "Job Templates",
      href: "/users/system/jobs/templates",
    },
    {
      icon: "groups",
      label: "Hiring Teams",
      href: "/users/system/jobs/hiring-teams",
    },
  ];

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed && !isMobileOpen ? 80 : 288,
          x:
            typeof window !== "undefined" &&
            window.innerWidth < 1024 &&
            !isMobileOpen
              ? "-100%"
              : 0,
        }}
        transition={transitionSettings}
        className="fixed lg:relative top-0 left-0 h-full glass-panel border-r border-slate-500/10 flex flex-col z-[110] bg-[var(--surface)] dark:bg-[#121d18] lg:bg-transparent group/sidebar"
      >
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-4 top-4 w-8 h-8 bg-primary rounded-xl items-center justify-center text-white z-[70] shadow-premium transition-colors"
        >
          <motion.span
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            className="material-symbols-outlined text-sm font-bold"
          >
            chevron_left
          </motion.span>
        </motion.button>

        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Search Bar */}
          <div className="px-4 mt-6 mb-4">
            <div
              className={`relative flex items-center h-11 rounded-xl bg-slate-500/5 border border-slate-500/10 transition-all ${isCollapsed ? "justify-center" : "px-4"}`}
            >
              <span className="material-symbols-outlined text-slate-400 text-xl flex-shrink-0">
                search
              </span>
              {!isCollapsed && (
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 bg-transparent outline-none text-sm text-white w-full placeholder:text-slate-500"
                  placeholder="Search..."
                />
              )}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden pt-2">
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                link={link}
                pathname={pathname}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 mb-6 mt-auto">
            <button
              onClick={() => router.push("/auth/signin")}
              className={`w-full flex items-center h-12 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/5 transition-all ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}
            >
              <span className="material-symbols-outlined text-[26px]">
                logout
              </span>
              {!isCollapsed && (
                <span className="font-bold whitespace-nowrap">Logout</span>
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

function NavItem({ link, pathname, isCollapsed }: any) {
  // Logic to determine if active: check exact match OR if path starts with defined activePattern
  const isActive = link.activePattern
    ? pathname.startsWith(link.activePattern)
    : pathname === link.href;

  return (
    <Link
      href={link.href}
      className={`flex items-center h-12 rounded-xl transition-all cursor-pointer ${
        isActive
          ? "active-tab-gradient text-white shadow-md"
          : "hover:bg-slate-500/10 text-slate-500"
      } ${isCollapsed ? "justify-center" : "px-4 gap-4"}`}
    >
      <span className="material-symbols-outlined text-[26px] flex-shrink-0">
        {link.icon}
      </span>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex items-center justify-between overflow-hidden"
        >
          <span className="font-bold text-[16px] whitespace-nowrap">
            {link.label}
          </span>
        </motion.div>
      )}
    </Link>
  );
}
