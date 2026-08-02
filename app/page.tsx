import SkillOfTheDaySection from "@/components/SkillOfTheDay";
import { getDb } from "@/lib/mongodb";
import { calculateStreak } from "@/lib/streak";
import { Skill } from "@/types/skill";
import { auth } from "@clerk/nextjs/server";
import { Calendar, Flame, User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  let profile = null;
  let streak = 0;

  if (userId) {
    const db = await getDb();
    profile = await db.collection("users").findOne({ userId });

    if (!profile || profile.onboardingCompleted !== true) {
      redirect("/onboarding");
    }

    // streak calculation
    const skills = (await db
      .collection("skills")
      .find({ userId })
      .toArray()) as unknown as Skill[];
    streak = calculateStreak(skills);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full px-6 py-10 border-b border-stone-200 bg-linear-to-b from-stone-50 to-white">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Headline */}
          <div>
            <h2 className="font-[oswald] text-3xl font-bold text-stone-800">
              {profile?.name ? (
                <>
                  Hi <span className="text-orange-600">{profile.name}</span>
                </>
              ) : (
                "Welcome"
              )}
            </h2>

            <p className="mt-1 text-stone-500">
              One small skill every day compounds to something big!
            </p>
          </div>

          {/* Streak */}
          {userId && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-100 rounded-2xl">
              <Flame className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-xs text-orange-600 font-medium">
                  Current Streak
                </p>
                <p className="text-lg font-bold text-orange-700 leading-none">
                  {streak} {streak === 1 ? "day" : "days"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skill of the day */}
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
          <h2 className="font-[oswald] text-2xl font-semibold text-stone-800">
            Skill of the Day
          </h2>

          <Link
            href="/calendar"
            title="View Calendar"
            className="p-2 rounded-full hover:bg-stone-100 transition-colors duration-300"
          >
            <Calendar className="w-5 h-5 text-stone-500" />
          </Link>
        </div>

        <SkillOfTheDaySection />
      </div>
    </div>
  );
}
