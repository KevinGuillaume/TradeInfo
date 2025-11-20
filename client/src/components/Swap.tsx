import { useState, useEffect } from "react";
import tokenList from '../data/token.json'
import { backendAPI } from '../api';
import TokenSelectModal from "./modals/TokenSelectModal";
import { useAccount, useBalance, useDisconnect, useSignTypedData, useWriteContract } from "wagmi";
import { parseUnits } from "viem";

// This is shape of our token from the json list 
interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
}

enum SignatureType {
  EIP712 = 2,
}

export default function Swap() {
  const { signTypedDataAsync } = useSignTypedData();
  const { address } = useAccount();

  const [tokenOneAmount, setTokenOneAmount] = useState<string>("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState<string>("");
  const [tokenOne, setTokenOne] = useState<Token | null>(null);
  const [tokenTwo, setTokenTwo] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokenOneModalOpen, setIsTokenOneModalOpen] = useState(false);
  const [isTokenTwoModalOpen, setIsTokenModalTwoOpen] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapStatus, setSwapStatus] = useState<string>("");
  const [prices,setPrices] = useState<any>({})

  const { data: balance } = useBalance({
    address,
    token: tokenOne?.address as `0x${string}`,
    chainId: 1,
  });


  // function to split signature and format for 0x bc thats what they want lol
const formatSignatureFor0x = (signature: string) => {
  if (!signature.startsWith('0x') || signature.length !== 132) {
    throw new Error('Invalid signature length');
  }

  const r = '0x' + signature.slice(2, 66);
  const s = '0x' + signature.slice(66, 130);
  const vHex = signature.slice(130, 132);
  const v = parseInt(vHex, 16);

  return {
    v,
    r,
    s,
    signatureType: SignatureType.EIP712,
  };
};

  const fetchDexSwap = async () => {
    // Make sure we got data to swap
    if (!tokenOne || !tokenTwo || !tokenOneAmount || !address) return;
  
    setIsSwapping(true);
    setSwapStatus("Preparing swap...");
  
    try {
      // Parse amount
      const sellAmount = parseUnits(tokenOneAmount, tokenOne.decimals).toString();

      // Check balance
      if (!balance || BigInt(balance.value) < BigInt(sellAmount)) {
        throw new Error(`Insufficient ${tokenOne.symbol} balance`);
      }
  
      // Get gasless swap quote from backend
      setSwapStatus("Fetching quote...");
      const quote = await backendAPI.getGaslessQuote({
        sellToken: tokenOne.address,
        buyToken: tokenTwo.address,
        sellAmount,
        taker: address,
        chainId: 1,
        slippagePercentage: "0.25", // 0.25% slippage prob gonna make this a setting in the swap UI
      });
  
      if (quote.trade.type !== 'settler_metatransaction') {
        throw new Error('Gasless swap not supported for this pair');
      }
  
      // Check if this wallet even allows this transaction
      const needsApproval = quote.issues?.allowance?.actual === "0";
      let signedApproval = null;

      // Does it need to be approved or nah
      if (needsApproval) {
        setSwapStatus("Approval needed...");
        if (quote.approval) {
          // Gasless approval!!!
          setSwapStatus('Sign approval…');
          const approvalSignature = await signTypedDataAsync({
            domain: quote.approval.eip712.domain,
            types: quote.approval.eip712.types,
            primaryType: quote.approval.eip712.primaryType,
            message: quote.approval.eip712.message,
          });
          signedApproval = {
            type: quote.approval.type,
            eip712: quote.approval.eip712,
            signature: formatSignatureFor0x(approvalSignature),
          };
        }
      }
  
      // Sign the transaction
      setSwapStatus('Sign transaction…');
      const tradeSignature = await signTypedDataAsync({
        domain: quote.trade.eip712.domain,
        types: quote.trade.eip712.types,
        primaryType: quote.trade.eip712.primaryType,
        message: quote.trade.eip712.message,
      });

      //  Submit to 0x backend
      setSwapStatus('Submitting swap…');
      const result = await backendAPI.submitGaslessTx({
        trade: {
          type: quote.trade.type,
          eip712: quote.trade.eip712,
          signature: formatSignatureFor0x(tradeSignature),
        },
        approval: signedApproval,
        chainId: 1,
      });
  
      setSwapStatus(`Swap complete! Tx: ${result.transactionHash.slice(0, 10)}...`);
      
      // reset amounts
      setTokenOneAmount("");
      setTokenTwoAmount("");
  
    } catch (error: any) {
      console.error("Swap failed:", error);
      setSwapStatus(`Error: ${error.message || "Swap failed"}`);
    } finally {
      setIsSwapping(false);
    }
  };


  // Handles the first token selected
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

  // Handles the swapping between top and bottom section of swap component
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Swap
          </h1>
          <p className="text-gray-400 text-sm mt-1">A gasless swap to exchange tokens</p>
        </div>
      </div>
      <div className="border border-gray-600 p-4 flex flex-col bg-gray-800/50 backdrop-blur-md rounded-xl">
        <label className="text-sm text-gray-400 mb-2">You pay</label>
        <div className="flex flex-row items-center space-x-3">
          <input
            className="flex-1 bg-transparent text-xl text-white placeholder-gray-500 outline-none"
            placeholder="0.0"
            value={tokenOneAmount}
            onChange={handleChangeAmount}
            type="number"
            disabled={!prices}
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
      </div>

      {/* Swap Arrow */}
      {/* Premium Spaced Swap Button */}
<div className="flex justify-center -my-4 z-10">
  <button
    onClick={handleTokenSwap}
    className="group relative p-4 bg-gray-800/80 backdrop-blur-2xl rounded-2xl border border-gray-600 hover:border-purple-500/50 shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-110"
  >
    <div className="flex flex-col items-center gap-1">
      {/* Up Arrow */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-400 group-hover:text-purple-300 transition-colors"
      >
        <path d="M7 13l5-5 5 5" />
      </svg>

      {/* Down Arrow */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400 group-hover:text-blue-300 transition-colors"
      >
        <path d="M7 11l5 5 5-5" />
      </svg>
    </div>

    {/* Subtle glow ring */}
    <div className="absolute inset-0 rounded-2xl bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
  </button>
</div>

      {/* Output Token */}
      <div className="border border-gray-600 p-4 flex flex-col bg-gray-800/50 backdrop-blur-md rounded-xl">
        <label className="text-sm text-gray-400 mb-2">You receive (estimated)</label>
        <div className="flex flex-row items-center space-x-3">
          <input
            className="flex-1 bg-transparent text-xl text-white placeholder-gray-500 outline-none"
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
      </div>

      {/* Swap Button */}
      <button
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50"
        disabled={!tokenOne || !tokenTwo || !tokenOneAmount || isSwapping}
        onClick={fetchDexSwap}
      >
        {isSwapping ? "Swapping..." : "Swap"}
      </button>
      {swapStatus && (
        <p className="text-center text-sm mt-2 text-yellow-400">{swapStatus}</p>
      )}
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