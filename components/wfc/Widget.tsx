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
  gradient?: string;
}

export default function Widget({
  title,
  icon,
  onClose,
  children,
  defaultPosition = { x: 100, y: 100 },
  width = "480px",
  height = "auto",
  gradient = "from-orange-500 to-purple-600"
}: WidgetProps) {
  return (
    <Draggable
      handle=".widget-header"
      defaultPosition={defaultPosition}
      bounds="parent"
    >
      <div
        className="absolute group/widget"
        style={{ width, height: height === "auto" ? "auto" : height }}
      >
        {/* Premium Glow */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-3xl opacity-20 group-hover/widget:opacity-30 blur-xl transition duration-500`} />
        
        {/* Main Container */}
        <div className="relative bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/[0.08] overflow-hidden">
          {/* Top Accent Line */}
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient}`} />
          
          {/* Header */}
          <div className="widget-header cursor-move relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />
            
            <div className="relative px-7 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-xl blur-lg opacity-40`} />
                    <div className="relative text-3xl">
                      {icon}
                    </div>
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">
                  {title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200">
                  <span className="text-lg">−</span>
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 flex items-center justify-center transition-all duration-200"
                  >
                    <span className="text-lg">✕</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-7">
            {children}
          </div>

          {/* Bottom Accent */}
          <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r ${gradient} opacity-30`} />
        </div>
      </div>
    </Draggable>
  );
}

