"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import Image from "next/image";

type NFTMetadata = {
  mint: string;
  name: string;
  image: string;
  collection?: string;
};

export function NFTProfile() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNFTSelector, setShowNFTSelector] = useState(false);

  // Load selected NFT from localStorage
  useEffect(() => {
    if (wallet.publicKey) {
      const saved = localStorage.getItem(`nft-profile-${wallet.publicKey.toBase58()}`);
      if (saved) {
        try {
          setSelectedNFT(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load saved NFT", e);
        }
      }
    }
  }, [wallet.publicKey]);

  const fetchNFTs = useCallback(async () => {
    if (!wallet.publicKey) return;
    
    setLoading(true);
    try {
      // Fetch token accounts owned by the wallet
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        wallet.publicKey,
        { programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") }
      );

      const nftList: NFTMetadata[] = [];

      for (const { account } of tokenAccounts.value) {
        const parsedInfo = account.data.parsed.info;
        const tokenAmount = parsedInfo.tokenAmount;

        // Check if it's an NFT (amount = 1, decimals = 0)
        if (tokenAmount.decimals === 0 && tokenAmount.uiAmount === 1) {
          const mintAddress = parsedInfo.mint;
          
          try {
            // Fetch metadata account
            const metadataPDA = PublicKey.findProgramAddressSync(
              [
                Buffer.from("metadata"),
                new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
                new PublicKey(mintAddress).toBuffer(),
              ],
              new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
            )[0];

            const metadataAccount = await connection.getAccountInfo(metadataPDA);
            
            if (metadataAccount) {
              // Parse metadata (simplified - in production use @metaplex-foundation/mpl-token-metadata)
              const metadata = parseMetadata(metadataAccount.data);
              
              if (metadata.uri) {
                // Fetch off-chain metadata
                const response = await fetch(metadata.uri);
                const json = await response.json();
                
                nftList.push({
                  mint: mintAddress,
                  name: json.name || metadata.name || "Unknown NFT",
                  image: json.image || "",
                  collection: json.collection?.name
                });
              }
            }
          } catch (error) {
            console.error(`Failed to fetch metadata for ${mintAddress}`, error);
          }
        }
      }

      setNfts(nftList);
    } catch (error) {
      console.error("Failed to fetch NFTs", error);
    } finally {
      setLoading(false);
    }
  }, [connection, wallet.publicKey]);

  const handleSelectNFT = useCallback((nft: NFTMetadata) => {
    setSelectedNFT(nft);
    if (wallet.publicKey) {
      localStorage.setItem(`nft-profile-${wallet.publicKey.toBase58()}`, JSON.stringify(nft));
    }
    setShowNFTSelector(false);
  }, [wallet.publicKey]);

  const handleRemoveNFT = useCallback(() => {
    setSelectedNFT(null);
    if (wallet.publicKey) {
      localStorage.removeItem(`nft-profile-${wallet.publicKey.toBase58()}`);
    }
  }, [wallet.publicKey]);

  return (
    <div className="border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-purple-300 flex items-center gap-2">
          🖼️ NFT Profile
        </h3>
        {wallet.publicKey && (
          <button
            onClick={() => {
              setShowNFTSelector(!showNFTSelector);
              if (!showNFTSelector && nfts.length === 0) {
                fetchNFTs();
              }
            }}
            className="text-sm px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition"
          >
            {showNFTSelector ? "Close" : "Change NFT"}
          </button>
        )}
      </div>

      {!wallet.publicKey ? (
        <div className="text-center py-8 text-slate-400">
          <div className="text-4xl mb-2">🔒</div>
          <p className="text-sm">Connect wallet to set NFT profile</p>
        </div>
      ) : selectedNFT ? (
        <div className="space-y-4">
          <div className="relative group">
            <Image
              src={selectedNFT.image}
              alt={selectedNFT.name}
              width={400}
              height={400}
              className="w-full aspect-square object-cover rounded-xl border-2 border-purple-500/50"
            />
            <button
              onClick={handleRemoveNFT}
              className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
          <div>
            <div className="font-semibold text-purple-200">{selectedNFT.name}</div>
            {selectedNFT.collection && (
              <div className="text-xs text-slate-400">from {selectedNFT.collection}</div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-slate-400">
          <div className="text-4xl mb-2">👤</div>
          <p className="text-sm">No NFT profile set</p>
          <button
            onClick={() => {
              setShowNFTSelector(true);
              fetchNFTs();
            }}
            className="mt-3 px-4 py-2 rounded-lg bg-purple-500 text-white text-sm hover:bg-purple-400 transition"
          >
            Select NFT
          </button>
        </div>
      )}

      {/* NFT Selector Modal */}
      {showNFTSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-300">Select Your NFT</h3>
              <button
                onClick={() => setShowNFTSelector(false)}
                className="text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-4xl mb-4">⚙️</div>
                <p className="text-slate-400">Loading your NFTs...</p>
              </div>
            ) : nfts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-slate-400 mb-4">No NFTs found in your wallet</p>
                <button
                  onClick={fetchNFTs}
                  className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-400 transition"
                >
                  Refresh
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {nfts.map((nft) => (
                  <button
                    key={nft.mint}
                    onClick={() => handleSelectNFT(nft)}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-purple-500/30 hover:border-purple-500 transition"
                  >
                    <Image
                      src={nft.image}
                      alt={nft.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white truncate">{nft.name}</div>
                        {nft.collection && (
                          <div className="text-xs text-slate-300 truncate">{nft.collection}</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Simplified metadata parser (for demonstration)
function parseMetadata(data: Buffer): { name: string; uri: string } {
  try {
    // Skip discriminator (1 byte) and key (1 byte)
    let offset = 1 + 1;
    
    // Skip update authority (32 bytes)
    offset += 32;
    
    // Skip mint (32 bytes)
    offset += 32;
    
    // Read name (4 bytes length + string)
    const nameLength = data.readUInt32LE(offset);
    offset += 4;
    const name = data.slice(offset, offset + nameLength).toString('utf8').replace(/\0/g, '');
    offset += nameLength;
    
    // Read symbol (4 bytes length + string)
    const symbolLength = data.readUInt32LE(offset);
    offset += 4 + symbolLength;
    
    // Read uri (4 bytes length + string)
    const uriLength = data.readUInt32LE(offset);
    offset += 4;
    const uri = data.slice(offset, offset + uriLength).toString('utf8').replace(/\0/g, '');
    
    return { name, uri };
  } catch (error) {
    console.error("Failed to parse metadata", error);
    return { name: "Unknown", uri: "" };
  }
}

