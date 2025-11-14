"use client";

import Image from "next/image";

interface AppIconProps {
  src: string;
  name: string;
  appId: string;
  onOpenApp: (appId: string) => void;
  onSelect: (appId: string) => void;
}

export function AppIcon({ src, name, appId, onOpenApp, onSelect }: AppIconProps) {
  const handleClick = () => {
    onOpenApp(appId);
  };

  const handleMouseDown = () => {
    onSelect(appId);
  };

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer group"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
        <Image
          src={src}
          alt={name}
          fill
          className="object-contain drop-shadow-lg"
        />
      </div>
      <span className="text-xs text-white drop-shadow-md font-medium text-center max-w-[80px] truncate">
        {name}
      </span>
    </div>
  );
}

