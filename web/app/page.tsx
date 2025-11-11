import dynamic from "next/dynamic";
import { Suspense } from "react";
import { WalletPanel } from "../components/WalletPanel";
import Link from "next/link";

const PomodoroTimer = dynamic(() => import("../components/PomodoroTimerImproved").then((mod) => ({ default: mod.PomodoroTimerImproved })), {
  ssr: false,
  loading: () => (
    <div className="border border-slate-700/50 rounded-2xl p-8 bg-slate-800/30 backdrop-blur-sm animate-pulse">
      <div className="h-64 bg-slate-700/30 rounded-xl"></div>
    </div>
  )
});

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section with Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-400">Powered by Solana Blockchain</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Focus. Track. Earn.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The ultimate productivity workspace that rewards your focus with blockchain-powered gamification
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <WalletPanel />
            <Link 
              href="/gamefi"
              className="px-8 py-3 rounded-xl border border-slate-600 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 font-medium transition-all hover:scale-105"
            >
              Explore GameFi →
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link 
            href="/wfc" 
            className="group relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:scale-[1.02] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                <span className="text-4xl">💼</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-100">Workspace</h3>
              <p className="text-slate-400 leading-relaxed">
                Complete productivity suite with Pomodoro timer, task management, notes, and music player
              </p>
              <div className="mt-6 flex items-center text-emerald-400 font-medium">
                <span>Launch Workspace</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/gamefi" 
            className="group relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 hover:border-purple-500/50 transition-all hover:scale-[1.02] backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                <span className="text-4xl">🎮</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-100">GameFi</h3>
              <p className="text-slate-400 leading-relaxed">
                Earn rewards, unlock achievements, stake NFTs, and level up while staying productive
              </p>
              <div className="mt-6 flex items-center text-purple-400 font-medium">
                <span>Start Gaming</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
          
          <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-100">Quick Start</h3>
              <p className="text-slate-400 leading-relaxed">
                Connect your Solana wallet and begin your first Pomodoro session in seconds
              </p>
              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>No signup required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              25min
            </div>
            <div className="text-sm text-slate-400">Focus Sessions</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              NFT
            </div>
            <div className="text-sm text-slate-400">Rewards</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Web3
            </div>
            <div className="text-sm text-slate-400">Powered</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <div className="text-sm text-slate-400">Free</div>
          </div>
        </div>

        {/* Pomodoro Timer Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Start Your Focus Session
            </h2>
            <p className="text-slate-400 text-lg">
              Connect your wallet to begin tracking and earning rewards
            </p>
          </div>
          
          <Suspense fallback={
            <div className="border border-slate-700/50 rounded-3xl p-8 bg-slate-800/30 backdrop-blur-sm animate-pulse">
              <div className="h-64 bg-slate-700/30 rounded-xl"></div>
            </div>
          }>
            <PomodoroTimer />
          </Suspense>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 p-12 text-center backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to level up your productivity?
            </h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Join the future of work where focus meets blockchain rewards
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/wfc"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
              >
                Launch Full Workspace
              </Link>
              <Link
                href="/gamefi"
                className="px-8 py-4 rounded-xl border border-slate-600 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 font-semibold transition-all"
              >
                Explore GameFi Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

