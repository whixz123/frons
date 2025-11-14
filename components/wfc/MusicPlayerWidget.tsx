"use client";

import { useState, useRef } from "react";
import Widget from "./Widget";
import YouTube, { YouTubeProps } from "react-youtube";

type MusicPlayerWidgetProps = {
  onClose: () => void;
};

type Track = {
  id: string;
  title: string;
  url: string;
};

export default function MusicPlayerWidget({ onClose }: MusicPlayerWidgetProps) {
  const [playlist, setPlaylist] = useState<Track[]>([
    { id: "1", title: "Ghibli Piano", url: "https://www.youtube.com/watch?v=3jWRrafhO7M" },
    { id: "2", title: "Jazzjeans", url: "https://www.youtube.com/watch?v=Dx5qFachd3A" },
    { id: "3", title: "Lo-fi Study", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk" },
    { id: "4", title: "FKJ Live", url: "https://www.youtube.com/watch?v=sCNlt5nvSI8" },
  ]);
  
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [volume, setVolume] = useState(70);
  const [newUrl, setNewUrl] = useState("");
  
  const playerRef = useRef<any>(null);

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : "";
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev > 0 ? prev - 1 : playlist.length - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev < playlist.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const handleAddTrack = () => {
    if (newUrl) {
      const videoId = extractVideoId(newUrl);
      if (videoId) {
        const newTrack: Track = {
          id: Date.now().toString(),
          title: `Track ${playlist.length + 1}`,
          url: newUrl
        };
        setPlaylist([...playlist, newTrack]);
        setNewUrl("");
      }
    }
  };

  const handleRemoveTrack = (index: number) => {
    setPlaylist(playlist.filter((_, i) => i !== index));
    if (currentTrack >= playlist.length - 1) {
      setCurrentTrack(Math.max(0, playlist.length - 2));
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "200",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <Widget 
      title="Music Player" 
      onClose={onClose}
      defaultPosition={{ x: 500, y: 120 }}
      width="450px"
    >
      <div className="p-6 space-y-4">
        {/* Current Track */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-amber-900 mb-2">
            {playlist[currentTrack]?.title || "No Track"}
          </h3>
          <div className="text-sm text-amber-700">0:00 / 2:16:44</div>
        </div>

        {/* Video Player (Optional) */}
        {showVideo && playlist[currentTrack] && (
          <div className="rounded-lg overflow-hidden">
            <YouTube
              videoId={extractVideoId(playlist[currentTrack].url)}
              opts={opts}
              onReady={onPlayerReady}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handlePrevious}
            className="w-12 h-12 bg-amber-800 text-white rounded-full hover:bg-amber-700 transition flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          <button
            onClick={handlePlayPause}
            className="w-16 h-16 bg-amber-900 text-white rounded-full hover:bg-amber-800 transition flex items-center justify-center shadow-lg"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          <button
            onClick={handleNext}
            className="w-12 h-12 bg-amber-800 text-white rounded-full hover:bg-amber-700 transition flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 18h2V6h-2v12zM6 18l8.5-6L6 6v12z"/>
            </svg>
          </button>
        </div>

        {/* Show Video Toggle */}
        <button
          onClick={() => setShowVideo(!showVideo)}
          className="w-full py-2 bg-amber-100 text-amber-900 rounded-lg hover:bg-amber-200 transition font-semibold flex items-center justify-center gap-2"
        >
          <span>📹</span>
          <span>{showVideo ? "Hide Video" : "Show Video"}</span>
        </button>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <span className="text-amber-900">🔊</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #78350f 0%, #78350f ${volume}%, #fde68a ${volume}%, #fde68a 100%)`
            }}
          />
          <span className="text-amber-900 font-semibold w-12 text-right">{volume}%</span>
        </div>

        {/* Add Track */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter YouTube URL"
            className="flex-1 px-3 py-2 bg-white border-2 border-amber-200 rounded-lg focus:border-amber-400 focus:outline-none text-amber-900"
          />
          <button
            onClick={handleAddTrack}
            className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-700 transition font-bold"
          >
            +
          </button>
        </div>

        {/* Playlist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-amber-900 font-bold">Playlist</h4>
            <button className="text-sm text-amber-700 hover:text-amber-900">🔀 Sort</button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {playlist.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center justify-between p-2 rounded-lg transition cursor-pointer ${
                  index === currentTrack
                    ? "bg-amber-200"
                    : "bg-white hover:bg-amber-50"
                }`}
                onClick={() => {
                  setCurrentTrack(index);
                  setIsPlaying(true);
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-amber-800">🎵</span>
                  <span className="text-amber-900 font-semibold text-sm">{track.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Edit functionality
                    }}
                    className="text-amber-700 hover:text-amber-900"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTrack(index);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Widget>
  );
}

