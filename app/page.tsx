import SkillOfTheDaySection from "@/components/SkillOfTheDay";
import { getDb } from "@/lib/mongodb";
import { calculateStreak } from "@/lib/streak";
import { Skill } from "@/types/skill";
import { auth } from "@clerk/nextjs/server";
import { Flame, CheckCircle2, Zap, Circle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  let profile = null;
  let streak = 0;
  let skills: Skill[] = [];

  if (userId) {
    const db = await getDb();
    profile = await db.collection("users").findOne({ userId });

    if (!profile || profile.onboardingCompleted !== true) {
      redirect("/onboarding");
    }

    // Skill history & streak calculation
    skills = (await db
      .collection("skills")
      .find({ userId })
      .toArray()) as unknown as Skill[];
    streak = calculateStreak(skills);
  }

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const completedTotal = skills.filter((s) => s.completed).length;

  // --- Dynamic Weekly Calendar Calculation ---
  const today = new Date();
  // Get current day index (0 = Mon, 6 = Sun)
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;

  // Compute Monday of the current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDayIndex);

  // Generate 7 days for the current week starting from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    // Format to YYYY-MM-DD for easy lookup
    const formattedIso = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "narrow" });

    // Find if a skill exists for this date
    const matchingSkill = skills.find((s) => {
      if (!s.date) return false;
      // Normalizes date string (e.g. ISO string or "YYYY-MM-DD")
      const skillDateIso = new Date(s.date).toISOString().split("T")[0];
      return skillDateIso === formattedIso;
    });

    return {
      date: d,
      formattedIso,
      dayLabel,
      isToday: i === currentDayIndex,
      isPast: i < currentDayIndex,
      skill: matchingSkill || null,
    };
  });

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-6">
      {/* 1. Header Banner & Streak */}
      <div className="w-full bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-[poppins] text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
              {profile?.name ? (
                <>
                  Hi <span className="text-indigo-600">{profile.name}</span>
                </>
              ) : (
                "Welcome"
              )}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-stone-600">
              One small skill every day compounds to something big!
            </p>
          </div>

          {/* Streak Indicator (Amber = Streak Only) */}
          {userId && (
            <Link
              href="/calendar"
              title="View Calendar"
              className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 hover:bg-amber-100/60 border border-amber-200/80 rounded-xl transition-colors duration-200 self-start sm:self-auto"
            >
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <p className="text-xs text-amber-800 font-medium leading-none mb-1">
                  Current Streak
                </p>
                <p className="text-base font-bold text-amber-900 leading-none">
                  {streak} {streak === 1 ? "day" : "days"}
                </p>
              </div>
            </Link>
          )}
        </div>

        {/* 2. Dynamic Weekly Habit Tracker */}
        {userId && (
          <div className="mt-6 pt-5 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-3">
              <span>THIS WEEK'S PROGRESS</span>
              <span className="text-stone-700">
                {completedTotal} total{" "}
                {completedTotal === 1 ? "skill" : "skills"} completed
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((item, idx) => {
                const isCompleted = item.skill?.completed === true;
                const hasUncompletedSkill = item.skill && !item.skill.completed;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-semibold border transition-all ${
                      isCompleted
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : item.isToday
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700 ring-2 ring-indigo-100"
                          : hasUncompletedSkill
                            ? "bg-amber-50 border-amber-200 text-amber-700"
                            : "bg-stone-50 border-stone-200 text-stone-400"
                    }`}
                  >
                    <span className="mb-1 text-[10px] uppercase opacity-75">
                      {item.dayLabel}
                    </span>

                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : item.isToday ? (
                      <Zap className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Circle className="w-2 h-2 fill-stone-300 text-stone-300 my-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Skill of the Day Section */}
      <div className="w-full flex flex-col items-center">
        <div className="flex items-center gap-3 w-full mb-5">
          <div className="h-px flex-1 bg-stone-200" />
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            <h2 className="font-[poppins] text-xs sm:text-sm font-semibold text-indigo-900 tracking-wide uppercase">
              Skill of the Day &bull; {currentDateFormatted}
            </h2>
          </div>
          <div className="h-px flex-1 bg-stone-200" />
        </div>

        <div className="w-full">
          <SkillOfTheDaySection />
        </div>
      </div>
    </div>
  );
}
