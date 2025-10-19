
export class API {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL
    }

    async getTokenBalances(address: string) {
        try {
            const response = await fetch(this.baseURL + `/api/token-balances/${address}`)
            return response
          } catch (err) {
            console.error('Error getting token balances', err);
        }
    }

    async getAccountBalance(address: string) {
        try {
            const response = await fetch(this.baseURL + `/api/account-balance/${address}`)
            return response
          } catch (err) {
            console.error('Error getting token balances', err);
        }
    }
}
