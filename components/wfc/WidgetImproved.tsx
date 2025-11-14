"use client";

import { ReactNode } from "react";
import Draggable from "react-draggable";

interface WidgetProps {
  title: string;
  icon?: string;
  onClose?: () => void;
  children: ReactNode;
  defaultPosition?: { x: number; y: number };
  width?: string;
  height?: string;
}

export default function Widget({
  title,
  icon,
  onClose,
  children,
  defaultPosition = { x: 100, y: 100 },
  width = "400px",
  height = "auto"
}: WidgetProps) {
  return (
    <Draggable
      handle=".widget-header"
      defaultPosition={defaultPosition}
      bounds="parent"
    >
      <div
        className="absolute"
        style={{ width, height: height === "auto" ? "auto" : height }}
      >
        <div className="bg-gradient-to-br from-indigo-950/95 to-indigo-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-orange-500/30 overflow-hidden">
          {/* Header */}
          <div className="widget-header cursor-move bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between border-b border-orange-400/30">
            <div className="flex items-center gap-3">
              {icon && <span className="text-2xl">{icon}</span>}
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg bg-orange-600/50 hover:bg-orange-700 text-white flex items-center justify-center transition">
                <span className="text-lg">−</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center transition"
                >
                  <span className="text-lg">✕</span>
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  );
}

