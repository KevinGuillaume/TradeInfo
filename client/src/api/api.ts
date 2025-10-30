interface GaslessQuoteParams {
    sellToken: string;
    buyToken: string;
    sellAmount: string; // 0x expects stringified BigInt
    taker: string;      // wallet address
    chainId: number;
    slippagePercentage: string; 
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
            const response = await fetch(this.baseURL + 
                `/api/gasless/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}&chainId=${chainId}&slippagePercentage=${slippagePercentage}`)
            const data = await response.json()
            return data
        } catch (err) {
            console.error("Error getting token prices for coin addresses")
        }
    }

    async submitGaslessTx(body: any ){
        console.log('Submitting trade:', JSON.stringify(body, null, 2))
        const res = await fetch(`${this.baseURL}/api/gasless/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            const error = new Error(
            `Failed to submit trade: ${err.message || res.statusText}`
            );
            (error as any).data = err;
            throw error;
        }

        return res.json();
    }

    async getPortfolioPnL(address: string, days = 7): Promise<any> {
        const res = await fetch(`${this.baseURL}/api/portfolio/pnl?address=${address}&days=${days}`);
        if (!res.ok) throw new Error('PnL fetch failed');
        return res.json();
    }
}
