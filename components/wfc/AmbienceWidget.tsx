"use client";

import { useState, useEffect, useRef } from "react";
import Widget from "./Widget";
import { Howl } from "howler";

type AmbienceWidgetProps = {
  onClose: () => void;
  volume: number;
  setVolume: (v: number) => void;
};

type AmbienceSound = {
  id: string;
  name: string;
  icon: string;
  url: string;
  howl?: Howl;
};

export default function AmbienceWidget({ onClose, volume, setVolume }: AmbienceWidgetProps) {
  const [sounds, setSounds] = useState<AmbienceSound[]>([
    { id: "1", name: "Coffee Shop", icon: "☕", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
    { id: "2", name: "Rain", icon: "🌧️", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
    { id: "3", name: "Forest", icon: "🌲", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
    { id: "4", name: "Ocean Waves", icon: "🌊", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
    { id: "5", name: "Fireplace", icon: "🔥", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
    { id: "6", name: "White Noise", icon: "📻", url: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" },
  ]);
  
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const howlsRef = useRef<Map<string, Howl>>(new Map());

  // Initialize Howl instances
  useEffect(() => {
    sounds.forEach(sound => {
      if (!howlsRef.current.has(sound.id)) {
        const howl = new Howl({
          src: [sound.url],
          loop: true,
          volume: volume / 100,
        });
        howlsRef.current.set(sound.id, howl);
      }
    });

    return () => {
      howlsRef.current.forEach(howl => howl.unload());
      howlsRef.current.clear();
    };
  }, [sounds]);

  // Update volume for all playing sounds
  useEffect(() => {
    howlsRef.current.forEach(howl => {
      howl.volume(volume / 100);
    });
  }, [volume]);

  const toggleSound = (soundId: string) => {
    const howl = howlsRef.current.get(soundId);
    if (!howl) return;

    if (activeSounds.has(soundId)) {
      howl.stop();
      setActiveSounds(prev => {
        const newSet = new Set(prev);
        newSet.delete(soundId);
        return newSet;
      });
    } else {
      howl.play();
      setActiveSounds(prev => new Set(prev).add(soundId));
    }
  };

  const stopAll = () => {
    howlsRef.current.forEach(howl => howl.stop());
    setActiveSounds(new Set());
  };

  return (
    <Widget 
      title="Ambience" 
      onClose={onClose}
      defaultPosition={{ x: 600, y: 150 }}
      width="400px"
    >
      <div className="p-6 space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-amber-900 mb-1">Ambient Sounds</h3>
          <p className="text-sm text-amber-700">Create your perfect focus environment</p>
        </div>

        {/* Volume Control */}
        <div className="p-4 bg-amber-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-900 font-semibold">Master Volume</span>
            <span className="text-amber-900 font-bold">{volume}%</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setVolume(0)}
              className="text-amber-800 hover:text-amber-900"
            >
              🔇
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #78350f 0%, #78350f ${volume}%, #fde68a ${volume}%, #fde68a 100%)`
              }}
            />
            <button
              onClick={() => setVolume(100)}
              className="text-amber-800 hover:text-amber-900"
            >
              🔊
            </button>
          </div>
        </div>

        {/* Sound Grid */}
        <div className="grid grid-cols-2 gap-3">
          {sounds.map(sound => (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`p-4 rounded-xl transition-all ${
                activeSounds.has(sound.id)
                  ? "bg-amber-700 text-white shadow-lg scale-105"
                  : "bg-white text-amber-900 border-2 border-amber-200 hover:border-amber-400"
              }`}
            >
              <div className="text-3xl mb-2">{sound.icon}</div>
              <div className="text-sm font-semibold">{sound.name}</div>
            </button>
          ))}
        </div>

        {/* Active Sounds Info */}
        {activeSounds.size > 0 && (
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-green-800">
                <span className="font-semibold">{activeSounds.size}</span> sound{activeSounds.size !== 1 ? 's' : ''} playing
              </div>
              <button
                onClick={stopAll}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600 transition"
              >
                Stop All
              </button>
            </div>
          </div>
        )}

        {/* Presets */}
        <div className="pt-4 border-t border-amber-200">
          <h4 className="text-amber-900 font-bold mb-3">Quick Presets</h4>
          <div className="space-y-2">
            <button
              onClick={() => {
                stopAll();
                toggleSound("1");
              }}
              className="w-full py-2 px-3 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 transition text-left text-sm font-semibold"
            >
              ☕ Coffee Shop Vibes
            </button>
            <button
              onClick={() => {
                stopAll();
                toggleSound("2");
                toggleSound("3");
              }}
              className="w-full py-2 px-3 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 transition text-left text-sm font-semibold"
            >
              🌧️ Rainy Forest
            </button>
            <button
              onClick={() => {
                stopAll();
                toggleSound("4");
                toggleSound("5");
              }}
              className="w-full py-2 px-3 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 transition text-left text-sm font-semibold"
            >
              🌊 Beach Bonfire
            </button>
          </div>
        </div>
      </div>
    </Widget>
  );
}

