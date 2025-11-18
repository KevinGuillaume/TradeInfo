// pages/HomeDEX.tsx
import { useState } from 'react';
import ProfileSection from "../components/ProfileSection";
import Swap from "../components/Swap";
import TokenAnalytics from '../components/TokenAnalytics';
import PoolAnalytics from '../components/PoolAnalytics';

export default function HomeDEX() {
  const [activeTab, setActiveTab] = useState<'pools' | 'swap' | 'tokens'>('tokens');

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* LEFT: Rebalancer + Swap with Tabs - 60% */}
      <div className="w-full lg:w-[60%] p-4 lg:p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 flex flex-col h-full">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab('tokens')}
              className={`flex-1 py-4 px-6 text-lg font-semibold transition-all duration-300 ${
                activeTab === 'tokens'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-700/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              Tokens
            </button>
            <button
              onClick={() => setActiveTab('pools')}
              className={`flex-1 py-4 px-6 text-lg font-semibold transition-all duration-300 ${
                activeTab === 'pools'
                  ? 'text-white border-b-2 border-purple-500 bg-gray-700/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              Pools
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex-1 py-4 px-6 text-lg font-semibold transition-all duration-300 ${
                activeTab === 'swap'
                  ? 'text-white border-b-2 border-blue-500 bg-gray-700/50'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
              }`}
            >
              Swap
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'tokens' && <TokenAnalytics />}
          {activeTab === 'swap' && <Swap />}
          {activeTab === 'pools' && <PoolAnalytics />}
          </div>
        </div>
      </div>

      {/* RIGHT: Profile - 40% */}
      <div className="w-full lg:w-[40%] p-4 lg:p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl h-full p-6 border border-gray-700">
          <ProfileSection />
        </div>
      </div>
    </div>
  );
}