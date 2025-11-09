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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to frons.id
        </h1>
        <p className="text-slate-400 text-lg">
          Your productivity workspace powered by Solana. Focus, track, and earn rewards.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Link 
          href="/wfc" 
          className="group p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:scale-105"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">💼</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-100">Workspace</h3>
          <p className="text-slate-400 text-sm">Full productivity suite with timer, tasks, notes, and more</p>
        </Link>
        
        <Link 
          href="/gamefi" 
          className="group p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:scale-105"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span className="text-2xl">🎮</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-100">GameFi</h3>
          <p className="text-slate-400 text-sm">Earn rewards, unlock achievements, and level up</p>
        </Link>
        
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-100">Quick Start</h3>
          <p className="text-slate-400 text-sm">Connect wallet and start your first Pomodoro session</p>
        </div>
      </div>

      <div className="mb-8">
        <WalletPanel />
      </div>

      <Suspense fallback={
        <div className="border border-slate-700/50 rounded-2xl p-8 bg-slate-800/30 backdrop-blur-sm animate-pulse">
          <div className="h-64 bg-slate-700/30 rounded-xl"></div>
        </div>
      }>
        <PomodoroTimer />
      </Suspense>
    </div>
  );
}
