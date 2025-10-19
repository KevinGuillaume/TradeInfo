require('dotenv').config({ debug: true }); // Enable dotenv debug
const express = require('express');
const cors = require('cors');
const AlchemyAPI = require('./apis/alchemy');

const app = express();
const PORT = 3005;

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


