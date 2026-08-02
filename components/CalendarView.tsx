"use client";

import { Skill } from "@/types/skill";
import axios from "axios";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillModalOpen, setSkillModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    const fetchSkillsForActiveMonth = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `/api/skills/months?year=${year}&month=${month + 1}`,
        );

        setSkills(res.data.skills || []);
      } catch (err) {
        console.error("Failed to fetch skills: ", err);
        setError("Failed to load skills for this month");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsForActiveMonth();
  }, [year, month]);

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const switchToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const switchToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getSkillForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    return skills ? skills.find((s) => s.date === dateStr) : null;
  };

  return (
    <div className="w-full space-y-4">
      {/* Calendar Card */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Month Navigation Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50/50">
          <button
            onClick={switchToPrevMonth}
            disabled={loading}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h3 className="font-[poppins] text-lg sm:text-xl text-stone-800 font-bold">
              {monthNames[month]} {year}
            </h3>
            {loading && (
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            )}
          </div>

          <button
            onClick={switchToNextMonth}
            disabled={loading}
            className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday Labels Header */}
        <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50 text-center">
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid Days */}
        <div className="grid grid-cols-7 divide-x divide-y divide-stone-100">
          {days.map((day, index) => {
            const skill = day ? getSkillForDay(day) : null;

            return (
              <div
                key={index}
                onClick={() => {
                  if (day && skill) {
                    setSelectedSkill(skill);
                    setSkillModalOpen(true);
                  }
                }}
                className={`min-h-16 sm:min-h-20 p-2 relative transition-all ${
                  day
                    ? skill
                      ? "hover:bg-indigo-50/50 cursor-pointer"
                      : "hover:bg-stone-50"
                    : "bg-stone-50/30"
                }`}
              >
                {day && (
                  <>
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                        isToday(day)
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-stone-700"
                      }`}
                    >
                      {day}
                    </div>

                    {/* Skill Indicator Badge */}
                    {skill && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            skill.completed ? "bg-emerald-600" : "bg-amber-500"
                          }`}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-medium rounded-xl">
          {error}
        </div>
      )}

      {/* Detail Modal */}
      {skillModalOpen && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setSelectedSkill(null);
              setSkillModalOpen(false);
            }}
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg bg-white border border-stone-200 rounded-2xl shadow-xl p-5 sm:p-6 z-10 space-y-4">
            {/* Header Tag and Close Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg">
                  {selectedSkill.category}
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {selectedSkill.date}
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedSkill(null);
                  setSkillModalOpen(false);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-xl font-[poppins] font-bold text-stone-800 mb-2">
                {selectedSkill.title}
              </h3>

              <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                {selectedSkill.description}
              </p>
            </div>

            {/* Completion Status Chip */}
            <div className="pt-2 border-t border-stone-100">
              {selectedSkill.completed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs font-semibold">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Not Completed
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
