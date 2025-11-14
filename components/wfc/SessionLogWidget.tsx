"use client";

import { useState } from "react";
import Widget from "./Widget";

type SessionLogWidgetProps = {
  onClose: () => void;
};

export default function SessionLogWidget({ onClose }: SessionLogWidgetProps) {
  const [view, setView] = useState<"week" | "month" | "year">("week");

  return (
    <Widget 
      title="Session Log" 
      onClose={onClose}
      defaultPosition={{ x: 500, y: 140 }}
      width="800px"
      height="600px"
    >
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-amber-900 mb-2">Activity Overview</h3>
          <p className="text-amber-700">Review your completed work sessions</p>
        </div>

        {/* View Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView("week")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              view === "week"
                ? "bg-amber-700 text-white"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              view === "month"
                ? "bg-amber-700 text-white"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("year")}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              view === "year"
                ? "bg-amber-700 text-white"
                : "bg-amber-100 text-amber-900 hover:bg-amber-200"
            }`}
          >
            Year
          </button>
        </div>

        {/* Date Range */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button className="p-2 hover:bg-amber-100 rounded transition">
            <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-amber-900 font-semibold">Oct 19 - Oct 25, 2025</span>
          <button className="p-2 hover:bg-amber-100 rounded transition">
            <svg className="w-5 h-5 text-amber-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Chart Area */}
        <div className="bg-white rounded-xl p-6 border-2 border-amber-200 mb-6">
          <div className="h-64 flex items-end justify-around gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
              const height = Math.random() * 80 + 20;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-amber-300 rounded-t-lg hover:bg-amber-400 transition cursor-pointer" style={{ height: `${height}%` }} />
                  <span className="text-xs text-amber-800 font-semibold">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session List */}
        <div className="space-y-2">
          <h4 className="text-amber-900 font-bold mb-3">Recent Sessions</h4>
          {[
            { date: "Oct 21, 2025", time: "09:00 AM", duration: "25 min", type: "Work" },
            { date: "Oct 21, 2025", time: "09:30 AM", duration: "5 min", type: "Break" },
            { date: "Oct 20, 2025", time: "02:15 PM", duration: "50 min", type: "Work" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${session.type === "Work" ? "bg-green-500" : "bg-blue-500"}`} />
                <div>
                  <div className="font-semibold text-amber-900">{session.type} Session</div>
                  <div className="text-sm text-amber-700">{session.date} at {session.time}</div>
                </div>
              </div>
              <div className="text-amber-900 font-semibold">{session.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  );
}

