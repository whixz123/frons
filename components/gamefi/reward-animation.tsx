import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, X, Zap } from "lucide-react";
import { Button } from "../ui/button";

interface RewardAnimationProps {
  isOpen: boolean;
  onClose: () => void;
  reward: {
    title: string;
    description: string;
    xp: number;
    type: "achievement" | "level-up" | "challenge";
  };
}

export function RewardAnimation({ isOpen, onClose, reward }: RewardAnimationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate confetti particles
      const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setConfetti(particles);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
            onClick={onClose}
          />

          {/* Confetti */}
          <div className="fixed inset-0 z-[201] pointer-events-none overflow-hidden">
            {confetti.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ y: -20, x: `${particle.x}%`, opacity: 1, scale: 1 }}
                animate={{
                  y: "100vh",
                  rotate: Math.random() * 720 - 360,
                  opacity: 0,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: particle.delay,
                  ease: "easeIn",
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: [
                    "#9945FF",
                    "#14F195",
                    "#FFD700",
                    "#FF6B6B",
                    "#4ECDC4",
                  ][Math.floor(Math.random() * 5)],
                }}
              />
            ))}
          </div>

          {/* Reward Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[202] w-full max-w-md"
          >
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl border-2 border-purple-300 m-4">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  damping: 10,
                  stiffness: 200,
                  delay: 0.2,
                }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl text-center text-gray-800 mb-2"
              >
                {reward.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center text-gray-600 mb-6"
              >
                {reward.description}
              </motion.p>

              {/* XP Reward */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="flex items-center justify-center gap-2 mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200"
              >
                <Zap className="w-6 h-6 text-amber-500" />
                <span className="text-2xl text-amber-700">+{reward.xp} XP</span>
              </motion.div>

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg text-lg py-6"
                >
                  Awesome! 🎉
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
