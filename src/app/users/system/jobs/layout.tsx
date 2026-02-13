"use client";
import JobsSideBar from "@/components/layoutComponents/JobsSidBar";
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
      <div className="flex flex-1 overflow-hidden relative">
        <JobsSideBar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Changed 'custom-scrollbar' to 'no-scrollbar' */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
