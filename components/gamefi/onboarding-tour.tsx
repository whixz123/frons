import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, Trophy, Zap, Target, Coins, Star } from "lucide-react";
import { Button } from "../ui/button";

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const tourSteps = [
  {
    icon: Zap,
    title: "Earn XP & Level Up",
    description: "Complete tasks, finish Pomodoro sessions, and stay productive to earn experience points and level up your profile.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Coins,
    title: "Stake fronSOL for Multipliers",
    description: "Stake fronSOL tokens to boost your XP earnings up to 2.5x! Higher stakes mean faster progression and better rewards.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Star,
    title: "Unlock NFT Ranks",
    description: "Progress through NFT ranks from Common to Legendary. Each rank provides permanent multiplier boosts and exclusive perks!",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Target,
    title: "Daily Challenges & Streaks",
    description: "Complete daily challenges to earn bonus XP and maintain your productivity streak. Consistency is key to success!",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Trophy,
    title: "Compete on Leaderboards",
    description: "Climb the global rankings and showcase your productivity. Top performers earn legendary status and exclusive NFT rewards!",
    color: "from-orange-500 to-red-500",
  },
];

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = tourSteps[currentStep];
  const Icon = step.icon;

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
            onClick={handleSkip}
          />

          {/* Tour Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[202] w-full max-w-lg"
          >
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl m-4">
              {/* Close Button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentStep
                        ? "w-8 bg-gradient-to-r " + step.color
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Animated Icon */}
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-2xl`}
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl text-gray-800 mb-3">{step.title}</h2>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-4">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1"
                >
                  Skip Tour
                </Button>
                <Button
                  onClick={handleNext}
                  className={`flex-1 bg-gradient-to-r ${step.color} hover:opacity-90 text-white shadow-lg`}
                >
                  {currentStep < tourSteps.length - 1 ? (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    "Get Started! 🚀"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
