import ProfileSection from "../components/ProfileSection";
import Sentiment from "../components/Sentiment";
import Swap from "../components/Swap";


export default function HomeDEX() {


    return (
        <div className="flex flex-row min-h-screen">
          <div className="w-[30%] p-6">
            <div className="rounded-lg shadow-md h-full p-6">
              <Swap />
            </div>
          </div>
          <div className="w-[50%] p-6">
            <Sentiment />
          </div>
          <div className="w-[20%] p-6">
            <ProfileSection />
          </div>
        </div>
      );
}