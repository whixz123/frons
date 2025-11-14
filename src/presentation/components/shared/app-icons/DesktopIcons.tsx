"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { appRegistry } from "@/src/infrastructure/config/appRegistry";
import { AppIcon } from "./AppIcon";
import { playSound } from "@/src/infrastructure/lib/utils";
import { openWindowAtom } from "@/src/application/atoms/windowAtoms";

export function DesktopIcons() {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [, openWindow] = useAtom(openWindowAtom);

  // Convert appRegistry to array and filter hidden apps
  const apps = Object.entries(appRegistry)
    .filter(([, config]) => !config.hidden)
    .map(([id, config]) => ({
      id,
      ...config,
    }));

  const handleOpenApp = (appId: string) => {
    const appConfig = appRegistry[appId];
    if (!appConfig) return;

    const windowInstanceId = `${appId}-instance`;

    playSound("/sounds/open.mp3");

    openWindow({
      id: windowInstanceId,
      appId: appId,
      title: appConfig.name,
      minSize: appConfig.minSize,
      initialSize: appConfig.defaultSize,
    });

    setSelectedAppId(appId);
  };

  return (
    <>
      {/* Background click to clear selection */}
      <div
        className="fixed inset-0 -z-10"
        onClick={() => setSelectedAppId(null)}
      />

      {/* Desktop Icons - Right sidebar */}
      <div className="absolute top-4 right-4 flex flex-col gap-4 z-10 max-h-[calc(100vh-80px)] overflow-y-auto">
        {apps.map((app) => (
          <div
            key={app.id}
            className={`p-2 rounded-lg transition-all ${
              selectedAppId === app.id 
                ? "bg-white/20 backdrop-blur-sm" 
                : "hover:bg-white/10"
            }`}
          >
            <AppIcon
              src={app.src}
              name={app.name}
              appId={app.id}
              onOpenApp={handleOpenApp}
              onSelect={setSelectedAppId}
            />
          </div>
        ))}
      </div>
    </>
  );
}

