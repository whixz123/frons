"use client";

import { Info } from "lucide-react";

export function NFTFeatureHint() {
  return (
    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-blue-300 mb-1">NFT Profile Feature</h4>
        <p className="text-sm text-slate-300">
          Connect your wallet to set any Solana NFT you own as your profile picture. 
          Your NFT will be displayed across the platform and on leaderboards.
        </p>
      </div>
    </div>
  );
}
