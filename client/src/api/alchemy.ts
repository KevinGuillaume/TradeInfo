import { ethers } from 'ethers';
import type { TokenBalance } from './types'; 

interface AlchemyResponse<T> {
  jsonrpc: string;
  id: number;
  result: T;
  error?: { code: number; message: string };
}

interface TokenBalanceResponse {
  address: string;
  tokenBalances: { contractAddress: string; tokenBalance: string }[];
}

interface TokenMetadata {
  name: string | null;
  symbol: string | null;
  logo: string | null;
  decimals: number | null;
}

export class AlchemyAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = '', baseUrl: string = 'https://eth-mainnet.g.alchemy.com/v2') {
    console.log('AlchemyAPI constructor', apiKey, baseUrl);
    this.apiKey = apiKey;
    this.baseUrl = `${baseUrl}/${apiKey}`;
  }

  private async request<T>(method: string, params: any[]): Promise<T> {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AlchemyResponse<T> = await response.json();
    if (data.error) {
      throw new Error(`Alchemy error: ${data.error.message} (code: ${data.error.code})`);
    }

    return data.result;
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      const balance = await this.request<string>('eth_getBalance', [address, 'latest']);
      return !!balance; // Valid if balance query succeeds
    } catch {
      return false;
    }
  }

  async getAccountBalance(address: string): Promise<string> {
    const balance = await this.request<string>('eth_getBalance', [address, 'latest']);
    return ethers.formatEther(balance);
  }

  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    const response = await this.request<TokenBalanceResponse>('alchemy_getTokenBalances', [
      address,
      'erc20', // Fetch all ERC-20 tokens
    ]);

    const balances: TokenBalance[] = [];
    for (const token of response.tokenBalances.filter((t) => BigInt(t.tokenBalance) > 0)) {
      try {
        const metadata = await this.request<TokenMetadata>('alchemy_getTokenMetadata', [
          token.contractAddress,
        ]);
        balances.push({
            contractAddress: token.contractAddress,
            tokenName: metadata.name || 'Unknown',
            tokenSymbol: metadata.symbol || 'Unknown',
            balance: token.tokenBalance,
            decimals: metadata.decimals || 18,
            logo: metadata.logo
        });
      } catch (err) {
        console.error(`Error fetching metadata for ${token.contractAddress}:`, err);
      }
    }

    return balances;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.baseUrl = `${this.baseUrl.split('/v2')[0]}/v2/${apiKey}`;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = `${baseUrl}/${this.apiKey}`;
  }
}