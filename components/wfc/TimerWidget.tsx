"use client";

import { useState, useEffect, useRef } from "react";
import Widget from "./Widget";
import { Howl } from "howler";

type TimerWidgetProps = {
  onClose?: () => void;
};

export default function TimerWidget({ onClose }: TimerWidgetProps) {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  
  const [todaySessions, setTodaySessions] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [monthSessions, setMonthSessions] = useState(2);

  const tickSoundRef = useRef<Howl | null>(null);
  const completeSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    tickSoundRef.current = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
      volume: 0.3
    });
    completeSoundRef.current = new Howl({
      src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'],
      volume: 0.5
    });
    return () => {
      tickSoundRef.current?.unload();
      completeSoundRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          completeSoundRef.current?.play();
          setIsRunning(false);
          if (mode === "work") {
            setTodaySessions(s => s + 1);
            setMonthSessions(s => s + 1);
          }
          return 0;
        }
        if (prev % 60 === 0) tickSoundRef.current?.play();
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === "work" 
    ? ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100
    : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

  return (
    <Widget
      title="Focus Timer"
      icon="⏰"
      onClose={onClose}
      defaultPosition={{ x: 80, y: 120 }}
      width="520px"
      gradient="from-rose-500 via-orange-500 to-amber-500"
    >
      <div className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1 bg-white/[0.03] rounded-xl">
          <button
            onClick={() => { setMode("work"); setTimeLeft(workDuration * 60); setIsRunning(false); }}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
              mode === "work"
                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            Work
          </button>
          <button
            onClick={() => { setMode("break"); setTimeLeft(breakDuration * 60); setIsRunning(false); }}
            className={`flex-1 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
              mode === "break"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl blur-xl" />
          <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] rounded-2xl p-8 border border-white/[0.08]">
            <div className="text-center">
              <div className="text-7xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tabular-nums">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-3 text-sm text-gray-400 font-medium">
                {isRunning ? "In Progress" : "Ready to Focus"}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6 h-2 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.02]"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => { setTimeLeft(mode === "work" ? workDuration * 60 : breakDuration * 60); setIsRunning(false); }}
            className="px-6 py-4 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 rounded-xl font-semibold border border-white/[0.08] transition-all duration-300"
          >
            Reset
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today", value: todaySessions, unit: "sessions" },
            { label: "Streak", value: streakDays, unit: "days" },
            { label: "Month", value: monthSessions, unit: "sessions" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="pt-4 border-t border-white/[0.05]">
          <div className="text-sm text-gray-400 font-semibold mb-3">Duration Settings</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Work (min)</label>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-center font-semibold focus:outline-none focus:border-orange-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Break (min)</label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white text-center font-semibold focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </Widget>
  );
}

