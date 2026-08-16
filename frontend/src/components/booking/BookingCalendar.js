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
    <div className="bg-[#FFFCF9] border border-[#F5D400]/40 rounded-[24px] shadow-sm p-6 flex flex-col justify-between h-full round-padding">
      <div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-8 px-2">
          <button
            type="button"
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
              canGoPrev
                ? "bg-[#681B81] text-white border-2 border-[#F5D400] hover:bg-[#4B0F61] shadow-sm"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed"
            }`}
            onClick={prevMonth}
            disabled={!canGoPrev}
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <span className="font-black text-[#4A216B] text-[22px] sm:text-[28px] tracking-widest uppercase">
            {monthName} {viewYear}
          </span>

          <button
            type="button"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#681B81] text-white border-2 border-[#F5D400] hover:bg-[#4B0F61] shadow-sm flex items-center justify-center transition-all"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* DOW Grid */}
        <div className="grid grid-cols-7 gap-1 text-center mb-4">
          {DAYS.map((d) => (
            <span
              key={d}
              className={`text-[13px] sm:text-[14px] font-black tracking-wide ${
                d === "SUN" ? "text-red-600" : "text-[#5C4B64]"
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Day Cells Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
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
                className={`w-full aspect-square max-w-[56px] mx-auto rounded-[12px] sm:rounded-[16px] text-sm sm:text-lg font-black transition-all flex items-center justify-center relative shadow-sm ${
                  isSelected
                    ? "bg-[#E53E3E] border-2 border-[#C53030] text-white shadow-md scale-105 z-10"
                    : isToday
                    ? "bg-white border-[3px] border-[#681B81] text-[#681B81]"
                    : isPast
                    ? "bg-[#F9FAFB] border border-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed opacity-70 shadow-none"
                    : "bg-[#FFFDF5] border border-[#F5D400]/50 text-[#681B81] hover:bg-[#FEF5C8] hover:border-[#F5D400]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="pt-6 mt-8 border-t border-[#F5D400]/30 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] font-black text-[#5C4B64] uppercase tracking-wide">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-md bg-[#FFFDF5] border border-[#F5D400]/50" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-md bg-[#E53E3E] border-2 border-[#C53030]" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-md bg-[#F9FAFB] border border-[#E5E7EB]" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
