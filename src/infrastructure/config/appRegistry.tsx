import { Size } from "@/src/application/types/window";
import React from "react";

// Import existing widgets
import TimerWidget from "@/components/wfc/TimerWidget";
import TodoWidget from "@/components/wfc/TodoWidget";
import MusicPlayerWidget from "@/components/wfc/MusicPlayerWidget";
import NotepadWidget from "@/components/wfc/NotepadWidget";
import BookmarkWidget from "@/components/wfc/BookmarkWidget";
import AmbienceWidget from "@/components/wfc/AmbienceWidget";
import SessionLogWidget from "@/components/wfc/SessionLogWidget";

interface AppRegistryEntry {
  name: string;
  src: string;
  defaultSize: Size;
  minSize?: Size;
  component: React.ComponentType<any>;
  hidden?: boolean;
}

export const appRegistry: Record<string, AppRegistryEntry> = {
  timer: {
    name: "Timer",
    src: "/icons/clock.png",
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 350, height: 500 },
    component: TimerWidget,
  },

  todoList: {
    name: "To-Do List",
    src: "/icons/board.png",
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 320, height: 400 },
    component: TodoWidget,
  },

  ambience: {
    name: "Ambience",
    src: "/icons/ambience.png",
    defaultSize: { width: 400, height: 300 },
    minSize: { width: 350, height: 250 },
    component: AmbienceWidget,
  },

  musicPlayer: {
    name: "Music Player",
    src: "/icons/music.png",
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 320, height: 400 },
    component: MusicPlayerWidget,
  },

  notepad: {
    name: "Notepad",
    src: "/icons/notepad.png",
    defaultSize: { width: 600, height: 600 },
    minSize: { width: 400, height: 400 },
    component: NotepadWidget,
  },

  bookmark: {
    name: "Bookmark",
    src: "/icons/bookmark.png",
    defaultSize: { width: 400, height: 600 },
    minSize: { width: 320, height: 400 },
    component: BookmarkWidget,
  },

  sessionLog: {
    name: "Session Log",
    src: "/icons/default.png",
    defaultSize: { width: 500, height: 400 },
    minSize: { width: 400, height: 300 },
    component: SessionLogWidget,
    hidden: true,
  },
};

