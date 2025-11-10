import { useState } from "react";
import { motion } from "motion/react";
import { Image, Check, Sparkles } from "lucide-react";
import { NFTFrame } from "./nft-frame";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  rarity?: string;
}

interface NFTCollectionGalleryProps {
  nfts: NFT[];
  selectedNFT?: NFT;
  currentFrame: "common" | "rare" | "epic" | "legendary";
  onSelectNFT: (nft: NFT) => void;
}

const mockPreviewFrames: Array<"common" | "rare" | "epic" | "legendary"> = [
  "common",
  "rare",
  "epic",
  "legendary",
];

export function NFTCollectionGallery({
  nfts,
  selectedNFT,
  currentFrame,
  onSelectNFT,
}: NFTCollectionGalleryProps) {
  const [previewFrame, setPreviewFrame] =
    useState<"common" | "rare" | "epic" | "legendary">(currentFrame);
  const [hoveredNFT, setHoveredNFT] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl text-gray-800 mb-2">Your NFT Collection</h3>
        <p className="text-sm text-gray-600">
          Preview how your NFTs look with different achievement frames
        </p>
      </div>

      {/* Frame Preview Selector */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700">Preview Frame:</span>
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            Current: {currentFrame.charAt(0).toUpperCase() + currentFrame.slice(1)}
          </Badge>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {mockPreviewFrames.map((frame) => (
            <button
              key={frame}
              onClick={() => setPreviewFrame(frame)}
              className={`p-3 rounded-lg border-2 transition-all ${
                previewFrame === frame
                  ? "border-purple-500 bg-white shadow-md"
                  : "border-gray-200 bg-white/50 hover:border-purple-300"
              }`}
            >
              <div className="text-xs text-center mb-2 text-gray-700">
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </div>
              <div className="mx-auto" style={{ width: "40px" }}>
                <NFTFrame rank={frame} size="sm" showAnimation={false}>
                  <Avatar className="w-full h-full">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                      C
                    </AvatarFallback>
                  </Avatar>
                </NFTFrame>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* NFT Grid */}
      {nfts.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Image className="w-8 h-8 text-gray-400" aria-label="No NFTs icon" />
          </div>
          <p className="text-gray-600">No NFTs found in your wallet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {nfts.map((nft, index) => {
            const isSelected = selectedNFT?.id === nft.id;
            const isHovered = hoveredNFT === nft.id;

            return (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onMouseEnter={() => setHoveredNFT(nft.id)}
                onMouseLeave={() => setHoveredNFT(null)}
                className="relative"
              >
                <button
                  onClick={() => onSelectNFT(nft)}
                  className={`w-full text-left transition-transform ${
                    isHovered ? "scale-105" : ""
                  }`}
                >
                  {/* NFT with Frame */}
                  <div className="mb-3 flex justify-center">
                    <div className="relative">
                      <NFTFrame
                        rank={previewFrame}
                        size="lg"
                        showAnimation={isSelected}
                      >
                        <Avatar className="w-full h-full">
                          <AvatarImage src={nft.image} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {nft.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </NFTFrame>

                      {/* Selected Indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg z-30"
                        >
                          <Check className="w-5 h-5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* NFT Info Card */}
                  <div
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-500 shadow-lg"
                        : "bg-white border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <div className="mb-2">
                      <div className="text-sm text-gray-800 truncate mb-1">
                        {nft.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {nft.collection}
                      </div>
                    </div>

                    {nft.rarity && (
                      <Badge
                        variant="outline"
                        className="text-xs w-full justify-center"
                      >
                        {nft.rarity}
                      </Badge>
                    )}

                    {isSelected && (
                      <div className="mt-2 text-xs text-center text-green-600 flex items-center justify-center gap-1">
                        <Check className="w-3 h-3" />
                        Active Profile
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="mb-2">NFT Profile Tips:</p>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600">
              <li>Click any NFT to set it as your profile picture</li>
              <li>Use the frame selector to preview different achievement frames</li>
              <li>Your active frame is based on your current productivity rank</li>
              <li>Unlock higher rank frames by achieving milestones</li>
              <li>Mix and match your favorite NFTs with earned frames!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
