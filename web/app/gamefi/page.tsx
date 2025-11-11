"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const NFTProfile = dynamic(() => import("../../components/NFTProfile").then(mod => ({ default: mod.NFTProfile })), { ssr: false });
const Achievements = dynamic(() => import("../../components/Achievements").then(mod => ({ default: mod.Achievements })), { ssr: false });
const LevelRank = dynamic(() => import("../../components/LevelRank").then(mod => ({ default: mod.LevelRank })), { ssr: false });
const StreakCalendar = dynamic(() => import("../../components/StreakCalendar").then(mod => ({ default: mod.StreakCalendar })), { ssr: false });
const DailyChallenges = dynamic(() => import("../../components/DailyChallenges").then(mod => ({ default: mod.DailyChallenges })), { ssr: false });
const Leaderboard = dynamic(() => import("../../components/Leaderboard").then(mod => ({ default: mod.Leaderboard })), { ssr: false });
const ThemeCustomization = dynamic(() => import("../../components/ThemeCustomization").then(mod => ({ default: mod.ThemeCustomization })), { ssr: false });

export default function GameFiPage() {
  // Mock data - in production this would come from on-chain data
  const mockData = {
    totalPoints: 5420,
    focusSessions: 54,
    restSessions: 12,
    cancelledSessions: 3,
    longestStreak: 12,
    currentStreak: 7,
    focusSessionsToday: 3,
    restSessionsToday: 1,
    pointsToday: 315,
    history: [] // Would be populated with actual session data
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background - Same as homepage */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-700/50 glass-strong backdrop-blur-md sticky top-16 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/20 mb-4">
                  <span className="text-2xl">🎮</span>
                  <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    GameFi Features
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
                  Your Gaming Dashboard
                </h1>
                <p className="text-lg text-slate-300">Level up your productivity with rewards and achievements</p>
              </div>
              <Link
                href="/"
                className="group px-6 py-3 rounded-xl glass border border-slate-600 hover:border-purple-500/50 text-slate-300 hover:text-purple-400 transition-all font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8">
            {/* Top Section - Profile & Level */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              <Suspense fallback={
                <div className="glass-strong border border-slate-700/50 rounded-3xl p-6 animate-pulse h-[400px]">
                  <div className="h-full bg-slate-800/30 rounded-2xl"></div>
                </div>
              }>
                <NFTProfile />
              </Suspense>
              <Suspense fallback={
                <div className="glass-strong border border-slate-700/50 rounded-3xl p-6 animate-pulse h-[400px]">
                  <div className="h-full bg-slate-800/30 rounded-2xl"></div>
                </div>
              }>
                <LevelRank totalPoints={mockData.totalPoints} />
              </Suspense>
            </div>

            {/* Daily Challenges */}
            <Suspense fallback={
              <div className="glass-strong border border-slate-700/50 rounded-3xl p-8 animate-pulse h-[300px]">
                <div className="h-full bg-slate-800/30 rounded-2xl"></div>
              </div>
            }>
              <DailyChallenges
                focusSessionsToday={mockData.focusSessionsToday}
                restSessionsToday={mockData.restSessionsToday}
                pointsToday={mockData.pointsToday}
                currentStreak={mockData.currentStreak}
              />
            </Suspense>

            {/* Achievements */}
            <Suspense fallback={
              <div className="glass-strong border border-slate-700/50 rounded-3xl p-8 animate-pulse h-[600px]">
                <div className="h-full bg-slate-800/30 rounded-2xl"></div>
              </div>
            }>
              <Achievements
                focusSessions={mockData.focusSessions}
                restSessions={mockData.restSessions}
                totalPoints={mockData.totalPoints}
                longestStreak={mockData.longestStreak}
              />
            </Suspense>

            {/* Streak Calendar */}
            <Suspense fallback={
              <div className="glass-strong border border-slate-700/50 rounded-3xl p-8 animate-pulse h-[500px]">
                <div className="h-full bg-slate-800/30 rounded-2xl"></div>
              </div>
            }>
              <StreakCalendar
                history={mockData.history}
                currentStreak={mockData.currentStreak}
              />
            </Suspense>

            {/* Leaderboard */}
            <Suspense fallback={
              <div className="glass-strong border border-slate-700/50 rounded-3xl p-8 animate-pulse h-[600px]">
                <div className="h-full bg-slate-800/30 rounded-2xl"></div>
              </div>
            }>
              <Leaderboard
                userPoints={mockData.totalPoints}
                userFocusSessions={mockData.focusSessions}
                userStreak={mockData.currentStreak}
              />
            </Suspense>

          {/* Theme Customization */}
          <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[500px]" />}>
            <ThemeCustomization userPoints={mockData.totalPoints} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

