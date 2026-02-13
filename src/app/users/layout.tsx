import Navbar from "@/components/layoutComponents/NavBar";
import Sidebar from "@/components/layoutComponents/SideBar";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* 1. Sidebar: Fixed on the left */}
      <Sidebar />

      {/* 2. Content Area: Navbar + Page Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
