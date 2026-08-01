"use client";

import { Skill } from "@/types/skill";
import axios from "axios";
import { Check, ChevronLeft, ChevronRight, Timer, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillModalOpen, setSkillModalOpen] = useState(
    selectedSkill ? true : false,
  );

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

        console.log(res.data);
        setSkills(res.data.skills || []);
      } catch (err) {
        console.error("Failed to fetch skills: ", err);
        setError("Failed to fetch skills!");
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

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  const switchToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const switchToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const days: (number | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null); // null for days before starting day
  }

  // after startingDayOfWeek, until end of month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getSkillForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return skills ? skills?.find((s) => s.date === dateStr) : null;
  };

  return (
    <div>
      {/* ===== Calendar ===== */}
      <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
          <button
            onClick={switchToPrevMonth}
            disabled={loading}
            className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5 text-orange-600" />
          </button>
          <h3 className="font-[oswald] text-xl text-gray-900 font-semibold">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={switchToNextMonth}
            disabled={loading}
            className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-300"
          >
            <ChevronRight className="w-5 h-5 text-orange-600" />
          </button>
        </div>
  
        {/* Weekday names */}
        <div className="grid grid-cols-7 border-b border-orange-100">
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-sm font-medium text-orange-700"
            >
              {day}
            </div>
          ))}
        </div>
  
        {/* Days grid */}
        <div className="grid grid-cols-7">
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
                className={`min-h-20 p-2 border-b border-r border-orange-50 relative ${
                  day
                    ? "hover:bg-orange-50 cursor-pointer transition-colors duration-300"
                    : ""
                }`}
              >
                {day && (
                  <>
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                        isToday(day)
                          ? "bg-orange-500 text-white font-semibold"
                          : "bg-white text-gray-800 font-medium"
                      }`}
                    >
                      {day}
                    </div>
  
                    {/* Dot - now correctly positioned inside the cell */}
                    {skill && (
                      <div
                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full ${
                          skill.completed ? "bg-green-500" : "bg-orange-400"
                        }`}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="my-2 text-red-600 font-semibold italic">{error}</p>}
  
      {/* ===== Modal ===== */}
      {skillModalOpen && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setSelectedSkill(null);
              setSkillModalOpen(false);
            }}
          />
  
          {/* Modal content */}
          <div className="relative w-full max-w-lg bg-white border border-orange-200 rounded-xl shadow-xl p-6 z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium px-3 py-1 bg-orange-100 text-orange-700 rounded-full">
                  {selectedSkill.category}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedSkill.date}
                </span>
              </div>
  
              <button
                onClick={() => {
                  setSelectedSkill(null);
                  setSkillModalOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-orange-50 transition-colors"
              >
                <X className="w-5 h-5 text-orange-500" />
              </button>
            </div>
  
            {/* Body */}
            <h3 className="text-2xl font-[oswald] font-bold text-gray-900 mb-3">
              {selectedSkill.title}
            </h3>
  
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-5">
              {selectedSkill.description}
            </p>
  
            {/* Status */}
            <div>
              {selectedSkill.completed ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm text-green-800 font-medium">
                  <Check className="w-4 h-4" />
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-sm text-orange-700 font-medium">
                  <Timer className="w-4 h-4" />
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
