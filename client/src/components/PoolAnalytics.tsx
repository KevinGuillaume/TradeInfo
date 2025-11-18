// components/PoolAnalytics.tsx
import { useState, useEffect } from 'react';
import PoolOpportunitiesGrid from './PoolAnalyticsCard';
import { backendAPI } from '../api'; // adjust path



interface ProcessedPool {
    tokenOneName: string,
    tokenOneSymbol: string,
    tokenTwoName: string,
    tokenTwoSymbol: string
    apy7d: number;
    apy24h: number;
    feesPerMillion: number;
    volume7d: number,
    vTvlRatio: number;
    volumeGrowth7d: number;
    isStablePair: boolean;
    isHighLiquidity: boolean;
    opportunityScore: number;
    // Add your original pool data
    address: string;
    tokens: string;        // e.g. "WETH / USDT"
    feeTier: string;       // "0.01%"
    tvlUsd: number;
    volume24hUsd: number;
    fees24hUsd: number;
}

export default function PoolAnalytics() {
   const [pools, setPools] = useState<ProcessedPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        setLoading(true);
        const data = await backendAPI.getPoolAnalytics();

        

        setPools(data.pools);
      } catch (err) {
        setError('Failed to load pools');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-xl text-gray-400">Loading top pools...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Top Pool Opportunities
        </h2>
        <p className="text-gray-400 mt-2">Ranked by real yield, volume, and momentum</p>
      </div>

      {pools.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No pools found</p>
      ) : (
        <PoolOpportunitiesGrid pools={pools} />
      )}
    </div>
  );
}