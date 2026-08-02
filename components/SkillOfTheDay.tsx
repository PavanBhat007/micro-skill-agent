"use client";

import { Skill } from "@/types/skill";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function SkillOfTheDaySection() {
  const { isSignedIn } = useAuth();

  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // fetch today's skill if already generated
  useEffect(() => {
    if (!isSignedIn) return;

    const fetchTodaysSkill = async () => {
      try {
        const res = await axios.get("/api/skills");
        const data = res.data;

        if (data.skill) {
          setSkill(data.skill);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          setSkill(null); // no skill generated yet for today
        } else {
          console.error("Error fetching skill: ", error);
          setError("Could not load today's skill");
        }
      }
    };

    fetchTodaysSkill();
  }, [isSignedIn]);

  const generateSkill = async () => {
    if (!isSignedIn) {
      setError("Login to continue!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/skills");

      const data = res.data;
      setSkill(data.skill);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("Failed to generate skill");
      } else {
        setError("Something went wrong");
      }
    }
    fontFinally: {
      setLoading(false);
    }
  };

  const markAsCompleted = async (id: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.patch(`/api/skills/${id}`);
      const data = res.data;
      setSkill(data.skill);
    } catch (error) {
      console.error("Error fetching skills: ", error)
      setError("Could not mark as completed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Empty State / CTA Button */}
      {!skill && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center shadow-xs">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-[poppins] font-bold text-lg text-stone-800 mb-1">
            Ready for today&apos;s micro-skill?
          </h3>
          <p className="text-sm text-stone-600 mb-5 max-w-md mx-auto">
            Takes less than 5 minutes to learn and apply to your daily workflow.
          </p>

          <button
            onClick={generateSkill}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : isSignedIn ? (
              "Get Today's Skill"
            ) : (
              "Log In to Start"
            )}
          </button>
        </div>
      )}

      {/* Error Message Alert */}
      {error && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Active Skill Card */}
      {skill && (
        <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs transition-all">
          {/* Header Row: Category Badge & Completion Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg">
              {skill.category}
            </span>

            {!skill.completed ? (
              <button
                onClick={() => markAsCompleted(skill._id)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200 hover:border-emerald-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                Mark as Completed
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Completed Today
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-[poppins] font-bold text-stone-800 mb-3 tracking-tight">
            {skill.title}
          </h3>

          {/* Description */}
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {skill.description}
          </p>
        </div>
      )}
    </div>
  );
}
