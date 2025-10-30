'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, ExternalLink, Crown, Zap, Eye } from 'lucide-react';
import { formatCurrency } from '../lib/analysis';

interface NFT {
  id: string;
  name: string;
  description: string;
  image_url: string;
  collection_name: string;
  token_id: string;
  contract_address: string;
  floor_price_usd: number;
  last_sale_price_usd: number;
  rarity_rank: number | null;
  traits: Array<{
    trait_type: string;
    value: string;
    rarity_percentage?: number;
  }>;
  chain_id: string;
}

interface NFTCollectionProps {
  walletAddress: string;
  limit?: number;
}

export function NFTCollection({ walletAddress, limit = 12 }: NFTCollectionProps) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Avoid 404 when address is empty during first render
    if (!walletAddress || walletAddress.length !== 42) {
      setIsLoading(false);
      return;
    }
    fetchNFTs();
  }, [walletAddress]);

  const fetchNFTs = async () => {
    if (!walletAddress || walletAddress.length !== 42) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/nfts/${walletAddress}?limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs');
      }
      const data = await response.json();
      setNfts(data.nfts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rank: number | null) => {
    if (!rank) return 'text-text-secondary';
    if (rank <= 10) return 'text-yellow-400';
    if (rank <= 50) return 'text-purple-400';
    if (rank <= 100) return 'text-blue-400';
    return 'text-text-secondary';
  };

  const getRarityIcon = (rank: number | null) => {
    if (!rank) return null;
    if (rank <= 10) return <Crown className="w-3 h-3" />;
    if (rank <= 50) return <Zap className="w-3 h-3" />;
    return <Eye className="w-3 h-3" />;
  };

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">NFT Collection</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-background/50 rounded-lg p-4 animate-pulse">
              <div className="aspect-square bg-background/30 rounded-lg mb-3"></div>
              <div className="h-4 bg-background/30 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-background/30 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">NFT Collection</h3>
        <div className="text-center py-8">
          <div className="text-danger mb-2">Failed to load NFTs</div>
          <button
            onClick={fetchNFTs}
            className="text-accent hover:text-accent/80 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">NFT Collection</h3>
        <div className="text-center py-8">
          <div className="text-text-secondary mb-2">No NFTs found</div>
          <div className="text-text-secondary text-sm">This wallet doesn't own any NFTs</div>
        </div>
      </div>
    );
  }

  const displayedNfts = showAll ? nfts : nfts.slice(0, 8);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">NFT Collection</h3>
        <span className="text-text-secondary text-sm">{nfts.length} NFTs</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedNfts.map((nft, index) => (
          <motion.div
            key={nft.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-background/50 border border-border rounded-lg p-3 hover:border-accent/50 transition-all duration-200 group"
          >
            {/* NFT Image */}
            <div className="aspect-square bg-background/30 rounded-lg mb-3 overflow-hidden relative">
              {nft.image_url ? (
                <img
                  src={nft.image_url}
                  alt={nft.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-8 h-8 text-text-secondary" />
                </div>
              )}
              
              {/* Rarity Badge */}
              {nft.rarity_rank && (
                <div className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-background/80 ${getRarityColor(nft.rarity_rank)}`}>
                  {getRarityIcon(nft.rarity_rank)}
                  #{nft.rarity_rank}
                </div>
              )}
            </div>

            {/* NFT Info */}
            <div className="space-y-2">
              <div>
                <h4 className="text-text-primary font-medium text-sm truncate" title={nft.name}>
                  {nft.name}
                </h4>
                <p className="text-text-secondary text-xs truncate" title={nft.collection_name}>
                  {nft.collection_name}
                </p>
              </div>

              {/* Price Info */}
              <div className="flex items-center justify-between text-xs">
                {nft.floor_price_usd > 0 && (
                  <div>
                    <span className="text-text-secondary">Floor: </span>
                    <span className="text-text-primary font-medium">
                      {formatCurrency(nft.floor_price_usd)}
                    </span>
                  </div>
                )}
                {nft.last_sale_price_usd > 0 && (
                  <div>
                    <span className="text-text-secondary">Last: </span>
                    <span className="text-text-primary font-medium">
                      {formatCurrency(nft.last_sale_price_usd)}
                    </span>
                  </div>
                )}
              </div>

              {/* Traits */}
              {nft.traits.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {nft.traits.slice(0, 2).map((trait, i) => (
                    <span
                      key={i}
                      className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full"
                      title={`${trait.trait_type}: ${trait.value}`}
                    >
                      {trait.trait_type}
                    </span>
                  ))}
                  {nft.traits.length > 2 && (
                    <span className="text-xs text-text-secondary">
                      +{nft.traits.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* View More Button */}
      {nfts.length > 8 && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-accent/10 text-accent hover:bg-accent/20 px-6 py-2 rounded-lg font-medium transition-all duration-200"
          >
            {showAll ? 'Show Less' : `View All ${nfts.length} NFTs`}
          </button>
        </div>
      )}
    </div>
  );
}
