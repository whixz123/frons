import { motion } from "motion/react";
import { Lock, Check, Trophy, Zap, Target, Star, Award, Coffee } from "lucide-react";
import { Progress } from "../ui/progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  xpReward: number;
}

const achievements: Achievement[] = [
  {
    id: "first-pomodoro",
    title: "First Focus",
    description: "Complete your first Pomodoro session",
    icon: "timer",
    color: "from-red-500 to-orange-500",
    unlocked: true,
    xpReward: 50,
  },
  {
    id: "task-master",
    title: "Task Master",
    description: "Complete 10 tasks in a single day",
    icon: "check",
    color: "from-blue-500 to-cyan-500",
    unlocked: true,
    progress: 10,
    maxProgress: 10,
    xpReward: 100,
  },
  {
    id: "streak-warrior",
    title: "Streak Warrior",
    description: "Maintain a 7-day streak",
    icon: "zap",
    color: "from-yellow-500 to-amber-500",
    unlocked: false,
    progress: 5,
    maxProgress: 7,
    xpReward: 200,
  },
  {
    id: "focus-master",
    title: "Focus Master",
    description: "Complete 100 Pomodoro sessions",
    icon: "target",
    color: "from-purple-500 to-pink-500",
    unlocked: false,
    progress: 67,
    maxProgress: 100,
    xpReward: 500,
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Start work before 7 AM",
    icon: "star",
    color: "from-indigo-500 to-purple-500",
    unlocked: true,
    xpReward: 75,
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Work past midnight",
    icon: "coffee",
    color: "from-slate-500 to-gray-700",
    unlocked: false,
    xpReward: 75,
  },
  {
    id: "productivity-legend",
    title: "Productivity Legend",
    description: "Reach level 10",
    icon: "award",
    color: "from-amber-500 to-orange-600",
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    xpReward: 1000,
  },
  {
    id: "note-taker",
    title: "Note Taker",
    description: "Create 50 notes",
    icon: "trophy",
    color: "from-green-500 to-emerald-500",
    unlocked: false,
    progress: 23,
    maxProgress: 50,
    xpReward: 150,
  },
];

const iconMap = {
  timer: Zap,
  check: Check,
  zap: Zap,
  target: Target,
  star: Star,
  coffee: Coffee,
  award: Award,
  trophy: Trophy,
};

export function AchievementGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {achievements.map((achievement, index) => {
        const Icon = iconMap[achievement.icon as keyof typeof iconMap] || Trophy;
        const hasProgress = achievement.progress !== undefined && achievement.maxProgress !== undefined;
        const progressPercent = hasProgress
          ? (achievement.progress! / achievement.maxProgress!) * 100
          : 100;

        return (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              achievement.unlocked
                ? "bg-white border-purple-200 shadow-lg hover:shadow-xl"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {/* Achievement Icon */}
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${achievement.color}`
                    : "bg-gray-300"
                }`}
              >
                {achievement.unlocked ? (
                  <Icon className="w-6 h-6 text-white" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-500" />
                )}
              </div>
              
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>

            {/* Achievement Info */}
            <h4
              className={`mb-1 ${
                achievement.unlocked ? "text-gray-800" : "text-gray-500"
              }`}
            >
              {achievement.title}
            </h4>
            <p className="text-xs text-gray-500 mb-3">{achievement.description}</p>

            {/* Progress Bar (if applicable) */}
            {hasProgress && (
              <div className="space-y-1 mb-2">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    {achievement.progress} / {achievement.maxProgress}
                  </span>
                  <span className="text-purple-600">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <Progress value={progressPercent} className="h-1.5" />
              </div>
            )}

            {/* XP Reward */}
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <Zap className="w-3 h-3" />
              <span>{achievement.xpReward} XP</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
