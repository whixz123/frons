import { Timer, CheckSquare, StickyNote, Music, TrendingUp, Coffee, BarChart3, Trophy } from "lucide-react";
import { motion } from "motion/react";

interface AppLauncherProps {
  onLaunchApp: (appId: string) => void;
}

const apps = [
  { id: "pomodoro", name: "Pomodoro", icon: Timer, color: "from-red-500 to-orange-500", featured: false },
  { id: "todo", name: "Tasks", icon: CheckSquare, color: "from-blue-500 to-cyan-500", featured: false },
  { id: "notes", name: "Notes", icon: StickyNote, color: "from-yellow-500 to-amber-500", featured: false },
  { id: "music", name: "Ambience", icon: Music, color: "from-purple-500 to-pink-500", featured: false },
  { id: "stats", name: "Stats", icon: BarChart3, color: "from-green-500 to-emerald-500", featured: false },
  { id: "focus", name: "Focus", icon: Coffee, color: "from-amber-600 to-orange-600", featured: false },
  { id: "gamefi", name: "GameFi", icon: Trophy, color: "from-purple-600 to-pink-600", featured: true },
];

export function AppLauncher({ onLaunchApp }: AppLauncherProps) {
  return (
    <div className="fixed right-6 top-20 bottom-6 flex flex-col gap-3 z-40">
      <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-3 border border-white/10 shadow-2xl">
        <div className="flex flex-col gap-3">
          {apps.map((app, index) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onLaunchApp(app.id)}
              className={`group relative w-14 h-14 rounded-xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all hover:scale-110 ${
                app.featured ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-black/20" : ""
              }`}
              style={{
                backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
              }}
              title={app.name}
            >
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${app.color} opacity-100 group-hover:opacity-90 transition-opacity`}></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <app.icon className="w-6 h-6 text-white" />
              </div>
              
              {/* Featured Badge */}
              {app.featured && (
                <>
                  {/* Pulsing Ring */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-xl ring-2 ring-yellow-400"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-black/20"
                  >
                    <span className="text-xs">✨</span>
                  </motion.div>
                </>
              )}
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {app.name}
                {app.featured && <span className="ml-1">✨</span>}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
