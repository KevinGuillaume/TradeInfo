import { Sparkles, TrendingUp, TrendingDown, Activity, ArrowRight } from 'lucide-react';

export interface TokenSignal {
    type: string;
    message: string;
    details: Record<string, number | null>;
  }
  
  export interface TokenAnalytics {
    token: string;
    name: string;
    price: number;
    contract: string;
    signals: TokenSignal[];
  }



export default function TokenInsightCard( {token, name, price, contract, signals}: TokenAnalytics) {
  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'Liquidity Momentum': return <TrendingUp className="w-5 h-5" />;
      case 'Price Momentum': return <TrendingUp className="w-5 h-5" />;
      case 'Volume Divergence': return <TrendingDown className="w-5 h-5" />;
      case 'On-chain Activity': return <Activity className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getSignalColor = (message: string) => {
    if (message.includes('Bullish') || message.includes('Strong upward')) {
      return 'from-green-500 to-emerald-500';
    }
    if (message.includes('cooling') || message.includes('Decreasing')) {
      return 'from-yellow-500 to-orange-500';
    }
    return 'from-purple-500 to-pink-500';
  };

  return (
    <div
      key={token}
      className="relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl bg-gradient-to-br from-gray-800/60 via-gray-900/50 to-gray-800/60 border-gray-700 shadow-xl"
    >
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 animate-pulse opacity-50" />

      <div className="relative p-6">
        {/* Header: Token + Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Token Icon */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">
                {token.slice(0, 2)}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                {token}
                <span className="text-sm text-gray-400 font-normal">• {name}</span>
              </h3>
              <p className="text-xl font-bold text-green-400">
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </p>
            </div>
          </div>
        </div>

        {/* Signals */}
        <div className="space-y-3 mb-4">
          {signals.map((signal, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.01] ${
                signal.message.includes('Bullish') || signal.message.includes('Strong')
                  ? 'bg-green-900/30 border-green-700/50'
                  : 'bg-yellow-900/30 border-yellow-700/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getSignalColor(signal.message)} p-1.5 flex items-center justify-center text-white`}>
                {getSignalIcon(signal.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{signal.type}</p>
                <p className="text-xs text-gray-300 mt-0.5">{signal.message}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Action Button */}
        <a
        href={`https://oku.trade/app/ethereum/trade/${contract}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700"
        >
            Analyze {token}
            <ArrowRight className="h-4 w-4" />
        </a>

      </div>
    </div>
  );
}