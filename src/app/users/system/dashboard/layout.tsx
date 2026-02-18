"use client";
import JobsSideBar from "@/components/layoutComponents/JobsSidBar";
import Navbar from "@/components/layoutComponents/NavBar"; // Import your Navbar
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--background)]">
      {/* 1. Global Navbar: Stays fixed at the top */}
      <Navbar onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />

      {/* 2. Content Wrapper: Holds Sidebar and Main Content below the Navbar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* <JobsSideBar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        /> */}

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
