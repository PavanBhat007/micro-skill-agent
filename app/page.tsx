import SkillOfTheDaySection from "@/components/SkillOfTheDay";
import UserProfile from "@/components/UserProfile";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full border-b border-amber-300 shadow-sm shadow-amber-300">
        <h2 className="font-[oswald] font-semibold text-3xl w-full border-b border-orange-400 pb-2 bg-linear-to-t from-orange-100 via-white to-orange-50 p-6">
          User Profile
        </h2>

        <UserProfile />
      </div>

      <div className="w-full">
        <h2 className="font-[oswald] font-semibold text-3xl w-full border-b border-orange-400 pb-2 bg-linear-to-t from-orange-100 via-white to-orange-50 p-6">
          SKILL of the Day
        </h2>

        <SkillOfTheDaySection />
      </div>
    </div>
  );
}
