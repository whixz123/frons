export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isMinimized: boolean;
  isFocused: boolean;
  position: Position;
  size: Size;
  minSize?: Size;
  zIndex: number;
}

export interface OpenWindowParams {
  id: string;
  appId: string;
  title: string;
  initialSize?: Size;
  initialPosition?: Position;
  minSize?: Size;
}

