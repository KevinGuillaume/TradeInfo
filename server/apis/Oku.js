const ethers = require('ethers');


// Oku API class so we can just create a singleton in the main index file bc this is good 
class OkuAPI {

    constructor(baseUrl = 'https://omni.icarus.tools') {
        console.log('Initializing Oku api with baseUrl:', baseUrl);
        this.baseUrl = `${baseUrl}`;
    }
  
    async request(endpoint, method = 'GET', params = {}, body = null) {
        try {
            const url = new URL(`${this.baseUrl}${endpoint}`);
            if (method === 'GET' && Object.keys(params).length) {
                url.search = new URLSearchParams(params).toString();
            }
    
            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
    
            if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
                options.body = JSON.stringify(body);
            }
    
            const response = await fetch(url.toString(), options);
    
            if (!response.ok) {
                let errorData = {};
                try { errorData = await response.json(); } catch {}
                throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
            }
    
            return await response.json();
        } catch (err) {
            console.error('OkuAPI request failed:', err);
            throw err;
        }
    }
  
    async getTopPools() {
        console.log("Fetching top pools from Icarus Tools...");
        const icarusUrl = '/ethereum/cush/topPools?limit=50&orderBy=total_fees_usd_desc&minTvl=100000';
        const icarusRes = await this.request(icarusUrl, 'GET');
        const icarusData = await icarusRes; // already JSON-parsed
        console.log("ICARUS TOP POOLS:", icarusData);
        return icarusData;
    }

    
    async getTrendingPools() {
        console.log("Fetching trending pools from Icarus Tools...");
        const icarusUrl = '/ethereum/cush/trendingPools?limit=50&orderBy=total_fees_usd_desc&minTvl=100000';
        const icarusRes = await this.request(icarusUrl, 'GET');
        const icarusData = await icarusRes;
        console.log("ICARUS TRENDING POOLS:", icarusData);
        return icarusData;
    }

    
    async getTokenPrice(address) {
        console.log("Fetching token price from Icarus Tools...");
        const icarusUrl = '/ethereum/cush/searchTokenByAddress?limit=50&orderBy=total_fees_usd_desc&minTvl=100000';
        const body = {
            params: [
              address,
              {
                result_size: 2,
                sort_by: "tvl",
                sort_order: false
              }
            ]
          };
        const icarusRes = await this.request(endpoint=icarusUrl, method='POST',body=body);
        const icarusData = await icarusRes;
        console.log("ICARUS TOKEN PRICE:", icarusData);
        return icarusData;
    }

    
    async getUserTokenBalances(address) {
        console.log("Fetching user token balances from Icarus Tools...");
        const icarusUrl = '/ethereum/cush/userTokenBalances';
        const body = {
            params: [
                address,
                16000000
              ]
          };
        const icarusRes = await this.request(endpoint=icarusUrl, method='POST',body=body);
        const icarusData = await icarusRes;
        console.log("ICARUS USER TOKEN BALANCES:", icarusData);
        return icarusData;
    }
}



module.exports = OkuAPI
