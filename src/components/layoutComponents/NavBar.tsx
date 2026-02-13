"use client";
import { ThemeToggle } from "../themeComponents/theme-toggle";

export default function Navbar() {
  return (
    <header className="h-16 border-b border-slate-500/10 bg-white/5 backdrop-blur-2xl flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
      {/* Left Section: Search */}
      <div className="flex items-center gap-8 flex-1 max-w-2xl">
        <div className="relative w-full max-w-md group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors text-xl">
            search
          </span>
          <input
            className="w-full pl-12 pr-6 py-2 bg-slate-500/5 border border-slate-500/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm"
            placeholder="Search talent pool..."
          />
        </div>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-3 lg:gap-6">
        <div className="flex items-center gap-2">
          {/* Notification Icon */}
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-all group">
            <span className="material-symbols-outlined text-[24px]">
              notifications
            </span>
            {/* Notification Dot */}
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--background)] animate-pulse"></span>
          </button>

          <ThemeToggle />
        </div>

        <div className="h-8 w-px bg-slate-500/20"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black leading-tight">Alex Rivera</p>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">
              Core Contributor
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-blue-500/20 overflow-hidden group-hover:border-blue-500/50 transition-all">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Online Status Dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--background)]"></span>
          </div>
        </div>
      </div>
    </header>
  );
}
