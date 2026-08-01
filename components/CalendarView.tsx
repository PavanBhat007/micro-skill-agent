"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

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

  return (
    <div className="bg-white rounded-xl border border-orange-200 shadow-sm overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100">
        <button
          onClick={switchToPrevMonth}
          className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-300"
        >
          <ChevronLeft className="w-5 h-5 text-orange-600" />
        </button>

        <h3 className="font-[oswald] text-xl text-gray-900 font-semibold">
          {monthNames[month]} {year}
        </h3>

        <button
          onClick={switchToNextMonth}
          className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-300"
        >
          <ChevronRight className="w-5 h-5 text-orange-600" />
        </button>
      </div>

      {/* Weekday Name row */}
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
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-20 p-2 border-b border-r text-orange-50 ${day ? "hover:bg-orange-50 cursor-pointer transition-colors duration-300" : ""}`}
          >
            {day && (
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${isToday(day) ? "bg-orange-500 text-white font-semibold" : "bg-white text-gray-800 font-medium"}`}
              >
                {day}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
