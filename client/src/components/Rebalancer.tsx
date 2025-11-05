// Rebalancer.tsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { backendAPI } from '../api';
import { RefreshCw, ExternalLink, ArrowRight } from 'lucide-react';

interface Suggestion {
  type: 'lp' | 'swap' | 'stake' | 'ai';
  title: string;
  description: string;
  action?: { type: 'link'; url: string } | { type: 'swap'; swapParams: any };
  apy?: string;
  risk?: string;
}

export default function Rebalancer() {
  const { address } = useAccount();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchSuggestions = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const data = await backendAPI.getRebalanceSuggestions(address);
      setSuggestions(data.suggestions);
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rebalancer</h1>
        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {lastRefresh && (
        <p className="text-sm text-gray-500 mb-4">Last refreshed: {lastRefresh}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <p className="text-center text-gray-600">No suggestions — your portfolio is optimized!</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className={`p-5 rounded-xl border ${
                s.type === 'ai' ? 'bg-purple-50 border-purple-300' : 'bg-white border-gray-200'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {s.type === 'lp' && 'Pool'}
                    {s.type === 'swap' && 'Swap'}
                    {s.type === 'stake' && 'Vault'}
                    {s.type === 'ai' && 'AI Insight'}
                    {s.apy && <span className="text-green-600 text-sm font-bold">+{s.apy}</span>}
                  </h3>
                  <p className="text-gray-700 mt-1">{s.title}</p>
                  <p className="text-sm text-gray-600 mt-2">{s.description}</p>
                  {s.risk && (
                    <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      s.risk === 'Low' ? 'bg-green-100 text-green-800' :
                      s.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Risk: {s.risk}
                    </span>
                  )}
                </div>

                {s.action && (
                  <button
                    onClick={() => handleAction(s)}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                  >
                    {s.action.type === 'link' ? (
                      <>
                        View <ExternalLink className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Go <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}