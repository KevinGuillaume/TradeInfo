import { Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import type { Suggestion } from './Rebalancer'; 

interface PoolAnalyticsCardProps {
  suggestion: Suggestion;
  onAction: (suggestion: Suggestion) => void;
}

export default function PoolAnalyticsCard({ suggestion, onAction }: PoolAnalyticsCardProps) {
  const { type, title, description, apy, risk, action } = suggestion;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
        type === 'ai'
          ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/50 shadow-purple-500/20'
          : 'bg-gray-800/60 border-gray-700 shadow-xl'
      }`}
    >
      {type === 'ai' && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse" />
      )}

      <div className="relative p-6">
        {/* Header: Icon + Title */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            {type === 'lp' && (
              <div className="w-10 h-10 bg-blue-600/30 rounded-xl flex items-center justify-center text-xs font-bold text-blue-300">
                Pool
              </div>
            )}
            {type === 'swap' && (
              <div className="w-10 h-10 bg-green-600/30 rounded-xl flex items-center justify-center text-xs font-bold text-green-300">
                Swap
              </div>
            )}
            {type === 'stake' && (
              <div className="w-10 h-10 bg-yellow-600/30 rounded-xl flex items-center justify-center text-xs font-bold text-yellow-300">
                Vault
              </div>
            )}
            {type === 'ai' && (
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            )}

            {/* Title */}
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">
                {type === 'lp' && 'Liquidity Pool'}
                {type === 'swap' && 'Smart Swap'}
                {type === 'stake' && 'Yield Vault'}
                {type === 'ai' && 'AI Insight'}
                {apy && (
                  <span className="text-green-400 font-bold text-sm ml-2">
                    +{apy}
                  </span>
                )}
              </h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-gray-300 font-medium mb-2">{title}</p>
        <p className="text-sm text-gray-400 mb-4 leading-relaxed">{description}</p>

        {/* Risk Badge */}
        {risk && (
          <span
            className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 ${
              risk === 'Low'
                ? 'bg-green-900/50 text-green-300 border border-green-700'
                : risk === 'Medium'
                ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
                : 'bg-red-900/50 text-red-300 border border-red-700'
            }`}
          >
            Risk: {risk}
          </span>
        )}

        {/* Action Button */}
        {action && (
          <button
            onClick={() => onAction(suggestion)}
            className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              type === 'ai'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
            }`}
          >
            {action.type === 'link' ? (
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
  );
}