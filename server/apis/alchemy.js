const ethers = require('ethers');


// Alchemy API class so we can just create a singleton in the main index file bc this is good 
class AlchemyAPI {

    constructor(apiKey = process.env.ALCHEMY_API_KEY, baseUrl = 'https://eth-mainnet.g.alchemy.com/v2') {
        console.log('Initializing AlchemyAPI with baseUrl:', baseUrl);
        this.apiKey = apiKey;
        this.baseUrl = `${baseUrl}/${apiKey}`;
    }
  
    async request(method, params, retries = 3) {
      try {
        const response = await fetch(this.baseUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method,
            params,
          }),
        });
        if (response.status === 429 && retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return this.request(method, params, retries - 1);
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(`Alchemy error: ${data.error.message} (code: ${data.error.code})`);
        }
        return data.result;
      } catch (err) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return this.request(method, params, retries - 1);
        }
        throw err;
      }
    }
  
    async getAccountBalance(address) {
      const balance = await this.request('eth_getBalance', [address, 'latest']);
      return ethers.formatEther(balance);
    }
  
    async getTokenBalances(address) {
        const response = await this.request('alchemy_getTokenBalances', [
            address,
            'erc20', // Fetch all ERC-20 tokens
          ]);
      
          const balances = [];
          for (const token of response.tokenBalances.filter((t) => BigInt(t.tokenBalance) > 0)) {
            try {
              const metadata = await this.request('alchemy_getTokenMetadata', [
                token.contractAddress,
              ]);
              if (metadata.name && metadata.symbol && ( !metadata.name.includes(".") && !metadata.symbol.includes("."))) { // Only add things with values
                  balances.push({
                      contractAddress: token.contractAddress,
                      tokenName: metadata.name || 'Unknown',
                      tokenSymbol: metadata.symbol || 'Unknown',
                      balance: token.tokenBalance,
                      decimals: metadata.decimals || 18,
                      logo: metadata.logo
                  });
              }
            } catch (err) {
              console.error(`Error fetching metadata for ${token.contractAddress}:`, err);
            }
          }
      
          return balances;
    }
}

module.exports = AlchemyAPI