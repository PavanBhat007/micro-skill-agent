"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Sparkles,
  UserCheck,
  Target,
  Tag,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Loader2,
  CheckCircle2,
  Briefcase,
} from "lucide-react";

const SUGGESTED_INTERESTS = [
  "Web Development",
  "React & Next.js",
  "UI/UX Design",
  "System Architecture",
  "TypeScript",
  "AI & Machine Learning",
  "DevOps",
  "Data Science",
];

const EXPERIENCE_LEVELS = [
  {
    id: "Beginner",
    title: "Beginner",
    desc: "Starting fresh or looking to build strong fundamentals.",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "Intermediate",
    title: "Intermediate",
    desc: "Have core knowledge and want to expand skill depth.",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    id: "Advanced",
    title: "Advanced",
    desc: "Experienced developer aiming to master complex concepts.",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [error, setError] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [goals, setGoals] = useState<string[]>([""]);

  // Fetch existing user profile on mount (for edit profile or pre-filling onboarding)
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setFetchingProfile(true);
        const response = await axios.get("/api/profile");
        const data = response.data.profile;

        if (data) {
          if (data.name) setName(data.name);
          if (data.role) setRole(data.role);
          if (data.level) setLevel(data.level);
          if (Array.isArray(data.interests) && data.interests.length > 0) {
            setInterests(data.interests);
          }
          if (Array.isArray(data.goals) && data.goals.length > 0) {
            setGoals(data.goals);
          }
        }
      } catch (err) {
        // If 404 or uninitialized profile, ignore error and let user complete onboarding fresh
        console.info("No prior profile data found or user is new.", err);
      } finally {
        setFetchingProfile(false);
      }
    }

    loadUserProfile();
  }, []);

  // Dynamic Interest Handlers
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const addCustomInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setInterests([...interests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  // Dynamic Goals Handlers
  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = value;
    setGoals(updatedGoals);
  };

  const addGoalInput = () => {
    if (goals.length < 5) {
      setGoals([...goals, ""]);
    }
  };

  const removeGoalInput = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      const cleanedGoals = goals.filter((g) => g.trim() !== "");

      // Send update/save request to the profile endpoint
      await axios.post("/api/profile", {
        name,
        role,
        level,
        interests,
        goals: cleanedGoals,
        onboardingCompleted: true,
      });

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Profile submission error:", err);
      setError("Failed to save your preferences. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="w-full max-w-3xl mx-auto p-12 flex flex-col items-center justify-center gap-3 text-stone-500">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">
          Loading your profile preferences...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-semibold text-indigo-900 tracking-wide uppercase">
              Personalize Your Journey
            </span>
          </div>
          <h2 className="font-[poppins] font-bold text-2xl sm:text-3xl text-stone-800 tracking-tight">
            Welcome
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Set up your profile to customize daily skills tailored to your
            targets.
          </p>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-stone-50 border border-stone-200 p-1.5 rounded-xl">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                step === i
                  ? "bg-indigo-600 text-white shadow-xs"
                  : step > i
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-stone-400"
              }`}
            >
              {step > i ? <CheckCircle2 className="w-4 h-4" /> : i}
            </div>
          ))}
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Step 1: Basic Identity & Experience */}
        {step === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="font-[poppins] text-xl font-bold text-stone-800">
                1. Tell us about yourself
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Basic details to identify you and tailor skill recommendations.
              </p>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Current Role / Profession
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Full Stack Developer, Student, Designer"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Skill Experience Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <div
                      key={lvl.id}
                      onClick={() => setLevel(lvl.id)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                        level === lvl.id
                          ? "bg-indigo-50/40 border-indigo-300 ring-2 ring-indigo-100"
                          : "bg-stone-50/40 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      <div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border mb-2 ${lvl.badgeClass}`}
                        >
                          {lvl.title}
                        </span>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {lvl.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="button"
                disabled={!name.trim()}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Next: Focus Areas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Interests & Focus Areas */}
        {step === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="font-[poppins] text-xl font-bold text-stone-800">
                2. Select Interests & Focus Areas
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Choose topic tags that match what you want to learn each day.
              </p>
            </div>

            {/* Suggested Tags */}
            <div className="space-y-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-indigo-600" />
                Suggested Topics
              </label>

              <div className="flex flex-wrap gap-2">
                {SUGGESTED_INTERESTS.map((item) => {
                  const active = interests.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleInterest(item)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200/70"
                      }`}
                    >
                      {item} {active ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Tag Input */}
            <form onSubmit={addCustomInterest} className="space-y-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Add Custom Topic Tag
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  placeholder="e.g. Next.js App Router"
                  className="flex-1 px-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
                <button
                  type="submit"
                  disabled={!customInterest.trim()}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Add Tag
                </button>
              </div>
            </form>

            {/* Active Selected Tags */}
            {interests.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-medium text-stone-500 mb-2">
                  Selected Tags ({interests.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-semibold"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className="p-0.5 hover:bg-indigo-100 rounded-md transition-colors"
                      >
                        <X className="w-3 h-3 text-indigo-600" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <span>Next: Growth Goals</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Active Growth Goals & Submit */}
        {step === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-100 pb-4">
              <h3 className="font-[poppins] text-xl font-bold text-stone-800">
                3. Active Growth Goals
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                What are your main objectives for the next few months?
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 text-emerald-600" />
                  Your Objectives
                </label>
                <span className="text-xs text-stone-400">
                  {goals.length}/5 max goals
                </span>
              </div>

              {goals.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Sparkles className="w-4 h-4 text-indigo-600 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      placeholder={`Goal #${index + 1} (e.g. Master React Server Components)`}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  {goals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGoalInput(index)}
                      className="p-2.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {goals.length < 5 && (
                <button
                  type="button"
                  onClick={addGoalInput}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 pt-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add another goal</span>
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl">
                {error}
              </div>
            )}

            {/* Step 3 Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                disabled={loading}
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={loading || !name.trim()}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Complete Setup</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
