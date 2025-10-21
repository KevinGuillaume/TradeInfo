import { useState, useEffect } from "react";
import tokenList from '../data/token.json'
import { backendAPI, type TokenBalance } from '../api';
import TokenSelectModal from "./modals/TokenSelectModal";

// This is shape of our token from the json list 
interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

export default function Swap() {
  const [tokenOneAmount, setTokenOneAmount] = useState<string>("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState<string>("");
  const [tokenOne, setTokenOne] = useState<Token | null>(null);
  const [tokenTwo, setTokenTwo] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokenOneModalOpen, setIsTokenOneModalOpen] = useState(false);
  const [isTokenTwoModalOpen, setIsTokenModalTwoOpen] = useState(false);
  const [prices,setPrices] = useState<any>({})

  const handleTokenOneSelect = (token: Token) => {
    setPrices({})
    setTokenOneAmount("")
    setTokenTwoAmount("")
    setTokenOne(token);
  };

  // Handles the second token selected
  const handleTokenTwoSelect = (token: Token) => {
    setPrices({})
    setTokenOneAmount("")
    setTokenTwoAmount("")
    setTokenTwo(token);
  };

  const handleTokenSwap = () => {
    const temp = tokenOne;
    setTokenOne(tokenTwo);
    setTokenTwo(temp);
    setTokenOneAmount(tokenTwoAmount);
    setTokenTwoAmount(tokenOneAmount);
  }

  // Load static token list
  useEffect(() => {
    setTokens(tokenList)
  }, []);

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenOneAmount(e.target.value);

    if(e.target.value && prices) { //if we are changing the amount and there is data to look at it with
        setTokenTwoAmount((Number(e.target.value) * prices.ratio).toFixed(2))

    }else{
        setTokenTwoAmount("")
    }

  };

  const fetchPrices = async (one: string, two: string) => {
    const res = await backendAPI.getTokenPrices(one,two)
    setPrices(res)
  }


  useEffect(() => {
    if(tokenOne != null && tokenTwo != null){
        fetchPrices(tokenOne.address,tokenTwo.address)
    }
  },[tokenOne,tokenTwo])

  return (
    <div className="flex flex-col space-y-2">
      {/* Input Token */}
      <div className="border border-gray-600 p-4 flex flex-col bg-gray-800/50 backdrop-blur-md rounded-xl">
        <label className="text-sm text-gray-400 mb-2">You pay</label>
        <div className="flex flex-row items-center space-x-3">
          <input
            className="flex-1 bg-transparent text-2xl text-white placeholder-gray-500 outline-none"
            placeholder="0.0"
            value={tokenOneAmount}
            onChange={handleChangeAmount}
            type="number"
            disabled={!tokenOne}
          />
          <div className="relative">
            <button 
            onClick={() => setIsTokenOneModalOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg">
              {tokenOne ? (
                <>
                  <img src={tokenOne.logoURI} alt={tokenOne.symbol} className="w-6 h-6 rounded-full" />
                  <span>{tokenOne.symbol}</span>
                </>
              ) : (
                <span>Select token</span>
              )}
            </button>
          </div>
        </div>
        {tokenOne && (
          <p className="text-xs text-gray-500 mt-1">Balance: {tokenOneAmount ? (parseFloat(tokenOneAmount) * 1).toFixed(4) : "0"} {tokenOne.symbol}</p>
        )}
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center">
        <button
          onClick={handleTokenSwap}
          className="p-2 bg-gray-700/50 rounded-full hover:bg-gray-600/50 transition-colors"
        >
          ↕️
        </button>
      </div>

      {/* Output Token */}
      <div className="border border-gray-600 p-4 flex flex-col bg-gray-800/50 backdrop-blur-md rounded-xl">
        <label className="text-sm text-gray-400 mb-2">You receive (estimated)</label>
        <div className="flex flex-row items-center space-x-3">
          <input
            className="flex-1 bg-transparent text-2xl text-white placeholder-gray-500 outline-none"
            placeholder="0.0"
            value={tokenTwoAmount}
            disabled
          />
          <div className="relative">
            <button 
            onClick={() => setIsTokenModalTwoOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg">
              {tokenTwo ? (
                <>
                  <img src={tokenTwo.logoURI} alt={tokenTwo.symbol} className="w-6 h-6 rounded-full" />
                  <span>{tokenTwo.symbol}</span>
                </>
              ) : (
                <span>Select token</span>
              )}
            </button>
          </div>
        </div>
        {tokenTwo && (
          <p className="text-xs text-gray-500 mt-1">Balance: 0 {tokenTwo.symbol} (estimated)</p>
        )}
      </div>

      {/* Swap Button */}
      <button
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
        disabled={!tokenOne || !tokenTwo || !tokenOneAmount}
      >
        Swap
      </button>
      <TokenSelectModal
        isOpen={isTokenOneModalOpen}
        onClose={() => setIsTokenOneModalOpen(false)}
        onSelect={handleTokenOneSelect}
        tokens={tokens}
        selectedToken={tokenOne}
      />
      <TokenSelectModal
        isOpen={isTokenTwoModalOpen}
        onClose={() => setIsTokenModalTwoOpen(false)}
        onSelect={handleTokenTwoSelect}
        tokens={tokens}
        selectedToken={tokenTwo}
      />
    </div>
  );
}