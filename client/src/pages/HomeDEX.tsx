import ProfileSection from "../components/ProfileSection";
import Rebalancer from "../components/Rebalancer";
import Swap from "../components/Swap";


export default function HomeDEX() {
    return (
      <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Swap - 35% */}
      <div className="w-full lg:w-[35%] p-4 lg:p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl h-full p-6 border border-gray-700">
          <Swap />
        </div>
      </div>
      {/* Rebalancer - 40% (main content) */}
      <div className="w-full lg:w-[40%] p-4 lg:p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl h-full p-6 border border-gray-700 overflow-y-auto">
          <Rebalancer />
        </div>
      </div>
      {/* Profile - 25%*/}
      <div className="w-full lg:w-[25%] p-4 lg:p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl h-full p-6 border border-gray-700">
          <ProfileSection />
        </div>
      </div>
    </div>
      );
}