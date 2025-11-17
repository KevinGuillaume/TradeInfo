// Rebalancer.tsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { backendAPI } from '../api';
import { RefreshCw, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import TokenInsightCard from './TokenAnalyticsCard';
import PoolAnalyticsCard from './PoolAnalyticsCard';

export interface Suggestion {
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
            <PoolAnalyticsCard 
              key={i}
              suggestion={s}
              onAction={handleAction}
            />
          ))}
          {analytics.map((insight) => (
            <TokenInsightCard
              key={insight.token}
              insight={insight}
              onExecute={(insight) => {
                // will add function to handle the corresponding action
                console.log('do something with:', insight.token);
              }}
            />
))}
        </div>
      )}
    </div>
  </div>
);
}