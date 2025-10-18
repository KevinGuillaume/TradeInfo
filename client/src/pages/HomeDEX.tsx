import ProfileSection from "../components/ProfileSection";


export default function HomeDEX() {


    return (
        <div className="flex flex-row min-h-screen bg-gray-100">
          <div className="w-[70%] p-6">
            <div className="bg-white rounded-lg shadow-md h-full p-6">
              Container for the swap portion
            </div>
          </div>
          <div className="w-[30%] p-6">
            <ProfileSection />
          </div>
        </div>
      );
}