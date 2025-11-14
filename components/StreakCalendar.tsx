"use client";

import { useMemo } from "react";
import clsx from "clsx";

type SessionHistoryItem = {
  startTs: number;
  kind: string;
  pointsDelta: number;
};

type StreakCalendarProps = {
  history: SessionHistoryItem[];
  currentStreak: number;
};

export function StreakCalendar({ history, currentStreak }: StreakCalendarProps) {
  // Generate last 12 weeks of data
  const calendarData = useMemo(() => {
    const weeks = 12;
    const daysInWeek = 7;
    const totalDays = weeks * daysInWeek;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const days: Array<{
      date: Date;
      sessions: number;
      points: number;
      intensity: number;
    }> = [];

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Count sessions for this day
      const daySessions = history.filter(session => {
        const sessionDate = new Date(session.startTs * 1000);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });

      const sessions = daySessions.length;
      const points = daySessions.reduce((sum, s) => sum + s.pointsDelta, 0);
      
      // Calculate intensity (0-4 scale)
      let intensity = 0;
      if (sessions > 0) intensity = 1;
      if (sessions >= 3) intensity = 2;
      if (sessions >= 5) intensity = 3;
      if (sessions >= 8) intensity = 4;

      days.push({ date, sessions, points, intensity });
    }

    // Group by weeks
    const weekGroups: typeof days[] = [];
    for (let i = 0; i < days.length; i += daysInWeek) {
      weekGroups.push(days.slice(i, i + daysInWeek));
    }

    return weekGroups;
  }, [history]);

  const stats = useMemo(() => {
    const last30Days = history.filter(session => {
      const sessionDate = new Date(session.startTs * 1000);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return sessionDate >= thirtyDaysAgo;
    });

    const totalSessions = last30Days.length;
    const totalPoints = last30Days.reduce((sum, s) => sum + s.pointsDelta, 0);
    const avgPerDay = totalSessions / 30;

    // Calculate active days (days with at least 1 session)
    const activeDays = new Set(
      last30Days.map(s => {
        const date = new Date(s.startTs * 1000);
        return date.toDateString();
      })
    ).size;

    return {
      totalSessions,
      totalPoints,
      avgPerDay: avgPerDay.toFixed(1),
      activeDays
    };
  }, [history]);

  const intensityColors = [
    "bg-slate-800", // 0 sessions
    "bg-emerald-900/40", // 1-2 sessions
    "bg-emerald-600/60", // 3-4 sessions
    "bg-emerald-500/80", // 5-7 sessions
    "bg-emerald-400" // 8+ sessions
  ];

  const monthLabels = useMemo(() => {
    const labels: Array<{ month: string; weekIndex: number }> = [];
    let lastMonth = -1;

    calendarData.forEach((week, index) => {
      const firstDay = week[0].date;
      const month = firstDay.getMonth();
      
      if (month !== lastMonth) {
        labels.push({
          month: firstDay.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: index
        });
        lastMonth = month;
      }
    });

    return labels;
  }, [calendarData]);

  return (
    <div className="border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-emerald-300 flex items-center gap-2">
          📅 Activity Calendar
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-emerald-400">{currentStreak}</div>
          <div className="text-xs text-slate-400">Day Streak</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-emerald-400">{stats.totalSessions}</div>
          <div className="text-xs text-slate-400">Sessions (30d)</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-cyan-400">{stats.totalPoints}</div>
          <div className="text-xs text-slate-400">Points (30d)</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">{stats.avgPerDay}</div>
          <div className="text-xs text-slate-400">Avg/Day</div>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">{stats.activeDays}</div>
          <div className="text-xs text-slate-400">Active Days</div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month Labels */}
          <div className="flex gap-[3px] mb-2 ml-8">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className="text-xs text-slate-400"
                style={{ marginLeft: index === 0 ? 0 : `${(label.weekIndex - (monthLabels[index - 1]?.weekIndex || 0) - 1) * 15}px` }}
              >
                {label.month}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex gap-[3px]">
            {/* Day Labels */}
            <div className="flex flex-col gap-[3px] text-xs text-slate-400 pr-2">
              <div style={{ height: '12px' }}>Mon</div>
              <div style={{ height: '12px' }}></div>
              <div style={{ height: '12px' }}>Wed</div>
              <div style={{ height: '12px' }}></div>
              <div style={{ height: '12px' }}>Fri</div>
              <div style={{ height: '12px' }}></div>
              <div style={{ height: '12px' }}>Sun</div>
            </div>

            {/* Weeks */}
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dayIndex) => {
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  
                  return (
                    <div
                      key={dayIndex}
                      className={clsx(
                        "w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer group relative",
                        intensityColors[day.intensity],
                        isToday && "ring-2 ring-cyan-400"
                      )}
                      title={`${day.date.toLocaleDateString()}: ${day.sessions} sessions, ${day.points} points`}
                    >
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                        <div className="font-semibold text-white">{day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-emerald-400">{day.sessions} sessions</div>
                        <div className="text-cyan-400">{day.points} points</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
            <span>Less</span>
            {intensityColors.map((color, index) => (
              <div key={index} className={clsx("w-3 h-3 rounded-sm", color)} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Streak Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-xl border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="font-semibold text-emerald-300">
              {currentStreak > 0 ? `${currentStreak} day streak!` : "Start your streak today!"}
            </div>
            <div className="text-xs text-slate-400">
              {currentStreak > 0 
                ? "Keep it going! Complete a session today to maintain your streak."
                : "Complete your first session to start building a streak."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

