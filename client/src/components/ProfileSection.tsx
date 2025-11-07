import { backendAPI, type TokenBalance } from '../api';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useChainId } from 'wagmi';


export default function ProfileSection() {
    const { address, isConnected } = useAccount();
    const chainId = useChainId()
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [ethBalance, setEthBalance] = useState<string | null>(null);
    const chainName = chainId === 1 ? 'Ethereum Mainnet' : 'Unknown Network';

    const fetchWalletInfo = async (address: string, chainId: number) => {
        if (!address || chainId !== 1) return;
        try {
          const balance: any = await backendAPI.getAccountBalance(address);
          setEthBalance(balance.balance);
        } catch (err) {
          setApiError('Failed to fetch ETH balance.');
        }
      };

    const fetchTokenBalances = async (address: string, chainId: number) => {
    if (!address || chainId !== 1) { // Ensure Ethereum mainnet
        setApiError(chainId !== 1 ? 'Please switch to Ethereum mainnet' : 'No address provided');
        return;
    }
    setLoading(true);
    setApiError(null);

    try {
        const balances: any = await backendAPI.getTokenBalances(address);
        console.log("balances: ", balances)

        setTokenBalances(balances.balances);
    } catch (err) {
        console.error('Error fetching token balances:', err);
        setApiError('Failed to fetch token balances. Please try again.');
    } finally {
        setLoading(false);
    }
    };


  // Fetch balances when address or chainId changes
  useEffect(() => {
    if (address && chainId) {
      fetchTokenBalances(address, 1);
      fetchWalletInfo(address,chainId)
    } else {
      setTokenBalances([]); // Clear balances if no address
      setApiError(null);
    }
  }, [address, chainId]);


  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-sm mx-auto">
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Profile
          </h1>
  
          {!isConnected || !address ? (
            <div className="py-10">
              <div className="w-16 h-16 mx-auto bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">Connect wallet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Address */}
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-700">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs text-gray-300 truncate">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(address)}
                    className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600 transition"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{chainName}</p>
              </div>
  
              {/* ETH Balance */}
              {ethBalance && (
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-2xl p-4 border border-blue-700/30">
                  <p className="text-xs text-gray-400">ETH Balance</p>
                  <p className="text-2xl font-bold text-white">
                    {Number(ethBalance).toFixed(6)}
                  </p>
                </div>
              )}
  
              {/* Tokens */}
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-5 border border-gray-700">
                <h2 className="text-sm font-bold text-white mb-3">Tokens</h2>
  
                {apiError ? (
                  <p className="text-xs text-red-400 text-center">{apiError}</p>
                ) : loading ? (
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-700/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : tokenBalances.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {tokenBalances.slice(0, 8).map((token) => (
                      <div
                        key={token.symbol}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700/50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-600 rounded-full flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-white">{token.symbol}</p>
                            <p className="text-xs text-gray-500">
                              {Number(ethers.formatUnits(token.balance, Number(token.decimals))).toFixed(4)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {tokenBalances.length > 8 && (
                      <p className="text-xs text-gray-500 text-center pt-2">
                        +{tokenBalances.length - 8} more
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center">No tokens</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
