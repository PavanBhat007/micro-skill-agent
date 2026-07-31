"use client";

import { Skill } from "@/types/skill";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
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
      }

      setError("Something went wrong");
    } finally {
      setLoading(false);
      setError("");
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
      setError(String(error));
    } finally {
      setLoading(false);
      setError("");
    }
  };

  return (
    <div className="px-6 py-8">
      {!skill && (
        <button
          onClick={generateSkill}
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
            
            {!skill.completed ? (
              <span>
                <button
                  onClick={() => markAsCompleted(skill._id)}
                  disabled={loading}
                  className="cursor-pointer text-sm px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  {loading ? "..." : "Mark as Completed"}
                </button>
              </span>
            ) : (
              <span className="text-sm px-3 py-1 bg-green-500 text-white rounded">
                ✓ Completed
              </span>
            )}
            
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
