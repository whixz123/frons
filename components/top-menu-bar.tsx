import { Volume2, VolumeX, Clock, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";

interface TopMenuBarProps {
  onMenuClick: () => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  showGameFiStats?: boolean;
}

export function TopMenuBar({ onMenuClick, isSoundEnabled, onToggleSound, showGameFiStats = true }: TopMenuBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Mock GameFi stats - in production, this would come from context/state
  const level = 7;
  const currentXP = 2850;
  const nextLevelXP = 4000;
  const xpProgress = (currentXP / nextLevelXP) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-black/20 backdrop-blur-md border-b border-white/10 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">F</span>
            </div>
            <span className="text-white/90">frons.id</span>
          </div>
          
          <nav className="flex items-center gap-4">
            <button className="text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              Workspace
            </button>
            <button className="text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              Apps
            </button>
            <button className="text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              About
            </button>
          </nav>
        </div>

        {/* Center Section - Time & GameFi Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white/90">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          {showGameFiStats && (
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white/30">
                  <span className="text-white text-xs">{level}</span>
                </div>
                <div>
                  <div className="text-xs text-white/70">Level {level}</div>
                  <div className="text-xs text-white/90">{currentXP.toLocaleString()} XP</div>
                </div>
              </div>
              <div className="w-24">
                <Progress value={xpProgress} className="h-1.5 bg-white/20" />
              </div>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSound}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSoundEnabled ? (
              <Volume2 className="w-5 h-5 text-white/90" />
            ) : (
              <VolumeX className="w-5 h-5 text-white/90" />
            )}
          </button>
          
          <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all shadow-lg hover:shadow-purple-500/50">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
