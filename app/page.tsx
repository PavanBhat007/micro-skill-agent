import SkillOfTheDaySection from "@/components/SkillOfTheDay";
import UserProfile from "@/components/UserProfile";
import { Calendar } from "lucide-react";
import Link from "next/link";

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
        <div className="flex items-center justify-between w-full border-b border-orange-400 pb-2 bg-linear-to-t from-orange-100 via-white to-orange-50 p-6">
          <h2 className="font-[oswald] font-semibold text-3xl">
            SKILL of the Day
          </h2>

          <Link
            href="/calendar"
            className="p-2 rounded-full hover:bg-orange-100 transition-colors duration-300"
            title="View Calendar"
          >
            <Calendar className="w-6 h-6 text-orange-600" />
          </Link>
        </div>

        <SkillOfTheDaySection />
      </div>
    </div>
  );
}
