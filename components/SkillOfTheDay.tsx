"use client";

import { GeneratedSkill } from "@/types/skill";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useState } from "react";

export default function SkillOfTheDaySection() {
  const { isSignedIn } = useAuth();

  const [skill, setSkill] = useState<GeneratedSkill | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getTodaySkill = async () => {
    if (!isSignedIn) {
      setError("Login to continue!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/generate-skill");

      const data = res.data;
      setSkill(data.skill);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("Failed to generate skill");
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
      setError("");
    }
  };

  return (
    <div className="px-6 py-8">
      {!skill && (
        <button
          onClick={getTodaySkill}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold px-6 py-2.5 rounded transition-colors"
        >
          {loading ? "Generating" : "Get Today's SKILL"}
        </button>
      )}

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {skill && (
        <div className="mt-6 p-6 bg-white border border-orange-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
              {skill.category}
            </span>
          </div>

          <h3 className="text-2xl font-[oswald] font-bold text-gray-900 mb-3">
            {skill.title}
          </h3>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {skill.description}
          </p>
        </div>
      )}
    </div>
  );
}
