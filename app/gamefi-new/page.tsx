"use client";

import { useState } from "react";
import { TopMenuBar } from "@/components/top-menu-bar";
import { GameFiApp } from "@/components/apps-new/gamefi-app";
import { FloatingXPNotification, useXPNotifications } from "@/components/gamefi/floating-xp-notification";

export default function GameFiDashboardPage() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { notifications, addNotification, removeNotification } = useXPNotifications();

  const handleMenuClick = () => {
    // Handle menu click
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/background/bg-1.webp')`,
        }}
      />
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50" />

      {/* Top Menu Bar */}
      <TopMenuBar
        onMenuClick={handleMenuClick}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        showGameFiStats={true}
      />

      {/* GameFi Dashboard Content */}
      <div className="relative z-10 h-full pt-14 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <GameFiApp />
        </div>
      </div>

      {/* XP Notifications */}
      <FloatingXPNotification
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Demo XP Button (for testing) */}
      <button
        onClick={() => addNotification(100, "Completed a daily challenge")}
        className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg text-sm opacity-50 hover:opacity-100 transition-all"
      >
        Test XP +
      </button>
    </div>
  );
}

