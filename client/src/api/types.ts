export interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  timeStamp: string
  isError: string
  methodId: string
  functionName: string
}

export interface TokenBalance {
  contractAddress: string;
  value_usd: number,
  name: string;
  symbol: string;
  balance: number;
  logo?: string | null;
  decimals: number;
}

export interface EtherscanResponse<T> {
  status: string
  message: string
  result: T
}

export interface WalletInfo {
  address: string
  ensName?: string
  balance: string
  transactions: Transaction[]
}
