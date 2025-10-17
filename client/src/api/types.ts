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
  tokenName: string;
  tokenSymbol: string;
  balance: string;
  logo: string | null;
  decimals: string | number;
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
