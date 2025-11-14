"use client";

import { useState } from "react";
import { TopMenuBar } from "@/components/top-menu-bar";
import { AppLauncher } from "@/components/app-launcher";
import { Window } from "@/components/window-manager";
import { PomodoroApp } from "@/components/apps-new/pomodoro-app";
import { TodoApp } from "@/components/apps-new/todo-app";
import { NotesApp } from "@/components/apps-new/notes-app";
import { MusicApp } from "@/components/apps-new/music-app";
import { StatsApp } from "@/components/apps-new/stats-app";
import { FocusApp } from "@/components/apps-new/focus-app";
import { GameFiApp } from "@/components/apps-new/gamefi-app";
import { FloatingXPNotification, useXPNotifications } from "@/components/gamefi/floating-xp-notification";
import { Timer, CheckSquare, StickyNote, Music, BarChart3, Coffee, Trophy } from "lucide-react";

interface OpenWindow {
  id: string;
  appId: string;
  zIndex: number;
}

const appComponents = {
  pomodoro: PomodoroApp,
  todo: TodoApp,
  notes: NotesApp,
  music: MusicApp,
  stats: StatsApp,
  focus: FocusApp,
  gamefi: GameFiApp,
};

const appIcons = {
  pomodoro: Timer,
  todo: CheckSquare,
  notes: StickyNote,
  music: Music,
  stats: BarChart3,
  focus: Coffee,
  gamefi: Trophy,
};

const appTitles = {
  pomodoro: "Pomodoro Timer",
  todo: "Task Manager",
  notes: "Notes",
  music: "Ambient Sounds",
  stats: "Productivity Stats",
  focus: "Focus Mode",
  gamefi: "GameFi Hub",
};

const appDefaultSizes = {
  pomodoro: { width: 450, height: 600 },
  todo: { width: 500, height: 650 },
  notes: { width: 700, height: 600 },
  music: { width: 500, height: 550 },
  stats: { width: 600, height: 650 },
  focus: { width: 500, height: 600 },
  gamefi: { width: 750, height: 750 },
};

export default function WorkspacePage() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { notifications, addNotification, removeNotification } = useXPNotifications();

  const launchApp = (appId: string) => {
    // Check if app is already open
    const existingWindow = openWindows.find((w) => w.appId === appId);
    if (existingWindow) {
      // Bring to front
      focusWindow(existingWindow.id);
      return;
    }

    // Create new window with random offset
    const offset = openWindows.length * 30;
    const newWindow: OpenWindow = {
      id: `${appId}-${Date.now()}`,
      appId,
      zIndex: nextZIndex,
    };

    setOpenWindows([...openWindows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setOpenWindows(openWindows.filter((w) => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setOpenWindows((windows) =>
      windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  const handleMenuClick = () => {
    // Handle menu click
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=2078&auto=format&fit=crop')`,
        }}
      />
      
      {/* Subtle Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Top Menu Bar */}
      <TopMenuBar
        onMenuClick={handleMenuClick}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        showGameFiStats={false}
      />

      {/* App Launcher Sidebar */}
      <AppLauncher onLaunchApp={launchApp} />

      {/* Windows */}
      {openWindows.map((window, index) => {
        const AppComponent = appComponents[window.appId as keyof typeof appComponents];
        const Icon = appIcons[window.appId as keyof typeof appIcons];
        const title = appTitles[window.appId as keyof typeof appTitles];
        const defaultSize = appDefaultSizes[window.appId as keyof typeof appDefaultSizes];
        
        // Calculate position with offset
        const baseX = 150;
        const baseY = 120;
        const offset = index * 30;

        return (
          <Window
            key={window.id}
            id={window.id}
            title={title}
            icon={<Icon className="w-5 h-5" />}
            onClose={() => closeWindow(window.id)}
            defaultPosition={{ x: baseX + offset, y: baseY + offset }}
            defaultSize={defaultSize}
            zIndex={window.zIndex}
            onFocus={() => focusWindow(window.id)}
          >
            <AppComponent />
          </Window>
        );
      })}

      {/* Welcome Message - Only shown when no windows are open */}
      {openWindows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-2xl px-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                <span className="text-white text-6xl font-bold">F</span>
              </div>
            </div>
            <h1 className="text-7xl font-bold mb-6 text-white drop-shadow-lg">
              Welcome to frons.id
            </h1>
            <p className="text-2xl text-white/90 mb-12 drop-shadow-md">
              Your immersive productivity workspace on Solana
            </p>
            <div className="text-white/70 mb-8 text-lg drop-shadow">
              Click an app icon on the right to get started →
            </div>
            
            {/* Try GameFi Button */}
            <button
              onClick={() => launchApp('gamefi')}
              className="pointer-events-auto px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg rounded-2xl shadow-2xl transition-all hover:scale-105 flex items-center gap-3 mx-auto"
            >
              <Trophy className="w-6 h-6" />
              Try GameFi Hub with NFT Profiles
            </button>
          </div>
        </div>
      )}

      {/* NFT Feature Badge - Only when no windows open */}
      {openWindows.length === 0 && (
        <div className="fixed bottom-6 right-32 z-50">
          <div className="p-5 bg-gradient-to-br from-purple-500/95 to-pink-500/95 backdrop-blur-md rounded-2xl border border-white/20 text-white shadow-2xl max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-lg mb-2">New: NFT Profiles! 🎨</div>
                <div className="text-sm text-white/95 leading-relaxed">
                  Connect your Solana NFTs as profile pics, decorated with achievement frames
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Award Badge */}
      <div className="fixed bottom-6 left-6 z-50 opacity-40 hover:opacity-100 transition-opacity">
        <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white/80 text-sm">
          ✨ Inspired by Award-Winning Design
        </div>
      </div>

      {/* XP Notifications */}
      <FloatingXPNotification
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Demo XP Button (for testing) */}
      {openWindows.length > 0 && (
        <button
          onClick={() => addNotification(75, "Completed a Pomodoro session")}
          className="fixed bottom-6 right-24 z-50 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg text-sm opacity-50 hover:opacity-100 transition-all"
        >
          Test XP +
        </button>
      )}
    </div>
  );
}

