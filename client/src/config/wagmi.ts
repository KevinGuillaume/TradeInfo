import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'My Gasless DEX',
  projectId: import.meta.env.VITE_WALLETCONNECT_ID || 'YOUR_FALLBACK_ID',
  chains: [mainnet],
});