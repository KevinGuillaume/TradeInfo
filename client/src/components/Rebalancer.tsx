// Rebalancer.tsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { backendAPI } from '../api';
import { RefreshCw, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import TokenInsightCard from './TokenAnalyticsCard';

interface Suggestion {
  type: 'lp' | 'swap' | 'stake' | 'ai';
  title: string;
  description: string;
  action?: { type: 'link'; url: string } | { type: 'swap'; swapParams: any };
  apy?: string;
  risk?: string;
}

export interface TokenSignal {
  type: string;
  message: string;
  details: Record<string, number | null>;
}

export interface TokenAnalytics {
  token: string;
  name: string;
  price: number;
  signals: TokenSignal[];
}

export default function Rebalancer() {
  const { address } = useAccount();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [analytics, setAnalytics] = useState<TokenAnalytics[]>([])
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchSuggestions = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const data = await backendAPI.getRebalanceSuggestionsAndAnalytics(address);
      setSuggestions(data.suggestions);
      setAnalytics(data.analytics)
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [address]);

  const handleAction = (s: Suggestion) => {
    if (s.action?.type === 'link' && s.action.url) {
      window.open(s.action.url, '_blank');
    } else if (s.action?.type === 'swap') {
      const params = new URLSearchParams(s.action.swapParams);
      window.location.href = `/swap?${params.toString()}`;
    }
  };


return (
  <div className="">
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Rebalance
          </h1>
          <p className="text-gray-400 text-sm mt-1">Smart suggestions to optimize your wallet that are based on current pools, activity, and more.</p>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      {lastRefresh && (
        <p className="text-sm text-gray-500 mb-8">
          Last refreshed: {new Date(lastRefresh).toLocaleTimeString()}
        </p>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl h-40"
            />
          ))}
        </div>
      ) : suggestions.length === 0 && analytics.length === 0? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-900/30 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl text-gray-300">Your portfolio is perfectly balanced!</p>
          <p className="text-gray-500 mt-2">No rebalancing needed right now.</p>
        </div>
      ) : (
        /* Suggestions Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                s.type === 'ai'
                  ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/50 shadow-purple-500/20'
                  : 'bg-gray-800/60 border-gray-700 shadow-xl'
              }`}
            >
              {s.type === 'ai' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
              )}

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {s.type === 'lp' && <div className="w-10 h-10 bg-blue-600/30 rounded-xl flex items-center justify-center">Pool</div>}
                    {s.type === 'swap' && <div className="w-10 h-10 bg-green-600/30 rounded-xl flex items-center justify-center">Swap</div>}
                    {s.type === 'stake' && <div className="w-10 h-10 bg-yellow-600/30 rounded-xl flex items-center justify-center">Vault</div>}
                    {s.type === 'ai' && (
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {s.type === 'lp' && 'Liquidity Pool'}
                        {s.type === 'swap' && 'Smart Swap'}
                        {s.type === 'stake' && 'Yield Vault'}
                        {s.type === 'ai' && 'AI Insight'}
                        {s.apy && (
                          <span className="text-green-400 font-bold text-sm ml-2">
                            +{s.apy}
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 font-medium mb-2">{s.title}</p>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">{s.description}</p>

                {s.risk && (
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${
                      s.risk === 'Low'
                        ? 'bg-green-900/50 text-green-300 border border-green-700'
                        : s.risk === 'Medium'
                        ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                        : 'bg-red-900/50 text-red-300 border border-red-700'
                    }`}
                  >
                    Risk: {s.risk}
                  </span>
                )}

                {s.action && (
                  <button
                    onClick={() => handleAction(s)}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      s.type === 'ai'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
                    }`}
                  >
                    {s.action.type === 'link' ? (
                      <>
                        View on Oku <ExternalLink className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Execute Now <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          {analytics.map((insight) => (
  <TokenInsightCard
    key={insight.token}
    insight={insight}
    onExecute={(insight) => {
      // Open swap, rebalance, or AI analysis
      console.log('Execute:', insight.token);
    }}
  />
))}
        </div>
      )}
    </div>
  </div>
);
}