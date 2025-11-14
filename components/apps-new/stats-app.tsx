import { TrendingUp, Clock, CheckCircle, Target } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weekData = [
  { day: "Mon", pomodoros: 8, tasks: 12 },
  { day: "Tue", pomodoros: 6, tasks: 8 },
  { day: "Wed", pomodoros: 10, tasks: 15 },
  { day: "Thu", pomodoros: 7, tasks: 10 },
  { day: "Fri", pomodoros: 9, tasks: 13 },
  { day: "Sat", pomodoros: 5, tasks: 6 },
  { day: "Sun", pomodoros: 4, tasks: 5 },
];

export function StatsApp() {
  return (
    <div className="p-6 h-full overflow-auto bg-gradient-to-br from-green-50 to-emerald-50">
      <h2 className="text-2xl text-gray-800 mb-6">Productivity Stats</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600">Pomodoros Today</span>
          </div>
          <div className="text-3xl text-gray-800">12</div>
          <div className="text-xs text-green-600 mt-1">↑ 20% vs yesterday</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600">Tasks Completed</span>
          </div>
          <div className="text-3xl text-gray-800">18</div>
          <div className="text-xs text-green-600 mt-1">↑ 12% vs yesterday</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-600">Focus Time</span>
          </div>
          <div className="text-3xl text-gray-800">6.2h</div>
          <div className="text-xs text-green-600 mt-1">Goal: 8h/day</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Weekly Streak</span>
          </div>
          <div className="text-3xl text-gray-800">7</div>
          <div className="text-xs text-green-600 mt-1">Keep it up! 🔥</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-green-200 shadow-sm p-4">
        <h3 className="text-gray-800 mb-4">This Week</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="pomodoros" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Pomodoros</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
