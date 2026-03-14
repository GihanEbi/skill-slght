"use client";
import Sidebar from "@/components/layoutComponents/SideBar";
import Navbar from "@/components/layoutComponents/NavBar";
import {
  jobsNavItems,
  candidatesNavItems,
  settingsNavItems,
  mobileNavItems,
} from "@/components/layoutComponents/sidebarConfig";
import type { SidebarItem } from "@/components/layoutComponents/sidebarConfig";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

function getSidebarItems(pathname: string): SidebarItem[] {
  if (pathname.startsWith("/users/system/jobs")) return jobsNavItems;
  if (pathname.startsWith("/users/system/candidates"))
    return candidatesNavItems;
  if (pathname.startsWith("/users/system/settings")) return settingsNavItems;
  // fallback: return jobs items (or empty array if you prefer)
  return [];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems = getSidebarItems(pathname);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)]">
      {/* 1. Global Navbar: Stays fixed at the top */}
      <Navbar onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          items={sidebarItems}
          mobileItems={mobileNavItems}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
