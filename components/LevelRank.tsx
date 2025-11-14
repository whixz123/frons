"use client";

import { useMemo } from "react";
import clsx from "clsx";

type Rank = {
  name: string;
  minPoints: number;
  maxPoints: number;
  color: string;
  gradient: string;
  icon: string;
};

const RANKS: Rank[] = [
  { name: "Bronze", minPoints: 0, maxPoints: 999, color: "text-amber-700", gradient: "from-amber-700 to-amber-900", icon: "🥉" },
  { name: "Silver", minPoints: 1000, maxPoints: 2999, color: "text-slate-400", gradient: "from-slate-400 to-slate-600", icon: "🥈" },
  { name: "Gold", minPoints: 3000, maxPoints: 6999, color: "text-yellow-400", gradient: "from-yellow-400 to-yellow-600", icon: "🥇" },
  { name: "Platinum", minPoints: 7000, maxPoints: 14999, color: "text-cyan-400", gradient: "from-cyan-400 to-cyan-600", icon: "💎" },
  { name: "Diamond", minPoints: 15000, maxPoints: 29999, color: "text-blue-400", gradient: "from-blue-400 to-purple-500", icon: "💠" },
  { name: "Master", minPoints: 30000, maxPoints: 59999, color: "text-purple-400", gradient: "from-purple-400 to-pink-500", icon: "👑" },
  { name: "Grandmaster", minPoints: 60000, maxPoints: 99999, color: "text-rose-400", gradient: "from-rose-400 to-orange-500", icon: "🔥" },
  { name: "Legend", minPoints: 100000, maxPoints: Infinity, color: "text-amber-300", gradient: "from-amber-300 via-orange-400 to-red-500", icon: "⭐" },
];

type LevelRankProps = {
  totalPoints: number;
};

export function LevelRank({ totalPoints }: LevelRankProps) {
  const currentRank = useMemo(() => {
    return RANKS.find(rank => totalPoints >= rank.minPoints && totalPoints <= rank.maxPoints) || RANKS[0];
  }, [totalPoints]);

  const nextRank = useMemo(() => {
    const currentIndex = RANKS.indexOf(currentRank);
    return currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;
  }, [currentRank]);

  const level = useMemo(() => {
    return Math.floor(totalPoints / 100) + 1;
  }, [totalPoints]);

  const levelProgress = useMemo(() => {
    return (totalPoints % 100);
  }, [totalPoints]);

  const rankProgress = useMemo(() => {
    if (!nextRank) return 100;
    const pointsInRank = totalPoints - currentRank.minPoints;
    const rankRange = nextRank.minPoints - currentRank.minPoints;
    return (pointsInRank / rankRange) * 100;
  }, [totalPoints, currentRank, nextRank]);

  return (
    <div className="border border-cyan-500/30 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-2xl p-6">
      <h3 className="text-2xl font-bold text-cyan-300 mb-6 flex items-center gap-2">
        📊 Level & Rank
      </h3>

      {/* Current Rank Display */}
      <div className="mb-6 text-center">
        <div className="inline-block relative">
          <div className={clsx(
            "text-6xl mb-2 animate-pulse",
            "drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          )}>
            {currentRank.icon}
          </div>
          <div className={clsx(
            "text-3xl font-bold mb-1",
            currentRank.color
          )}>
            {currentRank.name}
          </div>
          <div className="text-sm text-slate-400">
            {totalPoints.toLocaleString()} points
          </div>
        </div>
      </div>

      {/* Level Display */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-300 font-semibold">Level {level}</span>
          <span className="text-emerald-400 font-semibold">{levelProgress}/100 XP</span>
        </div>
        <div className="h-4 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1 text-right">
          {100 - levelProgress} XP to Level {level + 1}
        </div>
      </div>

      {/* Rank Progress */}
      {nextRank && (
        <div className="mb-6 p-4 bg-slate-800/50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-semibold">
              Progress to {nextRank.name}
            </span>
            <span className="text-cyan-400 font-semibold">
              {Math.round(rankProgress)}%
            </span>
          </div>
          <div className="h-4 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={clsx(
                "h-full bg-gradient-to-r transition-all duration-500",
                nextRank.gradient
              )}
              style={{ width: `${rankProgress}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1 text-right">
            {(nextRank.minPoints - totalPoints).toLocaleString()} points needed
          </div>
        </div>
      )}

      {/* All Ranks */}
      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-3">All Ranks</h4>
        <div className="space-y-2">
          {RANKS.map((rank, index) => {
            const isCurrentRank = rank === currentRank;
            const isUnlocked = totalPoints >= rank.minPoints;
            const isNextRank = rank === nextRank;

            return (
              <div
                key={rank.name}
                className={clsx(
                  "flex items-center gap-3 p-3 rounded-lg transition-all",
                  isCurrentRank && "bg-cyan-500/20 border-2 border-cyan-500",
                  !isCurrentRank && isUnlocked && "bg-slate-800/50",
                  !isUnlocked && "bg-slate-900/30 opacity-50",
                  isNextRank && !isCurrentRank && "border border-slate-600"
                )}
              >
                <div className="text-2xl" style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}>
                  {rank.icon}
                </div>
                <div className="flex-1">
                  <div className={clsx(
                    "font-semibold",
                    isUnlocked ? rank.color : "text-slate-500"
                  )}>
                    {rank.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {rank.minPoints.toLocaleString()} - {rank.maxPoints === Infinity ? "∞" : rank.maxPoints.toLocaleString()} pts
                  </div>
                </div>
                {isCurrentRank && (
                  <div className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-full">
                    CURRENT
                  </div>
                )}
                {isNextRank && !isCurrentRank && (
                  <div className="px-3 py-1 bg-slate-600 text-white text-xs font-bold rounded-full">
                    NEXT
                  </div>
                )}
                {isUnlocked && !isCurrentRank && !isNextRank && (
                  <div className="text-emerald-400">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

