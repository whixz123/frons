import { atom } from 'jotai';
import { WindowState, OpenWindowParams, Position, Size } from '../types/window';

// Atom to store all open windows
export const windowsAtom = atom<WindowState[]>([]);

// Atom to track the highest z-index
export const maxZIndexAtom = atom<number>(1);

// Helper function to generate random position
const getRandomPosition = (): Position => {
  const maxX = typeof window !== 'undefined' ? window.innerWidth - 500 : 800;
  const maxY = typeof window !== 'undefined' ? window.innerHeight - 400 : 600;
  return {
    x: Math.max(50, Math.random() * maxX),
    y: Math.max(50, Math.random() * maxY),
  };
};

// Derived atom to open a window
export const openWindowAtom = atom(
  null,
  (get, set, params: OpenWindowParams) => {
    const windows = get(windowsAtom);
    const existingWindow = windows.find((w) => w.id === params.id);

    if (existingWindow) {
      // If window exists and is minimized, restore it
      if (existingWindow.isMinimized) {
        set(windowsAtom, windows.map((w) =>
          w.id === params.id
            ? { ...w, isMinimized: false, isFocused: true }
            : { ...w, isFocused: false }
        ));
      } else {
        // Just focus it
        set(windowsAtom, windows.map((w) =>
          w.id === params.id
            ? { ...w, isFocused: true }
            : { ...w, isFocused: false }
        ));
      }
      return;
    }

    // Create new window
    const maxZ = get(maxZIndexAtom);
    const newZIndex = maxZ + 1;
    set(maxZIndexAtom, newZIndex);

    const newWindow: WindowState = {
      id: params.id,
      appId: params.appId,
      title: params.title,
      isMinimized: false,
      isFocused: true,
      position: params.initialPosition || getRandomPosition(),
      size: params.initialSize || { width: 400, height: 600 },
      minSize: params.minSize,
      zIndex: newZIndex,
    };

    // Add new window and unfocus others
    set(windowsAtom, [
      ...windows.map((w) => ({ ...w, isFocused: false })),
      newWindow,
    ]);
  }
);

// Derived atom to close a window
export const closeWindowAtom = atom(
  null,
  (get, set, windowId: string) => {
    const windows = get(windowsAtom);
    set(windowsAtom, windows.filter((w) => w.id !== windowId));
  }
);

// Derived atom to minimize a window
export const minimizeWindowAtom = atom(
  null,
  (get, set, windowId: string) => {
    const windows = get(windowsAtom);
    set(windowsAtom, windows.map((w) =>
      w.id === windowId ? { ...w, isMinimized: true, isFocused: false } : w
    ));
  }
);

// Derived atom to focus a window
export const focusWindowAtom = atom(
  null,
  (get, set, windowId: string) => {
    const windows = get(windowsAtom);
    const maxZ = get(maxZIndexAtom);
    const newZIndex = maxZ + 1;
    set(maxZIndexAtom, newZIndex);

    set(windowsAtom, windows.map((w) =>
      w.id === windowId
        ? { ...w, isFocused: true, zIndex: newZIndex }
        : { ...w, isFocused: false }
    ));
  }
);

// Derived atom to update window position
export const updateWindowPositionAtom = atom(
  null,
  (get, set, { windowId, position }: { windowId: string; position: Position }) => {
    const windows = get(windowsAtom);
    set(windowsAtom, windows.map((w) =>
      w.id === windowId ? { ...w, position } : w
    ));
  }
);

// Derived atom to update window size
export const updateWindowSizeAtom = atom(
  null,
  (get, set, { windowId, size }: { windowId: string; size: Size }) => {
    const windows = get(windowsAtom);
    set(windowsAtom, windows.map((w) =>
      w.id === windowId ? { ...w, size } : w
    ));
  }
);

