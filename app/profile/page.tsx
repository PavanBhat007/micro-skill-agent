import { getDb } from "@/lib/mongodb";
import { calculateStreak } from "@/lib/streak";
import { Skill } from "@/types/skill";
import { auth } from "@clerk/nextjs/server";
import { Flame, Home, PencilSparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const db = await getDb();
  const profile = await db.collection("users").findOne({ userId });
  if (!profile || profile.onboardingCompleted !== true) {
    redirect("/onboarding");
  }

  const skills = (await db
    .collection("skills")
    .find({ userId })
    .toArray()) as unknown as Skill[];
  const streak = calculateStreak(skills);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-[oswald] text-2xl font-bold text-stone-800">
          Your Profile
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            title="Go Home"
            className="p-2 rounded-full hover:bg-stone-100 transition-colors duration-300"
          >
            <Home className="w-5 h-5 text-stone-500" />
          </Link>
          <Link
            href="/onboarding"
            title="Edit Profile"
            className="p-2 rounded-full hover:bg-stone-100 transition-colors duration-300"
          >
            <PencilSparkles className="w-5 h-5 text-stone-500" />
          </Link>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-linear-to-r from-stone-50 to-white">
          <h2 className="font-[oswald] text-2xl font-bold text-stone-800">
            {profile.name}
          </h2>
          <p className="text-stone-500 mt-1">{profile.role}</p>

          <div className="flex items-center gap-3 mt-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${profile.level === "Beginner" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : profile.level === "Intermediate" ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200" : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"}`}
            >
              {profile.level}
            </span>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium ring-1 ring-orange-100">
              <Flame className="w-3.5 h-3.5" />
              {streak} day{streak !== 1 ? "s" : ""} streak
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-stone-100">
          <h3 className="text-sm font-medium text-stone-500 mb-3">Interests</h3>
          {profile.interests && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string) => (
                <span key={interest} className="px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400">No Interests added yet</p>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-sm font-medium text-stone-500 mb-3">Goals</h3>
          {profile.goals && profile.goals.length > 0 ? (
            <ul className="space-y-2">
              {profile.goals.map((goal: string) => (
                <li key={goal} className="flex items-center gap-2 text-sm text-stone-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {goal}
                </li>
              ))}
            </ul>
          ): (
            <p className="text-sm text-stone-400">No Goals added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
