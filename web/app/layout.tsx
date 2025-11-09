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
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100 antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-slate-900 font-bold text-sm group-hover:scale-110 transition-transform">
                        F
                      </div>
                      <span className="text-xl font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        frons.id
                      </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                      <Link 
                        href="/" 
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors"
                      >
                        Timer
                      </Link>
                      <Link 
                        href="/wfc" 
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors"
                      >
                        Workspace
                      </Link>
                      <Link 
                        href="/gamefi" 
                        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors"
                      >
                        GameFi
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 text-xs font-medium text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Solana Devnet
                    </span>
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-slate-700/50 bg-slate-900/50 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <p className="text-center text-sm text-slate-500">
                  Built with Next.js and Solana • frons.id © 2025
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
