const ethers = require('ethers');


// 0x API class so we can just create a singleton in the main index file bc this is good 
class ZeroXAPI {
    constructor(apiKey = process.env.ZEROX_API_KEY, baseUrl = 'https://api.0x.org') {
        console.log('Initializing ZeroXAPI with baseUrl:', baseUrl);
        if (!apiKey) {
            throw new Error('0x API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    async request(endpoint, method = 'GET', params = {}, body = null, retries = 3) {
        try {
            const url = new URL(`${this.baseUrl}${endpoint}`);
            if (method === 'GET' && Object.keys(params).length) {
                url.search = new URLSearchParams(params).toString();
            }
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    '0x-api-key': this.apiKey,
                    "0x-version": "v2",
                },
            };
            if (body && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(body);
            }
            const response = await fetch(url.toString(), options);
            if (response.status === 429 && retries > 0) {
                console.log(`Rate limited, retrying after 1s... (${retries} retries left)`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return this.request(endpoint, method, params, body, retries - 1);
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
            }
            return await response.json();
        } catch (err) {
            if (retries > 0) {
                console.log(`Request failed, retrying... (${retries} retries left)`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return this.request(endpoint, method, params, body, retries - 1);
            }
            throw err;
        }
    }

    async getGaslessPrice(sellToken, buyToken, chainId) {
        return this.request('/gasless/price', 'GET', { sellToken, buyToken, chainId });
    }

    async getGaslessQuote(params) {
        return this.request('/gasless/quote', 'GET', params);
    }

    async submitGaslessTx(body) {
        return this.request('/gasless/submit', 'POST', {}, body);
    }
}

module.exports = ZeroXAPI;