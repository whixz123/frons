import { useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Slider } from "../ui/slider";

interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const sounds: AmbientSound[] = [
  { id: "rain", name: "Rain", icon: "🌧️", color: "from-blue-400 to-blue-600" },
  { id: "cafe", name: "Café Chatter", icon: "☕", color: "from-amber-400 to-orange-600" },
  { id: "fire", name: "Fireplace", icon: "🔥", color: "from-orange-400 to-red-600" },
  { id: "waves", name: "Ocean Waves", icon: "🌊", color: "from-cyan-400 to-blue-600" },
  { id: "forest", name: "Forest", icon: "🌲", color: "from-green-400 to-emerald-600" },
  { id: "thunder", name: "Thunder", icon: "⚡", color: "from-purple-400 to-indigo-600" },
];

export function MusicApp() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState([70]);

  const toggleSound = (soundId: string) => {
    setActiveSound(activeSound === soundId ? null : soundId);
  };

  return (
    <div className="p-6 h-full bg-gradient-to-br from-purple-50 to-pink-50">
      <h2 className="text-2xl text-gray-800 mb-2">Ambient Sounds</h2>
      <p className="text-sm text-gray-600 mb-6">
        Create your perfect focus atmosphere
      </p>

      {/* Volume Control */}
      <div className="mb-8 p-4 bg-white rounded-xl border border-purple-200">
        <div className="flex items-center gap-3 mb-2">
          <Volume2 className="w-5 h-5 text-purple-600" />
          <span className="text-sm text-gray-700">Master Volume</span>
        </div>
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Sound Grid */}
      <div className="grid grid-cols-2 gap-4">
        {sounds.map((sound) => {
          const isActive = activeSound === sound.id;
          return (
            <button
              key={sound.id}
              onClick={() => toggleSound(sound.id)}
              className={`p-6 rounded-xl transition-all transform hover:scale-105 ${
                isActive
                  ? `bg-gradient-to-br ${sound.color} text-white shadow-2xl scale-105`
                  : "bg-white hover:bg-gray-50 border border-purple-200"
              }`}
            >
              <div className="text-4xl mb-3">{sound.icon}</div>
              <div className={`mb-2 ${isActive ? "text-white" : "text-gray-800"}`}>
                {sound.name}
              </div>
              <div className="flex items-center justify-center gap-2">
                {isActive ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span className="text-sm">Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Play</span>
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
