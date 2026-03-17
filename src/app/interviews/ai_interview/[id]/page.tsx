"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type InterviewPhase = "instructions" | "interview" | "finished";
type SpeakingState = "idle" | "speaking" | "listening" | "processing";

interface Question {
  id: number;
  text: string;
}

interface ChatEntry {
  questionIndex: number;
  question: string;
  answer: string;
}

// ─── Questions ────────────────────────────────────────────────────────────────
const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Tell me about yourself and your professional background. What motivated you to apply for this role?",
  },
  {
    id: 2,
    text: "Describe a challenging project you've worked on. What was your approach and what was the outcome?",
  },
  {
    id: 3,
    text: "How do you handle tight deadlines and pressure? Can you give a specific example?",
  },
  {
    id: 4,
    text: "Where do you see yourself in the next three to five years, and how does this position fit into your career goals?",
  },
  {
    id: 5,
    text: "Do you have any questions for us about the role or the company?",
  },
];

// ─── Chat Panel Component ────────────────────────────────────────────────────
function ChatPanel({
  history,
  liveTranscript,
  currentQuestion,
  isListening,
  chatEndRef,
}: {
  history: ChatEntry[];
  liveTranscript: string;
  currentQuestion: string;
  isListening: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  const hasContent = history.length > 0 || liveTranscript || isListening;

  return (
    <div className="flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden h-64 lg:flex-1 lg:h-auto lg:min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 flex-shrink-0">
        <span className="material-symbols-outlined text-emerald-400 text-base">chat</span>
        <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Live Transcript</span>
        {isListening && (
          <span className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-[10px] font-semibold">REC</span>
          </span>
        )}
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-4 min-h-0">
        {!hasContent && (
          <div className="flex flex-col items-center justify-center h-24 gap-2 opacity-40">
            <span className="material-symbols-outlined text-slate-500 text-2xl">mic_none</span>
            <p className="text-slate-500 text-xs text-center">Your answers will appear here as you speak</p>
          </div>
        )}

        {/* Completed Q&A pairs */}
        {history.map((entry) => (
          <div key={entry.questionIndex} className="space-y-2">
            {/* AI question bubble */}
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "13px" }}>smart_toy</span>
              </div>
              <div className="bg-slate-800/70 border border-white/8 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                <p className="text-slate-300 text-xs leading-relaxed">{entry.question}</p>
              </div>
            </div>
            {/* User answer bubble */}
            <div className="flex items-start gap-2 flex-row-reverse">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "13px" }}>person</span>
              </div>
              <div className="bg-blue-500/15 border border-blue-500/20 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                <p className="text-slate-200 text-xs leading-relaxed">
                  {entry.answer || <span className="text-slate-500 italic">No speech detected</span>}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Current AI question (if listening) */}
        {isListening && currentQuestion && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "13px" }}>smart_toy</span>
              </div>
              <div className="bg-slate-800/70 border border-white/8 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
                <p className="text-slate-300 text-xs leading-relaxed">{currentQuestion}</p>
              </div>
            </div>

            {/* Live user transcript bubble */}
            <div className="flex items-start gap-2 flex-row-reverse">
              <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontSize: "13px" }}>person</span>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/15 rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%] min-w-[60px]">
                {liveTranscript ? (
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {liveTranscript}
                    <span className="inline-block w-0.5 h-3 bg-emerald-400 ml-0.5 animate-pulse rounded-sm align-middle" />
                  </p>
                ) : (
                  <div className="flex items-center gap-1 py-0.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full bg-emerald-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

// ─── Sound Wave ───────────────────────────────────────────────────────────────
function SoundWave({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-5">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`w-0.5 rounded-full transition-all duration-150 ${
            active ? "bg-emerald-400" : "bg-white/20"
          }`}
          style={
            active
              ? {
                  height: `${6 + Math.abs(Math.sin(i * 0.9)) * 14}px`,
                  animation: `soundBar 0.${4 + (i % 5)}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.05}s`,
                }
              : { height: "3px" }
          }
        />
      ))}
    </div>
  );
}

// ─── Progress Dots ────────────────────────────────────────────────────────────
function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-500 ${
            i < current
              ? "w-5 h-1.5 bg-emerald-500"
              : i === current
              ? "w-7 h-1.5 bg-emerald-400 animate-pulse"
              : "w-1.5 h-1.5 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Subtitle Overlay ─────────────────────────────────────────────────────────
function SubtitleOverlay({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div
      className={`transition-all duration-500 pointer-events-none select-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      }`}
    >
      {text && (
        <div className="relative max-w-3xl mx-auto px-4">
          <div className="absolute inset-0 bg-black/60 rounded-2xl blur-lg" />
          <div className="relative bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 shadow-2xl">
            <p className="text-white text-center text-base md:text-lg leading-relaxed font-medium tracking-wide">
              {text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Avatar PiP ────────────────────────────────────────────────────────────
function AIAvatarPiP({ speakingState }: { speakingState: SpeakingState }) {
  const colorMap = {
    speaking: "from-emerald-500 to-teal-600 ring-emerald-400/70",
    listening: "from-blue-500 to-indigo-600 ring-blue-400/70",
    processing: "from-amber-500 to-orange-600 ring-amber-400/70",
    idle: "from-emerald-700 to-teal-800 ring-white/10",
  };
  const color = colorMap[speakingState];

  return (
    <div className="relative flex flex-col items-center gap-1.5">
      {/* Pulse when speaking */}
      {speakingState === "speaking" && (
        <div className="absolute w-20 h-20 rounded-2xl bg-emerald-400/20 animate-ping" />
      )}

      <div
        className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${color} ring-2 flex items-center justify-center shadow-xl transition-all duration-500`}
      >
        <span className="material-symbols-outlined text-white text-3xl md:text-4xl select-none">
          smart_toy
        </span>

        {/* Speaking wave inside */}
        {speakingState === "speaking" && (
          <div className="absolute bottom-1 flex gap-0.5 items-end">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="w-0.5 bg-white/70 rounded-full"
                style={{
                  height: `${5 + (i % 3) * 3}px`,
                  animation: `soundBar 0.${5 + i}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* State label */}
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          speakingState === "speaking"
            ? "bg-emerald-500/20 text-emerald-300"
            : speakingState === "listening"
            ? "bg-blue-500/20 text-blue-300"
            : speakingState === "processing"
            ? "bg-amber-500/20 text-amber-300"
            : "bg-white/10 text-white/40"
        }`}
      >
        {speakingState === "speaking"
          ? "Speaking"
          : speakingState === "listening"
          ? "Listening"
          : speakingState === "processing"
          ? "Processing"
          : "AI Ready"}
      </span>
    </div>
  );
}

// ─── Camera View ──────────────────────────────────────────────────────────────
function CameraView({
  videoRef,
  cameraActive,
  cameraError,
  isRecording,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraActive: boolean;
  cameraError: string | null;
  isRecording: boolean;
}) {
  return (
    <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden">
      {/* Camera feed */}
      {cameraActive && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]" // mirror effect
        />
      )}

      {/* Fallback / error state */}
      {!cameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900">
          <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-500 text-4xl">
              {cameraError ? "videocam_off" : "hourglass_top"}
            </span>
          </div>
          <p className="text-slate-500 text-sm text-center max-w-xs px-4">
            {cameraError ?? "Starting camera…"}
          </p>
        </div>
      )}

      {/* Recording pulse border */}
      {isRecording && (
        <div className="absolute inset-0 rounded-2xl ring-4 ring-red-500/60 animate-pulse pointer-events-none" />
      )}

      {/* "You" label */}
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-slate-400"
          }`}
        />
        <span className="text-white text-xs font-medium">You</span>
      </div>

      {/* Mic recording indicator top-right */}
      {isRecording && (
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600/80 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="material-symbols-outlined text-white text-sm">
            mic
          </span>
          <span className="text-white text-xs font-semibold">REC</span>
        </div>
      )}
    </div>
  );
}

// ─── Instructions Screen ───────────────────────────────────────────────────────
function InstructionsScreen({ onStart }: { onStart: () => void }) {
  const instructions = [
    {
      icon: "videocam",
      title: "Camera Required",
      desc: "Your camera will be active throughout the interview. Make sure you are in a well-lit area.",
    },
    {
      icon: "record_voice_over",
      title: "Voice Answers Only",
      desc: "Speak your answers clearly into the microphone. Text input is not available.",
    },
    {
      icon: "smart_toy",
      title: "AI Interviewer",
      desc: "The AI agent will ask up to 5 questions and display subtitles on screen while speaking.",
    },
    {
      icon: "done_all",
      title: "Answer Completion",
      desc: 'Click "Answer Complete" when you finish speaking to proceed to the next question.',
    },
    {
      icon: "do_not_disturb_on",
      title: "Quiet Environment",
      desc: "Find a quiet, distraction-free place for the best experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center p-6">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <span className="material-symbols-outlined text-emerald-400 text-sm">
              auto_awesome
            </span>
            <span className="text-emerald-400 text-sm font-semibold tracking-wider uppercase">
              AI-Powered Interview
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Before We Begin
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            Please read the instructions below and ensure your camera and
            microphone are ready.
          </p>
        </div>

        {/* Instructions Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="space-y-5">
            {instructions.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/25 transition-colors duration-200">
                  <span className="material-symbols-outlined text-emerald-400 text-xl">
                    {item.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission notice */}
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4 mb-8">
          <span className="material-symbols-outlined text-amber-400 text-xl flex-shrink-0 mt-0.5">
            warning
          </span>
          <p className="text-amber-200/80 text-sm leading-relaxed">
            <span className="font-semibold text-amber-300">
              Browser Permissions Required:
            </span>{" "}
            When prompted, allow both{" "}
            <span className="text-amber-300 font-medium">camera</span> and{" "}
            <span className="text-amber-300 font-medium">microphone</span>{" "}
            access. The interview cannot proceed without them.
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full py-4 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined">play_circle</span>
          Start Interview
        </button>
      </div>
    </div>
  );
}

// ─── Finished Screen ───────────────────────────────────────────────────────────
function FinishedScreen({ chatHistory }: { chatHistory: ChatEntry[] }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex flex-col items-center p-6 overflow-y-auto">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl pt-10 pb-16">
        {/* Success hero */}
        <div className="text-center mb-10">
          <div className="relative inline-flex mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
              <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Interview Complete!</h1>
          <p className="text-slate-300 text-lg mb-2">Thank you for completing the AI interview.</p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            Your responses have been recorded and will be reviewed by our team. We appreciate your
            time and will be in touch with next steps soon.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Questions", value: String(chatHistory.length || SAMPLE_QUESTIONS.length), icon: "quiz" },
            { label: "Status", value: "Submitted", icon: "task_alt" },
            { label: "Review", value: "Pending", icon: "schedule" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm text-center">
              <span className="material-symbols-outlined text-emerald-400 text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-white font-bold text-lg">{stat.value}</div>
              <div className="text-slate-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Q&A Transcript Review ─────────────────────────────────────── */}
        {chatHistory.length > 0 && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mb-8">
            {/* Panel header */}
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-white/8 bg-white/3">
              <span className="material-symbols-outlined text-emerald-400 text-lg">history_edu</span>
              <span className="text-white font-semibold text-sm">Your Interview Transcript</span>
              <span className="ml-auto text-slate-500 text-xs">
                {chatHistory.length} answer{chatHistory.length !== 1 ? "s" : ""} recorded
              </span>
            </div>

            {/* Q&A pairs — inner scroll so long answers don't push the page */}
            <div className="max-h-[480px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
              {chatHistory.map((entry, idx) => (
                <div key={idx} className="px-5 py-5 space-y-3">
                  {/* Question number divider */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
                      Q{idx + 1}
                    </span>
                    <div className="flex-1 h-px bg-emerald-500/10" />
                  </div>

                  {/* AI question bubble */}
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: "14px" }}>smart_toy</span>
                    </div>
                    <div className="bg-slate-800/80 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[90%]">
                      <p className="text-slate-300 text-sm leading-relaxed">{entry.question}</p>
                    </div>
                  </div>

                  {/* User answer bubble */}
                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="shrink-0 w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-white" style={{ fontSize: "14px" }}>person</span>
                    </div>
                    <div className="bg-blue-500/15 border border-blue-500/25 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[90%]">
                      {entry.answer ? (
                        <p className="text-slate-200 text-sm leading-relaxed">{entry.answer}</p>
                      ) : (
                        <p className="text-slate-500 text-sm italic">No speech was detected for this answer.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-slate-500 text-sm text-center">You can safely close this window.</p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIInterviewPage() {
  const params = useParams();
  const interviewId = params?.id as string;

  // ── Phase + question state ──────────────────────────────────────────────────
  const [phase, setPhase] = useState<InterviewPhase>("instructions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [speakingState, setSpeakingState] = useState<SpeakingState>("idle");

  // ── Subtitle state ──────────────────────────────────────────────────────────
  const [subtitleText, setSubtitleText] = useState("");
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  // ── Mic / recording state ───────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [answerComplete, setAnswerComplete] = useState(false);
  const [showCompleteBtn, setShowCompleteBtn] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [questionStarted, setQuestionStarted] = useState(false);

  // ── Transcript / chat state ─────────────────────────────────────────────────
  const [liveTranscript, setLiveTranscript] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  // ── Camera state ────────────────────────────────────────────────────────────
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // ── Refs ────────────────────────────────────────────────────────────────────
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const subtitleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const liveTranscriptRef = useRef("");
  // Voice is picked once and reused for all TTS throughout the interview
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const totalQuestions = SAMPLE_QUESTIONS.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // ── Start camera + mic stream ───────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setCameraError(null);
    } catch (err: unknown) {
      const error = err as { name?: string };
      if (error?.name === "NotAllowedError") {
        setCameraError("Camera / microphone access was denied. Please enable permissions and refresh.");
        setMicPermissionDenied(true);
      } else if (error?.name === "NotFoundError") {
        setCameraError("No camera found. Please connect a camera and try again.");
      } else {
        setCameraError("Could not start camera. Please check your device settings.");
      }
    }
  }, []);

  // ── Stop all tracks on unmount ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.abort();
      if (subtitleTimeoutRef.current) clearTimeout(subtitleTimeoutRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ── Apply stream to video element once it mounts ────────────────────────────
  useEffect(() => {
    if (phase === "interview" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [phase]);

  // ── One-time voice selection ──────────────────────────────────────────────
  const pickVoice = useCallback(() => {
    if (voiceRef.current) return; // already picked
    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((v) => v.name === "Google US English") ||
      voices.find((v) => v.name.includes("Google") && v.lang === "en-US") ||
      voices.find((v) => v.name.includes("Google")) ||
      voices.find((v) => v.lang === "en-US") ||
      voices[0] ||
      null;
    voiceRef.current = preferred;
  }, []);

  // ── Shared speak helper — always uses the locked-in voice ─────────────────
  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      return new Promise<void>((resolve) => {
        window.speechSynthesis?.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.92;
        utterance.pitch = 1.0;
        utterance.volume = 1;
        if (voiceRef.current) utterance.voice = voiceRef.current;
        utterance.onend = () => { onDone?.(); resolve(); };
        utterance.onerror = () => { onDone?.(); resolve(); };
        window.speechSynthesis.speak(utterance);
      });
    },
    []
  );

  // ── Subtitle helper ─────────────────────────────────────────────────────────
  const showSubtitle = useCallback((text: string) => {
    setSubtitleText(text);
    setSubtitleVisible(true);
    if (subtitleTimeoutRef.current) clearTimeout(subtitleTimeoutRef.current);
    subtitleTimeoutRef.current = setTimeout(() => {
      setSubtitleVisible(false);
      setTimeout(() => setSubtitleText(""), 500);
    }, (text.split(" ").length / 2.5) * 1000 + 2000);
  }, []);

  // ── TTS speak question ──────────────────────────────────────────────────────
  const speakQuestion = useCallback(
    async (question: Question) => {
      setSpeakingState("speaking");
      showSubtitle(question.text);
      await speak(question.text);
      setSpeakingState("idle");
    },
    [speak, showSubtitle]
  );

  // ── Auto-scroll chat to bottom ────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, liveTranscript]);

  // ── Start speech recognition ─────────────────────────────────────────────────
  const startListening = useCallback(() => {
    // reset transcript for new question
    setLiveTranscript("");
    liveTranscriptRef.current = "";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI: any =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsRecording(true);
      setShowCompleteBtn(true);
      setSpeakingState("listening");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsRecording(true);
      setShowCompleteBtn(true);
      setSpeakingState("listening");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let final = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t + " ";
        } else {
          interim += t;
        }
      }
      if (final) {
        liveTranscriptRef.current = (liveTranscriptRef.current + final).trim();
      }
      const display = (liveTranscriptRef.current + (interim ? " " + interim : "")).trim();
      setLiveTranscript(display);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (e: any) => {
      if (e.error === "not-allowed") setMicPermissionDenied(true);
      setIsRecording(false);
      setSpeakingState("idle");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setIsRecording(true);
      setShowCompleteBtn(true);
      setSpeakingState("listening");
    }
  }, []);

  // ── Stop recognition ──────────────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    setIsRecording(false);
    setSpeakingState("idle");
  }, []);

  // ── Question cycle ────────────────────────────────────────────────────────────
  const runQuestionCycle = useCallback(
    async (question: Question) => {
      setAnswerComplete(false);
      setShowCompleteBtn(false);
      setSpeakingState("processing");
      await new Promise((r) => setTimeout(r, 800));
      await speakQuestion(question);
      await new Promise((r) => setTimeout(r, 600));
      startListening();
    },
    [speakQuestion, startListening]
  );

  // ── Handle Start ──────────────────────────────────────────────────────────────
  const handleStart = useCallback(async () => {
    await startCamera();
    setPhase("interview");
    setCurrentQuestionIndex(0);
    await new Promise((r) => setTimeout(r, 600));

    // Pick a voice once and lock it in for the whole session
    pickVoice();
    // Give voices a moment to load if they weren't ready yet
    if (!voiceRef.current) {
      await new Promise((r) => setTimeout(r, 400));
      pickVoice();
    }

    // Introduction speech
    const introText =
      "Hello! Welcome to your AI-powered interview. " +
      "My name is Ava, and I will be your interviewer today. " +
      "I will ask you a total of five questions. " +
      "Please speak your answers clearly into your microphone. " +
      "When you finish answering, click the Answer Complete button to move to the next question. " +
      "Take your time — there is no rush. Let's begin!";

    setSpeakingState("speaking");
    showSubtitle(introText);
    await speak(introText);
    setSpeakingState("idle");

    await new Promise((r) => setTimeout(r, 600));
    setQuestionStarted(true);
    await runQuestionCycle(SAMPLE_QUESTIONS[0]);
  }, [startCamera, pickVoice, speak, showSubtitle, runQuestionCycle]);

  // ── Handle Answer Complete ────────────────────────────────────────────────────
  const handleAnswerComplete = useCallback(async () => {
    stopListening();

    // Commit current answer to chat history
    const answeredText = liveTranscriptRef.current.trim();
    setChatHistory((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        question: SAMPLE_QUESTIONS[currentQuestionIndex].text,
        answer: answeredText,
      },
    ]);
    setLiveTranscript("");
    liveTranscriptRef.current = "";

    setAnswerComplete(true);
    setShowCompleteBtn(false);
    setSpeakingState("processing");
    await new Promise((r) => setTimeout(r, 1200));

    if (isLastQuestion) {
      const outroText =
        "Thank you for completing the interview. Your responses have been recorded. We will be in touch soon.";
      setSpeakingState("speaking");
      showSubtitle(outroText);
      await speak(outroText);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setPhase("finished");
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      await runQuestionCycle(SAMPLE_QUESTIONS[nextIndex]);
    }
  }, [
    stopListening,
    isLastQuestion,
    currentQuestionIndex,
    runQuestionCycle,
    showSubtitle,
  ]);

  // ─── Phase: Instructions ───────────────────────────────────────────────────
  if (phase === "instructions") return <InstructionsScreen onStart={handleStart} />;
  if (phase === "finished") return <FinishedScreen chatHistory={chatHistory} />;

  // ─── Phase: Interview ──────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1.0); }
        }
      `}</style>

      <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
        {/* Ambient glow */}
        <div className="fixed top-0 inset-x-0 h-48 bg-gradient-to-b from-emerald-950/60 to-transparent pointer-events-none z-0" />

        {/* ── Top Bar ──────────────────────────────────────────────────────── */}
        <header className="relative z-20 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-white text-base">
                psychology
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold text-sm leading-none">
                Skill-Sight AI
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                Interview #{interviewId}
              </p>
            </div>
          </div>

          {/* Center: question progress */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-slate-400 text-xs">
              Question{" "}
              <span className="text-white font-bold">
                {currentQuestionIndex + 1}
              </span>{" "}
              of{" "}
              <span className="text-emerald-400 font-bold">{totalQuestions}</span>
            </span>
            <ProgressDots total={totalQuestions} current={currentQuestionIndex} />
          </div>

          {/* Right: live + time */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-xs font-semibold uppercase tracking-wider hidden sm:inline">
                Live
              </span>
            </div>
          </div>
        </header>

        {/* ── Main area ────────────────────────────────────────────────────── */}
        <main className="relative z-10 flex-1 flex flex-col lg:flex-row gap-4 p-4 md:p-6 min-h-0 overflow-y-auto lg:overflow-hidden">

          {/* ── LEFT / PRIMARY: User camera ─────────────────────────────── */}
          <div className="relative h-[280px] sm:h-[360px] lg:flex-1 lg:h-auto rounded-2xl overflow-hidden shadow-2xl bg-slate-900 shrink-0">
            <CameraView
              videoRef={videoRef}
              cameraActive={cameraActive}
              cameraError={cameraError}
              isRecording={isRecording}
            />

            {/* Subtitle overlay — positioned at bottom of camera, hidden on mobile */}
            <div className="absolute bottom-0 inset-x-0 px-4 pb-5 pt-16 bg-gradient-to-t from-black/70 via-black/30 to-transparent hidden lg:flex items-end justify-center">
              <SubtitleOverlay text={subtitleText} visible={subtitleVisible} />
            </div>

            {/* AI PiP — top-right corner of camera view */}
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-xl">
                <AIAvatarPiP speakingState={speakingState} />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Controls panel ────────────────────────────────────── */}
          <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-4 lg:h-full lg:min-h-0 shrink-0">

            {/* Question card — hidden during intro, shown once questions begin */}
            {questionStarted && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex-shrink-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-emerald-400 text-lg">quiz</span>
                  <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">
                    Current Question
                  </span>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {SAMPLE_QUESTIONS[currentQuestionIndex].text}
                </p>
              </div>
            )}

            {/* Status card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col items-center gap-4 flex-shrink-0">
              {/* Sound wave */}
              <div className="flex flex-col items-center gap-2">
                <SoundWave active={isRecording} />
                <p
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isRecording
                      ? "text-emerald-400"
                      : speakingState === "speaking"
                      ? "text-teal-400"
                      : speakingState === "processing"
                      ? "text-amber-400"
                      : "text-slate-500"
                  }`}
                >
                  {isRecording
                    ? "🎙 Recording your answer…"
                    : speakingState === "speaking"
                    ? "🔊 Listen to the question…"
                    : speakingState === "processing"
                    ? "⏳ Processing…"
                    : "Waiting…"}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-white/8" />

              {/* Tip */}
              <p className="text-slate-500 text-xs text-center leading-relaxed">
                Speak clearly at a steady pace. Click{" "}
                <span className="text-slate-300 font-medium">
                  Answer Complete
                </span>{" "}
                when done.
              </p>
            </div>

            {/* Mic denied warning */}
            {micPermissionDenied && (
              <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                <span className="material-symbols-outlined text-red-400 text-lg flex-shrink-0">
                  mic_off
                </span>
                <p className="text-red-300 text-xs leading-relaxed">
                  Microphone access was denied. Enable it in browser settings
                  and refresh.
                </p>
              </div>
            )}

            {/* ── Chat / transcript panel ──────────────────────────── */}
            <ChatPanel
              history={chatHistory}
              liveTranscript={liveTranscript}
              currentQuestion={SAMPLE_QUESTIONS[currentQuestionIndex].text}
              isListening={isRecording}
              chatEndRef={chatEndRef}
            />

            {/* Answer Complete button */}
            <button
              id="answer-complete-btn"
              onClick={handleAnswerComplete}
              disabled={!showCompleteBtn || answerComplete}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2.5
                ${
                  showCompleteBtn && !answerComplete
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.97] cursor-pointer"
                    : "bg-white/5 border border-white/10 text-slate-600 cursor-not-allowed"
                }`}
            >
              <span className="material-symbols-outlined text-xl">
                {answerComplete ? "check_circle" : "done_all"}
              </span>
              {answerComplete
                ? isLastQuestion
                  ? "Finishing interview…"
                  : "Moving to next question…"
                : "Answer Complete"}
            </button>

            {showCompleteBtn && !answerComplete && (
              <p className="text-slate-600 text-xs text-center -mt-2">
                Click when you have finished speaking
              </p>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
