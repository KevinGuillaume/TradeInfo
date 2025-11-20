import { API } from './api'
import { EtherscanAPI } from './etherscan'

const etherscanAPIKey = import.meta.env.VITE_ETHERSCAN_API_KEY
const etherscanBaseUrl = import.meta.env.VITE_ETHERSCAN_BASE_URL
const backendBaseUrl = import.meta.env.VITE_BACKEND_API_URL


// Create a singleton instance
export const etherscanAPI = new EtherscanAPI(etherscanAPIKey, etherscanBaseUrl)
export const backendAPI = new API(backendBaseUrl)

// Export types
export type { Transaction, TokenBalance, EtherscanResponse, WalletInfo } from './types'

// Export the class for custom instances
export { EtherscanAPI }
