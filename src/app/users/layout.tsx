"use client";
import Navbar from "@/components/layoutComponents/NavBar";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // We keep the mobile state to pass to the Navbar for the hamburger menu
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)]">
      {/* 1. Global Navbar: Stays fixed at the top */}
      {/* <Navbar onMenuClick={() => setIsMobileOpen(!isMobileOpen)} /> */}

      {/* 2. Main Content Area: Takes up 100% width and height below Navbar */}
      <div className="flex-1 overflow-hidden relative">
        <main className="h-full w-full overflow-y-auto custom-scrollbar">
          {/* Children (pages) will now span the full width.
              If a child page has its own sidebar, it will be
              rendered inside this container.
          */}
          {children}
        </main>
      </div>
    </div>
  );
}
