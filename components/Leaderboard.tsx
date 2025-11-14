"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import clsx from "clsx";

type LeaderboardEntry = {
  rank: number;
  address: string;
  displayName: string;
  points: number;
  focusSessions: number;
  streak: number;
  level: number;
  rankTier: string;
  isCurrentUser?: boolean;
};

// Mock data for demonstration
const MOCK_LEADERBOARD: Omit<LeaderboardEntry, "rank" | "isCurrentUser">[] = [
  { address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", displayName: "CryptoNinja", points: 15420, focusSessions: 154, streak: 28, level: 155, rankTier: "Diamond" },
  { address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK", displayName: "FocusKing", points: 12890, focusSessions: 129, streak: 21, level: 129, rankTier: "Platinum" },
  { address: "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1", displayName: "ProductivityPro", points: 10340, focusSessions: 103, streak: 15, level: 104, rankTier: "Platinum" },
  { address: "8qbHbw2BbbTHBW1sbeqakYXVKRQM8Ne7pLK7m6CVfeR9", displayName: "CoffeeLover", points: 8750, focusSessions: 88, streak: 12, level: 88, rankTier: "Gold" },
  { address: "2wmVCSfPxGPjrnMMn7rchp4uaeoTqN39mXFC2zhPdri9", displayName: "DeepWorker", points: 7230, focusSessions: 72, streak: 9, level: 73, rankTier: "Gold" },
  { address: "5fNfvyp5czQVX77yoACa3JJVEhdRaWjPuazuWgjhTqEX", displayName: "StudyBuddy", points: 6100, focusSessions: 61, streak: 7, level: 61, rankTier: "Gold" },
  { address: "9vYWHBPz3oKvjJKBESZpzm7qDWotNNNAtYjRRKGiN5qY", displayName: "GrindMaster", points: 5420, focusSessions: 54, streak: 6, level: 55, rankTier: "Silver" },
  { address: "3CD4KcZSVQKJaJxBP7VRfWsNXkHW7KWPcJZzMqUqLJxv", displayName: "HustleHero", points: 4890, focusSessions: 49, streak: 5, level: 49, rankTier: "Silver" },
  { address: "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS", displayName: "FocusWarrior", points: 4210, focusSessions: 42, streak: 4, level: 43, rankTier: "Silver" },
  { address: "7UX2i7SucgLMQcfZ75s3VXmZZY4YRUyJN9X1RgfMoDUi", displayName: "TaskCrusher", points: 3650, focusSessions: 37, streak: 3, level: 37, rankTier: "Silver" },
];

type LeaderboardProps = {
  userPoints: number;
  userFocusSessions: number;
  userStreak: number;
};

export function Leaderboard({ userPoints, userFocusSessions, userStreak }: LeaderboardProps) {
  const wallet = useWallet();
  const [timeFilter, setTimeFilter] = useState<"daily" | "weekly" | "all">("all");

  const leaderboardData = useMemo(() => {
    // In production, this would fetch from on-chain data or API
    const data = [...MOCK_LEADERBOARD];

    // Add current user if connected
    if (wallet.publicKey) {
      const userLevel = Math.floor(userPoints / 100) + 1;
      let rankTier = "Bronze";
      if (userPoints >= 15000) rankTier = "Diamond";
      else if (userPoints >= 7000) rankTier = "Platinum";
      else if (userPoints >= 3000) rankTier = "Gold";
      else if (userPoints >= 1000) rankTier = "Silver";

      data.push({
        address: wallet.publicKey.toBase58(),
        displayName: "You",
        points: userPoints,
        focusSessions: userFocusSessions,
        streak: userStreak,
        level: userLevel,
        rankTier
      });
    }

    // Sort by points
    data.sort((a, b) => b.points - a.points);

    // Add ranks and mark current user
    return data.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isCurrentUser: wallet.publicKey && entry.address === wallet.publicKey.toBase58()
    }));
  }, [wallet.publicKey, userPoints, userFocusSessions, userStreak]);

  const currentUserEntry = leaderboardData.find(e => e.isCurrentUser);

  const rankColors: Record<number, string> = {
    1: "text-amber-400",
    2: "text-slate-400",
    3: "text-orange-600"
  };

  const rankIcons: Record<number, string> = {
    1: "🥇",
    2: "🥈",
    3: "🥉"
  };

  return (
    <div className="border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-blue-300 flex items-center gap-2">
          🏆 Leaderboard
        </h3>
        
        {/* Time Filter */}
        <div className="flex gap-2">
          {(["daily", "weekly", "all"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={clsx(
                "px-3 py-1 rounded-lg text-sm font-semibold transition",
                timeFilter === filter
                  ? "bg-blue-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              )}
            >
              {filter === "daily" ? "Daily" : filter === "weekly" ? "Weekly" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Current User Rank Card */}
      {currentUserEntry && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border-2 border-blue-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-blue-400">#{currentUserEntry.rank}</div>
              <div>
                <div className="font-semibold text-white">Your Rank</div>
                <div className="text-sm text-slate-400">{currentUserEntry.points.toLocaleString()} points</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-400">{currentUserEntry.rankTier}</div>
              <div className="text-xs text-slate-400">Level {currentUserEntry.level}</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-900 z-10">
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Rank</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold">Player</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Points</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Sessions</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Streak</th>
                <th className="text-right py-3 px-4 text-slate-400 font-semibold">Level</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr
                  key={entry.address}
                  className={clsx(
                    "border-b border-slate-800 transition",
                    entry.isCurrentUser
                      ? "bg-blue-500/10 hover:bg-blue-500/20"
                      : "hover:bg-slate-800/50"
                  )}
                >
                  {/* Rank */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {rankIcons[entry.rank] && (
                        <span className="text-2xl">{rankIcons[entry.rank]}</span>
                      )}
                      <span className={clsx(
                        "font-bold",
                        rankColors[entry.rank] || "text-slate-300"
                      )}>
                        #{entry.rank}
                      </span>
                    </div>
                  </td>

                  {/* Player */}
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        {entry.displayName}
                        {entry.isCurrentUser && (
                          <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {entry.address.slice(0, 4)}...{entry.address.slice(-4)}
                      </div>
                      <div className="text-xs text-purple-400">{entry.rankTier}</div>
                    </div>
                  </td>

                  {/* Points */}
                  <td className="py-3 px-4 text-right">
                    <div className="font-bold text-emerald-400">
                      {entry.points.toLocaleString()}
                    </div>
                  </td>

                  {/* Sessions */}
                  <td className="py-3 px-4 text-right">
                    <div className="text-cyan-400">
                      {entry.focusSessions}
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-orange-400">
                      <span>🔥</span>
                      <span>{entry.streak}</span>
                    </div>
                  </td>

                  {/* Level */}
                  <td className="py-3 px-4 text-right">
                    <div className="text-purple-400">
                      {entry.level}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-slate-800/50 rounded-lg text-center">
        <div className="text-xs text-slate-400">
          🌟 Compete with others and climb the ranks! Rankings update in real-time.
        </div>
      </div>
    </div>
  );
}

