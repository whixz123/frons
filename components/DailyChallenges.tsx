"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import confetti from "canvas-confetti";

type Challenge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  reward: number;
  type: "focus" | "rest" | "points" | "streak";
};

const DAILY_CHALLENGES: Challenge[] = [
  { id: "daily_focus_3", name: "Morning Grind", description: "Complete 3 focus sessions", icon: "☀️", requirement: 3, reward: 50, type: "focus" },
  { id: "daily_focus_5", name: "Productivity Beast", description: "Complete 5 focus sessions", icon: "💪", requirement: 5, reward: 100, type: "focus" },
  { id: "daily_rest_2", name: "Self Care", description: "Take 2 rest breaks", icon: "🧘", requirement: 2, reward: 30, type: "rest" },
  { id: "daily_points_200", name: "Point Hunter", description: "Earn 200 points", icon: "🎯", requirement: 200, reward: 75, type: "points" },
];

type DailyChallengesProps = {
  focusSessionsToday: number;
  restSessionsToday: number;
  pointsToday: number;
  currentStreak: number;
};

export function DailyChallenges({ 
  focusSessionsToday, 
  restSessionsToday, 
  pointsToday,
  currentStreak 
}: DailyChallengesProps) {
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [showReward, setShowReward] = useState<{ challenge: Challenge; show: boolean } | null>(null);

  // Load completed challenges from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem(`challenges-${today}`);
    if (saved) {
      try {
        setCompletedChallenges(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to load challenges", e);
      }
    }
  }, []);

  const challengeProgress = useMemo(() => {
    return DAILY_CHALLENGES.map(challenge => {
      let current = 0;

      switch (challenge.type) {
        case "focus":
          current = focusSessionsToday;
          break;
        case "rest":
          current = restSessionsToday;
          break;
        case "points":
          current = pointsToday;
          break;
        case "streak":
          current = currentStreak;
          break;
      }

      const isCompleted = current >= challenge.requirement;
      const isClaimed = completedChallenges.has(challenge.id);
      const progress = Math.min((current / challenge.requirement) * 100, 100);

      return {
        ...challenge,
        current,
        isCompleted,
        isClaimed,
        progress
      };
    });
  }, [focusSessionsToday, restSessionsToday, pointsToday, currentStreak, completedChallenges]);

  const totalRewards = useMemo(() => {
    return challengeProgress
      .filter(c => c.isClaimed)
      .reduce((sum, c) => sum + c.reward, 0);
  }, [challengeProgress]);

  const handleClaimReward = (challenge: Challenge) => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b']
    });

    // Mark as claimed
    const newCompleted = new Set(completedChallenges);
    newCompleted.add(challenge.id);
    setCompletedChallenges(newCompleted);

    // Save to localStorage
    const today = new Date().toDateString();
    localStorage.setItem(`challenges-${today}`, JSON.stringify(Array.from(newCompleted)));

    // Show reward popup
    setShowReward({ challenge, show: true });
    setTimeout(() => setShowReward(null), 3000);
  };

  const completedCount = challengeProgress.filter(c => c.isClaimed).length;
  const totalCount = DAILY_CHALLENGES.length;

  return (
    <div className="border border-orange-500/30 bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-2xl p-6 relative overflow-hidden">
      {/* Reward Popup */}
      {showReward?.show && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-8 rounded-2xl text-center transform scale-110 shadow-2xl">
            <div className="text-6xl mb-4 animate-bounce">{showReward.challenge.icon}</div>
            <div className="text-2xl font-bold text-white mb-2">Challenge Complete!</div>
            <div className="text-lg text-white/90 mb-4">{showReward.challenge.name}</div>
            <div className="text-3xl font-bold text-yellow-300">+{showReward.challenge.reward} 🎁</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-orange-300 flex items-center gap-2">
          🎯 Daily Challenges
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-400">{completedCount}/{totalCount}</div>
          <div className="text-xs text-slate-400">Completed</div>
        </div>
      </div>

      {/* Total Rewards */}
      <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-300">Today&apos;s Rewards</div>
            <div className="text-2xl font-bold text-amber-400">+{totalRewards} Bonus Points</div>
          </div>
          <div className="text-4xl">🎁</div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challengeProgress.map((challenge) => (
          <div
            key={challenge.id}
            className={clsx(
              "p-4 rounded-xl border-2 transition-all",
              challenge.isClaimed
                ? "bg-emerald-500/10 border-emerald-500/50"
                : challenge.isCompleted
                ? "bg-orange-500/10 border-orange-500/50 animate-pulse"
                : "bg-slate-800/50 border-slate-700"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="text-4xl flex-shrink-0">{challenge.icon}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-white">{challenge.name}</h4>
                    <p className="text-sm text-slate-400">{challenge.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-amber-400">+{challenge.reward}</div>
                    <div className="text-xs text-slate-400">points</div>
                  </div>
                </div>

                {/* Progress Bar */}
                {!challenge.isClaimed && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-semibold">
                        {challenge.current}/{challenge.requirement}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {challenge.isClaimed ? (
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                    <span>✓</span>
                    <span>Claimed!</span>
                  </div>
                ) : challenge.isCompleted ? (
                  <button
                    onClick={() => handleClaimReward(challenge)}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:from-emerald-400 hover:to-cyan-400 transition transform hover:scale-105 shadow-lg"
                  >
                    🎉 Claim Reward
                  </button>
                ) : (
                  <div className="text-sm text-slate-500">
                    Keep going! {challenge.requirement - challenge.current} more to complete
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reset Info */}
      <div className="mt-6 p-3 bg-slate-800/50 rounded-lg text-center">
        <div className="text-xs text-slate-400">
          ⏰ Challenges reset daily at midnight
        </div>
      </div>
    </div>
  );
}

