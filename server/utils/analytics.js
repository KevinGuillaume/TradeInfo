
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
  
  module.exports = {analyzeTokenMetrics}