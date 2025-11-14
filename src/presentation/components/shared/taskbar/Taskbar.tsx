"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export function Taskbar() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-black/30 backdrop-blur-md rounded-lg mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src="/frons-logo.png"
            alt="frons.id"
            width={24}
            height={24}
            className="rounded"
          />
          <span className="text-white font-semibold text-sm">frons.id</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-white/90 hover:text-white text-sm px-3 py-1 rounded hover:bg-white/10 transition-colors">
            Menu
          </button>
          <button className="text-white/90 hover:text-white text-sm px-3 py-1 rounded hover:bg-white/10 transition-colors">
            Apps
          </button>
          <button className="text-white/90 hover:text-white text-sm px-3 py-1 rounded hover:bg-white/10 transition-colors">
            About
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-white/90 text-sm font-medium">{currentTime}</span>
      </div>
    </div>
  );
}

