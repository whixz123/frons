import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Image, Search, Check, Wallet, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";

interface NFT {
  id: string;
  name: string;
  image: string;
  collection: string;
  rarity?: string;
}

interface NFTSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNFT: (nft: NFT) => void;
  currentNFT?: NFT;
  isWalletConnected: boolean;
}

// Mock NFTs - In production, these would be fetched from Solana blockchain
const mockUserNFTs: NFT[] = [
  {
    id: "1",
    name: "Solana Monkey #4234",
    image: "https://images.unsplash.com/photo-1640622842223-e1e39f4bf627?w=400&h=400&fit=crop",
    collection: "Solana Monkey Business",
    rarity: "Rare",
  },
  {
    id: "2",
    name: "Okay Bear #2156",
    image: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=400&h=400&fit=crop",
    collection: "Okay Bears",
    rarity: "Epic",
  },
  {
    id: "3",
    name: "DeGod #8923",
    image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop",
    collection: "DeGods",
    rarity: "Legendary",
  },
  {
    id: "4",
    name: "Mad Lads #5671",
    image: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=400&h=400&fit=crop",
    collection: "Mad Lads",
    rarity: "Common",
  },
  {
    id: "5",
    name: "Claynosaurz #3421",
    image: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=400&h=400&fit=crop",
    collection: "Claynosaurz",
    rarity: "Rare",
  },
  {
    id: "6",
    name: "Tensor #7892",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=400&fit=crop",
    collection: "Tensorians",
    rarity: "Epic",
  },
];

const rarityColors = {
  Common: "bg-gray-500",
  Rare: "bg-blue-500",
  Epic: "bg-purple-500",
  Legendary: "bg-yellow-500",
};

export function NFTSelectorModal({
  isOpen,
  onClose,
  onSelectNFT,
  currentNFT,
  isWalletConnected,
}: NFTSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNFT, setSelectedNFT] = useState<NFT | undefined>(currentNFT);
  const [isLoading, setIsLoading] = useState(false);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    if (isOpen && isWalletConnected) {
      // Simulate fetching NFTs from wallet
      setIsLoading(true);
      setTimeout(() => {
        setUserNFTs(mockUserNFTs);
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen, isWalletConnected]);

  const filteredNFTs = userNFTs.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedNFT) {
      onSelectNFT(selectedNFT);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            Select Your NFT Profile
          </DialogTitle>
          <DialogDescription>
            Choose an NFT from your wallet to use as your profile picture. Your achievement frames will showcase your productivity rank!
          </DialogDescription>
        </DialogHeader>

        {!isWalletConnected ? (
          // Wallet Not Connected State
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Wallet className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl text-gray-800 mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600 mb-6">
              Connect your Solana wallet to view and select your NFTs
            </p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>
        ) : isLoading ? (
          // Loading State
          <div className="py-12 text-center">
            <div className="w-12 h-12 mx-auto mb-4 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Loading your NFTs...</p>
          </div>
        ) : userNFTs.length === 0 ? (
          // No NFTs State
          <div className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-xl text-gray-800 mb-2">No NFTs Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any NFTs in your wallet. Try a different wallet or acquire some NFTs!
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          // NFT Grid
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search NFTs by name or collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* NFT Count */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? "s" : ""} found
              </span>
              {selectedNFT && (
                <Badge className="bg-purple-500 text-white">
                  {selectedNFT.name} selected
                </Badge>
              )}
            </div>

            {/* NFT Grid */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-3 gap-4">
                {filteredNFTs.map((nft, index) => {
                  const isSelected = selectedNFT?.id === nft.id;
                  return (
                    <motion.button
                      key={nft.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedNFT(nft)}
                      className={`relative group rounded-xl overflow-hidden transition-all ${
                        isSelected
                          ? "ring-4 ring-purple-500 shadow-xl scale-105"
                          : "ring-2 ring-gray-200 hover:ring-purple-300 hover:shadow-lg"
                      }`}
                    >
                      {/* NFT Image */}
                      <div className="aspect-square relative overflow-hidden bg-gray-100">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Selected Check */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}

                        {/* Rarity Badge */}
                        {nft.rarity && (
                          <div className={`absolute top-2 left-2 px-2 py-1 ${rarityColors[nft.rarity as keyof typeof rarityColors]} text-white text-xs rounded-full`}>
                            {nft.rarity}
                          </div>
                        )}
                      </div>

                      {/* NFT Info */}
                      <div className="p-3 bg-white">
                        <div className="text-sm text-gray-800 truncate mb-1">
                          {nft.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {nft.collection}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="mb-1">Your selected NFT will be displayed with an achievement frame based on your productivity rank:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-600 ml-2">
                    <li>Common rank: Simple border frame</li>
                    <li>Rare rank: Glowing blue frame</li>
                    <li>Epic rank: Animated purple/pink gradient frame</li>
                    <li>Legendary rank: Golden animated frame with sparkles</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSelect}
                disabled={!selectedNFT}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {selectedNFT ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Use {selectedNFT.name}
                  </>
                ) : (
                  "Select an NFT"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
