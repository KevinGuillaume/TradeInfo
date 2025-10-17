import { AlchemyAPI } from './alchemy'
import { EtherscanAPI } from './etherscan'

const etherscanAPIKey = import.meta.env.VITE_ETHERSCAN_API_KEY
const etherscanBaseUrl = import.meta.env.VITE_ETHERSCAN_BASE_URL
const alchemyAPIkey = import.meta.env.VITE_ALCHEMY_API_KEY
const alchemyBaseUrl = import.meta.env.VITE_ALCHEMY_BASE_URL


// Create a singleton instance
export const etherscanAPI = new EtherscanAPI(etherscanAPIKey, etherscanBaseUrl)
export const alchemyAPI = new AlchemyAPI(alchemyAPIkey,alchemyBaseUrl)

// Export types
export type { Transaction, TokenBalance, EtherscanResponse, WalletInfo } from './types'

// Export the class for custom instances
export { EtherscanAPI }
