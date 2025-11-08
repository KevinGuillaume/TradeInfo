// pages/SwapPage.tsx
import Swap from "../components/Swap";

export default function SwapPage() {
  return (
    <div className="flex items-center justify-center p-6">
      {/* Centered Glass Card */}
      <div className="w-full max-w-md">
        <div className="bg-gray-800/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
          {/* Optional Header */}
          <div className="px-8 pt-8 pb-4">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Gasless Swap
            </h1>
          </div>

          {/* Your Swap Component */}
          <div className="p-8 pt-4">
            <Swap />
          </div>
        </div>
      </div>
    </div>
  );
}