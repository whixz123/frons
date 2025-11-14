"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import clsx from "clsx";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  FRONS_PROGRAM_ID,
  SessionKind,
  deriveUserProfilePda,
  getFronsProgram,
  initializeUserIfNeeded,
  recordSession,
  type FronsIdl
} from "../lib/anchor";

const TIMER_STATUSES = {
  idle: "Ready to Focus",
  focus: "Deep Focus Mode",
  rest: "Coffee Break"
} as const;

type TimerPhase = keyof typeof TIMER_STATUSES;

type FeedbackMessage = {
  level: "success" | "error" | "info" | "warning";
  text: string;
};

type SessionHistoryItem = {
  accountAddress: PublicKey;
  index: number;
  kind: SessionKind;
  startTs: number;
  endTs: number | null;
  pointsDelta: number;
  recordedAt: number;
  multiplierAppliedBps: number;
  actualDurationSeconds: number | null;
  plannedDurationSeconds: number;
};

type SessionPreset = {
  name: string;
  focus: number;
  rest: number;
  icon: string;
};

const DEFAULT_PRESETS: SessionPreset[] = [
  { name: "Classic", focus: 25, rest: 5, icon: "⏱️" },
  { name: "Extended", focus: 50, rest: 10, icon: "📚" },
  { name: "Deep Work", focus: 90, rest: 20, icon: "🎯" },
  { name: "Quick", focus: 15, rest: 3, icon: "⚡" },
];

const FOCUS_DEFAULT_MINUTES = 25;
const REST_DEFAULT_MINUTES = 5;

function mapKind(kind: any): SessionKind {
  if (typeof kind === "object") {
    if ("focus" in kind) return "focus";
    if ("rest" in kind) return "rest";
    if ("cancelled" in kind) return "cancelled";
  }
  return "focus";
}

function bnToNumber(bn: any): number {
  if (typeof bn === "number") return bn;
  if (bn && typeof bn.toNumber === "function") return bn.toNumber();
  return 0;
}

export function PomodoroTimerImproved() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState<Program<FronsIdl> | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [history, setHistory] = useState<SessionHistoryItem[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [focusMinutes, setFocusMinutes] = useState<number>(FOCUS_DEFAULT_MINUTES);
  const [restMinutes, setRestMinutes] = useState<number>(REST_DEFAULT_MINUTES);
  const [phase, setPhase] = useState<TimerPhase>("idle");
  const [secondsLeft, setSecondsLeft] = useState<number>(focusMinutes * 60);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);
  const [fronTokenAccount, setFronTokenAccount] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<"all" | SessionKind>("all");
  const [showSettings, setShowSettings] = useState(false);

  const canTransact = useMemo(() => Boolean(wallet.publicKey && program), [wallet.publicKey, program]);

  useEffect(() => {
    if (!wallet.publicKey) {
      setProgram(null);
      setProfile(null);
      setHistory([]);
      return;
    }
    const anchorProgram = getFronsProgram(connection, wallet);
    setProgram(anchorProgram);
  }, [connection, wallet]);

  const refreshProfile = useCallback(async () => {
    if (!program || !wallet.publicKey) {
      return;
    }
    setLoadingProfile(true);
    try {
      const [userProfilePda] = deriveUserProfilePda(wallet.publicKey);
      const account = await program.account.userProfile.fetchNullable(userProfilePda);
      if (!account) {
        setProfile(null);
        setHistory([]);
        return;
      }
      setProfile(account);

      const sessionAccounts = await program.account.sessionRecord.all([
        {
          memcmp: {
            offset: 8,
            bytes: wallet.publicKey.toBase58()
          }
        }
      ]);
      const mappedHistory: SessionHistoryItem[] = sessionAccounts
        .map(({ account, publicKey }) => ({
          accountAddress: publicKey,
          index: bnToNumber(account.index),
          kind: mapKind(account.kind),
          startTs: bnToNumber(account.startTs),
          endTs: account.endTs ? bnToNumber(account.endTs) : null,
          pointsDelta: bnToNumber(account.pointsDelta),
          recordedAt: bnToNumber(account.recordedAt),
          multiplierAppliedBps: bnToNumber(account.multiplierAppliedBps),
          actualDurationSeconds: account.actualDurationSeconds ? bnToNumber(account.actualDurationSeconds) : null,
          plannedDurationSeconds: bnToNumber(account.plannedDurationSeconds)
        }))
        .sort((a, b) => b.index - a.index);
      setHistory(mappedHistory);
    } catch (error) {
      console.error("Failed to fetch profile", error);
      setFeedback({ level: "error", text: "Unable to load on-chain profile." });
    } finally {
      setLoadingProfile(false);
    }
  }, [program, wallet.publicKey]);

  useEffect(() => {
    if (program && wallet.publicKey) {
      refreshProfile();
    }
  }, [program, wallet.publicKey, refreshProfile]);

  // Define handleSessionComplete early to avoid hoisting issues
  const handleSessionComplete = useCallback(async () => {
    if (!sessionStart || !program) {
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    const mode: SessionKind = phase === "focus" ? "focus" : "rest";
    try {
      await recordSession(program, {
        kind: mode,
        startTs: sessionStart,
        endTs: now,
        plannedDurationSeconds: (phase === "focus" ? focusMinutes : restMinutes) * 60,
        fronTokenAccount: fronTokenAccount ? new PublicKey(fronTokenAccount) : undefined
      });
      setFeedback({ level: "success", text: `${mode === "focus" ? "Focus" : "Rest"} session logged on-chain! 🎉` });
      await refreshProfile();
    } catch (error) {
      console.error("recordSession", error);
      setFeedback({ level: "error", text: "Failed to record session." });
    } finally {
      setPhase("idle");
      setSessionStart(null);
      setSecondsLeft(focusMinutes * 60);
    }
  }, [sessionStart, program, phase, focusMinutes, restMinutes, fronTokenAccount, refreshProfile]);

  // Store the callback in a ref to avoid stale closures
  const handleSessionCompleteRef = useRef(handleSessionComplete);
  
  useEffect(() => {
    handleSessionCompleteRef.current = handleSessionComplete;
  }, [handleSessionComplete]);

  useEffect(() => {
    if (phase === "focus") {
      setSecondsLeft(focusMinutes * 60);
    }
  }, [focusMinutes, phase]);

  useEffect(() => {
    if (phase === "rest") {
      setSecondsLeft(restMinutes * 60);
    }
  }, [restMinutes, phase]);

  useEffect(() => {
    if (phase === "idle" || !sessionStart) {
      return;
    }
    const ticker = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(ticker);
          void handleSessionCompleteRef.current();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [phase, sessionStart]);

  const handleInitialize = useCallback(async () => {
    if (!program) {
      return;
    }
    setInitializing(true);
    try {
      await initializeUserIfNeeded(program);
      await refreshProfile();
      setFeedback({ level: "success", text: "Profile is ready. Happy focusing!" });
    } catch (error) {
      console.error("initialize", error);
      setFeedback({ level: "error", text: "Failed to initialize user profile." });
    } finally {
      setInitializing(false);
    }
  }, [program, refreshProfile]);

  const handleStart = useCallback(
    (mode: TimerPhase) => {
      if (!wallet.publicKey || !program) {
        setFeedback({ level: "info", text: "Connect your wallet first." });
        return;
      }
      if (!profile) {
        setFeedback({ level: "warning", text: "Initialize your profile first." });
        return;
      }
      setFeedback(null);
      setPhase(mode);
      setSessionStart(Math.floor(Date.now() / 1000));
      const minutes = mode === "focus" ? focusMinutes : restMinutes;
      setSecondsLeft(minutes * 60);
    },
    [focusMinutes, restMinutes, program, wallet.publicKey, profile]
  );

  const handleCancel = useCallback(async () => {
    if (!program || !sessionStart) {
      return;
    }
    const now = Math.floor(Date.now() / 1000);
    try {
      await recordSession(program, {
        kind: "cancelled",
        startTs: sessionStart,
        endTs: now,
        plannedDurationSeconds: (phase === "focus" ? focusMinutes : restMinutes) * 60,
        fronTokenAccount: fronTokenAccount ? new PublicKey(fronTokenAccount) : undefined
      });
      setFeedback({ level: "warning", text: "Session cancelled. Penalty applied." });
      await refreshProfile();
    } catch (error) {
      console.error("cancel session", error);
      setFeedback({ level: "error", text: "Could not cancel session." });
    } finally {
      setPhase("idle");
      setSessionStart(null);
      setSecondsLeft(focusMinutes * 60);
    }
  }, [program, sessionStart, phase, focusMinutes, restMinutes, fronTokenAccount, refreshProfile]);

  const handlePresetSelect = useCallback((preset: SessionPreset) => {
    setFocusMinutes(preset.focus);
    setRestMinutes(preset.rest);
    setSelectedPreset(preset.name);
    setFeedback({ level: "info", text: `Preset "${preset.name}" selected: ${preset.focus}/${preset.rest} min` });
  }, []);

  const timerFormatted = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const progressPercentage = useMemo(() => {
    const totalSeconds = (phase === "focus" ? focusMinutes : restMinutes) * 60;
    return ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  }, [secondsLeft, focusMinutes, restMinutes, phase]);

  const focusSummary = useMemo(() => {
    if (!profile) return { points: 0, focus: 0, rest: 0, cancelled: 0, streak: 0, longestStreak: 0 };
    return {
      points: bnToNumber(profile.totalPoints),
      focus: bnToNumber(profile.focusSessions),
      rest: bnToNumber(profile.restSessions),
      cancelled: bnToNumber(profile.cancelledSessions),
      streak: bnToNumber(profile.focusStreak),
      longestStreak: bnToNumber(profile.longestFocusStreak)
    };
  }, [profile]);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") return history;
    return history.filter(item => item.kind === historyFilter);
  }, [history, historyFilter]);

  const historyStats = useMemo(() => {
    const totalFocusTime = history
      .filter(h => h.kind === "focus" && h.actualDurationSeconds)
      .reduce((sum, h) => sum + (h.actualDurationSeconds || 0), 0);
    const totalRestTime = history
      .filter(h => h.kind === "rest" && h.actualDurationSeconds)
      .reduce((sum, h) => sum + (h.actualDurationSeconds || 0), 0);
    const avgFocusTime = history.filter(h => h.kind === "focus" && h.actualDurationSeconds).length > 0
      ? totalFocusTime / history.filter(h => h.kind === "focus" && h.actualDurationSeconds).length
      : 0;
    
    return {
      totalFocusTime: Math.floor(totalFocusTime / 60),
      totalRestTime: Math.floor(totalRestTime / 60),
      avgFocusTime: Math.floor(avgFocusTime / 60),
      totalSessions: history.length
    };
  }, [history]);

  const exportToCSV = useCallback(() => {
    const headers = ["Index", "Type", "Start Time", "End Time", "Duration (min)", "Points", "Multiplier", "Recorded At"];
    const rows = history.map(h => [
      h.index,
      h.kind,
      new Date(h.startTs * 1000).toLocaleString(),
      h.endTs ? new Date(h.endTs * 1000).toLocaleString() : "N/A",
      h.actualDurationSeconds ? Math.floor(h.actualDurationSeconds / 60) : "N/A",
      h.pointsDelta,
      `${h.multiplierAppliedBps / 100}x`,
      new Date(h.recordedAt * 1000).toLocaleString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fronsol-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback({ level: "success", text: "History exported to CSV!" });
  }, [history]);

  return (
    <div className="grid gap-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={clsx(
            "px-6 py-4 rounded-2xl border-2 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300",
            {
              "bg-emerald-500/10 border-emerald-500/50 text-emerald-300": feedback.level === "success",
              "bg-rose-500/10 border-rose-500/50 text-rose-300": feedback.level === "error",
              "bg-blue-500/10 border-blue-500/50 text-blue-300": feedback.level === "info",
              "bg-amber-500/10 border-amber-500/50 text-amber-300": feedback.level === "warning"
            }
          )}
        >
          <span className="font-medium">{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-current hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
        {/* Timer Section */}
        <div className="space-y-6">
          {/* Timer Display */}
          <div className="relative border-2 border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 overflow-hidden">
            {/* Progress Bar Background */}
            {phase !== "idle" && (
              <div className="absolute inset-0 bg-emerald-500/5" style={{ width: `${progressPercentage}%` }} />
            )}
            
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs uppercase text-emerald-300/70 tracking-widest font-semibold">
                  {phase === "idle" ? "Status" : "In Progress"}
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  {TIMER_STATUSES[phase]}
                </h2>
              </div>
              
              <div className="text-7xl md:text-8xl font-mono font-bold text-emerald-400 tabular-nums">
                {timerFormatted}
              </div>
              
              {phase !== "idle" && sessionStart && (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm text-slate-400">
                    Started at {new Date(sessionStart * 1000).toLocaleTimeString()}
                  </p>
                  <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {phase === "idle" && (
                  <>
                    <button
                      onClick={() => handleStart("focus")}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg hover:from-emerald-400 hover:to-cyan-400 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/20"
                      disabled={!canTransact || !profile}
                    >
                      🎯 Start Focus Session
                    </button>
                    <button
                      onClick={() => handleStart("rest")}
                      className="px-8 py-4 rounded-2xl border-2 border-emerald-500/40 text-emerald-300 font-bold text-lg hover:bg-emerald-500/10 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      disabled={!canTransact || !profile}
                    >
                      ☕ Take a Break
                    </button>
                  </>
                )}
                {phase !== "idle" && (
                  <button
                    onClick={handleCancel}
                    className="px-8 py-4 rounded-2xl border-2 border-rose-500/60 text-rose-300 font-bold text-lg hover:bg-rose-500/10 transition-all transform hover:scale-105"
                  >
                    ❌ Cancel Session
                  </button>
                )}
              </div>

              {!profile && wallet.publicKey && (
                <button
                  onClick={handleInitialize}
                  disabled={initializing}
                  className="mt-4 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-400 transition disabled:opacity-50"
                >
                  {initializing ? "Initializing..." : "Initialize Profile"}
                </button>
              )}
            </div>
          </div>

          {/* Session Presets */}
          <div className="border border-slate-700 bg-slate-900/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-emerald-300">⚙️ Session Presets</h3>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-sm text-slate-400 hover:text-emerald-300 transition"
              >
                {showSettings ? "Hide" : "Show"} Custom
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DEFAULT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetSelect(preset)}
                  disabled={phase !== "idle"}
                  className={clsx(
                    "p-4 rounded-xl border-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                    selectedPreset === preset.name
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:border-emerald-500/50"
                  )}
                >
                  <div className="text-2xl mb-2">{preset.icon}</div>
                  <div className="font-semibold text-sm">{preset.name}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {preset.focus}/{preset.rest} min
                  </div>
                </button>
              ))}
            </div>

            {showSettings && (
              <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Focus Duration (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={focusMinutes}
                    onChange={(e) => {
                      setFocusMinutes(Math.max(1, Math.min(120, parseInt(e.target.value) || 1)));
                      setSelectedPreset(null);
                    }}
                    disabled={phase !== "idle"}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Rest Duration (min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={restMinutes}
                    onChange={(e) => {
                      setRestMinutes(Math.max(1, Math.min(60, parseInt(e.target.value) || 1)));
                      setSelectedPreset(null);
                    }}
                    disabled={phase !== "idle"}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Points & Stats */}
          <div className="border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-emerald-300 mb-4">📊 Your Stats</h3>
            
            <div className="space-y-4">
              <div className="text-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                <div className="text-4xl font-bold text-emerald-400">{focusSummary.points}</div>
                <div className="text-sm text-slate-400 mt-1">Total Points</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">{focusSummary.focus}</div>
                  <div className="text-xs text-slate-400">Focus</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">{focusSummary.rest}</div>
                  <div className="text-xs text-slate-400">Rest</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-rose-400">{focusSummary.cancelled}</div>
                  <div className="text-xs text-slate-400">Cancelled</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400">{focusSummary.streak}</div>
                  <div className="text-xs text-slate-400">Streak</div>
                </div>
              </div>

              <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
                <div className="text-sm text-slate-300">🏆 Longest Streak</div>
                <div className="text-2xl font-bold text-amber-400">{focusSummary.longestStreak}</div>
              </div>
            </div>

            <button
              onClick={refreshProfile}
              disabled={loadingProfile || !canTransact}
              className="mt-4 w-full px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600 transition disabled:opacity-50"
            >
              {loadingProfile ? "Loading..." : "🔄 Refresh Data"}
            </button>
          </div>

          {/* Token Account */}
          <div className="border border-slate-700 bg-slate-900/60 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-emerald-300 mb-3">🪙 fronSOL Multiplier</h3>
            <p className="text-xs text-slate-400 mb-3">
              Add your fronSOL token account to earn 1.5× points
            </p>
            <input
              type="text"
              placeholder="Token account address..."
              value={fronTokenAccount}
              onChange={(e) => setFronTokenAccount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Session History */}
      <div className="border border-slate-700 bg-slate-900/60 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-emerald-300">📜 Session History</h3>
          <div className="flex gap-3">
            <select
              value={historyFilter}
              onChange={(e) => setHistoryFilter(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white text-sm focus:border-emerald-500 focus:outline-none"
            >
              <option value="all">All Sessions</option>
              <option value="focus">Focus Only</option>
              <option value="rest">Rest Only</option>
              <option value="cancelled">Cancelled Only</option>
            </select>
            <button
              onClick={exportToCSV}
              disabled={history.length === 0}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Export CSV
            </button>
          </div>
        </div>

        {/* History Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-slate-800 rounded-xl">
            <div className="text-2xl font-bold text-emerald-400">{historyStats.totalSessions}</div>
            <div className="text-xs text-slate-400 mt-1">Total Sessions</div>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <div className="text-2xl font-bold text-blue-400">{historyStats.totalFocusTime}</div>
            <div className="text-xs text-slate-400 mt-1">Focus Time (min)</div>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <div className="text-2xl font-bold text-cyan-400">{historyStats.totalRestTime}</div>
            <div className="text-xs text-slate-400 mt-1">Rest Time (min)</div>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <div className="text-2xl font-bold text-amber-400">{historyStats.avgFocusTime}</div>
            <div className="text-xs text-slate-400 mt-1">Avg Focus (min)</div>
          </div>
        </div>

        {/* History Table */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-4">📭</div>
            <p>{wallet.publicKey ? "No sessions yet. Start your first focus pod!" : "Connect wallet to see history"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">#</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Date & Time</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Duration</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Points</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-semibold">Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.index} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 text-slate-300">#{item.index}</td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          item.kind === "focus" && "bg-blue-500/20 text-blue-300",
                          item.kind === "rest" && "bg-cyan-500/20 text-cyan-300",
                          item.kind === "cancelled" && "bg-rose-500/20 text-rose-300"
                        )}
                      >
                        {item.kind === "focus" ? "🎯 Focus" : item.kind === "rest" ? "☕ Rest" : "❌ Cancelled"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {new Date(item.startTs * 1000).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.actualDurationSeconds 
                        ? `${Math.floor(item.actualDurationSeconds / 60)} min`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          "font-semibold",
                          item.pointsDelta > 0 ? "text-emerald-400" : "text-rose-400"
                        )}
                      >
                        {item.pointsDelta > 0 ? "+" : ""}{item.pointsDelta}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.multiplierAppliedBps / 100}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

