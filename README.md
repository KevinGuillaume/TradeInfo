# Rebalancer.fi
Instantly connects to your wallet with the `rainbowkit` library which lets users use multiple wallets. It shows you exactly how every token you own is performing: rising or fading momentum, sudden volume spikes, whale accumulation patterns, and on-chain activity trends, all distilled into simple, signals and no non-sense summaries. I made this as a way to really understand your tokens and how they are behaving. 
Another goal was to try and remove the mystery from liquidity pools. Instead of cryptic charts and confusing gain/loss charts, you get straightforward rankings and one-glance cards that highlight real 7-day yield, true fees generated per $1M of liquidity, volume-to-TVL efficiency, growth momentum, and overall opportunity score which you can dive into a bit more on these calcs in `/server/utils/analytics.js`. Stable-coin pairs are clearly marked for low-IL safety, while high-conviction volatile pools are flagged when the risk-reward truly justifies the exposure. 

Going to be adding new features as I can as a way to make crypto as easy as possible for a retail investor! Wagmi.

## Tech Stack
This is what I used

### Frontend 
* Typescript w/ React
* Tailwind
* Axios
* Web3 librarys!

### Backend
* Node.js w/ express for the backend
* Bunch of api's to help
*   0x api - for gasless swapping
*   Moralis api - for some user functions and NFT rendering
*   Icarus/Oku api - big chunk of the work
*   


