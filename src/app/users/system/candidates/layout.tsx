"use client";
import Navbar from "@/components/layoutComponents/NavBar";
import Sidebar from "@/components/layoutComponents/SideBar";
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
      {/* 1. Navbar is now global at the very top */}
      <Navbar onMenuClick={() => setIsMobileOpen(true)} />

      {/* 2. Lower section contains both Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
