"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  label: string;
  interviewer: string;
  mode: "Video Call" | "On-site" | "Phone";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PROPOSED_SLOTS: TimeSlot[] = [
  {
    id: "slot-1",
    date: new Date(2026, 2, 17),
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    label: "Morning Session",
    interviewer: "Sarah Mitchell",
    mode: "Video Call",
  },
  {
    id: "slot-2",
    date: new Date(2026, 2, 18),
    startTime: "14:00",
    endTime: "15:00",
    duration: 60,
    label: "Afternoon Session",
    interviewer: "James Carter",
    mode: "Video Call",
  },
  {
    id: "slot-3",
    date: new Date(2026, 2, 19),
    startTime: "09:30",
    endTime: "10:30",
    duration: 60,
    label: "Morning Session",
    interviewer: "Sarah Mitchell",
    mode: "Video Call",
  },
  {
    id: "slot-4",
    date: new Date(2026, 2, 21),
    startTime: "15:00",
    endTime: "16:00",
    duration: 60,
    label: "Late Afternoon",
    interviewer: "Alex Rivera",
    mode: "Video Call",
  },
  {
    id: "slot-5",
    date: new Date(2026, 2, 24),
    startTime: "11:00",
    endTime: "12:00",
    duration: 60,
    label: "Late Morning",
    interviewer: "James Carter",
    mode: "Video Call",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const MODE_CONFIG = {
  "Video Call": {
    icon: "videocam",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
    gradient: "from-blue-500/20 to-blue-600/10",
    dot: "#3b82f6",
  },
  "On-site": {
    icon: "location_on",
    color: "text-violet-500",
    bg: "bg-violet-500/10 border-violet-500/20",
    gradient: "from-violet-500/20 to-violet-600/10",
    dot: "#8b5cf6",
  },
  "Phone": {
    icon: "phone",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
    gradient: "from-amber-500/20 to-amber-600/10",
    dot: "#f59e0b",
  },
};

// ─── SkillSight Logo SVG ───────────────────────────────────────────────────────
function SkillSightLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="logoGrad2" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      {/* Hexagon background */}
      <path
        d="M20 2L36 11V29L20 38L4 29V11L20 2Z"
        fill="url(#logoGrad)"
        opacity="0.15"
      />
      <path
        d="M20 4L34 12.5V27.5L20 36L6 27.5V12.5L20 4Z"
        stroke="url(#logoGrad)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Stylised eye / sight */}
      <ellipse cx="20" cy="20" rx="7" ry="5" stroke="url(#logoGrad)" strokeWidth="1.8" fill="none" />
      <circle cx="20" cy="20" r="2.5" fill="url(#logoGrad2)" />
      {/* Skill lines */}
      <line x1="10" y1="17" x2="13" y2="17" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="17" x2="30" y2="17" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="23" x2="13" y2="23" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27" y1="23" x2="30" y2="23" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Horizontal Slot Card ─────────────────────────────────────────────────────
function SlotCard({
  slot,
  isSelected,
  isDisabled,
  selectionOrder,
  onToggle,
}: {
  slot: TimeSlot;
  isSelected: boolean;
  isDisabled: boolean;
  selectionOrder: number;
  onToggle: () => void;
}) {
  const mode = MODE_CONFIG[slot.mode];

  return (
    <button
      onClick={onToggle}
      disabled={isDisabled && !isSelected}
      aria-pressed={isSelected}
      id={`slot-card-${slot.id}`}
      className={`
        group relative flex-shrink-0 w-[220px] rounded-3xl border-2 p-5 text-left
        transition-all duration-300 ease-out
        ${isSelected
          ? "border-primary shadow-xl shadow-primary/20 scale-[1.02]"
          : isDisabled
          ? "border-[var(--border-subtle)] opacity-40 cursor-not-allowed"
          : "border-[var(--border-subtle)] hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.01] cursor-pointer"
        }
      `}
      style={
        isSelected
          ? {
              background: "linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.06) 100%)",
            }
          : { background: "var(--surface)" }
      }
    >
      {/* Selection glow ring */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: "inset 0 0 0 1.5px rgba(16,185,129,0.3)",
            background: "linear-gradient(145deg, rgba(16,185,129,0.05), transparent 60%)",
          }}
        />
      )}

      {/* Top section: Date block + selection badge */}
      <div className="flex items-start justify-between mb-4">
        {/* Date block */}
        <div
          className={`rounded-2xl px-3 py-2 flex flex-col items-center transition-all duration-300 ${
            isSelected
              ? "bg-primary shadow-lg shadow-primary/25"
              : "bg-primary/8 group-hover:bg-primary/14"
          }`}
        >
          <span
            className={`text-[9px] font-black uppercase tracking-widest leading-none ${
              isSelected ? "text-white/75" : "text-primary/60"
            }`}
          >
            {DAYS_SHORT[slot.date.getDay()]}
          </span>
          <span
            className={`text-2xl font-black leading-none mt-0.5 ${
              isSelected ? "text-white" : "text-primary"
            }`}
          >
            {slot.date.getDate()}
          </span>
          <span
            className={`text-[9px] font-semibold leading-none mt-0.5 ${
              isSelected ? "text-white/65" : "text-primary/50"
            }`}
          >
            {MONTHS_SHORT[slot.date.getMonth()]}
          </span>
        </div>

        {/* Selection indicator */}
        {isSelected ? (
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30 transition-all duration-300 scale-110">
            <span className="text-white font-black text-[11px]">{selectionOrder}</span>
          </div>
        ) : (
          <div
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isDisabled
                ? "border-[var(--border-subtle)]"
                : "border-[var(--border-subtle)] group-hover:border-primary/50"
            }`}
          >
            <span className="material-symbols-outlined text-[var(--text-muted)] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              add
            </span>
          </div>
        )}
      </div>

      {/* Time */}
      <div className="mb-1">
        <p className={`text-[15px] font-black leading-tight ${isSelected ? "text-primary" : "text-[var(--text-main)]"}`}>
          {formatTime(slot.startTime)}
          <span className="text-[var(--text-muted)] font-medium text-sm mx-1">–</span>
          {formatTime(slot.endTime)}
        </p>
      </div>

      {/* Label */}
      <p className="text-[11px] text-[var(--text-muted)] font-semibold mb-3">
        {slot.label} · {slot.duration} min
      </p>

      {/* Mode badge */}
      <div
        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${mode.bg} ${mode.color} mb-3`}
      >
        <span className="material-symbols-outlined text-[11px]">{mode.icon}</span>
        {slot.mode}
      </div>

      {/* Interviewer */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
        <span className="material-symbols-outlined text-[var(--text-muted)] text-sm">person</span>
        <span className="text-[11px] text-[var(--text-muted)] font-medium truncate">{slot.interviewer}</span>
      </div>
    </button>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ slots, remarks }: { slots: TimeSlot[]; remarks: string }) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-secondary/4 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <SkillSightLogo size={36} />
        <span className="text-lg font-black text-[var(--text-main)] tracking-tight">
          Skill<span className="text-primary">Sight</span>
        </span>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Success icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
              <span className="material-symbols-outlined text-white text-5xl">task_alt</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-[var(--text-main)] mb-2">Availability Submitted!</h1>
          <p className="text-[var(--text-muted)] leading-relaxed max-w-sm mx-auto">
            Your preferred slots have been sent to the hiring manager for review.
          </p>
        </div>

        {/* Email notification banner */}
        <div
          className="rounded-2xl p-4 mb-5 flex items-start gap-4"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.05) 100%)",
            border: "1px solid rgba(16,185,129,0.25)",
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/25">
            <span className="material-symbols-outlined text-white text-xl">mark_email_read</span>
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text-main)] mb-0.5">Check your inbox</p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              We&apos;ll send you an email once the hiring manager reviews your availability and confirms your interview slot.
              Please keep an eye on your inbox — including your spam folder.
            </p>
          </div>
        </div>

        {/* Summary card */}
        <div className="glass-panel rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-[var(--border-subtle)] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-base">checklist</span>
            <span className="text-sm font-bold text-[var(--text-main)]">Your Selected Slots</span>
            <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {slots.length} slot{slots.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            {slots.map((slot, i) => (
              <div key={slot.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
                  <span className="text-white font-black text-xs">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[var(--text-main)]">
                    {DAYS_FULL[slot.date.getDay()]}, {MONTHS_SHORT[slot.date.getMonth()]} {slot.date.getDate()}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                    <span className="inline-flex items-center gap-1 ml-2">
                      <span className="material-symbols-outlined text-blue-500 text-[11px]">videocam</span>
                      <span className="text-blue-500 font-medium">Video Call</span>
                    </span>
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              </div>
            ))}
          </div>
          {remarks && (
            <div className="px-5 py-3.5 border-t border-[var(--border-subtle)] bg-[var(--surface)]/50">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Remarks</p>
              <p className="text-xs text-[var(--text-main)] leading-relaxed">{remarks}</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[var(--text-muted)]">You may safely close this window.</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TimePickerPage() {
  const params = useParams();
  const interviewId = params?.id as string;

  const MAX_SELECTIONS = 3;
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedSlots = PROPOSED_SLOTS.filter((s) => selectedSlotIds.includes(s.id));
  const canSubmit = selectedSlotIds.length > 0 && !submitting;

  const toggleSlot = (slot: TimeSlot) => {
    setSelectedSlotIds((prev) => {
      if (prev.includes(slot.id)) return prev.filter((id) => id !== slot.id);
      if (prev.length >= MAX_SELECTIONS) return prev;
      return [...prev, slot.id];
    });
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1600));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) return <SuccessScreen slots={selectedSlots} remarks={remarks} />;

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-[-120px] right-[-120px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-80px] left-[-80px] w-[420px] h-[420px] bg-secondary/4 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] glass-panel">
        <div className="max-w-5xl mx-auto px-5 lg:px-10 h-16 flex items-center gap-4">

          {/* Logo + Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <SkillSightLogo size={32} />
            <span className="text-base font-black text-[var(--text-main)] tracking-tight hidden sm:block">
              Skill<span className="text-primary">Sight</span>
            </span>
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-[var(--border-subtle)] mx-1 flex-shrink-0" />

          {/* Page label */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[var(--text-main)] leading-tight truncate">
              Schedule Technical Interview
            </p>
            <p className="text-[10px] text-[var(--text-muted)] hidden sm:block">
              Ref:{" "}
              <span className="text-primary font-bold">{interviewId}</span>
            </p>
          </div>

          {/* Selection counter */}
          <div
            className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all duration-300 flex-shrink-0 ${
              selectedSlotIds.length > 0
                ? "bg-primary/10 border-primary/30 text-primary"
                : "bg-[var(--surface)] border-[var(--border-subtle)] text-[var(--text-muted)]"
            }`}
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{selectedSlotIds.length} / {MAX_SELECTIONS}</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-5 lg:px-10 py-8 pb-32 lg:pb-8">

        {/* ── HERO SECTION ── */}
        <div className="glass-panel rounded-3xl p-6 lg:p-8 mb-8 relative overflow-hidden">
          {/* Background accent */}
          <div
            className="absolute top-0 right-0 w-64 h-full rounded-r-3xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, transparent 0%, rgba(16,185,129,0.04) 100%)",
            }}
          />

          <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Left: Text */}
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-3 py-1 mb-4">
                <span className="material-symbols-outlined text-primary text-sm">work</span>
                <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                  Technical Interview
                </span>
              </div>

              <h1 className="text-2xl lg:text-3xl font-black text-[var(--text-main)] leading-snug mb-2">
                Choose Your Preferred{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(90deg, #10b981, #059669)" }}
                >
                  Interview Slots
                </span>
              </h1>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-lg">
                The hiring manager has proposed{" "}
                <strong className="text-[var(--text-main)]">5 time slots</strong>. Pick up to{" "}
                <strong className="text-primary">3 preferences</strong> that work best for you and add any notes before submitting.
              </p>
            </div>

            {/* Right: Stats grid */}
            <div className="grid grid-cols-2 gap-3 lg:w-[280px] flex-shrink-0">
              {[
                { icon: "timer", label: "Duration", value: "60 min" },
                { icon: "group", label: "Format", value: "1-on-1" },
                { icon: "videocam", label: "Mode", value: "Video / On-site" },
                { icon: "checklist", label: "Max picks", value: "Up to 3 slots" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-2xl p-3"
                  style={{ background: "var(--input-bg)", border: "1px solid var(--input-border)" }}
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-sm">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{item.label}</p>
                    <p className="text-xs font-bold text-[var(--text-main)]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── HORIZONTAL SLOT CARDS ── */}
        <div className="mb-8">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-base font-black text-[var(--text-main)]">Proposed Time Slots</h2>
            <span className="text-xs text-[var(--text-muted)]">
              {PROPOSED_SLOTS.length} slots available
            </span>
            {selectedSlotIds.length >= MAX_SELECTIONS && (
              <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-amber-600 bg-amber-500/8 border border-amber-500/20 px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-sm">info</span>
                Max reached
              </div>
            )}
          </div>

          {/* Horizontal scroll container */}
          <div
            className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {PROPOSED_SLOTS.map((slot) => {
              const isSelected = selectedSlotIds.includes(slot.id);
              const orderPos = selectedSlotIds.indexOf(slot.id) + 1;
              const isDisabled = !isSelected && selectedSlotIds.length >= MAX_SELECTIONS;
              return (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  isSelected={isSelected}
                  isDisabled={isDisabled}
                  selectionOrder={orderPos}
                  onToggle={() => toggleSlot(slot)}
                />
              );
            })}
          </div>

          {/* Tip */}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <span className="material-symbols-outlined text-sm">swipe</span>
            Scroll horizontally to see all slots
          </div>
        </div>

        {/* ── BOTTOM SECTION: Selections + Remarks + Submit ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* Remarks */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary text-lg">edit_note</span>
              <h3 className="text-sm font-bold text-[var(--text-main)]">Remarks</h3>
              <span className="ml-auto text-[10px] text-[var(--text-muted)]">Optional</span>
            </div>
            <textarea
              id="remarks-input"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any notes for the interviewer? e.g., scheduling constraints, preferred format…"
              rows={4}
              maxLength={500}
              className="w-full resize-none text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] rounded-xl px-3 py-2.5 outline-none transition-all duration-200"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--input-border)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#10b981";
                e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--input-border)";
                e.target.style.boxShadow = "none";
              }}
            />
            <div className="flex justify-end mt-1">
              <span className="text-[10px] text-[var(--text-muted)]">{remarks.length}/500</span>
            </div>
          </div>

          {/* Right: Selections summary + Submit */}
          <div className="flex flex-col gap-4">

            {/* Selection summary */}
            <div className="glass-panel rounded-2xl p-5 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-primary text-lg">playlist_add_check</span>
                <h3 className="text-sm font-bold text-[var(--text-main)]">Your Selections</h3>
                <span className="ml-auto text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {selectedSlotIds.length}/{MAX_SELECTIONS}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[var(--border-subtle)] rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(selectedSlotIds.length / MAX_SELECTIONS) * 100}%`,
                    background: "linear-gradient(90deg, #10b981, #059669)",
                  }}
                />
              </div>

              {selectedSlots.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] text-center py-3">
                  No slots selected yet
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedSlots.map((slot, i) => (
                    <div key={slot.id} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/20">
                        <span className="text-white text-[9px] font-black">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--text-main)] leading-tight">
                          {DAYS_SHORT[slot.date.getDay()]}, {MONTHS_SHORT[slot.date.getMonth()]} {slot.date.getDate()}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSlot(slot)}
                        className="w-6 h-6 flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Remove"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              id="submit-availability-btn"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 ${
                canSubmit
                  ? "text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] cursor-not-allowed"
              }`}
              style={
                canSubmit
                  ? { background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }
                  : {}
              }
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting…</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">send</span>
                  <span>Submit Availability</span>
                  {selectedSlotIds.length > 0 && (
                    <span className="ml-auto bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                      {selectedSlotIds.length} slot{selectedSlotIds.length > 1 ? "s" : ""}
                    </span>
                  )}
                </>
              )}
            </button>

            {selectedSlotIds.length === 0 && (
              <p className="text-center text-[10px] text-[var(--text-muted)]">
                Select at least 1 time slot to continue
              </p>
            )}
          </div>
        </div>

        {/* Tip banner */}
        <div className="mt-6 flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3.5">
          <span className="material-symbols-outlined text-primary text-lg flex-shrink-0 mt-0.5">lightbulb</span>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            <span className="font-bold text-[var(--text-main)]">Tip: </span>
            Selecting more slots gives the hiring manager more flexibility to confirm a time that works for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}
