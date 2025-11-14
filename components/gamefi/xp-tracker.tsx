import { motion, AnimatePresence } from "motion/react";
import { Zap, CheckCircle, Timer, StickyNote } from "lucide-react";
import { Progress } from "../ui/progress";

interface XPActivity {
  id: string;
  type: "pomodoro" | "task" | "note" | "streak";
  description: string;
  baseXP: number;
  multiplier: number;
  timestamp: number;
}

interface XPTrackerProps {
  recentActivities: XPActivity[];
  totalXP: number;
  dailyGoal: number;
}

const activityIcons = {
  pomodoro: Timer,
  task: CheckCircle,
  note: StickyNote,
  streak: Zap,
};

const activityColors = {
  pomodoro: "from-red-500 to-orange-500",
  task: "from-blue-500 to-cyan-500",
  note: "from-yellow-500 to-amber-500",
  streak: "from-purple-500 to-pink-500",
};

export function XPTracker({ recentActivities, totalXP, dailyGoal }: XPTrackerProps) {
  const progress = Math.min((totalXP / dailyGoal) * 100, 100);
  const remainingXP = Math.max(dailyGoal - totalXP, 0);

  return (
    <div className="space-y-4">
      {/* Daily Progress */}
      <div className="p-4 bg-white rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-700">Daily XP Progress</span>
          </div>
          <span className="text-sm text-gray-600">
            {totalXP.toLocaleString()} / {dailyGoal.toLocaleString()}
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <div className="text-xs text-gray-500">
          {remainingXP > 0 ? (
            <>
              {remainingXP.toLocaleString()} XP to reach daily goal
            </>
          ) : (
            <span className="text-green-600">🎉 Daily goal achieved!</span>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="space-y-2">
        <h4 className="text-sm text-gray-700 px-1">Recent XP Gains</h4>
        <AnimatePresence>
          {recentActivities.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-gray-200 text-center text-gray-400 text-sm">
              Complete activities to earn XP
            </div>
          ) : (
            recentActivities.map((activity) => {
              const Icon = activityIcons[activity.type];
              const totalXP = Math.floor(activity.baseXP * activity.multiplier);
              const bonusXP = totalXP - activity.baseXP;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activityColors[activity.type]} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800 truncate">
                        {activity.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-purple-600">
                        +{totalXP} XP
                      </div>
                      {bonusXP > 0 && (
                        <div className="text-xs text-amber-600">
                          (+{bonusXP} bonus)
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* XP Breakdown */}
      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <h4 className="text-sm text-gray-700 mb-3">XP Earning Guide</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Complete Pomodoro</span>
            <span className="text-purple-600">+50 XP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Complete Task</span>
            <span className="text-purple-600">+25 XP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Create Note</span>
            <span className="text-purple-600">+10 XP</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Daily Streak</span>
            <span className="text-purple-600">+100 XP</span>
          </div>
          <div className="pt-2 mt-2 border-t border-purple-200 flex items-center justify-between">
            <span className="text-gray-700">With Staking Multiplier</span>
            <span className="text-amber-600">Up to 2.5x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
