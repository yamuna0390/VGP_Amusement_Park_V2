"use client";
import { useState } from "react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
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
    <div className="bk-cal">
      <div className="bk-cal__header">
        <button
          className="bk-cal__nav"
          onClick={prevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="bk-cal__title">
          {monthName.toUpperCase()} {viewYear}
        </span>
        <button
          className="bk-cal__nav"
          onClick={nextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="bk-cal__grid">
        {DAYS.map((d) => (
          <span key={d} className="bk-cal__dow">{d}</span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={`e${i}`} />;
          const dateStr = isoDate(viewYear, viewMonth, day);
          const isPast = dateStr < todayStr;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={dateStr}
              className={`bk-cal__day
                ${isSelected ? "bk-cal__day--sel" : ""}
                ${isPast ? "bk-cal__day--past" : ""}
                ${isToday && !isSelected ? "bk-cal__day--today" : ""}
              `}
              disabled={isPast}
              onClick={() => onSelectDate(dateStr)}
              aria-label={dateStr}
              aria-pressed={isSelected}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
