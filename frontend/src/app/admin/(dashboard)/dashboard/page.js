"use client";

import {
  IndianRupee,
  Users,
} from "lucide-react";

import StatCard from "@/components/admin/Dashboard/StatCard";
import "./dashboard.css";
import RevenueChart from "@/components/admin/Dashboard/RevenueChart";
import VisitorsChart from "@/components/admin/Dashboard/VisitorsChart";

export default function DashboardPage() {
 return (
  <>
    <div className="dashboard-grid">

      <StatCard
        title="Revenue Today"
        value="₹1,25,000"
        subtitle="+8% from yesterday"
        color="#16a34a"
        icon={<IndianRupee size={30} />}
      />

      <StatCard
        title="Visitors Today"
        value="320"
        subtitle="Park Entry"
        color="#ea580c"
        icon={<Users size={30} />}
      />

    </div>

    <div className="dashboard-charts">
      <RevenueChart />
      <VisitorsChart />
    </div>
  </>
);
}