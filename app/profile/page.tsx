import { getDb } from "@/lib/mongodb";
import { calculateStreak } from "@/lib/streak";
import { Skill } from "@/types/skill";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Flame,
  Pencil,
  Target,
  Sparkles,
  UserCheck,
  Tag,
} from "lucide-react";
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

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div>
          <h2 className="font-[poppins] font-bold text-2xl sm:text-3xl text-stone-800 tracking-tight">
            User Profile
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Manage your learning trajectory, goals, and preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            title="Back to Home"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href="/onboarding"
            title="Edit Profile"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden divide-y divide-stone-100">
        {/* User Identity Header */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-stone-50/40">
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-[poppins] font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
              {getInitials(profile.name)}
            </div>

            <div>
              <h3 className="font-[poppins] text-2xl font-bold text-stone-800">
                {profile.name}
              </h3>
              <p className="text-stone-600 font-medium text-sm mt-0.5">
                {profile.role || "Learner"}
              </p>
            </div>
          </div>

          {/* User Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Level Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
                profile.level === "Beginner"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : profile.level === "Intermediate"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              {profile.level || "Beginner"}
            </span>

            {/* Streak Counter */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              {streak} Day{streak !== 1 ? "s" : ""} Streak
            </div>
          </div>
        </div>

        {/* Interests Section */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
            <Tag className="w-4 h-4 text-indigo-600" />
            <span>Interests & Focus Areas</span>
          </div>

          {profile.interests && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {profile.interests.map((interest: string) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-stone-100 border border-stone-200/80 text-stone-700 rounded-xl text-xs font-semibold"
                >
                  {interest}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">
              No interests specified yet. Click edit to customize.
            </p>
          )}
        </div>

        {/* Goals Section */}
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-stone-800 font-semibold text-sm">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Active Growth Goals</span>
          </div>

          {profile.goals && profile.goals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {profile.goals.map((goal: string) => (
                <div
                  key={goal}
                  className="flex items-start gap-2.5 p-3 bg-stone-50/60 border border-stone-200 rounded-xl"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-stone-700 leading-snug">
                    {goal}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 italic">
              No specific goals set yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
