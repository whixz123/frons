"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export function DesktopBackground() {
  const [backgroundIndex, setBackgroundIndex] = useState(1);
  const totalBackgrounds = 17;

  useEffect(() => {
    // Load saved background from localStorage
    const saved = localStorage.getItem('backgroundIndex');
    if (saved) {
      setBackgroundIndex(parseInt(saved));
    }
  }, []);

  const backgroundPath = `/background/bg-${backgroundIndex}.webp`;

  return (
    <div className="fixed inset-0 -z-50">
      <Image
        src={backgroundPath}
        alt="Coffee shop background"
        fill
        className="object-cover"
        priority
        quality={90}
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
}

