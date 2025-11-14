import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export function PomodoroApp() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const totalSeconds = mode === "work" ? 25 * 60 : 5 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            setIsActive(false);
            if (mode === "work") {
              setCompletedPomodoros(prev => prev + 1);
              setMode("break");
              setMinutes(5);
            } else {
              setMode("work");
              setMinutes(25);
            }
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === "work" ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = (newMode: "work" | "break") => {
    setMode(newMode);
    setIsActive(false);
    setMinutes(newMode === "work" ? 25 : 5);
    setSeconds(0);
  };

  return (
    <div className="p-8 flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-50 to-orange-50">
      {/* Mode Selector */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => switchMode("work")}
          className={`px-6 py-2 rounded-lg transition-all ${
            mode === "work"
              ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
              : "bg-white/50 text-gray-700 hover:bg-white"
          }`}
        >
          Work
        </button>
        <button
          onClick={() => switchMode("break")}
          className={`px-6 py-2 rounded-lg transition-all ${
            mode === "break"
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
              : "bg-white/50 text-gray-700 hover:bg-white"
          }`}
        >
          Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="text-8xl text-gray-800 tabular-nums mb-4 text-center">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <Progress value={progress} className="w-80 h-2" />
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-8">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button onClick={resetTimer} size="lg" variant="outline">
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-1">Completed Today</div>
        <div className="flex items-center gap-2 justify-center">
          <Timer className="w-5 h-5 text-red-500" />
          <span className="text-2xl text-gray-800">{completedPomodoros}</span>
        </div>
      </div>
    </div>
  );
}
