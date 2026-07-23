"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import "./DashboardChart.css";

const data = [
  { day: "Mon", visitors: 180 },
  { day: "Tue", visitors: 220 },
  { day: "Wed", visitors: 210 },
  { day: "Thu", visitors: 250 },
  { day: "Fri", visitors: 340 },
  { day: "Sat", visitors: 480 },
  { day: "Sun", visitors: 520 },
];

export default function VisitorsChart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Visitors Overview</h3>
        <span>Last 7 Days</span>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="visitors"
              fill="#f59e0b"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}