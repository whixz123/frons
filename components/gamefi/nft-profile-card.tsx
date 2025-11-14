import { motion } from "motion/react";
import { Trophy, Zap, TrendingUp, Coins, Image } from "lucide-react";
import { Progress } from "../ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { NFTFrame } from "./nft-frame";

interface UserNFT {
  id: string;
  name: string;
  image: string;
  collection: string;
}

interface NFTProfileCardProps {
  username: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  avatarUrl?: string;
  rank?: number;
  stakedAmount?: number;
  multiplier?: number;
  nftRank?: "common" | "rare" | "epic" | "legendary";
  userNFT?: UserNFT;
  onStakeClick?: () => void;
  onSelectNFT?: () => void;
}

export function NFTProfileCard({
  username,
  level,
  xp,
  nextLevelXp,
  avatarUrl,
  rank,
  stakedAmount = 0,
  multiplier = 1.0,
  nftRank = "epic",
  userNFT,
  onStakeClick,
  onSelectNFT,
}: NFTProfileCardProps) {
  const xpProgress = (xp / nextLevelXp) * 100;
  const multiplierBonus = Math.floor((multiplier - 1) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 rounded-2xl border border-purple-500/20 backdrop-blur-sm overflow-hidden"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 animate-pulse" />
      
      <div className="relative flex items-start gap-4">
        {/* NFT Avatar with Achievement Frame */}
        <div className="relative group">
          <NFTFrame rank={nftRank} size="xl" showAnimation={true}>
            <Avatar className="w-full h-full">
              <AvatarImage src={userNFT?.image || avatarUrl} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl">
                {username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </NFTFrame>
          
          {/* Change NFT Button */}
          <button
            onClick={onSelectNFT}
            className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <div className="text-center">
              <Image className="w-6 h-6 text-white mx-auto mb-1" aria-label="Change NFT icon" />
              <span className="text-white text-xs">Change NFT</span>
            </div>
          </button>
          
          {/* Level Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-20"
          >
            <span className="text-white text-sm">{level}</span>
          </motion.div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-xl text-gray-800">{username}</h3>
            {rank && rank <= 10 && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                <Trophy className="w-3 h-3 mr-1" />
                Top {rank}
              </Badge>
            )}
            {userNFT && (
              <Badge variant="outline" className="text-xs">
                {userNFT.name}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-purple-500" />
              <span>Level {level}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>{xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Level {level}</span>
              <span className="text-purple-600">{xp} / {nextLevelXp} XP</span>
              <span>Level {level + 1}</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Staking Section */}
      <div className="relative mt-4 pt-4 border-t border-purple-200/50">
        <div className="grid grid-cols-2 gap-3">
          {/* Staked Amount */}
          <div className="p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Coins className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-600">Staked fronSOL</div>
                <div className="text-gray-800">{stakedAmount.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Multiplier */}
          <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-300">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-600">XP Multiplier</div>
                <div className="text-gray-800">{multiplier.toFixed(1)}x</div>
              </div>
            </div>
          </div>
        </div>

        {/* Staking CTA */}
        {stakedAmount === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-300"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="text-sm text-gray-800 mb-0.5">Boost Your Productivity!</div>
                <div className="text-xs text-gray-600">
                  Stake fronSOL to earn up to 2.5x XP multiplier
                </div>
              </div>
              <Button
                size="sm"
                onClick={onStakeClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              >
                Stake Now
              </Button>
            </div>
          </motion.div>
        )}

        {/* Multiplier Info */}
        {stakedAmount > 0 && (
          <div className="mt-3 text-xs text-center text-gray-600">
            <span className="text-green-600">+{multiplierBonus}% XP</span> from {stakedAmount.toLocaleString()} fronSOL staked
          </div>
        )}
      </div>

      {/* NFT Info */}
      {userNFT && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mt-4 pt-4 border-t border-purple-200/50"
        >
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-purple-500" aria-label="Profile NFT icon" />
              <span>Profile NFT</span>
            </div>
            <button
              onClick={onSelectNFT}
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              Change
            </button>
          </div>
          <div className="mt-2 text-xs">
            <div className="text-gray-800">{userNFT.name}</div>
            <div className="text-gray-500">{userNFT.collection}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
