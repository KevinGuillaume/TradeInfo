
function analyzeTokenMetrics(data) {
    const token = data;
    const signals = [];
  
    // ---- 1. Liquidity Momentum Signal ----
    const tvlGrowth30d = (token.tvl - token.tvl_30d) / token.tvl_30d;
    const priceGrowth30d = (token.price - token.price_30d) / token.price_30d;
  
    if (tvlGrowth30d > priceGrowth30d * 1.5) {
      signals.push({
        type: "Liquidity Momentum",
        message: "Bullish liquidity inflow — TVL growth outpacing price growth.",
        details: { tvlGrowth30d, priceGrowth30d }
      });
    }
  
    // ---- 2. Volume Divergence Signal ----
    const volumeDecayRatio = token.volume_24h / (token.volume_30d / 30);
    if (volumeDecayRatio < 0.5) {
      signals.push({
        type: "Volume Divergence",
        message: "Short-term trading volume cooling compared to monthly average.",
        details: { volumeDecayRatio }
      });
    }
  
    // ---- 3. Fee Efficiency Signal ----
    const feeEfficiency24h = token.fees_24h / token.volume_24h;
    const feeEfficiency30d = token.fees_30d / token.volume_30d;
    const efficiencyChange = (feeEfficiency24h - feeEfficiency30d) / feeEfficiency30d;
  
    if (efficiencyChange > 0.2) {
      signals.push({
        type: "Fee Efficiency",
        message: "Fee efficiency improving — protocol generating more revenue per dollar traded.",
        details: { efficiencyChange }
      });
    }
  
    // ---- 4. Price Momentum Signal ----
    const avgMomentum = (token.change_4h + token.change_24h + token.change_7d + token.change_30d) / 4;
    if (avgMomentum > 10) {
      signals.push({
        type: "Price Momentum",
        message: "Strong upward momentum detected across timeframes.",
        details: { avgMomentum }
      });
    } else if (avgMomentum < -10) {
      signals.push({
        type: "Price Momentum",
        message: "Strong downward momentum detected across timeframes.",
        details: { avgMomentum }
      });
    }
  
    // ---- 5. On-Chain Activity Signal ----
    const txPerTVL24h = token.tx_24h / token.tvl;
    const baselineTxPerTVL = (token.tx_30d / 30) / token.tvl_30d;
    const activityRatio = txPerTVL24h / baselineTxPerTVL;
  
    if (activityRatio < 0.5) {
      signals.push({
        type: "On-chain Activity",
        message: "Decreasing on-chain engagement — fewer transactions per unit of TVL.",
        details: { activityRatio }
      });
    } else if (activityRatio > 1.5) {
      signals.push({
        type: "On-chain Activity",
        message: "High on-chain activity — increasing user engagement relative to liquidity.",
        details: { activityRatio }
      });
    }
  
    return {
      token: token.symbol,
      name: token.name,
      price: token.price,
      signals
    };
  }
  

  function calculatePoolStats(pool) {
    const tvl = pool.tvl_usd;
    const fees24h = pool.total_fees_usd;
    const volume24h = pool.t0_volume_usd;
  
    return {
      address: pool.address,
      tokenOneName: pool.t0_name,
      tokenOneSymbol: pool.t0_symbol,
      tokenTwoName: pool.t1_name,
      tokenTwoSymbol: pool.t1_symbol,
      volume7d: pool.total_volume_7d_usd,
      apy7d: Number(((fees24h * 52) / tvl * 100).toFixed(2)),
      apy24h: Number(((fees24h * 365) / tvl * 100).toFixed(2)),
      feesPerMillion: Number((fees24h / (tvl / 1_000_000)).toFixed(0)),
      vTvlRatio: Number((volume24h / tvl).toFixed(2)),
      volumeGrowth7d: Number((pool.t0_volume_change_7d * 100).toFixed(1)),
      isStablePair: ['USDC', 'USDT', 'DAI'].includes(pool.t0_symbol) && ['USDC', 'USDT', 'DAI'].includes(pool.t1_symbol),
      isHighLiquidity: tvl > 5_000_000,
      opportunityScore: Math.min(100, 
        (fees24h * 52 / tvl * 100 > 20 ? 40 : 20) +
        (volume24h / tvl > 15 ? 30 : 15) +
        (tvl > 10_000_000 ? 30 : 10)
      )
    };
  };

  module.exports = {analyzeTokenMetrics, calculatePoolStats}