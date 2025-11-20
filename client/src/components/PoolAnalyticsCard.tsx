import { TrendingUp, Sparkles, TrendingDown, ExternalLink } from 'lucide-react';

interface PoolStats {
  tokenOneName: string,
  tokenOneSymbol: string,
  tokenTwoName: string,
  tokenTwoSymbol: string,
  volume7d:number,
  apy7d: number;
  apy24h: number;
  feesPerMillion: number;
  vTvlRatio: number;
  volumeGrowth7d: number;
  isStablePair: boolean;
  isHighLiquidity: boolean;
  opportunityScore: number;
  address: string;
  tokens: string;        
  feeTier: string; 
  tvlUsd: number;
  volume24hUsd: number;
  fees24hUsd: number;
}

interface PoolOpportunitiesGridProps {
  pools: PoolStats[];
}

export default function PoolOpportunitiesGrid({ pools }: PoolOpportunitiesGridProps) {
  const sortedPools = [...pools].sort((a, b) => b.opportunityScore - a.opportunityScore);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-gray-600 to-gray-500';
  };

  const getVerdict = (pool: PoolStats) => {
    if (pool.opportunityScore >= 80) return { text: "Top Tier", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50" };
    if (pool.opportunityScore >= 60) return { text: "Strong", color: "bg-blue-500/20 text-blue-300 border-blue-500/50" };
    if (pool.opportunityScore >= 40) return { text: "Decent", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" };
    return { text: "Low Yield", color: "bg-gray-700/50 text-gray-400" };
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedPools.map((pool) => {
        const verdict = getVerdict(pool);
        const isHot = pool.volumeGrowth7d > 50 || pool.apy7d > 15;

          

        return (
          <div
            key={pool.address}
            className="relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gray-800/60 border-gray-700"
          >

            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold text-white">
                        {pool.tokenOneSymbol} / {pool.tokenTwoSymbol}
                    </h3>
                    {isHot && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        Hot
                        </span>
                    )}
                    </div>
                    <p className="text-sm text-gray-400">{(Number(pool.feeTier) / 10000).toFixed(2)}% fee</p>
                </div>

                <div className="text-right">
                    <p className="text-3xl font-black text-green-400">
                    {pool.apy7d.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">Real 7d APY</p>
                </div>
              </div>

              {/* Score Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Opportunity Score</span>
                  <span className="font-bold text-white">{pool.opportunityScore}/100</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreColor(pool.opportunityScore)} transition-all duration-1000`}
                    style={{ width: `${pool.opportunityScore}%` }}
                  />
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div className="bg-gray-700/40 rounded-lg p-2.5">
                  <p className="text-gray-400 text-xs">7d Volume</p>
                  <p className="font-bold text-white">
                    ${pool.volume7d > 1e9 ? (pool.volume7d / 1e9).toFixed(2) + 'B' : (pool.volume7d / 1e6).toFixed(0) + 'M'}
                  </p>
                </div>
                <div className="bg-gray-700/40 rounded-lg p-2.5">
                  <p className="text-gray-400 text-xs">Fees / $1M</p>
                  <p className="font-bold text-green-400">${pool.feesPerMillion.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700/40 rounded-lg p-2.5">
                  <p className="text-gray-400 text-xs">V/TVL Ratio</p>
                  <p className="font-bold text-white">{pool.vTvlRatio.toFixed(1)}x</p>
                </div>
                <div className="bg-gray-700/40 rounded-lg p-2.5">
                  <p className="text-gray-400 text-xs">7d Growth</p>
                  <p className={`font-bold flex items-center gap-1 ${pool.volumeGrowth7d > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {pool.volumeGrowth7d > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {pool.volumeGrowth7d.toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Verdict + Stable Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-4 py-2 text-sm font-bold rounded-full border ${verdict.color}`}>
                  {verdict.text}
                </span>
                {pool.isStablePair && (
                  <span className="text-xs text-cyan-400 flex items-center gap-1">
                    Low IL Risk
                  </span>
                )}
              </div>

              {/* Action */}
              <a
                href={`https://oku.trade/uniswap/v3/pool/ethereum/${pool.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-blue-700 shadow-lg"
                >
                View Pool
                <ExternalLink className="h-4 w-4" />
             </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}