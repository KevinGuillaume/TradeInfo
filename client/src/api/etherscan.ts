import type { Transaction, TokenBalance, EtherscanResponse, WalletInfo } from './types'
import { ethers } from 'ethers'

export class EtherscanAPI {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string = '', baseUrl: string = 'https://api.etherscan.io/api') {
    console.log('EtherscanAPI constructor', apiKey, baseUrl)
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  private async request<T>(params: Record<string, string>): Promise<EtherscanResponse<T>> {
    const url = new URL(this.baseUrl)
    Object.entries({ ...params, apikey: this.apiKey }).forEach(([key, value]) => {
      url.searchParams.append(key, value)
    })
    console.log(url.toString())
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }

  async validateAddress(address: string): Promise<boolean> {
    try {
      const response = await this.request<{ result: string }>({
        chainid: '1',
        module: 'account',
        action: 'balance',
        address: address,
        tag: 'latest'
      })
      return response.status === '1'
    } catch {
      return false
    }
  }

  async getAccountBalance(address: string): Promise<string> {
    const response = await this.request<string>({
      chainid: '1',
      module: 'account',
      action: 'balance',
      address: address,
      tag: 'latest'
    })
    // result is in wei so convert to ether
    return ethers.formatEther(response.result)
  }

  async getTokenBalances(address: string): Promise<TokenBalance[]> {
    const response = await this.request<TokenBalance[]>({
      chainid: '1',
      module: 'account',
      action: 'tokenlist',
      address: address
    })
    return response.result
  }

  async getTransactions(address: string, startBlock: number = 0, endBlock: number = 99999999, page: number = 1, offset: number = 100): Promise<Transaction[]> {
    const response = await this.request<Transaction[]>({
      chainid: '1',
      module: 'account',
      action: 'txlist',
      address: address,
      startblock: startBlock.toString(),
      endblock: endBlock.toString(),
      page: page.toString(),
      offset: offset.toString(),
      sort: 'desc'
    })
    return response.result
  }
  
  async getInternalTransactions(address: string, startBlock: number = 0, endBlock: number = 99999999, page: number = 1, offset: number = 100): Promise<Transaction[]> {
    const response = await this.request<Transaction[]>({
      chainid: '1',
      module: 'account',
      action: 'txlistinternal',
      address: address,
      startblock: startBlock.toString(),
      endblock: endBlock.toString(),
      page: page.toString(),
      offset: offset.toString(),
      sort: 'desc'
    })
    return response.result
  }

  async getWalletInfo(address: string): Promise<WalletInfo> {
    const [balance, transactions] = await Promise.all([
      this.getAccountBalance(address),
      this.getTransactions(address),
    ])

    return {
      address,
      balance,
      transactions
    }
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl
  }
}
