"use client";

import { useMemo } from "react";
import clsx from "clsx";

type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  type: "focus" | "rest" | "points" | "streak" | "total";
};

const ACHIEVEMENTS: Achievement[] = [
  // Focus Achievements
  { id: "first_focus", name: "First Steps", description: "Complete your first focus session", icon: "🎯", requirement: 1, rarity: "common", type: "focus" },
  { id: "focus_10", name: "Getting Started", description: "Complete 10 focus sessions", icon: "📚", requirement: 10, rarity: "common", type: "focus" },
  { id: "focus_50", name: "Focused Mind", description: "Complete 50 focus sessions", icon: "🧠", requirement: 50, rarity: "rare", type: "focus" },
  { id: "focus_100", name: "Concentration Master", description: "Complete 100 focus sessions", icon: "🎓", requirement: 100, rarity: "epic", type: "focus" },
  { id: "focus_500", name: "Productivity Legend", description: "Complete 500 focus sessions", icon: "👑", requirement: 500, rarity: "legendary", type: "focus" },
  
  // Rest Achievements
  { id: "first_rest", name: "Coffee Break", description: "Take your first rest", icon: "☕", requirement: 1, rarity: "common", type: "rest" },
  { id: "rest_25", name: "Well Rested", description: "Take 25 rest sessions", icon: "🌙", requirement: 25, rarity: "rare", type: "rest" },
  { id: "rest_100", name: "Balance Master", description: "Take 100 rest sessions", icon: "⚖️", requirement: 100, rarity: "epic", type: "rest" },
  
  // Points Achievements
  { id: "points_100", name: "Point Collector", description: "Earn 100 points", icon: "💎", requirement: 100, rarity: "common", type: "points" },
  { id: "points_1000", name: "Point Hoarder", description: "Earn 1,000 points", icon: "💰", requirement: 1000, rarity: "rare", type: "points" },
  { id: "points_5000", name: "Point Millionaire", description: "Earn 5,000 points", icon: "🏆", requirement: 5000, rarity: "epic", type: "points" },
  { id: "points_10000", name: "Point God", description: "Earn 10,000 points", icon: "⭐", requirement: 10000, rarity: "legendary", type: "points" },
  
  // Streak Achievements
  { id: "streak_3", name: "On Fire", description: "Reach a 3-session streak", icon: "🔥", requirement: 3, rarity: "common", type: "streak" },
  { id: "streak_7", name: "Unstoppable", description: "Reach a 7-session streak", icon: "💪", requirement: 7, rarity: "rare", type: "streak" },
  { id: "streak_14", name: "Streak Master", description: "Reach a 14-session streak", icon: "⚡", requirement: 14, rarity: "epic", type: "streak" },
  { id: "streak_30", name: "Legendary Streak", description: "Reach a 30-session streak", icon: "🌟", requirement: 30, rarity: "legendary", type: "streak" },
  
  // Total Sessions
  { id: "total_100", name: "Century Club", description: "Complete 100 total sessions", icon: "💯", requirement: 100, rarity: "rare", type: "total" },
  { id: "total_500", name: "Productivity Veteran", description: "Complete 500 total sessions", icon: "🎖️", requirement: 500, rarity: "epic", type: "total" },
  { id: "total_1000", name: "Productivity Immortal", description: "Complete 1,000 total sessions", icon: "👹", requirement: 1000, rarity: "legendary", type: "total" },
];

type AchievementsProps = {
  focusSessions: number;
  restSessions: number;
  totalPoints: number;
  longestStreak: number;
};

export function Achievements({ focusSessions, restSessions, totalPoints, longestStreak }: AchievementsProps) {
  const totalSessions = focusSessions + restSessions;

  const achievementProgress = useMemo(() => {
    return ACHIEVEMENTS.map(achievement => {
      let current = 0;
      let unlocked = false;

      switch (achievement.type) {
        case "focus":
          current = focusSessions;
          break;
        case "rest":
          current = restSessions;
          break;
        case "points":
          current = totalPoints;
          break;
        case "streak":
          current = longestStreak;
          break;
        case "total":
          current = totalSessions;
          break;
      }

      unlocked = current >= achievement.requirement;
      const progress = Math.min((current / achievement.requirement) * 100, 100);

      return {
        ...achievement,
        current,
        unlocked,
        progress
      };
    });
  }, [focusSessions, restSessions, totalPoints, longestStreak, totalSessions]);

  const unlockedCount = achievementProgress.filter(a => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;

  const rarityColors = {
    common: "from-slate-500 to-slate-600",
    rare: "from-blue-500 to-cyan-500",
    epic: "from-purple-500 to-pink-500",
    legendary: "from-amber-500 to-orange-500"
  };

  const rarityBorders = {
    common: "border-slate-500/50",
    rare: "border-blue-500/50",
    epic: "border-purple-500/50",
    legendary: "border-amber-500/50"
  };

  return (
    <div className="glass-strong border border-purple-500/30 rounded-3xl p-8 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg">
              🏆
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Achievements
            </h3>
          </div>
          <p className="text-slate-400 ml-15">Unlock rewards by completing challenges</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            {unlockedCount}/{totalCount}
          </div>
          <div className="text-sm text-slate-400">Unlocked</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 p-4 rounded-2xl bg-slate-900/50 border border-slate-700/50">
        <div className="flex justify-between text-sm mb-3">
          <span className="text-slate-300 font-medium">Overall Progress</span>
          <span className="text-amber-400 font-bold text-lg">{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
        <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 transition-all duration-500 shadow-lg"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {achievementProgress.map((achievement) => (
          <div
            key={achievement.id}
            className={clsx(
              "relative p-5 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02]",
              achievement.unlocked
                ? `bg-gradient-to-br ${rarityColors[achievement.rarity]} ${rarityBorders[achievement.rarity]} shadow-lg`
                : "bg-slate-900/80 border-slate-700 backdrop-blur-sm"
            )}
          >
            {/* Rarity Badge */}
            <div className="absolute top-3 right-3">
              <span
                className={clsx(
                  "text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide",
                  achievement.rarity === "common" && "bg-slate-500/30 text-slate-200 border border-slate-400/30",
                  achievement.rarity === "rare" && "bg-blue-500/30 text-blue-200 border border-blue-400/30",
                  achievement.rarity === "epic" && "bg-purple-500/30 text-purple-200 border border-purple-400/30",
                  achievement.rarity === "legendary" && "bg-amber-500/30 text-amber-200 border border-amber-400/30"
                )}
              >
                {achievement.rarity}
              </span>
            </div>

            {/* Icon */}
            <div 
              className={clsx(
                "text-5xl mb-4 transition-all duration-300",
                achievement.unlocked ? "filter-none" : "grayscale opacity-50"
              )}
            >
              {achievement.icon}
            </div>

            {/* Name & Description */}
            <div className="mb-4">
              <h4 className={clsx(
                "font-bold text-lg mb-2",
                achievement.unlocked ? "text-white" : "text-slate-400"
              )}>
                {achievement.name}
              </h4>
              <p className={clsx(
                "text-sm leading-relaxed",
                achievement.unlocked ? "text-slate-200" : "text-slate-500"
              )}>
                {achievement.description}
              </p>
            </div>

            {/* Progress */}
            {!achievement.unlocked && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Progress</span>
                  <span className="text-slate-300 font-bold">
                    {achievement.current}/{achievement.requirement}
                  </span>
                </div>
                <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${achievement.progress}%` }}
                  />
                </div>
              </div>
            )}

            {achievement.unlocked && (
              <div className="flex items-center gap-2 text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white">✓</span>
                </div>
                <span className="text-white">Unlocked!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

