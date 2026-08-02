"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Check } from "lucide-react";

const INTEREST_CATEGORIES = {
  Writing: [
    "Copywriting",
    "Blogging",
    "Storytelling",
    "Technical Writing",
    "Journaling",
  ],
  Fitness: ["Strength Training", "Running", "Yoga", "Mobility", "Nutrition"],
  "Public Speaking": [
    "Presentation Skills",
    "Storytelling on Stage",
    "Impromptu Speaking",
    "Voice Modulation",
  ],
  Productivity: [
    "Time Management",
    "Deep Work",
    "Habit Building",
    "Note Taking",
    "Task Systems",
  ],
  Cooking: [
    "Meal Prep",
    "Baking",
    "Healthy Recipes",
    "Knife Skills",
    "International Cuisine",
  ],
  Design: [
    "UI Design",
    "UX Research",
    "Visual Design",
    "Figma",
    "Design Systems",
  ],
  Coding: [
    "Web Development",
    "App Development",
    "AI / ML",
    "Backend",
    "DevOps",
    "Open Source",
  ],
  Finance: [
    "Personal Finance",
    "Investing",
    "Budgeting",
    "Crypto",
    "Financial Literacy",
  ],
  Mindfulness: ["Meditation", "Breathwork", "Journaling", "Stress Management"],
  Communication: [
    "Active Listening",
    "Writing Emails",
    "Difficult Conversations",
    "Storytelling",
  ],
  Leadership: [
    "Team Management",
    "Decision Making",
    "Mentoring",
    "Conflict Resolution",
  ],
  "Learning Languages": [
    "Spanish",
    "French",
    "Japanese",
    "German",
    "Speaking Practice",
  ],
};

const BASE_INTERESTS = Object.keys(INTEREST_CATEGORIES);

const GOALS = [
  "Build consistency",
  "Learn faster",
  "Improve focus",
  "Reduce stress",
  "Get better at my role",
  "Communicate more easily",
  "Develop a new habit",
  "Become more productive",
  "Grow confidence",
];

const LEVELS = [
  { value: "Beginner", color: "green" },
  { value: "Intermediate", color: "amber" },
  { value: "Expert", color: "rose" },
];

export default function OnboardingFlow() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [customInterest, setCustomInterest] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await axios.get("/api/profile");
        const profile = res.data.profile;
        if (profile) {
          setName(profile.name || "");
          setRole(profile.role || "");
          setLevel(profile.level || "Beginner");
          setSelectedInterests(
            Array.isArray(profile.interests) ? profile.interests : [],
          );
          setSelectedGoals(Array.isArray(profile.goals) ? profile.goals : []);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isLoaded, isSignedIn, router]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  };

  const addCustomInterest = () => {
    const value = customInterest.trim();
    if (value && !selectedInterests.includes(value)) {
      setSelectedInterests((prev) => [...prev, value]);
      setCustomInterest("");
    }
  };

  const addCustomGoal = () => {
    const value = customGoal.trim();
    if (value && !selectedGoals.includes(value)) {
      setSelectedGoals((prev) => [...prev, value]);
      setCustomGoal("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await axios.post("/api/profile", {
        name: name.trim(),
        role: role.trim(),
        level,
        interests: selectedInterests,
        goals: selectedGoals,
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-stone-500 font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="font-[poppins] text-3xl font-bold text-stone-800">
          {name ? (
            <>
              Hi <span className="text-orange-600">{name}</span>
            </>
          ) : (
            <>Welcome</>
          )}
        </h2>
        <p className="mt-2 text-stone-500">
          {name
            ? "Update your preferences anytime"
            : "Tell us a bit about yourself so we can personalize your skills"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Name + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Pavan"
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent text-sm transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1.5">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              placeholder="Student, Designer, Manager..."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent text-sm transition"
            />
          </div>
        </div>

        {/* Interests - Pills */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-3">
            Interests
          </label>

          {/* Base Interests */}
          <div className="flex flex-wrap gap-2 mb-4">
            {BASE_INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? "bg-orange-100 text-orange-800 ring-1 ring-orange-300"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {interest}
                </button>
              );
            })}

            {/* Custom interests that are not in any category */}
            {selectedInterests
              .filter(
                (i) =>
                  !BASE_INTERESTS.includes(i) &&
                  !Object.values(INTEREST_CATEGORIES).flat().includes(i),
              )
              .map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className="px-3.5 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800 ring-1 ring-orange-300"
                >
                  {interest} ×
                </button>
              ))}
          </div>

          {/* Sub-interests (shown only for selected base interests) */}
          {BASE_INTERESTS.filter((base) =>
            selectedInterests.includes(base),
          ).map((base) => (
            <div key={base} className="mb-5 pl-1">
              <p className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wide">
                {base} → related
              </p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_CATEGORIES[
                  base as keyof typeof INTEREST_CATEGORIES
                ].map((sub) => {
                  const isSelected = selectedInterests.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleInterest(sub)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-orange-50 text-orange-700 ring-1 ring-orange-200"
                          : "bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200"
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Custom interest input */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomInterest();
                }
              }}
              placeholder="Add your own interest..."
              className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="button"
              onClick={addCustomInterest}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-medium transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Goals - Vertical list */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-3">
            Goals
          </label>
          <div className="space-y-2 mb-4">
            {GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 ${
                    isSelected
                      ? "bg-amber-50 text-amber-900 ring-1 ring-amber-200"
                      : "bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isSelected
                        ? "bg-amber-500 text-white"
                        : "border-2 border-stone-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  {goal}
                </button>
              );
            })}

            {selectedGoals
              .filter((g) => !GOALS.includes(g))
              .map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm bg-amber-50 text-amber-900 ring-1 ring-amber-200"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                  {goal}
                </button>
              ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomGoal();
                }
              }}
              placeholder="Add your own goal..."
              className="flex-1 px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="button"
              onClick={addCustomGoal}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-medium transition"
            >
              Add
            </button>
          </div>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-3">
            Current Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {LEVELS.map((lvl) => {
              const isSelected = level === lvl.value;

              const colorClasses = {
                green: isSelected
                  ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100",
                amber: isSelected
                  ? "bg-amber-50 text-amber-800 ring-1 ring-amber-300"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100",
                rose: isSelected
                  ? "bg-rose-50 text-rose-800 ring-1 ring-rose-300"
                  : "bg-stone-50 text-stone-500 hover:bg-stone-100",
              };

              return (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setLevel(lvl.value)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    colorClasses[lvl.color as keyof typeof colorClasses]
                  }`}
                >
                  {lvl.value}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm font-medium text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          {saving ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
