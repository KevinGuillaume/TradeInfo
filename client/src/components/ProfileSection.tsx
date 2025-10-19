import { useAppSelector } from '../store/hooks';
import { backendAPI, type TokenBalance } from '../api';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';


export default function ProfileSection() {
    const { address, chainId, connected, error } = useAppSelector((state) => state.currentAddress);
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [ethBalance, setEthBalance] = useState<string | null>(null);
    const chainName = chainId === 1 ? 'Ethereum Mainnet' : 'Unknown Network';

    const fetchWalletInfo = async (address: string, chainId: number) => {
        if (!address || chainId !== 1) return;
        try {
          const balance: any = await backendAPI.getAccountBalance(address);
          setEthBalance(balance);
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

        setTokenBalances(balances);
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
      fetchTokenBalances(address, chainId);
      fetchWalletInfo(address,chainId)
    } else {
      setTokenBalances([]); // Clear balances if no address
      setApiError(null);
    }
  }, [address, chainId]);


  return (
    <div className="pt-16 pb-8 px-4 min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile</h1>
          {!connected || !address ? (
            <p className="text-lg text-gray-500">
              Please connect your wallet to view your profile.
            </p>
          ) : (
            <div>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-xl text-gray-700 font-mono truncate">{address}</p>
                <button
                    onClick={() => navigator.clipboard.write(address)}
                    className="p-1 text-gray-500 hover:text-blue-500"
                    title="Copy address"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
                </div>
                <p className="text-xl text-gray-700 mb-4">Network: {chainName} (Chain ID: {chainId})</p>
                {ethBalance && (
                    <p className="text-xl text-gray-700 mb-4">
                        ETH Balance: {Number(ethBalance).toFixed(4)} ETH
                    </p>
                    )}
              {error && (
                <p className="text-red-500 text-base mb-4">{error}</p>
              )}
              <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                Token Balances
              </h2>
              {apiError ? (
                <p className="text-red-500 text-base">{apiError}</p>
              ) : loading ? (
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : tokenBalances.length > 0 ? (
                <ul className="max-w-md mx-auto bg-white rounded-lg shadow-md">
                  {tokenBalances.map((token) => (
                    <li
                      key={token.tokenSymbol}
                      className="flex items-center p-4 border-b last:border-b-0 hover:bg-gray-50"
                    >
                      <img
                        src={token.logo || 'https://via.placeholder.com/40?text=Token'}
                        alt={`${token.tokenName} logo`}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <p className="text-base font-medium text-gray-800">
                          {token.tokenName} ({token.tokenSymbol})
                        </p>
                        <p className="text-sm text-gray-600">
                          {Number(ethers.formatUnits(token.balance, Number(token.decimals))).toFixed(4)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-base text-gray-500">
                  No tokens found or balances are zero.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
