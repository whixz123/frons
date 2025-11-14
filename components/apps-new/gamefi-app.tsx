import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NFTProfileCard } from "../gamefi/nft-profile-card";
import { AchievementGrid } from "../gamefi/achievement-grid";
import { StreakCalendar } from "../gamefi/streak-calendar";
import { DailyChallenges } from "../gamefi/daily-challenges";
import { Leaderboard } from "../gamefi/leaderboard";
import { RewardAnimation } from "../gamefi/reward-animation";
import { StakingModal } from "../gamefi/staking-modal";
import { XPTracker } from "../gamefi/xp-tracker";
import { NFTRankInfo } from "../gamefi/nft-rank-info";
import { OnboardingTour } from "../gamefi/onboarding-tour";
import { NFTSelectorModal } from "../gamefi/nft-selector-modal";
import { AchievementFramesShowcase } from "../gamefi/achievement-frames-showcase";
import { NFTFeatureHint } from "../nft-feature-hint";
import { Trophy, Target, Flame, Users, Zap, Star } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface UserNFT {
  id: string;
  name: string;
  image: string;
  collection: string;
}

export function GameFiApp() {
  const [showReward, setShowReward] = useState(false);
  const [showStaking, setShowStaking] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showNFTSelector, setShowNFTSelector] = useState(false);
  const [stakedAmount, setStakedAmount] = useState(500);
  const [multiplier, setMultiplier] = useState(1.5);
  const [userNFT, setUserNFT] = useState<UserNFT | undefined>(undefined);
  const [isWalletConnected] = useState(true); // Mock wallet connection

  // Show onboarding on first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("gamefi-onboarding-seen");
    if (!hasSeenOnboarding) {
      setTimeout(() => setShowOnboarding(true), 500);
    }
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem("gamefi-onboarding-seen", "true");
  };

  const handleSelectNFT = (nft: UserNFT) => {
    setUserNFT(nft);
    localStorage.setItem("selected-nft", JSON.stringify(nft));
  };

  // Load saved NFT on mount
  useEffect(() => {
    const savedNFT = localStorage.getItem("selected-nft");
    if (savedNFT) {
      try {
        setUserNFT(JSON.parse(savedNFT));
      } catch (e) {
        console.error("Failed to load saved NFT");
      }
    }
  }, []);

  const mockReward = {
    title: "Achievement Unlocked!",
    description: "You completed your first Pomodoro session",
    xp: 100,
    type: "achievement" as const,
  };

  const mockXPActivities = [
    {
      id: "1",
      type: "pomodoro" as const,
      description: "Completed a focus session",
      baseXP: 50,
      multiplier: 1.5,
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
      id: "2",
      type: "task" as const,
      description: "Completed: Review Solana integration",
      baseXP: 25,
      multiplier: 1.5,
      timestamp: Date.now() - 1000 * 60 * 15,
    },
    {
      id: "3",
      type: "note" as const,
      description: "Created: Meeting notes",
      baseXP: 10,
      multiplier: 1.5,
      timestamp: Date.now() - 1000 * 60 * 30,
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <ScrollArea className="h-full">
        <div className="p-6">
          {/* Profile Card */}
          <NFTProfileCard
            username="CoffeeWarrior"
            level={7}
            xp={2850}
            nextLevelXp={4000}
            rank={4}
            stakedAmount={stakedAmount}
            multiplier={multiplier}
            nftRank="epic"
            userNFT={userNFT}
            onStakeClick={() => setShowStaking(true)}
            onSelectNFT={() => setShowNFTSelector(true)}
          />

          {/* Tabs */}
          <Tabs defaultValue="xp" className="mt-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1 bg-white/50 backdrop-blur-sm p-1">
              <TabsTrigger value="xp" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>XP</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="nftranks" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>NFT</span>
              </TabsTrigger>
              <TabsTrigger value="streak" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Streak</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Ranks</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="xp" className="mt-6">
              <XPTracker
                recentActivities={mockXPActivities}
                totalXP={785}
                dailyGoal={1000}
              />
            </TabsContent>

            <TabsContent value="challenges" className="mt-6">
              <DailyChallenges />
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="mb-6">
                <h3 className="text-xl text-gray-800 mb-2">Achievements</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Unlock achievements to earn XP and level up
                </p>
              </div>
              <AchievementGrid />
            </TabsContent>

            <TabsContent value="streak" className="mt-6">
              <div className="bg-white rounded-xl p-6 border border-purple-200">
                <StreakCalendar />
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-300">
                <div className="flex items-start gap-3">
                  <Flame className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-gray-800 mb-1">Keep Your Streak Alive!</h4>
                    <p className="text-sm text-gray-600">
                      Complete at least one task every day to maintain your streak and earn bonus XP.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nftranks" className="mt-6">
              <NFTRankInfo />
              
              <Separator className="my-8" />
              
              <AchievementFramesShowcase currentRank="epic" />
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-6">
              <Leaderboard />
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200">
              <div className="mb-2">
                <h4 className="text-sm text-gray-800 mb-1">Tutorial</h4>
                <p className="text-xs text-gray-600">Review GameFi features</p>
              </div>
              <Button
                onClick={() => setShowOnboarding(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Restart Tour
              </Button>
            </div>
            
            <div className="p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-purple-200">
              <div className="mb-2">
                <h4 className="text-sm text-gray-800 mb-1">Test Rewards</h4>
                <p className="text-xs text-gray-600">Demo reward animation</p>
              </div>
              <Button
                onClick={() => setShowReward(true)}
                size="sm"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Show Reward
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Reward Animation */}
      <RewardAnimation
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        reward={mockReward}
      />

      {/* Staking Modal */}
      <StakingModal
        isOpen={showStaking}
        onClose={() => setShowStaking(false)}
        currentStake={stakedAmount}
        currentMultiplier={multiplier}
      />

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
      />

      {/* NFT Selector Modal */}
      <NFTSelectorModal
        isOpen={showNFTSelector}
        onClose={() => setShowNFTSelector(false)}
        onSelectNFT={handleSelectNFT}
        currentNFT={userNFT}
        isWalletConnected={isWalletConnected}
      />

      {/* NFT Feature Hint */}
      {!userNFT && <NFTFeatureHint />}
    </div>
  );
}
