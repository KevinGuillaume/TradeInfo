// components/AppHeader.tsx
import { NavLink } from 'react-router-dom';
import ConnectWalletButton from './ConnectWalletButton';

export default function AppHeader() {
  return (
    <div className="w-full border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/70 sticky top-0 z-50 shadow-2xl">
      <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        
        {/* LEFT: Logo + Nav */}
        <div className="flex items-center gap-10">
  {/* Logo + Subtitle Group */}
  <div className="flex flex-col">
    {/* Main Title */}
    <NavLink
      to="/"
      className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-blue-300 transition-all duration-300 leading-none"
    >
      Rebalancer.fi
    </NavLink>

    {/* Subtitle - directly below, tight spacing */}
    <p className="text-gray-400 text-sm font-medium mt-1 leading-none">
      Analyze and optimze your wallet.
    </p>
  </div>
</div>

        {/* RIGHT: Wallet Button */}
        <div className="flex items-center">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
}