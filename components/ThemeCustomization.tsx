"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

type Theme = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredPoints: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    gradient: string;
  };
};

const THEMES: Theme[] = [
  {
    id: "default",
    name: "Emerald Focus",
    description: "The classic productivity theme",
    icon: "💚",
    requiredPoints: 0,
    colors: {
      primary: "emerald",
      secondary: "cyan",
      accent: "teal",
      gradient: "from-emerald-500 to-cyan-500"
    }
  },
  {
    id: "sunset",
    name: "Sunset Vibes",
    description: "Warm and energizing",
    icon: "🌅",
    requiredPoints: 500,
    colors: {
      primary: "orange",
      secondary: "pink",
      accent: "rose",
      gradient: "from-orange-500 to-pink-500"
    }
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    description: "Cool and calming",
    icon: "🌊",
    requiredPoints: 1000,
    colors: {
      primary: "blue",
      secondary: "cyan",
      accent: "sky",
      gradient: "from-blue-500 to-cyan-500"
    }
  },
  {
    id: "forest",
    name: "Forest Zen",
    description: "Natural and peaceful",
    icon: "🌲",
    requiredPoints: 1500,
    colors: {
      primary: "green",
      secondary: "lime",
      accent: "emerald",
      gradient: "from-green-500 to-lime-500"
    }
  },
  {
    id: "royal",
    name: "Royal Purple",
    description: "Elegant and sophisticated",
    icon: "👑",
    requiredPoints: 2500,
    colors: {
      primary: "purple",
      secondary: "fuchsia",
      accent: "violet",
      gradient: "from-purple-500 to-fuchsia-500"
    }
  },
  {
    id: "fire",
    name: "Fire Energy",
    description: "Bold and intense",
    icon: "🔥",
    requiredPoints: 5000,
    colors: {
      primary: "red",
      secondary: "orange",
      accent: "amber",
      gradient: "from-red-500 to-orange-500"
    }
  },
  {
    id: "galaxy",
    name: "Galaxy Dreams",
    description: "Cosmic and mysterious",
    icon: "🌌",
    requiredPoints: 10000,
    colors: {
      primary: "indigo",
      secondary: "purple",
      accent: "pink",
      gradient: "from-indigo-500 via-purple-500 to-pink-500"
    }
  },
  {
    id: "gold",
    name: "Golden Legend",
    description: "Prestigious and rare",
    icon: "⭐",
    requiredPoints: 20000,
    colors: {
      primary: "amber",
      secondary: "yellow",
      accent: "orange",
      gradient: "from-amber-400 via-yellow-400 to-orange-500"
    }
  }
];

type ThemeCustomizationProps = {
  userPoints: number;
};

export function ThemeCustomization({ userPoints }: ThemeCustomizationProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [showPreview, setShowPreview] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("selected-theme");
    if (saved) {
      setSelectedTheme(saved);
    }
  }, []);

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem("selected-theme", themeId);
    // In production, this would apply the theme globally
    window.dispatchEvent(new CustomEvent("theme-changed", { detail: themeId }));
  };

  const unlockedThemes = THEMES.filter(theme => userPoints >= theme.requiredPoints);
  const lockedThemes = THEMES.filter(theme => userPoints < theme.requiredPoints);

  return (
    <div className="border border-pink-500/30 bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-pink-300 flex items-center gap-2">
          🎨 Themes
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-pink-400">{unlockedThemes.length}/{THEMES.length}</div>
          <div className="text-xs text-slate-400">Unlocked</div>
        </div>
      </div>

      {/* Current Theme */}
      <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/30">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{THEMES.find(t => t.id === selectedTheme)?.icon}</div>
          <div className="flex-1">
            <div className="font-semibold text-white">Current Theme</div>
            <div className="text-lg text-pink-300">{THEMES.find(t => t.id === selectedTheme)?.name}</div>
          </div>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 transition text-sm"
          >
            {showPreview ? "Hide" : "Preview"}
          </button>
        </div>
      </div>

      {/* Theme Preview */}
      {showPreview && (
        <div className="mb-6 p-6 bg-slate-800 rounded-xl">
          <div className="text-sm text-slate-400 mb-3">Theme Preview</div>
          <div className={clsx(
            "p-6 rounded-xl bg-gradient-to-r",
            THEMES.find(t => t.id === selectedTheme)?.colors.gradient
          )}>
            <div className="text-white font-bold text-xl mb-2">Sample Timer</div>
            <div className="text-white/90 text-4xl font-mono">25:00</div>
            <button className="mt-4 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition">
              Start Session
            </button>
          </div>
        </div>
      )}

      {/* Unlocked Themes */}
      {unlockedThemes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-slate-300 mb-3">✅ Unlocked Themes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleSelectTheme(theme.id)}
                className={clsx(
                  "p-4 rounded-xl border-2 transition-all text-left",
                  selectedTheme === theme.id
                    ? "border-pink-500 bg-pink-500/10"
                    : "border-slate-700 bg-slate-800/50 hover:border-pink-500/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{theme.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white mb-1">{theme.name}</div>
                    <div className="text-xs text-slate-400 mb-2">{theme.description}</div>
                    <div className={clsx(
                      "h-2 rounded-full bg-gradient-to-r",
                      theme.colors.gradient
                    )} />
                  </div>
                  {selectedTheme === theme.id && (
                    <div className="text-pink-400">✓</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Locked Themes */}
      {lockedThemes.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-slate-300 mb-3">🔒 Locked Themes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedThemes.map((theme) => (
              <div
                key={theme.id}
                className="p-4 rounded-xl border-2 border-slate-700 bg-slate-900/50 opacity-60"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl filter grayscale">{theme.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-400 mb-1">{theme.name}</div>
                    <div className="text-xs text-slate-500 mb-2">{theme.description}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-amber-400 font-semibold">
                        {theme.requiredPoints.toLocaleString()} points required
                      </div>
                      <div className="text-xs text-slate-500">
                        ({(theme.requiredPoints - userPoints).toLocaleString()} more needed)
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-600">🔒</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-3 bg-slate-800/50 rounded-lg text-center">
        <div className="text-xs text-slate-400">
          💡 Earn more points to unlock exclusive themes!
        </div>
      </div>
    </div>
  );
}

