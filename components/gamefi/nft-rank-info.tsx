import { Star, Sparkles, Crown, Gem } from "lucide-react";
import { motion } from "motion/react";

interface NFTRank {
  name: string;
  color: string;
  icon: React.ElementType;
  requirements: string;
  benefits: string[];
}

const nftRanks: NFTRank[] = [
  {
    name: "Common",
    color: "from-gray-400 to-gray-500",
    icon: Star,
    requirements: "Starting rank for all users",
    benefits: ["1.0x XP multiplier", "Access to basic challenges", "Standard rewards"],
  },
  {
    name: "Rare",
    color: "from-blue-500 to-cyan-500",
    icon: Gem,
    requirements: "Reach Level 10 & complete 50 tasks",
    benefits: ["1.3x XP multiplier", "Exclusive rare challenges", "Rare achievement badges"],
  },
  {
    name: "Epic",
    color: "from-purple-500 to-pink-500",
    icon: Sparkles,
    requirements: "Reach Level 20 & 30-day streak",
    benefits: ["1.8x XP multiplier", "Epic challenge access", "Custom themes", "Priority leaderboard"],
  },
  {
    name: "Legendary",
    color: "from-yellow-400 to-orange-500",
    icon: Crown,
    requirements: "Reach Level 30 & Top 100 ranking",
    benefits: [
      "2.5x XP multiplier",
      "All exclusive content",
      "Legendary badge",
      "Early feature access",
      "Special NFT rewards",
    ],
  },
];

export function NFTRankInfo() {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-xl text-gray-800 mb-2">NFT Rank System</h3>
        <p className="text-sm text-gray-600">
          Level up your productivity to unlock higher ranks and enhanced multipliers
        </p>
      </div>

      <div className="space-y-4">
        {nftRanks.map((rank, index) => (
          <motion.div
            key={rank.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Rank Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${rank.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <rank.icon className="w-7 h-7 text-white" />
              </div>

              {/* Rank Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-gray-800">{rank.name}</h4>
                  <div
                    className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${rank.color} text-white text-xs`}
                  >
                    Rank {index + 1}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  <span className="text-gray-500">Requirements:</span> {rank.requirements}
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-gray-500 mb-1">Benefits:</div>
                  {rank.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-purple-500 rounded-full" />
                      <span className="text-xs text-gray-600">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhancement Tip */}
      <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-300">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-gray-800 mb-1">Rank Enhancement</h4>
            <p className="text-sm text-gray-600">
              Your NFT rank evolves automatically based on your productivity achievements. Higher ranks
              unlock better multipliers and exclusive features!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
