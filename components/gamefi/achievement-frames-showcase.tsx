import { motion } from "motion/react";
import { NFTFrame } from "./nft-frame";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Trophy, Lock } from "lucide-react";

interface FrameShowcaseItem {
  rank: "common" | "rare" | "epic" | "legendary";
  title: string;
  description: string;
  requirement: string;
  isUnlocked: boolean;
}

interface AchievementFramesShowcaseProps {
  currentRank: "common" | "rare" | "epic" | "legendary";
}

const frames: FrameShowcaseItem[] = [
  {
    rank: "common",
    title: "Common Frame",
    description: "Basic profile frame for all users",
    requirement: "Starting rank",
    isUnlocked: true,
  },
  {
    rank: "rare",
    title: "Rare Frame",
    description: "Glowing blue frame with enhanced effects",
    requirement: "Reach Level 10 & complete 50 tasks",
    isUnlocked: false,
  },
  {
    rank: "epic",
    title: "Epic Frame",
    description: "Animated gradient frame with sparkle effects",
    requirement: "Reach Level 20 & maintain 30-day streak",
    isUnlocked: false,
  },
  {
    rank: "legendary",
    title: "Legendary Frame",
    description: "Golden animated frame with floating sparkles",
    requirement: "Reach Level 30 & Top 100 ranking",
    isUnlocked: false,
  },
];

export function AchievementFramesShowcase({ currentRank }: AchievementFramesShowcaseProps) {
  const rankOrder = ["common", "rare", "epic", "legendary"];
  const currentRankIndex = rankOrder.indexOf(currentRank);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl text-gray-800 mb-2">Achievement Frames</h3>
        <p className="text-sm text-gray-600">
          Earn unique profile frames by achieving productivity milestones. Your frame decorates your NFT across the platform!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frames.map((frame, index) => {
          const isUnlocked = rankOrder.indexOf(frame.rank) <= currentRankIndex;
          const isCurrent = frame.rank === currentRank;

          return (
            <motion.div
              key={frame.rank}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                isCurrent
                  ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-500 shadow-lg"
                  : isUnlocked
                  ? "bg-white border-gray-200 hover:border-purple-300"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              {/* Current Badge */}
              {isCurrent && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full shadow-lg">
                  Current
                </div>
              )}

              {/* Frame Preview */}
              <div className="flex items-center gap-6 mb-4">
                <div className={`${isUnlocked ? "" : "opacity-40 grayscale"}`}>
                  <NFTFrame rank={frame.rank} size="lg" showAnimation={isCurrent}>
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl">
                        C
                      </AvatarFallback>
                    </Avatar>
                  </NFTFrame>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-gray-800">{frame.title}</h4>
                    {isUnlocked ? (
                      <Trophy className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{frame.description}</p>
                </div>
              </div>

              {/* Requirements */}
              <div
                className={`p-3 rounded-xl border ${
                  isUnlocked
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isUnlocked ? (
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-0.5">
                      {isUnlocked ? "Unlocked" : "Requirement"}
                    </div>
                    <div className="text-sm text-gray-700">{frame.requirement}</div>
                  </div>
                </div>
              </div>

              {/* Progress Hint */}
              {!isUnlocked && index === currentRankIndex + 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 text-center"
                >
                  <div className="text-xs text-purple-600">
                    ⭐ Next achievement to unlock!
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-purple-200">
        <div className="flex gap-3">
          <Trophy className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="mb-2">How Achievement Frames Work:</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
              <li>Frames automatically decorate your selected NFT profile picture</li>
              <li>Higher rank frames have animated effects and special visual features</li>
              <li>Your frame is displayed on leaderboards, profile cards, and throughout the app</li>
              <li>Frames are permanent once unlocked and can be switched anytime</li>
              <li>Combine frames with your favorite NFTs to create unique profile identities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
