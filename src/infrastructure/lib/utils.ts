import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sound playback utility
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');
  }
}

export function getSoundEnabled(): boolean {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('soundEnabled');
    return stored !== 'false'; // Default to true
  }
  return true;
}

export function playSound(soundPath: string, volume: number = 0.5) {
  if (!soundEnabled || typeof window === 'undefined') return;
  
  try {
    const audio = new Audio(soundPath);
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.play().catch((error) => {
      console.warn('Failed to play sound:', error);
    });
  } catch (error) {
    console.warn('Error playing sound:', error);
  }
}

// Initialize sound setting from localStorage
if (typeof window !== 'undefined') {
  soundEnabled = getSoundEnabled();
}

