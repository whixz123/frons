import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { Coins, Zap, TrendingUp, Info } from "lucide-react";
import { motion } from "motion/react";

interface StakingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStake: number;
  currentMultiplier: number;
}

export function StakingModal({ isOpen, onClose, currentStake, currentMultiplier }: StakingModalProps) {
  const [stakeAmount, setStakeAmount] = useState(0);
  const [isStaking, setIsStaking] = useState(false);

  // Calculate multiplier based on stake amount
  const calculateMultiplier = (amount: number) => {
    if (amount === 0) return 1.0;
    if (amount < 100) return 1.1;
    if (amount < 500) return 1.3;
    if (amount < 1000) return 1.5;
    if (amount < 5000) return 2.0;
    return 2.5;
  };

  const newMultiplier = calculateMultiplier(stakeAmount);
  const totalStake = currentStake + stakeAmount;
  const finalMultiplier = calculateMultiplier(totalStake);

  const handleStake = async () => {
    setIsStaking(true);
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsStaking(false);
    onClose();
  };

  const stakeTiers = [
    { amount: 100, multiplier: 1.1, color: "from-blue-400 to-cyan-500" },
    { amount: 500, multiplier: 1.3, color: "from-purple-400 to-pink-500" },
    { amount: 1000, multiplier: 1.5, color: "from-orange-400 to-red-500" },
    { amount: 5000, multiplier: 2.0, color: "from-green-400 to-emerald-500" },
    { amount: 10000, multiplier: 2.5, color: "from-amber-400 to-yellow-500" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            Stake fronSOL
          </DialogTitle>
          <DialogDescription>
            Boost your productivity XP by staking fronSOL tokens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Current Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Currently Staked</div>
              <div className="text-2xl text-gray-800">{currentStake.toLocaleString()}</div>
              <div className="text-xs text-gray-500">fronSOL</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-300">
              <div className="text-sm text-gray-600 mb-1">Current Multiplier</div>
              <div className="text-2xl text-gray-800">{currentMultiplier.toFixed(1)}x</div>
              <div className="text-xs text-gray-500">XP Boost</div>
            </div>
          </div>

          {/* Stake Input */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Stake Amount</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={stakeAmount || ""}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                placeholder="Enter amount..."
                className="flex-1"
                min={0}
              />
              <Button
                variant="outline"
                onClick={() => setStakeAmount(1000)}
                className="px-4"
              >
                Max
              </Button>
            </div>
            <div className="mt-3">
              <Slider
                value={[stakeAmount]}
                onValueChange={(value) => setStakeAmount(value[0])}
                max={10000}
                step={100}
                className="w-full"
              />
            </div>
          </div>

          {/* Staking Tiers */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm text-gray-700">Staking Tiers</h4>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {stakeTiers.map((tier) => (
                <button
                  key={tier.amount}
                  onClick={() => setStakeAmount(tier.amount)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    stakeAmount >= tier.amount
                      ? "border-purple-500 shadow-md"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs text-gray-600 mb-1">{tier.amount.toLocaleString()}</div>
                  <div className="text-xs text-purple-600">{tier.multiplier}x</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {stakeAmount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border border-purple-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">After Staking</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Total Staked</div>
                  <div className="text-xl text-gray-800">{totalStake.toLocaleString()} fronSOL</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">New Multiplier</div>
                  <div className="text-xl text-purple-600">{finalMultiplier.toFixed(1)}x</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-600">
                Your productivity activities will earn <span className="text-green-600 font-medium">+{Math.floor((finalMultiplier - 1) * 100)}% XP</span>
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="mb-2">Staking Benefits:</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
                  <li>Earn bonus XP on all productivity activities</li>
                  <li>Unlock exclusive achievements and rewards</li>
                  <li>Climb the leaderboard faster</li>
                  <li>Unstake anytime with no penalties</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStake}
              disabled={stakeAmount === 0 || isStaking}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isStaking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Staking...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4 mr-2" />
                  Stake {stakeAmount > 0 ? stakeAmount.toLocaleString() : ""} fronSOL
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
