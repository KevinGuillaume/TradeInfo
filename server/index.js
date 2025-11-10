require('dotenv').config({ debug: true }); // Enable dotenv debug
const express = require('express');
const cors = require('cors');
const AlchemyAPI = require('./apis/alchemy');
const ZeroXAPI = require('./apis/0x')
const Moralis = require("moralis").default
const axios = require('axios');
const OkuAPI = require('./apis/Oku');

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
      // optional filters
      excludeSpam: true,
    });

    // `response.raw` = plain JSON array of token objects
    const balances = response.raw.map(t => ({
      contractAddress: t.token_address,
      name: t.name,
      symbol: t.symbol,
      decimals: Number(t.decimals),
      balance: t.balance,              

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
 * 
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
  // ──────────────────────────────────────────────────────────────
//  Rebalance Suggestions – Moralis SDK version
// ──────────────────────────────────────────────────────────────
app.get('/api/rebalance-suggestions', async (req, res) => {
  try {
    const { userAddress } = req.query;
    if (!userAddress) return res.status(400).json({ error: 'userAddress required' });

    // ────── 1. Fetch Holdings via Moralis SDK (with USD prices) ──────
    console.log("Fetching token balances...");

    const tokenBalancesResponse = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: Moralis.EvmUtils.EvmChain.ETHEREUM,
      address: userAddress,
      excludeSpam: true,
    });

    const rawTokens = tokenBalancesResponse.raw;

    // Fetch USD price for each token
    const holdingsWithPrice = await Promise.all(
      rawTokens.map(async (t) => {
        let usdValue = 0;
        try {
          const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
            address: t.token_address,
          });
          const price = parseFloat(priceResponse.raw.usdPrice || '0');
          const balance = parseFloat(t.balance|| '0');
          usdValue = price * balance;
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

    // Filter out low-value and spam
    const holdings = holdingsWithPrice
      .filter((h) => h.usdValue > 50) // $50 min
      .sort((a, b) => b.usdValue - a.usdValue);

    const totalValue = holdings.reduce((sum, h) => sum + h.usdValue, 0);

    console.log(`Found ${holdings.length} holdings worth $${totalValue.toFixed(2)}`);

    // ────── 2. Fetch Top Pools from Icarus Tools (GET, no body) ──────
    const icarusData = await OkuApi.getTopPools();
    console.log("Index icarus: ", icarusData)
    if (!icarusData.result?.pools) {
      console.error('Unexpected Icarus response:', icarusData);
      throw new Error('Invalid response from Icarus Tools');
    }

    // ────── 3. Map & Compute APY ──────
    const poolsWithApy = icarusData.result.pools
      .filter((p) => p.tvl_usd > 100_000 && p.total_fees_usd > 0)
      .map((p) => {
        const apy = ((p.total_fees_usd / p.tvl_usd) * 365 * 100).toFixed(2) + '%';

        return {
          id: p.address,
          token0: {
            address: p.t0.toLowerCase(),
            symbol: p.t0_symbol,
            name: p.t0_name,
          },
          token1: {
            address: p.t1.toLowerCase(),
            symbol: p.t1_symbol,
            name: p.t1_name,
          },
          fee: p.fee, // e.g., 3000 = 0.3%
          tvl_usd: p.tvl_usd,
          total_fees_usd: p.total_fees_usd,
          volume_usd: p.t0_volume_usd + p.t1_volume_usd,
          apy,
          risk: p.tvl_usd > 5_000_000 ? 'Low' : p.tvl_usd > 1_000_000 ? 'Medium' : 'High',
        };
      });

    console.log(`Fetched ${poolsWithApy.length} high-yield pools`);

    // ────── 4. Generate LP Suggestions ──────
    const suggestions = [];

    holdings.forEach((h) => {
      const matches = poolsWithApy
        .filter((p) =>
          [p.token0.address, p.token1.address].includes(h.address)
        )
        .slice(0, 2); // Max 2 per token

      matches.forEach((pool) => {
        const amountUsd = Math.min(h.usdValue * 0.3, 5_000); // 30% or $5k max

        suggestions.push({
          type: 'lp',
          title: `Earn ${pool.apy} APY on ${pool.token0.symbol}/${pool.token1.symbol}`,
          description: `Add $${amountUsd.toFixed(0)} to this Uniswap v3 pool (TVL: $${pool.tvl_usd.toLocaleString()})`,
          action: {
            type: 'link',
            url: `https://oku.trade/uniswap/v3/pool/ethereum/${pool.id}`, // Works if pool is on Oku
          },
          apy: pool.apy,
          risk: pool.risk,
        });
      });
    });
    // ────── Optional: Add Swap/Stake/AI (from before) ──────
    // ... keep your existing swap, Yearn, AI logic ...

    // ────── Final Response ──────
    res.json({
      suggestions: suggestions.slice(0, 8),
      totalPortfolio: totalValue,
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