"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const INTERESTS = [
  "Writing",
  "Fitness",
  "Public Speaking",
  "Productivity",
  "Cooking",
  "Design",
  "Coding",
  "Finance",
  "Mindfulness",
  "Communication",
  "Leadership",
  "Learning Languages",
];

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

const LEVELS = ["Beginner", "Intermediate", "Expert"];

export default function OnboardingFlow() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [customInterest, setCustomInterest] = useState("");
  const [customGoal, setCustomGoal] = useState("");

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // load existing profile -> UPDATE
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
        console.error("Failed to load profile: ", err);
        setError("Failed to load profile");
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
      const payload = {
        name: name.trim(),
        role: role.trim(),
        level: level.trim(),
        interests: selectedInterests,
        goals: selectedGoals,
      };

      await axios.post("/api/profile", payload);
      router.push("/");
    } catch (err) {
      console.error("Error saving profile: ", err);
      setError("Failed to save profile. Please try again!");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-orange-600 font-medium">Loading ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="font-[oswald] text-3xl font-bold text-gray-900">
          {name ? (
            <p>
              Hi <span className="text-orange-600 leading-tight">{name}</span>!
              Let&apos;s update your profile
            </p>
          ) : (
            <p>
              <span className="text-orange-600 leading-tight">Welcome! </span>
              Let&apos;s get to know you
            </p>
          )}
        </h2>
        <p className="mt-2 text-gray-600">
          This helps us personalize your daily micro skills!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Pavan"
            className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            placeholder="Role at current company, If not working, input the role you are targetting for"
            className="w-full px-4 py-2.5 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pick your Interests
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {INTERESTS.map((interest) => {
              const isSelected = selectedInterests.includes(interest);

              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`w-fit cursor-pointer px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${isSelected ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-700 border border-orange-200 hover:border-orange-100"}`}
                >
                  {interest}
                </button>
              );
            })}

            {selectedInterests
              .filter((i) => !INTERESTS.includes(i))
              .map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className="w-fit px-3.5 py-1.5 rounded-full text-sm font-medium bg-orange-500 text-white italic cursor-pointer"
                >
                  {interest}
                </button>
              ))}
          </div>

          <div className="flex gap-2 mt-4">
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
              placeholder="Add your own interest not listed above ..."
              className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
            />

            <button
              type="button"
              onClick={addCustomInterest}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium text-sm hover:bg-orange-200 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Choose your Goals
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            {GOALS.map((goal) => {
              const isSelected = selectedGoals.includes(goal);

              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`w-fit cursor-pointer px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${isSelected ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-700 border border-orange-200 hover:border-orange-100"}`}
                >
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
                  className="w-fit cursor-pointer px-3.5 py-1.5 rounded-full text-sm font-medium bg-orange-500 text-white italic"
                >
                  {goal}
                </button>
              ))}
          </div>

          <div className="flex gap-2 mt-4">
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
              placeholder="Add your own goal not listed above ..."
              className="flex-1 px-4 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
            />

            <button
              type="button"
              onClick={addCustomGoal}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium text-sm hover:bg-orange-200 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Current Level
          </label>
          <div className="flex gap-3">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`cursor-pointer flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${level === lvl ? "bg-green-600 text-white font-semibold" : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"}`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-lg transition-colors duration-300"
        >
          {saving ? "Saving ... " : "Save & Continue"}
        </button>
      </form>
    </div>
  );
}
