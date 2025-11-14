import { motion } from "motion/react";
import { Check, Clock, Zap, Target, CheckSquare } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
  completed: boolean;
  color: string;
}

const challenges: Challenge[] = [
  {
    id: "daily-pomodoros",
    title: "Focus Sprint",
    description: "Complete 5 Pomodoro sessions",
    icon: "clock",
    progress: 3,
    maxProgress: 5,
    xpReward: 100,
    completed: false,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "daily-tasks",
    title: "Task Crusher",
    description: "Complete 8 tasks today",
    icon: "check",
    progress: 8,
    maxProgress: 8,
    xpReward: 75,
    completed: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "early-start",
    title: "Early Bird",
    description: "Start work before 8 AM",
    icon: "zap",
    progress: 1,
    maxProgress: 1,
    xpReward: 50,
    completed: true,
    color: "from-yellow-500 to-amber-500",
  },
  {
    id: "focus-time",
    title: "Deep Work",
    description: "Focus for 4 hours total",
    icon: "target",
    progress: 2.5,
    maxProgress: 4,
    xpReward: 150,
    completed: false,
    color: "from-purple-500 to-pink-500",
  },
];

const iconMap = {
  clock: Clock,
  check: CheckSquare,
  zap: Zap,
  target: Target,
};

export function DailyChallenges() {
  const completedCount = challenges.filter((c) => c.completed).length;
  const totalXP = challenges.reduce((sum, c) => sum + (c.completed ? c.xpReward : 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl text-gray-800 mb-1">Daily Challenges</h3>
          <p className="text-sm text-gray-600">
            {completedCount} of {challenges.length} completed • {totalXP} XP earned
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Resets in 14h 23m
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="space-y-3">
        {challenges.map((challenge, index) => {
          const Icon = iconMap[challenge.icon as keyof typeof iconMap] || Target;
          const progressPercent = (challenge.progress / challenge.maxProgress) * 100;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                challenge.completed
                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-300"
                  : "bg-white border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    challenge.completed
                      ? "bg-gradient-to-br from-green-500 to-emerald-500"
                      : `bg-gradient-to-br ${challenge.color}`
                  }`}
                >
                  {challenge.completed ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-gray-800 mb-0.5">{challenge.title}</h4>
                      <p className="text-sm text-gray-600">{challenge.description}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-amber-600 ml-4">
                      <Zap className="w-4 h-4" />
                      <span>{challenge.xpReward}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {!challenge.completed && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>
                          {challenge.progress} / {challenge.maxProgress}
                        </span>
                        <span className="text-purple-600">
                          {Math.round(progressPercent)}%
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}

                  {challenge.completed && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="w-4 h-4" />
                      <span>Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
