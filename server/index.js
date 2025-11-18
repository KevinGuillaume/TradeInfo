require('dotenv').config({ debug: true }); // Enable dotenv debug
const express = require('express');
const cors = require('cors');
const AlchemyAPI = require('./apis/alchemy');
const ZeroXAPI = require('./apis/0x')
const Moralis = require("moralis").default
const axios = require('axios');
const OkuAPI = require('./apis/Oku');
const { analyzeTokenMetrics, calculatePoolStats } = require('./utils/analytics')


const app = express();
const PORT = 3005;

Moralis.start({
    apiKey: process.env.MORALIS_API_KEY
});
  


app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || 'unknown'}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const alchemyApi = new AlchemyAPI();
const OkuApi = new OkuAPI()
const zeroXApi = new ZeroXAPI();

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Get token balances
app.get('/api/token-balances/:address', async (req, res) => {
  console.log(`Fetching token balances for address: ${req.params.address}`);
  const { address } = req.params;
  console.log(`Fetching token balances for address: ${address}`);

  try {
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: Moralis.EvmUtils.EvmChain.ETHEREUM,
      address,
      excludeSpam: true,
    });

    const balances = response.raw.map(t => ({
      contractAddress: t.token_address,
      name: t.name,
      symbol: t.symbol,
      decimals: Number(t.decimals),
      balance: t.balance,
      logo: t.logo              

    }));

    res.json({ balances });
  } catch (err) {
    console.error(`Error fetching token balances for ${address}:`, err);
    res
      .status(500)
      .json({ error: 'Failed to fetch token balances', details: err.message });
  }
});


// Get account balance (ETH)
app.get('/api/account-balance/:address', async (req, res) => {
  const { address } = req.params;
  console.log(`Fetching native balance for address: ${address}`);

  try {
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      chain: Moralis.EvmUtils.EvmChain.ETHEREUM,
      address,
    });

    // `response.raw.balance` is a string in wei
    const balanceWei = response.raw.balance;
    const balanceEth = Number(balanceWei) / 1e18; // convert to ETH

    res.json({ balance: balanceEth.toFixed(6) });
  } catch (err) {
    console.error(`Error fetching native balance for ${address}:`, err);
    res
      .status(500)
      .json({ error: 'Failed to fetch native balance', details: err.message });
  }
});


app.get('/api/tokenPrice', async (req,res) => {
    const {query} = req

    const responseOne = await Moralis.EvmApi.token.getTokenPrice({
        address: query.addressOne
    })

    const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
        address: query.addressTwo
    })

    const usdPrices = {
        tokenOne: responseOne.raw.usdPrice,
        tokenTwo: responseTwo.raw.usdPrice,
        ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice
    }

    return res.status(200).json(usdPrices)
})


app.get('/api/gasless/price', async (req, res) => {
  const { sellToken, buyToken, chainId } = req.query;
  if (!sellToken || !buyToken || !chainId) {
      return res.status(400).json({ error: 'Missing required query parameters: sellToken, buyToken, chainId' });
  }
  console.log(`Fetching gasless price for sellToken: ${sellToken}, buyToken: ${buyToken}, chainId: ${chainId}`);
  try {
      const priceData = await zeroXApi.getGaslessPrice(sellToken, buyToken, chainId);
      res.json(priceData);
  } catch (err) {
      console.error(`Error fetching gasless price:`, err.message);
  }
});


/*****************
 * Swap related endpoints 
 *****************/
app.get('/api/gasless/quote', async (req, res) => {
  const { sellToken, buyToken, sellAmount, taker, chainId, slippagePercentage } = req.query;
  if (!sellToken || !buyToken || !sellAmount || !taker || !chainId || !slippagePercentage) {
      return res.status(400).json({ error: 'Missing required query parameters' });
  }
  console.log(`Fetching gasless quote for sellToken: ${sellToken}, buyToken: ${buyToken}, sellAmount: ${sellAmount}`);
  try {
      const quoteData = await zeroXApi.getGaslessQuote({
          sellToken,
          buyToken,
          sellAmount,
          taker,
          chainId,
          slippagePercentage,
      });
      res.json(quoteData);
  } catch (err) {
      console.error(`Error fetching gasless quote:`, err.message);
      res.status(500).json({ error: 'Failed to fetch gasless quote', details: err.message });
  }
});


app.post('/api/gasless/submit', async (req, res) => {
  const { trade, approval, chainId } = req.body;
  if (!trade || !chainId) {
    return res.status(400).json({ error: 'Missing required body parameters: trade, chainId' });
  }
  console.log('Submitting gasless transaction:', { trade, approval, chainId });
  try {
    const submitData = await zeroXApi.submitGaslessTx({ trade, approval, chainId });
    res.json(submitData);
  } catch (err) {
    console.error('Error submitting gasless transaction:', err.message);
    res.status(500).json({ error: 'Failed to submit gasless transaction', details: err.message });
  }
});


/*****************
 * Etc
 *****************/
app.get('/api/token-analytics', async (req, res) => {
  try {
    const { userAddress } = req.query;
    if (!userAddress) return res.status(400).json({ error: 'userAddress required' });

    // ────── 1. Fetch Holdings via Moralis SDK (with USD prices) ──────
    console.log("Fetching token balances...");
    const analytics = []
    const tokenBalancesResponse = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: Moralis.EvmUtils.EvmChain.ETHEREUM,
      address: userAddress,
      excludeSpam: true,
    });

    const rawTokens = tokenBalancesResponse.raw;

    // Fetch USD price for each token
    await Promise.all(
      rawTokens.map(async (t) => {
        let usdValue = 0;
        try {
          const icarusTokenData = await OkuApi.getTokenPrice(t.token_address);
          const price = parseFloat(icarusTokenData.price || '0')
          const balance = parseFloat(t.balance|| '0');
          usdValue = price * balance;

          const tokenAnalytics = analyzeTokenMetrics(icarusTokenData)
          analytics.push(tokenAnalytics)




        } catch (err) {
          console.warn(`Price fetch failed for ${t.symbol}:`, err);
        }


        return {
          address: t.token_address.toLowerCase(),
          symbol: t.symbol,
          name: t.name,
          usdValue,
          quantity: parseFloat(t.balance_formatted || '0'),
          decimals: t.decimals,
        };
      })
    );

    res.json({
      analytics: analytics,
      refreshedAt: new Date().toISOString(),
      source: 'Icarus Tools + Moralis',
    });
  } catch (error) {
    console.error('Rebalance error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.get('/api/nfts/:address', async (req, res) => {
  const { address } = req.params;
  try {
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: Moralis.EvmUtils.EvmChain.ETHEREUM,
      address,
      limit: 50,
    });
    res.json({ nfts: nfts.raw.result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});


app.get('/api/pool-analytics', async (req, res) => {
  const icarusData = await OkuApi.getTopPools();
  if (!icarusData.result?.pools) {
    console.error('Unexpected Icarus response:', icarusData);
    throw new Error('Invalid response from Icarus Tools');
  }
  const allPools = icarusData.result.pools
  //console.log("ALL ;POOLS: ", allPools)
  const poolAnalytics = await allPools.map(pool => 
    calculatePoolStats(pool)
  )
  res.json({
    pools: poolAnalytics
  })
})