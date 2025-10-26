require('dotenv').config({ debug: true }); // Enable dotenv debug
const express = require('express');
const cors = require('cors');
const AlchemyAPI = require('./apis/alchemy');
const ZeroXAPI = require('./apis/0x')
const Moralis = require("moralis").default
const axios = require('axios');

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
const zeroXApi = new ZeroXAPI();

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Get token balances
app.get('/api/token-balances/:address', async (req, res) => {
  console.log(`Fetching token balances for address: ${req.params.address}`);
  try {
    const balances = await alchemyApi.getTokenBalances(req.params.address);
    console.log('Token balances response:', balances);
    res.json(balances);
  } catch (err) {
    console.error(`Error fetching token balances for ${req.params.address}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch token balances', details: err.message });
  }
});

// Get account balance (ETH)
app.get('/api/account-balance/:address', async (req, res) => {
  console.log(`Fetching account balance for address: ${req.params.address}`);
  try {
    const balance = await alchemyApi.getAccountBalance(req.params.address);
    console.log('Account balance response:', balance);
    res.json({ balance });
  } catch (err) {
    console.error(`Error fetching account balance for ${req.params.address}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch account balance', details: err.message });
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
      console.log('Gasless price response:', priceData);
      res.json(priceData);
  } catch (err) {
      console.error(`Error fetching gasless price:`, err.message);
  }
});


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
      console.log('Gasless quote response:', quoteData);
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
    console.log('Gasless submit response:', submitData);
    res.json(submitData);
  } catch (err) {
    console.error('Error submitting gasless transaction:', err.message);
    res.status(500).json({ error: 'Failed to submit gasless transaction', details: err.message });
  }
});
