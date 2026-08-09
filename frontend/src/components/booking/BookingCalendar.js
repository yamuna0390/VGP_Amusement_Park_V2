"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function isoDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function BookingCalendar({ selectedDate, onSelectDate }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const todayStr = today();

  // First day of month, total days
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const monthName = new Date(viewYear, viewMonth).toLocaleString("en-IN", {
    month: "long",
  });

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Disable months before current
  const canGoPrev =
    viewYear > now.getFullYear() ||
    (viewYear === now.getFullYear() && viewMonth > now.getMonth());

  // Build cells array
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white border border-[#E6D7EA] rounded-[20px] shadow-[0_8px_24px_rgba(75,15,97,0.08)] p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="text-center pb-4 mb-4 border-b border-purple-50">
          <h2 className="text-[#4A216B] font-black text-lg tracking-wide uppercase">
            SELECT VISIT DATE
          </h2>
          <p className="text-gray-500 text-xs mt-1 font-semibold leading-relaxed">
            Open 365 days a year<br />from 10:00 AM to 6:00 PM
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4 px-1">
          <button
            type="button"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              canGoPrev
                ? "bg-purple-50 text-[#681B81] hover:bg-purple-100"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            onClick={prevMonth}
            disabled={!canGoPrev}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-extrabold text-[#681B81] text-sm tracking-wider">
            {monthName.toUpperCase()} {viewYear}
          </span>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-purple-50 text-[#681B81] hover:bg-purple-100 flex items-center justify-center transition-colors"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* DOW Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {DAYS.map((d) => (
            <span
              key={d}
              className={`text-[11px] font-extrabold ${
                d === "SUN" ? "text-red-500" : "text-gray-500"
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} className="w-full aspect-square" />;

            const dateStr = isoDate(viewYear, viewMonth, day);
            const isPast = dateStr < todayStr;
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === todayStr;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(dateStr)}
                className={`w-full aspect-square min-w-[36px] min-h-[36px] max-w-[44px] max-h-[44px] mx-auto rounded-[10px] text-xs font-bold transition-all flex items-center justify-center relative ${
                  isSelected
                    ? "bg-[#681B81] text-white shadow-md scale-105"
                    : isToday
                    ? "border-2 border-[#F5D400] text-gray-800 bg-white"
                    : isPast
                    ? "bg-gray-50 text-gray-300 border border-dashed border-gray-200 cursor-not-allowed"
                    : "bg-white border border-gray-100 text-gray-700 hover:border-purple-200 hover:bg-purple-50/50"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="pt-4 mt-4 border-t border-purple-50 flex items-center justify-center space-x-4 text-[11px] font-bold text-gray-600">
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded bg-[#681B81]" />
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded border-2 border-[#F5D400] bg-white" />
          <span>Today</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-3.5 h-3.5 rounded border border-dashed border-gray-300 bg-gray-50" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
