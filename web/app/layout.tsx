import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import Link from "next/link";

export const metadata: Metadata = {
  title: "frons.id - Productivity Workspace",
  description: "Your all-in-one productivity workspace with Pomodoro timer, tasks, notes, and GameFi rewards",
  manifest: "/manifest.json"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased relative overflow-x-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0">
          {/* Gradient Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950"></div>
        </div>

        <Providers>
          <div className="min-h-screen flex flex-col relative z-10">
            <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3 group">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-900 font-bold text-lg group-hover:scale-110 transition-transform shadow-lg">
                          F
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                          frons.id
                        </span>
                        <span className="text-xs text-slate-500 -mt-1">Web3 Productivity</span>
                      </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                      <Link 
                        href="/" 
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-all relative group"
                      >
                        <span className="relative z-10">Timer</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Link>
                      <Link 
                        href="/wfc" 
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-all relative group"
                      >
                        <span className="relative z-10">Workspace</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Link>
                      <Link 
                        href="/gamefi" 
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-all relative group"
                      >
                        <span className="relative z-10">GameFi</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm text-xs font-medium text-slate-400 border border-slate-700/50">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      Solana Devnet
                    </span>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-900 font-bold text-sm">
                        F
                      </div>
                      <span className="font-bold text-lg">frons.id</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Web3-powered productivity workspace. Focus, earn, and level up.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-slate-300">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/" className="text-slate-400 hover:text-emerald-400 transition-colors">Home</Link></li>
                      <li><Link href="/wfc" className="text-slate-400 hover:text-emerald-400 transition-colors">Workspace</Link></li>
                      <li><Link href="/gamefi" className="text-slate-400 hover:text-emerald-400 transition-colors">GameFi</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4 text-slate-300">Powered By</h4>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">Solana</span>
                      <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50">Next.js</span>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-800">
                  <p className="text-center text-sm text-slate-500">
                    © 2025 frons.id • Built with ❤️ for productivity
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
