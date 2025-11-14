"use client";

import { useAtom } from "jotai";
import { windowsAtom, closeWindowAtom, minimizeWindowAtom, focusWindowAtom, updateWindowPositionAtom, updateWindowSizeAtom } from "@/src/application/atoms/windowAtoms";
import { appRegistry } from "@/src/infrastructure/config/appRegistry";
import { playSound } from "@/src/infrastructure/lib/utils";
import Draggable from "react-draggable";
import { useRef, useState } from "react";

export function Window() {
  const [windows] = useAtom(windowsAtom);
  const [, closeWindow] = useAtom(closeWindowAtom);
  const [, minimizeWindow] = useAtom(minimizeWindowAtom);
  const [, focusWindow] = useAtom(focusWindowAtom);
  const [, updatePosition] = useAtom(updateWindowPositionAtom);
  const [, updateSize] = useAtom(updateWindowSizeAtom);

  return (
    <>
      {windows.map((window) => {
        if (window.isMinimized) return null;

        const appConfig = appRegistry[window.appId];
        if (!appConfig) return null;

        const AppComponent = appConfig.component;

        return (
          <WindowInstance
            key={window.id}
            window={window}
            onClose={() => {
              playSound("/sounds/close.mp3");
              closeWindow(window.id);
            }}
            onMinimize={() => {
              playSound("/sounds/minimize.mp3");
              minimizeWindow(window.id);
            }}
            onFocus={() => focusWindow(window.id)}
            onPositionChange={(pos) => updatePosition({ windowId: window.id, position: pos })}
            onSizeChange={(size) => updateSize({ windowId: window.id, size })}
          >
            <AppComponent onClose={() => closeWindow(window.id)} />
          </WindowInstance>
        );
      })}
    </>
  );
}

interface WindowInstanceProps {
  window: any;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
}

function WindowInstance({
  window,
  children,
  onClose,
  onMinimize,
  onFocus,
  onPositionChange,
}: WindowInstanceProps) {
  const nodeRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".window-handle"
      position={window.position}
      onStart={() => {
        setIsDragging(true);
        onFocus();
      }}
      onStop={(e, data) => {
        setIsDragging(false);
        onPositionChange({ x: data.x, y: data.y });
      }}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`absolute bg-white rounded-lg shadow-2xl overflow-hidden transition-shadow ${
          window.isFocused ? "ring-2 ring-blue-500/50" : ""
        } ${isDragging ? "cursor-grabbing" : ""}`}
        style={{
          width: window.size.width,
          height: window.size.height,
          zIndex: window.zIndex,
          minWidth: window.minSize?.width || 300,
          minHeight: window.minSize?.height || 200,
        }}
        onMouseDown={onFocus}
      >
        {/* Window Title Bar */}
        <div className="window-handle flex items-center justify-between px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300 cursor-grab active:cursor-grabbing">
          <span className="text-sm font-medium text-gray-800 select-none">
            {window.title}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMinimize();
              }}
              className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
              title="Minimize"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              title="Close"
            />
          </div>
        </div>

        {/* Window Content */}
        <div className="h-[calc(100%-40px)] overflow-auto">
          {children}
        </div>
      </div>
    </Draggable>
  );
}

