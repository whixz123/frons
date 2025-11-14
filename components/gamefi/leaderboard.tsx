import { motion } from "motion/react";
import { Trophy, TrendingUp, TrendingDown, Minus, Zap, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { NFTFrame } from "./nft-frame";

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  avatarUrl?: string;
  trend: "up" | "down" | "same";
  isCurrentUser?: boolean;
  nftRank?: "legendary" | "epic" | "rare" | "common";
  multiplier?: number;
}

const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "ProductivityKing",
    level: 24,
    xp: 12500,
    trend: "same",
    nftRank: "legendary",
    multiplier: 2.5,
  },
  {
    rank: 2,
    username: "FocusedFlora",
    level: 22,
    xp: 11200,
    trend: "up",
    nftRank: "legendary",
    multiplier: 2.0,
  },
  {
    rank: 3,
    username: "TaskMaster3000",
    level: 21,
    xp: 10800,
    trend: "down",
    nftRank: "epic",
    multiplier: 1.8,
  },
  {
    rank: 4,
    username: "CoffeeWarrior",
    level: 20,
    xp: 9500,
    isCurrentUser: true,
    trend: "up",
    nftRank: "epic",
    multiplier: 1.5,
  },
  {
    rank: 5,
    username: "DeepWorkDan",
    level: 19,
    xp: 8900,
    trend: "up",
    nftRank: "rare",
    multiplier: 1.3,
  },
  {
    rank: 6,
    username: "PomodoroQueen",
    level: 18,
    xp: 8200,
    trend: "same",
    nftRank: "rare",
    multiplier: 1.3,
  },
  {
    rank: 7,
    username: "HustleHarry",
    level: 17,
    xp: 7600,
    trend: "down",
    nftRank: "common",
    multiplier: 1.1,
  },
  {
    rank: 8,
    username: "ZenMaster",
    level: 16,
    xp: 7100,
    trend: "up",
    nftRank: "common",
    multiplier: 1.0,
  },
];

const getRankColor = (rank: number) => {
  if (rank === 1) return "from-yellow-400 to-amber-500";
  if (rank === 2) return "from-gray-300 to-gray-400";
  if (rank === 3) return "from-orange-400 to-orange-600";
  return "from-purple-400 to-pink-500";
};

const getTrendIcon = (trend: string) => {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
};

const getNFTRankColor = (rank?: string) => {
  switch (rank) {
    case "legendary":
      return "from-yellow-400 to-orange-500";
    case "epic":
      return "from-purple-500 to-pink-500";
    case "rare":
      return "from-blue-500 to-cyan-500";
    default:
      return "from-gray-400 to-gray-500";
  }
};

const getNFTRankLabel = (rank?: string) => {
  return rank ? rank.charAt(0).toUpperCase() + rank.slice(1) : "Common";
};

export function Leaderboard() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl text-gray-800">Global Leaderboard</h3>
        </div>
        <Badge variant="outline" className="text-purple-600 border-purple-300">
          Top 100
        </Badge>
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        {leaderboardData.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
              entry.isCurrentUser
                ? "bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 shadow-md"
                : "bg-white border border-gray-200 hover:border-purple-300 hover:shadow-sm"
            }`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-12 text-center">
              {entry.rank <= 3 ? (
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRankColor(
                    entry.rank
                  )} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white">{entry.rank}</span>
                </div>
              ) : (
                <span className="text-gray-600">#{entry.rank}</span>
              )}
            </div>

            {/* Avatar with NFT Frame */}
            <div className="flex-shrink-0">
              <NFTFrame rank={entry.nftRank || "common"} size="md" showAnimation={false}>
                <Avatar className="w-full h-full">
                  <AvatarImage src={entry.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {entry.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </NFTFrame>
            </div>

            {/* Username and Level */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-gray-800 truncate">{entry.username}</span>
                {entry.isCurrentUser && (
                  <Badge className="bg-purple-500 text-white border-0 text-xs">
                    You
                  </Badge>
                )}
                {entry.nftRank && (
                  <Badge
                    className={`bg-gradient-to-r ${getNFTRankColor(
                      entry.nftRank
                    )} text-white border-0 text-xs`}
                  >
                    <Star className="w-3 h-3 mr-1" />
                    {getNFTRankLabel(entry.nftRank)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Level {entry.level}</span>
                {entry.multiplier && entry.multiplier > 1 && (
                  <span className="flex items-center gap-1 text-amber-600">
                    <Zap className="w-3 h-3" />
                    {entry.multiplier}x
                  </span>
                )}
              </div>
            </div>

            {/* XP */}
            <div className="text-right">
              <div className="text-gray-800">{entry.xp.toLocaleString()}</div>
              <div className="text-xs text-gray-500">XP</div>
            </div>

            {/* Trend */}
            <div className="flex-shrink-0 w-8">
              {getTrendIcon(entry.trend)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Updates every hour • Last updated 23 minutes ago
      </div>
    </div>
  );
}
