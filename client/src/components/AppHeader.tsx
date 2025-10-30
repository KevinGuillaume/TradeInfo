import ConnectWalletButton from './ConnectWalletButton';

export default function AppHeader() {
  return (
    <div className="w-full border-b border-gray-800 shadow-lg">
  <div className="flex flex-row justify-between items-center px-6 py-4 max-w-7xl mx-auto md:px-8 lg:px-12">
    <div className="text-2xl font-bold text-white tracking-wide hover:text-blue-400 transition-colors duration-200">
      Gasless Portfolio
    </div>
    <div>
      <ConnectWalletButton />
    </div>
  </div>
</div>
  )
}


