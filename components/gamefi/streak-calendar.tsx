import { motion } from "motion/react";
import { Flame } from "lucide-react";

interface StreakDay {
  date: Date;
  completed: boolean;
  count: number;
}

export function StreakCalendar() {
  // Generate last 49 days (7 weeks)
  const today = new Date();
  const days: StreakDay[] = [];
  
  for (let i = 48; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Mock data - in real app, this would come from actual user data
    const completed = Math.random() > 0.3; // 70% chance of completion
    const count = completed ? Math.floor(Math.random() * 10) + 1 : 0;
    
    days.push({ date, completed, count });
  }

  const currentStreak = 7; // Mock current streak
  const longestStreak = 14; // Mock longest streak

  const getIntensityColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count <= 2) return "bg-purple-200";
    if (count <= 5) return "bg-purple-400";
    if (count <= 8) return "bg-purple-600";
    return "bg-purple-800";
  };

  const dayLabels = ["Mon", "Wed", "Fri"];

  return (
    <div>
      {/* Streak Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl text-gray-800">{currentStreak} days</div>
            <div className="text-xs text-gray-500">Current Streak</div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-xl text-gray-700">{longestStreak} days</div>
          <div className="text-xs text-gray-500">Longest Streak</div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="space-y-2">
        <div className="flex gap-1">
          <div className="w-8" /> {/* Spacer for labels */}
          <div className="flex-1 grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const isToday =
                day.date.toDateString() === today.toDateString();

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  whileHover={{ scale: 1.2 }}
                  className={`aspect-square rounded-md transition-all cursor-pointer ${getIntensityColor(
                    day.count
                  )} ${
                    isToday
                      ? "ring-2 ring-purple-500 ring-offset-2"
                      : ""
                  }`}
                  title={`${day.date.toLocaleDateString()}: ${day.count} tasks completed`}
                />
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs text-gray-500 mt-4">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded-sm" />
            <div className="w-4 h-4 bg-purple-200 rounded-sm" />
            <div className="w-4 h-4 bg-purple-400 rounded-sm" />
            <div className="w-4 h-4 bg-purple-600 rounded-sm" />
            <div className="w-4 h-4 bg-purple-800 rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
