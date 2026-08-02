import CalendarView from "@/components/CalendarView";
import { getDb } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const { userId } = await auth();

  if (userId) {
    const db = await getDb();
    const profile = await db.collection("users").findOne({ userId });

    if (!profile || profile.onboardingCompleted !== true) {
      redirect("/onboarding");
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div>
          <h2 className="font-[poppins] font-bold text-2xl sm:text-3xl text-stone-800 tracking-tight">
            Skill Calendar
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Track your daily consistency and revisit past micro-skills.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>

      <CalendarView />
    </div>
  );
}
