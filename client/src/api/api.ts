
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
}
