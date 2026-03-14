"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { SidebarItem } from "./sidebarConfig";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
  /** Desktop nav items – section-specific links */
  items: SidebarItem[];
  /** Mobile nav items – full app navigation tree */
  mobileItems: SidebarItem[];
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  items,
  mobileItems,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const transitionSettings = {
    type: "spring" as const,
    stiffness: 400,
    damping: 40,
  };

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  return (
    <>
      {/* Mobile overlay backdrop */}
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

      {/* ── Desktop sidebar (sm+, hidden below sm) ── */}
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
        className="hidden sm:block fixed lg:relative top-0 left-0 h-full glass-panel border-r border-slate-500/10 flex flex-col bg-[var(--surface)] dark:bg-[#121d18] lg:bg-transparent group/sidebar"
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

          {/* Section-specific nav items (desktop) */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden pt-2">
            {items.map((link) => (
              <NavItemDesktop
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

      {/* ── Mobile sidebar (visible below lg when menu open) ── */}
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
        className="block lg:hidden fixed lg:relative top-0 left-0 h-full glass-panel border-r border-slate-500/10 flex flex-col z-[110] bg-[var(--surface)] dark:bg-[#121d18] lg:bg-transparent group/sidebar"
      >
        <motion.button
          whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-4 top-4 w-8 h-8 bg-primary rounded-xl items-center justify-center text-white border-1 border-[var(--background)] z-[70] shadow-premium transition-colors"
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

          {/* Full app navigation tree (mobile) */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden pt-2">
            {mobileItems.map((link) => (
              <NavItemMobile
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

// ─── Desktop nav item (flat links with optional activePattern) ────────────────
function NavItemDesktop({
  link,
  pathname,
  isCollapsed,
}: {
  link: SidebarItem;
  pathname: string;
  isCollapsed: boolean;
}) {
  const isActive = link.activePattern
    ? pathname.startsWith(link.activePattern)
    : pathname === link.href;

  return (
    <Link
      href={link.href ?? "#"}
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

// ─── Mobile nav item (supports collapsible sub-items) ────────────────────────
function NavItemMobile({
  link,
  pathname,
  isCollapsed,
}: {
  link: SidebarItem;
  pathname: string;
  isCollapsed: boolean;
}) {
  const hasSubItems = !!link.subItems && link.subItems.length > 0;
  const isSubActive =
    hasSubItems && link.subItems!.some((sub) => pathname === sub.href);
  const isActive = pathname === link.href || isSubActive;
  const [isOpen, setIsOpen] = useState(isSubActive);

  return (
    <div className="flex flex-col">
      <Link
        href={hasSubItems ? "#" : link.href ?? "#"}
        onClick={(e) => {
          if (hasSubItems) {
            e.preventDefault();
            if (!isCollapsed) setIsOpen(!isOpen);
          }
        }}
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
            {hasSubItems && (
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                className="material-symbols-outlined text-sm"
              >
                expand_more
              </motion.span>
            )}
          </motion.div>
        )}
      </Link>

      <AnimatePresence>
        {!isCollapsed && hasSubItems && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden ml-4 pl-8 border-l border-slate-500/20 mt-1"
          >
            {link.subItems!.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className={`block py-2 text-sm font-bold transition-all ${
                  pathname === sub.href
                    ? "text-primary"
                    : "text-slate-500 hover:text-primary"
                }`}
              >
                {sub.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
