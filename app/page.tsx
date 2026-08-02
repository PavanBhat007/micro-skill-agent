import SkillOfTheDaySection from "@/components/SkillOfTheDay";
import { getDb } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { Calendar, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    const db = await getDb();
    const profile = await db.collection("users").findOne({ userId });

    if (!profile || profile.onboardingCompleted !== true) {
      redirect("/onboarding")
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center justify-between w-full border-b border-orange-400 pb-2 bg-linear-to-t from-orange-100 via-white to-orange-50 p-6">
        <h2 className="font-[oswald] font-semibold text-3xl">
          SKILL of the Day
        </h2>

        <div className="flex items-center gap-2">
          <Link
            href="/calendar"
            className="p-2 rounded-full hover:bg-orange-100 transition-colors duration-300"
            title="View Calendar"
          >
            <Calendar className="w-6 h-6 text-orange-600" />
          </Link>
          <Link
            href="/profile"
            className="p-2 rounded-full hover:bg-orange-100 transition-colors duration-300"
            title="View Profile"
          >
            <User className="w-6 h-6 text-orange-600" />
          </Link>
        </div>
      </div>

      <SkillOfTheDaySection />
    </div>
  );
}
