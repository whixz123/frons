import { useState } from "react";
import { motion } from "motion/react";
import { Palette, Check } from "lucide-react";
import { Button } from "../ui/button";

interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  gradient: string;
  preview: string;
}

const themes: Theme[] = [
  {
    id: "coffee",
    name: "Coffee Shop",
    primary: "#8B4513",
    secondary: "#D2691E",
    gradient: "from-amber-600 to-orange-600",
    preview: "https://images.unsplash.com/photo-1642315160505-b3dff3a3c8b9?w=400",
  },
  {
    id: "sunset",
    name: "Sunset Vibes",
    primary: "#FF6B6B",
    secondary: "#FFD93D",
    gradient: "from-red-500 to-yellow-500",
    preview: "https://images.unsplash.com/photo-1495954484750-af469f2f9be5?w=400",
  },
  {
    id: "forest",
    name: "Forest Calm",
    primary: "#2D6A4F",
    secondary: "#52B788",
    gradient: "from-green-700 to-emerald-500",
    preview: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  },
  {
    id: "ocean",
    name: "Ocean Breeze",
    primary: "#0077B6",
    secondary: "#00B4D8",
    gradient: "from-blue-600 to-cyan-400",
    preview: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400",
  },
  {
    id: "midnight",
    name: "Midnight Purple",
    primary: "#5A189A",
    secondary: "#9D4EDD",
    gradient: "from-purple-700 to-purple-400",
    preview: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400",
  },
  {
    id: "solana",
    name: "Solana Gradient",
    primary: "#9945FF",
    secondary: "#14F195",
    gradient: "from-purple-500 to-green-400",
    preview: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
  },
];

interface ThemeCustomizationProps {
  currentTheme?: string;
  onThemeChange?: (themeId: string) => void;
}

export function ThemeCustomization({
  currentTheme = "coffee",
  onThemeChange,
}: ThemeCustomizationProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    if (onThemeChange) {
      onThemeChange(themeId);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Palette className="w-6 h-6 text-purple-600" />
        <div>
          <h3 className="text-xl text-gray-800">Workspace Themes</h3>
          <p className="text-sm text-gray-600">
            Customize your productivity environment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {themes.map((theme, index) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleThemeSelect(theme.id)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              selectedTheme === theme.id
                ? "border-purple-500 shadow-xl shadow-purple-200"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            {/* Theme Preview */}
            <div className="aspect-video bg-gray-200 relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-60`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl mb-1">Aa</div>
                  <div className="text-xs">Preview</div>
                </div>
              </div>
            </div>

            {/* Theme Info */}
            <div className="p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-gray-800 text-sm">{theme.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>
                </div>
                {selectedTheme === theme.id && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-gray-800 mb-1">Premium Themes</h4>
            <p className="text-sm text-gray-600 mb-3">
              Unlock exclusive themes by reaching higher levels and completing special achievements.
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              View Premium Themes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
