import { motion } from "motion/react";
import { Sparkles, Star, Crown } from "lucide-react";

interface NFTFrameProps {
  children: React.ReactNode;
  rank: "common" | "rare" | "epic" | "legendary";
  size?: "sm" | "md" | "lg" | "xl";
  showAnimation?: boolean;
  showLabel?: boolean;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-20 h-20",
  xl: "w-24 h-24",
};

const frameStyles = {
  common: {
    borderColor: "border-gray-400",
    borderWidth: "border-2",
    glow: "",
    gradient: "",
    animation: false,
  },
  rare: {
    borderColor: "border-blue-500",
    borderWidth: "border-4",
    glow: "shadow-lg shadow-blue-500/50",
    gradient: "from-blue-400 to-cyan-400",
    animation: true,
  },
  epic: {
    borderColor: "border-purple-500",
    borderWidth: "border-4",
    glow: "shadow-xl shadow-purple-500/50",
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    animation: true,
  },
  legendary: {
    borderColor: "border-yellow-500",
    borderWidth: "border-4",
    glow: "shadow-2xl shadow-yellow-500/60",
    gradient: "from-yellow-400 via-amber-500 to-orange-500",
    animation: true,
  },
};

export function NFTFrame({ children, rank, size = "lg", showAnimation = true, showLabel = false }: NFTFrameProps) {
  const style = frameStyles[rank];
  const sizeClass = sizeClasses[size];

  return (
    <div className="relative inline-block">
      {/* Outer Glow Ring (Animated for higher ranks) */}
      {style.animation && showAnimation && (
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${style.gradient} blur-xl ${style.glow}`}
          style={{ transform: "translate(0, 0)" }}
        />
      )}

      {/* Main Avatar Container */}
      <div className={`relative ${sizeClass}`}>
        {/* Gradient Border Ring */}
        {rank !== "common" && (
          <motion.div
            animate={
              showAnimation && style.animation
                ? {
                    rotate: [0, 360],
                  }
                : {}
            }
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute -inset-1 rounded-full bg-gradient-to-br ${style.gradient} opacity-75`}
          />
        )}

        {/* Avatar Content */}
        <div
          className={`relative rounded-full overflow-hidden ${style.borderWidth} ${style.borderColor} bg-white ${style.glow}`}
        >
          {children}
        </div>

        {/* Rank Badge */}
        {rank !== "common" && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg border-2 border-white z-10`}
          >
            {rank === "rare" && <Star className="w-4 h-4 text-white" fill="white" />}
            {rank === "epic" && <Sparkles className="w-4 h-4 text-white" fill="white" />}
            {rank === "legendary" && <Crown className="w-4 h-4 text-white" fill="white" />}
          </motion.div>
        )}

        {/* Sparkle Effects for Legendary */}
        {rank === "legendary" && showAnimation && (
          <>
            <motion.div
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
              className="absolute -top-2 -right-2 text-yellow-400"
            >
              <Sparkles className="w-4 h-4" fill="currentColor" />
            </motion.div>
            <motion.div
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, -180],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
              className="absolute -bottom-2 -left-2 text-yellow-400"
            >
              <Sparkles className="w-4 h-4" fill="currentColor" />
            </motion.div>
          </>
        )}
      </div>

      {/* Rank Label (Optional) */}
      {showLabel && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${style.gradient} text-white shadow-lg`}>
            {rank.charAt(0).toUpperCase() + rank.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
}

// Card version with larger frame for profile displays
export function NFTFrameCard({ children, rank, showAnimation = true }: Omit<NFTFrameProps, "size">) {
  const style = frameStyles[rank];

  return (
    <div className="relative">
      {/* Background Glow */}
      {style.animation && showAnimation && (
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute -inset-4 rounded-2xl bg-gradient-to-br ${style.gradient} blur-2xl`}
        />
      )}

      {/* Card Container */}
      <div className="relative">
        {/* Animated Border */}
        {rank !== "common" && showAnimation && (
          <motion.div
            animate={{
              background: [
                `linear-gradient(0deg, var(--tw-gradient-stops))`,
                `linear-gradient(360deg, var(--tw-gradient-stops))`,
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${style.gradient} opacity-80`}
          />
        )}

        {/* Content */}
        <div
          className={`relative rounded-2xl overflow-hidden ${style.borderWidth} ${style.borderColor} bg-white ${style.glow}`}
        >
          {children}
        </div>

        {/* Corner Decorations for Legendary */}
        {rank === "legendary" && showAnimation && (
          <>
            {[0, 1, 2, 3].map((corner) => (
              <motion.div
                key={corner}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: corner * 0.5,
                }}
                className={`absolute w-3 h-3 bg-gradient-to-br ${style.gradient} rounded-full ${
                  corner === 0
                    ? "-top-1 -left-1"
                    : corner === 1
                    ? "-top-1 -right-1"
                    : corner === 2
                    ? "-bottom-1 -left-1"
                    : "-bottom-1 -right-1"
                }`}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
