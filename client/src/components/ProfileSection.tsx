import { backendAPI, type TokenBalance } from '../api';
import { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';

interface NFT {
  token_address: string;
  name: string;
  symbol: string;
  token_uri?: string;
  metadata?: any;
  normalized_metadata?:any
  amount: string;
}

export default function ProfileSection() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const chainName = chainId === 1 ? 'Ethereum Mainnet' : 'Unknown Network';

  const fetchWalletInfo = async (address: string) => {
    try {
      const balance: any = await backendAPI.getAccountBalance(address);
      setEthBalance(balance.balance);
    } catch (err) {
      console.error('Failed to fetch ETH balance.');
    }
  };

  const fetchTokenBalances = async (address: string) => {
    setLoading(true);
    try {
      const balances: any = await backendAPI.getTokenBalances(address);
      setTokenBalances(balances.balances || []);
    } catch (err) {
      console.error('Failed to fetch token balances.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNFTs = async (address: string) => {
    setLoadingNFTs(true);
    try {
      const data: any = await backendAPI.getNFTs(address);

      const validNFTs = data.nfts
        .map((nft: any) => {
          let image = nft.normalized_metadata?.image || '';
          return {
            ...nft,
            image,
            collectionName: nft.name || nft.normalized_metadata.name || 'Unknown'
          };
        })
        .filter((nft: any) => {
          if (!nft.normalized_metadata?.image) return false;
          if (nft.possible_spam) return false;

          if(nft.name){
            const name = nft.name.toLowerCase();
            // get rid of the junk.....
            const spamKeywords = ['claim', 'reward', 'access', 'visit', 'steth', 'prize', 'mysterybox'];
            if (spamKeywords.some(k => name.includes(k))) return false;
          }

          if (nft.contract_type === 'ERC1155' && !nft.rarity_rank) return false;

          return true;
        })
      console.log("Valid nfts: ", validNFTs)
      setNfts(validNFTs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNFTs(false);
    }
  };

  const formatTokenBalance = (rawBalance: number, symbol: string): string => {
    if (rawBalance < 0.000001) {
      return rawBalance < 0.00000001 
        ? `<0.00000001 ${symbol}`
        : `<0.000001 ${symbol}`;
    }
  
    return rawBalance.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 8,
    }).replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1') + ` ${symbol}`;
  };

  useEffect(() => {
    if (address && chainId === 1) {
      fetchWalletInfo(address);
      fetchTokenBalances(address);
      fetchNFTs(address);
    } else {
      setTokenBalances([]);
      setNfts([]);
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

              {/* ETH */}
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
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-10 bg-gray-700/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : tokenBalances.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {tokenBalances.map((token) => (
                    <div
                      key={token.contractAddress}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {/* Token Logo with fallback */}
                        <div className="relative">
                          {token.logo ? (
                            <img
                              src={token.logo}
                              alt={token.symbol}
                              className="w-7 h-7 rounded-full object-cover border border-gray-600"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/28?text=${token.symbol.slice(0, 2)}`;
                              }}
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">
                                {token.symbol.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                          )}
                          {/* Optional: Tiny verified badge for known tokens */}
                          {/* {['USDC', 'WETH', 'DAI', 'WBTC'].includes(token.symbol) && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                          )} */}
                        </div>

                        {/* Token Name + Symbol */}
                        <div>
                          <p className="text-sm text-left font-semibold text-white">{token.symbol}</p>
                          <p className="text-xs text-gray-500">{token.name}</p>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">
                          {formatTokenBalance(Number(token.balance), token.symbol)}
                        </p>
                        {token.value_usd >= 0.01 && (
                          <p className="text-xs text-gray-400">${token.value_usd.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center">No tokens</p>
                )}
              </div>

              {/* NFTs */}
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-5 border border-gray-700">
                <h2 className="text-sm font-bold text-white mb-3">NFTs ({nfts.length})</h2>
                {loadingNFTs ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : nfts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {nfts.map((nft, i) => {
                      const image = nft.normalized_metadata?.image?.replace?.('ipfs://', 'https://ipfs.io/ipfs/') ||
                                    'https://via.placeholder.com/64?text=NFT';
                      return (
                        <img
                          key={i}
                          src={image}
                          alt={nft.name || 'NFT'}
                          className="w-full h-16 object-cover rounded-lg border border-gray-700 hover:border-purple-500 transition"
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center">No NFTs</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}