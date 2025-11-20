import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { backendAPI } from '../api';
import { RefreshCw } from 'lucide-react';
import TokenInsightCard from './TokenAnalyticsCard';

export interface TokenSignal {
  type: string;
  message: string;
  details: Record<string, number | null>;
}

export interface TokenAnalytics {
  token: string;
  contract: string;
  name: string;
  price: number;
  signals: TokenSignal[];
}

export default function TokenAnalytics() {
  const { address } = useAccount();
  const [analytics, setAnalytics] = useState<TokenAnalytics[]>([])
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchTokenAnalytics = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const data = await backendAPI.getTokenAnalytics(address);
      setAnalytics(data.analytics)
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenAnalytics();
  }, [address]);



return (
  <div className="">
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Tokens
          </h1>
          <p className="text-gray-400 text-sm mt-1">Analytics based on your wallet holdings to help find ongoing trends.</p>
        </div>

        <button
          onClick={fetchTokenAnalytics}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Refresh'}
        </button>
      </div>

      {lastRefresh && (
        <p className="text-sm text-gray-500 mb-8">
          Last refreshed: {new Date().toLocaleTimeString()}
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
      ) : analytics.length === 0? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-900/30 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl text-gray-300">Looks like your account isn't connected!</p>
          <p className="text-gray-500 mt-2">No analytics available right now.</p>
        </div>
      ) : (
        /* Tokens Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analytics.map((insight) => (
            <TokenInsightCard
              key={insight.token} 
              token={insight.token} 
              name={insight.name}
              price={insight.price} 
              contract={insight.contract} 
              signals={insight.signals}              
            />
))}
        </div>
      )}
    </div>
  </div>
);
}