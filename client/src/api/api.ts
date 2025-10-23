interface GaslessQuoteParams {
    sellToken: string;
    buyToken: string;
    sellAmount: string; // 0x expects stringified BigInt
    taker: string;      // wallet address
    chainId: number;
    slippagePercentage: string; // e.g., "0.5" for 0.5%
}

  interface GaslessQuoteResponse {
    type: string;
    quoteId?: string;
    buyAmount: string;
    sellAmount: string;
    allowanceTarget: string;
    metaTransaction: {
      domain: Record<string, any>;
      types: Record<string, any>;
      primaryType: string;
      message: Record<string, any>;
    };
    approval?: {
      domain: Record<string, any>;
      types: Record<string, any>;
      primaryType: string;
      message: Record<string, any>;
    };
    supportsGaslessApproval: boolean;
    issues?: {
      allowance?: { amount: string };
    };
}

interface SubmitGaslessTxParams {
    signature: string;     // EIP-712 signature (hex string)
    chainId: number;       // e.g., 1 for Ethereum mainnet
    quoteId?: string;      // optional, required by some 0x backends
}

interface SubmitGaslessTxResponse {
    transactionHash: string;   // Tx hash of the relayed transaction
    status: string;            // e.g., "submitted", "success"
    // Optional fields from 0x
    quoteId?: string;
    gasPrice?: string;
    gasUsed?: string;
}
export class API {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    async getTokenBalances(address: string) {
        try {
            console.log("Getting token balances for connected address...")
            const response = await fetch(this.baseURL + `/api/token-balances/${address}`)
            const data = await response.json()
            return data
          } catch (err) {
            console.error('Error getting token balances', err);
        }
    }

    async getAccountBalance(address: string) {
        try {
            console.log("Getting connected wallet balance...")
            const response = await fetch(this.baseURL + `/api/account-balance/${address}`)
            const data = await response.json()
            return data
          } catch (err) {
            console.error('Error getting token balances', err);
        }
    }

    async getTokenPrices(addressOne: string, addressTwo: string) {
        try{
            console.log("Getting token prices")
            const response = await fetch(this.baseURL + `/api/tokenPrice?addressOne=${addressOne}&addressTwo=${addressTwo}`)
            const data = await response.json()
            return data
        } catch (err) {
            console.error("Error getting token prices for coin addresses")
        }
    }

    async getGaslessQuote({sellToken,buyToken,sellAmount,taker,chainId,slippagePercentage}: GaslessQuoteParams) {
        try{
            console.log("Getting gasless quote")
            const response = await fetch(this.baseURL + `/api/gasless/quote?sellToken=${sellToken}
                &buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}&chainId=${chainId}&slippagePercentage=${slippagePercentage}`)
            const data = await response.json()
            return data
        } catch (err) {
            console.error("Error getting token prices for coin addresses")
        }
    }

    async submitGaslessTx({ signature, chainId,quoteId,}: SubmitGaslessTxParams){
        const res = await fetch(`${this.baseURL}/api/gasless/submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ signature, chainId, quoteId }),
          });
      
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Failed to submit gasless transaction");
          }
      
          return res.json();
    }
}
