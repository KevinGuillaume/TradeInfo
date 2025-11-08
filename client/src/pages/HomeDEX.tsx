import ProfileSection from "../components/ProfileSection";
import Rebalancer from "../components/Rebalancer";


export default function HomeDEX() {
    return (
      <div className="flex flex-col lg:flex-row ">
      {/* Rebalancer - 40% (main content) */}
      <div className="w-full lg:w-[60%] p-4 lg:p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl h-full p-6 border border-gray-700 overflow-y-auto">
          <Rebalancer />
        </div>
      </div>
      {/* Profile - 40%*/}
      <div className="w-full lg:w-[40%] p-4 lg:p-6">
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-2xl h-full p-6 border border-gray-700">
          <ProfileSection />
        </div>
      </div>
    </div>
      );
}