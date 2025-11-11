import dynamic from "next/dynamic";
import { Suspense } from "react";
import { WalletPanel } from "../components/WalletPanel";
import Link from "next/link";

const PomodoroTimer = dynamic(() => import("../components/PomodoroTimerImproved").then((mod) => ({ default: mod.PomodoroTimerImproved })), {
  ssr: false,
  loading: () => (
    <div className="glass-strong border border-emerald-500/30 rounded-3xl p-8 animate-pulse">
      <div className="h-96 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-2xl"></div>
    </div>
  )
});

export default function HomePage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Gradient Orbs */}
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 right-1/4 w-[700px] h-[700px] bg-gradient-to-tl from-purple-500/15 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-[10%] w-3 h-3 bg-emerald-400/60 rounded-full animate-float"></div>
        <div className="absolute top-40 right-[15%] w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[60%] left-[20%] w-2 h-2 bg-blue-400/60 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 right-[25%] w-3 h-3 bg-purple-400/60 rounded-full animate-bounce-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[30%] right-[30%] w-2 h-2 bg-pink-400/60 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-24 space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-strong border border-emerald-400/30 hover:border-emerald-400/50 transition-all group cursor-default shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 shadow-lg shadow-emerald-400/50"></span>
            </span>
            <span className="text-base font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Powered by Solana Blockchain
            </span>
            <svg className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-none">
              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient pb-4">
                Focus
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient pb-4" style={{ animationDelay: '0.5s' }}>
                Track
              </span>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent animate-gradient">
                Earn
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl lg:text-4xl text-slate-300 max-w-5xl mx-auto leading-relaxed font-light">
              The <span className="font-bold text-white">ultimate productivity workspace</span><br className="hidden md:block" /> 
              where focus meets <span className="font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">blockchain rewards</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <div className="transform hover:scale-105 transition-all duration-300">
              <WalletPanel />
            </div>
            <Link 
              href="/gamefi"
              className="group px-10 py-4 rounded-2xl glass-strong border-2 border-purple-500/30 hover:border-purple-400/60 text-slate-200 hover:text-white font-bold transition-all flex items-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20"
            >
              <span className="text-2xl">🎮</span>
              <span>Explore GameFi</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            {[
              { icon: "⏱️", value: "25min", label: "Focus Sessions" },
              { icon: "🎁", value: "NFT", label: "Rewards" },
              { icon: "⚡", value: "Web3", label: "Powered" },
              { icon: "✨", value: "100%", label: "Free" }
            ].map((stat, i) => (
              <div key={i} className="glass-strong p-6 rounded-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all hover:scale-105 group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <Link
            href="/wfc"
            className="group relative overflow-hidden p-8 rounded-3xl glass-strong border-2 border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:scale-[1.02]"
          >
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            
            {/* Highlight Badge */}
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg">
                Most Popular
              </span>
            </div>
            
            <div className="relative space-y-6">
              {/* Icon */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                💼
              </div>
              
              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">
                  Full Workspace
                </h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  Complete productivity suite with Pomodoro timer, tasks, notes, and music player in one place
                </p>
              </div>
              
              {/* Arrow */}
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-400 font-semibold transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/gamefi"
            className="group relative overflow-hidden p-8 rounded-3xl glass-strong border-2 border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                Earn Crypto
              </span>
            </div>
            <div className="relative space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                🎮
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">
                  GameFi Rewards
                </h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  Earn rewards, unlock achievements, stake NFTs, and level up while staying productive
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-400 font-semibold transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="group relative overflow-hidden p-8 rounded-3xl glass-strong border-2 border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="absolute top-6 right-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                Start Now
              </span>
            </div>
            <div className="relative space-y-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                ⚡
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all">
                  Quick Focus
                </h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  Jump right in with instant focus sessions. No signup, just connect wallet and start
                </p>
              </div>
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-emerald-400 font-semibold transition-colors">
                <span>Learn More</span>
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Pomodoro Timer Section */}
        <div className="mb-24">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Start Your Focus Session
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Connect your wallet and begin earning rewards for every focused minute
            </p>
          </div>
          
          <Suspense fallback={
            <div className="glass-strong border border-emerald-500/30 rounded-3xl p-8 animate-pulse">
              <div className="h-96 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-2xl"></div>
            </div>
          }>
            <PomodoroTimer />
          </Suspense>
        </div>

        {/* Final CTA */}
        <div className="relative overflow-hidden rounded-3xl glass-strong border-2 border-emerald-500/30 p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10"></div>
          <div className="relative z-10 space-y-8">
            <h3 className="text-4xl md:text-5xl font-black">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="text-white">Your Productivity?</span>
            </h3>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join thousands of focused individuals earning rewards while getting work done
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link
                href="/wfc"
                className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-emerald-500/30 flex items-center gap-3"
              >
                <span>Launch Workspace</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/gamefi"
                className="px-10 py-5 rounded-2xl glass-strong border-2 border-slate-600 hover:border-purple-500/50 text-slate-200 hover:text-white font-bold text-lg transition-all hover:scale-105"
              >
                View Rewards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}