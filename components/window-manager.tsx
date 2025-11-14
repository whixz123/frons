import { ReactNode, useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { X, Minimize2, Maximize2 } from "lucide-react";

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose: () => void;
  icon?: ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  zIndex: number;
  onFocus: () => void;
}

export function Window({
  id,
  title,
  children,
  onClose,
  icon,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 500 },
  zIndex,
  onFocus,
}: WindowProps) {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.window-header')) {
      setIsDragging(true);
      startPosRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
      onFocus();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - startPosRef.current.x,
          y: Math.max(0, e.clientY - startPosRef.current.y),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isMaximized]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <motion.div
      ref={dragRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isMaximized ? 0 : position.x,
        y: isMaximized ? 0 : position.y,
        width: isMaximized ? "100vw" : size.width,
        height: isMaximized ? "100vh" : size.height,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="fixed bg-amber-50/98 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-amber-200/30"
      style={{ zIndex }}
      onMouseDown={() => onFocus()}
    >
      {/* Window Header */}
      <div
        className="window-header flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-100/80 to-orange-100/80 border-b border-amber-300/40 cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          {icon && <div className="text-orange-700">{icon}</div>}
          <span className="text-amber-900 font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMaximize}
            className="p-1.5 hover:bg-amber-200/50 rounded-lg transition-colors"
          >
            {isMaximized ? (
              <Minimize2 className="w-4 h-4 text-amber-700" />
            ) : (
              <Maximize2 className="w-4 h-4 text-amber-700" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-[calc(100%-56px)] overflow-auto">
        {children}
      </div>
    </motion.div>
  );
}
