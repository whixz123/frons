"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  idle: "Idle",
  focus: "Deep focus",
  rest: "Coffee break"
} as const;

type TimerPhase = keyof typeof TIMER_STATUSES;

type FeedbackMessage = {
  level: "success" | "error" | "info";
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
};

const FOCUS_DEFAULT_MINUTES = 25;
const REST_DEFAULT_MINUTES = 5;

export function PomodoroTimer() {
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
            offset: 8, // skip discriminator
            bytes: wallet.publicKey.toBase58()
          }
        }
      ]);
      const mappedHistory: SessionHistoryItem[] = sessionAccounts
        .map(({ account, publicKey }) => ({
          accountAddress: publicKey,
          index: account.index.toNumber(),
          kind: mapKind(account.kind),
          startTs: account.startTs.toNumber(),
          endTs: account.endTs ? account.endTs.toNumber() : null,
          pointsDelta: account.pointsDelta.toNumber(),
          recordedAt: account.recordedAt.toNumber(),
          multiplierAppliedBps: account.multiplierAppliedBps.toNumber()
        }))
        .sort((a, b) => b.index - a.index)
        .slice(0, 12);
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
      setFeedback({ level: "success", text: `${mode === "focus" ? "Focus" : "Rest"} session logged on-chain.` });
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

  useEffect(() => {
    if (phase === "idle" || !sessionStart) {
      return;
    }
    const ticker = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          clearInterval(ticker);
          void handleSessionComplete();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(ticker);
  }, [phase, sessionStart, handleSessionComplete]);

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
      setFeedback(null);
      setPhase(mode);
      setSessionStart(Math.floor(Date.now() / 1000));
      const minutes = mode === "focus" ? focusMinutes : restMinutes;
      setSecondsLeft(minutes * 60);
    },
    [focusMinutes, restMinutes, program, wallet.publicKey]
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
      setFeedback({ level: "info", text: "Session cancelled and penalty applied." });
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

  const timerFormatted = useMemo(() => {
    const minutes = Math.floor(secondsLeft / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsLeft % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsLeft]);

  const focusSummary = useMemo(() => {
    if (!profile) return { points: 0, focus: 0, rest: 0, cancelled: 0 };
    return {
      points: bnToNumber(profile.totalPoints),
      focus: bnToNumber(profile.focusSessions),
      rest: bnToNumber(profile.restSessions),
      cancelled: bnToNumber(profile.cancelledSessions)
    };
  }, [profile]);

  return (
    <section className="grid gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="border border-emerald-500/20 bg-slate-900/60 rounded-3xl p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase text-emerald-300/70 tracking-widest">Current status</p>
            <h2 className="text-5xl font-semibold tracking-tight">{TIMER_STATUSES[phase]}</h2>
            <div className="text-6xl font-mono font-semibold text-emerald-300">{timerFormatted}</div>
            {phase !== "idle" && sessionStart && (
              <p className="text-xs text-slate-400">
                Started at {new Date(sessionStart * 1000).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {phase === "idle" && (
              <button
                onClick={() => handleStart("focus")}
                className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
                disabled={!canTransact}
              >
                Start Focus Pod
              </button>
            )}
            {phase === "idle" && (
              <button
                onClick={() => handleStart("rest")}
                className="px-6 py-3 rounded-full border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 transition"
                disabled={!canTransact}
              >
                Log Rest
              </button>
            )}
            {phase !== "idle" && (
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-full border border-rose-500/60 text-rose-300 hover:bg-rose-500/10 transition"
              >
                Cancel Session
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <DurationInput
              label="Focus (min)"
              value={focusMinutes}
              onChange={setFocusMinutes}
              disabled={phase !== "idle"}
            />
            <DurationInput
              label="Rest (min)"
              value={restMinutes}
              onChange={setRestMinutes}
              disabled={phase !== "idle"}
            />
            <div className="col-span-2 flex flex-col gap-2 text-sm">
              <label className="text-xs uppercase tracking-widest text-slate-400">fronSOL token account (optional)</label>
              <input
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                placeholder="Token account address for fronSOL multiplier"
                value={fronTokenAccount}
                onChange={(event) => setFronTokenAccount(event.target.value.trim())}
                disabled={phase !== "idle"}
              />
              <span className="text-xs text-slate-500">
                Provide the fronSOL associated token address once minted to earn multipliers.
              </span>
            </div>
          </div>
          {feedback && (
            <div
              className={clsx(
                "rounded-2xl px-4 py-3 text-sm border",
                feedback.level === "success" && "border-emerald-500/40 text-emerald-200 bg-emerald-500/10",
                feedback.level === "error" && "border-rose-500/40 text-rose-200 bg-rose-500/10",
                feedback.level === "info" && "border-sky-500/40 text-sky-200 bg-sky-500/10"
              )}
            >
              {feedback.text}
            </div>
          )}
        </div>
        <aside className="border border-slate-800/60 rounded-3xl bg-slate-900/40 p-6 flex flex-col gap-4">
          <h3 className="text-lg font-semibold">On-chain Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <StatCard label="Points" value={focusSummary.points} accent="emerald" />
            <StatCard label="Focus" value={focusSummary.focus} accent="sky" />
            <StatCard label="Rest" value={focusSummary.rest} accent="amber" />
            <StatCard label="Cancelled" value={focusSummary.cancelled} accent="rose" />
          </div>
          <button
            onClick={refreshProfile}
            className="mt-auto text-xs uppercase tracking-widest text-slate-400 hover:text-emerald-300"
            disabled={loadingProfile}
          >
            {loadingProfile ? "Refreshing…" : "Refresh data"}
          </button>
        </aside>
      </div>

      <div className="border border-slate-800/60 bg-slate-900/50 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent on-chain activity</h3>
          {wallet.publicKey && (
            <span className="text-xs text-slate-500">Program ID: {FRONS_PROGRAM_ID.toBase58()}</span>
          )}
        </div>
        {history.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            {wallet.connected
              ? "No sessions recorded yet. Start your first focus pod!"
              : "Connect your wallet to see on-chain sessions."}
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-800/60">
            {history.map((item) => (
              <li key={`${item.accountAddress.toBase58()}-${item.index}`} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-100 capitalize">{item.kind}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.recordedAt * 1000).toLocaleString()} •
                    <span className="ml-1">
                      {item.endTs && item.startTs
                        ? `${Math.round((item.endTs - item.startTs) / 60)} min`
                        : "Cancelled early"}
                    </span>
                  </p>
                </div>
                <div className={clsx("text-sm font-semibold", item.pointsDelta >= 0 ? "text-emerald-300" : "text-rose-300")}> 
                  {item.pointsDelta >= 0 ? "+" : ""}
                  {item.pointsDelta} pts
                  <span className="ml-2 text-xs text-slate-500">
                    x{(item.multiplierAppliedBps / 100).toFixed(2)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!profile && wallet.publicKey && (
        <div className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-50 rounded-3xl px-6 py-5 flex flex-col gap-2">
          <p className="font-semibold">First time here?</p>
          <p className="text-sm">
            Initialize your productivity profile to start earning fronSOL points for every disciplined Work-from-Coffee session.
          </p>
          <button
            onClick={handleInitialize}
            className="self-start px-5 py-2 rounded-full bg-emerald-500 text-slate-950 font-semibold"
            disabled={initializing}
          >
            {initializing ? "Setting up…" : "Initialize profile"}
          </button>
        </div>
      )}
    </section>
  );
}

function DurationInput({
  label,
  value,
  onChange,
  disabled
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-xs uppercase tracking-widest text-slate-400">{label}</span>
      <input
        type="number"
        min={1}
        max={120}
        step={1}
        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        disabled={disabled}
      />
    </label>
  );
}

function StatCard({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent: "emerald" | "sky" | "amber" | "rose";
}) {
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-widest text-slate-500">{label}</p>
      <p
        className={clsx(
          "text-2xl font-semibold mt-1",
          accent === "emerald" && "text-emerald-300",
          accent === "sky" && "text-sky-300",
          accent === "amber" && "text-amber-300",
          accent === "rose" && "text-rose-300"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function mapKind(kind: any): SessionKind {
  if ("focus" in kind) return "focus";
  if ("rest" in kind) return "rest";
  return "cancelled";
}

function bnToNumber(value: any): number {
  if (value && typeof value.toNumber === "function") {
    return value.toNumber();
  }
  return Number(value ?? 0);
}
