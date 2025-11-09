const ethers = require('ethers');


// Alchemy API class so we can just create a singleton in the main index file bc this is good 
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
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            if (body && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(body);
            }
            const response = await fetch(url.toString(), options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error data:', JSON.stringify(errorData, null, 2)); // Log full error
                throw new Object({
                    status: response.status,
                    message: errorData.message || 'Unknown error',
                    data: errorData,
                });
                }
            return await response.json();
        } catch (err) {
            console.log(err)
            throw err;
        }
    }
  
    async getTopPools() {
        console.log("Fetching top pools from Icarus Tools...");
        const icarusUrl = '/ethereum/cush/topPools?limit=50&orderBy=total_fees_usd_desc&minTvl=100000';
    
        const icarusRes = await this.request(icarusUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!icarusRes.ok) {
            const err = await icarusRes.text();
            console.error('Icarus HTTP Error:', icarusRes.status, err.slice(0, 200));
            throw new Error(`Icarus API error: ${icarusRes.status}`);
          }

        const icarusData = await icarusRes.json();

        return icarusData
    }

    async getTrendingPools() {
        console.log("Fetching trending pools from Icarus Tools...");
        const icarusUrl = '/ethereum/cush/trendingPools?limit=50&orderBy=total_fees_usd_desc&minTvl=100000';
    
        const icarusRes = await this.request(icarusUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!icarusRes.ok) {
            const err = await icarusRes.text();
            console.error('Icarus HTTP Error:', icarusRes.status, err.slice(0, 200));
            throw new Error(`Icarus API error: ${icarusRes.status}`);
          }

        const icarusData = await icarusRes.json();

        return icarusData
    }
  

}

module.exports = OkuAPI