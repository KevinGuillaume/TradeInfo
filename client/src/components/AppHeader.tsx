// components/AppHeader.tsx
import { NavLink } from 'react-router-dom';
import ConnectWalletButton from './ConnectWalletButton';

export default function AppHeader() {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/swap', label: 'Swap' },
    { to: '/nfts', label: 'NFTs' },
    { to: '/predictions', label: 'Prediction' },
  ];

  return (
    <div className="w-full border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/70 sticky top-0 z-50 shadow-2xl">
      <div className="flex flex-row justify-between items-center px-6 py-5 max-w-7xl mx-auto">
        
        {/* Logo / Title */}
        <NavLink
          to="/"
          className="text-3xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-blue-300 transition-all duration-300"
        >
          Mononoke.fi
        </NavLink>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative text-lg font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Wallet Button */}
        <div className="flex items-center">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
}