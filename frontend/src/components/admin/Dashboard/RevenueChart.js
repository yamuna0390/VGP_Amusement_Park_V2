"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import "./DashboardChart.css";

const data = [
  { day: "Mon", revenue: 95000 },
  { day: "Tue", revenue: 110000 },
  { day: "Wed", revenue: 102000 },
  { day: "Thu", revenue: 130000 },
  { day: "Fri", revenue: 145000 },
  { day: "Sat", revenue: 180000 },
  { day: "Sun", revenue: 210000 },
];

export default function RevenueChart() {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Revenue Overview</h3>
        <span>Last 7 Days</span>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#0d6efd"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}