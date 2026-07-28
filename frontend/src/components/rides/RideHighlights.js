import React from "react";
import { Users, Clock, Ruler, Zap, ShieldCheck } from "lucide-react";
import "./RideHighlights.css";

export default function RideHighlights({ rideInfo }) {
  if (!rideInfo) return null;

  const highlights = [
    {
      id: "category",
      label: "Family Ride",
      value: rideInfo.type || "Family Ride",
      icon: Users,
      color: "purple"
    },
    {
      id: "duration",
      label: "Duration",
      value: rideInfo.duration || "2-3 Mins",
      icon: Clock,
      color: "yellow"
    },
    {
      id: "minHeight",
      label: "Minimum Height",
      value: rideInfo.minHeight || "90 cm",
      icon: Ruler,
      color: "red"
    },
    {
      id: "thrillLevel",
      label: "Thrill Level",
      value: rideInfo.thrillLevel || "Medium",
      icon: Zap,
      color: "purple"
    },
    {
      id: "capacity",
      label: "Capacity",
      value: rideInfo.capacity || "24 Riders",
      icon: ShieldCheck,
      color: "green"
    }
  ];

  return (
    <div className="ride-highlights-wrapper">
      <div className="ride-highlights-card">
        {highlights.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="highlight-item">
              <div className={`highlight-icon-box ${item.color}`}>
                <IconComponent className="highlight-icon" size={24} />
              </div>
              <div className="highlight-text-content">
                <span className="highlight-label">{item.label}</span>
                <h4 className="highlight-value">{item.value}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
